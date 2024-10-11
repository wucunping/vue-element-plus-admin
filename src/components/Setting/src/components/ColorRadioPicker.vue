<script setup lang="ts">
/**
 * @file ColorRadioPicker.vue
 * @description 颜色单选框组件，允许用户从一组颜色中选择
 * @example <ColorRadioPicker :schema="['#ff0000', '#00ff00', '#0000ff']" v-model="selectedColor" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ColorRadioPicker
 */

// 引入 Vue PropType 类型
import type { PropType } from 'vue'
// 引入 Vue 相关函数
import { watch, unref, ref } from 'vue'
// 引入自定义的属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入设计相关的 hook
import { useDesign } from '@/hooks/web/useDesign'

// 调用 useDesign hook 获取前缀类名生成函数
const { getPrefixCls } = useDesign()

// 生成组件的前缀类名
const prefixCls = getPrefixCls('color-radio-picker')

/**
 * 定义组件的 props
 * @type {Object}
 * @property {Array<string>} schema - 颜色数组
 * @property {string} modelValue - 当前选中的颜色
 */
const props = defineProps({
	schema: {
		// 指定为颜色数组类型
		type: Array as PropType<string[]>,
		// 默认值为空数组
		default: () => []
	},
	modelValue: propTypes.string.def('') // 绑定的值，默认值为空字符串
})

// 定义发射的事件
const emit = defineEmits(['update:modelValue', 'change'])

// 创建响应式的颜色值
const colorVal = ref(props.modelValue)

// 监听 modelValue 的变化
watch(
	() => props.modelValue,
	(val: string) => {
		// 如果 val 与当前 colorVal 相同，则直接返回
		if (val === unref(colorVal)) return
		// 否则更新 colorVal 的值
		colorVal.value = val
	}
)

// 监听 colorVal 的变化
watch(
	() => colorVal.value,
	(val: string) => {
		// 发射更新模型值的事件
		emit('update:modelValue', val)
		// 发射颜色变化的事件
		emit('change', val)
	}
)

/*
<template>
	<div :class="prefixCls" class="flex flex-wrap space-x-14px">
		<span
			// 遍历 schema 数组，生成颜色选项
			v-for="(item, i) in schema"
			:key="`radio-${i}`" // 每个元素的唯一键
			class="w-20px h-20px cursor-pointer rounded-2px border-solid border-gray-300 border-2px text-center leading-20px mb-5px"
			:class="{ 'is-active': colorVal === item }" // 当前颜色是否被选中
			:style="{
				background: item // 背景颜色为当前颜色
			}"
			@click="colorVal = item" // 点击时更新 colorVal
		>
			<Icon v-if="colorVal === item" color="#fff" icon="vi-ep:check" :size="16" /> // 选中时显示勾选图标
		</span>
	</div>
</template>
*/
</script>

<template>
	<div :class="prefixCls" class="flex flex-wrap space-x-14px">
		<span
			v-for="(item, i) in schema"
			:key="`radio-${i}`"
			class="w-20px h-20px cursor-pointer rounded-2px border-solid border-gray-300 border-2px text-center leading-20px mb-5px"
			:class="{ 'is-active': colorVal === item }"
			:style="{
				background: item
			}"
			@click="colorVal = item"
		>
			<Icon v-if="colorVal === item" color="#fff" icon="vi-ep:check" :size="16" />
		</span>
	</div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-color-radio-picker';

// 定义组件的样式
.@{prefix-cls} {
	.is-active {
		border-color: var(--el-color-primary); // 选中状态的边框颜色
	}
}
</style>
