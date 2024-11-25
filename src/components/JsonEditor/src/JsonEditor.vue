<script setup lang="ts">
/**
 * @file /src/components/JsonEditor/src/JsonEditor.vue
 * @description JsonEditor 组件，用于展示和操作 JSON 数据，支持丰富的自定义功能
 * @example 使用方式：
 * <JsonEditor v-model="jsonData" :deep="5" :editable="true" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module JsonEditorComponentModule
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 VueJsonPretty 组件，用于美观地展示 JSON 数据
import VueJsonPretty from 'vue-json-pretty'

// 引入 VueJsonPretty 样式文件
import 'vue-json-pretty/lib/styles.css'
import { propTypes } from '@/utils/propTypes'

// 引入 Vue 的计算属性功能
import { computed } from 'vue'

// 定义组件的事件
const emits = defineEmits([
  /** 当 modelValue 更新时触发 */
  'update:modelValue',
  /** 当节点被点击时触发 */
  'node-click',
  /** 当括号被点击时触发 */
  'brackets-click',
  /** 当图标被点击时触发 */
  'icon-click',
  /** 当选中值变化时触发 */
  'selected-value'
])

// 定义组件的属性
const props = defineProps({
  /** 绑定的 JSON 数据 */
  modelValue: {
    type: Object,
    default: () => ({})
  },
  /** 嵌套深度 */
  deep: propTypes.number.def(5),
  /** 是否显示对象/数组长度 */
  showLength: propTypes.bool.def(true),
  /** 是否显示行号（优先级低） */
  showLineNumbers: propTypes.bool.def(true),
  /** 是否显示行号（优先级高） */
  showLineNumber: propTypes.bool.def(true),
  /** 是否显示节点图标 */
  showIcon: propTypes.bool.def(true),
  /** 是否显示双引号 */
  showDoubleQuotes: propTypes.bool.def(true),
  /** 是否启用虚拟滚动 */
  virtual: propTypes.bool.def(false),
  /** 编辑器高度 */
  height: propTypes.number.def(400),
  /** 每项高度 */
  itemHeight: propTypes.number.def(20),
  /** 根路径标识 */
  rootPath: propTypes.string.def('root'),
  /** 节点是否可选的回调函数 */
  nodeSelectable: propTypes.func.def(),
  /** 节点选择类型 */
  selectableType: propTypes.oneOf<'multiple' | 'single'>(['multiple', 'single']).def(),
  /** 是否显示选择控制器 */
  showSelectController: propTypes.bool.def(false),
  /** 是否点击节点时选中 */
  selectOnClickNode: propTypes.bool.def(true),
  /** 是否高亮选中节点 */
  highlightSelectedNode: propTypes.bool.def(true),
  /** 是否点击括号时折叠 */
  collapsedOnClickBrackets: propTypes.bool.def(true),
  /** 自定义节点键渲染函数 */
  renderNodeKey: propTypes.func.def(),
  /** 自定义节点值渲染函数 */
  renderNodeValue: propTypes.func.def(),
  /** 是否允许编辑 */
  editable: propTypes.bool.def(true),
  /** 编辑触发方式 */
  editableTrigger: propTypes.oneOf<'click' | 'dblclick'>(['click', 'dblclick']).def('click')
})

// 计算属性：组件绑定的数据
const data = computed(() => props.modelValue)

// 计算属性：本地 modelValue，用于支持双向绑定
const localModelValue = computed({
  get: () => data.value,
  set: (val) => {
    console.log(val) // 输出修改后的值
    emits('update:modelValue', val) // 触发 modelValue 更新事件
  }
})

// 方法：处理节点点击事件
const nodeClick = (node: any) => {
  emits('node-click', node) // 触发节点点击事件
}

// 方法：处理括号点击事件
const bracketsClick = (collapsed: boolean) => {
  emits('brackets-click', collapsed) // 触发括号点击事件
}

// 方法：处理图标点击事件
const iconClick = (collapsed: boolean) => {
  emits('icon-click', collapsed) // 触发图标点击事件
}

// 方法：处理选中值变化事件
const selectedChange = (newVal: any, oldVal: any) => {
  console.log(newVal, oldVal) // 输出新值和旧值
  emits('selected-value', newVal, oldVal) // 触发选中值变化事件
}
</script>

<template>
  <!-- JSON Pretty 组件，用于渲染和操作 JSON 数据
  - v-model:data 绑定组件的数据，支持双向绑定
  - :deep 设定 JSON 展示的嵌套深度
  - :show-length 设定是否显示对象或数组的长度信息
  - :show-line-numbers 设定是否显示行号（优先级低）
  - :show-line-number 设定是否显示行号（优先级高）
  - :show-icon 设定是否显示节点图标
  - :show-double-quotes 设定是否显示 JSON 字符串的双引号
  - :virtual 设定是否启用虚拟滚动，优化性能
  - :height 设定组件的高度，单位为像素
  - :item-height 设定每个节点的高度，单位为像素
  - :root-path 设定根路径的名称
  - :node-selectable 设定节点是否可选的条件函数
  - :selectable-type 设定节点选择的类型，支持单选或多选
  - :show-select-controller 设定是否显示选择控制器
  - :select-on-click-node 设定是否在点击节点时触发选择
  - :highlight-selected-node 设定是否高亮显示选中的节点
  - :collapsed-on-click-brackets 设定是否在点击括号时折叠节点
  - :render-node-key 设定自定义节点键的渲染函数
  - :render-node-value 设定自定义节点值的渲染函数
  - :editable 设定是否允许对 JSON 数据进行编辑
  - :editable-trigger 设定编辑触发方式（单击或双击）
  - @node-click 绑定节点点击事件
  - @brackets-click 绑定括号点击事件
  - @icon-click 绑定图标点击事件
  - @selected-change 绑定选中值变化事件
  -->
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
