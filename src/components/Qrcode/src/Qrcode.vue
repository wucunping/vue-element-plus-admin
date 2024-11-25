<script setup lang="ts">
/**
 * @file /src/components/Qrcode/src/Qrcode.vue
 * @description Qrcode 组件，用于生成二维码，支持嵌入 Logo、自定义大小、样式和配置项
 * @example 使用方式：
 * <Qrcode
 *   :text="'https://example.com'"
 *   :width="200"
 *   :logo="'logo.png'"
 *   :options="{ errorCorrectionLevel: 'H' }"
 *   @done="handleDone"
 *   @click="handleClick"
 * />
 * @version 1.0.0
 * @date 2024-11-22
 * @module QrcodeComponentModule
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 Vue 引入工具和类型，用于响应式数据、组件属性定义和生命周期管理
import { PropType, nextTick, ref, watch, computed, unref } from 'vue'

// 引入 qrcode.js 库，用于生成二维码
import QRCode from 'qrcode'

// 引入 qrcode.js 的类型，用于定义配置项
import { QRCodeRenderersOptions } from 'qrcode'

// 引入 lodash 的深拷贝工具
import { cloneDeep } from 'lodash-es'

// 引入 propTypes 工具，用于定义组件属性类型
import { propTypes } from '@/utils/propTypes'

// 引入设计工具，用于获取样式前缀
import { useDesign } from '@/hooks/web/useDesign'

// 引入工具函数，用于判断数据类型
import { isString } from '@/utils/is'

// 引入 QrcodeLogo 接口，用于定义 Logo 配置类型
import { QrcodeLogo } from '@/components/Qrcode'

// 定义组件的 props
const props = defineProps({
  /** 二维码生成的标签类型（canvas 或 img） */
  tag: propTypes.string.validate((v: string) => ['canvas', 'img'].includes(v)).def('canvas'),
  /** 二维码的内容 */
  text: {
    type: [String, Array] as PropType<string | Recordable[]>, // 支持字符串或数组类型
    default: null // 默认值为 null
  },
  /** qrcode.js 的配置项 */
  options: {
    type: Object as PropType<QRCodeRenderersOptions>, // 配置项类型
    default: () => ({}) // 默认值为空对象
  },
  /** 二维码的宽度 */
  width: propTypes.number.def(200), // 默认宽度为 200px
  /** 二维码的 Logo 配置 */
  logo: {
    type: [String, Object] as PropType<Partial<QrcodeLogo> | string>, // 支持字符串或对象类型
    default: '' // 默认值为空字符串
  },
  /** 是否禁用二维码 */
  disabled: propTypes.bool.def(false), // 默认未禁用
  /** 禁用状态下的提示内容 */
  disabledText: propTypes.string.def('') // 默认禁用提示内容为空
})

// 定义组件的事件
const emit = defineEmits(['done', 'click', 'disabled-click']) // 支持生成完成、点击和禁用点击事件

// 获取样式前缀工具函数
const { getPrefixCls } = useDesign()

// 定义组件的样式前缀
const prefixCls = getPrefixCls('qrcode')

// 从 qrcode.js 中解构出生成二维码的函数
const { toCanvas, toDataURL } = QRCode

// 定义一个响应式变量，用于表示加载状态
const loading = ref(true)

// 定义一个响应式引用，用于绑定二维码容器（canvas 或 img）
const wrapRef = ref<Nullable<HTMLCanvasElement | HTMLImageElement>>(null)

// 计算属性：将传入的 text 转换为字符串类型
const renderText = computed(() => String(props.text))

// 计算属性：动态生成容器的宽高样式
const wrapStyle = computed(() => {
  return {
    width: props.width + 'px', // 设置宽度
    height: props.width + 'px' // 设置高度
  }
})

/**
 * 初始化二维码生成
 * @description 根据组件的配置生成二维码，支持 canvas 和 img 标签，以及嵌入 Logo 的二维码
 */
const initQrcode = async () => {
  await nextTick() // 确保 DOM 更新完成后再生成二维码

  const options = cloneDeep(props.options || {}) // 深拷贝 props 中的配置项

  if (props.tag === 'canvas') {
    // 设置容错率，根据二维码内容动态调整容错级别
    options.errorCorrectionLevel =
      options.errorCorrectionLevel || getErrorCorrectionLevel(unref(renderText))

    // 获取原始二维码的宽度，用于缩放计算
    const _width: number = await getOriginWidth(unref(renderText), options)

    // 根据组件宽度动态设置二维码的缩放比例
    options.scale = props.width === 0 ? undefined : (props.width / _width) * 4

    // 使用 canvas 渲染二维码
    const canvasRef = (await toCanvas(
      unref(wrapRef) as HTMLCanvasElement, // 绑定的 canvas 元素
      unref(renderText), // 二维码内容
      options // 渲染选项
    )) as unknown as HTMLCanvasElement

    // 如果存在 Logo 配置，则生成带 Logo 的二维码
    if (props.logo) {
      const url = await createLogoCode(canvasRef) // 在二维码上嵌入 Logo
      emit('done', url) // 触发二维码生成完成事件，传递 Data URL
      loading.value = false // 设置加载状态为完成
    } else {
      emit('done', canvasRef.toDataURL()) // 返回二维码的 Data URL
      loading.value = false // 设置加载状态为完成
    }
  } else {
    // 使用 img 标签渲染二维码
    const url = await toDataURL(renderText.value, {
      errorCorrectionLevel: 'H', // 高容错率
      width: props.width, // 二维码宽度
      ...options // 传入的选项
    })
    ;(unref(wrapRef) as HTMLImageElement).src = url // 设置 img 的 src 为二维码 URL
    emit('done', url) // 触发二维码生成完成事件
    loading.value = false // 设置加载状态为完成
  }
}

