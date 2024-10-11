/**
 * @file helper.ts
 * @description 处理和过滤面包屑导航的辅助函数
 * @example
 * const filteredRoutes = filterBreadcrumb(routes);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module breadcrumb
 */

// 导入工具函数 pathResolve
import { pathResolve } from '@/utils/routerHelper'

/**
 * 过滤面包屑导航的函数
 * @param {AppRouteRecordRaw[]} routes - 要过滤的路由数组
 * @param {string} [parentPath=''] - 父路径，默认为空字符串
 * @returns {AppRouteRecordRaw[]} 过滤后的路由数组
 */
export const filterBreadcrumb = (
	routes: AppRouteRecordRaw[],
	parentPath = ''
): AppRouteRecordRaw[] => {
	// 初始化一个空数组 res，用于存储过滤后的路由
	const res: AppRouteRecordRaw[] = []

	// 遍历传入的 routes 数组
	for (const route of routes) {
		// 获取当前路由的 meta 信息
		const meta = route?.meta
		// 如果 meta 中 hidden 为真且 不能跳转，则跳过此路由
		if (meta.hidden && !meta.canTo) {
			continue
		}

		// 根据 meta 信息和子路由数量决定 data 的值
		const data: AppRouteRecordRaw =
			!meta.alwaysShow && route.children?.length === 1
				? { ...route.children[0], path: pathResolve(route.path, route.children[0].path) } // 如果不总是显示且只有一个子路由，使用子路由
				: { ...route } // 否则直接使用当前路由

		// 将 data.path 设置为父路径和当前路径的组合
		data.path = pathResolve(parentPath, data.path)

		// 如果当前路由有子路由，则递归过滤子路由
		if (data.children) {
			data.children = filterBreadcrumb(data.children, data.path)
		}
		// 如果 data 存在，将其推入 res 数组
		if (data) {
			res.push(data)
		}
	}
	// 返回过滤后的路由数组
	return res
}
