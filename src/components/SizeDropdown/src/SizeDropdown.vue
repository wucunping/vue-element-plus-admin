<script setup lang="ts">
/**
 * @file SizeDropdown.vue
 * @description 控制界面组件尺寸的下拉选择器组件
 * @example
 * <SizeDropdown color="#409eff" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module components/SizeDropdown
 * @author [吴尘](https://github.com/wucunping)
 */

/** 引入 Vue 的计算属性 */
import { computed } from 'vue'
/** 引入 Element Plus 的下拉菜单相关组件 */
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ComponentSize } from 'element-plus'
/** 引入应用状态管理模块 */
import { useAppStore } from '@/store/modules/app'
/** 引入国际化模块 */
import { useI18n } from '@/hooks/web/useI18n'
/** 引入 Prop 类型工具 */
import { propTypes } from '@/utils/propTypes'
/** 引入设计工具模块 */
import { useDesign } from '@/hooks/web/useDesign'

/** 获取自定义前缀 */
const { getPrefixCls } = useDesign()

/** 定义组件的样式前缀 */
const prefixCls = getPrefixCls('size-dropdown')

/** 定义组件的 Props */
defineProps({
  /** 设置图标颜色 */
  color: propTypes.string.def('')
})

/** 使用国际化翻译功能 */
const { t } = useI18n()

/** 获取应用状态管理实例 */
const appStore = useAppStore()

/** 从应用状态中获取支持的尺寸选项 */
const sizeMap = computed(() => appStore.sizeMap)

/**
 * 设置当前选中的组件尺寸
 * @param size 当前选中的尺寸
 */
const setCurrentSize = (size: ComponentSize) => {
  appStore.setCurrentSize(size)
}
</script>

<template>
  <!-- 尺寸下拉菜单容器 -->
  <ElDropdown :class="prefixCls" trigger="click" @command="setCurrentSize">
    <!-- 图标按钮，用于触发下拉菜单 -->
    <Icon :size="18" icon="vi-mdi:format-size" :color="color" class="cursor-pointer" />
    <!-- 下拉菜单内容 -->
    <template #dropdown>
      <ElDropdownMenu>
        <!-- 遍历尺寸选项生成菜单项 -->
        <ElDropdownItem v-for="item in sizeMap" :key="item" :command="item">
          <!-- 显示国际化后的尺寸标签 -->
          {{ t(`size.${item}`) }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
