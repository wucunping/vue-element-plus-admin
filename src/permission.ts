/**
 * @file permission.ts
 * @description 路由权限控制模块，负责在路由切换前进行权限验证和动态路由生成。
 * @example
 * // 使用路由守卫进行权限控制
 * router.beforeEach((to, from, next) => {
 *   // ...权限逻辑
 * });
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module 路由权限控制
 */

// 导入router实例，该实例包含了应用的所有路由配置和操作方法
import router from '@/router'

// 从状态管理库的app模块中导入useAppStoreWithOut函数，
// 允许我们在非组件环境中访问app状态，比如获取应用配置等
import { useAppStoreWithOut } from '@/store/modules/app'

// 从vue-router中导入RouteRecordRaw类型，用于类型定义路由记录对象
import type { RouteRecordRaw } from 'vue-router'

// 导入自定义hook useTitle，用于动态设置网页标题
import { useTitle } from '@/hooks/web/useTitle'

// 导入自定义hook useNProgress，提供页面加载进度条的控制功能
import { useNProgress } from '@/hooks/web/useNProgress'

// 从状态管理库的permission模块中导入usePermissionStoreWithOut函数，
// 允许我们在非组件环境中访问权限状态，如路由权限等
import { usePermissionStoreWithOut } from '@/store/modules/permission'

// 导入自定义hook usePageLoading，用于显示或隐藏页面加载提示
import { usePageLoading } from '@/hooks/web/usePageLoading'

// 从常量文件中导入NO_REDIRECT_WHITE_LIST，这是一个包含无需重定向路径的数组
import { NO_REDIRECT_WHITE_LIST } from '@/constants'

// 从状态管理库的user模块中导入useUserStoreWithOut函数，
// 允许我们在非组件环境中访问用户状态，如用户信息等
import { useUserStoreWithOut } from '@/store/modules/user'

// 调用useNProgress hook，获取控制进度条的方法对象
const { start, done } = useNProgress()

// 调用usePageLoading hook，获取控制页面加载提示的方法对象
const { loadStart, loadDone } = usePageLoading()

/**
 * 全局前置守卫：在路由跳转前进行权限检查
 *
 * @param to 即将进入的目标路由对象
 * @param from 当前导航正要离开的路由对象
 * @param next 解析这个钩子，执行下一个导航守卫或确认导航
 */
router.beforeEach(async (to, from, next) => {
	// console.log(`output->to`, to)
	// console.log(`output->from`, from)
	next()
})

/**
 * 全局后置钩子：在路由跳转后设置页面标题等
 *
 * @param to 已经进入的目标路由对象
 */
router.afterEach((to) => {
	// console.log(`output->to`, to)
})
