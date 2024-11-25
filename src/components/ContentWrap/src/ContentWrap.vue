<script setup lang="ts">
/**
 * @file ContentWrap.vue
 * @description 内容包装组件，用于展示带标题和提示信息的内容块
 * @example
 * <ContentWrap title="标题" message="提示信息">
 *   <div>内容</div>
 * </ContentWrap>
 * @version 1.0.0
 * @date 2024-11-21
 * @module ContentWrap
 * @requires element-plus, '@/utils/propTypes', '@/hooks/web/useDesign'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Element Plus 的组件
import { ElCard, ElTooltip } from 'element-plus'
// 引入属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入设计相关工具
import { useDesign } from '@/hooks/web/useDesign'

// 获取样式前缀工具
const { getPrefixCls } = useDesign()

/** 样式前缀 */
const prefixCls = getPrefixCls('content-wrap')

/** 定义组件的 props */
defineProps({
  title: propTypes.string.def('') /** 组件标题，默认为空字符串 */,
  message: propTypes.string.def('') /** 组件的提示信息，默认为空字符串 */
})
</script>

<template>
  <!-- 卡片容器 -->
  <ElCard :class="[prefixCls]" shadow="never">
    <!-- 卡片标题 -->
    <template v-if="title" #header>
      <div class="flex items-center">
        <span class="text-16px font-700">{{ title }}</span>
        <!-- 提示信息 -->
        <ElTooltip v-if="message" effect="dark" placement="right">
          <template #content>
            <div class="max-w-200px">{{ message }}</div>
          </template>
          <!-- 提示图标 -->
          <!-- 
            class: 添加额外的左边距样式
            icon: 显示提示的问号图标
            size: 设置图标大小为14
          -->
          <Icon class="ml-5px" icon="vi-bi:question-circle-fill" :size="14" />
        </ElTooltip>
        <div class="flex pl-20px flex-grow">
          <slot name="header"></slot>
        </div>
      </div>
    </template>
    <!-- 内容插槽 -->
    <div>
      <slot></slot>
    </div>
  </ElCard>
</template>
