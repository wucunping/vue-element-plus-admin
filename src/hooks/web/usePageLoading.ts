/**
 * @file usePageLoading.ts
 * @description 自定义钩子，用于控制页面加载状态，实现加载指示功能。
 * 该钩子提供了 loadStart 和 loadDone 方法，允许用户在页面加载时显示和隐藏加载状态。
 * @example
 * const { loadStart, loadDone } = usePageLoading();
 * loadStart(); // 开始加载
 * loadDone();  // 完成加载
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module usePageLoading
 */

// 导入应用状态管理的 hook
import { useAppStoreWithOut } from '@/store/modules/app'

/**
 * 导出 usePageLoading 函数
 */
export const usePageLoading = () => {
	/**
	 * 开始加载的函数
	 * 用于将页面加载状态设置为 true
	 */
	const loadStart = () => {
		const appStore = useAppStoreWithOut() // 获取应用的状态管理对象
		appStore.setPageLoading(true) // 设置页面加载状态为 true
	}

	/**
	 * 完成加载的函数
	 * 用于将页面加载状态设置为 false
	 */
	const loadDone = () => {
		const appStore = useAppStoreWithOut() // 获取应用的状态管理对象
		appStore.setPageLoading(false) // 设置页面加载状态为 false
	}

	// 返回包含开始和完成加载方法的对象，供外部调用
	return {
		loadStart, // 返回开始加载的方法
		loadDone // 返回完成加载的方法
	}
}
