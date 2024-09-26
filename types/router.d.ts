/**
 * @file 定义 Vue Router 相关的类型扩展
 *
 * 该文件主要为 Vue Router 提供了自定义的路由元信息（RouteMetaCustom）
 * 以及扩展了全局的路由记录类型（AppRouteRecordRaw 和 AppCustomRouteRecordRaw）。
 * 这些扩展类型允许我们在路由配置中添加额外的自定义属性，
 * 并为项目中的路由组件提供更丰富的类型支持。
 */

// 从'vue-router'导入RouteRecordRaw类型，这是Vue Router中定义路由的基本类型
import type { RouteRecordRaw } from 'vue-router'
// 从'vue'导入defineComponent，用于定义Vue组件
import { defineComponent } from 'vue'

/**
 * 定义一个扩展了Record的接口RouteMetaCustom，该接口可以包含任意的键值对，
 * 并定义了一些特定的可选属性，如hidden, alwaysShow等。
 */
interface RouteMetaCustom extends Record<string | number | symbol, unknown> {
	/** 是否隐藏该路由 */
	hidden?: boolean
	/** 是否始终显示该路由 */
	alwaysShow?: boolean
	/** 路由的标题 */
	title?: string
	/** 路由的图标 */
	icon?: string
	/** 是否禁用缓存 */
	noCache?: boolean
	/** 是否在面包屑导航中显示 */
	breadcrumb?: boolean
	/** 是否固定在标签页上 */
	affix?: boolean
	/** 激活的菜单项 */
	activeMenu?: string
	/** 是否在标签视图中隐藏 */
	noTagsView?: boolean
	/** 是否可以跳转到该路由 */
	canTo?: boolean
	/** 访问该路由所需的权限 */
	permission?: string[]
}

/**
 * 声明'vue-router'模块，并在其中扩展RouteMeta接口，使其包含RouteMetaCustom的属性
 */
declare module 'vue-router' {
	interface RouteMeta extends RouteMetaCustom {}
}

/**
 * 定义一个类型Component，它可以是一个Vue组件的定义，也可以是一个返回Promise的函数，
 * 该Promise解析为一个Vue组件的类型或任意类型T
 */
type Component<T = any> =
	| ReturnType<typeof defineComponent> // Vue组件的定义
	| (() => Promise<typeof import('*.vue')>) // 返回Promise的函数，解析为Vue组件的类型
	| (() => Promise<T>) // 返回Promise的函数，解析为任意类型T

/**
 * 在全局作用域中声明两个接口：AppRouteRecordRaw和AppCustomRouteRecordRaw，
 * 它们都扩展了RouteRecordRaw类型，但省略了一些属性，并添加了一些自定义属性
 */
declare global {
	/**
	 * AppRouteRecordRaw接口定义了路由记录的基本结构，包括name, meta, component等属性
	 */
	declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
		/** 路由的名称 */
		name: string
		/** 路由的元信息 */
		meta: RouteMetaCustom
		/** 路由对应的组件 */
		component?: Component | string
		/** 子路由的记录 */
		children?: AppRouteRecordRaw[]
		/** 传递给组件的属性 */
		props?: Recordable
		/** 路由的完整路径 */
		fullPath?: string
	}

	/**
	 * AppCustomRouteRecordRaw接口定义了自定义路由记录的结构，包括name, meta, component, path, redirect等属性
	 */
	declare interface AppCustomRouteRecordRaw
		extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
		/** 路由的名称 */
		name: string
		/** 路由的元信息 */
		meta: RouteMetaCustom
		/** 路由对应的组件的名称（字符串形式） */
		component: string
		/** 路由的路径 */
		path: string
		/** 路由的重定向路径 */
		redirect: string
		/** 子路由的记录 */
		children?: AppCustomRouteRecordRaw[]
	}
}
