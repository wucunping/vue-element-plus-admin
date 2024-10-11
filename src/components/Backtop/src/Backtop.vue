<script setup lang="ts">
/**
 * @file Backtop.vue
 * @description 该组件实现了返回顶部功能，基于 Element Plus 的 ElBacktop 组件自定义封装。
 * @example
 * <template>
 *   <Backtop />
 * </template>
 *
 * <script setup>
 * import { Backtop } from '路径/到/Backtop';
 * '<'/script>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module Backtop
 */

/**
 * 引入Element Plus库中的ElBacktop组件
 * @module ElementPlus
 */
import { ElBacktop } from 'element-plus'

/**
 * 使用自定义设计hooks，获取前缀和变量
 * @module useDesign
 */
import { useDesign } from '@/hooks/web/useDesign'

// 使用useDesign hooks获取前缀和变量
const { getPrefixCls, variables } = useDesign()

// 获取当前组件的前缀类名
const prefixCls = getPrefixCls('backtop')

/*
<template>
	<ElBacktop
		:class="prefixCls"  <!-- 绑定前缀类名 -->
		:target="`.${variables.namespace}-layout-content-scrollbar .${variables.elNamespace}-scrollbar__wrap`"  <!-- 定义返回顶部的目标元素 -->
	/>
</template>
*/
</script>

<template>
	<ElBacktop
		:class="prefixCls"
		:target="`.${variables.namespace}-layout-content-scrollbar .${variables.elNamespace}-scrollbar__wrap`"
	/>
</template>
