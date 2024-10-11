<script setup lang="ts">
/**
 * @file Echart.vue
 * @description ECharts 组件，支持动态大小和主题切换
 * @example <Echart :options="{...}" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Echarts
 */

// 导入 ECharts 的类型定义
import type { EChartsOption } from 'echarts'

// 导入自定义的 ECharts 实例化插件
import echarts from '@/plugins/echarts'

// 导入节流函数
import { debounce } from 'lodash-es'

// 导入词云图插件
import 'echarts-wordcloud'

// 导入属性类型检查工具
import { propTypes } from '@/utils/propTypes'

// 导入 Vue 的 PropType 类型
import type { PropType } from 'vue'

// 导入 Vue 的相关 API
import { computed, ref, unref, watch, onMounted, onBeforeUnmount, onActivated } from 'vue'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

// 导入字符串判断工具
import { isString } from '@/utils/is'

// 导入设计相关的工具函数
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计前缀和变量
const { getPrefixCls, variables } = useDesign()

// 定义 ECharts 组件的前缀类名
const prefixCls = getPrefixCls('echart')

// 获取应用状态管理实例
const appStore = useAppStore()

// 定义组件的 Props
const props = defineProps({
	// ECharts 的配置选项
	options: {
		type: Object as PropType<EChartsOption>,
		required: true
	},
	// 组件宽度，支持 Number 或 String 类型
	width: propTypes.oneOfType([Number, String]).def('100%'),
	// 组件高度，支持 Number 或 String 类型
	height: propTypes.oneOfType([Number, String]).def('500px')
})

// 计算当前主题是否为暗色模式
const isDark = computed(() => appStore.getIsDark)

// 计算 ECharts 的主题配置
const theme = computed(() => {
	// 根据暗色模式选择主题
	const echartTheme: boolean | string = unref(isDark) ? true : 'auto'

	return echartTheme
})

// 重新计算 ECharts 配置选项，添加深色模式
const options = computed(() => {
	return Object.assign(props.options, {
		darkMode: unref(theme)
	})
})

// 创建对 ECharts 元素的引用
const elRef = ref<ElRef>()

// 定义 ECharts 实例
let echartRef: Nullable<echarts.ECharts> = null

// 创建内容元素的引用
const contentEl = ref<Element>()

// 计算组件的样式，包括宽度和高度
const styles = computed(() => {
	const width = isString(props.width) ? props.width : `${props.width}px`
	const height = isString(props.height) ? props.height : `${props.height}px`

	return {
		width,
		height
	}
})

/**
 * 初始化图表
 * @function initChart
 */
const initChart = () => {
	if (unref(elRef) && props.options) {
		// 初始化 ECharts 实例
		echartRef = echarts.init(unref(elRef) as HTMLElement)
		// 设置 ECharts 的配置选项
		echartRef?.setOption(unref(options))
	}
}

// 监听 options 的变化，重新设置图表选项
watch(
	() => options.value,
	(options) => {
		if (echartRef) {
			// 重新设置 ECharts 选项
			echartRef?.setOption(options)
		}
	},
	{
		deep: true
	}
)

// 防抖处理窗口大小变化
const resizeHandler = debounce(() => {
	if (echartRef) {
		// 重新调整 ECharts 的大小
		echartRef.resize()
	}
}, 100)

/**
 * 处理内容区域的大小变化
 * @function contentResizeHandler
 * @param {TransitionEvent} e - 触发的过渡事件
 */
const contentResizeHandler = async (e: TransitionEvent) => {
	if (e.propertyName === 'width') {
		resizeHandler()
	}
}

// 组件挂载时的生命周期钩子
onMounted(() => {
	setTimeout(() => {
		// 初始化图表
		initChart()
	}, 0)

	// 监听窗口大小变化
	window.addEventListener('resize', resizeHandler)

	// 获取内容区域元素并添加过渡结束事件监听器
	contentEl.value = document.getElementsByClassName(`${variables.namespace}-layout-content`)[0]
	// unref(contentEl) &&
	// 	(unref(contentEl) as Element).addEventListener('transitionend', contentResizeHandler)
	if (unref(contentEl))
		(unref(contentEl) as Element).addEventListener('transitionend', contentResizeHandler)
})

// 组件卸载前的生命周期钩子
onBeforeUnmount(() => {
	// 移除窗口大小变化监听
	window.removeEventListener('resize', resizeHandler)
	// 移除过渡结束事件监听
	// unref(contentEl) &&
	// 	(unref(contentEl) as Element).removeEventListener('transitionend', contentResizeHandler)
	if (unref(contentEl))
		(unref(contentEl) as Element).removeEventListener('transitionend', contentResizeHandler)
})

// 组件激活时的生命周期钩子
onActivated(() => {
	if (echartRef) {
		// 重新调整图表大小
		echartRef.resize()
	}
})
</script>

<template>
	<!-- 图表容器 -->
	<div ref="elRef" :class="[$attrs.class, prefixCls]" :style="styles"></div>
</template>
