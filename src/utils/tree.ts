/**
 * @file tree.ts
 * @description 提供树形结构相关的工具函数，包括列表与树的相互转换、节点查找、路径查找等操作。
 * @example
 * // 将列表转换为树
 * const tree = listToTree(data, { id: 'id', children: 'children', pid: 'parentId' });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-19
 * @module TreeHelper
 */

/**
 * @description 树工具类的配置接口，用于定义树结构中的 ID、子节点字段和父节点 ID 字段
 */
interface TreeHelperConfig {
  /** @description 节点的唯一标识字段名 */
  id: string
  /** @description 子节点数组字段名 */
  children: string
  /** @description 父节点的唯一标识字段名 */
  pid: string
}

/**
 * @description 默认的树工具类配置
 */
const DEFAULT_CONFIG: TreeHelperConfig = {
  /** 默认节点 ID 字段为 'id' */
  id: 'id',
  /** 默认子节点字段为 'children' */
  children: 'children',
  /** 默认父节点 ID 字段为 'pid' */
  pid: 'pid'
}

/**
 * 合并用户配置与默认配置
 * @param {Partial<TreeHelperConfig>} config 用户传入的配置
 * @returns {TreeHelperConfig} 合并后的完整配置
 */
const getConfig = (config: Partial<TreeHelperConfig>): TreeHelperConfig => {
  return Object.assign({}, DEFAULT_CONFIG, config)
}

/**
 * 将列表数据转换为树结构
 * @param {any[]} list 列表数据
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T[]} 转换后的树结构
 */
export const listToTree = <T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 创建节点映射表 */
  const nodeMap = new Map<string, any>()
  /** @description 存储最终生成的树结构 */
  const result: T[] = []
  /** @description 解构配置中的字段名 */
  const { id, children, pid } = conf

  /** @description 遍历列表数据，初始化映射表 */
  for (const node of list) {
    node[children] = node[children] || []
    nodeMap.set(node[id], node)
  }

  /** @description 遍历列表数据，根据父 ID 构建树结构 */
  for (const node of list) {
    const parent = nodeMap.get(node[pid])
    ;(parent ? parent[children] : result).push(node)
  }

  return result
}

/**
 * 将树结构转换为列表
 * @param {any} tree 树结构数据
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T[]} 转换后的列表
 */
export const treeToList = <T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T[] => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf
  /** @description 克隆树数据 */
  const result: any[] = [...tree]

  /** @description 遍历树数据，将所有节点展开为列表 */
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children]) continue
    result.splice(i + 1, 0, ...result[i][children])
  }

  return result
}

/**
 * 在树中查找符合条件的第一个节点
 * @param {any[]} tree 树结构数据
 * @param {(node: any) => boolean} func 匹配条件的回调函数
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T | null} 查找到的节点或 null
 */
export const findNode = <T = any>(
  tree: any[],
  func: (node: any) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T | null => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf
  /** @description 克隆树数据 */
  const list = [...tree]

  /** @description 遍历树数据，查找符合条件的第一个节点 */
  for (const node of list) {
    if (func(node)) return node
    if (node[children]) list.push(...node[children])
  }

  return null
}

/**
 * 遍历树，返回所有符合条件的节点
 * @param {any[]} tree 树结构数据
 * @param {(node: any) => boolean} func 匹配条件的回调函数
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T[]} 符合条件的所有节点
 */
export const findNodeAll = <T = any>(
  tree: any[],
  func: (node: any) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf
  /** @description 克隆树数据 */
  const list = [...tree]
  /** @description 存储符合条件的节点 */
  const result: T[] = []

  /** @description 遍历树数据，查找所有符合条件的节点 */
  for (const node of list) {
    if (func(node)) result.push(node)
    if (node[children]) list.push(...node[children])
  }

  return result
}

/**
 * 遍历树，查找符合条件的路径
 * @param {any[]} tree 树结构数据
 * @param {(node: any) => boolean} func 匹配条件的回调函数
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T[] | null} 符合条件的路径或 null
 */
export const findPath = <T = any>(
  tree: any[],
  func: (node: any) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] | null => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf
  /** @description 存储路径 */
  const path: T[] = []
  /** @description 克隆树数据 */
  const list = [...tree]
  /** @description 存储已访问的节点 */
  const visitedSet = new Set()

  /** @description 遍历树数据，查找符合条件的路径 */
  while (list.length) {
    const node = list.shift()
    if (!node) continue

    if (visitedSet.has(node)) {
      path.pop()
    } else {
      visitedSet.add(node)
      path.push(node)
      if (func(node)) return path
      if (node[children]) list.unshift(...node[children])
    }
  }

  return null
}

