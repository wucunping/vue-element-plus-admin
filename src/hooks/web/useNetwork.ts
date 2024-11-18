/**
 * @file useNetwork.ts
 * @description 网络状态监测的自定义 Hook。
 * @example
 * const { online } = useNetwork();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useNetwork
 */

import { ref, onBeforeUnmount } from 'vue' // 引入 Vue 的 ref 和 onBeforeUnmount 方法，用于状态管理和组件销毁时的清理

/**
 * useNetwork - 自定义 Hook，用于监测网络状态
 * @returns {Object} 返回一个对象，其中包含 online 属性，表示当前在线状态
 */
const useNetwork = () => {
  const online = ref(true) // 创建一个响应式变量 online，初始值为 true

  /**
   * updateNetwork - 更新网络状态的函数
   * @returns {void}
   */
  const updateNetwork = () => {
    online.value = navigator.onLine // 将 online 的值设置为浏览器的在线状态
  }

  // 监听浏览器的 online 和 offline 事件，以更新网络状态
  window.addEventListener('online', updateNetwork) // 当在线状态改变时调用 updateNetwork
  window.addEventListener('offline', updateNetwork) // 当离线状态改变时调用 updateNetwork

  // 在组件被销毁前，移除事件监听器以防止内存泄漏
  onBeforeUnmount(() => {
    window.removeEventListener('online', updateNetwork) // 移除 online 事件监听器
    window.removeEventListener('offline', updateNetwork) // 移除 offline 事件监听器
  })

  return { online } // 返回 online 状态
}

export { useNetwork } // 导出 useNetwork 函数
