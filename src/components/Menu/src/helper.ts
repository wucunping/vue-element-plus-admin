/**
 * @file helper.ts
 * @description 路由相关工具函数
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module 路由助手
 */

import { ref, unref } from 'vue' // 从 Vue 导入 ref 和 unref，用于响应式数据管理
import { findPath } from '@/utils/tree' // 从工具函数目录导入 findPath，用于查找路径

type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean } // 定义一个类型，表示只有一个子路由的类型

interface HasOneShowingChild {
	// 定义一个接口，表示是否有显示的子路由和相关的子路由信息
	oneShowingChild?: boolean // 是否存在一个显示的子路由
	onlyOneChild?: OnlyOneChildType // 仅有一个子路由的信息
}

/**
 * 获取所有父级路径
 * @param treeData 路由树数据
 * @param path 当前路径
 * @returns 所有父级路径的数组
 */
export const getAllParentPath = <T = Recordable>(treeData: T[], path: string) => {
	const menuList = findPath(treeData, (n) => n.path === path) as AppRouteRecordRaw[] // 查找符合路径的路由项
	return (menuList || []).map((item) => item.path) // 返回找到的父级路径数组
}

/**
 * 检查是否有一个显示的子路由
 * @param children 子路由数组
 * @param parent 父路由信息
 * @returns 是否有一个显示的子路由及其信息
 */
export const hasOneShowingChild = (
	children: AppRouteRecordRaw[] = [], // 默认值为一个空数组
	parent: AppRouteRecordRaw // 父路由信息
): HasOneShowingChild => {
	const onlyOneChild = ref<OnlyOneChildType>() // 创建一个响应式变量，存储仅有的一个子路由

	// 过滤出可显示的子路由
	const showingChildren = children.filter((v) => {
		const meta = v.meta ?? {} // 获取路由的meta信息
		if (meta.hidden) {
			// 如果该子路由被隐藏
			return false // 跳过此子路由
		} else {
			// 一旦找到可显示的子路由，临时存储
			onlyOneChild.value = v // 将当前子路由赋值给 onlyOneChild
			return true // 保留当前子路由
		}
	})

	// 如果只有一个子路由，则默认显示该子路由
	if (showingChildren.length === 1) {
		return {
			oneShowingChild: true, // 标记有一个显示的子路由
			onlyOneChild: unref(onlyOneChild) // 返回仅有的一个子路由
		}
	}

	// 如果没有可显示的子路由，则显示父路由
	if (!showingChildren.length) {
		onlyOneChild.value = { ...parent, path: '', noShowingChildren: true } // 引入父路由信息并标记无显示子路由
		return {
			oneShowingChild: true, // 标记有一个显示的子路由（为父路由）
			onlyOneChild: unref(onlyOneChild) // 返回父路由信息
		}
	}

	return {
		oneShowingChild: false, // 标记没有显示的子路由
		onlyOneChild: unref(onlyOneChild) // 返回存储的子路由（可能为undefined）
	}
}
