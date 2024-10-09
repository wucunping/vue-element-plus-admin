<script setup lang="tsx">
/**
 * @file LoginForm.vue
 * @description 这是一个登录表单组件，使用 Vue 3 和 TypeScript 进行开发。该组件提供用户登录功能，
 * 包括用户名和密码输入框、记住我复选框、登录和注册按钮，以及社交登录选项。它集成了国际化支持，并通过 API 与后端进行交互。
 * @example <LoginForm @to-register="handleRegister" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module LoginForm
 */

// 导入 Vue 的响应式 API，包括 reactive、ref、watch、onMounted 和 unref
import { reactive, ref, watch, onMounted, unref } from 'vue'

// 导入表单模式类型定义
import type { FormSchema } from '@/components/Form'

// 导入自定义表单组件
import { Form } from '@/components/Form'

// 导入国际化钩子
import { useI18n } from '@/hooks/web/useI18n'

// 导入 Element Plus 的复选框和链接组件
import { ElCheckbox, ElLink } from 'element-plus'

// 导入自定义表单钩子
import { useForm } from '@/hooks/web/useForm'

// 导入登录相关的 API
import { loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

// 导入权限状态管理
import { usePermissionStore } from '@/store/modules/permission'

// 导入 Vue Router
import { useRouter } from 'vue-router'

// 导入路由相关的类型定义
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

// 导入用户类型定义
import type { UserType } from '@/api/login/types'

// 导入验证器钩子
import { useValidator } from '@/hooks/web/useValidator'

// 导入自定义图标组件
import { Icon } from '@/components/Icon'

// 导入用户状态管理
import { useUserStore } from '@/store/modules/user'

// 导入自定义基础按钮组件
import { BaseButton } from '@/components/Button'

/**
 * 引入必填验证器
 */
const { required } = useValidator()

/**
 * 定义触发事件的 emit 函数
 * @param {string[]} events - 事件名称列表
 */
const emit = defineEmits(['to-register'])

/**
 * 获取应用状态管理的 store
 * @returns {AppStore} 应用状态管理对象
 */
const appStore = useAppStore()

/**
 * 获取用户状态管理的 store
 * @returns {UserStore} 用户状态管理对象
 */
const userStore = useUserStore()

/**
 * 获取权限状态管理的 store
 * @returns {PermissionStore} 权限状态管理对象
 */
const permissionStore = usePermissionStore()

/**
 * 状态路由对象，用于处理路由相关操作
 */
const { currentRoute, addRoute, push } = useRouter()

/**
 * 国际化函数，用于获取翻译
 * @returns {Function} 处理国际化的函数
 */
const { t } = useI18n()

/**
 * 表单验证规则
 * @type {Object}
 * @property {Array} username - 用户名的验证规则
 * @property {Array} password - 密码的验证规则
 */
const rules = {
	/** 用户名验证规则 */
	username: [required()],
	/** 密码必填规则 */
	password: [required()]
}

/**
 * 创建一个响应式的表单模式数组
 * @type {FormSchema[]}
 */
const schema = reactive<FormSchema[]>([
	{
		/**
		 * 字段名称
		 * @type {string}
		 */
		field: 'title',
		colProps: {
			/**
			 * 列属性配置
			 * @type {Object}
			 * @property {number} span - 列的宽度占比
			 */
			span: 24
		},
		formItemProps: {
			slots: {
				/**
				 * 自定义插槽内容
				 * @returns {JSX.Element} 返回标题元素
				 */
				default: () => {
					return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
				}
			}
		}
	},
	{
		field: 'username', // 用户名字段
		label: t('login.username'), // 用户名标签
		// value: 'admin', // 默认值（被注释）
		component: 'Input', // 组件类型为输入框
		colProps: {
			span: 24 // 列宽度占比
		},
		componentProps: {
			placeholder: 'admin or test' // 输入框的占位符
		}
	},
	{
		field: 'password', // 密码字段
		label: t('login.password'), // 密码标签
		// value: 'admin', // 默认值（被注释）
		component: 'InputPassword', // 组件类型为密码框
		colProps: {
			span: 24 // 列宽度占比
		},
		componentProps: {
			style: {
				width: '100%' // 组件样式，设置宽度为100%
			},
			placeholder: 'admin or test' // 输入框的占位符
		}
	},
	{
		field: 'tool', // 工具字段
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				/**
				 * 自定义插槽内容，包含记住我和忘记密码链接
				 * @returns {JSX.Element} 返回工具内容元素
				 */
				default: () => {
					return (
						<>
							<div class="flex justify-between items-center w-[100%]">
								<ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />{' '}
								{/* 记住我复选框 */}
								<ElLink type="primary" underline={false}>
									{t('login.forgetPassword')} {/* 忘记密码链接 */}
								</ElLink>
							</div>
						</>
					)
				}
			}
		}
	},
	{
		field: 'login', // 登录字段
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				/**
				 * 自定义插槽内容，包含登录和注册按钮
				 * @returns {JSX.Element} 返回登录内容元素
				 */
				default: () => {
					return (
						<>
							<div class="w-[100%]">
								<BaseButton
									loading={loading.value} // 按钮加载状态
									type="primary" // 按钮类型
									class="w-[100%]" // 按钮样式
									onClick={signIn} // 点击事件
								>
									{t('login.login')} {/* 登录按钮文本 */}
								</BaseButton>
							</div>
							<div class="w-[100%] mt-15px">
								<BaseButton class="w-[100%]" onClick={toRegister}>
									{' '}
									{/* 注册按钮 */}
									{t('login.register')} {/* 注册按钮文本 */}
								</BaseButton>
							</div>
						</>
					)
				}
			}
		}
	},
	{
		field: 'other', // 其他登录方式字段
		component: 'Divider', // 组件类型为分隔线
		label: t('login.otherLogin'), // 标签
		componentProps: {
			contentPosition: 'center' // 内容位置
		}
	},
	{
		field: 'otherIcon', // 其他登录图标字段
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				/**
				 * 自定义插槽内容，包含社交登录图标
				 * @returns {JSX.Element} 返回社交登录图标元素
				 */
				default: () => {
					return (
						<>
							<div class="flex justify-between w-[100%]">
								<Icon
									icon="vi-ant-design:github-filled" // GitHub 图标
									size={iconSize} // 图标大小
									class="cursor-pointer ant-icon" // 图标样式
									color={iconColor} // 图标颜色
									hoverColor={hoverColor} // 图标悬停颜色
								/>
								<Icon
									icon="vi-ant-design:wechat-filled" // WeChat 图标
									size={iconSize}
									class="cursor-pointer ant-icon"
									color={iconColor}
									hoverColor={hoverColor}
								/>
								<Icon
									icon="vi-ant-design:alipay-circle-filled" // Alipay 图标
									size={iconSize}
									color={iconColor}
									hoverColor={hoverColor}
									class="cursor-pointer ant-icon"
								/>
								<Icon
									icon="vi-ant-design:weibo-circle-filled" // Weibo 图标
									size={iconSize}
									color={iconColor}
									hoverColor={hoverColor}
									class="cursor-pointer ant-icon"
								/>
							</div>
						</>
					)
				}
			}
		}
	}
])

