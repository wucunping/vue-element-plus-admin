<script setup lang="ts">
/**
 * @file JsonEditor.vue
 * @description 该组件用于显示可编辑的 JSON 数据，并提供交互功能。
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module JsonEditor
 */

/** 导入 VueJsonPretty 组件，用于美化显示 JSON 数据 */
import VueJsonPretty from 'vue-json-pretty'

/** 导入样式文件，包含 VueJsonPretty 组件的样式 */
import 'vue-json-pretty/lib/styles.css'

/** 导入用于类型检查的工具函数 */
import { propTypes } from '@/utils/propTypes'

/** 导入 Vue 中的 computed 方法 */
import { computed } from 'vue'

/** 定义组件的事件 */
const emits = defineEmits([
	/** 更新模型值事件 */
	'update:modelValue',
	/** 节点点击事件 */
	'node-click',
	/** 括号点击事件 */
	'brackets-click',
	/** 图标点击事件 */
	'icon-click',
	/** 选中值变化事件 */
	'selected-value'
])

/** 定义组件的 props */
const props = defineProps({
	/** 组件的值，类型为对象，默认值为空对象 */
	modelValue: {
		type: Object,
		default: () => ({})
	},
	/** 数据的深度，类型为数字，默认值为 5 */
	deep: propTypes.number.def(5),
	showLength: propTypes.bool.def(true) /** 是否显示长度，类型为布尔，默认值为 true */,
	showLineNumbers: propTypes.bool.def(true) /** 是否显示行号，类型为布尔，默认值为 true */,
	showLineNumber: propTypes.bool.def(true) /** 是否显示行号，类型为布尔，默认值为 true */,
	showIcon: propTypes.bool.def(true) /** 是否显示图标，类型为布尔，默认值为 true */,
	showDoubleQuotes: propTypes.bool.def(true) /** 是否显示双引号，类型为布尔，默认值为 true */,
	virtual: propTypes.bool.def(false) /** 是否使用虚拟滚动，类型为布尔，默认值为 false */,
	height: propTypes.number.def(400) /** 组件的高度，类型为数字，默认值为 400 */,
	itemHeight: propTypes.number.def(20) /** 每项的高度，类型为数字，默认值为 20 */,
	rootPath: propTypes.string.def('root') /** 根路径，类型为字符串，默认值为 'root' */,
	nodeSelectable: propTypes.func.def() /** 节点选择函数，接收任意参数，类型为函数 */,
	selectableType: propTypes
		.oneOf<'multiple' | 'single'>(['multiple', 'single'])
		.def() /** 选择模式，类型为字符串，可以是 'multiple' 或 'single' */,
	showSelectController:
		propTypes.bool.def(false) /** 是否显示选择控制器，类型为布尔，默认值为 false */,
	selectOnClickNode: propTypes.bool.def(true) /** 点击节点时是否选择，类型为布尔，默认值为 true */,
	highlightSelectedNode:
		propTypes.bool.def(true) /** 是否高亮选中的节点，类型为布尔，默认值为 true */,
	collapsedOnClickBrackets:
		propTypes.bool.def(true) /** 点击括号时是否折叠，类型为布尔，默认值为 true */,
	renderNodeKey: propTypes.func.def() /** 自定义渲染节点键的函数 */,
	renderNodeValue: propTypes.func.def() /** 自定义渲染节点值的函数 */,
	editable: propTypes.bool.def(true) /** 是否可编辑，类型为布尔，默认值为 true */,
	editableTrigger: propTypes
		.oneOf<'click' | 'dblclick'>(['click', 'dblclick'])
		.def(
			'click'
		) /** 可编辑触发方式，类型为字符串，可以是 'click' 或 'dblclick'，默认值为 'click' */
})

/** 计算属性，用于获取组件的模型值 */
const data = computed(() => props.modelValue)

