/**
 * useScrollTo.ts - 平滑滚动自定义hook
 *
 * @file useScrollTo.ts
 * @description 这是一个自定义的Vue Composition API钩子，用于平滑滚动到指定位置。
 * 它接受一个参数对象，该对象包含滚动所需的元素、目标位置、目标滚动值、持续时间以及滚动完成后的回调函数。
 *
 * @module useScrollTo
 *
 * @example
 * const { start, stop } = useScrollTo({
 *   el: document.getElementById('scrollableElement'),
 *   to: 500,
 *   position: 'scrollTop',
 *   duration: 800,
 *   callback: () => console.log('Scroll completed!')
 * });
 * start(); // 开始平滑滚动
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入Vue的ref和unref函数，用于响应式引用和解除引用
import { ref, unref } from 'vue'

/**
 * 定义ScrollToParams接口，用于指定useScrollTo函数的参数类型
 */
export interface ScrollToParams {
	/**
	 * 要滚动的HTML元素。
	 */
	el: HTMLElement
	/**
	 * 滚动到的目标位置。
	 */
	to: number
	/**
	 * 滚动属性，如'scrollLeft'或'scrollTop'。
	 */
	position: string
	/**
	 * 滚动持续时间，默认为500毫秒（可选参数）。
	 */
	duration?: number
	/**
	 * 滚动完成后的回调函数（可选参数）。
	 */
	callback?: () => void
}

/**
 * 缓动动画函数，用于计算动画的值。
 *
 * @param t - 当前时间
 * @param b - 初始值
 * @param c - 变化值
 * @param d - 持续时间
 * @returns 缓动动画的值
 */
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
	// 将时间t归一化到[0, 2]区间
	t /= d / 2
	if (t < 1) {
		// 在[0, 1)区间内应用缓入动画
		return (c / 2) * t * t + b
	}
	t-- // 将时间t从[1, 2]区间映射到[0, 1]区间
	// 在[1, 2]区间内应用缓出动画
	return (-c / 2) * (t * (t - 2) - 1) + b
}

/**
 * 移动函数，用于设置HTML元素的滚动位置。
 *
 * @param el - HTML元素
 * @param position - 滚动属性，如'scrollLeft'或'scrollTop'
 * @param amount - 要滚动的距离
 */
const move = (el: HTMLElement, position: string, amount: number) => {
	// 设置元素的滚动位置
	el[position] = amount
}

/**
 * 实现平滑滚动功能
 *
 * @param params - 滚动参数对象
 * @returns 包含start和stop方法的对象，用于开始和停止滚动。
 */
export function useScrollTo({
	el, // 滚动到的HTML元素
	position = 'scrollLeft', // 滚动属性，默认为'scrollLeft'
	to, // 滚动到的目标位置
	duration = 500, // 滚动持续时间，默认为500毫秒
	callback // 滚动完成后的回调函数（可选）
}: ScrollToParams) {
	// 创建一个响应式引用，用于控制滚动动画的激活状态
	const isActiveRef = ref(false)
	// 获取元素当前的滚动位置
	const start = el[position]
	// 计算需要滚动的距离
	const change = to - start
	// 设置每次动画帧的时间增量
	const increment = 20
	// 初始化当前时间变量
	let currentTime = 0

	/**
	 * 定义animateScroll函数，用于执行滚动动画
	 */
	function animateScroll() {
		// 如果动画未激活，则直接返回
		if (!unref(isActiveRef)) {
			return
		}
		// 更新当前时间
		currentTime += increment
		// 计算当前动画帧的滚动位置
		const val = easeInOutQuad(currentTime, start, change, duration)
		// 设置元素的滚动位置
		move(el, position, val)
		// 如果当前时间小于持续时间且动画仍激活，则继续动画
		if (currentTime < duration && unref(isActiveRef)) {
			requestAnimationFrame(animateScroll)
		} else {
			// 如果动画完成且有回调函数，则执行回调函数
			if (callback) {
				callback()
			}
		}
	}

	/**
	 * 开始滚动函数。
	 */
	function run() {
		// 激活滚动动画
		isActiveRef.value = true
		// 开始执行滚动动画
		animateScroll()
	}

	/**
	 * 停止滚动函数。
	 */
	function stop() {
		// 停止滚动动画
		isActiveRef.value = false
	}

	// 返回一个对象，包含start和stop方法，用于控制滚动动画的开始和停止
	return { start: run, stop }
}
