<script setup lang="ts">
/**
 * @file ImageViewer 组件
 * @description 基于 Element Plus 的 ElImageViewer 组件，提供图片预览功能，包括多图切换、循环预览等特性。
 * @example
 * <template>
 *   <ImageViewer
 *     :urlList="['https://example.com/image1.jpg', 'https://example.com/image2.jpg']"
 *     :zIndex="2000"
 *     :initialIndex="0"
 *     :infinite="true"
 *     :hideOnClickModal="false"
 *     :teleported="true"
 *     :show="true"
 *   />
 * </template>
 *
 * 《script setup lang="ts"》
 * import ImageViewer from '@/components/ImageViewer/src/ImageViewer.vue'
 * 《/script》
 *
 * @version 1.0.0
 * @date 2024-11-22
 * @module /src/components/ImageViewer/src/ImageViewer.vue
 * @author [吴尘](https://github.com/wucunping)
 */

/** 引入 Element Plus 的图片预览组件 */
import { ElImageViewer } from 'element-plus'

/** 引入 Vue 的响应式和属性类型支持 */
import { computed, ref, PropType } from 'vue'

/** 引入自定义的属性类型工具 */
import { propTypes } from '@/utils/propTypes'

/** 定义组件的 Props */
const props = defineProps({
  /** 图片 URL 列表 */
  urlList: {
    type: Array as PropType<string[]>, // 数组类型，元素为字符串
    default: (): string[] => [] // 默认值为空数组
  },
  /** 设置 z-index，控制图层的优先级 */
  zIndex: propTypes.number.def(200),
  /** 初始显示的图片索引 */
  initialIndex: propTypes.number.def(0),
  /** 是否允许循环预览图片 */
  infinite: propTypes.bool.def(true),
  /** 是否点击遮罩层隐藏图片预览 */
  hideOnClickModal: propTypes.bool.def(false),
  /** 是否将组件渲染到指定的 teleport 容器 */
  teleported: propTypes.bool.def(false),
  /** 控制图片查看器的显示状态 */
  show: propTypes.bool.def(false)
})

/** 计算 ElImageViewer 绑定的值，去除 show 属性 */
const getBindValue = computed(() => {
  const propsData: Recordable = { ...props }
  delete propsData.show
  return propsData
})

/** 响应式变量，用于控制图片查看器的显示状态 */
const show = ref(props.show)

/** 关闭图片查看器的方法 */
const close = () => {
  show.value = false // 将 show 设置为 false，隐藏图片查看器
}
</script>

<template>
  <!-- 当 show 为 true 时显示 ElImageViewer 组件 -->
  <ElImageViewer v-if="show" v-bind="getBindValue" @close="close" />
</template>
