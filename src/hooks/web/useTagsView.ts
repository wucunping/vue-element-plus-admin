/**
 * @file useTagsView.ts
 * @description 该文件提供了一组用于管理标签视图的功能，包括关闭标签、刷新页面和设置标签标题等。
 * @example
 * const { closeAll, refreshPage } = useTagsView();
 * closeAll(() => {
 *   console.log('所有标签已关闭');
 * });
 * refreshPage(currentView, () => {
 *   console.log('页面已刷新');
 * });
 * * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module useTagsView
 */
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView' // 导入标签视图状态管理
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router' // 导入路由相关类型和功能
import { computed, nextTick, unref } from 'vue' // 导入Vue的响应式计算、异步更新和解引用功能

/**
 * 自定义hooks，用于管理标签视图的状态和操作
 * @returns {Object} 提供的标签视图操作方法
 */
export const useTagsView = () => {
	const tagsViewStore = useTagsViewStoreWithOut() // 获取没有依赖的标签视图状态管理

	const { replace, currentRoute } = useRouter() // 解构获取路由的替换方法和当前路由

	const selectedTag = computed(() => tagsViewStore.getSelectedTag) // 计算属性，获取当前选中的标签

	/**
	 * 关闭所有标签
	 * @param {Fn} [callback] 可选的回调函数
	 */
	const closeAll = (callback?: Fn) => {
		tagsViewStore.delAllViews() // 调用状态管理中删除所有视图的方法
		callback?.() // 如果存在回调则执行
	}

	/**
	 * 关闭左侧标签
	 * @param {Fn} [callback] 可选的回调函数
	 */
	const closeLeft = (callback?: Fn) => {
		tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded) // 删除左侧标签
		callback?.() // 执行回调
	}

	/**
	 * 关闭右侧标签
	 * @param {Fn} [callback] 可选的回调函数
	 */
	const closeRight = (callback?: Fn) => {
		tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded) // 删除右侧标签
		callback?.() // 执行回调
	}

	/**
	 * 关闭其他标签
	 * @param {Fn} [callback] 可选的回调函数
	 */
	const closeOther = (callback?: Fn) => {
		tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded) // 删除其他标签
		callback?.() // 执行回调
	}

	/**
	 * 关闭当前标签
	 * @param {RouteLocationNormalizedLoaded} [view] 可选的视图
	 * @param {Fn} [callback] 可选的回调函数
	 */
	const closeCurrent = (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
		if (view?.meta?.affix) return // 如果标签是固定的则不执行关闭
		tagsViewStore.delView(view || unref(currentRoute)) // 删除当前视图
		callback?.() // 执行回调
	}

	/**
	 * 刷新页面
	 * @param {RouteLocationNormalizedLoaded} [view] 可选的视图
	 * @param {Fn} [callback] 可选的回调函数
	 */
	const refreshPage = async (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
		tagsViewStore.delCachedView() // 删除缓存的视图
		const { path, query } = view || unref(currentRoute) // 解构获取路径和查询参数
		await nextTick() // 等待下次更新
		replace({
			path: '/redirect' + path, // 替换成重定向路径
			query: query // 带上查询参数
		})
		callback?.() // 执行回调
	}

	/**
	 * 设置标签标题
	 * @param {string} title 标签标题
	 * @param {string} [path] 可选的路径
	 */
	const setTitle = (title: string, path?: string) => {
		tagsViewStore.setTitle(title, path) // 调用状态管理中设置标题的方法
	}

	return {
		closeAll, // 返回关闭所有标签的方法
		closeLeft, // 返回关闭左侧标签的方法
		closeRight, // 返回关闭右侧标签的方法
		closeOther, // 返回关闭其他标签的方法
		closeCurrent, // 返回关闭当前标签的方法
		refreshPage, // 返回刷新页面的方法
		setTitle // 返回设置标题的方法
	}
}
