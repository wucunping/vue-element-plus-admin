/**
 * @file permission.ts
 * @description 路由权限控制模块，负责在路由切换前进行权限验证和动态路由生成。
 * @example
 * // 使用路由守卫进行权限控制
 * router.beforeEach((to, from, next) => {
 *   // ...权限逻辑
 * });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-15
 * @module 路由权限控制
 */

import router from './router' // 导入router实例，该实例包含了应用的所有路由配置和操作方法
import { useAppStoreWithOut } from '@/store/modules/app' // 导入应用状态管理
import type { RouteRecordRaw } from 'vue-router' // 导入路由记录类型
import { useTitle } from '@/hooks/web/useTitle' // 导入设置网页标题的钩子
import { useNProgress } from '@/hooks/web/useNProgress' // 导入进度条的钩子
import { usePermissionStoreWithOut } from '@/store/modules/permission' // 导入权限状态管理
import { usePageLoading } from '@/hooks/web/usePageLoading' // 导入页面加载状态的钩子
import { NO_REDIRECT_WHITE_LIST } from '@/constants' // 导入不需要重定向的路径常量
import { useUserStoreWithOut } from '@/store/modules/user' // 导入用户状态管理

// 使用进度条钩子，获取开始和结束的方法
const { start, done } = useNProgress()
// 使用页面加载钩子，获取加载开始和结束的方法
const { loadStart, loadDone } = usePageLoading()

/**
 * 全局前置守卫：在路由跳转前进行权限检查
 *
 * @param to 即将进入的目标路由对象
 * @param from 当前导航正要离开的路由对象
 * @param next 一定要调用的方法，用于继续导航
 */
router.beforeEach(async (to, from, next) => {
  start() // 开始进度条
  loadStart() // 开始页面加载
  const permissionStore = usePermissionStoreWithOut() // 获取权限状态管理
  const appStore = useAppStoreWithOut() // 获取应用状态管理
  const userStore = useUserStoreWithOut() // 获取用户状态管理

  // 如果用户信息已存在，则进行权限验证
  if (userStore.getUserInfo) {
    // 如果目标路径是登录
    if (to.path === '/login') {
      next({ path: '/' }) // 重定向到首页
    } else {
      // 如果已添加路由
      if (permissionStore.getIsAddRouters) {
        next() // 直接放行
        return
      }

      // 开发者可根据实际情况进行修改
      const roleRouters = userStore.getRoleRouters || [] // 获取用户角色的路由

      // 是否使用动态路由
      if (appStore.getDynamicRouter) {
        appStore.serverDynamicRouter // 判断是服务器动态路由还是前端动态路由
          ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[]) // 根据角色生成服务器动态路由
          : await permissionStore.generateRoutes('frontEnd', roleRouters as string[]) // 根据角色生成前端动态路由
      } else {
        await permissionStore.generateRoutes('static') // 静态路由
      }

      // 将添加的路由动态添加到路由表中
      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      const redirectPath = from.query.redirect || to.path // 获取重定向路径
      const redirect = decodeURIComponent(redirectPath as string) // 解码重定向路径
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect } // 判断是否需要替换路径
      permissionStore.setIsAddRouters(true) // 设置已添加路由标志
      next(nextData) // 跳转到下一个路由
    }
  } else {
    // 如果用户信息不存在
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next() // 如果目标路由在白名单中，放行
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

/**
 * 全局后置钩子：在路由跳转后执行设置页面标题等
 *
 * @param to 已经进入的目标路由对象
 */
router.afterEach((to) => {
  useTitle(to?.meta?.title as string) // 设置网页标题
  done() // 结束进度条
  loadDone() // 结束页面加载
})
