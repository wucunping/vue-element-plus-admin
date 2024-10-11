/**
 * @file helper.ts
 * @description 该文件包含与菜单和路由相关的帮助函数。
 * @example
 * // 示例用法
 * const routes = [...]; // 路由数组
 * initTabMap(routes); // 初始化标签路径映射
 * const filteredMenus = filterMenusPath(routes, allRoutes); // 过滤菜单路径
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module MenuHelper
 */

import { getAllParentPath } from '@/components/Menu/src/helper' // 导入获取所有父路径的函数
import { isUrl } from '@/utils/is' // 导入检查是否为URL的函数
import { cloneDeep } from 'lodash-es' // 导入lodash的深拷贝方法
import { reactive } from 'vue' // 导入Vue的响应式处理函数

/**
 * 定义标签映射类型，用于存储路径与标签的映射关系
 */
export type TabMapTypes = {
	[key: string]: string[] // 键为字符串，值为字符串数组
}

/**
 * 反应式的标签路径映射对象
 */
export const tabPathMap = reactive<TabMapTypes>({}) // 初始化空的响应式对象

/**
 * 初始化标签路径映射
 * @param routes - 应用路由记录数组
 */
export const initTabMap = (routes: AppRouteRecordRaw[]) => {
	for (const v of routes) {
		// 遍历所有路由
		const meta = v.meta ?? {} // 获取路由的元数据，默认为空对象
		if (!meta?.hidden) {
			// 如果路由未隐藏
			tabPathMap[v.path] = [] // 在标签路径映射中添加该路径，初始值为空数组
		}
	}
}

/**
 * 过滤菜单路径
 * @param routes - 需要过滤的路由数组
 * @param allRoutes - 所有路由数组
 * @returns 过滤后的路由数组
 */
export const filterMenusPath = (
	routes: AppRouteRecordRaw[], // 需要过滤的路由数组
	allRoutes: AppRouteRecordRaw[] // 所有可用的路由数组
): AppRouteRecordRaw[] => {
	const res: AppRouteRecordRaw[] = [] // 初始化结果数组
	for (const v of routes) {
		// 遍历传入的路由数组
		let data: Nullable<AppRouteRecordRaw> = null // 初始化数据为null
		const meta = v.meta ?? {} // 获取当前路由的元数据
		if (!meta.hidden || meta.canTo) {
			// 如果路由未隐藏或允许访问
			const allParentPath = getAllParentPath<AppRouteRecordRaw>(allRoutes, v.path) // 获取当前路由的所有父路径

			const fullPath = isUrl(v.path) ? v.path : allParentPath.join('/') // 如果路径是URL则直接使用，否则拼接父路径

			data = cloneDeep(v) // 深拷贝当前路由以避免修改原始路由
			data.path = fullPath // 更新路由的路径为完整路径
			if (v.children && data) {
				// 如果路由有子路由并且数据不为null
				data.children = filterMenusPath(v.children, allRoutes) // 递归过滤子路由
			}

			if (data) {
				// 如果数据不为null
				res.push(data) // 将当前路由数据添加到结果数组
			}

			if (allParentPath.length && Reflect.has(tabPathMap, allParentPath[0])) {
				// 如果有父路径且标签路径映射中存在该父路径
				tabPathMap[allParentPath[0]].push(fullPath) // 将完整路径添加到标签路径映射中的对应父路径下
			}
		}
	}

	return res // 返回过滤后的路由数组
}
