<script setup lang="ts">
/**
 * @file /src/components/Search/src/components/ActionButton.vue
 * @description ActionButton 组件，用于显示查询、重置和展开操作按钮，支持动态加载状态和国际化
 * @example 使用方式：
 * <ActionButton
 *   :showSearch="true"
 *   :showReset="true"
 *   :showExpand="false"
 *   :visible="true"
 *   :searchLoading="false"
 *   :resetLoading="false"
 *   @search="onSearch"
 *   @reset="onReset"
 *   @expand="onExpand"
 * />
 * @version 1.0.0
 * @date 2024-11-22
 * @module ActionButtonComponentModule
 * @exports ActionButtonComponent
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入图标工具，用于动态生成图标
import { useIcon } from '@/hooks/web/useIcon'

// 导入 propTypes 工具，用于定义组件的属性类型
import { propTypes } from '@/utils/propTypes'

// 导入国际化工具，用于处理多语言支持
import { useI18n } from '@/hooks/web/useI18n'

// 定义组件的事件
const emit = defineEmits(['search', 'reset', 'expand']) // 包括查询、重置和展开事件

// 获取国际化翻译函数
const { t } = useI18n()

// 定义组件的属性
defineProps({
  /** 是否显示查询按钮 */
  showSearch: propTypes.bool.def(true), // 默认显示查询按钮
  /** 是否显示重置按钮 */
  showReset: propTypes.bool.def(true), // 默认显示重置按钮
  /** 是否显示展开按钮 */
  showExpand: propTypes.bool.def(false), // 默认不显示展开按钮
  /** 当前展开状态 */
  visible: propTypes.bool.def(true), // 默认展开状态为 true
  /** 查询按钮的加载状态 */
  searchLoading: propTypes.bool.def(false), // 默认查询按钮不加载
  /** 重置按钮的加载状态 */
  resetLoading: propTypes.bool.def(false) // 默认重置按钮不加载
})

/**
 * 查询按钮点击事件
 * @description 触发查询事件
 */
const onSearch = () => {
  emit('search') // 触发 'search' 事件
}

/**
 * 重置按钮点击事件
 * @description 触发重置事件
 */
const onReset = () => {
  emit('reset') // 触发 'reset' 事件
}

/**
 * 展开按钮点击事件
 * @description 触发展开或收起事件
 */
const onExpand = () => {
  emit('expand') // 触发 'expand' 事件
}
</script>

<template>
  <!-- 查询按钮
  - v-if="showSearch" 条件渲染：是否显示查询按钮
  - type="primary" 设置按钮类型为主按钮
  - :loading="searchLoading" 绑定查询按钮的加载状态
  - :icon="useIcon({ icon: 'vi-ep:search' })" 使用搜索图标
  - @click="onSearch" 绑定查询按钮点击事件
  -->
  <BaseButton
    v-if="showSearch"
    type="primary"
    :loading="searchLoading"
    :icon="useIcon({ icon: 'vi-ep:search' })"
    @click="onSearch"
  >
    {{ t('common.query') }}
    <!-- 显示国际化的查询文本 -->
  </BaseButton>

  <!-- 重置按钮 
  - v-if="showReset" 条件渲染：是否显示重置按钮
  - :loading="resetLoading" 绑定重置按钮的加载状态
  - plain 设置按钮为朴素样式
  - :icon="useIcon({ icon: 'vi-ep:refresh-right' })" 使用刷新图标
  - @click="onReset" 绑定重置按钮点击事件
  -->
  <BaseButton
    v-if="showReset"
    :loading="resetLoading"
    plain
    :icon="useIcon({ icon: 'vi-ep:refresh-right' })"
    @click="onReset"
  >
    {{ t('common.reset') }}
    <!-- 显示国际化的重置文本 -->
  </BaseButton>

  <!-- 展开按钮
  - v-if="showExpand" 条件渲染：是否显示展开按钮
  - :icon="useIcon({ icon: visible ? 'vi-ep:arrow-up' : 'vi-ep:arrow-down' })" 根据状态动态显示展开或收起图标
  - text 设置按钮为文本样式
  - @click="onExpand" 绑定展开按钮点击事件
  -->
  <BaseButton
    v-if="showExpand"
    :icon="useIcon({ icon: visible ? 'vi-ep:arrow-up' : 'vi-ep:arrow-down' })"
    text
    @click="onExpand"
  >
    {{ t(visible ? 'common.shrink' : 'common.expand') }}
    <!-- 显示国际化的展开或收起文本 -->
  </BaseButton>
</template>
