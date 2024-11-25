/**
 * @file /src/components/Menu/src/helper.ts
 * @description 提供菜单相关的辅助方法，例如获取所有父路径和判断子菜单项显示逻辑
 * @example 使用方式：getAllParentPath(treeData, path), hasOneShowingChild(children, parent)
 * @version 1.0.0
 * @date 2024-11-22
 * @module MenuHelperModule
 * @typeparam T 定义返回数据类型
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 Vue 引入 ref 和 unref 工具，用于管理响应式数据
import { ref, unref } from 'vue'

// 引入树操作工具 findPath，用于在树形数据中查找路径
import { findPath } from '@/utils/tree'

// 定义 OnlyOneChildType 类型，继承自 AppRouteRecordRaw 并包含一个可选属性 noShowingChildren
type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean }

// 定义 HasOneShowingChild 接口，用于表示子菜单项的显示状态
interface HasOneShowingChild {
  oneShowingChild?: boolean // 是否只有一个显示的子菜单项
  onlyOneChild?: OnlyOneChildType // 唯一显示的子菜单项
}

/**
 * @description 获取某一路径的所有父路径
 * @param treeData 树形数据
 * @param path 当前路径
 * @returns 包含所有父路径的数组
 */
export const getAllParentPath = <T = Recordable>(treeData: T[], path: string) => {
  // 使用 findPath 找到路径对应的节点列表
  const menuList = findPath(treeData, (n) => n.path === path) as AppRouteRecordRaw[]
  // 返回路径数组
  return (menuList || []).map((item) => item.path)
}

/**
 * @description 判断是否只有一个显示的子菜单项
 * @param children 子菜单数组，默认为空数组
 * @param parent 父菜单项
 * @returns 一个包含显示状态的对象
 */
export const hasOneShowingChild = (
  children: AppRouteRecordRaw[] = [], // 子菜单项
  parent: AppRouteRecordRaw // 父菜单项
): HasOneShowingChild => {
  const onlyOneChild = ref<OnlyOneChildType>() // 定义唯一显示子菜单项的引用

  // 筛选出显示的子菜单项
  const showingChildren = children.filter((v) => {
    const meta = v.meta ?? {} // 获取子菜单的 meta 信息
    if (meta.hidden) {
      return false // 如果子菜单被隐藏，则不显示
    } else {
      onlyOneChild.value = v // 临时设置唯一显示的子菜单项
      return true
    }
  })

  // 如果只有一个显示的子菜单项
  if (showingChildren.length === 1) {
    return {
      oneShowingChild: true, // 标记为只有一个显示的子菜单项
      onlyOneChild: unref(onlyOneChild) // 返回唯一显示的子菜单项
    }
  }

  // 如果没有显示的子菜单项，则显示父菜单
  if (!showingChildren.length) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true } // 设置父菜单为唯一显示项
    return {
      oneShowingChild: true, // 标记为只有一个显示的子菜单项
      onlyOneChild: unref(onlyOneChild) // 返回父菜单
    }
  }

  // 如果有多个显示的子菜单项
  return {
    oneShowingChild: false, // 标记为有多个显示的子菜单项
    onlyOneChild: unref(onlyOneChild) // 返回临时设置的唯一子菜单项
  }
}