// 监听二维码内容变化，自动重新生成二维码
watch(
  () => renderText.value, // 监听二维码内容
  (val) => {
    if (!val) return // 如果内容为空，退出
    initQrcode() // 初始化二维码生成
  },
  {
    deep: true, // 深度监听
    immediate: true // 初始化时立即执行
  }
)

/**
 * 创建带 Logo 的二维码
 * @param canvasRef 当前生成二维码的 canvas 引用
 * @returns Promise<string> 返回嵌入 Logo 后的二维码 Data URL
 */
const createLogoCode = (canvasRef: HTMLCanvasElement) => {
  const canvasWidth = canvasRef.width // 获取 canvas 宽度

  // 合并默认 Logo 配置与组件传入的 Logo 配置
  const logoOptions: QrcodeLogo = Object.assign(
    {
      logoSize: 0.15, // 默认 Logo 大小比例
      bgColor: '#ffffff', // 默认 Logo 背景颜色
      borderSize: 0.05, // 默认边框大小比例
      crossOrigin: 'anonymous', // 默认跨域设置
      borderRadius: 8, // 默认背景圆角
      logoRadius: 0 // 默认 Logo 圆角
    },
    isString(props.logo) ? {} : props.logo // 如果 logo 是字符串，保持默认配置
  )

  // 解构 Logo 配置
  const {
    logoSize = 0.15,
    bgColor = '#ffffff',
    borderSize = 0.05,
    crossOrigin = 'anonymous',
    borderRadius = 8,
    logoRadius = 0
  } = logoOptions

  const logoSrc = isString(props.logo) ? props.logo : props.logo.src // 获取 Logo 的路径
  const logoWidth = canvasWidth * logoSize // 计算 Logo 的宽度
  const logoXY = (canvasWidth * (1 - logoSize)) / 2 // 计算 Logo 的起始位置
  const logoBgWidth = canvasWidth * (logoSize + borderSize) // 计算 Logo 背景的宽度
  const logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2 // 计算 Logo 背景的起始位置

  const ctx = canvasRef.getContext('2d') // 获取 canvas 上下文
  if (!ctx) return // 如果上下文不存在，退出

  // 绘制 Logo 背景
  canvasRoundRect(ctx)(logoBgXY, logoBgXY, logoBgWidth, logoBgWidth, borderRadius) // 圆角背景
  ctx.fillStyle = bgColor // 设置背景颜色
  ctx.fill() // 填充背景

  // 创建 Image 对象用于加载 Logo
  const image = new Image()
  if (crossOrigin || logoRadius) {
    image.setAttribute('crossOrigin', crossOrigin) // 设置跨域属性
  }
  ;(image as any).src = logoSrc // 设置 Logo 图片路径

  // 使用 Image 绘制 Logo，避免跨域问题
  const drawLogoWithImage = (image: HTMLImageElement) => {
    ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth) // 绘制 Logo
  }

  // 使用 Canvas 绘制 Logo，支持更多样式
  const drawLogoWithCanvas = (image: HTMLImageElement) => {
    const canvasImage = document.createElement('canvas') // 创建临时 Canvas
    canvasImage.width = logoXY + logoWidth
    canvasImage.height = logoXY + logoWidth
    const imageCanvas = canvasImage.getContext('2d') // 获取临时 Canvas 上下文
    if (!imageCanvas || !ctx) return
    imageCanvas.drawImage(image, logoXY, logoXY, logoWidth, logoWidth) // 绘制 Logo 到临时 Canvas

    canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius) // 绘制圆角
    const fillStyle = ctx.createPattern(canvasImage, 'no-repeat') // 创建填充样式
    if (fillStyle) {
      ctx.fillStyle = fillStyle
      ctx.fill() // 填充圆角区域
    }
  }

  // 将 Logo 绘制到二维码 Canvas 上
  return new Promise((resolve: any) => {
    image.onload = () => {
      logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image) // 根据配置选择绘制方式
      resolve(canvasRef.toDataURL()) // 返回嵌入 Logo 后的二维码 Data URL
    }
  })
}

