<script setup lang="ts">
/**
 * @file Icon.vue
 * @description 该组件用于展示图标，支持本地和在线图标的显示。
 * @example
 * <Icon icon="user" color="red" size={24} hoverColor="blue" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module 图标组件
 */

// 导入 Vue 的计算属性和 unref 函数
import { computed, unref } from 'vue'

// 导入 Element Plus 的 ElIcon 组件
import { ElIcon } from 'element-plus'

// 导入属性类型验证工具
import { propTypes } from '@/utils/propTypes'

// 导入设计样式的自定义钩子
import { useDesign } from '@/hooks/web/useDesign'

// 导入 Iconify 图标组件
import { Icon } from '@iconify/vue'

// 导入常量定义
import { ICON_PREFIX } from '@/constants'

// 获取设计样式的前缀函数
const { getPrefixCls } = useDesign()

// 定义图标的 CSS 前缀
const prefixCls = getPrefixCls('icon')

// 定义组件的属性
const props = defineProps({
	/** 图标名称 */
	icon: propTypes.string, // 图标名称

	/** 图标颜色 */
	color: propTypes.string, // 图标颜色

	/** 图标大小 */
	size: propTypes.number.def(16), // 图标大小，默认值为 16

	/** 鼠标悬停时图标的颜色 */
	hoverColor: propTypes.string // 鼠标悬停时的颜色
})

// 计算属性：判断图标是否为本地 SVG 图标
const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

// 计算属性：返回 SVG 图标的符号 ID
const symbolId = computed(() => {
	// 如果是本地图标，返回对应的符号 ID，否则返回传入的图标名称
	return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon
})

// 计算属性：判断是否使用在线图标
const isUseOnline = computed(() => {
	// 从环境变量中获取是否使用在线图标的配置
	return import.meta.env.VITE_USE_ONLINE_ICON === 'true'
})

// 计算属性：获取 Iconify 图标的样式
const getIconifyStyle = computed(() => {
	const { color, size } = props
	// 返回 FontSize 和 color 作为样式
	return {
		fontSize: `${size}px`,
		color
	}
})

// 计算属性：获取实际的图标名称
const getIconName = computed(() => {
	// 去除 ICON_PREFIX 前缀，返回图标名称
	return props.icon.startsWith(ICON_PREFIX) ? props.icon.replace(ICON_PREFIX, '') : props.icon
})
</script>

<template>
	<!-- 使用 ElIcon 组件来包裹生成的图标 -->
	<ElIcon :class="prefixCls" :size="size" :color="color">
		<!-- 如果是本地 SVG 图标 -->
		<svg v-if="isLocal" aria-hidden="true">
			<use :xlink:href="symbolId" />
			<!-- 使用符号 ID -->
		</svg>

		<!-- 否则使用在线图标或 Iconify 图标 -->
		<template v-else>
			<Icon v-if="isUseOnline" :icon="getIconName" :style="getIconifyStyle" />
			<div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
		</template>
	</ElIcon>
</template>

<style lang="less" scoped>
/* 定义 CSS 前缀 */
@prefix-cls: ~'@{adminNamespace}-icon';

/* 图标的样式 */
.@{prefix-cls},
.iconify {
	:deep(svg) {
		&:hover {
			// stylelint-disable-next-line
			color: v-bind(hoverColor) !important; // 鼠标悬停时改变颜色
		}
	}
}

.iconify {
	&:hover {
		// stylelint-disable-next-line
		color: v-bind(hoverColor) !important; // 鼠标悬停时改变颜色
	}
}
</style>
