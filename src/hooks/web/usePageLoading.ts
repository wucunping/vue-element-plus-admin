/**
 * @file usePageLoading.ts
 * @description 页面加载状态管理的自定义钩子
 * @example
 * const { loadStart, loadDone } = usePageLoading();
 * loadStart();  // 开始加载
 * loadDone();   // 加载完成
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module Hooks
 */

import { useAppStoreWithOut } from '@/store/modules/app' // 导入应用状态管理模块

/**
 * 自定义钩子，用于管理页面加载状态
 * @returns {Object} 包含 loadStart 和 loadDone 方法
 */
export const usePageLoading = () => {
  /**
   * 开始加载
   */
  const loadStart = () => {
    const appStore = useAppStoreWithOut() // 获取应用状态管理实例

    appStore.setPageLoading(true) // 设置页面加载状态为 true
  }

  /**
   * 加载完成
   */
  const loadDone = () => {
    const appStore = useAppStoreWithOut() // 获取应用状态管理实例

    appStore.setPageLoading(false) // 设置页面加载状态为 false
  }

  // 返回开始加载和完成加载的方法
  return {
    /** 开始加载 */
    loadStart,
    /** 加载完成 */
    loadDone
  }
}
