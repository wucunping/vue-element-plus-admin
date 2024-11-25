<script setup lang="ts">
/**
 * @file Footer.vue
 * @description 应用程序的全局底部组件，用于显示版权信息
 * @version 1.0.0
 * @date 2024-11-21
 * @module Footer
 * @requires '@/store/modules/app', '@/hooks/web/useDesign', 'vue'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入应用状态管理模块
import { useAppStore } from '@/store/modules/app'
// 引入 Vue 的组合式 API
import { computed } from 'vue'
// 引入 UI 设计相关工具
import { useDesign } from '@/hooks/web/useDesign'

/** 获取设计系统的样式前缀 */
const { getPrefixCls } = useDesign()

/** 样式前缀名 */
const prefixCls = getPrefixCls('footer')

/** 获取应用状态管理实例 */
const appStore = useAppStore()

/** 计算属性：应用的标题 */
const title = computed(() => appStore.getTitle)
</script>

<template>
  <!-- 全局底部容器 -->
  <div
    :class="prefixCls"
    class="text-center text-[var(--el-text-color-placeholder)] bg-[var(--app-content-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)] overflow-hidden"
  >
    <!-- 底部的版权信息 -->
    Copyright ©2021-present {{ title }}
  </div>
</template>