/**
 * 获取原始二维码的宽度
 * @description 通过生成二维码来计算原始宽度，以便根据指定宽度进行缩放
 * @param content 二维码的内容
 * @param options 二维码生成的配置选项
 * @returns Promise<number> 返回原始二维码的宽度
 */
const getOriginWidth = async (content: string, options: QRCodeRenderersOptions) => {
  const _canvas = document.createElement('canvas') // 创建一个临时 canvas 元素
  await toCanvas(_canvas, content, options) // 在临时 canvas 上生成二维码
  return _canvas.width // 返回二维码的原始宽度
}

/**
 * 根据内容长度设置容错率
 * @description 为内容较少的二维码设置更高的容错率，增加二维码的可读性
 * @param content 二维码的内容
 * @returns string 容错级别（'L'、'M'、'Q'、'H'）
 */
const getErrorCorrectionLevel = (content: string) => {
  if (content.length > 36) {
    return 'M' // 内容较多，设置为中等容错率
  } else if (content.length > 16) {
    return 'Q' // 内容适中，设置为高容错率
  } else {
    return 'H' // 内容较少，设置为最高容错率
  }
}

/**
 * 绘制带圆角的矩形
 * @description 在 canvas 上绘制圆角矩形
 * @param ctx CanvasRenderingContext2D canvas 上下文对象
 * @returns 一个函数，用于根据指定参数绘制圆角矩形
 */
const canvasRoundRect = (ctx: CanvasRenderingContext2D) => {
  /**
   * 绘制圆角矩形
   * @param x 矩形左上角的 X 坐标
   * @param y 矩形左上角的 Y 坐标
   * @param w 矩形的宽度
   * @param h 矩形的高度
   * @param r 圆角的半径
   */
  return (x: number, y: number, w: number, h: number, r: number) => {
    const minSize = Math.min(w, h) // 获取矩形宽度和高度中的最小值
    if (r > minSize / 2) {
      r = minSize / 2 // 限制圆角半径不能超过矩形的半宽或半高
    }
    ctx.beginPath() // 开始路径绘制
    ctx.moveTo(x + r, y) // 移动到起始点
    ctx.arcTo(x + w, y, x + w, y + h, r) // 绘制右上角的圆角
    ctx.arcTo(x + w, y + h, x, y + h, r) // 绘制右下角的圆角
    ctx.arcTo(x, y + h, x, y, r) // 绘制左下角的圆角
    ctx.arcTo(x, y, x + w, y, r) // 绘制左上角的圆角
    ctx.closePath() // 关闭路径
    return ctx // 返回上下文对象
  }
}

/**
 * 触发点击事件
 * @description 当二维码被点击时触发 'click' 事件
 */
const clickCode = () => {
  emit('click') // 触发 'click' 事件
}

/**
 * 触发禁用状态的点击事件
 * @description 当禁用状态的二维码被点击时触发 'disabled-click' 事件
 */
const disabledClick = () => {
  emit('disabled-click') // 触发 'disabled-click' 事件
}
</script>

<template>
  <!-- 容器元素，用于显示二维码
  - v-loading="loading" 显示加载状态
  - :class="[prefixCls, 'relative inline-block']" 动态绑定类名，包括样式前缀
  - :style="wrapStyle" 动态设置二维码容器的宽高样式
  -->
  <div v-loading="loading" :class="[prefixCls, 'relative inline-block']" :style="wrapStyle">
    <!-- 根据标签类型动态渲染二维码，支持 canvas 或 img -->
    <component :is="tag" ref="wrapRef" @click="clickCode" />

    <!-- 如果二维码被禁用，则显示禁用状态提示
    - v-if="disabled" 条件渲染：只有禁用状态时显示
    - :class="`${prefixCls}--disabled`" 动态添加禁用状态的样式类
    - class="absolute top-0 left-0 flex w-full h-full items-center justify-center" 设置禁用层的布局样式
    - @click="disabledClick" 绑定禁用状态的点击事件
    -->
    <div
      v-if="disabled"
      :class="`${prefixCls}--disabled`"
      class="absolute top-0 left-0 flex w-full h-full items-center justify-center"
      @click="disabledClick"
    >
      <!-- 禁用状态提示内容 -->
      <div class="absolute top-[50%] left-[50%] font-bold">
        <!-- 居中显示提示内容 -->
        <Icon icon="vi-ep:refresh-right" :size="30" color="var(--el-color-primary)" />
        <!-- 图标提示 -->
        <div>{{ disabledText }}</div>
        <!-- 禁用提示文本 -->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
/** 定义二维码组件的样式前缀 */
@prefix-cls: ~'@{adminNamespace}-qrcode';

/** 二维码的基础样式 */
.@{prefix-cls} {
  /** 禁用状态下的样式 */
  &--disabled {
    background: rgb(255 255 255 / 95%); /* 设置禁用状态的半透明白色背景 */

    & > div {
      transform: translate(-50%, -50%); /* 禁用提示内容居中显示 */
    }
  }
}
</style>
