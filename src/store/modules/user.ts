/**
 * @file user.ts
 * @description 用户状态管理的 Pinia store，包含用户信息、令牌处理、登出功能等。
 * @example
 * // 使用示例
 * const userStore = useUserStore();
 * userStore.setUserInfo({ name: '张三', age: 30 });
 * const token = userStore.getToken();
 * userStore.logout();
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-29
 * @module userStore
 */

// 从 pinia 库导入 defineStore 用于创建状态管理
import { defineStore } from 'pinia'

// 导入全局 store 实例
import { store } from '../index'

// 导入用户登录相关类型
import type { UserLoginType, UserType } from '@/api/login/types'

// 导入消息框提示组件
import { ElMessageBox } from 'element-plus'

// 导入国际化处理钩子
import { useI18n } from '@/hooks/web/useI18n'

// 导入登出 API 接口
import { loginOutApi } from '@/api/login'

// 导入标签视图存储
import { useTagsViewStore } from './tagsView'

// 导入路由实例
import router from '@/router'

/** 用户状态接口定义 */
interface UserState {
	/** 用户信息，可选 */
	userInfo?: UserType
	/** 令牌的键 */
	tokenKey: string
	/** 令牌 */
	token: string
	/** 角色路由，可选 */
	roleRouters?: string[] | AppCustomRouteRecordRaw[]
	/** 是否记住我 */
	rememberMe: boolean
	/** 登录信息，可选 */
	loginInfo?: UserLoginType
}

/** 定义用户状态管理的 store */
export const useUserStore = defineStore('user', {
	// 定义状态
	state: (): UserState => {
		return {
			userInfo: undefined, // 初始化用户信息为 undefined
			tokenKey: 'Authorization', // 令牌键的默认值
			token: '', // 初始化令牌为空字符串
			roleRouters: undefined, // 初始化角色路由为 undefined
			rememberMe: true, // 默认为记住我
			loginInfo: undefined // 初始化登录信息为 undefined
		}
	},
	// 定义获取器
	getters: {
		/** 获取令牌的键 */
		getTokenKey(): string {
			return this.tokenKey // 返回令牌键
		},
		/** 获取令牌 */
		getToken(): string {
			return this.token // 返回令牌
		},
		/** 获取用户信息 */
		getUserInfo(): UserType | undefined {
			return this.userInfo // 返回用户信息
		},
		/** 获取角色路由 */
		getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
			return this.roleRouters // 返回角色路由
		},
		/** 获取记住我的状态 */
		getRememberMe(): boolean {
			return this.rememberMe // 返回记住我的状态
		},
		/** 获取登录信息 */
		getLoginInfo(): UserLoginType | undefined {
			return this.loginInfo // 返回登录信息
		}
	},
	// 定义动作
	actions: {
		/** 设置令牌键 */
		setTokenKey(tokenKey: string) {
			this.tokenKey = tokenKey // 更新令牌键
		},
		/** 设置令牌 */
		setToken(token: string) {
			this.token = token // 更新令牌
		},
		/** 设置用户信息 */
		setUserInfo(userInfo?: UserType) {
			this.userInfo = userInfo // 更新用户信息
		},
		/** 设置角色路由 */
		setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
			this.roleRouters = roleRouters // 更新角色路由
		},
		/** 登出确认提示 */
		logoutConfirm() {
			const { t } = useI18n() // 获取国际化函数
			ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
				confirmButtonText: t('common.ok'), // 确认按钮文本
				cancelButtonText: t('common.cancel'), // 取消按钮文本
				type: 'warning' // 提示框类型为警告
			})
				.then(async () => {
					// 用户确认登出
					const res = await loginOutApi().catch(() => {}) // 调用登出 API
					if (res) {
						// 如果登出成功
						this.reset() // 重置用户状态
					}
				})
				.catch(() => {}) // 捕获错误
		},
		/** 重置用户状态 */
		reset() {
			const tagsViewStore = useTagsViewStore() // 获取标签视图存储实例
			tagsViewStore.delAllViews() // 删除所有标签视图
			this.setToken('') // 清空令牌
			this.setUserInfo(undefined) // 清空用户信息
			this.setRoleRouters([]) // 清空角色路由
			router.replace('/login') // 跳转到登录页面
		},
		/** 退出登录 */
		logout() {
			this.reset() // 重置用户状态
		},
		/** 设置记住我的状态 */
		setRememberMe(rememberMe: boolean) {
			this.rememberMe = rememberMe // 更新记住我的状态
		},
		/** 设置登录信息 */
		setLoginInfo(loginInfo: UserLoginType | undefined) {
			this.loginInfo = loginInfo // 更新登录信息
		}
	},
	// 启用持久化存储
	persist: true
})

// 导出不带参数的用户状态管理实例
export const useUserStoreWithOut = () => {
	return useUserStore(store) // 返回全局 store 的用户状态
}
