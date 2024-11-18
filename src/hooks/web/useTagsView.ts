/**
 * @file useTagsView.ts
 * @description 用于管理标签视图的自定义钩子
 * @example
 * // 使用示例
 * const { closeAll, refreshPage } = useTagsView();
 * closeAll(() => console.log('All views closed'));
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module TagsView
 */

import { useTagsViewStoreWithOut } from '@/store/modules/tagsView' // 导入标签视图存储 Hook
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router' // 导入路由相关类型和函数
import { computed, nextTick, unref } from 'vue' // 导入 Vue 的计算属性、下一次更新和解引用函数

/**
 * useTagsView - 自定义钩子，提供标签视图的相关操作
 * @returns {Object} 提供标签视图操作的方法集合
 */
export const useTagsView = () => {
  const tagsViewStore = useTagsViewStoreWithOut() // 获取无状态的标签视图存储

  const { replace, currentRoute } = useRouter() // 使用路由的替换方法和当前路由信息

  const selectedTag = computed(() => tagsViewStore.getSelectedTag) // 计算属性，获取当前选中的标签

  /**
   * closeAll - 关闭所有标签视图
   * @param {Fn} [callback] - 可选的回调函数
   */
  const closeAll = (callback?: Fn) => {
    tagsViewStore.delAllViews() // 删除所有视图
    callback?.() // 执行回调函数（如果提供的话）
  }

  /**
   * closeLeft - 关闭当前选中的标签左侧的所有标签
   * @param {Fn} [callback] - 可选的回调函数
   */
  const closeLeft = (callback?: Fn) => {
    tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded) // 删除左侧视图
    callback?.() // 执行回调
  }

  /**
   * closeRight - 关闭当前选中的标签右侧的所有标签
   * @param {Fn} [callback] - 可选的回调函数
   */
  const closeRight = (callback?: Fn) => {
    tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded) // 删除右侧视图
    callback?.() // 执行回调
  }

  /**
   * closeOther - 关闭除了当前选中标签的其他标签
   * @param {Fn} [callback] - 可选的回调函数
   */
  const closeOther = (callback?: Fn) => {
    tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded) // 删除其他视图
    callback?.() // 执行回调
  }

  /**
   * closeCurrent - 关闭当前选中的标签视图
   * @param {RouteLocationNormalizedLoaded} [view] - 可选的视图对象
   * @param {Fn} [callback] - 可选的回调函数
   */
  const closeCurrent = (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
    // 如果视图是固定的，则不关闭
    if (view?.meta?.affix) return
    tagsViewStore.delView(view || unref(currentRoute)) // 删除当前视图

    callback?.() // 执行回调
  }

  /**
   * refreshPage - 刷新当前页面
   * @param {RouteLocationNormalizedLoaded} [view] - 可选的视图对象
   * @param {Fn} [callback] - 可选的回调函数
   */
  const refreshPage = async (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
    tagsViewStore.delCachedView() // 删除缓存的视图
    const { path, query } = view || unref(currentRoute) // 获取当前视图的路径和查询参数
    await nextTick() // 等待下一次 DOM 更新
    replace({
      path: '/redirect' + path, // 重定向到新的路径
      query: query // 附加查询参数
    })
    callback?.() // 执行回调
  }

  /**
   * setTitle - 设置标签视图的标题
   * @param {string} title - 视图标题
   * @param {string} [path] - 可选的路径
   */
  const setTitle = (title: string, path?: string) => {
    tagsViewStore.setTitle(title, path) // 设置标题
  }

  return {
    /** 关闭所有标签视图 */
    closeAll,
    /** 关闭左侧标签视图 */
    closeLeft,
    /** 关闭右侧标签视图 */
    closeRight,
    /** 关闭其他标签视图 */
    closeOther,
    /** 关闭当前标签视图 */
    closeCurrent,
    /** 刷新当前页面 */
    refreshPage,
    /** 设置标签视图标题 */
    setTitle
  }
}
