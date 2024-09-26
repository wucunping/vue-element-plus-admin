/**
 * src/utils/tree.ts - Vue 路由和树形结构帮助工具
 *
 * @description
 * 本文件定义了一系列用于处理 Vue 路由和树形结构的 TypeScript 函数和工具。
 * 这些功能主要用于 Vue.js 项目的路由管理和树形数据处理，包括路由的生成、降级、路径解析，以及树形数据的构建、提取、过滤、遍历等。
 * 这些工具函数帮助开发者更便捷地管理和控制路由，特别是在路由的动态加载、路由降级和路由的层级管理中，以及在处理树形数据时，如树的构建、遍历和提取特定结构等。
 *
 * @example
 * 使用示例：
 * 生成路由：generateRoutesByFrontEnd(routes, keys, basePath)
 * 路径解析：pathResolve(parentPath, path)
 * 路由降级：flatMultiLevelRoutes(routes)
 * 提取树形结构指定结构：treeMap(treeData, opt)
 * 递归遍历树形结构：eachTree(treeDatas, callBack, parentNode)
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

// 定义TreeHelperConfig接口，用于定义树形结构的配置
interface TreeHelperConfig {
	/** 节点ID */
	id: string
	/** 子节点属性名 */
	children: string
	/** 父节点ID */
	pid: string
}

/**
 * 定义默认的TreeHelperConfig配置
 */
const DEFAULT_CONFIG: TreeHelperConfig = {
	id: 'id',
	children: 'children',
	pid: 'pid'
}

/**
 * 获取配置对象，合并默认配置和自定义配置
 */
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config)

/**
 * 将列表转化为树形结构
 * @param list 列表
 * @param config 配置对象
 * @returns 树形结构
 */
export const listToTree = <T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] => {
	// 获取配置对象
	const conf = getConfig(config) as TreeHelperConfig
	// 创建一个映射，用于快速查找节点
	const nodeMap = new Map()
	// 初始化结果列表
	const result: T[] = []

	// 提取配置中的id、children和pid
	const { id, children, pid } = conf

	// 遍历列表，设置节点的children属性并创建节点映射
	for (const node of list) {
		node[children] = node[children] || []
		nodeMap.set(node[id], node)
	}

	// 遍历列表，根据pid找到父节点，并将节点添加到对应的父节点的children中，或添加到结果列表中
	for (const node of list) {
		const parent = nodeMap.get(node[pid])
		;(parent ? parent.children : result).push(node)
	}

	// 返回结果列表
	return result
}

/**
 * 将树形结构转化为列表
 * @param tree 树形结构
 * @param config 配置对象
 * @returns 列表
 */
export const treeToList = <T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T => {
	// 获取配置对象
	config = getConfig(config)
	// 提取配置中的children属性
	const { children } = config
	// 初始化结果列表
	const result: any = [...tree]

	// 遍历列表，将子节点插入到父节点之前，并将父节点的children属性设置为null
	for (let i = 0; i < result.length; i++) {
		if (!result[i][children!]) continue
		result.splice(i + 1, 0, ...result[i][children!])
	}

	// 返回结果列表
	return result
}

/**
 * 在树形结构中查找符合条件的节点
 * @param tree 树形结构
 * @param func 查找条件函数
 * @param config 配置对象
 * @returns 符合条件的节点，或null
 */
export const findNode = <T = any>(
	tree: any,
	func: Function,
	config: Partial<TreeHelperConfig> = {}
): T | null => {
	// 获取配置对象
	config = getConfig(config)
	// 提取配置中的children属性
	const { children } = config
	// 初始化结果列表
	const list = [...tree]

	// 遍历列表，如果找到符合条件的节点则返回，否则将子节点添加到列表中继续查找
	for (const node of list) {
		if (func(node)) return node
		node[children!] && list.push(...node[children!])
	}

	// 如果没有找到符合条件的节点则返回null
	return null
}

/**
 * 在树形结构中查找所有符合条件的节点
 * @param tree 树形结构
 * @param func 查找条件函数
 * @param config 配置对象
 * @returns 符合条件的节点列表
 */
export const findNodeAll = <T = any>(
	tree: any,
	func: Function,
	config: Partial<TreeHelperConfig> = {}
): T[] => {
	// 获取配置对象
	config = getConfig(config)
	// 提取配置中的children属性
	const { children } = config
	// 初始化结果列表
	const list = [...tree]
	const result: T[] = []

	// 遍历列表，如果找到符合条件的节点则添加到结果列表中，否则将子节点添加到列表中继续查找
	for (const node of list) {
		func(node) && result.push(node)
		node[children!] && list.push(...node[children!])
	}

	// 返回结果列表
	return result
}

/**
 * 在树形结构中查找路径
 * @param tree 树形结构
 * @param func 查找条件函数
 * @param config 配置对象
 * @returns 符合条件的路径，或null
 */
