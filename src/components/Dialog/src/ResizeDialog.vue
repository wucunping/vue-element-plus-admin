<script lang="tsx" setup>
/**
 * @file ResizeDialog.vue
 * @description 可调整大小的弹窗组件，支持拖拽调整宽高和全屏切换
 * @example
 * <ResizeDialog v-model="isDialogVisible" title="Resizable Dialog" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module ResizeDialog
 * @requires '@/utils/propTypes', '../hooks/useResize', './Dialog.vue'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入属性定义工具
import { propTypes } from '@/utils/propTypes'
// 引入 Vue 的组合式 API
import { computed, getCurrentInstance, onMounted, unref, useAttrs, useSlots } from 'vue'
// 引入自定义 Dialog 组件
import Dialog from './Dialog.vue'
// 引入自定义尺寸调整 Hook
import { useResize } from '../hooks/useResize'

/** 定义组件的 Props */
const props = defineProps({
  /** 控制弹窗显示的绑定值 */
  modelValue: propTypes.bool.def(false),
  /** 弹窗标题 */
  title: propTypes.string.def('Dialog'),
  /** 是否支持全屏 */
  fullscreen: propTypes.bool.def(true),
  /** 初始宽度 */
  initWidth: propTypes.number.def(window.innerWidth / 2),
  /** 初始高度 */
  initHeight: propTypes.number.def(200),
  /** 最大高度 */
  minResizeWidth: propTypes.number.def(window.innerWidth / 2),
  /** 最大高度 */
  minResizeHeight: propTypes.number.def(200)
})

/** 调用 useResize Hook，返回相关拖拽方法和尺寸 */
const { maxHeight, minWidth, setupDrag } = useResize({
  minHeightPx: props.minResizeHeight,
  minWidthPx: props.minResizeWidth,
  initHeight: props.initHeight,
  initWidth: props.initWidth
})

/** 自定义指令 v-resize，用于监听子元素变化并绑定拖拽事件 */
const vResize = {
  mounted(el) {
    const observer = new MutationObserver(() => {
      const elDialog = el.querySelector('.el-dialog') // 获取弹窗 DOM 节点

      if (elDialog) {
        setupDrag(elDialog, el) // 绑定拖拽事件
      }
    })
    observer.observe(el, { childList: true, subtree: true }) // 监听 DOM 变化
  }
}

/** 获取传入的属性和插槽内容 */
const attrs = useAttrs()
const slots = useSlots()

/** 计算绑定的属性值，过滤不必要的属性 */
const getBindValue = computed(() => {
  const delArr: string[] = ['maxHeight', 'width'] // 要过滤的属性
  const obj = Object.assign({}, { ...unref(attrs), ...props }) // 合并属性
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

/** 获取当前组件实例 */
const instance = getCurrentInstance()

/** 初始化全局指令 */
const initDirective = () => {
  const directives = instance?.appContext?.app._context?.directives

  // 检查是否已经注册 resize 指令
  if (!directives || !directives['resize']) {
    instance?.appContext?.app.directive('resize', vResize) // 注册自定义指令
  }
}

/** 组件挂载时注册指令 */
onMounted(() => {
  initDirective()
})
</script>

<template>
  <div v-resize>
    <!-- 绑定自定义指令 -->
    <!-- 使用自定义 Dialog 组件 -->
    <Dialog v-bind="getBindValue" :maxHeight="maxHeight" :width="minWidth">
      <slot></slot>
      <!-- 默认插槽，传递弹窗内容 -->
      <template v-if="slots.footer" #footer>
        <slot name="footer"></slot>
        <!-- 底部插槽 -->
      </template>
    </Dialog>
  </div>
</template>

<style lang="less">
// /** ResizeDialog 组件样式 */
// .@{elNamespace}-resize-dialog {
//   display: flex; /* 弹窗内容居中显示 */
//   justify-content: center;
//   align-items: center;
// }

// .@{elNamespace}-resize-dialog__body {
//   overflow: hidden; /* 防止溢出 */
// }
</style>
