<script setup lang="ts">
/**
 * @file Collapse.vue
 * @description 该文件实现了一个可折叠的组件，允许用户通过点击来展开或收起内容。
 * @example
 * <Collapse :color="'#FF0000'" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module CollapseComponent
 */

// 从 Vue 导入计算属性和解构函数
import { computed, unref } from 'vue'
// 从应用状态管理中导入应用商店
import { useAppStore } from '@/store/modules/app'
// 导入属性类型验证工具
import { propTypes } from '@/utils/propTypes'
// 导入设计相关的自定义 Hook
import { useDesign } from '@/hooks/web/useDesign'

// 使用设计 Hook 获取前缀类名生成函数
const { getPrefixCls } = useDesign()

// 生成组件的前缀类名
const prefixCls = getPrefixCls('collapse')

// 定义组件的属性
defineProps({
	color: propTypes.string.def('') // 颜色属性，默认为空字符串
})

// 使用应用状态管理
const appStore = useAppStore()

// 计算折叠状态
const collapse = computed(() => appStore.getCollapse) // 从应用商店获取当前折叠状态

/**
 * 切换折叠状态的方法
 */
const toggleCollapse = () => {
	const collapsed = unref(collapse) // 解构获取当前折叠状态
	appStore.setCollapse(!collapsed) // 切换折叠状态
}

/*
  <template>
  <!-- 折叠组件的根元素 -->
  <div :class="prefixCls" @click="toggleCollapse"> <!-- 点击时切换折叠状态 -->
    <Icon
      :size="18" // 图标大小
      :icon="collapse ? 'vi-ant-design:menu-unfold-outlined' : 'vi-ant-design:menu-fold-outlined'" // 根据折叠状态选择图标
      :color="color" // 图标颜色
      class="cursor-pointer" // 设置为可点击的指针样式
    />
  </div>
</template>
  */
</script>

<template>
	<div :class="prefixCls" @click="toggleCollapse">
		<Icon
			:size="18"
			:icon="collapse ? 'vi-ant-design:menu-unfold-outlined' : 'vi-ant-design:menu-fold-outlined'"
			:color="color"
			class="cursor-pointer"
		/>
	</div>
</template>
