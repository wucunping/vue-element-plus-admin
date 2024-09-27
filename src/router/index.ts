/**
 * @file index.ts
 * @description 该文件定义了路由配置，包括静态和动态路由的设置。
 * @example
 * // 使用方法：
 * import router, { setupRouter } from './index'
 * setupRouter(app)
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module 路由配置模块
 */

import { createRouter, createWebHashHistory } from 'vue-router' // 导入 Vue Router 的创建函数
import type { RouteRecordRaw } from 'vue-router' // 导入路由记录类型
import type { App } from 'vue' // 导入 Vue 应用类型
import { Layout, getParentLayout } from '@/utils/routerHelper' // 导入布局组件及获取父布局的函数
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化函数
import { NO_RESET_WHITE_LIST } from '@/constants' // 导入常量

const { t } = useI18n() // 获取国际化函数

/**
 * 路由记录接口定义
 */
export const constantRouterMap: AppRouteRecordRaw[] = [
	{
		path: '/', // 路径为根地址
		component: () => import('@/views/Home.vue'), // 使用 Layout 组件
		// redirect: '/dashboard/analysis', // 重定向地址
		name: 'Home', // 路由名称
		meta: {
			// 路由元信息
			hidden: true // 隐藏路由
		}
	},
	{
		path: '/login', // 路径为根地址
		component: () => import('@/views/Login/Login.vue'), // 使用 Layout 组件
		// redirect: '/dashboard/analysis', // 重定向地址
		name: 'Login', // 路由名称
		meta: {
			// 路由元信息
			hidden: true // 隐藏路由
		}
	}
	// {
	// 	path: '/', // 路径为根地址
	// 	component: Layout, // 使用 Layout 组件
	// 	redirect: '/dashboard/analysis', // 重定向地址
	// 	name: 'Root', // 路由名称
	// 	meta: {
	// 		// 路由元信息
	// 		hidden: true // 隐藏路由
	// 	}
	// },
	// {
	// 	path: '/redirect', // 路径为重定向
	// 	component: Layout, // 使用 Layout 组件
	// 	name: 'Redirect', // 路由名称
	// 	children: [
	// 		// 子路由
	// 		{
	// 			path: '/redirect/:path(.*)', // 正则匹配地址
	// 			name: 'Redirect', // 子路由名称
	// 			component: () => import('@/views/Redirect/Redirect.vue'), // 动态导入重定向组件
	// 			meta: {} // 元信息
	// 		}
	// 	],
	// 	meta: {
	// 		hidden: true, // 隐藏路由
	// 		noTagsView: true // 不在标签视图中显示
	// 	}
	// },
	// {
	// 	path: '/login', // 登录页面路径
	// 	component: () => import('@/views/Login/Login.vue'), // 动态导入登录组件
	// 	name: 'Login', // 登录路由名称
	// 	meta: {
	// 		hidden: true, // 隐藏登录路由
	// 		title: t('router.login'), // 登录路由标题
	// 		noTagsView: true // 不在标签视图中显示
	// 	}
	// },
	// {
	// 	path: '/personal', // 个人中心路径
	// 	component: Layout, // 使用 Layout 组件
	// 	redirect: '/personal/personal-center', // 重定向到个人中心
	// 	name: 'Personal', // 个人中心路由名称
	// 	meta: {
	// 		title: t('router.personal'), // 个人中心标题
	// 		hidden: true, // 隐藏路由
	// 		canTo: true // 可导航到此路由
	// 	},
	// 	children: [
	// 		{
	// 			path: 'personal-center', // 个人中心子路由
	// 			component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'), // 动态导入个人中心组件
	// 			name: 'PersonalCenter', // 子路由名称
	// 			meta: {
	// 				title: t('router.personalCenter'), // 子路由标题
	// 				hidden: true, // 隐藏子路由
	// 				canTo: true // 可导航到此子路由
	// 			}
	// 		}
	// 	]
	// },
	// {
	// 	path: '/404', // 404 页面路径
	// 	component: () => import('@/views/Error/404.vue'), // 动态导入404组件
	// 	name: 'NoFind', // 404 路由名称
	// 	meta: {
	// 		hidden: true, // 隐藏404路由
	// 		title: '404', // 404标题
	// 		noTagsView: true // 不在标签视图中显示
	// 	}
	// }
]

