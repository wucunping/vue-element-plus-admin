<script setup lang="ts">
/**
 * @file /src/components/Permission/src/Permission.vue
 * @description Permission 组件，用于控制子组件的渲染，基于权限验证
 * @example 使用方式：
 * <Permission permission="admin">
 *   <Button>只有管理员可见</Button>
 * </Permission>
 * @version 1.0.0
 * @date 2024-11-22
 * @module PermissionComponentModule
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 propTypes 工具，用于定义组件属性类型
import { propTypes } from '@/utils/propTypes'

// 从 Vue 中引入 computed 和 unref 工具，用于处理响应式数据
import { computed, unref } from 'vue'

// 从 Vue Router 中引入 useRouter，用于获取当前路由信息
import { useRouter } from 'vue-router'

// 从路由中获取当前路由对象
const { currentRoute } = useRouter()

// 定义组件的 props
const props = defineProps({
  /** 需要验证的权限标识 */
  permission: propTypes.string.def() // 权限字符串，默认为空
})

// 计算属性：获取当前路由的权限信息
const currentPermission = computed(() => {
  return unref(currentRoute)?.meta?.permission || [] // 从路由的 meta 中获取权限信息，默认为空数组
})

// 计算属性：判断当前用户是否拥有指定权限
const hasPermission = computed(() => {
  const permission = unref(props.permission) // 获取传入的权限标识
  if (!permission) {
    return true // 如果未定义权限标识，默认允许通过
  }
  return unref(currentPermission).includes(permission) // 验证权限是否匹配
})
</script>

<template>
  <!-- 渲染插槽内容，如果通过权限验证 -->
  <template v-if="hasPermission">
    <slot></slot>
  </template>
</template>
