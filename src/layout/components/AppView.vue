<script setup lang="ts">
/**
 * @file AppView.vue
 * @description 主应用视图组件，展示路由页面和底部信息
 * @example <AppView />
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module AppView
 */
import { useTagsViewStore } from '@/store/modules/tagsView' // 导入标签视图状态管理
import { useAppStore } from '@/store/modules/app' // 导入应用状态管理
import { Footer } from '@/components/Footer' // 导入底部组件
import { computed } from 'vue' // 导入计算属性

const appStore = useAppStore() // 使用应用状态管理

const footer = computed(() => appStore.getFooter) // 计算属性，获取底部信息

const tagsViewStore = useTagsViewStore() // 使用标签视图状态管理

/** 计算属性，返回缓存的视图数组 */
const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
</script>

<template>
  <section
    :class="[
      'box-border p-[var(--app-content-padding)] w-full bg-[var(--app-content-bg-color)] dark:bg-[var(--el-bg-color)]', // 应用的外观样式
      {
        // 判断是否存在底部内容，动态调整最小高度
        '!min-h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-footer-height))] pb-0':
          footer
      }
    ]"
  >
    <!-- 路由视图组件 -->
    <router-view>
      <!-- 默认插槽，接收组件和路由 -->
      <template #default="{ Component, route }">
        <!-- 缓存视图 以下是动态组件，中间不能加注释，否则会报错 -->
        <keep-alive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <!-- 如果底部存在则渲染底部组件 -->
  <Footer v-if="footer" />
</template>
