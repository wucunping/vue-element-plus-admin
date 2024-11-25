<script setup lang="ts">
/**
 * @file 图像裁剪组件
 * @description 提供基于 CropperJS 的图像裁剪功能，支持旋转、翻转、缩放等操作，适用于多种场景。
 * @example
 * <template>
 *   <ImageCropping
 *     :imageUrl="imageSrc"
 *     :cropBoxWidth="200"
 *     :cropBoxHeight="200"
 *     :boxWidth="400"
 *     :boxHeight="300"
 *     :showResult="true"
 *     :showActions="true"
 *   />
 * </template>
 *
 * 《script setup lang="ts"》
 * import ImageCropping from '@/components/ImageCropping'
 * const imageSrc = 'path/to/your/image.jpg'
 * 《/script》
 * @version 1.0.0
 * @date 2024-11-22
 * @module /src/components/ImageCropping/src/ImageCropping.vue
 * @author [吴尘](https://github.com/wucunping)
 */

/** 引入自定义的设计工具方法，用于获取前缀样式类 */
import { useDesign } from '@/hooks/web/useDesign'

/** 引入 Vue 的核心方法和 API */
import { nextTick, unref, ref, watch, onBeforeUnmount, onMounted, computed } from 'vue'

/** 引入 Cropper.js 库，用于图片裁剪功能 */
import Cropper from 'cropperjs'

/** 引入 Cropper.js 的样式文件 */
import 'cropperjs/dist/cropper.min.css'

/** 引入 Element Plus 组件 */
import { ElDivider, ElUpload, UploadFile, ElMessage, ElTooltip } from 'element-plus'

/** 引入防抖函数工具 */
import { useDebounceFn } from '@vueuse/core'

/** 引入自定义基础按钮组件 */
import { BaseButton } from '@/components/Button'

/** 获取组件前缀样式类 */
const { getPrefixCls } = useDesign()

/** 定义组件的前缀样式类 */
const prefixCls = getPrefixCls('image-cropping')

/** 定义组件的属性 */
const props = defineProps({
  /** 图像的 URL 地址 */
  imageUrl: {
    type: String, // 数据类型为字符串
    default: '', // 默认值为空字符串
    required: true // 必填属性
  },
  /** 裁剪框的宽度 */
  cropBoxWidth: {
    type: Number, // 数据类型为数字
    default: 200 // 默认值为 200
  },
  /** 裁剪框的高度 */
  cropBoxHeight: {
    type: Number, // 数据类型为数字
    default: 200 // 默认值为 200
  },
  /** 容器的宽度 */
  boxWidth: {
    type: [Number, String], // 数据类型为数字或字符串
    default: 425 // 默认值为 425
  },
  /** 容器的高度 */
  boxHeight: {
    type: [Number, String], // 数据类型为数字或字符串
    default: 320 // 默认值为 320
  },
  /** 是否显示裁剪后的结果 */
  showResult: {
    type: Boolean, // 数据类型为布尔值
    default: true // 默认值为 true
  },
  /** 是否显示操作按钮 */
  showActions: {
    type: Boolean, // 数据类型为布尔值
    default: true // 默认值为 true
  }
})

/** 使用防抖处理获取裁剪后的 Base64 图片 */
const getBase64 = useDebounceFn(() => {
  imgBase64.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? '' // 获取裁剪后的图片
}, 80) // 防抖时间为 80 毫秒

/** 重置裁剪框的大小和位置 */
const resetCropBox = () => {
  const containerData = unref(cropperRef)?.getContainerData() // 获取容器的数据
  unref(cropperRef)?.setCropBoxData({
    width: props.cropBoxWidth, // 设置裁剪框宽度
    height: props.cropBoxHeight, // 设置裁剪框高度
    left: (containerData?.width || 0) / 2 - 100, // 设置裁剪框左侧位置
    top: (containerData?.height || 0) / 2 - 100 // 设置裁剪框顶部位置
  })
  imgBase64.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? '' // 更新裁剪后的图片
}

/** 计算容器样式 */
const getBoxStyle = computed(() => {
  return {
    width: `${props.boxWidth}px`, // 容器宽度
    height: `${props.boxHeight}px` // 容器高度
  }
})

