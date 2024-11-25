<script setup lang="ts">
/**
 * @file ConfigGlobal.vue
 * @description 全局配置组件，用于全局提供配置和主题支持
 * @example
 * <ConfigGlobal :size="'large'">
 *   <YourComponent />
 * </ConfigGlobal>
 * @version 1.0.0
 * @date 2024-11-21
 * @module ConfigGlobal
 * @requires '@/utils/propTypes', 'element-plus', '@/store/modules/locale', '@vueuse/core', '@/store/modules/app', '@/utils', '@/hooks/web/useDesign'
 * @author [吴尘](https://github.com/wucunping)
 */

// Vue 提供的组合式 API
import { provide, computed, watch, onMounted } from 'vue'
// 属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入 Element Plus 相关组件和类型
import { ComponentSize, ElConfigProvider } from 'element-plus'
// 引入多语言存储模块
import { useLocaleStore } from '@/store/modules/locale'
// 引入窗口尺寸工具
import { useWindowSize } from '@vueuse/core'
// 引入应用状态管理
import { useAppStore } from '@/store/modules/app'
// 引入 CSS 变量设置工具
import { setCssVar } from '@/utils'
// UI 设计相关工具
import { useDesign } from '@/hooks/web/useDesign'

/** 获取 UI 设计系统的全局变量 */
const { variables } = useDesign()

/** 获取应用状态管理模块 */
const appStore = useAppStore()

/** 定义组件 Props */
const props = defineProps({
  size: propTypes
    .oneOf<ComponentSize>(['default', 'small', 'large'])
    .def('default') /** 组件大小，默认为 default */
})

/** 全局提供 ConfigGlobal 配置 */
provide('configGlobal', props)

/** 生命周期钩子：组件挂载时初始化主题色 */
onMounted(() => {
  appStore.setCssVarTheme()
})

/** 获取窗口宽度 */
const { width } = useWindowSize()

/** 监听窗口宽度变化，动态调整应用布局 */
watch(
  () => width.value,
  (width: number) => {
    if (width < 768) {
      !appStore.getMobile ? appStore.setMobile(true) : undefined /** 设置移动端模式 */
      setCssVar('--left-menu-min-width', '0') /** 设置左侧菜单最小宽度 */
      appStore.setCollapse(true) /** 设置菜单折叠 */
      appStore.getLayout !== 'classic'
        ? appStore.setLayout('classic')
        : undefined /** 切换到经典布局 */
    } else {
      appStore.getMobile ? appStore.setMobile(false) : undefined /** 取消移动端模式 */
      setCssVar('--left-menu-min-width', '64px') /** 恢复左侧菜单最小宽度 */
    }
  },
  {
    immediate: true /** 立即执行监听 */
  }
)

/** 获取多语言存储模块 */
const localeStore = useLocaleStore()

/** 计算属性：当前语言配置 */
const currentLocale = computed(() => localeStore.currentLocale)
</script>

<template>
  <!-- Element Plus 的配置提供者
   - :namespace 动态绑定命名空间
   - :locale 动态绑定语言环境
   - :message 配置全局消息最大数量
   - :size 传递全局尺寸配置
  -->
  <ElConfigProvider
    :namespace="variables.elNamespace"
    :locale="currentLocale.elLocale"
    :message="{ max: 1 }"
    :size="size"
  >
    <slot></slot>
  </ElConfigProvider>
</template>
