<script setup lang="ts">
/**
  @file App.vue
  @description 主应用组件，包含全局配置、路由视图和灰色模式的样式控制。
  @example
  <!-- 在根目录中定义全局应用入口 -->
  <ConfigGlobal>
    <RouterView />
  </ConfigGlobal>
  @version 1.0.0
  @date 2024-11-19
  @author [吴尘](https://github.com/wucunping)
  @module App
 */

/**
 * 导入 Vue 的计算属性方法
 */
import { computed } from 'vue'

/**
 * 引入应用状态管理模块
 */
import { useAppStore } from '@/store/modules/app'

/**
 * 引入全局配置组件
 */
import { ConfigGlobal } from '@/components/ConfigGlobal'

/**
 * 引入设计系统相关 hooks
 */
import { useDesign } from '@/hooks/web/useDesign'

/**
 * 引入 Element Plus 的通知组件
 */
import { ElNotification } from 'element-plus'

/**
 * 获取设计系统前缀方法
 */
const { getPrefixCls } = useDesign()

/**
 * 应用前缀类名
 */
const prefixCls = getPrefixCls('app')

/**
 * 获取应用状态管理实例
 */
const appStore = useAppStore()

/**
 * 当前组件尺寸
 */
const currentSize = computed(() => appStore.getCurrentSize)

/**
 * 当前是否启用灰色模式
 */
const greyMode = computed(() => appStore.getGreyMode)

/**
 * 初始化主题设置
 */
appStore.initTheme()

/**
 * 弹出提示通知
 */
ElNotification({
  title: '提示',
  type: 'warning',
  duration: 0,
  dangerouslyUseHTMLString: true,
  message:
    '<div><p><strong>遇事不决，请先查阅常见问题，说不定你能找到相关解答</strong></p><p><a href="https://element-plus-admin-doc.cn/guide/fqa.html" target="_blank">链接地址</a></p></div>'
})
</script>

<template>
  <!-- 全局配置组件，绑定尺寸设置 -->
  <ConfigGlobal :size="currentSize">
    <!-- 路由视图，根据是否为灰色模式动态设置类名 -->
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
/**
 * 全局样式前缀变量
 */
@prefix-cls: ~'@{adminNamespace}-app';

/**
 * 设置全局大小样式
 */
.size {
  width: 100%;
  height: 100%;
}

/**
 * 设置 HTML 和 body 的默认样式
 */
html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

/**
 * 灰色模式样式
 */
.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
