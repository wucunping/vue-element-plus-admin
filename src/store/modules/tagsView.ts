/**
 * @file tagsView.ts
 * @description 该文件定义了标签视图状态管理的store，负责管理用户访问过的路由视图及其缓存。
 * @example
 * // 使用标签视图store
 * const tagsViewStore = useTagsViewStore();
 * tagsViewStore.addView(currentRoute);
 * * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module tagsView
 */

// 导入路由功能
import router from '@/router'

// 导入vue-router类型
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// 导入路由帮助工具函数
import { getRawRoute } from '@/utils/routerHelper'

// 导入pinia状态管理库的defineStore
import { defineStore } from 'pinia'

// 导入store实例
import { store } from '../index'

// 导入查找索引的工具函数
import { findIndex } from '@/utils'

// 导入用户状态管理
import { useUserStoreWithOut } from './user'

/**
 * 定义标签视图状态的接口
 */
export interface TagsViewState {
	/** 访问过的视图数组 */
	visitedViews: RouteLocationNormalizedLoaded[]
	/** 缓存的视图集合 */
	cachedViews: Set<string>
	/** 当前选中的标签 */
	selectedTag?: RouteLocationNormalizedLoaded
}

/**
 * 定义标签视图状态管理的store
 */
export const useTagsViewStore = defineStore('tagsView', {
	state: (): TagsViewState => ({
		visitedViews: [], // 初始化访问过的视图为空数组
		cachedViews: new Set(), // 初始化缓存的视图为空集合
		selectedTag: undefined // 初始化选中的标签为undefined
	}),
	getters: {
		/**
		 * 获取访问过的视图
		 */
		getVisitedViews(): RouteLocationNormalizedLoaded[] {
			return this.visitedViews // 返回访问过的视图
		},

		/**
		 * 获取缓存的视图
		 */
		getCachedViews(): string[] {
			return Array.from(this.cachedViews) // 将集合转换为数组并返回
		},

		/**
		 * 获取当前选中的标签
		 */
		getSelectedTag(): RouteLocationNormalizedLoaded | undefined {
			return this.selectedTag // 返回当前选中的标签
		}
	},
	actions: {
		/**
		 * 新增缓存和标签
		 * @param view - 待添加的视图
		 */
		addView(view: RouteLocationNormalizedLoaded): void {
			this.addVisitedView(view) // 添加已访问视图
			this.addCachedView() // 更新缓存的视图
		},
		/**
		 * 新增已访问标签
		 * @param view - 待添加的视图
		 */
		addVisitedView(view: RouteLocationNormalizedLoaded) {
			// 如果该视图已经被访问过，则返回
			if (this.visitedViews.some((v) => v.path === view.path)) return
			// 如果该视图的meta不允许显示标签视图，则返回
			if (view.meta?.noTagsView) return
			// 将视图添加到已访问视图列表，并设置标题
			this.visitedViews.push(
				Object.assign({}, view, {
					title: view.meta?.title || 'no-name' // 设置标题，默认值为'no-name'
				})
			)
		},
		/**
		 * 新增缓存的视图
		 */
		addCachedView() {
			const cacheMap: Set<string> = new Set() // 创建一个集合用于存储缓存视图
			for (const v of this.visitedViews) {
				// 遍历已访问视图
				const item = getRawRoute(v) // 获取原始路由
				const needCache = !item?.meta?.noCache // 判断是否需要缓存
				if (!needCache) {
					// 如果不需要缓存，继续跳过
					continue
				}
				const name = item.name as string // 获取路由名称
				cacheMap.add(name) // 将路由名称加入缓存集合
			}
			// 如果缓存的视图集合与现有的相同，则返回
			if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
				return
			this.cachedViews = cacheMap // 更新缓存视图
		},
		/**
		 * 删除某个视图
		 * @param view - 待删除的视图
		 */
		delView(view: RouteLocationNormalizedLoaded) {
			this.delVisitedView(view) // 删除已访问视图
			this.addCachedView() // 更新缓存的视图
		},
		/**
		 * 删除已访问标签
		 * @param view - 待删除的视图
		 */
		delVisitedView(view: RouteLocationNormalizedLoaded) {
			for (const [i, v] of this.visitedViews.entries()) {
				// 遍历已访问视图
				if (v.path === view.path) {
					// 如果找到匹配的视图
					this.visitedViews.splice(i, 1) // 删除该视图
					break // 结束循环
				}
			}
		},
		/**
		 * 删除缓存视图
		 */
		delCachedView() {
			const route = router.currentRoute.value // 获取当前路由
			const index = findIndex<string>(this.getCachedViews, (v) => v === route.name) // 查找当前路由在缓存中的索引
			if (index > -1) {
				// 如果索引有效
				this.cachedViews.delete(this.getCachedViews[index]) // 从缓存中删除该视图
			}
		},
		/**
		 * 删除所有视图和标签
		 */
		delAllViews() {
			this.delAllVisitedViews() // 删除所有已访问视图
			this.addCachedView() // 更新缓存的视图
		},
		/**
		 * 删除所有已访问标签
		 */
		delAllVisitedViews() {
			const userStore = useUserStoreWithOut() // 获取用户状态管理

			// const affixTags = this.visitedViews.filter((tag) => tag.meta.affix) // 可选：过滤保留的标签
			this.visitedViews = userStore.getUserInfo // 根据用户信息决定是否保留已访问视图
				? this.visitedViews.filter((tag) => tag?.meta?.affix) // 保留固定标签
				: [] // 否则返回空数组
		},
		/**
		 * 删除其他视图
		 * @param view - 当前视图
		 */
		delOthersViews(view: RouteLocationNormalizedLoaded) {
			this.delOthersVisitedViews(view) // 删除其他已访问视图
			this.addCachedView() // 更新缓存的视图
		},
		/**
		 * 删除其他已访问标签
		 * @param view - 当前视图
		 */
		delOthersVisitedViews(view: RouteLocationNormalizedLoaded) {
			this.visitedViews = this.visitedViews.filter((v) => {
				// 过滤出需要保留的视图
				return v?.meta?.affix || v.path === view.path // 保留固定标签或当前视图
			})
		},
		/**
		 * 删除左侧视图
		 * @param view - 当前视图
		 */
		delLeftViews(view: RouteLocationNormalizedLoaded) {
			const index = findIndex<RouteLocationNormalizedLoaded>(
				this.visitedViews,
				(v) => v.path === view.path // 查找当前视图的索引
			)
			if (index > -1) {
				// 如果索引有效
				this.visitedViews = this.visitedViews.filter((v, i) => {
					return v?.meta?.affix || v.path === view.path || i > index // 过滤保留固定标签或当前视图或索引大于当前视图
				})
				this.addCachedView() // 更新缓存的视图
			}
		},
		/**
		 * 删除右侧视图
		 * @param view - 当前视图
		 */
		delRightViews(view: RouteLocationNormalizedLoaded) {
			const index = findIndex<RouteLocationNormalizedLoaded>(
				this.visitedViews,
				(v) => v.path === view.path // 查找当前视图的索引
			)
			if (index > -1) {
				// 如果索引有效
				this.visitedViews = this.visitedViews.filter((v, i) => {
					return v?.meta?.affix || v.path === view.path || i < index // 过滤保留固定标签或当前视图或索引小于当前视图
				})
				this.addCachedView() // 更新缓存的视图
			}
		},
		/**
		 * 更新已访问视图
		 * @param view - 新视图数据
		 */
		updateVisitedView(view: RouteLocationNormalizedLoaded) {
			for (let v of this.visitedViews) {
				// 遍历已访问视图
				if (v.path === view.path) {
					// 如果找到匹配的视图
					v = Object.assign(v, view) // 更新视图信息
					break // 结束循环
				}
			}
		},
		/**
		 * 设置当前选中的标签
		 * @param tag - 选中的标签
		 */
		setSelectedTag(tag: RouteLocationNormalizedLoaded) {
			this.selectedTag = tag // 设置当前选中的标签
		},
		/**
		 * 设置视图标题
		 * @param title - 新标题
		 * @param path - 可选视图路径
		 */
		setTitle(title: string, path?: string) {
			for (const v of this.visitedViews) {
				// 遍历已访问视图
				if (v.path === (path ?? this.selectedTag?.path)) {
					// 如果视图路径匹配
					v.meta.title = title // 更新标题
					break // 结束循环
				}
			}
		}
	},
	persist: false // 状态是否持久化
})

// 定义没有store依赖的标签视图状态管理store
export const useTagsViewStoreWithOut = () => {
	return useTagsViewStore(store) // 返回store实例
}
