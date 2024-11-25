/**
 * @file routerHelper.ts
 * @description 提供前端和后端动态路由生成的辅助工具函数，包括路由降级、路径解析等功能。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module RouterHelper
 */

// 导入 Vue Router 的核心 API，用于创建路由和管理路由历史记录
import { createRouter, createWebHashHistory } from 'vue-router'

// 导入 Vue Router 的类型定义，用于定义路由和路由记录的类型
import type {
  Router, // Vue Router 实例类型
  RouteLocationNormalized, // 标准化的路由位置类型
  RouteRecordNormalized, // 标准化的路由记录类型
  RouteRecordRaw // 原始的路由记录类型
} from 'vue-router'

// 导入工具函数，用于处理常见的字符串操作
import { isUrl } from '@/utils/is' // 判断是否为 URL 的工具函数

// 导入 lodash-es 的方法，用于对象操作
import { omit, cloneDeep } from 'lodash-es' // omit 用于去除对象属性，cloneDeep 用于深拷贝对象

/**
 * 动态加载 views 文件夹下的所有 vue 和 tsx 文件。
 */
const modules = import.meta.glob('../views/**/*.{vue,tsx}')

/**
 * 定义 Layout 组件，用于顶级路由的布局结构。
 * @returns 返回 Layout 组件的异步导入函数。
 */
export const Layout = () => import('@/layout/Layout.vue')

/**
 * 获取 ParentLayout 组件的占位函数，用于占位子路由。
 * @returns 返回一个 Promise，解析为占位的 ParentLayout 对象。
 */
export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout'
      })
    })
}

/**
 * 提取原始路由信息，移除 matched 属性。
 * @param route 路由对象
 * @returns 提取后的路由对象
 */
export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta, // 提取路由的 meta 信息
          name: item.name, // 提取路由的 name 信息
          path: item.path // 提取路由的 path 信息
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

/**
 * 根据前端提供的路由配置生成路由表。
 * @param routes 初始路由表
 * @param keys 需要过滤的路径或名称数组
 * @param basePath 基础路径
 * @returns 过滤后的路由表
 */
export const generateRoutesByFrontEnd = (
  routes: AppRouteRecordRaw[],
  keys: string[],
  basePath = '/'
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route.meta ?? {}
    // 如果路由被隐藏且不可访问，则跳过
    if (meta.hidden && !meta.canTo) {
      continue
    }

    let data: Nullable<AppRouteRecordRaw> = null
    let onlyOneChild: Nullable<string> = null
    // 如果子路由只有一个，且路由不需要一直显示，则设置为 onlyOneChild
    if (route.children && route.children.length === 1 && !meta.alwaysShow) {
      onlyOneChild = (
        isUrl(route.children[0].path)
          ? route.children[0].path
          : pathResolve(pathResolve(basePath, route.path), route.children[0].path)
      ) as string
    }

    // 遍历 keys，匹配路径或名称
    for (const item of keys) {
      const routePath = (onlyOneChild ?? pathResolve(basePath, route.path)).trim()
      if (isUrl(item) && (onlyOneChild === item || route.path === item)) {
        data = Object.assign({}, route)
      } else if (routePath === item || meta.followRoute === item) {
        data = Object.assign({}, route)
      }
    }

    // 如果存在子路由，递归调用生成路由
    if (route.children && data) {
      data.children = generateRoutesByFrontEnd(
        route.children,
        keys,
        pathResolve(basePath, data.path)
      )
    }
    if (data) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}

/**
 * 根据后端提供的路由配置生成路由表。
 * @param routes 后端返回的路由数据
 * @returns 生成的前端路由表
 */
export const generateRoutesByServer = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const data: AppRouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: route.meta
    }
    if (route.component) {
      const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
      const component = route.component as string
      // 如果未找到对应组件，输出错误提示
      if (!comModule && !component.includes('#')) {
        console.error(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`)
      } else {
        // 动态加载路由文件，支持 Layout 和 ParentLayout
        data.component =
          component === '#' ? Layout : component.includes('##') ? getParentLayout() : comModule
      }
    }
    // 如果存在子路由，递归调用生成路由
    if (route.children) {
      data.children = generateRoutesByServer(route.children)
    }
    res.push(data as AppRouteRecordRaw)
  }
  return res
}

/**
 * 合并路径，确保正确的路由路径结构。
 * @param parentPath 父路径
 * @param path 子路径
 * @returns 合并后的路径
 */
export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

/**
 * 将多层嵌套的路由结构拍平。
 * @param routes 初始路由表
 * @returns 拍平后的路由表
 */
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
  const modules: AppRouteRecordRaw[] = cloneDeep(routes)
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route)) {
      continue
    }
    promoteRouteLevel(route)
  }
  return modules
}

/**
 * 判断路由层级是否超过 2 层。
 * @param route 路由对象
 * @returns 是否多层嵌套
 */
const isMultipleRoute = (route: AppRouteRecordRaw) => {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
    return false
  }
  return route.children.some((child) => child.children?.length)
}

/**
 * 提升多层嵌套路由为二级路由。
 * @param route 路由对象
 */
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory()
  })
  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route)
  router = null
  route.children = route.children?.map((item) => omit(item, 'children'))
}

/**
 * 将所有子菜单添加到顶级路由的 children 属性中。
 * @param routes 路由集合
 * @param children 子路由
 * @param routeModule 顶级路由模块
 */
const addToChildren = (
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteRecordRaw
) => {
  for (const child of children) {
    const route = routes.find((item) => item.name === child.name)
    if (!route) continue
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteRecordRaw)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}
