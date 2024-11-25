<script setup lang="ts">
/**
 * @file ContentDetailWrap.vue
 * @description 内容详情包装组件，提供标题和消息支持
 * @example
 * <ContentDetailWrap title="标题" message="详细信息">
 *   <template #header>自定义头部内容</template>
 *   插槽内容
 * </ContentDetailWrap>
 * @version 1.0.0
 * @date 2024-11-21
 * @module ContentDetailWrap
 * @requires 'element-plus', '@/utils/propTypes', '@/hooks/web/useDesign'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Element Plus 的 Card 组件
import { ElCard } from 'element-plus'
// 引入属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入 UI 设计相关工具
import { useDesign } from '@/hooks/web/useDesign'

/** 获取设计系统的样式前缀 */
const { getPrefixCls } = useDesign()

/** 样式前缀名 */
const prefixCls = getPrefixCls('content-detail-wrap')

/** 定义组件的 props 属性 */
defineProps({
  title: propTypes.string.def('') /** 标题属性，默认为空字符串 */,
  message: propTypes.string.def('') /** 消息属性，默认为空字符串 */
})
</script>

<template>
  <!-- 主容器，绑定动态类名 -->
  <div :class="[`${prefixCls}-container`, 'relative']">
    <!-- 内容卡片，应用样式前缀 -->
    <ElCard :class="[`${prefixCls}-body`, 'mb-20px']" shadow="never">
      <!-- 自定义头部插槽，添加下边框 -->
      <div class="mb-20px pb-20px" style="border-bottom: 1px solid var(--el-border-color)">
        <slot name="header"></slot>
      </div>
      <!-- 默认插槽 -->
      <slot></slot>
    </ElCard>
  </div>
</template>