/**
 * 遍历树，查找所有符合条件的路径
 * @param {any[]} tree 树结构数据
 * @param {(node: any) => boolean} func 匹配条件的回调函数
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T[][]} 符合条件的所有路径
 */
export const findPathAll = <T = any>(
  tree: any[],
  func: (node: any) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[][] => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf
  /** @description 存储路径 */
  const path: T[] = []
  /** @description 克隆树数据 */
  const list = [...tree]
  /** @description 存储结果路径 */
  const result: T[][] = []
  /** @description 存储已访问的节点 */
  const visitedSet = new Set()

  /** @description 遍历树数据，查找所有符合条件的路径 */
  while (list.length) {
    const node = list.shift()
    if (!node) continue

    if (visitedSet.has(node)) {
      path.pop()
    } else {
      visitedSet.add(node)
      path.push(node)
      if (func(node)) result.push([...path])
      if (node[children]) list.unshift(...node[children])
    }
  }

  return result
}

/**
 * 过滤树，返回符合条件的节点和子节点
 * @param {T[]} tree 树结构数据
 * @param {(node: T) => boolean} func 匹配条件的回调函数
 * @param {Partial<TreeHelperConfig>} config 配置项
 * @returns {T[]} 符合条件的树结构
 */
export const filter = <T = any>(
  tree: T[],
  func: (node: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf

  /** @description 递归过滤树数据 */
  function listFilter(list: T[]): T[] {
    return list
      .map((node) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children])
        return func(node) || (node[children] && node[children].length)
      })
  }

  return listFilter(tree)
}

/**
 * 遍历树的每个节点
 * @param {T[]} tree 树结构数据
 * @param {(node: T) => any} func 处理节点的回调函数
 * @param {Partial<TreeHelperConfig>} config 配置项
 */
export const forEach = <T = any>(
  tree: T[],
  func: (node: T) => any,
  config: Partial<TreeHelperConfig> = {}
): void => {
  /** @description 合并用户配置与默认配置 */
  const conf = getConfig(config)
  /** @description 解构配置中的子节点字段 */
  const { children } = conf
  /** @description 克隆树数据 */
  const list = [...tree]

  /** @description 遍历树数据，执行回调函数 */
  for (let i = 0; i < list.length; i++) {
    if (func(list[i])) return // 如果回调函数返回 true，则停止遍历
    if (list[i][children]) list.splice(i + 1, 0, ...list[i][children])
  }
}

/**
 * 将树数据映射为新的结构
 * @param {T[]} treeData 树结构数据
 * @param {{ children?: string; conversion: (node: any) => any }} opt 配置项，包含子节点字段名和转换函数
 * @returns {T[]} 映射后的树结构
 */
export const treeMap = <T = any>(
  treeData: T[],
  opt: { children?: string; conversion: (node: any) => any }
): T[] => {
  return treeData.map((node) => treeMapEach(node, opt))
}

/**
 * 单个节点的映射操作
 * @param {any} data 节点数据
 * @param {{ children?: string; conversion: (node: any) => any }} opt 配置项，包含子节点字段名和转换函数
 * @returns {any} 映射后的节点
 */
export const treeMapEach = (
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: (node: any) => any }
): any => {
  const hasChildren = Array.isArray(data[children]) && data[children].length > 0
  const convertedData = conversion(data) || {}
  if (hasChildren) {
    return {
      ...convertedData,
      [children]: data[children].map((child: any) =>
        treeMapEach(child, {
          children,
          conversion
        })
      )
    }
  } else {
    return {
      ...convertedData
    }
  }
}

/**
 * 遍历树结构，执行回调函数
 * @param {any[]} treeDatas 树结构数据
 * @param {(node: any, parentNode: any) => any} callBack 回调函数，接收当前节点和父节点
 * @param {any} parentNode 父节点数据
 */
export const eachTree = (
  treeDatas: any[],
  callBack: (node: any, parentNode: any) => any,
  parentNode: any = {}
): void => {
  treeDatas.forEach((node) => {
    const newNode = callBack(node, parentNode) || node
    if (node.children) {
      eachTree(node.children, callBack, newNode)
    }
  })
}
