/**
 * routerHelper.ts - Vue 路由帮助工具
 *
 * @description
 * 本文件定义了一系列用于处理 Vue 路由的 TypeScript 函数和工具，包括路由的生成、降级、路径解析等。
 * 这些功能主要用于 Vue.js 项目的路由管理中，帮助开发者更便捷地管理和控制路由，
 * 特别是在路由的动态加载、路由降级和路由的层级管理中。
 *
 * @example
 * 使用示例：
 * 生成路由：generateRoutesByFrontEnd(routes, keys, basePath)
 * 路径解析：pathResolve(parentPath, path)
 * 路由降级：flatMultiLevelRoutes(routes)
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 *
 * 安装lodash-es
 * https://juejin.cn/post/7354940462061715497
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import type {
	Router,
	RouteLocationNormalized,
	RouteRecordNormalized,
	RouteRecordRaw
} from 'vue-router'
// 引入自定义的 isUrl 函数和 lodash-es 提供的 omit 和 cloneDeep 函数
import { isUrl } from '@/utils/is'
import { omit, cloneDeep } from 'lodash-es'

// 使用 import.meta.glob 动态导入项目中的视图组件
const modules = import.meta.glob('../views/**/*.{vue,tsx}')

/**
 * 布局组件
 */
export const Layout = () => import('@/layout/Layout.vue')

/**
 * 获取父布局组件
 */
export const getParentLayout = () => {
	return () =>
		new Promise((resolve) => {
			resolve({
				name: 'ParentLayout'
			})
		})
}

/**
 * 获取原始路由对象
 * @param route 路由对象
 * @returns 原始路由对象
 */
export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
	if (!route) return route
	const { matched, ...opt } = route
	return {
		...opt,
		matched: (matched
			? matched.map((item) => ({
					meta: item.meta,
					name: item.name,
					path: item.path
				}))
			: undefined) as RouteRecordNormalized[]
	}
}

/**
 * 前端控制路由生成
 * @param routes 路由数组
 * @param keys 路径字符串数组
 * @param basePath 基础路径
 * @returns 生成的路由数组
 */
export const generateRoutesByFrontEnd = (
	routes: AppRouteRecordRaw[],
	keys: string[],
	basePath = '/'
): AppRouteRecordRaw[] => {
	const res: AppRouteRecordRaw[] = []

	for (const route of routes) {
		const meta = route.meta ?? {}
		// skip some route
		if (meta.hidden && !meta.canTo) {
			continue
		}

		let data: Nullable<AppRouteRecordRaw> = null

		let onlyOneChild: Nullable<string> = null
		if (route.children && route.children.length === 1 && !meta.alwaysShow) {
			onlyOneChild = (
				isUrl(route.children[0].path)
					? route.children[0].path
					: pathResolve(pathResolve(basePath, route.path), route.children[0].path)
			) as string
		}

		// 开发者可以根据实际情况进行扩展
		for (const item of keys) {
			// 通过路径去匹配
			if (isUrl(item) && (onlyOneChild === item || route.path === item)) {
				data = Object.assign({}, route)
			} else {
				const routePath = (onlyOneChild ?? pathResolve(basePath, route.path)).trim()
				if (routePath === item || meta.followRoute === item) {
					data = Object.assign({}, route)
				}
			}
		}

		// recursive child routes
		if (route.children && data) {
			data.children = generateRoutesByFrontEnd(
				route.children,
				keys,
				pathResolve(basePath, data.path)
			)
		}
		if (data) {
			res.push(data as AppRouteRecordRaw)
		}
	}
	return res
}

/**
 * 后端控制路由生成
 * @param routes 自定义路由数组
 * @returns 生成的路由数组
 */
export const generateRoutesByServer = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
	const res: AppRouteRecordRaw[] = []

	for (const route of routes) {
		const data: AppRouteRecordRaw = {
			path: route.path,
			name: route.name,
			redirect: route.redirect,
			meta: route.meta
		}
		if (route.component) {
			const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
			const component = route.component as string
			if (!comModule && !component.includes('#')) {
				console.error(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`)
			} else {
				// 动态加载路由文件，可根据实际情况进行自定义逻辑
				data.component =
					component === '#' ? Layout : component.includes('##') ? getParentLayout() : comModule
			}
		}
		// recursive child routes
		if (route.children) {
			data.children = generateRoutesByServer(route.children)
		}
		res.push(data as AppRouteRecordRaw)
	}
	return res
}

/**
 * 路径解析
 * @param parentPath 父路径
 * @param path 子路径
 * @returns 解析后的路径
 */
export const pathResolve = (parentPath: string, path: string) => {
	if (isUrl(path)) return path
	const childPath = path.startsWith('/') || !path ? path : `/${path}`
	return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

/**
 * 路由降级
 * @param routes 路由数组
 * @returns 降级后的路由数组
 */
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
	const modules: AppRouteRecordRaw[] = cloneDeep(routes)
	for (let index = 0; index < modules.length; index++) {
		const route = modules[index]
		if (!isMultipleRoute(route)) {
			continue
		}
		promoteRouteLevel(route)
	}
	return modules
}

/**
 * 判断是否为多层路由
 * @param route 路由对象
 * @returns 是否为多层路由
 */
const isMultipleRoute = (route: AppRouteRecordRaw) => {
	if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
		return false
	}

	const children = route.children

	let flag = false
	for (let index = 0; index < children.length; index++) {
		const child = children[index]
		if (child.children?.length) {
			flag = true
			break
		}
	}
	return flag
}

/**
 * 生成二级路由
 * @param route 路由对象
 */
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
	let router: Router | null = createRouter({
		routes: [route as RouteRecordRaw],
		history: createWebHashHistory()
	})

	const routes = router.getRoutes()
	addToChildren(routes, route.children || [], route)
	router = null

	route.children = route.children?.map((item) => omit(item, 'children'))
}

/**
 * 添加所有子菜单
 * @param routes 路由数组
 * @param children 子路由数组
 * @param routeModule 路由模块
 */
const addToChildren = (
	routes: RouteRecordNormalized[],
	children: AppRouteRecordRaw[],
	routeModule: AppRouteRecordRaw
) => {
	for (let index = 0; index < children.length; index++) {
		const child = children[index]
		const route = routes.find((item) => item.name === child.name)
		if (!route) {
			continue
		}
		routeModule.children = routeModule.children || []
		if (!routeModule.children.find((item) => item.name === route.name)) {
			routeModule.children?.push(route as unknown as AppRouteRecordRaw)
		}
		if (child.children?.length) {
			addToChildren(routes, child.children, routeModule)
		}
	}
}