/** 计算属性，用于处理模型值的双向绑定 */
const localModelValue = computed({
	/** 获取模型值 */
	get: () => data.value,
	/** 设置模型值并触发更新事件 */
	set: (val) => {
		console.log(val) /** 打印更新的值 */
		emits('update:modelValue', val) /** 触发更新模型值事件 */
	}
})

/**
 * 节点点击处理函数
 * @param node - 被点击的节点
 */
const nodeClick = (node: any) => {
	emits('node-click', node) /** 触发节点点击事件 */
}

/**
 * 括号点击处理函数
 * @param collapsed - 括号是否折叠
 */
const bracketsClick = (collapsed: boolean) => {
	emits('brackets-click', collapsed) /** 触发括号点击事件 */
}

/**
 * 图标点击处理函数
 * @param collapsed - 图标是否折叠
 */
const iconClick = (collapsed: boolean) => {
	emits('icon-click', collapsed) /** 触发图标点击事件 */
}

/**
 * 被选中值变化处理函数
 * @param newVal - 新的值
 * @param oldVal - 旧的值
 */
const selectedChange = (newVal: any, oldVal: any) => {
	console.log(newVal, oldVal) /** 打印新旧值 */
	emits('selected-value', newVal, oldVal) /** 触发选中值变化事件 */
}

/**
 *
 <template>
  <VueJsonPretty
    v-model:data="localModelValue"  // 绑定双向数据模型
    :deep="deep"  // 设置数据深度
    :show-length="showLength"  // 是否显示长度
    :show-line-numbers="showLineNumbers"  // 是否显示行号
    :show-line-number="showLineNumber"  // 是否显示行号
    :show-icon="showIcon"  // 是否显示图标
    :show-double-quotes="showDoubleQuotes"  // 是否显示双引号
    :virtual="virtual"  // 是否使用虚拟滚动
    :height="height"  // 设置组件高度
    :item-height="itemHeight"  // 设置每项的高度
    :root-path="rootPath"  // 设置根路径
    :node-selectable="nodeSelectable"  // 设置节点选中函数
    :selectable-type="selectableType"  // 设置选择模式
    :show-select-controller="showSelectController"  // 是否显示选择控制器
    :select-on-click-node="selectOnClickNode"  // 点击节点时是否选择
    :highlight-selected-node="highlightSelectedNode"  // 是否高亮选中节点
    :collapsed-on-click-brackets="collapsedOnClickBrackets"  // 点击括号时是否折叠
    :render-node-key="renderNodeKey"  // 自定义渲染节点键函数
    :render-node-value="renderNodeValue"  // 自定义渲染节点值函数
    :editable="editable"  // 是否可编辑
    :editable-trigger="editableTrigger"  // 设置可编辑触发方式
    @node-click="nodeClick"  // 绑定节点点击事件
    @brackets-click="bracketsClick"  // 绑定括号点击事件
    @icon-click="iconClick"  // 绑定图标点击事件
    @selected-change="selectedChange"  // 绑定选中值变化事件
  />
</template>
 */
</script>

<template>
	<!-- VueJsonPretty 组件用于展示和编辑 JSON 数据 -->
	<VueJsonPretty
		v-model:data="localModelValue"
		:deep="deep"
		:show-length="showLength"
		:show-line-numbers="showLineNumbers"
		:show-line-number="showLineNumber"
		:show-icon="showIcon"
		:show-double-quotes="showDoubleQuotes"
		:virtual="virtual"
		:height="height"
		:item-height="itemHeight"
		:root-path="rootPath"
		:node-selectable="nodeSelectable"
		:selectable-type="selectableType"
		:show-select-controller="showSelectController"
		:select-on-click-node="selectOnClickNode"
		:highlight-selected-node="highlightSelectedNode"
		:collapsed-on-click-brackets="collapsedOnClickBrackets"
		:render-node-key="renderNodeKey"
		:render-node-value="renderNodeValue"
		:editable="editable"
		:editable-trigger="editableTrigger"
		@node-click="nodeClick"
		@brackets-click="bracketsClick"
		@icon-click="iconClick"
		@selected-change="selectedChange"
	/>
</template>
