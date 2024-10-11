<script setup lang="ts">
// 使用 TypeScript 语法的 script setup 方式
/**
 * @file ConfigGlobal.vue
 * @description 该文件是用于配置全局设置的 Vue 组件
 * @example
 * <ConfigGlobal>
 *   <YourComponent />
 * </ConfigGlobal>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module config-global
 */
import { provide, computed, watch, onMounted } from 'vue' // 从 Vue 导入所需的 API
import { propTypes } from '@/utils/propTypes' // 导入自定义的属性类型验证工具
import type { ComponentSize } from 'element-plus' // 导入 Element Plus 组件的大小类型
import { ElConfigProvider } from 'element-plus' // 导入 Element Plus 的配置提供者组件
import { useLocaleStore } from '@/store/modules/locale' // 导入多语言 store
import { useWindowSize } from '@vueuse/core' // 导入窗口尺寸的组合式 API
import { useAppStore } from '@/store/modules/app' // 导入应用状态管理
import { setCssVar } from '@/utils' // 导入设置 CSS 变量的工具函数
import { useDesign } from '@/hooks/web/useDesign' // 导入设计相关的组合式 API

const { variables } = useDesign() // 获取设计相关的变量

const appStore = useAppStore() // 获取应用状态管理的实例

// 定义组件的 props
const props = defineProps({
	/**
	 * 组件的大小属性, 可选值包括 'default', 'small', 'large'
	 */
	size: propTypes.oneOf<ComponentSize>(['default', 'small', 'large']).def('default') // 定义组件大小属性，默认值为 'default'
})

provide('configGlobal', props) // 提供全局配置的 props

// 初始化所有主题色
onMounted(() => {
	// 组件挂载后执行的生命周期钩子
	appStore.setCssVarTheme() // 设置 CSS 变量以应用主题色
})

const { width } = useWindowSize() // 获取当前窗口的宽度

// 监听窗口变化
watch(
	() => width.value, // 监视窗口宽度的变化
	(width: number) => {
		// 宽度变化时的回调函数
		if (width < 768) {
			// 如果宽度小于 768 像素
			if (!appStore.getMobile) appStore.setMobile(true)
			// !appStore.getMobile ? appStore.setMobile(true) : undefined // 如果不是移动端，则设置为移动端
			setCssVar('--left-menu-min-width', '0') // 设置左侧菜单的最小宽度为 0
			appStore.setCollapse(true) // 设置菜单为折叠状态
			if (appStore.getLayout !== 'classic') appStore.setLayout('classic')
			// appStore.getLayout !== 'classic' ? appStore.setLayout('classic') : undefined // 如果当前布局不是经典布局，则设置为经典布局
		} else {
			// 如果宽度大于等于 768 像素
			if (appStore.getMobile) appStore.setMobile(false)
			// appStore.getMobile ? appStore.setMobile(false) : undefined // 如果是移动端，则设置为非移动端
			setCssVar('--left-menu-min-width', '64px') // 设置左侧菜单的最小宽度为 64 像素
		}
	},
	{
		immediate: true // 立即触发回调
	}
)

// 多语言相关
const localeStore = useLocaleStore() // 获取多语言设置的 store

const currentLocale = computed(() => localeStore.currentLocale) // 计算当前的语言环境

/*
<template>
	<ElConfigProvider
		:namespace="variables.elNamespace" // 传递命名空间
		:locale="currentLocale.elLocale" // 传递当前的语言环境
		:message="{ max: 1 }" // 传递最大消息数量
		:size="size" // 传递组件大小
	>
		<slot></slot> // 渲染插槽内容
	</ElConfigProvider>
</template>
 */
</script>

<template>
	<ElConfigProvider
		:namespace="variables.elNamespace"
		:locale="currentLocale.elLocale"
		:message="{ max: 1 }"
		:size="size"
	>
		<slot></slot>
	</ElConfigProvider>
</template>
