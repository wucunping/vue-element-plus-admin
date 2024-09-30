/**
 * @file permission.ts
 * @description 权限管理 Store，使用 Pinia 进行状态管理，定义路由生成、菜单配置等功能。
 * @example
 * // 示例：使用权限 Store
 * const permissionStore = usePermissionStore();
 * permissionStore.generateRoutes('server', customRouters);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module PermissionStore
 */

import { defineStore } from 'pinia' // 从 Pinia 引入 defineStore 方法，用于定义状态管理的 store
import { asyncRouterMap, constantRouterMap } from '@/router' // 引入异步路由和常量路由映射
import {
	generateRoutesByFrontEnd, // 引入生成前端路由的函数
	generateRoutesByServer, // 引入生成后端路由的函数
	flatMultiLevelRoutes // 引入展开多级路由的函数
} from '@/utils/routerHelper' // 从 routerHelper 工具类中引入路由相关工具函数
import { store } from '../index' // 从 index 文件中引入 store 实例
import { cloneDeep } from 'lodash-es' // 从 lodash-es 库引入深拷贝函数

/** 定义权限状态接口 */
export interface PermissionState {
	/** 存储路由的数组 */
	routers: AppRouteRecordRaw[]
	/** 存储新增路由的数组 */
	addRouters: AppRouteRecordRaw[]
	/** 表示是否已添加路由的布尔值 */
	isAddRouters: boolean
	/** 存储菜单标签路由的数组 */
	menuTabRouters: AppRouteRecordRaw[]
}

/** 使用 defineStore 定义权限 store */
export const usePermissionStore = defineStore('permission', {
	// 定义 store 的初始状态
	state: (): PermissionState => ({
		routers: [], // 初始化路由数组
		addRouters: [], // 初始化新增路由数组
		isAddRouters: false, // 初始化是否已添加路由为 false
		menuTabRouters: [] // 初始化菜单标签路由数组
	}),
	getters: {
		/** 获取路由
		 * @returns {AppRouteRecordRaw[]} 返回路由数组
		 */
		getRouters(): AppRouteRecordRaw[] {
			return this.routers // 返回当前的路由数组
		},
		/** 获取新增路由
		 * @returns {AppRouteRecordRaw[]} 返回展开后的新增路由数组
		 */
		getAddRouters(): AppRouteRecordRaw[] {
			return flatMultiLevelRoutes(cloneDeep(this.addRouters)) // 深拷贝并展开新增路由数组
		},
		/** 获取是否已添加路由的状态
		 * @returns {boolean} 返回是否已添加路由的布尔值
		 */
		getIsAddRouters(): boolean {
			return this.isAddRouters // 返回是否已添加路由的状态
		},
		/** 获取菜单标签路由
		 * @returns {AppRouteRecordRaw[]} 返回菜单标签路由数组
		 */
		getMenuTabRouters(): AppRouteRecordRaw[] {
			return this.menuTabRouters // 返回菜单标签路由数组
		}
	},
	actions: {
		/** 生成路由
		 * @param {('server' | 'frontEnd' | 'static')} type - 路由生成的类型
		 * @param {(AppCustomRouteRecordRaw[] | string[])?} routers - 可选的路由数组
		 * @returns {Promise<unknown>} 返回生成路由的 Promise
		 */
		generateRoutes(
			type: 'server' | 'frontEnd' | 'static',
			routers?: AppCustomRouteRecordRaw[] | string[]
		): Promise<unknown> {
			return new Promise<void>((resolve) => {
				let routerMap: AppRouteRecordRaw[] = [] // 定义路由映射数组
				if (type === 'server') {
					// 模拟后端过滤菜单
					routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[]) // 根据后端返回的路由生成 routerMap
				} else if (type === 'frontEnd') {
					// 模拟前端过滤菜单
					routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[]) // 根据前端条件生成 routerMap
				} else {
					// 直接读取静态路由表
					routerMap = cloneDeep(asyncRouterMap) // 深拷贝静态路由表
				}
				// 动态路由，404一定要放到最后面
				this.addRouters = routerMap.concat([
					// 将生成的路由与 404 路由合并
					{
						path: '/:path(.*)*', // 定义匹配所有路径的路由
						redirect: '/404', // 重定向到 404 页面
						name: '404Page', // 404 页面路由的名称
						meta: {
							hidden: true, // 隐藏该路由
							breadcrumb: false // 不显示在面包屑中
						}
					}
				])
				// 渲染菜单的所有路由
				this.routers = cloneDeep(constantRouterMap).concat(routerMap) // 合并常量路由与动态路由
				resolve() // 解决 Promise
			})
		},
		/** 设置是否添加路由的状态
		 * @param {boolean} state - 是否添加路由的状态
		 */
		setIsAddRouters(state: boolean): void {
			this.isAddRouters = state // 设置状态
		},
		/** 设置菜单标签路由
		 * @param {AppRouteRecordRaw[]} routers - 菜单标签路由数组
		 */
		setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
			this.menuTabRouters = routers // 设置菜单标签路由
		}
	},
	// 定义持久化配置
	persist: {
		// paths: ['routers', 'addRouters', 'menuTabRouters'] // 老版本写法，需要持久化的状态字段
		pick: ['routers', 'addRouters', 'menuTabRouters'] // 需要持久化的状态字段
		// omit: ['routers', 'addRouters', 'menuTabRouters'] // 忽略特定的状态字段，不将其持久化，可以使用 omit 选项
	}
})

/** 定义不带 store 的权限 store */
export const usePermissionStoreWithOut = () => {
	return usePermissionStore(store) /** 返回权限 store 的实例 */
}
