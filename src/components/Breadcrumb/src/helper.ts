/**
 * @file Breadcrumb 辅助函数
 * @description 提供处理面包屑导航的工具函数，包括路由过滤和路径解析
 * @example
 * import { filterBreadcrumb } from '@/components/Breadcrumb/src/helper'
 * const breadcrumb = filterBreadcrumb(routes)
 * @version 1.0.0
 * @date 2024-11-21
 * @module BreadcrumbHelper
 * @requires '@/utils/routerHelper'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入路径解析工具
import { pathResolve } from '@/utils/routerHelper'

/**
 * 过滤面包屑路由
 * @description 根据路由信息筛选出用于生成面包屑的路由，并处理子路由
 * @param {AppRouteRecordRaw[]} routes 路由配置数组
 * @param {string} [parentPath=''] 父路径，默认为空字符串
 * @returns {AppRouteRecordRaw[]} 筛选后的路由数组
 */
export const filterBreadcrumb = (
  routes: AppRouteRecordRaw[],
  parentPath = ''
): AppRouteRecordRaw[] => {
  /** 筛选后的路由结果 */
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    /** 获取路由的 meta 信息 */
    const meta = route?.meta

    // 如果路由被隐藏且不可跳转，跳过该路由
    if (meta.hidden && !meta.canTo) {
      continue
    }

    /**
     * 构造路由数据
     * 如果当前路由不强制显示（alwaysShow 为 false），且只有一个子路由，则直接使用子路由替代
     */
    const data: AppRouteRecordRaw =
      !meta.alwaysShow && route.children?.length === 1
        ? { ...route.children[0], path: pathResolve(route.path, route.children[0].path) }
        : { ...route }

    // 更新路径，合并父路径和当前路径
    data.path = pathResolve(parentPath, data.path)

    // 递归处理子路由
    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path)
    }

    // 将处理后的路由加入结果集
    if (data) {
      res.push(data)
    }
  }

  return res // 返回筛选后的路由结果
}
