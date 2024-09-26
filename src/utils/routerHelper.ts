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

// 从 'vue-router' 库导入 createRouter 和 createWebHashHistory 方法
import { createRouter, createWebHashHistory } from 'vue-router'

// 从 'vue-router' 库导入类型声明，分别用于路由、标准化的路由位置和路由记录
import type {
	Router, // Router 类型
	RouteLocationNormalized, // 规范化的路由位置类型
	RouteRecordNormalized, // 规范化的路由记录类型
	RouteRecordRaw // 原始路由记录类型
} from 'vue-router'

// 从 '@/utils/is' 模块导入 isUrl 函数，用于判断字符串是否是有效的 URL
import { isUrl } from '@/utils/is'

// 从 'lodash-es' 库导入 omit 和 cloneDeep 函数
import { omit, cloneDeep } from 'lodash-es'

/**
 * 使用 import.meta.glob 动态导入项目中的视图组件
 */
const modules = import.meta.glob('../views/**/*.{vue,tsx}')

/**
 * 布局组件
 */
export const Layout = () => import('@/layout/Layout.vue')

/**
 * 获取父布局组件
 */
export const getParentLayout = () => {
	// 返回一个新函数，该函数返回一个 Promise
	return () =>
		new Promise((resolve) => {
			// 当 Promise 被调用时，执行 resolve 函数
			resolve({
				// 返回一个对象，其中包含 name 属性，值为 'ParentLayout'
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
	// 检查传入的 route 是否为 falsy 值，若是，则直接返回 route
	if (!route) return route

	// 从 route 对象中解构出 matched 属性和其他选项
	const { matched, ...opt } = route

	// 返回一个新对象，包含原有的选项和处理后的 matched 属性
	return {
		...opt, // 扩展原有选项
		// 处理 matched 属性，如果 matched 存在，则将其映射为新的数组
		matched: (matched
			? matched.map((item) => ({
					// 返回每个 matched 项的 meta、name 和 path 属性
					meta: item.meta,
					name: item.name,
					path: item.path
				}))
			: undefined) as RouteRecordNormalized[] // 如果 matched 不存在，返回 undefined，并指定类型
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
	routes: AppRouteRecordRaw[], // 路由数组
	keys: string[], // 键数组
	basePath = '/' // 基础路径，默认为根路径 '/'
): AppRouteRecordRaw[] => {
	// 返回值类型为 AppRouteRecordRaw 数组
	const res: AppRouteRecordRaw[] = [] // 初始化一个空数组，用于存储结果

	// 遍历传入的路由数组
	for (const route of routes) {
		const meta = route.meta ?? {} // 获取当前路由的 meta 信息，如果不存在则使用空对象

		// 检查 meta.hidden 和 meta.canTo 属性，决定是否跳过该路由
		if (meta.hidden && !meta.canTo) {
			continue // 跳过当前循环，继续下一个路由
		}

		let data: Nullable<AppRouteRecordRaw> = null // 初始化一个用于存储路由数据的变量

		let onlyOneChild: Nullable<string> = null // 初始化变量，用于存储只有一个子路由的路径
		// 检查当前路由是否有子路由且只有一个子路由，并且 meta.alwaysShow 属性未设定
		if (route.children && route.children.length === 1 && !meta.alwaysShow) {
			// 判断子路由路径是否为 URL 或者拼接路径
			onlyOneChild = (
				isUrl(route.children[0].path) // 如果是 URL
					? route.children[0].path // 直接使用该路径
					: pathResolve(pathResolve(basePath, route.path), route.children[0].path)
			) as string // 否则根据基础路径拼接路径
		}

		// 开发者可以根据实际情况进行扩展
		for (const item of keys) {
			// 通过路径去匹配
			if (isUrl(item) && (onlyOneChild === item || route.path === item)) {
				data = Object.assign({}, route) // 如果匹配成功，复制当前路由数据
			} else {
				// 用拼接的路径对比
				const routePath = (onlyOneChild ?? pathResolve(basePath, route.path)).trim() // 获取当前路由的路径
				// 如果路径匹配或跟随的路由匹配
				if (routePath === item || meta.followRoute === item) {
					data = Object.assign({}, route) // 复制当前路由数据
				}
			}
		}

		// 对于含有子路由的当前路由，递归生成子路由
		if (route.children && data) {
			data.children = generateRoutesByFrontEnd(
				// 生成子路由
				route.children, // 当前路由的子路由
				keys, // 键数组
				pathResolve(basePath, data.path) // 拼接路径
			)
		}
		// 如果成功匹配到数据，将其添加到结果数组中
		if (data) {
			res.push(data as AppRouteRecordRaw) // 将当前匹配的数据加入结果数组
		}
	}
	// 返回最终生成的路由数组
	return res
}

/**
 * 后端控制路由生成
 * @param routes 自定义路由数组
 * @returns 生成的路由数组
 */
export const generateRoutesByServer = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
	// 初始化一个空数组，用于存储结果
	const res: AppRouteRecordRaw[] = []

	// 遍历传入的路由数组
	for (const route of routes) {
		// 创建一个新的路由数据对象，包含当前路由的路径、名称、重定向和元信息
		const data: AppRouteRecordRaw = {
			path: route.path, // 当前路由的路径
			name: route.name, // 当前路由的名称
			redirect: route.redirect, // 当前路由的重定向（如果有的话）
			meta: route.meta // 当前路由的元信息（如权限、标题等）
		}

		// 检查当前路由是否有组件，如果有则进行处理
		if (route.component) {
			// 尝试动态引入当前路由组件，支持 .vue 和 .tsx 文件后缀
			const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
			const component = route.component as string // 将组件转换为字符串类型
			// 检查找到的组件模块是否存在，并且组件名称不包含 '#'
			if (!comModule && !component.includes('#')) {
				// 如果未找到对应的组件文件，打印错误信息
				console.error(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`)
			} else {
				// 动态加载路由文件，根据组件类型进行自定义逻辑处理
				data.component =
					component === '#' ? Layout : component.includes('##') ? getParentLayout() : comModule // 根据条件选择组件
			}
		}

		// 检查当前路由是否有子路由，如果有则递归处理
		if (route.children) {
			// 递归调用 generateRoutesByServer 为子路由生成路由数据
			data.children = generateRoutesByServer(route.children)
		}

		// 将生成的路由数据添加到结果数组中
		res.push(data as AppRouteRecordRaw) // 将当前路由数据加入结果
	}

	// 返回生成的路由数组
	return res
}

/**
 * 路径解析
 * @param parentPath 父路径
 * @param path 子路径
 * @returns 解析后的路径
 */
export const pathResolve = (parentPath: string, path: string) => {
	// 如果子路径是一个有效的 URL，直接返回该路径
	if (isUrl(path)) return path

	// 判断子路径是否以斜杠开头或为空，如果不满足则在前面加上斜杠
	const childPath = path.startsWith('/') || !path ? path : `/${path}`

	// 合并父路径和子路径，并替换多余的斜杠，最后去除首尾空格，返回结果
	return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

/**
 * 路由降级
 * @param routes 路由数组
 * @returns 降级后的路由数组
 */
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
	// 使用 cloneDeep 深拷贝传入的路由数组，以避免修改原数组
	const modules: AppRouteRecordRaw[] = cloneDeep(routes)

	// 遍历深拷贝的路由数组
	for (let index = 0; index < modules.length; index++) {
		// 获取当前索引对应的路由对象
		const route = modules[index]

		// 检查当前路由是否为多级路由，如果不是则跳过
		if (!isMultipleRoute(route)) {
			continue // 继续下一个循环
		}

		// 调用 promoteRouteLevel 函数提升当前路由的级别
		promoteRouteLevel(route)
	}

	// 返回处理后的路由数组
	return modules
}

/**
 * 判断是否为多层路由
 * @param route 路由对象
 * @returns 是否为多层路由
 */
const isMultipleRoute = (route: AppRouteRecordRaw) => {
	// 检查路由对象是否存在，且它具有 'children' 属性，并且该属性是有效的数组且长度大于 0
	if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
		return false // 如果条件不满足，则返回 false，表示不是多级路由
	}

	// 获取当前路由的子路由数组
	const children = route.children

	// 初始化一个标志变量，用于指示是否存在多级路由
	let flag = false

	// 遍历当前路由的所有子路由
	for (let index = 0; index < children.length; index++) {
		// 获取当前子路由
		const child = children[index]

		// 检查当前子路由是否有子路由
		if (child.children?.length) {
			flag = true // 如果有子路由，标志变量设置为 true
			break // 由于找到了多级路由，退出循环
		}
	}

	// 返回标志变量的值，表示是否存在多级路由
	return flag
}

/**
 * 生成二级路由
 * @param route 路由对象
 */
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
	// 创建一个新的 Router 实例，传入包含当前路由的数组和历史记录类型
	let router: Router | null = createRouter({
		routes: [route as RouteRecordRaw], // 将当前路由包裹在数组中
		history: createWebHashHistory() // 使用 hash 模式的路由历史
	})

	// 获取路由实例的所有路由
	const routes = router.getRoutes()

	// 调用 addToChildren 函数，将现有路由的子路由添加到当前路由的 children 属性中
	addToChildren(routes, route.children || [], route) // 传入当前路由的子路由，确保处理可选的情况
	router = null // 将 router 设置为 null，释放资源

	// 用 omit 函数去除当前路由对象中的 'children' 属性，更新其子路由
	route.children = route.children?.map((item) => omit(item, 'children')) // 遍历并清理每个子路由
}

/**
 * 添加所有子菜单
 * @param routes 路由数组
 * @param children 子路由数组
 * @param routeModule 路由模块
 */
const addToChildren = (
	routes: RouteRecordNormalized[], // 已经规范化的路由列表
	children: AppRouteRecordRaw[], // 当前路由的子路由
	routeModule: AppRouteRecordRaw // 当前路由模块
) => {
	// 遍历传入的子路由数组
	for (let index = 0; index < children.length; index++) {
		// 获取当前子路由
		const child = children[index]

		// 在规范化的路由列表中查找名称与当前子路由名称相同的路由
		const route = routes.find((item) => item.name === child.name)

		// 如果未找到对应的路由，继续下一个循环
		if (!route) {
			continue
		}

		// 初始化当前路由模块的 children 属性，确保其存在
		routeModule.children = routeModule.children || []

		// 如果当前路由模块的 children 中没有与找到的路由同名的路由，则添加它
		if (!routeModule.children.find((item) => item.name === route.name)) {
			// 将找到的路由添加到当前路由模块的 children 中
			routeModule.children?.push(route as unknown as AppRouteRecordRaw)
		}

		// 如果当前子路由有子路由，递归添加到当前路由模块
		if (child.children?.length) {
			addToChildren(routes, child.children, routeModule) // 递归调用自身处理子路由
		}
	}
}