/** 计算裁剪框样式 */
const getCropBoxStyle = computed(() => {
  return {
    width: `${props.cropBoxWidth}px`, // 裁剪框宽度
    height: `${props.cropBoxHeight}px` // 裁剪框高度
  }
})

/** 根据缩放比例计算裁剪图的尺寸 */
const getScaleSize = (scale: number) => {
  return {
    width: props.cropBoxWidth * scale + 'px', // 计算宽度
    height: props.cropBoxHeight * scale + 'px' // 计算高度
  }
}

/** 裁剪后的 Base64 图片 */
const imgBase64 = ref('')

/** 图片元素的引用 */
const imgRef = ref<HTMLImageElement>()

/** Cropper 实例的引用 */
const cropperRef = ref<Cropper>()

/** 初始化 Cropper 实例 */
const intiCropper = () => {
  if (!unref(imgRef)) return // 如果图片引用不存在则直接返回
  const imgEl = unref(imgRef)! // 获取图片元素
  cropperRef.value = new Cropper(imgEl, {
    aspectRatio: 1, // 设置裁剪框的宽高比
    viewMode: 1, // 设置视图模式
    dragMode: 'move', // 设置拖拽模式
    toggleDragModeOnDblclick: false, // 禁用双击切换拖拽模式
    checkCrossOrigin: false, // 禁用跨域检查
    ready() {
      resetCropBox() // 在裁剪器准备好时重置裁剪框
    },
    cropmove() {
      getBase64() // 当裁剪框移动时更新裁剪后的图片
    },
    zoom() {
      getBase64() // 当缩放时更新裁剪后的图片
    },
    crop() {
      getBase64() // 当裁剪时更新裁剪后的图片
    }
  })
}

/** 处理上传图片文件 */
const uploadChange = (uploadFile: UploadFile) => {
  if (uploadFile?.raw?.type.indexOf('image') === -1) {
    // 检查文件类型是否为图片
    ElMessage.error('请上传图片格式的文件') // 提示错误信息
    return
  }
  if (!uploadFile.raw) return // 如果没有文件内容则返回
  const url = URL.createObjectURL(uploadFile.raw) // 创建图片的 URL 地址
  unref(cropperRef)?.replace(url) // 替换 Cropper 实例中的图片
}

/** 重置裁剪器 */
const reset = () => {
  unref(cropperRef)?.reset() // 调用裁剪器的重置方法
}

/** 旋转图片 */
const rotate = (deg: number) => {
  unref(cropperRef)?.rotate(deg) // 调用裁剪器的旋转方法
}

/** 定义水平翻转的状态 */
const scaleX = ref(1)

/** 定义垂直翻转的状态 */
const scaleY = ref(1)

/** 翻转图片 */
const scale = (type: 'scaleX' | 'scaleY') => {
  if (type === 'scaleX') {
    // 判断是否为水平翻转
    scaleX.value = scaleX.value === 1 ? -1 : 1 // 切换水平翻转状态
    unref(cropperRef)?.[type](unref(scaleX)) // 调用裁剪器的翻转方法
  } else {
    // 垂直翻转
    scaleY.value = scaleY.value === 1 ? -1 : 1 // 切换垂直翻转状态
    unref(cropperRef)?.[type](unref(scaleY)) // 调用裁剪器的翻转方法
  }
}

/** 缩放图片 */
const zoom = (num: number) => {
  unref(cropperRef)?.zoom(num) // 调用裁剪器的缩放方法
}

/** 组件挂载时初始化裁剪器 */
onMounted(() => {
  intiCropper() // 初始化裁剪器
})

/** 监听图片 URL 的变化 */
watch(
  () => props.imageUrl, // 监听属性
  async (url) => {
    if (url) {
      // 如果有新的 URL
      unref(cropperRef)?.replace(url) // 替换图片
      await nextTick() // 等待 DOM 更新
      resetCropBox() // 重置裁剪框
    }
  }
)

/** 组件卸载时销毁裁剪器实例 */
onBeforeUnmount(() => {
  unref(cropperRef)?.destroy() // 销毁裁剪器
})

/** 暴露给外部的方法 */
defineExpose({
  cropperExpose: cropperRef // 暴露裁剪器引用
})
</script>

