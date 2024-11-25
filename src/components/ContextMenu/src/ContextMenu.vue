<script setup lang="ts">
/**
 * @file ContextMenu.vue
 * @description 通用右键菜单组件，可用于动态生成菜单项
 * @example
 * <ContextMenu :schema="menuSchema" @visibleChange="onVisibleChange" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module ContextMenu
 * @requires element-plus, vue, '@/hooks/web/useI18n', '@/hooks/web/useDesign'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入Element Plus和Vue相关模块
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { PropType, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { ContextMenuSchema } from './types'

/** 获取设计系统的样式前缀 */
const { getPrefixCls } = useDesign()

/** 样式前缀 */
const prefixCls = getPrefixCls('context-menu')

/** 国际化方法 */
const { t } = useI18n()

/** 定义组件事件 */
const emit = defineEmits(['visibleChange'])

/** 定义组件 props */
const props = defineProps({
  schema: {
    type: Array as PropType<ContextMenuSchema[]>,
    default: () => [] /** 菜单项的配置数组 */
  },
  trigger: {
    type: String as PropType<'click' | 'hover' | 'focus' | 'contextmenu'>,
    default: 'contextmenu' /** 菜单的触发方式 */
  },
  tagItem: {
    type: Object as PropType<RouteLocationNormalizedLoaded>,
    default: () => ({}) /** 关联的路由项 */
  }
})

/**
 * 菜单项点击命令处理函数
 * @param item - 当前菜单项
 */
const command = (item: ContextMenuSchema) => {
  item.command && item.command(item)
}

/**
 * 菜单可见性变化事件处理函数
 * @param visible - 菜单是否可见
 */
const visibleChange = (visible: boolean) => {
  emit('visibleChange', visible, props.tagItem)
}

/** 菜单组件的引用 */
const elDropdownMenuRef = ref<ComponentRef<typeof ElDropdown>>()

/** 定义对外暴露的属性和方法 */
defineExpose({
  elDropdownMenuRef,
  tagItem: props.tagItem
})
</script>

<template>
  <!-- 右键菜单容器 -->
  <ElDropdown
    ref="elDropdownMenuRef"
    :class="prefixCls"
    :trigger="trigger"
    placement="bottom-start"
    @command="command"
    @visible-change="visibleChange"
    popper-class="v-context-menu-popper"
  >
    <slot></slot>
    <!-- 菜单项 -->
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="(item, index) in schema"
          :key="`dropdown${index}`"
          :divided="item.divided"
          :disabled="item.disabled"
          :command="item"
        >
          <!-- 
              icon: 菜单项的图标 
           -->
          <Icon :icon="item.icon" />
          {{ t(item.label) }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
