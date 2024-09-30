/**
 * @file useNow.ts
 * @description 提供一个自定义 Hook，返回当前时间的信息，并支持定时更新。
 *              使用 Vue 的响应式特性动态更新当前时间的各个部分（年、月、日、时、分、秒）。
 * @example
 * const { year, month, day, hour, minute, second, meridiem, start, stop } = useNow(true);
 * // year: 当前年份
 * // month: 当前月份
 * // day: 当前日期
 * // hour: 当前小时
 * // minute: 当前分钟
 * // second: 当前秒数
 * // meridiem: 上午/下午标识
 * // start(): 启动定时更新
 * // stop(): 停止定时更新
 * @version 1.0.0
 * @author Fitten Tech
 * @date [吴尘](https://github.com/wucunping)
 * @module useNow
 */

import { dateUtil } from '@/utils/dateUtil' // 导入日期工具函数
import { reactive, toRefs } from 'vue' // 从 Vue 导入响应式对象和转换引用的方法
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core' // 从 VueUse 导入组件挂载和卸载的钩子

/**
 * useNow 函数 - 获取当前时间并定时更新
 * @param {boolean} immediate - 是否立即开始更新时间
 */
export const useNow = (immediate = true) => {
	let timer: IntervalHandle // 定义定时器句柄变量

	// 定义响应式状态存储当前时间信息
	const state = reactive({
		year: 0, // 当前年份
		month: 0, // 当前月份
		week: '', // 当前星期几
		day: 0, // 当前日期
		hour: '', // 当前小时
		minute: '', // 当前分钟
		second: 0, // 当前秒
		meridiem: '' // 上午/下午标识
	})

	/**
	 * update 函数 - 更新状态为当前时间
	 */
	const update = () => {
		const now = dateUtil() // 获取当前时间

		const h = now.format('HH') // 获取当前小时，并格式化
		const m = now.format('mm') // 获取当前分钟，并格式化
		const s = now.get('s') // 获取当前秒

		// 更新状态中的各个属性
		state.year = now.get('y') // 更新年份
		state.month = now.get('M') + 1 // 更新月份（注意 Vue 中月份从0开始）
		state.week = '星期' + ['日', '一', '二', '三', '四', '五', '六'][now.day()] // 更新星期
		state.day = now.get('date') // 更新日期
		state.hour = h // 更新小时
		state.minute = m // 更新分钟
		state.second = s // 更新秒

		state.meridiem = now.format('A') // 更新上午/下午标识
	}

	/**
	 * start 函数 - 启动定时器更新当前时间
	 */
	function start() {
		update() // 立即更新一次当前时间
		clearInterval(timer) // 清除之前的定时器
		timer = setInterval(() => update(), 1000) // 每秒更新一次当前时间
	}

	/**
	 * stop 函数 - 停止定时器
	 */
	function stop() {
		clearInterval(timer) // 清除定时器
	}

	// 组件挂载时执行，立即开始更新时间
	tryOnMounted(() => {
		// immediate && start() // 如果 immediate 为 true，则启动定时器
		if (immediate) start() // 如果 immediate 为 true，则启动定时器
	})

	// 组件卸载时执行，停止更新时间
	tryOnUnmounted(() => {
		stop() // 停止定时器
	})

	// 返回响应式状态的引用及启动和停止函数
	return {
		...toRefs(state), // 转换状态为引用对象
		start, // 返回 start 函数
		stop // 返回 stop 函数
	}
}
