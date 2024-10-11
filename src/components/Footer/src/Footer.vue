<script setup lang="ts">
/**
 * @file Footer.vue
 * @description 页脚组件
 * @example <Footer />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Footer
 */

// 导入应用状态管理模块
import { useAppStore } from '@/store/modules/app'

// 导入 Vue 的 computed 方法
import { computed } from 'vue'

// 导入设计相关的自定义钩子
import { useDesign } from '@/hooks/web/useDesign'

// 使用自定义的设计钩子获取类前缀
const { getPrefixCls } = useDesign()

// 定义前缀类名
const prefixCls = getPrefixCls('footer')

// 获取应用状态管理实例
const appStore = useAppStore()

// 计算属性，获取应用的标题
const title = computed(() => appStore.getTitle)

/*
<template>
	<div
		:class="prefixCls"  <!-- 使用动态类名 -->
		class="text-center text-[var(--el-text-color-placeholder)] bg-[var(--app-content-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)] overflow-hidden"  <!-- 设置样式 -->
	>
		Copyright ©2021-present {{ title }}  <!-- 显示版权和标题 -->
	</div>
</template>
*/
</script>

<template>
	<div
		:class="prefixCls"
		class="text-center text-[var(--el-text-color-placeholder)] bg-[var(--app-content-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)] overflow-hidden"
	>
		Copyright ©2021-present {{ title }}
	</div>
</template>
