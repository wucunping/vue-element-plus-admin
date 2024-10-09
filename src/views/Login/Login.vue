<script setup lang="ts">
/**
 * @file Login.vue
 * @description 这是一个登录页面组件，包含登录和注册的切换逻辑以及主题和语言切换功能。
 * @example <Login />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module LoginPage
 */

// 导入登录和注册表单组件
import { LoginForm, RegisterForm } from './components'

// 导入主题切换组件
import { ThemeSwitch } from '@/components/ThemeSwitch'

// 导入语言选择下拉菜单组件
import { LocaleDropdown } from '@/components/LocaleDropdown'

// 导入国际化钩子
import { useI18n } from '@/hooks/web/useI18n'

// 导入获取 CSS 变量的工具函数
import { getCssVar, underlineToHump } from '@/utils'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

// 导入设计系统钩子
import { useDesign } from '@/hooks/web/useDesign'

// 导入 Vue 响应式 API
import { ref } from 'vue'

// 导入 Element Plus 的滚动条组件
import { ElScrollbar } from 'element-plus'

// 获取设计前缀的函数
const { getPrefixCls } = useDesign()

// 定义前缀类
const prefixCls = getPrefixCls('login')

// 获取应用状态的 store
const appStore = useAppStore()

// 获取国际化函数
const { t } = useI18n()

// 定义是否为登录状态的引用
const isLogin = ref(true) // 默认设置为登录状态

/**
 * 跳转到注册页面的函数
 * @returns {void}
 */
const toRegister = () => {
	isLogin.value = false // 设置状态为不登录，显示注册表单
}

/**
 * 跳转到登录页面的函数
 * @returns {void}
 */
const toLogin = () => {
	isLogin.value = true // 设置状态为登录，显示登录表单
}

/**
 * 主题改变的处理函数
 * @returns {void}
 */
const themeChange = () => {
	const color = getCssVar('--el-bg-color') // 获取当前背景色
	appStore.setMenuTheme(color) // 设置菜单主题颜色
	appStore.setHeaderTheme(color) // 设置头部主题颜色
}

/*
<template>
	<div
		:class="prefixCls" // 应用动态类名
		class="h-[100%] relative lt-xl:bg-[var(--login-bg-color)] lt-sm:px-10px lt-xl:px-10px lt-md:px-10px" 
	>
		<ElScrollbar class="h-full"> <!-- 使用滚动条组件 -->
			<div class="relative flex mx-auto min-h-100vh"> <!-- 中心对齐 -->
				<div
					:class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden`" 
				>
					<div class="flex items-center relative text-white"> <!-- 顶部 Logo 和标题 -->
						<img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
						<span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
					</div>
					<div class="flex justify-center items-center h-[calc(100%-60px)]"> <!-- 登录欢迎信息 -->
						<TransitionGroup
							appear
							tag="div"
							enter-active-class="animate__animated animate__bounceInLeft"
						>
							<img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="w-350px" />
							<div class="text-3xl text-white" key="2">{{ t('login.welcome') }}</div>
							<div class="mt-5 font-normal text-white text-14px" key="3">
								{{ t('login.message') }}
							</div>
						</TransitionGroup>
					</div>
				</div>
				<!-- 注册或登录表单区域 -->
				<div class="flex-1 p-30px lt-sm:p-10px dark:bg-[var(--login-bg-color)] relative">
					<div
						class="flex justify-between items-center text-white at-2xl:justify-end at-xl:justify-end"
					>
						<div class="flex items-center at-2xl:hidden at-xl:hidden"> <!-- Logo 和标题 -->
							<img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
							<span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
						</div>

						<div class="flex justify-end items-center space-x-10px"> <!-- 主题和语言切换 -->
							<ThemeSwitch @change="themeChange" /> <!-- 主题切换组件 -->
							<LocaleDropdown class="lt-xl:text-white dark:text-white" /> <!-- 语言选择组件 -->
						</div>
					</div>
					<Transition appear enter-active-class="animate__animated animate__bounceInRight"> <!-- 表单过渡效果 -->
						<div
							class="h-full flex items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px"
						>
							<LoginForm
								v-if="isLogin" <!-- 如果是登录状态，显示登录表单 -->
								class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
								@to-register="toRegister" <!-- 触发注册事件 -->
							/>
							<RegisterForm
								v-else <!-- 否则显示注册表单 -->
								class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
								@to-login="toLogin" <!-- 触发登录事件 -->
							/>
						</div>
					</Transition>
				</div>
			</div>
		</ElScrollbar>
	</div>
</template>
*/
</script>

<template>
	<div
		:class="prefixCls"
		class="h-[100%] relative lt-xl:bg-[var(--login-bg-color)] lt-sm:px-10px lt-xl:px-10px lt-md:px-10px"
	>
		<ElScrollbar class="h-full">
			<div class="relative flex mx-auto min-h-100vh">
				<div
					:class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden`"
				>
					<div class="flex items-center relative text-white">
						<img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
						<span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
					</div>
					<div class="flex justify-center items-center h-[calc(100%-60px)]">
						<TransitionGroup
							appear
							tag="div"
							enter-active-class="animate__animated animate__bounceInLeft"
						>
							<img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="w-350px" />
							<div class="text-3xl text-white" key="2">{{ t('login.welcome') }}</div>
							<div class="mt-5 font-normal text-white text-14px" key="3">
								{{ t('login.message') }}
							</div>
						</TransitionGroup>
					</div>
				</div>
				<div class="flex-1 p-30px lt-sm:p-10px dark:bg-[var(--login-bg-color)] relative">
					<div
						class="flex justify-between items-center text-white at-2xl:justify-end at-xl:justify-end"
					>
						<div class="flex items-center at-2xl:hidden at-xl:hidden">
							<img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
							<span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
						</div>

						<div class="flex justify-end items-center space-x-10px">
							<ThemeSwitch @change="themeChange" />
							<LocaleDropdown class="lt-xl:text-white dark:text-white" />
						</div>
					</div>
					<Transition appear enter-active-class="animate__animated animate__bounceInRight">
						<div
							class="h-full flex items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px"
						>
							<LoginForm
								v-if="isLogin"
								class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
								@to-register="toRegister"
							/>
							<RegisterForm
								v-else
								class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
								@to-login="toLogin"
							/>
						</div>
					</Transition>
				</div>
			</div>
		</ElScrollbar>
	</div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-login'; // 声明前缀类变量

.@{prefix-cls} {
	overflow: auto; // 允许溢出自动滚动

	&__left {
		&::before {
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左边对齐
			z-index: -1; // 设置 z-index 层级
			width: 100%; // 宽度占满
			height: 100%; // 高度占满
			background-image: url('@/assets/svgs/login-bg.svg'); // 背景图
			background-position: center; // 背景居中
			background-repeat: no-repeat; // 不重复背景图
			content: ''; // 内容为空
		}
	}
}
</style>
