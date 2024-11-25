<script setup lang="ts">
/**
 * @file Backtop.vue
 * @description 返回顶部组件，用于在页面滚动到底部时提供一个按钮回到页面顶部
 * @example 在Vue组件中引入并使用<Backtop />
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-21
 * @module /src/components/Backtop/src/Backtop.vue
 */

// 导入Element Plus的ElBacktop组件
import { ElBacktop } from 'element-plus'
// 导入useDesign钩子，用于获取组件的样式变量
import { useDesign } from '@/hooks/web/useDesign'

// 使用useDesign钩子获取组件的前缀类名和样式变量
const { getPrefixCls, variables } = useDesign()

// 获取组件的前缀类名
const prefixCls = getPrefixCls('backtop')
</script>

<template>
  <!-- 渲染Element Plus的ElBacktop组件，用于返回页面顶部 -->
  <ElBacktop
    :class="prefixCls"
    :target="`.${variables.namespace}-layout-content-scrollbar .${variables.elNamespace}-scrollbar__wrap`"
  />
  <!-- 设置ElBacktop组件的目标滚动区域，通过variables获取的样式变量来构建目标选择器 -->
</template>
