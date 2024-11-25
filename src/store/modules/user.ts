/**
 * @file user.ts
 * @description 用户状态管理模块，用于管理用户登录信息、权限和相关状态。
 * @example
 *  // 获取用户 Token
 *  const userStore = useUserStore();
 *  console.log(userStore.getToken);
 * @version 1.0.0
 * @date 2024-11-18
 * @author [吴尘](https://github.com/wucunping)
 * @module User
 */

// 引入 Pinia 的定义方法，用于创建状态管理模块
import { defineStore } from 'pinia'

// 引入 Store 实例
import { store } from '../index'

// 引入用户登录和类型定义
import { UserLoginType, UserType } from '@/api/login/types'

// 引入 Element Plus 的弹窗组件
import { ElMessageBox } from 'element-plus'

// 引入国际化工具函数
import { useI18n } from '@/hooks/web/useI18n'

// 引入用户退出登录的 API 方法
import { loginOutApi } from '@/api/login'

// 引入标签视图 Store，用于管理用户访问记录
import { useTagsViewStore } from './tagsView'

// 引入路由实例，用于跳转到登录页面
import router from '@/router'

/**
 * 用户状态接口
 */
interface UserState {
  /**
   * 用户信息
   * @type {UserType | undefined}
   */
  userInfo?: UserType

  /**
   * Token 键名，用于存储和获取用户身份认证信息
   * @type {string}
   */
  tokenKey: string

  /**
   * 用户身份认证 Token
   * @type {string}
   */
  token: string

  /**
   * 用户权限路由表
   * @type {string[] | AppCustomRouteRecordRaw[] | undefined}
   */
  roleRouters?: string[] | AppCustomRouteRecordRaw[]

  /**
   * 是否记住登录状态
   * @type {boolean}
   */
  rememberMe: boolean

  /**
   * 用户登录信息
   * @type {UserLoginType | undefined}
   */
  loginInfo?: UserLoginType
}

/**
 * 定义用户状态管理模块
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: undefined, // 初始化用户信息为空
    tokenKey: 'Authorization', // 默认 Token 键名
    token: '', // 初始化 Token 为空
    roleRouters: undefined, // 初始化权限路由为空
    rememberMe: true, // 默认记住登录状态
    loginInfo: undefined // 初始化登录信息为空
  }),
  getters: {
    /**
     * 获取 Token 键名
     * @returns {string} Token 键名
     */
    getTokenKey(): string {
      return this.tokenKey
    },

    /**
     * 获取用户 Token
     * @returns {string} 用户 Token
     */
    getToken(): string {
      return this.token
    },

    /**
     * 获取用户信息
     * @returns {UserType | undefined} 用户信息
     */
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },

    /**
     * 获取用户权限路由表
     * @returns {string[] | AppCustomRouteRecordRaw[] | undefined} 权限路由表
     */
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },

    /**
     * 获取是否记住登录状态
     * @returns {boolean} 是否记住登录状态
     */
    getRememberMe(): boolean {
      return this.rememberMe
    },

    /**
     * 获取用户登录信息
     * @returns {UserLoginType | undefined} 用户登录信息
     */
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    }
  },
  actions: {
    /**
     * 设置 Token 键名
     * @param {string} tokenKey 新的 Token 键名
     */
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },

    /**
     * 设置用户 Token
     * @param {string} token 用户 Token
     */
    setToken(token: string) {
      this.token = token
    },

    /**
     * 设置用户信息
     * @param {UserType | undefined} userInfo 用户信息
     */
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },

    /**
     * 设置用户权限路由表
     * @param {string[] | AppCustomRouteRecordRaw[]} roleRouters 用户权限路由表
     */
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },

    /**
     * 弹出退出登录确认框
     */
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await loginOutApi().catch(() => {}) // 调用退出登录接口
          if (res) {
            this.reset() // 重置用户状态
          }
        })
        .catch(() => {}) // 捕获取消退出的情况
    },

    /**
     * 重置用户状态
     * 清空用户信息、Token 和权限路由，并跳转到登录页面
     */
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews() // 删除所有标签视图
      this.setToken('') // 清空 Token
      this.setUserInfo(undefined) // 清空用户信息
      this.setRoleRouters([]) // 清空权限路由
      router.replace('/login') // 跳转到登录页面
    },

    /**
     * 立即退出登录
     */
    logout() {
      this.reset()
    },

    /**
     * 设置是否记住登录状态
     * @param {boolean} rememberMe 是否记住登录状态
     */
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },

    /**
     * 设置用户登录信息
     * @param {UserLoginType | undefined} loginInfo 用户登录信息
     */
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    }
  },
  persist: true // 启用状态持久化
})

/**
 * 创建 User Store 的外部实例
 * @returns {ReturnType<typeof useUserStore>} User Store 实例
 */
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
