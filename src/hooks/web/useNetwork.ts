/**
 * useNetwork.ts - 网络状态监测自定义hook
 *
 * @file useNetwork.ts
 * @description 该文件定义了一个自定义hook `useNetwork`，用来监测浏览器的网络连接状态。
 * 这个hook返回一个响应式变量，指示当前网络是否在线，并在网络状态变化时自动更新。
 *
 * @module useNetwork
 *
 * @example
 * const { online } = useNetwork();
 * console.log(online.value); // 输出当前的网络状态（true或false）
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入Vue的ref函数，用于创建响应式数据，和onBeforeUnmount生命周期钩子
import { ref, onBeforeUnmount } from 'vue'

/**
 * useNetwork - 自定义hook，用于监测网络连接状态
 *
 * @returns {Object} 返回包含在线状态的响应式引用
 */
const useNetwork = () => {
	// 创建一个响应式变量，表示网络是否在线，初始值为true
	const online = ref(true)

	/**
	 * updateNetwork - 更新在线状态的函数
	 *
	 * @description 检查浏览器的网络状态并更新online变量的值
	 */
	const updateNetwork = () => {
		// 更新online变量为浏览器当前的网络状态
		online.value = navigator.onLine
	}

	// 监听网络变为在线事件，调用updateNetwork函数
	window.addEventListener('online', updateNetwork)
	// 监听网络变为离线事件，调用updateNetwork函数
	window.addEventListener('offline', updateNetwork)

	// 在组件卸载前，移除事件监听器
	onBeforeUnmount(() => {
		// 移除在线状态事件的监听
		window.removeEventListener('online', updateNetwork)
		// 移除离线状态事件的监听
		window.removeEventListener('offline', updateNetwork)
	})

	// 返回一个包含在线状态的对象
	return { online }
}

// 导出useNetwork自定义hook
export { useNetwork }
