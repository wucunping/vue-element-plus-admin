<script setup lang="ts">
/**
 * @file Screenfull.vue
 * @description 全屏切换组件
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Screenfull
 */

// 导入图标组件
import { Icon } from '@/components/Icon'

// 导入全屏功能的钩子
import { useFullscreen } from '@vueuse/core'

// 导入参数类型工具
import { propTypes } from '@/utils/propTypes'

// 导入设计相关的自定义钩子
import { useDesign } from '@/hooks/web/useDesign'

// 获取前缀类名的函数
const { getPrefixCls } = useDesign()

// 定义组件的前缀类名
const prefixCls = getPrefixCls('screenfull')

// 定义组件的属性，设置默认值为空字符串
defineProps({
	color: propTypes.string.def('')
})

// 使用全屏钩子，解构出切换函数和全屏状态
const { toggle, isFullscreen } = useFullscreen()

/**
 * 切换全屏状态的函数
 */
const toggleFullscreen = () => {
	// 调用切换全屏的函数
	toggle()
}
</script>

<template>
	<!-- 包裹图标的 div，点击时切换全屏 -->
	<div :class="prefixCls" @click="toggleFullscreen">
		<!-- 根据全屏状态选择不同的图标 -->
		<Icon
			:size="18"
			:icon="isFullscreen ? 'vi-zmdi:fullscreen-exit' : 'vi-zmdi:fullscreen'"
			:color="color"
		/>
	</div>
</template>
