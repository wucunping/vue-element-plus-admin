<script setup lang="ts">
/**
 * @file Collapse.vue
 * @description 可折叠按钮组件，提供菜单展开/收起功能
 * @example
 * <Collapse :color="'#fff'" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module Collapse
 * @requires '@/store/modules/app', '@/utils/propTypes', '@/hooks/web/useDesign'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Vue 组合式 API
import { computed, unref } from 'vue'
// 应用状态管理
import { useAppStore } from '@/store/modules/app'
// 属性类型工具
import { propTypes } from '@/utils/propTypes'
// UI 设计相关工具
import { useDesign } from '@/hooks/web/useDesign'

/** 获取设计系统的样式前缀 */
const { getPrefixCls } = useDesign()

/** 样式前缀名 */
const prefixCls = getPrefixCls('collapse')

/** 定义组件的 props 属性 */
defineProps({
  color: propTypes.string.def('') /** 组件颜色属性，默认为空字符串 */
})

/** 引入应用状态管理 */
const appStore = useAppStore()

/** 计算属性：是否折叠状态 */
const collapse = computed(() => appStore.getCollapse)

/** 方法：切换折叠状态 */
const toggleCollapse = () => {
  const collapsed = unref(collapse) /** 取消计算属性的引用 */
  appStore.setCollapse(!collapsed) /** 更新折叠状态 */
}
</script>

<template>
  <!-- 主容器，绑定动态类名 -->
  <div :class="prefixCls" @click="toggleCollapse">
    <!-- 图标组件 -->
    <Icon
      :size="18"
      :icon="collapse ? 'vi-ant-design:menu-unfold-outlined' : 'vi-ant-design:menu-fold-outlined'"
      :color="color"
      class="cursor-pointer"
    />
    <!-- 
        size: 图标大小 
        icon: 根据折叠状态动态切换图标
        color: 动态设置图标颜色
        class: 定义指针样式 
      -->
  </div>
</template>
