/**
 * @file useRenderMenuItem.tsx
 * @description 渲染菜单项的函数，主要用于动态生成菜单。
 * @example
 * const { renderMenuItem } = useRenderMenuItem(menuMode);
 * const menuItems = renderMenuItem(routers);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module useRenderMenuItem
 */

// 导入 Element Plus 的子菜单和菜单项组件
import { ElSubMenu, ElMenuItem } from 'element-plus'
// 导入 Vue 的 unref 函数
import { unref } from 'vue'
// 导入辅助函数 hasOneShowingChild
import { hasOneShowingChild } from '../helper'
// 导入判断 URL 的工具函数
import { isUrl } from '@/utils/is'
// 导入渲染菜单标题的函数
import { useRenderMenuTitle } from './useRenderMenuTitle'
// 导入路径解析工具
import { pathResolve } from '@/utils/routerHelper'
// 导入样式设计相关的钩子
import { useDesign } from '@/hooks/web/useDesign'

// 使用设计钩子获取前缀类名
const { getPrefixCls } = useDesign()
// 定义菜单项的前缀类名
const prefixCls = getPrefixCls('submenu')

// 获取渲染菜单标题的函数
const { renderMenuTitle } = useRenderMenuTitle()

/**
 * @function useRenderMenuItem
 * @description 创建用于渲染菜单项的函数
 * @param {string} menuMode - 菜单模式
 * @returns {Object} 返回渲染菜单项的函数
 */
export const useRenderMenuItem = (menuMode) => {
	// 定义渲染菜单项的函数
	const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/') => {
		return (
			routers
				// 过滤掉被隐藏的路由
				.filter((v) => !v.meta?.hidden)
				// 映射生成菜单项或子菜单
				.map((v) => {
					// 获取路由的元信息
					const meta = v.meta ?? {}
					// 检查是否有仅显示一个子项
					const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
					// 获取完整路径
					const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path)

					// 如果有仅显示的子项且其他子项不显示
					if (
						oneShowingChild &&
						(!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
						!meta?.alwaysShow
					) {
						// 返回菜单项组件
						return (
							<ElMenuItem
								index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath} // 设置菜单项的索引
							>
								{{
									default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta) // 渲染菜单标题
								}}
							</ElMenuItem>
						)
					} else {
						// 返回子菜单组件
						return (
							<ElSubMenu
								index={fullPath} // 设置子菜单的索引
								teleported // 控制弹出框的位置
								popperClass={unref(menuMode) === 'vertical' ? `${prefixCls}-popper--vertical` : ''} // 根据菜单模式设置类名
							>
								{{
									title: () => renderMenuTitle(meta), // 渲染子菜单标题
									default: () => renderMenuItem(v.children!, fullPath) // 递归渲染子菜单项
								}}
							</ElSubMenu>
						)
					}
				})
		)
	}

	// 返回包含渲染菜单项的对象
	return {
		renderMenuItem
	}
}
