<script setup lang="ts">
/**
 * @file CountTo.vue
 * @description 计数器组件，支持动画计数
 * @example
 * <CountTo :startVal="0" :endVal="100" :duration="2000" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module CountTo
 */

// 导入 Vue 的反应式、计算属性、观察者、挂载生命周期钩子等函数
import type { PropType } from 'vue'
import { reactive, computed, watch, onMounted, unref, toRef } from 'vue'

// 导入工具函数 isNumber
import { isNumber } from '@/utils/is'

// 导入 propTypes
import { propTypes } from '@/utils/propTypes'

// 导入设计钩子
import { useDesign } from '@/hooks/web/useDesign'

/** 获取设计前缀类 */
const { getPrefixCls } = useDesign()

/** 定义前缀类 */
const prefixCls = getPrefixCls('count-to')

/** 定义组件的 props */
const props = defineProps({
	/** 起始值，默认为 0 */
	startVal: propTypes.number.def(0),

	/** 结束值，默认为 2021 */
	endVal: propTypes.number.def(2021),

	/** 动画持续时间，默认为 3000ms */
	duration: propTypes.number.def(3000),

	/** 是否自动播放，默认为 true */
	autoplay: propTypes.bool.def(true),

	/** 小数位数，默认为 0 */
	decimals: propTypes.number.validate((value: number) => value >= 0).def(0),

	/** 小数点字符，默认为 '.' */
	decimal: propTypes.string.def('.'),

	/** 数字分隔符，默认为 ',' */
	separator: propTypes.string.def(','),

	/** 前缀字符，默认为空字符串 */
	prefix: propTypes.string.def(''),

	/** 后缀字符，默认为空字符串 */
	suffix: propTypes.string.def(''),

	/** 是否使用缓动效果，默认为 true */
	useEasing: propTypes.bool.def(true),

	/** 缓动函数 */
	easingFn: {
		type: Function as PropType<(t: number, b: number, c: number, d: number) => number>,
		// 默认的缓动函数
		default(t: number, b: number, c: number, d: number) {
			return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
		}
	}
})

/** 定义组件的事件 */
const emit = defineEmits(['mounted', 'callback'])

/** 格式化数字 */
const formatNumber = (num: number | string) => {
	// 解构获取组件的 props
	const { decimals, decimal, separator, suffix, prefix } = props

	// 将 num 转换为数字并保留指定的小数位
	num = Number(num).toFixed(decimals)
	num += ''
	const x = num.split('.') // 分割整数和小数部分
	let x1 = x[0] // 整数部分
	const x2 = x.length > 1 ? decimal + x[1] : '' // 小数部分

	// 正则表达式，用于添加分隔符
	const rgx = /(\d+)(\d{3})/

	// 如果 separator 存在且不是数字，就添加分隔符
	if (separator && !isNumber(separator)) {
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + separator + '$2')
		}
	}

	// 返回格式化后的字符串
	return prefix + x1 + x2 + suffix
}

/** 定义响应式状态 */
const state = reactive<{
	/** 本地起始值 */
	localStartVal: number
	/** 当前打印值 */
	printVal: number | null
	/** 显示的值 */
	displayValue: string
	/** 是否暂停 */
	paused: boolean
	/** 本地持续时间 */
	localDuration: number | null
	/** 开始时间 */
	startTime: number | null
	/** 当前时间戳 */
	timestamp: number | null
	/** 请求动画帧 */
	rAF: any
	/** 剩余时间 */
	remaining: number | null
}>({
	localStartVal: props.startVal,
	displayValue: formatNumber(props.startVal),
	printVal: null,
	paused: false,
	localDuration: props.duration,
	startTime: null,
	timestamp: null,
	remaining: null,
	rAF: null
})

/** 使用 toRef 函数创建 displayValue 的引用 */
const displayValue = toRef(state, 'displayValue')

