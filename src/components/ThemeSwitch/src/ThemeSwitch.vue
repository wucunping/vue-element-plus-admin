<script setup lang="ts">
/**
 * @file ThemeSwitch.vue
 * @description 这是一个主题切换组件，用于在亮色和暗色主题之间切换，并根据用户的选择更新应用程序的主题。
 * @example <ThemeSwitch @change="handleThemeChange" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module ThemeSwitch
 */

// 导入 Vue 的响应式 API
import { ref } from 'vue'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

// 导入 Element Plus 的开关组件
import { ElSwitch } from 'element-plus'

// 导入自定义图标钩子
import { useIcon } from '@/hooks/web/useIcon'

// 导入自定义设计钩子
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计前缀的函数
const { getPrefixCls } = useDesign()

// 定义触发事件的 emit 函数
const emit = defineEmits(['change'])

// 获取组件的前缀类名
const prefixCls = getPrefixCls('theme-switch')

// 使用自定义钩子获取 Sun 图标
const Sun = useIcon({ icon: 'vi-emojione-monotone:sun', color: '#fde047' })

// 使用自定义钩子获取 Crescent Moon 图标
const CrescentMoon = useIcon({ icon: 'vi-emojione-monotone:crescent-moon', color: '#fde047' })

// 获取应用状态的 store
const appStore = useAppStore()

// 初始化获取当前是否是暗黑主题
const isDark = ref(appStore.getIsDark) // 创建响应式变量，默认为应用状态中的暗黑主题状态

// 设置开关的背景颜色
const blackColor = 'var(--el-color-black)' // 定义黑色变量，用于开关背景

/**
 * 主题切换处理函数
 * @param {boolean} val - 主题状态，true 表示暗黑主题，false 表示亮色主题
 * @returns {void}
 */
const themeChange = (val: boolean) => {
	appStore.setIsDark(val) // 更新应用状态中的暗黑主题状态
	emit('change', val) // 触发 change 事件，将新主题状态传递
}

/*
<template>
	<ElSwitch
		:class="prefixCls" // 应用前缀类名
		v-model="isDark" // 双向绑定当前主题状态
		inline-prompt // 允许在切换时显示提示
		:border-color="blackColor" // 设置开关的边框颜色
		:inactive-color="blackColor" // 设置未激活状态的颜色
		:active-color="blackColor" // 设置激活状态的颜色
		:active-icon="Sun" // 设置激活状态的图标
		:inactive-icon="CrescentMoon" // 设置未激活状态的图标
		@change="themeChange" // 绑定主题切换事件
	/>
</template>
*/
</script>

<template>
	<ElSwitch
		:class="prefixCls"
		v-model="isDark"
		inline-prompt
		:border-color="blackColor"
		:inactive-color="blackColor"
		:active-color="blackColor"
		:active-icon="Sun"
		:inactive-icon="CrescentMoon"
		@change="themeChange"
	/>
</template>

<style lang="less" scoped>
/* 深度选择器，允许修改 Element Plus 组件的样式 */
:deep(.el-switch__core .el-switch__inner .is-icon) {
	overflow: visible; // 设置图标的溢出为可见
}
</style>
