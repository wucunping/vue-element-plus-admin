/**
 * @file useRenderMenuTitle.tsx
 * @description 渲染菜单标题的功能
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module useRenderMenuTitle
 */

import type { RouteMeta } from 'vue-router' // 导入 RouteMeta 类型，用于定义路由元数据
import { Icon } from '@/components/Icon' // 导入 Icon 组件，用于显示图标
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化钩子，用于处理多语言

/**
 * 自定义 Hook 用于渲染菜单标题
 * @returns {Object} 包含 renderMenuTitle 函数
 */
export const useRenderMenuTitle = () => {
	/**
	 * 渲染菜单项的标题
	 * @param {RouteMeta} meta - 路由元数据
	 * @returns {JSX.Element} 菜单标题的 JSX 元素
	 */
	const renderMenuTitle = (meta: RouteMeta) => {
		const { t } = useI18n() // 获取国际化函数 t
		const { title = 'Please set title', icon } = meta // 解构 title 和 icon，若 title 不存在则使用默认值

		// 如果存在图标，则渲染图标和标题
		return icon ? (
			<>
				<Icon icon={meta.icon}></Icon> // 渲染图标
				<span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
					{t(title as string)} // 渲染翻译后的标题
				</span>
			</>
		) : (
			<span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
				{t(title as string)} // 渲染翻译后的标题（无图标）
			</span>
		)
	}

	return {
		renderMenuTitle // 返回 renderMenuTitle 函数
	}
}
