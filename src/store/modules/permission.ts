/**
 * @file permission.ts
 * @description 权限状态管理模块，用于处理路由权限的生成和管理。
 * @example
 *  // 生成动态路由
 *  const permissionStore = usePermissionStore();
 *  await permissionStore.generateRoutes('server', serverRoutes);
 * @version 1.0.0
 * @date 2024-11-18
 * @author [吴尘](https://github.com/wucunping)
 * @module Permission
 */

// 引入 Pinia 的定义方法，用于创建状态管理模块
import { defineStore } from 'pinia'

// 引入异步路由表，包含动态加载的路由配置
import { asyncRouterMap, constantRouterMap } from '@/router'

// 引入路由相关工具函数，用于处理路由生成和优化
import {
  generateRoutesByFrontEnd, // 根据前端逻辑生成路由
  generateRoutesByServer, // 根据服务端返回的路由生成
  flatMultiLevelRoutes // 将多级嵌套路由拍平成一级路由
} from '@/utils/routerHelper'

// 引入 Pinia 的 Store 实例，用于创建独立的状态模块
import { store } from '../index'

// 引入深拷贝工具函数，用于复制路由数据避免修改原数据
import { cloneDeep } from 'lodash-es'

/**
 * 权限状态接口
 */
export interface PermissionState {
  /**
   * 当前可用的路由表
   * @type {AppRouteRecordRaw[]}
   */
  routers: AppRouteRecordRaw[]

  /**
   * 动态添加的路由表
   * @type {AppRouteRecordRaw[]}
   */
  addRouters: AppRouteRecordRaw[]

  /**
   * 是否已经添加动态路由
   * @type {boolean}
   */
  isAddRouters: boolean

  /**
   * 菜单标签页的路由表
   * @type {AppRouteRecordRaw[]}
   */
  menuTabRouters: AppRouteRecordRaw[]
}

/**
 * 定义权限状态管理
 * @description 使用 Pinia 定义 Store，包含 state、getters 和 actions
 */
export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [], // 初始化路由表为空
    addRouters: [], // 初始化动态路由表为空
    isAddRouters: false, // 初始化未添加动态路由状态
    menuTabRouters: [] // 初始化菜单标签页路由为空
  }),
  getters: {
    /**
     * 获取当前完整路由表
     * 包括静态路由和动态路由
     * @returns {AppRouteRecordRaw[]} 完整路由表
     */
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },

    /**
     * 获取动态添加的路由表
     * 调用 flatMultiLevelRoutes 将多级路由拍平
     * @returns {AppRouteRecordRaw[]} 动态路由表
     */
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },

    /**
     * 获取动态路由是否已添加
     * @returns {boolean} 是否已添加动态路由
     */
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },

    /**
     * 获取菜单标签页的路由表
     * 包括所有菜单显示的路由信息
     * @returns {AppRouteRecordRaw[]} 菜单标签页路由表
     */
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    /**
     * 根据类型生成路由表
     * @param {'server' | 'frontEnd' | 'static'} type 路由生成类型
     * - server: 根据服务端返回的路由
     * - frontEnd: 根据前端逻辑生成的路由
     * - static: 静态路由表
     * @param {AppCustomRouteRecordRaw[] | string[]} [routers] 路由数据
     * @returns {Promise<void>} 生成路由的异步操作结果
     */
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<void> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = [] // 存储生成的路由表

        if (type === 'server') {
          // 根据服务端返回的路由生成路由表
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
        } else if (type === 'frontEnd') {
          // 根据前端的逻辑过滤并生成路由
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // 使用静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }

        // 动态路由添加404页面，确保未匹配路由跳转404
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*', // 匹配所有未定义路由
            redirect: '/404', // 跳转到404页面
            name: '404Page',
            meta: {
              hidden: true, // 隐藏该路由
              breadcrumb: false // 禁用面包屑
            }
          }
        ])

        // 合并静态路由和动态路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve() // 完成生成路由后返回结果
      })
    },

    /**
     * 设置动态路由是否已添加
     * @param {boolean} state 是否已添加动态路由
     */
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },

    /**
     * 设置菜单标签页路由表
     * @param {AppRouteRecordRaw[]} routers 菜单标签页路由表
     */
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: {
    // 配置持久化存储的字段
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})

/**
 * 创建权限 Store 的外部实例
 * @returns {ReturnType<typeof usePermissionStore>} 权限 Store 实例
 */
export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
