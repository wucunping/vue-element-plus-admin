<script setup lang="ts">
/**
 * @file Qrcode.vue
 * @description 二维码组件，支持生成二维码和自定义logo。
 * @example <Qrcode text="Hello World!" width="300" :logo="'/path/to/logo.png'" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Qrcode
 */

/** 导入 PropType 类型，用于定义组件的 props 类型 */
import type { PropType } from 'vue'
/** 导入 Vue 相关的 API */
import { nextTick, ref, watch, computed, unref } from 'vue'
/** 导入QRCode库，用于生成二维码 */
import QRCode from 'qrcode'
/** 导入QRCode配置项相关类型 */
import type { QRCodeRenderersOptions } from 'qrcode'
/** 深拷贝库 */
import { cloneDeep } from 'lodash-es'
/** 导入属性类型验证工具 */
import { propTypes } from '@/utils/propTypes'
/** 导入自定义设计样式钩子 */
import { useDesign } from '@/hooks/web/useDesign'
/** 字符串判断工具 */
import { isString } from '@/utils/is'
/** 导入二维码logo类型 */
import type { QrcodeLogo } from '@/components/Qrcode'

/** 定义组件的 props */
const props = defineProps({
	/** 指定二维码的标签类型 */
	tag: propTypes.string.validate((v: string) => ['canvas', 'img'].includes(v)).def('canvas'),
	/** 二维码内容，可以是字符串或数组 */
	text: {
		type: [String, Array] as PropType<string | Recordable[]>,
		default: null
	},
	/** QRCode的生成配置项 */
	options: {
		type: Object as PropType<QRCodeRenderersOptions>,
		default: () => ({})
	},
	/** 二维码的宽度 */
	width: propTypes.number.def(200),
	/** 二维码的logo，支持字符串和对象 */
	logo: {
		type: [String, Object] as PropType<Partial<QrcodeLogo> | string>,
		default: ''
	},
	/** 控制二维码是否过期 */
	disabled: propTypes.bool.def(false),
	/** 过期提示文字 */
	disabledText: propTypes.string.def('')
})

/** 定义组件的事件 */
const emit = defineEmits(['done', 'click', 'disabled-click'])

/** 获取设计前缀的函数 */
const { getPrefixCls } = useDesign()

/** 获取二维码的CSS前缀 */
const prefixCls = getPrefixCls('qrcode')

/** QRCode库中的toCanvas和toDataURL方法 */
const { toCanvas, toDataURL } = QRCode

/** 控制二维码加载状态的ref */
const loading = ref(true)

/** 对插槽容器的引用 */
const wrapRef = ref<Nullable<HTMLCanvasElement | HTMLImageElement>>(null)

/** 将二维码内容转换为字符串 */
const renderText = computed(() => String(props.text))

/** 计算二维码的显示样式 */
const wrapStyle = computed(() => {
	return {
		width: props.width + 'px',
		height: props.width + 'px'
	}
})

/**
 * 初始化二维码生成
 * @returns {Promise<void>} Promise对象
 */
const initQrcode = async () => {
	await nextTick() // 等待下一个DOM更新循环
	const options = cloneDeep(props.options || {}) // 克隆options

	if (props.tag === 'canvas') {
		// 容错率配置
		options.errorCorrectionLevel =
			options.errorCorrectionLevel || getErrorCorrectionLevel(unref(renderText))
		const _width: number = await getOriginWidth(unref(renderText), options) // 获取原始二维码宽度
		options.scale = props.width === 0 ? undefined : (props.width / _width) * 4 // 计算缩放比例
		const canvasRef = (await toCanvas(
			unref(wrapRef) as HTMLCanvasElement,
			unref(renderText),
			options
		)) as unknown as HTMLCanvasElement

		// 如果有logo，执行logo生成
		if (props.logo) {
			const url = await createLogoCode(canvasRef) // 创建带logo的二维码
			emit('done', url) // 事件发射，返回结果
			loading.value = false // 更新加载状态
		} else {
			emit('done', canvasRef.toDataURL()) // 事件发射，返回结果
			loading.value = false // 更新加载状态
		}
	} else {
		// 处理img类型的二维码
		const url = await toDataURL(renderText.value, {
			errorCorrectionLevel: 'H',
			width: props.width,
			...options
		})
		;(unref(wrapRef) as HTMLImageElement).src = url // 设置img的src
		emit('done', url) // 事件发射，返回结果
		loading.value = false // 更新加载状态
	}
}

