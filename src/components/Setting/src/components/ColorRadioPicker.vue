<script setup lang="ts">
/**
 * @file /src/components/Setting/src/components/ColorRadioPicker.vue
 * @description 颜色单选选择器组件，支持选择颜色并触发变化事件
 * @example
 * <ColorRadioPicker
 *   :schema="['#ffffff', '#000000']"
 *   v-model="selectedColor"
 *   @change="handleChange"
 * />
 * @version 1.0.0
 * @date 2024-11-22
 * @module ColorRadioPickerModule
 * @author [吴尘](https://github.com/wucunping)
 */

/** 引入 Vue 的核心方法和类型 */
import { PropType, watch, unref, ref } from 'vue'
/** 引入 propTypes 工具，用于定义组件属性 */
import { propTypes } from '@/utils/propTypes'
/** 引入自定义 hooks，用于获取设计样式前缀 */
import { useDesign } from '@/hooks/web/useDesign'

/** 获取样式前缀 */
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('color-radio-picker') // 定义组件的样式前缀

/** 定义组件的 props 属性 */
const props = defineProps({
  /** 可选的颜色列表 */
  schema: {
    type: Array as PropType<string[]>, // 类型为字符串数组
    default: () => [] // 默认值为空数组
  },
  /** 当前选中的颜色值 */
  modelValue: propTypes.string.def('') // 默认值为空字符串
})

/** 定义组件的事件 */
const emit = defineEmits(['update:modelValue', 'change']) // 支持双向绑定和变化事件

/** 当前选中的颜色值 */
const colorVal = ref(props.modelValue)

/** 监听外部传入的 modelValue 变化 */
watch(
  () => props.modelValue, // 监听 modelValue
  (val: string) => {
    if (val === unref(colorVal)) return // 如果值未变化，不执行操作
    colorVal.value = val // 更新内部的 colorVal
  }
)

/** 监听内部 colorVal 的变化 */
watch(
  () => colorVal.value, // 监听 colorVal
  (val: string) => {
    emit('update:modelValue', val) // 触发 modelValue 更新事件
    emit('change', val) // 触发颜色变化事件
  }
)
</script>

<template>
  <!-- 颜色单选选择器容器 -->
  <!-- :class="prefixCls" 组件样式前缀 -->
  <!-- class="flex flex-wrap space-x-14px" 容器布局样式 -->
  <div :class="prefixCls" class="flex flex-wrap space-x-14px">
    <!-- 遍历 schema 渲染颜色选项 -->
    <!-- v-for="(item, i) in schema" 遍历颜色列表 -->
    <!-- :key="`radio-${i}`" 动态绑定唯一 key -->
    <!-- class="..." 颜色选项的基本样式 -->
    <!-- :class="{ 'is-active': colorVal === item }" 动态添加选中样式 -->
    <!-- :style="{ background: item }" 动态设置背景颜色 -->
    <!-- @click="colorVal = item" 点击事件切换选中颜色 -->
    <span
      v-for="(item, i) in schema"
      :key="`radio-${i}`"
      class="w-20px h-20px cursor-pointer rounded-2px border-solid border-gray-300 border-2px text-center leading-20px mb-5px"
      :class="{ 'is-active': colorVal === item }"
      :style="{ background: item }"
      @click="colorVal = item"
    >
      <!-- 显示选中图标 -->
      <!-- v-if="colorVal === item" 仅在选中颜色时显示图标 -->
      <!-- color="#fff" 图标颜色为白色 -->
      <!-- icon="vi-ep:check" 使用对勾图标 -->
      <!-- :size="16" 图标大小为 16px -->
      <Icon v-if="colorVal === item" color="#fff" icon="vi-ep:check" :size="16" />
    </span>
  </div>
</template>

<style lang="less" scoped>
/** 定义组件样式前缀 */
@prefix-cls: ~'@{adminNamespace}-color-radio-picker';

/** 颜色单选选择器的样式 */
.@{prefix-cls} {
  /** 选中状态的样式 */
  .is-active {
    border-color: var(--el-color-primary); // 设置边框颜色为主题颜色
  }
}
</style>
