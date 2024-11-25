<script setup lang="ts">
/**
 * @file Infotip.vue
 * @description 信息提示组件，用于展示带有高亮文字的提示内容。
 * @module Infotip
 * @date 2024-11-22
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Vue 的 PropType 类型支持
import { PropType } from 'vue'
// 引入高亮组件
import { Highlight } from '@/components/Highlight'
// 引入设计系统相关的钩子
import { useDesign } from '@/hooks/web/useDesign'
// 引入属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入 InfoTipSchema 类型定义
import { InfoTipSchema } from './types'

// 获取设计前缀类名
const { getPrefixCls } = useDesign()

// 定义当前组件的类名前缀
const prefixCls = getPrefixCls('infotip')

// 定义组件的属性
defineProps({
  /** 提示标题 */
  title: propTypes.string.def(''),
  /** 提示内容的结构 */
  schema: {
    type: Array as PropType<Array<string | InfoTipSchema>>,
    required: true,
    default: () => []
  },
  /** 是否显示序号 */
  showIndex: propTypes.bool.def(true),
  /** 高亮的颜色 */
  highlightColor: propTypes.string.def('var(--el-color-primary)')
})

// 定义组件的事件
const emit = defineEmits(['click'])

/**
 * 点击高亮关键字时触发
 * @param key - 点击的关键字
 */
const keyClick = (key: string) => {
  emit('click', key)
}
</script>

<template>
  <div
    :class="[
      prefixCls,
      'p-20px mb-20px border-1px border-solid border-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)]'
    ]"
  >
    <!-- 提示标题 -->
    <div v-if="title" :class="[`${prefixCls}__header`, 'flex items-center']">
      <Icon icon="vi-bi:exclamation-circle-fill" :size="22" color="var(--el-color-primary)" />
      <span :class="[`${prefixCls}__title`, 'pl-5px text-16px font-bold']">{{ title }}</span>
    </div>
    <!-- 提示内容 -->
    <div :class="`${prefixCls}__content`">
      <p v-for="(item, $index) in schema" :key="$index" class="text-14px mt-15px">
        <!-- 高亮关键字展示 -->
        <Highlight
          :keys="typeof item === 'string' ? [] : item.keys"
          :color="highlightColor"
          @click="keyClick"
        >
          {{ showIndex ? `${$index + 1}、` : '' }}{{ typeof item === 'string' ? item : item.label }}
        </Highlight>
      </p>
    </div>
  </div>
</template>