/** 监听renderText的变化 */
watch(
	() => renderText.value, // 监听依赖
	(val) => {
		if (!val) return // 如果没有值则返回
		initQrcode() // 初始化二维码
	},
	{
		deep: true, // 深度监听
		immediate: true // 立即执行
	}
)

/**
 * 创建带有logo的二维码
 * @param {HTMLCanvasElement} canvasRef - 生成的二维码canvas
 * @returns {Promise<string>} Promise对象，返回带logo的二维码数据URL
 */
const createLogoCode = (canvasRef: HTMLCanvasElement) => {
	const canvasWidth = canvasRef.width // 获取canvas宽度
	const logoOptions: QrcodeLogo = Object.assign(
		{
			logoSize: 0.15, // logo占二维码的比例
			bgColor: '#ffffff', // logo背景色
			borderSize: 0.05, // logo边框大小
			crossOrigin: 'anonymous', // 跨域设置
			borderRadius: 8, // 边框圆角
			logoRadius: 0 // logo圆角
		},
		isString(props.logo) ? {} : props.logo // 合并用户自定义logo的配置
	)
	const {
		logoSize = 0.15,
		bgColor = '#ffffff',
		borderSize = 0.05,
		crossOrigin = 'anonymous',
		borderRadius = 8,
		logoRadius = 0
	} = logoOptions

	const logoSrc = isString(props.logo) ? props.logo : props.logo.src // 获取logo的src
	const logoWidth = canvasWidth * logoSize // 计算logo的宽度
	const logoXY = (canvasWidth * (1 - logoSize)) / 2 // logo的坐标
	const logoBgWidth = canvasWidth * (logoSize + borderSize) // logo背景的宽度
	const logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2 // logo背景的坐标

	const ctx = canvasRef.getContext('2d') // 获取canvas的2d上下文
	if (!ctx) return // 如果获取失败则返回

	// 绘制logo底色
	canvasRoundRect(ctx)(logoBgXY, logoBgXY, logoBgWidth, logoBgWidth, borderRadius)
	ctx.fillStyle = bgColor // 设置底色
	ctx.fill() // 填充背景色

	const image = new Image() // 创建logo的image对象
	if (crossOrigin || logoRadius) {
		image.setAttribute('crossOrigin', crossOrigin) // 设置跨域属性
	}
	;(image as any).src = logoSrc // 设置logo的src

	// 使用image绘制以避免某些跨域情况
	const drawLogoWithImage = (image: HTMLImageElement) => {
		ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth) // 绘制logo
	}

	// 使用canvas绘制以获得更多的功能
	const drawLogoWithCanvas = (image: HTMLImageElement) => {
		const canvasImage = document.createElement('canvas') // 创建canvas用于绘制logo
		canvasImage.width = logoXY + logoWidth // 设置canvas宽度
		canvasImage.height = logoXY + logoWidth // 设置canvas高度
		const imageCanvas = canvasImage.getContext('2d') // 获取canvas的2D上下文
		if (!imageCanvas || !ctx) return // 无法获取上下文则返回
		imageCanvas.drawImage(image, logoXY, logoXY, logoWidth, logoWidth) // 将logo绘制到临时canvas上

		// 绘制带有logo的圆角
		canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius)
		if (!ctx) return
		const fillStyle = ctx.createPattern(canvasImage, 'no-repeat') // 创建填充样式
		if (fillStyle) {
			ctx.fillStyle = fillStyle // 设置填充样式
			ctx.fill() // 填充
		}
	}

	// 返回带logo二维码的Promise
	return new Promise((resolve: any) => {
		// logo加载完成后绘制logo
		image.onload = () => {
			if (logoRadius) drawLogoWithCanvas(image)
			else drawLogoWithImage(image)
			// logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image) // 判断绘制方式
			resolve(canvasRef.toDataURL()) // 返回canvas的dataURL
		}
	})
}

