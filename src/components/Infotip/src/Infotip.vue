<script setup lang="ts">
/**
 * @file Infotip.vue
 * @description 信息提示组件，提供标题和结构化的提示信息展示，支持高亮和点击事件。
 * @example
 * <Infotip
 *     title="提示标题"
 *     :schema="[{'label': '提示1', 'keys': ['key1']}, '提示2']"
 *     :showIndex="true"
 *     highlightColor="var(--custom-color)"
 *     @click="handleClick"
 * />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module components
 */

/** 引入 Vue 的 PropType 类型 */
import type { PropType } from 'vue'
/** 引入高亮组件 */
import { Highlight } from '@/components/Highlight'
/** 引入设计风格钩子 */
import { useDesign } from '@/hooks/web/useDesign'
/** 引入参数类型工具 */
import { propTypes } from '@/utils/propTypes'
/** 引入 InfoTipSchema 接口 */
import type { InfoTipSchema } from './types'

/** 获取前缀类名的函数 */
const { getPrefixCls } = useDesign()

/** 定义前缀类名 */
const prefixCls = getPrefixCls('infotip')

/** 定义组件的 props 属性 */
defineProps({
	/** 提示标题 */
	title: propTypes.string.def(''),
	/** 提示信息结构数组 */
	schema: {
		/** 属性类型为数组，元素为字符串或 InfoTipSchema 结构 */
		type: Array as PropType<Array<string | InfoTipSchema>>,
		/** 该属性为必填项 */
		required: true,
		/** 默认值为一个空数组 */
		default: () => []
	},
	/** 是否显示索引 */
	showIndex: propTypes.bool.def(true),
	/** 高亮颜色，默认使用主题主色 */
	highlightColor: propTypes.string.def('var(--el-color-primary)')
})

/** 定义组件发出的事件类型 */
const emit = defineEmits(['click'])

/** 点击键时触发的事件处理函数 */
const keyClick = (key: string) => {
	/** 触发 click 事件并传递键值 */
	emit('click', key)
}

/*
<Highlight
					//高亮时使用的键数组
					:keys="typeof item === 'string' ? [] : item.keys"
					//高亮颜色
					:color="highlightColor"
					//点击事件处理
					@click="keyClick"
				>
*/
</script>

<template>
	<!-- 组件主容器 -->
	<div
		:class="[
			prefixCls,
			'p-20px mb-20px border-1px border-solid border-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)]'
		]"
	>
		<!-- 如果标题存在，显示标题区域 -->
		<div v-if="title" :class="[`${prefixCls}__header`, 'flex items-center']">
			<!-- 信息图标 -->
			<Icon icon="vi-bi:exclamation-circle-fill" :size="22" color="var(--el-color-primary)" />
			<!-- 标题文本 -->
			<span :class="[`${prefixCls}__title`, 'pl-5px text-16px font-bold']">{{ title }}</span>
		</div>
		<!-- 内容区域 -->
		<div :class="`${prefixCls}__content`">
			<!-- 遍历 schema 数组，渲染每个提示项 -->
			<p v-for="(item, $index) in schema" :key="$index" class="text-14px mt-15px">
				<Highlight
					:keys="typeof item === 'string' ? [] : item.keys"
					:color="highlightColor"
					@click="keyClick"
				>
					<!-- 显示索引和提示内容 -->
					{{ showIndex ? `${$index + 1}、` : '' }}{{ typeof item === 'string' ? item : item.label }}
				</Highlight>
			</p>
		</div>
	</div>
</template>
