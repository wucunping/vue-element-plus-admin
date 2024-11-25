/**
 * @file tagsView.ts
 * @description 标签视图状态管理模块，用于管理访问过的视图和缓存的视图。
 * @example
 *  // 添加一个视图
 *  const tagsViewStore = useTagsViewStore();
 *  tagsViewStore.addView(route);
 * @version 1.0.0
 * @date 2024-11-18
 * @author [吴尘](https://github.com/wucunping)
 * @module TagsView
 */

// 引入路由实例，用于操作路由信息
import router from '@/router'

// 引入路由相关类型
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// 引入工具函数，用于获取原始路由信息
import { getRawRoute } from '@/utils/routerHelper'

// 引入 Pinia 的定义方法
import { defineStore } from 'pinia'

// 引入 Store 实例
import { store } from '../index'

// 引入工具函数 findIndex，用于查找数组元素索引
import { findIndex } from '@/utils'

// 引入用户 Store，用于获取用户信息
import { useUserStoreWithOut } from './user'

/**
 * 标签视图状态接口
 */
export interface TagsViewState {
  /**
   * 已访问的视图
   * @type {RouteLocationNormalizedLoaded[]}
   */
  visitedViews: RouteLocationNormalizedLoaded[]

  /**
   * 缓存的视图
   * @type {Set<string>}
   */
  cachedViews: Set<string>

  /**
   * 当前选中的标签
   * @type {RouteLocationNormalizedLoaded | undefined}
   */
  selectedTag?: RouteLocationNormalizedLoaded
}

/**
 * 定义标签视图状态管理模块
 */
export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [], // 初始化已访问视图为空
    cachedViews: new Set(), // 初始化缓存视图为空
    selectedTag: undefined // 当前选中标签默认为 undefined
  }),
  getters: {
    /**
     * 获取已访问的视图
     * @returns {RouteLocationNormalizedLoaded[]} 已访问视图列表
     */
    getVisitedViews(): RouteLocationNormalizedLoaded[] {
      return this.visitedViews
    },

    /**
     * 获取缓存的视图
     * @returns {string[]} 缓存视图的名称列表
     */
    getCachedViews(): string[] {
      return Array.from(this.cachedViews)
    },

    /**
     * 获取当前选中的标签
     * @returns {RouteLocationNormalizedLoaded | undefined} 当前选中的标签
     */
    getSelectedTag(): RouteLocationNormalizedLoaded | undefined {
      return this.selectedTag
    }
  },
  actions: {
    /**
     * 添加视图到已访问列表和缓存
     * @param {RouteLocationNormalizedLoaded} view 视图对象
     */
    addView(view: RouteLocationNormalizedLoaded): void {
      this.addVisitedView(view)
      this.addCachedView()
    },

    /**
     * 添加视图到已访问列表
     * @param {RouteLocationNormalizedLoaded} view 视图对象
     */
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return // 如果已存在则返回
      if (view.meta?.noTagsView) return // 如果视图不需要标签则返回
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name' // 设置默认标题
        })
      )
    },

    /**
     * 添加视图到缓存列表
     */
    addCachedView() {
      const cacheMap: Set<string> = new Set()
      for (const v of this.visitedViews) {
        const item = getRawRoute(v) // 获取原始路由信息
        if (!item?.meta?.noCache) {
          cacheMap.add(item.name as string) // 添加需要缓存的视图
        }
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
        return // 如果缓存视图没有变化则返回
      this.cachedViews = cacheMap
    },

    /**
     * 删除指定的视图
     * @param {RouteLocationNormalizedLoaded} view 视图对象
     */
    delView(view: RouteLocationNormalizedLoaded) {
      this.delVisitedView(view) // 删除访问的视图
      this.addCachedView() // 更新缓存
    },

    /**
     * 删除指定的已访问视图
     * @param {RouteLocationNormalizedLoaded} view 视图对象
     */
    delVisitedView(view: RouteLocationNormalizedLoaded) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1) // 从列表中移除视图
          break
        }
      }
    },

    /**
     * 删除缓存中的视图
     */
    delCachedView() {
      const route = router.currentRoute.value
      const index = findIndex<string>(this.getCachedViews, (v) => v === route.name)
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index])
      }
    },

    /**
     * 删除所有视图
     */
    delAllViews() {
      this.delAllVisitedViews()
      this.addCachedView()
    },

    /**
     * 删除所有已访问的视图
     */
    delAllVisitedViews() {
      const userStore = useUserStoreWithOut()
      this.visitedViews = userStore.getUserInfo
        ? this.visitedViews.filter((tag) => tag?.meta?.affix)
        : []
    },

    /**
     * 删除除了指定视图以外的其他视图
     * @param {RouteLocationNormalizedLoaded} view 视图对象
     */
    delOthersViews(view: RouteLocationNormalizedLoaded) {
      this.delOthersVisitedViews(view)
      this.addCachedView()
    },

    /**
     * 删除除了指定视图以外的其他已访问视图
     * @param {RouteLocationNormalizedLoaded} view 视图对象
     */
    delOthersVisitedViews(view: RouteLocationNormalizedLoaded) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v?.meta?.affix || v.path === view.path
      })
    },

    /**
     * 删除当前视图左侧的所有视图
     * @param {RouteLocationNormalizedLoaded} view - 当前选中的视图
     */
    delLeftViews(view: RouteLocationNormalizedLoaded) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter(
          (v, i) => v?.meta?.affix || v.path === view.path || i > index
        )
        this.addCachedView()
      }
    },

    // 删除右侧视图
    /**
     * 删除当前视图右侧的所有视图
     * @param {RouteLocationNormalizedLoaded} view - 当前选中的视图
     */
    delRightViews(view: RouteLocationNormalizedLoaded) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter(
          (v, i) => v?.meta?.affix || v.path === view.path || i < index
        )
        this.addCachedView()
      }
    },

    // 更新访问视图
    /**
     * 更新已访问视图的信息
     * @param {RouteLocationNormalizedLoaded} view - 更新后的视图对象
     */
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      const target = this.visitedViews.find((v) => v.path === view.path)
      if (target) {
        Object.assign(target, view)
      }
    },

    /**
     * 设置当前选中的标签
     * @param {RouteLocationNormalizedLoaded} tag 标签对象
     */
    setSelectedTag(tag: RouteLocationNormalizedLoaded) {
      this.selectedTag = tag
    },

    /**
     * 设置视图的标题
     * @param {string} title 新标题
     * @param {string} [path] 路径（可选）
     */
    setTitle(title: string, path?: string) {
      for (const v of this.visitedViews) {
        if (v.path === (path ?? this.selectedTag?.path)) {
          v.meta.title = title
          break
        }
      }
    }
  },
  persist: false // 不启用持久化存储
})

/**
 * 创建 TagsView Store 的外部实例
 * @returns {ReturnType<typeof useTagsViewStore>} TagsView Store 实例
 */
export const useTagsViewStoreWithOut = () => {
  return useTagsViewStore(store)
}