<template>
  <!-- 主容器，应用动态类名，包含裁剪结果和操作 -->
  <div
    :class="{
      [prefixCls]: true, // 使用动态样式前缀
      'flex items-center': showResult // 如果显示结果则添加对应样式
    }"
  >
    <div>
      <!-- 裁剪框展示区域 -->
      <div :style="getBoxStyle" class="flex justify-center items-center">
        <!-- 原始图片显示
        - v-show 当存在图片URL时显示
        - ref 绑定引用以便于在脚本中操作
        - :src 动态绑定图片源
        - class 图片样式
        - crossorigin 允许跨域访问
        - alt 图片描述 
        - srcset 响应式图片
        -->
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

      <!-- 操作按钮区域 -->
      <div v-if="showActions" class="mt-10px flex items-center">
        <div class="flex items-center">
          <!-- 上传文件按钮
          - action 禁用默认上传地址
          - accept 限制只上传图片文件
          - auto-upload 禁用自动上传
          - show-file-list 不显示文件列表
          - on-change 文件变化时触发
          -->
          <ElTooltip content="选择文件" placement="bottom">
            <ElUpload
              action="''"
              accept="image/*"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="uploadChange"
            >
              <!-- 上传按钮 -->
              <BaseButton size="small" type="primary" class="mt-2px">
                <Icon icon="vi-ep:upload-filled" />
              </BaseButton>
            </ElUpload>
          </ElTooltip>
        </div>

        <!-- 图像操作按钮 -->
        <div class="flex items-center justify-end flex-1">
          <!-- 重置按钮 -->
          <ElTooltip content="重置" placement="bottom">
            <BaseButton size="small" type="primary" @click="reset">
              <Icon icon="vi-ep:refresh" />
            </BaseButton>
          </ElTooltip>
          <!-- 逆时针旋转按钮 -->
          <ElTooltip content="逆时针旋转" placement="bottom">
            <BaseButton size="small" type="primary" @click="rotate(-45)">
              <Icon icon="vi-ant-design:rotate-left-outlined" />
            </BaseButton>
          </ElTooltip>
          <!-- 顺时针旋转按钮 -->
          <ElTooltip content="顺时针旋转" placement="bottom">
            <BaseButton size="small" type="primary" @click="rotate(45)">
              <Icon icon="vi-ant-design:rotate-right-outlined" />
            </BaseButton>
          </ElTooltip>
          <!-- 水平翻转按钮 -->
          <ElTooltip content="水平翻转" placement="bottom">
            <BaseButton size="small" type="primary" @click="scale('scaleX')">
              <Icon icon="vi-vaadin:arrows-long-h" />
            </BaseButton>
          </ElTooltip>
          <!-- 垂直翻转按钮 -->
          <ElTooltip content="垂直翻转" placement="bottom">
            <BaseButton size="small" type="primary" @click="scale('scaleY')">
              <Icon icon="vi-vaadin:arrows-long-v" />
            </BaseButton>
          </ElTooltip>
          <!-- 放大按钮 -->
          <ElTooltip content="放大" placement="bottom">
            <BaseButton size="small" type="primary" @click="zoom(0.1)">
              <Icon icon="vi-ant-design:zoom-in-outlined" />
            </BaseButton>
          </ElTooltip>
          <!-- 缩小按钮 -->
          <ElTooltip content="缩小" placement="bottom">
            <BaseButton size="small" type="primary" @click="zoom(-0.1)">
              <Icon icon="vi-ant-design:zoom-out-outlined" />
            </BaseButton>
          </ElTooltip>
        </div>
      </div>
    </div>

    <!-- 裁剪结果显示区域 -->
    <div v-if="imgBase64 && showResult" class="ml-20px">
      <!-- 原比例裁剪结果 -->
      <div class="flex justify-center items-center">
        <img :src="imgBase64" class="rounded-[50%]" :style="getCropBoxStyle" />
      </div>
      <ElDivider />
      <!-- 不同比例的裁剪结果缩略图 -->
      <div class="flex justify-center items-center">
        <img :src="imgBase64" class="rounded-[50%]" :style="getScaleSize(0.2)" />
        <img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.25)" />
        <img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.3)" />
        <img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.35)" />
      </div>
    </div>
  </div>
</template>