/**
 * 图标大小
 * @type {number}
 */
const iconSize = 30

/**
 * 记住我状态
 * @type {Ref<boolean>}
 */
const remember = ref(userStore.getRememberMe) // 从用户状态中获取记住我状态

/**
 * 初始化登录信息
 */
const initLoginInfo = () => {
	/**
	 * 获取用户登录信息
	 * @type {UserLoginInfo}
	 */
	const loginInfo = userStore.getLoginInfo
	if (loginInfo) {
		const { username, password } = loginInfo // 解构用户名和密码
		setValues({ username, password }) // 设置表单值
	}
}

/**
 * 组件挂载时执行初始化
 */
onMounted(() => {
	initLoginInfo() // 初始化登录信息
})

/**
 * 使用表单
 * @returns {Object} 返回表单注册和方法
 */
const { formRegister, formMethods } = useForm()

/**
 * 获取表单数据等方法
 * @type {Object}
 */
const { getFormData, getElFormExpose, setValues } = formMethods

/**
 * 按钮加载状态
 * @type {Ref<boolean>}
 */
const loading = ref(false)

/**
 * 图标颜色
 * @type {string}
 */
const iconColor = '#999'

/**
 * 图标悬停颜色
 * @type {string}
 */
const hoverColor = 'var(--el-color-primary)'