/** 在组件挂载后执行 */
onMounted(() => {
	if (props.autoplay) {
		start() // 如果自动播放，则开始计数
	}
	emit('mounted') // 触发 mounted 事件
})

/** 计算属性，判断是否为倒计时 */
const getCountDown = computed(() => {
	return props.startVal > props.endVal
})

/** 观察 startVal 和 endVal 的变化 */
watch([() => props.startVal, () => props.endVal], () => {
	if (props.autoplay) {
		start() // 如果自动播放，则重新开始
	}
})

// 启动计数
const start = () => {
	const { startVal, duration } = props // 解构 props
	state.localStartVal = startVal // 设置本地起始值
	state.startTime = null // 重置开始时间
	state.localDuration = duration // 设置本地持续时间
	state.paused = false // 标记为未暂停
	state.rAF = requestAnimationFrame(count) // 请求动画帧
}

/** 暂停或恢复计数 */
const pauseResume = () => {
	if (state.paused) {
		resume() // 如果当前暂停，调用恢复函数
		state.paused = false // 标记为未暂停
	} else {
		pause() // 否则调用暂停函数
		state.paused = true // 标记为暂停
	}
}

/** 暂停计数 */
const pause = () => {
	cancelAnimationFrame(state.rAF) // 取消动画帧
}

/** 恢复计数 */
const resume = () => {
	state.startTime = null // 重置开始时间
	state.localDuration = +(state.remaining as number) // 设置持续时间为剩余时间
	state.localStartVal = +(state.printVal as number) // 设置本地起始值
	requestAnimationFrame(count) // 请求动画帧
}

/** 重置计数 */
const reset = () => {
	state.startTime = null // 重置开始时间
	cancelAnimationFrame(state.rAF) // 取消动画帧
	state.displayValue = formatNumber(props.startVal) // 重新格式化显示值
}

/** 计数函数 */
const count = (timestamp: number) => {
	const { useEasing, easingFn, endVal } = props // 解构 props
	if (!state.startTime) state.startTime = timestamp // 如果没有开始时间, 记录当前时间戳
	state.timestamp = timestamp // 更新当前时间戳
	const progress = timestamp - state.startTime // 计算经过的时间
	state.remaining = (state.localDuration as number) - progress // 计算剩余时间

	// 根据是否使用缓动函数来计算打印值
	if (useEasing) {
		if (unref(getCountDown)) {
			// 如果是倒计时
			state.printVal =
				state.localStartVal -
				easingFn(progress, 0, state.localStartVal - endVal, state.localDuration as number)
		} else {
			// 正常计数
			state.printVal = easingFn(
				progress,
				state.localStartVal,
				endVal - state.localStartVal,
				state.localDuration as number
			)
		}
	} else {
		// 不使用缓动
		if (unref(getCountDown)) {
			// 如果是倒计时
			state.printVal =
				state.localStartVal -
				(state.localStartVal - endVal) * (progress / (state.localDuration as number))
		} else {
			// 正常计数
			state.printVal =
				state.localStartVal +
				(endVal - state.localStartVal) * (progress / (state.localDuration as number))
		}
	}

	// 确保结果在范围内
	if (unref(getCountDown)) {
		state.printVal = state.printVal < endVal ? endVal : state.printVal
	} else {
		state.printVal = state.printVal > endVal ? endVal : state.printVal
	}

	// 更新显示值
	state.displayValue = formatNumber(state.printVal!)

	// 如果未完成计数，则继续请求动画帧
	if (progress < (state.localDuration as number)) {
		state.rAF = requestAnimationFrame(count)
	} else {
		emit('callback') // 完成计数后触发回调事件
	}
}

/** 公开方法供外部使用 */
defineExpose({
	pauseResume, // 暂停或恢复
	reset, // 重置
	start, // 启动计数
	pause // 暂停
})
</script>

<template>
	<!-- 显示计数值 -->
	<span :class="prefixCls">
		{{ displayValue }}
	</span>
</template>
