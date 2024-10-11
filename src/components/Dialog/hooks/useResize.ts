/**
 * @file useResize.ts
 * @description 用于实现元素的可调大小功能
 * @example
 * // 使用方法示例
 * import { useResize } from './useResize'
 * const { setupDrag, maxHeight, minWidth } = useResize()
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module useResize
 */

import { ref } from 'vue' // 从 Vue 中导入 ref 函数，用于创建响应式引用

/**
 * 自定义 hook 用于实现可调整大小的功能
 * @param {Object} props - 可选的参数对象
 * @param {number} [props.minHeightPx=400] - 最小高度（单位：像素），默认为 400
 * @param {number} [props.minWidthPx=window.innerWidth / 2] - 最小宽度（单位：像素），默认为屏幕宽度的 50%
 * @param {number} [props.initHeight=400] - 初始高度（单位：像素），默认为 400
 * @param {number} [props.initWidth=window.innerWidth / 2] - 初始宽度（单位：像素），默认为屏幕宽度的 50%
 * @returns {Object} 返回 setupDrag 方法和响应式的 maxHeight 和 minWidth
 */
export const useResize = (props?: {
	/** 最小高度的像素值 */
	minHeightPx?: number
	/** 最小宽度的像素值 */
	minWidthPx?: number
	/** 初始高度的像素值 */
	initHeight?: number
	/** 初始宽度的像素值 */
	initWidth?: number
}) => {
	const {
		minHeightPx = 400, // 默认最小高度为 400px
		minWidthPx = window.innerWidth / 2, // 默认最小宽度为屏幕宽度的 50%
		initHeight = 400, // 默认初始高度为 400px
		initWidth = window.innerWidth / 2 // 默认初始宽度为屏幕宽度的 50%
	} = props || {} // 采用默认值，若未传入 props 则使用默认值

	/** 创建响应式 maxHeight，初始为设置的高度 */
	const maxHeight = ref(initHeight + 'px')
	/** 创建响应式 minWidth，初始为设置的宽度 */
	const minWidth = ref(initWidth + 'px')

	/**
	 * 设置元素的拖拽行为
	 * @param {any} elDialog - 对话框元素
	 * @param {any} el - 其他元素
	 */
	const setupDrag = (elDialog: any, el: any) => {
		let isResizing = false // 标志是否正在调整大小
		let currentResizeDirection = '' // 当前调整方向的标记

		/**
		 * 处理鼠标移动事件
		 * @param {any} e - 事件对象
		 */
		const handleMouseMove = (e: any) => {
			const rect = elDialog.getBoundingClientRect() // 获取对话框元素的位置信息
			const offsetX = e.clientX - rect.left // 计算鼠标相对于对话框左侧的偏移量
			const offsetY = e.clientY - rect.top // 计算鼠标相对于对话框顶部的偏移量
			const width = elDialog.clientWidth // 获取对话框的当前宽度
			const height = elDialog.clientHeight // 获取对话框的当前高度

			// 获取对话框的内边距
			const computedStyle = window.getComputedStyle(elDialog) // 获取计算后的样式
			const paddingLeft = parseFloat(computedStyle.paddingLeft) // 左内边距
			const paddingRight = parseFloat(computedStyle.paddingRight) // 右内边距
			const paddingBottom = parseFloat(computedStyle.paddingBottom) // 下内边距
			const paddingTop = parseFloat(computedStyle.paddingTop) // 上内边距

			// 根据鼠标位置设置光标样式和调整方向
			if (!isResizing) {
				// 如果没有正在调整大小
				if (offsetX < paddingLeft && offsetY > paddingTop && offsetY < height - paddingBottom) {
					elDialog.style.cursor = 'ew-resize' // 设置光标为左右箭头
					currentResizeDirection = 'left' // 当前调整方向设置为左
				} else if (
					offsetX > width - paddingRight &&
					offsetY > paddingTop &&
					offsetY < height - paddingBottom
				) {
					elDialog.style.cursor = 'ew-resize' // 设置光标为左右箭头
					currentResizeDirection = 'right' // 当前调整方向设置为右
				} else if (
					offsetY < paddingTop &&
					offsetX > paddingLeft &&
					offsetX < width - paddingRight
				) {
					elDialog.style.cursor = 'ns-resize' // 设置光标为上下箭头
					currentResizeDirection = 'top' // 当前调整方向设置为上
				} else if (
					offsetY > height - paddingBottom &&
					offsetX > paddingLeft &&
					offsetX < width - paddingRight
				) {
					elDialog.style.cursor = 'ns-resize' // 设置光标为上下箭头
					currentResizeDirection = 'bottom' // 当前调整方向设置为下
				} else if (offsetX < paddingLeft && offsetY < paddingTop) {
					elDialog.style.cursor = 'nwse-resize' // 设置光标为左上右下箭头
					currentResizeDirection = 'top-left' // 当前调整方向设置为左上
				} else if (offsetX > width - paddingRight && offsetY < paddingTop) {
					elDialog.style.cursor = 'nesw-resize' // 设置光标为右上左下箭头
					currentResizeDirection = 'top-right' // 当前调整方向设置为右上
				} else if (offsetX < paddingLeft && offsetY > height - paddingBottom) {
					elDialog.style.cursor = 'nesw-resize' // 设置光标为右上左下箭头
					currentResizeDirection = 'bottom-left' // 当前调整方向设置为左下
				} else if (offsetX > width - paddingRight && offsetY > height - paddingBottom) {
					elDialog.style.cursor = 'nwse-resize' // 设置光标为左上右下箭头
					currentResizeDirection = 'bottom-right' // 当前调整方向设置为右下
				} else {
					elDialog.style.cursor = 'default' // 设置光标为默认状态
					currentResizeDirection = '' // 重置当前调整方向
				}
			}
		}

		/**
		 * 处理鼠标按下事件，开始调整对话框大小
		 * @param {MouseEvent} e - 事件对象
		 */
		const handleMouseDown = (e: MouseEvent) => {
			if (currentResizeDirection) {
				// 如果有调整方向
				isResizing = true // 设置正在调整大小的标志为 true

				const initialX = e.clientX // 记录初始鼠标 X 位置
				const initialY = e.clientY // 记录初始鼠标 Y 位置
				const initialWidth = elDialog.clientWidth // 记录初始宽度
				const initialHeight = el.querySelector('.el-dialog__body').clientHeight // 记录初始高度

				/**
				 * 处理大小调整事件
				 * @param {any} e - 事件对象
				 */
				const handleResizing = (e: any) => {
					if (!isResizing) return // 如果没有正在调整大小，直接返回

					let newWidth = initialWidth // 初始化新的宽度
					let newHeight = initialHeight // 初始化新的高度

					// 根据当前调整方向计算新的宽度和高度
					if (currentResizeDirection.includes('right')) {
						newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2) // 计算右侧调整后的宽度
						minWidth.value = `${newWidth}px` // 更新响应式 minWidth
					}

					if (currentResizeDirection.includes('left')) {
						newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2) // 计算左侧调整后的宽度
						minWidth.value = `${newWidth}px` // 更新响应式 minWidth
					}

					if (currentResizeDirection.includes('bottom')) {
						newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20) // 计算下侧调整后的高度
						maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新响应式 maxHeight
					}

					if (currentResizeDirection.includes('top')) {
						newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20) // 计算上侧调整后的高度
						maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新响应式 maxHeight
					}

					if (currentResizeDirection === 'top-left') {
						newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2) // 计算左上调整后的宽度
						minWidth.value = `${newWidth}px` // 更新响应式 minWidth
						newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20) // 计算左上调整后的高度
						maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新响应式 maxHeight
					}

					if (currentResizeDirection === 'top-right') {
						newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2) // 计算右上调整后的宽度
						minWidth.value = `${newWidth}px` // 更新响应式 minWidth
						newHeight = Math.max(minHeightPx, initialHeight - (e.clientY - initialY) * 2 - 20) // 计算右上调整后的高度
						maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新响应式 maxHeight
					}

					if (currentResizeDirection === 'bottom-left') {
						newWidth = Math.max(minWidthPx, initialWidth - (e.clientX - initialX) * 2) // 计算左下调整后的宽度
						minWidth.value = `${newWidth}px` // 更新响应式 minWidth
						newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20) // 计算左下调整后的高度
						maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新响应式 maxHeight
					}

					if (currentResizeDirection === 'bottom-right') {
						newWidth = Math.max(minWidthPx, initialWidth + (e.clientX - initialX) * 2) // 计算右下调整后的宽度
						minWidth.value = `${newWidth}px` // 更新响应式 minWidth
						newHeight = Math.max(minHeightPx, initialHeight + (e.clientY - initialY) * 2 - 20) // 计算右下调整后的高度
						maxHeight.value = `${Math.min(newHeight, window.innerHeight - 165)}px` // 更新响应式 maxHeight
					}
				}

				// 停止调整大小的事件处理器
				const stopResizing = () => {
					isResizing = false // 将正在调整大小的标志设置为 false
					document.removeEventListener('mousemove', handleResizing) // 移除鼠标移动事件监听
					document.removeEventListener('mouseup', stopResizing) // 移除鼠标抬起事件监听
				}

				document.addEventListener('mousemove', handleResizing) // 添加鼠标移动事件监听
				document.addEventListener('mouseup', stopResizing) // 添加鼠标抬起事件监听
			}
		}
		elDialog.addEventListener('mousemove', handleMouseMove) // 为对话框元素添加鼠标移动事件监听
		elDialog.addEventListener('mousedown', handleMouseDown) // 为对话框元素添加鼠标按下事件监听
	}

	return {
		setupDrag, // 返回设置拖拽函数
		maxHeight, // 返回最大高度的响应式引用
		minWidth // 返回最小宽度的响应式引用
	}
}