export const findPath = <T = any>(
	tree: any,
	func: Function,
	config: Partial<TreeHelperConfig> = {}
): T | T[] | null => {
	// 获取配置对象
	config = getConfig(config)
	// 初始化路径列表
	const path: T[] = []
	// 初始化节点列表
	const list = [...tree]
	// 创建一个集合，用于存储已经访问过的节点
	const visitedSet = new Set()
	// 提取配置中的children属性
	const { children } = config

	// 遍历列表，如果找到符合条件的节点则返回路径，否则将子节点添加到列表中继续查找
	while (list.length) {
		const node = list[0]
		if (visitedSet.has(node)) {
			path.pop()
			list.shift()
		} else {
			visitedSet.add(node)
			node[children!] && list.unshift(...node[children!])
			path.push(node)
			if (func(node)) {
				return path
			}
		}
	}

	// 如果没有找到符合条件的节点则返回null
	return null
}

/**
 * 在树形结构中查找所有路径
 * @param tree 树形结构
 * @param func 查找条件函数
 * @param config 配置对象
 * @returns 符合条件的路径列表
 */
export const findPathAll = (tree: any, func: Function, config: Partial<TreeHelperConfig> = {}) => {
	// 获取配置对象
	config = getConfig(config)
	// 初始化路径列表
	const path: any[] = []
	// 初始化节点列表
	const list = [...tree]
	// 创建一个集合，用于存储已经访问过的节点
	const visitedSet = new Set(),
		{ children } = config

	// 遍历列表，如果找到符合条件的节点则将路径添加到结果列表中，否则将子节点添加到列表中继续查找
	while (list.length) {
		const node = list[0]
		if (visitedSet.has(node)) {
			path.pop()
			list.shift()
		} else {
			visitedSet.add(node)
			node[children!] && list.unshift(...node[children!])
			path.push(node)
			func(node) && result.push([...path])
		}
	}

	// 返回结果列表
	return result
}

/**
 * 过滤树形结构
 * @param tree 树形结构
 * @param func 过滤条件函数
 * @param config 配置对象
 * @returns 过滤后的树形结构
 */
export const filter = <T = any>(
	tree: T[],
	func: (n: T) => boolean,
	config: Partial<TreeHelperConfig> = {}
): T[] => {
	// 获取配置对象
	config = getConfig(config)
	// 提取配置中的children属性
	const children = config.children as string

	// 定义一个函数用于过滤列表
	function listFilter(list: T[]) {
		return list
			.map((node: any) => ({ ...node }))
			.filter((node) => {
				node[children] = node[children] && listFilter(node[children])
				return func(node) || (node[children] && node[children].length)
			})
	}

	// 返回过滤后的树形结构
	return listFilter(tree)
}

/**
 * 遍历树形结构
 * @param tree 树形结构
 * @param func 遍历函数
 * @param config 配置对象
 */
export const forEach = <T = any>(
	tree: T[],
	func: (n: T) => any,
	config: Partial<TreeHelperConfig> = {}
): void => {
	// 获取配置对象
	config = getConfig(config)
	// 提取配置中的children属性
	const { children } = config
	// 初始化节点列表
	const list: any[] = [...tree]

	// 遍历列表，如果func返回true则终止遍历
	for (let i = 0; i < list.length; i++) {
		if (func(list[i])) {
			return
		}
		children && list[i][children] && list.splice(i + 1, 0, ...list[i][children])
	}
}

/**
 * 提取树形结构指定结构
 * @param treeData 树形结构数据
 * @param opt 配置对象，包含children和conversion两个属性
 * @returns 提取后的树形结构数据
 */
export const treeMap = <T = any>(
	treeData: T[],
	opt: { children?: string; conversion: Function }
): T[] => {
	return treeData.map((item) => treeMapEach(item, opt))
}

/**
 * 提取树形结构指定结构
 * @param data 树形结构数据
 * @param opt 配置对象，包含children和conversion两个属性
 * @returns 提取后的树形结构数据
 */
export const treeMapEach = (
	data: any,
	{ children = 'children', conversion }: { children?: string; conversion: Function }
) => {
	const haveChildren = Array.isArray(data[children]) && data[children].length > 0
	const conversionData = conversion(data) || {}
	if (haveChildren) {
		return {
			...conversionData,
			[children]: data[children].map((i: number) =>
				treeMapEach(i, {
					children,
					conversion
				})
			)
		}
	} else {
		return {
			...conversionData
		}
	}
}

/**
 * 递归遍历树形结构
 * @param treeDatas 树形结构数据
 * @param callBack 遍历函数
 * @param parentNode 父节点
 */
export const eachTree = (treeDatas: any[], callBack: Function, parentNode = {}) => {
	treeDatas.forEach((element) => {
		const newNode = callBack(element, parentNode) || element
		if (element.children) {
			eachTree(element.children, callBack, newNode)
		}
	})
}
