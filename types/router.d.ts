/**
 * @file router.d.ts
 * @description 定义自定义路由相关的类型和接口
 * @example
 * // 示例: 如何使用 AppRouteRecordRaw 来定义一个路由
 * const route: AppRouteRecordRaw = {
 *   name: 'example',
 *   meta: {
 *     title: '示例路由',
 *     icon: 'example-icon',
 *   },
 *   component: 'ExampleComponent',
 *   path: '/example',
 *   redirect: '/example/child',
 *   children: []
 * }
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module vue-router
 */

import type { RouteRecordRaw } from 'vue-router' // 从 'vue-router' 模块中导入 RouteRecordRaw 类型
import { defineComponent } from 'vue' // 从 'vue' 模块中导入 defineComponent 函数

/**
* redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

    alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
                              只有一个时，会将那个子路由当做根路由显示在侧边栏，
                              若你想不管路由下面的 children 声明的个数都显示你的根路由，
                              你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
                              一直显示根路由(默认 false)

    title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

    icon: 'svg-name'          设置该路由的图标

    noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

    breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

    affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

    noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

    activeMenu: '/dashboard'  显示高亮的路由路径

    canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)

    permission: ['edit','add', 'delete']    设置该路由的权限
  }
**/

/**
 * @description 路由元数据的自定义接口
 */
interface RouteMetaCustom extends Record<string | number | symbol, unknown> {
  /** 是否在侧边栏隐藏该路由 */
  hidden?: boolean
  /** 是否始终显示该路由为根路由 */
  alwaysShow?: boolean
  /** 路由在侧边栏和面包屑中展示的名字 */
  title?: string
  /** 路由的图标 */
  icon?: string
  /** 是否不被 <keep-alive> 缓存 */
  noCache?: boolean
  /** 是否在面包屑中显示该路由 */
  breadcrumb?: boolean
  /** 是否固定在标签项中 */
  affix?: boolean
  /** 高亮显示的路由路径 */
  activeMenu?: string
  /** 是否在标签视图中显示 */
  noTagsView?: boolean
  /** 是否允许在 hidden 为 true 的情况下跳转 */
  canTo?: boolean
  /** 路由的权限设置 */
  permission?: string[]
}

/**
 * @description 扩展 vue-router 的 RouteMeta 接口
 */
declare module 'vue-router' {
  interface RouteMeta extends RouteMetaCustom {} // 添加自定义的 RouteMeta
}

/**
 * @description 定义组件类型，可以是 Vue 组件或异步加载的组件
 */
type Component<T = any> =
  | ReturnType<typeof defineComponent> // 组件的返回类型
  | (() => Promise<typeof import('*.vue')>) // 异步加载的组件
  | (() => Promise<T>) // 其他类型的异步返回

/**
 * 在全局作用域中声明两个接口：AppRouteRecordRaw和AppCustomRouteRecordRaw，
 * 它们都扩展了RouteRecordRaw类型，但省略了一些属性，并添加了一些自定义属性
 */
declare global {
  /**
   * @description 应用路由记录的自定义接口
   */
  declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    /** 路由名称 */
    name: string
    /** 路由元数据 */
    meta: RouteMetaCustom
    /** 路由对应的组件 */
    component?: Component | string
    /** 子路由 */
    children?: AppRouteRecordRaw[]
    /** 路由属性 */
    props?: Recordable
    /** 完整的路由路径 */
    fullPath?: string
  }

  /**
   * @description 自定义路由记录的接口
   */
  declare interface AppCustomRouteRecordRaw
    extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
    /** 路由名称 */
    name: string
    /** 路由元数据 */
    meta: RouteMetaCustom
    /** 路由对应的组件名称 */
    component: string
    /** 路由路径 */
    path: string
    /** 路由重定向路径 */
    redirect: string
    /** 子路由 */
    children?: AppCustomRouteRecordRaw[]
  }
}
