<script setup lang="ts">
/**
 * @file ImageCropping.vue
 * @description 图像裁剪组件
 * @example <ImageCropping imageUrl="your-image-url" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ImageCropping
 */

// 导入设计相关的钩子
import { useDesign } from '@/hooks/web/useDesign'

// 导入 Vue 的核心功能
import { nextTick, unref, ref, watch, onBeforeUnmount, onMounted, computed } from 'vue'

// 导入 Cropper.js 库
import Cropper from 'cropperjs'

// 导入 Cropper.js 的样式
import 'cropperjs/dist/cropper.min.css'

// 导入 Element Plus 中的类型和组件
import type { UploadFile } from 'element-plus'
import { ElDivider, ElUpload, ElMessage, ElTooltip } from 'element-plus'

// 导入 VueUse 库中的防抖函数
import { useDebounceFn } from '@vueuse/core'

// 导入自定义按钮组件
import { BaseButton } from '@/components/Button'

// 获取组件前缀类名的函数
const { getPrefixCls } = useDesign()

// 组件的前缀类名
const prefixCls = getPrefixCls('image-cropping')

// 定义组件的 props
const props = defineProps({
	imageUrl: {
		type: String,
		default: '',
		required: true // 必填，图片 URL
	},
	cropBoxWidth: {
		type: Number,
		default: 200 // 裁剪框的宽度
	},
	cropBoxHeight: {
		type: Number,
		default: 200 // 裁剪框的高度
	},
	boxWidth: {
		type: [Number, String],
		default: 425 // 组件外框的宽度
	},
	boxHeight: {
		type: [Number, String],
		default: 320 // 组件外框的高度
	},
	showResult: {
		type: Boolean,
		default: true // 是否显示裁剪结果
	},
	showActions: {
		type: Boolean,
		default: true // 是否显示操作按钮
	}
})

// 获取图片的 Base64 格式
const getBase64 = useDebounceFn(() => {
	imgBase64.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? '' // 防抖获取裁剪后的 Base64
}, 80)

// 重置裁剪框
const resetCropBox = () => {
	const containerData = unref(cropperRef)?.getContainerData() // 获取容器数据
	unref(cropperRef)?.setCropBoxData({
		width: props.cropBoxWidth, // 设置裁剪框的宽度
		height: props.cropBoxHeight, // 设置裁剪框的高度
		left: (containerData?.width || 0) / 2 - 100, // 设置裁剪框左侧位置
		top: (containerData?.height || 0) / 2 - 100 // 设置裁剪框顶部位置
	})
	imgBase64.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? '' // 更新 Base64
}

// 计算组件外框的样式
const getBoxStyle = computed(() => {
	return {
		width: `${props.boxWidth}px`, // 设置外框宽度
		height: `${props.boxHeight}px` // 设置外框高度
	}
})

// 计算裁剪框的样式
const getCropBoxStyle = computed(() => {
	return {
		width: `${props.cropBoxWidth}px`, // 设置裁剪框宽度
		height: `${props.cropBoxHeight}px` // 设置裁剪框高度
	}
})

// 获取缩放倍数对应的宽高
const getScaleSize = (scale: number) => {
	return {
		width: props.cropBoxWidth * scale + 'px', // 根据缩放倍数计算宽度
		height: props.cropBoxHeight * scale + 'px' // 根据缩放倍数计算高度
	}
}

// 存储图像的 Base64 格式
const imgBase64 = ref('')

// 引用图像 DOM 元素
const imgRef = ref<HTMLImageElement>()

// 引用 Cropper 实例
const cropperRef = ref<Cropper>()

// 初始化裁剪器
const intiCropper = () => {
	if (!unref(imgRef)) return // 如果图像元素不存在则返回
	const imgEl = unref(imgRef)! // 获取图像元素
	cropperRef.value = new Cropper(imgEl, {
		aspectRatio: 1, // 设置裁剪框的宽高比
		viewMode: 1, // 设置视图模式
		dragMode: 'move', // 设置拖动模式
		toggleDragModeOnDblclick: false, // 双击不切换拖动模式
		checkCrossOrigin: false, // 不检查跨域
		ready() {
			resetCropBox() // 准备好后重置裁剪框
		},
		cropmove() {
			getBase64() // 裁剪时获取 Base64
		},
		zoom() {
			getBase64() // 缩放时获取 Base64
		},
		crop() {
			getBase64() // 裁剪完成时获取 Base64
		}
	})
}

// 上传文件改变事件处理函数
const uploadChange = (uploadFile: UploadFile) => {
	// 判断上传的文件是否为图片
	if (uploadFile?.raw?.type.indexOf('image') === -1) {
		ElMessage.error('请上传图片格式的文件') // 提示用户上传图片格式
		return
	}
	if (!uploadFile.raw) return // 如果没有原始文件返回
	// 获取图片的访问地址
	const url = URL.createObjectURL(uploadFile.raw) // 创建 URL
	unref(cropperRef)?.replace(url) // 替换裁剪器中的图像
}

// 重置裁剪器
const reset = () => {
	unref(cropperRef)?.reset() // 调用裁剪器的重置方法
}

// 旋转裁剪器
const rotate = (deg: number) => {
	unref(cropperRef)?.rotate(deg) // 调用裁剪器的旋转方法
}

// 水平缩放值
const scaleX = ref(1)
// 垂直缩放值
const scaleY = ref(1)

// 缩放处理函数
const scale = (type: 'scaleX' | 'scaleY') => {
	if (type === 'scaleX') {
		scaleX.value = scaleX.value === 1 ? -1 : 1 // 水平翻转
		unref(cropperRef)?.[type](unref(scaleX)) // 调用裁剪器的缩放方法
	} else {
		scaleY.value = scaleY.value === 1 ? -1 : 1 // 垂直翻转
		unref(cropperRef)?.[type](unref(scaleY)) // 调用裁剪器的缩放方法
	}
}

