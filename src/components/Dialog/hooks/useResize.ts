/**
 * @file /src/components/Dialog/hooks/useResize.ts
 * @description 提供对对话框进行拖动调整大小的功能的钩子函数。
 * @example
 * const { setupDrag, maxHeight, minWidth } = useResize()
 * setupDrag(elDialog, el)
 * @version 1.0.0
 * @date 2024-11-21
 * @module useResize
 * @requires 'vue'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Vue 的 ref 函数，用于响应式数据的声明
import { ref } from 'vue'

/**
 * @function useResize
 * @description 用于设置对话框的拖动和调整大小功能
 * @param props 可选的配置参数，包含最小高度、最小宽度、初始高度和初始宽度
 * @returns 返回设置拖动的函数和调整后的最大高度和最小宽度
 */
export const useResize = (props?: {
  /** 最小高度，以像素为单位 */
  minHeightPx?: number
  /** 最小宽度，以像素为单位 */
  minWidthPx?: number
  /** 初始高度，以像素为单位 */
  initHeight?: number
  /** 初始宽度，以像素为单位 */
  initWidth?: number
}) => {
  // 解构 props 并设置默认值
  const {
    minHeightPx = 400, // 最小高度默认为 400px
    minWidthPx = window.innerWidth / 2, // 最小宽度默认为屏幕宽度的一半
    initHeight = 400, // 初始高度默认为 400px
    initWidth = window.innerWidth / 2 // 初始宽度默认为屏幕宽度的一半
  } = props || {}

  /** 最大高度，初始值为指定高度 */
  const maxHeight = ref(initHeight + 'px')

  /** 最小宽度，初始值为指定宽度 */
  const minWidth = ref(initWidth + 'px')

  /**
   * @function setupDrag
   * @description 设置拖动和调整大小的事件处理程序
   * @param elDialog 对话框的 DOM 元素
   * @param el 包含对话框的父元素
   */
  const setupDrag = (elDialog: any, el: any) => {
    let isResizing = false /** 是否正在调整大小的标志 */
    let currentResizeDirection = '' /** 当前调整的方向 */

    /**
     * @function handleMouseMove
     * @description 鼠标移动时设置光标样式和调整方向
     * @param e 鼠标事件对象
     */
    const handleMouseMove = (e: any) => {
      const rect = elDialog.getBoundingClientRect() /** 获取对话框的边界矩形 */
      const offsetX = e.clientX - rect.left /** 鼠标相对于对话框左侧的偏移量 */
      const offsetY = e.clientY - rect.top /** 鼠标相对于对话框顶部的偏移量 */
      const width = elDialog.clientWidth /** 对话框的宽度 */
      const height = elDialog.clientHeight /** 对话框的高度 */

      const computedStyle = window.getComputedStyle(elDialog) /** 获取对话框的样式 */
      const paddingLeft = parseFloat(computedStyle.paddingLeft) /** 对话框左内边距 */
      const paddingRight = parseFloat(computedStyle.paddingRight) /** 对话框右内边距 */
      const paddingBottom = parseFloat(computedStyle.paddingBottom) /** 对话框下内边距 */
      const paddingTop = parseFloat(computedStyle.paddingTop) /** 对话框上内边距 */

      // 根据鼠标位置设置光标样式和调整方向
      if (!isResizing) {
        if (offsetX < paddingLeft && offsetY > paddingTop && offsetY < height - paddingBottom) {
          elDialog.style.cursor = 'ew-resize' /** 设置光标为左右箭头 */
          currentResizeDirection = 'left' /** 当前调整方向为左侧 */
        } else if (
          offsetX > width - paddingRight &&
          offsetY > paddingTop &&
          offsetY < height - paddingBottom
        ) {
          elDialog.style.cursor = 'ew-resize' /** 设置光标为左右箭头 */
          currentResizeDirection = 'right' /** 当前调整方向为右侧 */
        } else if (
          offsetY < paddingTop &&
          offsetX > paddingLeft &&
          offsetX < width - paddingRight
        ) {
          elDialog.style.cursor = 'ns-resize' /** 设置光标为上下箭头 */
          currentResizeDirection = 'top' /** 当前调整方向为顶部 */
        } else if (
          offsetY > height - paddingBottom &&
          offsetX > paddingLeft &&
          offsetX < width - paddingRight
        ) {
          elDialog.style.cursor = 'ns-resize' /** 设置光标为上下箭头 */
          currentResizeDirection = 'bottom' /** 当前调整方向为底部 */
        } else if (offsetX < paddingLeft && offsetY < paddingTop) {
          elDialog.style.cursor = 'nwse-resize' /** 设置光标为左上右下箭头 */
          currentResizeDirection = 'top-left' /** 当前调整方向为左上 */
        } else if (offsetX > width - paddingRight && offsetY < paddingTop) {
          elDialog.style.cursor = 'nesw-resize' /** 设置光标为右上左下箭头 */
          currentResizeDirection = 'top-right' /** 当前调整方向为右上 */
        } else if (offsetX < paddingLeft && offsetY > height - paddingBottom) {
          elDialog.style.cursor = 'nesw-resize' /** 设置光标为右下左上箭头 */
          currentResizeDirection = 'bottom-left' /** 当前调整方向为左下 */
        } else if (offsetX > width - paddingRight && offsetY > height - paddingBottom) {
          elDialog.style.cursor = 'nwse-resize' /** 设置光标为左上右下箭头 */
          currentResizeDirection = 'bottom-right' /** 当前调整方向为右下 */
        } else {
          elDialog.style.cursor = 'default' /** 设置光标为默认样式 */
          currentResizeDirection = '' /** 当前无调整方向 */
        }
      }
    }

    /**
     * @function handleMouseDown
     * @description 鼠标按下事件处理器，开始调整大小
     * @param e 鼠标事件对象
     */
    const handleMouseDown = (e) => {
      if (currentResizeDirection) {
        isResizing = true /** 标记正在调整大小 */

        const initialX = e.clientX /** 鼠标按下时的 X 坐标 */
        const initialY = e.clientY /** 鼠标按下时的 Y 坐标 */
        const initialWidth = elDialog.clientWidth /** 对话框的初始宽度 */
        const initialHeight =
          el.querySelector('.el-dialog__body').clientHeight /** 对话框内容的初始高度 */

        /**
         * @function handleResizing
         * @description 调整大小的事件处理器
         * @param e 鼠标事件对象
         */
        const handleResizing = (e: any) => {
          if (!isResizing) return /** 如果未调整大小，则直接返回 */

          let newWidth = initialWidth /** 新宽度的初始值 */
          let newHeight = initialHeight /** 新高度的初始值 */

          // 根据调整方向计算新的宽度和高度
          if (currentResizeDirection.includes('right')) {
            newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px` /** 更新最小宽度 */
          }

          if (currentResizeDirection.includes('left')) {
            newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px` /** 更新最小宽度 */
          }

          if (currentResizeDirection.includes('bottom')) {
            newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` /** 更新最大高度 */
          }

          if (currentResizeDirection.includes('top')) {
            newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` /** 更新最大高度 */
          }

          // 根据不同的调整方向计算新的宽度和高度
          if (currentResizeDirection === 'top-left') {
            /** 从左上角拖动调整宽度和高度 */
            newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px` // 更新最小宽度
            newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新最大高度
          }

          if (currentResizeDirection === 'top-right') {
            /** 从右上角拖动调整宽度和高度 */
            newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px` // 更新最小宽度
            newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新最大高度
          }

          if (currentResizeDirection === 'bottom-left') {
            /** 从左下角拖动调整宽度和高度 */
            newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px` // 更新最小宽度
            newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新最大高度
          }

          if (currentResizeDirection === 'bottom-right') {
            /** 从右下角拖动调整宽度和高度 */
            newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2)
            minWidth.value = `${newWidth}px` // 更新最小宽度
            newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20)
            maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新最大高度
          }
        }

        /**
         * @function stopResizing
         * @description 停止调整大小的事件处理器
         */
        const stopResizing = () => {
          isResizing = false /** 标记调整大小结束 */
          document.removeEventListener('mousemove', handleResizing) /** 移除鼠标移动事件 */
          document.removeEventListener('mouseup', stopResizing) /** 移除鼠标松开事件 */
        }

        document.addEventListener('mousemove', handleResizing) /** 添加鼠标移动事件 */
        document.addEventListener('mouseup', stopResizing) /** 添加鼠标松开事件 */
      }
    }

    elDialog.addEventListener('mousemove', handleMouseMove) /** 监听鼠标移动事件 */
    elDialog.addEventListener('mousedown', handleMouseDown) /** 监听鼠标按下事件 */
  }

  return {
    setupDrag /** 设置拖动调整大小的方法 */,
    maxHeight /** 最大高度的响应式引用 */,
    minWidth /** 最小宽度的响应式引用 */
  }
}
