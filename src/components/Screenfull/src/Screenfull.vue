<script setup lang="ts">
/**
 * @file /src/components/Screenfull/src/Screenfull.vue
 * @description Screenfull 组件，用于切换全屏状态并提供视觉化的图标反馈
 * @example 使用方式：
 * <Screenfull color="blue" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module ScreenfullComponentModule
 * @exports ScreenfullComponent
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Icon 组件，用于显示全屏和退出全屏的图标
import { Icon } from '@/components/Icon'

// 从 vueuse/core 中导入 useFullscreen，用于管理全屏状态
import { useFullscreen } from '@vueuse/core'

// 导入 propTypes 工具，用于定义组件的属性类型
import { propTypes } from '@/utils/propTypes'

// 导入样式设计工具，用于生成样式前缀
import { useDesign } from '@/hooks/web/useDesign'

// 获取样式前缀工具函数
const { getPrefixCls } = useDesign()

// 定义样式前缀
const prefixCls = getPrefixCls('screenfull')

// 定义组件的属性
defineProps({
  /** 图标颜色 */
  color: propTypes.string.def('') // 默认为空字符串
})

// 从 useFullscreen 中解构出 toggle 方法和 isFullscreen 状态
const { toggle, isFullscreen } = useFullscreen()

/**
 * 切换全屏状态
 * @description 调用 toggle 方法切换全屏和退出全屏
 */
const toggleFullscreen = () => {
  toggle() // 切换全屏状态
}
</script>

<template>
  <!-- 点击切换全屏状态的容器 -->
  <div :class="prefixCls" @click="toggleFullscreen">
    <!-- 显示全屏或退出全屏的图标
    - :size 设置图标大小
    - :icon 根据全屏状态动态切换图标
    - :color 动态设置图标颜色
    -->
    <Icon
      :size="18"
      :icon="isFullscreen ? 'vi-zmdi:fullscreen-exit' : 'vi-zmdi:fullscreen'"
      :color="color"
    />
  </div>
</template>
