<script setup lang="tsx">
/**
 * @file RegisterForm.vue
 * @description 这是一个注册表单组件，使用 Vue 3 和 TypeScript 进行开发。该组件提供用户注册功能，
 * 包括用户名、密码、确认密码、验证码输入框，以及同意用户协议的复选框。它集成了国际化支持，并通过 API 与后端进行交互。
 * @example <RegisterForm @to-login="handleLogin" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module RegisterForm
 */

// 导入表单模式类型定义
import type { FormSchema } from '@/components/Form'

// 导入自定义表单组件
import { Form } from '@/components/Form'

// 导入 Vue 的响应式 API
import { reactive, ref, unref } from 'vue'

// 导入国际化钩子
import { useI18n } from '@/hooks/web/useI18n'

// 导入自定义表单钩子
import { useForm } from '@/hooks/web/useForm'

// 导入 Element Plus 表单验证规则类型定义
import type { FormRules } from 'element-plus'

// 导入 Element Plus 的输入组件
import { ElInput } from 'element-plus'

// 导入自定义验证器钩子
import { useValidator } from '@/hooks/web/useValidator'

// 导入自定义基础按钮组件
import { BaseButton } from '@/components/Button'

// 导入同意协议组件
import { IAgree } from '@/components/IAgree'

// 定义触发事件的 emit 函数
const emit = defineEmits(['to-login'])

// 使用自定义表单钩子
const { formRegister, formMethods } = useForm()
// 获取表单实例的方法
const { getElFormExpose } = formMethods

// 获取国际化函数
const { t } = useI18n()

// 获取验证器
const { required, check } = useValidator()

// 定义获取验证码时间和加载状态
const getCodeTime = ref(60) // 验证码计时初始为 60 秒
const getCodeLoading = ref(false) // 验证码加载状态

/**
 * 获取验证码的函数
 * @returns {void}
 */
const getCode = () => {
	getCodeLoading.value = true // 开始加载状态
	const timer = setInterval(() => {
		getCodeTime.value-- // 每秒减一
		if (getCodeTime.value <= 0) {
			// 当时间到达 0 时
			clearInterval(timer) // 清除定时器
			getCodeTime.value = 60 // 重置计时
			getCodeLoading.value = false // 结束加载状态
		}
	}, 1000) // 每隔 1000 毫秒执行一次
}

// 创建一个响应式的表单模式数组
const schema = reactive<FormSchema[]>([
	{
		field: 'title', // 字段名称
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				default: () => {
					// 默认插槽内容
					return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.register')}</h2>
				}
			}
		}
	},
	{
		field: 'username', // 用户名字段
		label: t('login.username'), // 用户名标签
		value: '', // 默认值
		component: 'Input', // 组件类型为输入框
		colProps: {
			span: 24 // 列宽度占比
		},
		componentProps: {
			placeholder: t('login.usernamePlaceholder') // 输入框的占位符
		}
	},
	{
		field: 'password', // 密码字段
		label: t('login.password'), // 密码标签
		value: '', // 默认值
		component: 'InputPassword', // 组件类型为密码框
		colProps: {
			span: 24 // 列宽度占比
		},
		componentProps: {
			style: {
				width: '100%' // 组件样式，设置宽度为100%
			},
			strength: true, // 启用密码强度提示
			placeholder: t('login.passwordPlaceholder') // 输入框的占位符
		}
	},
	{
		field: 'check_password', // 确认密码字段
		label: t('login.checkPassword'), // 确认密码标签
		value: '', // 默认值
		component: 'InputPassword', // 组件类型为密码框
		colProps: {
			span: 24 // 列宽度占比
		},
		componentProps: {
			style: {
				width: '100%' // 组件样式，设置宽度为100%
			},
			strength: true, // 启用密码强度提示
			placeholder: t('login.passwordPlaceholder') // 输入框的占位符
		}
	},
	{
		field: 'code', // 验证码字段
		label: t('login.code'), // 验证码标签
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				default: (formData) => {
					// 默认插槽内容
					return (
						<div class="w-[100%] flex">
							{' '}
							{/* 使用 Flex 布局 */}
							<ElInput v-model={formData.code} placeholder={t('login.codePlaceholder')} />{' '}
							{/* 验证码输入框 */}
							<BaseButton
								type="primary" // 按钮类型为主要按钮
								disabled={unref(getCodeLoading)} // 根据加载状态禁用按钮
								class="ml-10px" // 设置左边距
								onClick={getCode} // 点击事件处理函数
							>
								{t('login.getCode')} {/* 按钮文本 */}
								{unref(getCodeLoading) ? `(${unref(getCodeTime)})` : ''}{' '}
								{/* 如果正在加载，则显示剩余时间 */}
							</BaseButton>
						</div>
					)
				}
			}
		}
	},

	{
		field: 'iAgree', // 同意协议字段
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				default: (formData: any) => {
					// 默认插槽内容
					return (
						<>
							<IAgree
								v-model={formData.iAgree} // 双向绑定
								text="我同意《用户协议》" // 协议文本
								link={[
									// 链接配置
									{
										text: '《用户协议》',
										url: 'https://element-plus.org/' // 协议链接
									}
								]}
							/>
						</>
					)
				}
			}
		}
	},
	{
		field: 'register', // 注册字段
		colProps: {
			span: 24 // 列宽度占比
		},
		formItemProps: {
			slots: {
				default: () => {
					// 默认插槽内容
					return (
						<>
							<div class="w-[100%]">
								<BaseButton
									type="primary" // 按钮类型为主要按钮
									class="w-[100%]" // 设置宽度为100%
									loading={loading.value} // 按钮加载状态
									onClick={loginRegister} // 点击事件处理函数
								>
									{t('login.register')} {/* 注册按钮文本 */}
								</BaseButton>
							</div>
							<div class="w-[100%] mt-15px">
								<BaseButton class="w-[100%]" onClick={toLogin}>
									{' '}
									{/* 跳转到登录按钮 */}
									{t('login.hasUser')} {/* 登录已存在用户文本 */}
								</BaseButton>
							</div>
						</>
					)
				}
			}
		}
	}
])

// 定义表单验证规则
const rules: FormRules = {
	username: [required()], // 用户名必填
	password: [required()], // 密码必填
	check_password: [required()], // 确认密码必填
	code: [required()], // 验证码必填
	iAgree: [required(), check()] // 同意协议必填
}

/**
 * 跳转到登录页面的函数
 * @returns {void}
 */
const toLogin = () => {
	emit('to-login') // 触发登录事件
}

// 定义按钮加载状态
const loading = ref(false) // 加载状态

/**
 * 注册函数
 * @returns {Promise<void>}
 */
const loginRegister = async () => {
	const formRef = await getElFormExpose() // 获取表单实例
	formRef?.validate(async (valid) => {
		// 验证表单
		if (valid) {
			// 如果验证通过
			try {
				loading.value = true // 开始加载状态
				toLogin() // 跳转到登录页面
			} finally {
				loading.value = false // 结束加载状态
			}
		}
	})
}

/*
<template>
	<Form
		:schema="schema" // 表单结构
		:rules="rules" // 表单验证规则
		label-position="top" // 标签位置设置为顶部
		hide-required-asterisk // 隐藏必填项的星号
		size="large" // 表单大小设置为大
		class="dark:(border-1 border-[var(--el-border-color)] border-solid)" // 根据暗黑模式设置边框样式
		@register="formRegister" // 注册表单事件
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