/**
 * 重定向地址
 * @type {Ref<string>}
 */
const redirect = ref<string>('')

watch(
	() => currentRoute.value, // 监听当前路由变化
	(route: RouteLocationNormalizedLoaded) => {
		redirect.value = route?.query?.redirect as string // 设置重定向地址
	},
	{
		immediate: true // 立即执行侦听
	}
)

/**
 * 用户登录函数
 */
const signIn = async () => {
	// 获取表单的实例引用
	const formRef = await getElFormExpose()
	// 验证表单
	await formRef?.validate(async (isValid) => {
		if (isValid) {
			// 开始加载
			loading.value = true
			// 获取表单数据
			const formData = await getFormData<UserType>()

			try {
				// 调用登录接口
				const res = await loginApi(formData)

				if (res) {
					// 是否记住我
					if (unref(remember)) {
						// 存储用户的登录信息
						userStore.setLoginInfo({
							username: formData.username,
							password: formData.password
						})
					} else {
						// 清空用户登录信息
						userStore.setLoginInfo(undefined)
					}
					// 设置是否记住
					userStore.setRememberMe(unref(remember))
					// 设置用户信息
					userStore.setUserInfo(res.data)
					// 是否使用动态路由
					if (appStore.getDynamicRouter) {
						// 获取角色信息
						getRole()
					} else {
						// 生成静态路由
						await permissionStore.generateRoutes('static').catch(() => {})
						// 循环添加可访问的路由
						permissionStore.getAddRouters.forEach((route) => {
							addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
						})
						// 设置已添加路由标识
						permissionStore.setIsAddRouters(true)
						// 跳转到指定路由
						push({ path: redirect.value || permissionStore.addRouters[0].path })
					}
				}
			} finally {
				// 结束加载
				loading.value = false
			}
		}
	})
}

/**
 * 获取角色信息函数
 */
const getRole = async () => {
	// 获取表单数据
	const formData = await getFormData<UserType>()
	// 设置请求参数
	const params = {
		roleName: formData.username
	}
	// 根据动态路由的设置调用不同的接口
	const res =
		appStore.getDynamicRouter && appStore.getServerDynamicRouter
			? await getAdminRoleApi(params) // 获取管理员角色
			: await getTestRoleApi(params) // 获取测试角色
	if (res) {
		// 获取路由信息
		const routers = res.data || []
		// 设置角色路由
		userStore.setRoleRouters(routers)
		if (appStore.getDynamicRouter && appStore.getServerDynamicRouter) {
			// 生成服务器动态路由
			await permissionStore.generateRoutes('server', routers).catch(() => {})
		} else {
			// 生成前端动态路由
			await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})
		}

		// 循环添加可访问的路由
		permissionStore.getAddRouters.forEach((route) => {
			addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
		})
		// 设置已添加路由标识
		permissionStore.setIsAddRouters(true)
		// 跳转到指定路由
		push({ path: redirect.value || permissionStore.addRouters[0].path })
	}
}

/**
 * 跳转到注册页面的函数
 */
const toRegister = () => {
	// 触发注册事件
	emit('to-register')
}

/*
<template>
	<!-- 表单组件 -->
	<Form
		:schema="schema"  <!-- 表单的schema，用于定义表单结构 -->
		:rules="rules"    <!-- 表单的验证规则 -->
		label-position="top"  <!-- 标签位置设置为顶部 -->
		hide-required-asterisk <!-- 隐藏必填项的星号 -->
		size="large"      <!-- 表单大小设置为大 -->
		<!-- 根据暗黑模式设置边框样式 -->
		class="dark:(border-1 border-[var(--el-border-color)] border-solid)"  
		@register="formRegister"  <!-- 注册表单事件 -->
	/>
</template>
*/
</script>

<template>
	<Form
		:schema="schema"
		:rules="rules"
		label-position="top"
		hide-required-asterisk
		size="large"
		class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
		@register="formRegister"
	/>
</template>
