<script setup lang="ts">
/**
 * @file Icon.vue
 * @description 图标组件定义，包括本地图标和在线图标支持
 * @module Icon
 * @date 2024-11-22
 * @author [吴尘](https://github.com/wucunping)
 */

/** 导入 Vue 核心模块 */
import { computed, unref } from 'vue'
/** 导入 Element Plus 的 ElIcon 组件 */
import { ElIcon } from 'element-plus'
/** 导入自定义类型定义和工具模块 */
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
/** 导入在线图标库 Iconify */
import { Icon } from '@iconify/vue'
/** 导入常量 ICON_PREFIX */
import { ICON_PREFIX } from '@/constants'

/** 使用设计系统中的前缀获取函数 */
const { getPrefixCls } = useDesign()
/** 设置图标样式前缀 */
const prefixCls = getPrefixCls('icon')

/** 定义组件的属性 */
const props = defineProps({
  /** 图标名称 */
  icon: propTypes.string,
  /** 图标颜色 */
  color: propTypes.string,
  /** 图标大小，默认值为 16 */
  size: propTypes.number.def(16),
  /** 图标悬停时的颜色 */
  hoverColor: propTypes.string
})

/** 判断是否是本地图标 */
const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

/** 获取本地图标的符号 ID */
const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon
})

/** 判断是否使用在线图标 */
const isUseOnline = computed(() => {
  return import.meta.env.VITE_USE_ONLINE_ICON === 'true'
})

/** 计算 Iconify 图标的样式 */
const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color
  }
})

/** 获取图标名称，去除前缀 ICON_PREFIX */
const getIconName = computed(() => {
  return props.icon.startsWith(ICON_PREFIX) ? props.icon.replace(ICON_PREFIX, '') : props.icon
})
</script>

<template>
  <!-- 渲染图标组件 -->
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <!-- 如果是本地图标，使用 <svg> 标签渲染 -->
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <!-- 如果不是本地图标 -->
    <template v-else>
      <!-- 使用在线图标 -->
      <Icon v-if="isUseOnline" :icon="getIconName" :style="getIconifyStyle" />
      <!-- 使用本地样式 -->
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style lang="less" scoped>
/** 图标组件样式定义 */
@prefix-cls: ~'@{adminNamespace}-icon';

/** 定义图标组件的深度样式 */
.@{prefix-cls},
.iconify {
  :deep(svg) {
    &:hover {
      // 禁用样式检查
      color: v-bind(hoverColor) !important;
    }
  }
}

/** 定义在线图标的悬停样式 */
.iconify {
  &:hover {
    // 禁用样式检查
    color: v-bind(hoverColor) !important;
  }
}
</style>
