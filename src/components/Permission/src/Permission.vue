<script setup lang="ts">
/**
 * @file Permission.vue
 * @description 该文件定义了权限组件，用于根据用户权限控制内容显示。
 * @example <Permission permission="admin">管理内容</Permission>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Permission
 */

// 导入 propTypes 工具用于定义 prop 的类型
import { propTypes } from '@/utils/propTypes'
// 从 Vue 中导入 computed 和 unref 函数
import { computed, unref } from 'vue'
// 从 vue-router 中导入 useRouter 函数
import { useRouter } from 'vue-router'

// 使用 useRouter 钩子获取当前路由实例
const { currentRoute } = useRouter()

// 定义组件的 props，包含 permission 属性，默认为空字符串
const props = defineProps({
	permission: propTypes.string.def()
})

// 计算属性，获取当前路由的权限信息
const currentPermission = computed(() => {
	// 返回当前路由的 meta.permission，若无则返回空数组
	return unref(currentRoute)?.meta?.permission || []
})

// 计算属性，判断当前用户是否具有特定权限
const hasPermission = computed(() => {
	// 从 props 中获取 permission 属性
	const permission = unref(props.permission)
	// 若 permission 为空，则返回 true
	if (!permission) {
		return true
	}
	// 判断当前权限列表是否包含指定的 permission
	return unref(currentPermission).includes(permission)
})
</script>

<template>
	<!-- 若用户具有权限，则渲染插槽内容 -->
	<template v-if="hasPermission">
		<slot></slot>
	</template>
</template>
