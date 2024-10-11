/**
 * @file helper.ts
 * @description 路由辅助工具，提供过滤 affix 标签的功能
 * @example
 * const routes = [...]; // 假设有一个路由数组
 * const affixTags = filterAffixTags(routes);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module routerHelper
 */

// 导入 Vue Router 中的 RouteLocationNormalizedLoaded 类型
import type { RouteLocationNormalizedLoaded } from 'vue-router'
// 导入路径解析工具函数
import { pathResolve } from '@/utils/routerHelper'

/**
 * 过滤出具有 affix 标签的路由
 * @param routes - 路由记录数组
 * @param parentPath - 父路径，默认值为空字符串
 * @returns 返回包含 affix 标签的路由
 */
export const filterAffixTags = (routes: AppRouteRecordRaw[], parentPath = '') => {
	// 初始化一个空数组，用于存放 affix 标签的路由
	let tags: RouteLocationNormalizedLoaded[] = []

	// 遍历传入的路由数组
	routes.forEach((route) => {
		// 获取当前路由的 meta 信息，如果没有则赋值为空对象
		const meta = route.meta ?? {}
		// 解析当前路由的完整路径
		const tagPath = pathResolve(parentPath, route.path)

		// 如果路由的 meta 中包含 affix 属性，则将其加入 tags 数组
		if (meta?.affix) {
			tags.push({ ...route, path: tagPath, fullPath: tagPath } as RouteLocationNormalizedLoaded)
		}

		// 如果当前路由有子路由，则递归调用 filterAffixTags 过滤子路由
		if (route.children) {
			// 调用递归函数并保存返回的结果
			const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath)
			// 如果结果数组不为空，则将其合并到 tags 数组中
			if (tempTags.length >= 1) {
				tags = [...tags, ...tempTags]
			}
		}
	})

	// 返回过滤后的 tags 数组
	return tags
}
