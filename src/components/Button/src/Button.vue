<script setup lang="ts">
/**
 * @file Button 组件
 * @description 自定义封装的按钮组件，基于 Element Plus 的 ElButton，支持多种配置项和样式
 * @example
 * <Button type="primary" @click="handleClick">点击我</Button>
 * @version 1.0.0
 * @date 2024-11-21
 * @module ButtonComponent
 * @requires vue
 * @requires element-plus
 * @requires @/hooks/web/useDesign
 * @requires @/store/modules/app
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入设计系统工具，用于生成类名前缀
import { useDesign } from '@/hooks/web/useDesign'

// 引入 Element Plus 的 ElButton 组件及类型定义
import { ElButton, ComponentSize, ButtonType } from 'element-plus'

// 引入 Vue 的核心方法
import { PropType, Component, computed, unref } from 'vue'

// 引入应用存储模块
import { useAppStore } from '@/store/modules/app'

/** 获取应用存储模块实例 */
const appStore = useAppStore()

/** 获取当前主题 */
const getTheme = computed(() => appStore.getTheme)

/** 生成设计系统的 Button 类名前缀 */
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('button')

/**
 * 组件 Props 定义
 */
const props = defineProps({
  /** 按钮尺寸 */
  size: {
    type: String as PropType<ComponentSize>, // 支持的尺寸类型
    default: undefined
  },
  /** 按钮类型 */
  type: {
    type: String as PropType<ButtonType>, // 支持的按钮类型
    default: 'default' // 默认类型为普通按钮
  },
  /** 按钮是否禁用 */
  disabled: {
    type: Boolean,
    default: false
  },
  /** 是否为朴素按钮 */
  plain: {
    type: Boolean,
    default: false
  },
  /** 是否为文本按钮 */
  text: {
    type: Boolean,
    default: false
  },
  /** 是否带有背景 */
  bg: {
    type: Boolean,
    default: false
  },
  /** 是否为链接按钮 */
  link: {
    type: Boolean,
    default: false
  },
  /** 是否为圆角按钮 */
  round: {
    type: Boolean,
    default: false
  },
  /** 是否为圆形按钮 */
  circle: {
    type: Boolean,
    default: false
  },
  /** 是否显示加载中 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 自定义加载图标 */
  loadingIcon: {
    type: [String, Object] as PropType<String | Component>,
    default: undefined
  },
  /** 自定义按钮图标 */
  icon: {
    type: [String, Object] as PropType<String | Component>,
    default: undefined
  },
  /** 是否自动聚焦 */
  autofocus: {
    type: Boolean,
    default: false
  },
  /** 原生类型 */
  nativeType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  /** 是否自动插入空格 */
  autoInsertSpace: {
    type: Boolean,
    default: false
  },
  /** 自定义按钮颜色 */
  color: {
    type: String,
    default: ''
  },
  /** 是否为深色主题按钮 */
  darker: {
    type: Boolean,
    default: false
  },
  /** 自定义按钮的标签类型 */
  tag: {
    type: [String, Object] as PropType<String | Component>,
    default: 'button'
  }
})

/**
 * 组件 Emits 定义
 * @event click 按钮点击事件
 */
const emits = defineEmits(['click'])

/** 按钮颜色计算属性 */
const color = computed(() => {
  const { type, link } = props
  if (type === 'primary' && !link) {
    return unref(getTheme).elColorPrimary // 返回主题色
  }
  return '' // 默认为空
})

/** 按钮样式计算属性 */
const style = computed(() => {
  const { type, link } = props
  if (type === 'primary' && !link) {
    return '--el-button-text-color: #fff; --el-button-hover-text-color: #fff' // 设置主按钮样式
  }
  return '' // 默认为空
})
</script>

<template>
  <!--
    基于 Element Plus 的按钮组件
    - :class：动态绑定类名，用于定义按钮的样式。
    - v-bind：将所有传入的 props 绑定到 ElButton 上。
    - :color：动态设置按钮的颜色，默认根据主题动态变化。
    - :style：动态绑定按钮的样式，支持 hover 和文本颜色等自定义。
    - @click：绑定按钮点击事件，触发外部的 "click" 事件。
  -->
  <ElButton
    :class="`${prefixCls} color-#fff`"
    v-bind="{ ...props }"
    :color="color"
    :style="style"
    @click="() => emits('click')"
  >
    <!-- 默认插槽内容 -->
    <slot></slot>
    <!-- 自定义图标插槽 -->
    <slot name="icon"></slot>
    <!-- 自定义加载中插槽 -->
    <slot name="loading"></slot>
  </ElButton>
</template>