/**
 * 获取二维码的原始宽度
 * @param {string} content - 二维码内容
 * @param {QRCodeRenderersOptions} options - 配置选项
 * @returns {Promise<number>} Promise对象，返回原宽度
 */
const getOriginWidth = async (content: string, options: QRCodeRenderersOptions) => {
	const _canvas = document.createElement('canvas') // 创建临时canvas
	await toCanvas(_canvas, content, options) // 将二维码绘制到canvas上
	return _canvas.width // 返回宽度
}

/**
 * 根据内容长度获取容错等级
 * @param {string} content - 二维码内容
 * @returns {string} 容错等级
 */
const getErrorCorrectionLevel = (content: string) => {
	if (content.length > 36) {
		return 'M' // 容错率等级
	} else if (content.length > 16) {
		return 'Q' // 容错率等级
	} else {
		return 'H' // 容错率等级
	}
}

/**
 * 绘制带圆角的矩形
 * @param {CanvasRenderingContext2D} ctx - canvas的2D上下文
 * @returns {(x: number, y: number, w: number, h: number, r: number) => CanvasRenderingContext2D} 返回canvas上下文
 */
const canvasRoundRect = (ctx: CanvasRenderingContext2D) => {
	return (x: number, y: number, w: number, h: number, r: number) => {
		const minSize = Math.min(w, h) // 获取最小尺寸
		if (r > minSize / 2) {
			r = minSize / 2 // 限制圆角半径
		}
		ctx.beginPath() // 开始绘制
		ctx.moveTo(x + r, y) // 移动到起点
		ctx.arcTo(x + w, y, x + w, y + h, r) // 绘制弧线
		ctx.arcTo(x + w, y + h, x, y + h, r) // 绘制弧线
		ctx.arcTo(x, y + h, x, y, r) // 绘制弧线
		ctx.arcTo(x, y, x + w, y, r) // 绘制弧线
		ctx.closePath() // 结束绘制
		return ctx // 返回上下文
	}
}

/** 点击二维码时触发的事件 */
const clickCode = () => {
	emit('click') // 发射click事件
}

/** 点击禁用区域时触发的事件 */
const disabledClick = () => {
	emit('disabled-click') // 发射disabled-click事件
}
</script>

<template>
	<!-- 显示加载状态的div -->
	<div v-loading="loading" :class="[prefixCls, 'relative inline-block']" :style="wrapStyle">
		<!-- 动态组件，根据tag属性选择canvas或img -->
		<component :is="tag" ref="wrapRef" @click="clickCode" />
		<!-- 如果禁用，显示禁用提示 @click="disabledClick"=点击禁用区域的事件 -->
		<div
			v-if="disabled"
			:class="`${prefixCls}--disabled`"
			class="absolute top-0 left-0 flex w-full h-full items-center justify-center"
			@click="disabledClick"
		>
			<div class="absolute top-[50%] left-[50%] font-bold">
				<Icon icon="vi-ep:refresh-right" :size="30" color="var(--el-color-primary)" />
				<div>{{ disabledText }}</div>
				<!-- 禁用提示文本 -->
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
/** 定义CSS命名空间 */
@prefix-cls: ~'@{adminNamespace}-qrcode';

.@{prefix-cls} {
	/** 禁用状态样式 */
	&--disabled {
		background: rgb(255 255 255 / 95%); // 半透明背景

		& > div {
			transform: translate(-50%, -50%); // 中心对齐
		}
	}
}
</style>
