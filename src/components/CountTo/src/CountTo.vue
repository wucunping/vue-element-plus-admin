<script setup lang="ts">
/**
 * @file CountTo.vue
 * @description 数字动态计数组件，支持动画效果、格式化显示等功能
 * @example
 * <CountTo :startVal="0" :endVal="1000" :duration="3000" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module CountTo
 * @requires '@/utils/is', '@/utils/propTypes', '@/hooks/web/useDesign'
 * @author [吴尘](https://github.com/wucunping)
 * 改过原代码，可能会有问题。
 */

// 引入 Vue 的核心 API
import { reactive, computed, watch, onMounted, unref, toRef, PropType } from 'vue'
// 实用工具：判断是否为数字
import { isNumber } from '@/utils/is'
// 属性类型工具
import { propTypes } from '@/utils/propTypes'
// UI 设计工具
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计系统的样式前缀工具
const { getPrefixCls } = useDesign()

/** 样式前缀 */
const prefixCls = getPrefixCls('count-to')

/** 定义组件的 props */
const props = defineProps({
  /** 动画的起始值 */
  startVal: propTypes.number.def(0),
  /** 动画的结束值 */
  endVal: propTypes.number.def(2021),
  /** 动画持续时间（毫秒） */
  duration: propTypes.number.def(3000),
  /** 是否自动播放动画 */
  autoplay: propTypes.bool.def(true),
  /** 保留小数位数 */
  decimals: propTypes.number.validate((value: number) => value >= 0).def(0),
  /** 小数点符号 */
  decimal: propTypes.string.def('.'),
  /** 千分位分隔符 */
  separator: propTypes.string.def(','),
  /** 数值前缀 */
  prefix: propTypes.string.def(''),
  /** 数值后缀 */
  suffix: propTypes.string.def(''),
  /** 是否使用缓动动画 */
  useEasing: propTypes.bool.def(true),
  /** 缓动函数 */
  easingFn: {
    type: Function as PropType<(t: number, b: number, c: number, d: number) => number>,
    default(t: number, b: number, c: number, d: number) {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
    }
  }
})

/** 定义组件事件 */
const emit = defineEmits(['mounted', 'callback'])

/**
 * 格式化数字显示
 * @param num - 待格式化的数字
 * @returns 格式化后的字符串
 */
const formatNumber = (num: number | string) => {
  const { decimals, decimal, separator, suffix, prefix } = props
  num = Number(num).toFixed(decimals)
  const parts = num.split('.')
  let integerPart = parts[0]
  const decimalPart = parts.length > 1 ? decimal + parts[1] : ''
  const regex = /(\d+)(\d{3})/
  if (separator && !isNumber(separator)) {
    while (regex.test(integerPart)) {
      integerPart = integerPart.replace(regex, '$1' + separator + '$2')
    }
  }
  return prefix + integerPart + decimalPart + suffix
}

/** 组件状态 */
const state = reactive<{
  localStartVal: number
  printVal: number | null
  displayValue: string
  paused: boolean
  localDuration: number | null
  startTime: number | null
  timestamp: number | null
  rAF: any
  remaining: number | null
}>({
  /** 当前起始值 */
  localStartVal: props.startVal,
  /** 显示的格式化值 */
  displayValue: formatNumber(props.startVal),
  /** 当前打印值 */
  printVal: null,
  /** 是否暂停 */
  paused: false,
  /** 动画时长 */
  localDuration: props.duration,
  /** 动画起始时间戳 */
  startTime: null,
  /** 当前时间戳 */
  timestamp: null,
  /** 剩余时间 */
  remaining: null,
  /** 动画帧请求 */
  rAF: null
})

/** 动态显示值 */
const displayValue = toRef(state, 'displayValue')

/** 组件挂载后执行初始化操作 */
onMounted(() => {
  if (props.autoplay) {
    start()
  }
  emit('mounted')
})

/** 判断是否为倒计时 */
const getCountDown = computed(() => props.startVal > props.endVal)

/** 监听起始值和结束值变化 */
watch([() => props.startVal, () => props.endVal], () => {
  if (props.autoplay) {
    start()
  }
})

/** 开始计数动画 */
const start = () => {
  state.localStartVal = props.startVal
  state.startTime = null
  state.localDuration = props.duration
  state.paused = false
  state.rAF = requestAnimationFrame(count)
}

/** 暂停或恢复计数 */
const pauseResume = () => {
  state.paused ? resume() : pause()
  state.paused = !state.paused
}

/** 暂停动画 */
const pause = () => {
  cancelAnimationFrame(state.rAF)
}

/** 恢复动画 */
const resume = () => {
  state.startTime = null
  state.localDuration = state.remaining as number
  state.localStartVal = state.printVal as number
  requestAnimationFrame(count)
}

/** 重置计数动画 */
const reset = () => {
  state.startTime = null
  cancelAnimationFrame(state.rAF)
  state.displayValue = formatNumber(props.startVal)
}

/**
 * 计数动画的核心逻辑
 * @param timestamp - 当前帧的时间戳
 */
const count = (timestamp: number) => {
  const { useEasing, easingFn, endVal } = props
  if (!state.startTime) state.startTime = timestamp
  const progress = timestamp - state.startTime
  state.remaining = state.localDuration! - progress
  if (useEasing) {
    state.printVal = unref(getCountDown)
      ? state.localStartVal -
        easingFn(progress, 0, state.localStartVal - endVal, state.localDuration!)
      : easingFn(progress, state.localStartVal, endVal - state.localStartVal, state.localDuration!)
  } else {
    state.printVal = unref(getCountDown)
      ? state.localStartVal - (state.localStartVal - endVal) * (progress / state.localDuration!)
      : state.localStartVal + (endVal - state.localStartVal) * (progress / state.localDuration!)
  }
  state.printVal = unref(getCountDown)
    ? Math.max(state.printVal, endVal)
    : Math.min(state.printVal, endVal)
  state.displayValue = formatNumber(state.printVal!)
  if (progress < state.localDuration!) {
    state.rAF = requestAnimationFrame(count)
  } else {
    emit('callback')
  }
}

/** 暴露方法 */
defineExpose({
  pauseResume,
  reset,
  start,
  pause
})
</script>

<template>
  <!-- 计数动画容器 -->
  <span :class="prefixCls">
    {{ displayValue }}
  </span>
</template>