// 放大裁剪器
const zoom = (num: number) => {
	unref(cropperRef)?.zoom(num) // 调用裁剪器的缩放方法
}

// 组件挂载生命周期钩子
onMounted(() => {
	intiCropper() // 初始化裁剪器
})

// 监听 imageUrl 的变化
watch(
	() => props.imageUrl,
	async (url) => {
		if (url) {
			unref(cropperRef)?.replace(url) // 替换裁剪器中的图像
			await nextTick() // 等待下一次 DOM 更新
			resetCropBox() // 重置裁剪框
		}
	}
)

// 组件卸载生命周期钩子
onBeforeUnmount(() => {
	unref(cropperRef)?.destroy() // 销毁裁剪器实例
})

// 向外暴露裁剪器实例
defineExpose({
	cropperExpose: cropperRef
})

/*
<div
		:class="{
			[prefixCls]: true, // 应用组件的前缀类名
			'flex items-center': showResult // 如果显示结果，应用对应的样式
		}"
	>
		<div>
			<div :style="getBoxStyle" class="flex justify-center items-center">
				<img
					v-show="imageUrl" // 控制图像的显示与隐藏
					ref="imgRef" // 绑定 DOM 引用
					:src="imageUrl" // 图像的源 URL
					class="block max-w-full" // 设置图像样式
					crossorigin="anonymous" // 设置跨域
					alt="" // 替代文本
					srcset=""
				/>
			</div>
			<div v-if="showActions" class="mt-10px flex items-center">
				<div class="flex items-center">
					<ElTooltip content="选择文件" placement="bottom">
						<ElUpload
							action="''" // 上传的 action，此处为空
							accept="image/*" // 只接受图片格式
							:auto-upload="false" // 不自动上传
							:show-file-list="false" // 不显示文件列表
							:on-change="uploadChange" // 上传变化的事件处理
						>
							<BaseButton size="small" type="primary" class="mt-2px"
								><Icon icon="vi-ep:upload-filled"
							/></BaseButton>
						</ElUpload>
					</ElTooltip>
				</div>
*/
</script>

<template>
	<div
		:class="{
			[prefixCls]: true,
			'flex items-center': showResult
		}"
	>
		<div>
			<div :style="getBoxStyle" class="flex justify-center items-center">
				<img
					v-show="imageUrl"
					ref="imgRef"
					:src="imageUrl"
					class="block max-w-full"
					crossorigin="anonymous"
					alt=""
					srcset=""
				/>
			</div>
			<div v-if="showActions" class="mt-10px flex items-center">
				<div class="flex items-center">
					<ElTooltip content="选择文件" placement="bottom">
						<ElUpload
							action="''"
							accept="image/*"
							:auto-upload="false"
							:show-file-list="false"
							:on-change="uploadChange"
						>
							<BaseButton size="small" type="primary" class="mt-2px"
								><Icon icon="vi-ep:upload-filled"
							/></BaseButton>
						</ElUpload>
					</ElTooltip>
				</div>
				<div class="flex items-center justify-end flex-1">
					<ElTooltip content="重置" placement="bottom">
						<BaseButton size="small" type="primary" @click="reset"
							><Icon icon="vi-ep:refresh"
						/></BaseButton>
					</ElTooltip>
					<ElTooltip content="逆时针旋转" placement="bottom">
						<BaseButton size="small" type="primary" @click="rotate(-45)"
							><Icon icon="vi-ant-design:rotate-left-outlined"
						/></BaseButton>
					</ElTooltip>
					<ElTooltip content="顺时针旋转" placement="bottom">
						<BaseButton size="small" type="primary" @click="rotate(45)"
							><Icon icon="vi-ant-design:rotate-right-outlined"
						/></BaseButton>
					</ElTooltip>
					<ElTooltip content="水平翻转" placement="bottom">
						<BaseButton size="small" type="primary" @click="scale('scaleX')"
							><Icon icon="vi-vaadin:arrows-long-h"
						/></BaseButton>
					</ElTooltip>
					<ElTooltip content="垂直翻转" placement="bottom">
						<BaseButton size="small" type="primary" @click="scale('scaleY')"
							><Icon icon="vi-vaadin:arrows-long-v"
						/></BaseButton>
					</ElTooltip>
					<ElTooltip content="放大" placement="bottom">
						<BaseButton size="small" type="primary" @click="zoom(0.1)"
							><Icon icon="vi-ant-design:zoom-in-outlined"
						/></BaseButton>
					</ElTooltip>
					<ElTooltip content="缩小" placement="bottom">
						<BaseButton size="small" type="primary" @click="zoom(-0.1)"
							><Icon icon="vi-ant-design:zoom-out-outlined"
						/></BaseButton>
					</ElTooltip>
				</div>
			</div>
		</div>
		<div v-if="imgBase64 && showResult" class="ml-20px">
			<div class="flex justify-center items-center">
				<img :src="imgBase64" class="rounded-[50%]" :style="getCropBoxStyle" />
				<!-- 显示裁剪后的图像 -->
			</div>
			<ElDivider />
			<!-- 分隔线 -->
			<div class="flex justify-center items-center">
				<img :src="imgBase64" class="rounded-[50%]" :style="getScaleSize(0.2)" />
				<!-- 显示缩小的裁剪图像 -->
				<img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.25)" />
				<!-- 显示缩小的裁剪图像 -->
				<img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.3)" />
				<!-- 显示缩小的裁剪图像 -->
				<img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.35)" />
				<!-- 显示缩小的裁剪图像 -->
			</div>
		</div>
	</div>
</template>
