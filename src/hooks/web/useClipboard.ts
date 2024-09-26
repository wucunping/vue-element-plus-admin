/**
 * useClipboard.ts - 剪贴板操作自定义hook
 *
 * @file useClipboard.ts
 * @description 该文件定义了一个自定义hook `useClipboard`，用于在Web应用中处理剪贴板操作。
 * 它提供了复制文本到剪贴板的功能，并可以检查当前环境是否支持剪贴板操作。
 * 使用Vue的响应式系统（通过`ref`函数）来存储和管理状态。
 *
 * @example
 * const { copy, text, copied, isSupported } = useClipboard();
 * copy('要复制的文本');
 * console.log(text.value); // 输出已复制的文本
 * console.log(copied.value); // 输出是否已复制的状态
 * console.log(isSupported.value); // 输出剪贴板操作是否被支持
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 *
 * @export { useClipboard } - 导出自定义hook以供其他组件使用
 */

// 引入Vue的ref函数，用于创建响应式数据
import { ref } from 'vue'

/**
 * 剪贴板操作工具函数
 *
 * @returns 返回一个对象，包含复制文本的函数、已复制的文本内容、是否已复制和是否支持剪贴板操作的状态变量
 */
const useClipboard = () => {
	// 创建一个响应式变量，用于标记是否已复制文本
	const copied = ref(false)
	// 创建一个响应式变量，用于存储要复制的文本内容
	const text = ref('')
	// 创建一个响应式变量，用于标记当前环境是否支持剪贴板操作
	const isSupported = ref(false)

	// 检查当前环境是否支持剪贴板操作
	if (!navigator.clipboard && !document.execCommand) {
		isSupported.value = false
	} else {
		isSupported.value = true
	}

	/**
	 * 复制文本到剪贴板
	 *
	 * @param str 要复制的文本
	 * @returns 无返回值
	 */
	const copy = (str: string) => {
		// 如果支持navigator.clipboard API
		if (navigator.clipboard) {
			navigator.clipboard.writeText(str).then(() => {
				// 更新text变量为已复制的文本
				text.value = str
				// 标记为已复制
				copied.value = true
				// 重置复制状态
				resetCopied()
			})
			return
		}
		// 如果不支持navigator.clipboard API，使用旧方法
		const input = document.createElement('input') // 创建一个input元素
		input.setAttribute('readonly', 'readonly') // 设置为只读
		input.setAttribute('value', str) // 设置值为要复制的文本
		document.body.appendChild(input) // 将input元素添加到body中
		input.select() // 选中input元素
		input.setSelectionRange(0, 9999) // 设置选区范围
		// 执行复制操作
		if (document.execCommand('copy')) {
			// 更新text变量为已复制的文本
			text.value = str
			document.execCommand('copy') // 再次执行复制操作（这里可能是多余的，因为前面已经执行过了）
			// 标记为已复制
			copied.value = true
			// 重置复制状态
			resetCopied()
		}
		document.body.removeChild(input) // 从body中移除input元素
	}

	/**
	 * 重置复制状态
	 *
	 * @description 1.5秒后标记为未复制
	 */
	const resetCopied = () => {
		// 1.5秒后执行以下代码
		setTimeout(() => {
			// 标记为未复制
			copied.value = false // 1.5秒后标记为未复制
		}, 1500)
	}

	// 返回包含copy函数、text变量、copied变量和isSupported变量的对象
	return { copy, text, copied, isSupported }
}

// 导出useClipboard自定义hook
export { useClipboard }
