/**
 * @file useClipboard.ts
 * @description 提供剪贴板操作的自定义hooks，支持文本的复制功能。
 * @example
 * const { copy, text, copied, isSupported } = useClipboard();
 * copy('需要复制的文本');
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useClipboard
 */

import { ref } from 'vue' // 导入 Vue 的 ref 函数，用于创建响应式数据

/**
 * useClipboard 函数：自定义hook用于处理剪贴板操作
 * @returns {Object} 返回包含复制功能、文本内容、复制状态及支持状态的对象
 */
const useClipboard = () => {
  /** 创建一个响应式引用，用于表示是否复制成功 */
  const copied = ref(false)
  /** 创建一个响应式引用，用于存储要复制的文本 */
  const text = ref('')
  /** 创建一个响应式引用，用于表示浏览器是否支持剪贴板功能 */
  const isSupported = ref(false)

  // 检查浏览器是否支持剪贴板 API 或 document.execCommand
  if (!navigator.clipboard && !document.execCommand) {
    isSupported.value = false // 如果都不支持，将 isSupported 设置为 false
  } else {
    isSupported.value = true // 否则，将 isSupported 设置为 true
  }

  /**
   * copy 函数：复制文本到剪贴板
   * @param {string} str - 要复制的文本
   */
  const copy = (str: string) => {
    // 如果浏览器支持剪贴板 API
    if (navigator.clipboard) {
      // 向剪贴板写入文本并返回一个 Promise
      navigator.clipboard.writeText(str).then(() => {
        text.value = str // 更新文本的响应式数据
        copied.value = true // 标记为已复制
        resetCopied() // 调用重置函数
      })
      return
    }
    /** 创建一个输入框元素 */
    const input = document.createElement('input')
    input.setAttribute('readonly', 'readonly') // 设置输入框为只读
    input.setAttribute('value', str) // 设置输入框的值为要复制的文本
    document.body.appendChild(input) // 将输入框添加到文档中
    input.select() // 选择输入框中的文本
    input.setSelectionRange(0, 9999) // 选中文本范围
    // 如果执行复制命令成功
    if (document.execCommand('copy')) {
      text.value = str // 更新文本的响应式数据
      document.execCommand('copy') // 将文本复制到剪贴板
      copied.value = true // 标记为已复制
      resetCopied() // 调用重置函数
    }
    document.body.removeChild(input) // 从文档中移除输入框
  }

  /**
   * resetCopied 函数：重置已复制的状态
   */
  const resetCopied = () => {
    // 设置定时器
    setTimeout(() => {
      copied.value = false // 1.5秒后将 copied 设置为 false
    }, 1500)
  }

  return { copy, text, copied, isSupported } // 返回复制功能、文本、复制状态和支持状态
}

export { useClipboard } // 导出 useClipboard 函数
