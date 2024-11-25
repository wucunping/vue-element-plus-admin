<script lang="ts" setup>
/**
 * @file IAgree.vue
 * @description 用于展示可点击链接的文本组件，支持高亮显示和交互功能
 * @version 1.0.0
 * @date 2024-11-22
 * @module IAgree
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入Element Plus的复选框组件
import { ElCheckbox } from 'element-plus'

// 引入高亮组件
import { Highlight } from '@/components/Highlight'

// 引入Vue的核心功能和类型支持
import { PropType, computed } from 'vue'

// 引入链接类型定义
import { LinkItem } from './types'

/** 定义组件的属性 */
const props = defineProps({
  /** 展示的文本内容 */
  text: {
    type: String,
    default: ''
  },
  /** 链接数组，用于定义可点击的链接 */
  link: {
    type: Array as PropType<LinkItem[]>,
    default: undefined
  }
})

/** 定义复选框的双向绑定值 */
const modelValue = defineModel<boolean>()

/** 计算高亮显示的关键字数组 */
const highlightKeys = computed(() => {
  return props.link?.map((item) => item.text) || []
})

/** 处理关键字点击事件 */
const keyClick = (key: string) => {
  const linkItem = props.link?.find((item) => item.text === key)
  if (linkItem?.url) {
    // 如果链接项中有URL，则打开新窗口
    window.open(linkItem.url)
    return
  }
  if (linkItem?.onClick) {
    // 如果链接项中有点击事件回调，则执行回调
    linkItem.onClick()
  }
}
</script>

<template>
  <!-- 使用ElCheckbox和Highlight组件构建复选框与高亮文本的组合 -->
  <div class="flex items-center">
    <!-- 复选框绑定双向数据 -->
    <ElCheckbox v-model="modelValue" class="mr-0px!" />
    <!-- 高亮显示文本并支持点击事件 -->
    <Highlight class="ml-10px" :keys="highlightKeys" @click="keyClick">{{ text }}</Highlight>
  </div>
</template>
