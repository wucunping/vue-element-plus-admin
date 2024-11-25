/**
 * @file helper.ts
 * @description Tab 菜单相关的辅助方法，用于处理路由和路径映射
 * @example
 * import { initTabMap, filterMenusPath } from '@/components/TabMenu/src/helper'
 * @version 1.0.0
 * @date 2024-11-22
 * @module src/components/TabMenu/src/helper.ts
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入获取所有父路径的方法
import { getAllParentPath } from '@/components/Menu/src/helper'
// 导入判断路径是否为 URL 的方法
import { isUrl } from '@/utils/is'
// 从 lodash-es 导入深度克隆方法
import { cloneDeep } from 'lodash-es'
// 从 vue 导入 reactive，用于创建响应式数据
import { reactive } from 'vue'

/** Tab 路径映射的类型 */
export type TabMapTypes = {
  /** 键为路径，值为路径数组 */
  [key: string]: string[]
}

/** Tab 路径映射的响应式对象 */
export const tabPathMap = reactive<TabMapTypes>({})

/**
 * @function 初始化 Tab 路径映射
 * @description 遍历路由，初始化每个未隐藏路由的路径映射
 * @param {AppRouteRecordRaw[]} routes 路由数组
 */
export const initTabMap = (routes: AppRouteRecordRaw[]) => {
  for (const v of routes) {
    const meta = v.meta ?? {} // 获取路由的元信息
    if (!meta?.hidden) {
      tabPathMap[v.path] = [] // 初始化路径映射为空数组
    }
  }
}

/**
 * @function 过滤菜单路径
 * @description 根据路由数据生成完整路径并更新 Tab 路径映射
 * @param {AppRouteRecordRaw[]} routes 当前路由数组
 * @param {AppRouteRecordRaw[]} allRoutes 所有路由数组
 * @returns {AppRouteRecordRaw[]} 过滤后的路由数组
 */
export const filterMenusPath = (
  routes: AppRouteRecordRaw[],
  allRoutes: AppRouteRecordRaw[]
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = [] // 初始化结果数组
  for (const v of routes) {
    let data: Nullable<AppRouteRecordRaw> = null // 初始化当前路由对象
    const meta = v.meta ?? {} // 获取路由的元信息
    if (!meta.hidden || meta.canTo) {
      // 如果路由未隐藏或可跳转
      const allParentPath = getAllParentPath<AppRouteRecordRaw>(allRoutes, v.path) // 获取所有父路径
      const fullPath = isUrl(v.path) ? v.path : allParentPath.join('/') // 生成完整路径

      data = cloneDeep(v) // 深度克隆当前路由
      data.path = fullPath // 设置完整路径
      if (v.children && data) {
        // 如果存在子路由
        data.children = filterMenusPath(v.children, allRoutes) // 递归处理子路由
      }

      if (data) {
        res.push(data) // 将处理后的路由加入结果数组
      }

      if (allParentPath.length && Reflect.has(tabPathMap, allParentPath[0])) {
        // 更新 Tab 路径映射
        tabPathMap[allParentPath[0]].push(fullPath)
      }
    }
  }

  return res // 返回过滤后的路由数组
}
