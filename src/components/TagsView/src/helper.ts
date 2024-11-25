/**
 * @file helper.ts
 * @description 标签视图相关的辅助方法，用于过滤具有 affix 属性的路由标签
 * @example
 * import { filterAffixTags } from '@/components/TagsView/src/helper'
 * @version 1.0.0
 * @date 2024-11-22
 * @module src/components/TagsView/src/helper.ts
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Vue Router 中的类型
import type { RouteLocationNormalizedLoaded } from 'vue-router'
// 导入路径解析工具
import { pathResolve } from '@/utils/routerHelper'

/**
 * @function 过滤具有 affix 属性的路由标签
 * @description 遍历路由数组，筛选出标记为 affix 的路由标签，并解析其路径
 * @param {AppRouteRecordRaw[]} routes 路由数组
 * @param {string} [parentPath=''] 父级路径
 * @returns {RouteLocationNormalizedLoaded[]} 具有 affix 属性的路由标签数组
 */
export const filterAffixTags = (routes: AppRouteRecordRaw[], parentPath = '') => {
  let tags: RouteLocationNormalizedLoaded[] = [] // 初始化标签数组
  routes.forEach((route) => {
    const meta = route.meta ?? {} // 获取路由的元信息
    const tagPath = pathResolve(parentPath, route.path) // 解析当前路由的完整路径
    if (meta?.affix) {
      // 如果路由具有 affix 属性，加入标签数组
      tags.push({ ...route, path: tagPath, fullPath: tagPath } as RouteLocationNormalizedLoaded)
    }
    if (route.children) {
      // 如果存在子路由，递归处理子路由
      const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath)
      if (tempTags.length >= 1) {
        // 如果子路由中有 affix 标签，则将其合并到标签数组中
        tags = [...tags, ...tempTags]
      }
    }
  })

  return tags // 返回最终的标签数组
}