// 异步路由映射，包含需要权限的路由
export const asyncRouterMap: AppRouteRecordRaw[] = [
	// {
	// 	path: '/dashboard', // 仪表盘路径
	// 	component: Layout, // 使用 Layout 组件
	// 	redirect: '/dashboard/analysis', // 重定向到分析页面
	// 	name: 'Dashboard', // 仪表盘路由名称
	// 	meta: {
	// 		title: t('router.dashboard'), // 仪表盘标题
	// 		icon: 'vi-ant-design:dashboard-filled', // 图标
	// 		alwaysShow: true // 始终显示
	// 	},
	// 	children: [
	// 		{
	// 			path: 'analysis', // 分析页面路径
	// 			component: () => import('@/views/Dashboard/Analysis.vue'), // 动态导入分析组件
	// 			name: 'Analysis', // 分析路由名称
	// 			meta: {
	// 				title: t('router.analysis'), // 分析标题
	// 				noCache: true, // 不缓存
	// 				affix: true // 固定标签
	// 			}
	// 		},
	// 		{
	// 			path: 'workplace', // 工作场所路径
	// 			component: () => import('@/views/Dashboard/Workplace.vue'), // 动态导入工作场所组件
	// 			name: 'Workplace', // 工作场所路由名称
	// 			meta: {
	// 				title: t('router.workplace'), // 工作场所标题
	// 				noCache: true // 不缓存
	// 			}
	// 		}
	// 	]
	// },
	// {
	// 	path: '/external-link', // 外部链接路径
	// 	component: Layout, // 使用 Layout 组件
	// 	meta: {}, // 元信息
	// 	name: 'ExternalLink', // 外部链接路由名称
	// 	children: [
	// 		{
	// 			path: 'https://element-plus-admin-doc.cn/', // 外部链接地址
	// 			name: 'DocumentLink', // 外部链接路由名称
	// 			meta: {
	// 				title: t('router.document'), // 外部链接标题
	// 				icon: 'vi-clarity:document-solid' // 图标
	// 			}
	// 		}
	// 	]
	// },
	// {
	// 	path: '/guide', // 指南路径
	// 	component: Layout, // 使用 Layout 组件
	// 	name: 'Guide', // 指南路由名称
	// 	meta: {}, // 元信息
	// 	children: [
	// 		{
	// 			path: 'index', // 指南索引路径
	// 			component: () => import('@/views/Guide/Guide.vue'), // 动态导入指南组件
	// 			name: 'GuideDemo', // 指南演示路由名称
	// 			meta: {
	// 				title: t('router.guide'), // 指南标题
	// 				icon: 'vi-cib:telegram-plane' // 图标
	// 			}
	// 		}
	// 	]
	// }
	// 省略其他路由以保持简洁，但保持注释风格一致
]

// 创建 Vue Router 实例
const router = createRouter({
	history: createWebHashHistory(), // 使用 hash 模式的路由历史
	strict: true, // 严格模式
	routes: constantRouterMap as RouteRecordRaw[], // 使用静态路由
	scrollBehavior: () => ({ left: 0, top: 0 }) // 滚动行为
})

/**
 * 重置路由
 */
export const resetRouter = (): void => {
	router.getRoutes().forEach((route) => {
		// 遍历当前路由
		const { name } = route // 获取路由名称
		if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
			// 如果名称存在并且不在白名单中
			router.hasRoute(name) && router.removeRoute(name) // 移除路由
		}
	})
}

/**
 * 设置路由
 * @param app - Vue 应用实例
 */
export const setupRouter = (app: App<Element>) => {
	app.use(router) // 使用路由实例
}

export default router // 导出路由实例
