<script setup lang="ts">
/**
 * @file Echart.vue
 * @description 封装的 Echart 组件，支持自适应大小和暗黑主题模式
 * @example
 * <Echart :options="chartOptions" :width="'100%'" :height="'400px'" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module Echart
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 ECharts 配置类型
import type { EChartsOption } from 'echarts'
// 引入 ECharts
import echarts from '@/plugins/echarts'
// 引入 lodash 的防抖函数
import { debounce } from 'lodash-es'
// 引入 ECharts 的 WordCloud 图表
import 'echarts-wordcloud'
// 引入 propTypes 用于校验和定义默认值
import { propTypes } from '@/utils/propTypes'
// Vue 组合式 API
import { computed, PropType, ref, unref, watch, onMounted, onBeforeUnmount, onActivated } from 'vue'
// 引入应用状态管理
import { useAppStore } from '@/store/modules/app'
// 工具函数，用于判断是否是字符串
import { isString } from '@/utils/is'
// 设计相关工具
import { useDesign } from '@/hooks/web/useDesign'

/** 获取样式工具和变量 */
const { getPrefixCls, variables } = useDesign()

/** 样式前缀 */
const prefixCls = getPrefixCls('echart')

/** 获取应用全局状态 */
const appStore = useAppStore()

/** 定义组件的 props 属性 */
const props = defineProps({
  /** ECharts 的配置项 */
  options: {
    type: Object as PropType<EChartsOption>,
    required: true
  },
  /** 图表的宽度 */
  width: propTypes.oneOfType([Number, String]).def('100%'),
  /** 图表的高度 */
  height: propTypes.oneOfType([Number, String]).def('500px')
})

/** 是否暗黑模式 */
const isDark = computed(() => appStore.getIsDark)

/** ECharts 的主题 */
const theme = computed(() => {
  const echartTheme: boolean | string = unref(isDark) ? true : 'auto'
  return echartTheme
})

/** 合并后的 ECharts 配置 */
const options = computed(() => {
  return Object.assign(props.options, {
    darkMode: unref(theme)
  })
})

/** 图表的 DOM 元素引用 */
const elRef = ref<ElRef>()

/** ECharts 实例引用 */
let echartRef: Nullable<echarts.ECharts> = null

/** 内容区域 DOM 元素引用 */
const contentEl = ref<Element>()

/** 动态计算图表容器的样式 */
const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`
  const height = isString(props.height) ? props.height : `${props.height}px`

  return {
    width,
    height
  }
})

/** 初始化图表实例 */
const initChart = () => {
  if (unref(elRef) && props.options) {
    echartRef = echarts.init(unref(elRef) as HTMLElement)
    echartRef?.setOption(unref(options))
  }
}

/** 监听配置项的变化 */
watch(
  () => options.value,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options)
    }
  },
  {
    deep: true
  }
)

/** 窗口大小变化的防抖处理器 */
const resizeHandler = debounce(() => {
  if (echartRef) {
    echartRef.resize()
  }
}, 100)

/** 内容区域宽度变化事件的处理器 */
const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}

/** 组件挂载时的处理逻辑 */
onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 0)

  // 监听窗口大小变化
  window.addEventListener('resize', resizeHandler)

  // 监听内容区域宽度变化
  contentEl.value = document.getElementsByClassName(`${variables.namespace}-layout-content`)[0]
  unref(contentEl) &&
    (unref(contentEl) as Element).addEventListener('transitionend', contentResizeHandler)
})

/** 组件卸载时的处理逻辑 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  unref(contentEl) &&
    (unref(contentEl) as Element).removeEventListener('transitionend', contentResizeHandler)
})

/** 组件被激活时的处理逻辑 */
onActivated(() => {
  if (echartRef) {
    echartRef.resize()
  }
})
</script>

<template>
  <!-- 图表容器 -->
  <div ref="elRef" :class="[$attrs.class, prefixCls]" :style="styles"></div>
</template>
