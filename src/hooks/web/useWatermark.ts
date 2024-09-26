/**
 * @file useWatermark.ts
 * @description 自定义 hook，用于在页面上添加水印并提供水印的设置及清除功能。
 * @example
 * const { setWatermark, clear } = useWatermark();
 * setWatermark('这是水印'); // 设置水印
 * clear(); // 清除水印
 * @version 1.0.0
 * @author Fitten Tech
 * @date 2023-10-05
 * @module Watermark
 */

// 创建一个唯一的符号，用于标识水印元素
const domSymbol = Symbol('watermark-dom')

/**
 * @function useWatermark
 * @description 自定义 hook，提供设置和清除水印的功能
 * @param {HTMLElement | null} [appendEl=document.body] - 可选的附加元素，用于添加水印，默认是 document.body
 * @returns {Object} - 返回设置水印和清除水印的函数
 */
export function useWatermark(appendEl: HTMLElement | null = document.body) {
	let func: Fn = () => {} // 定义一个空函数，用于存储窗口重置时调用的水印创建函数
	const id = domSymbol.toString() // 获取水印元素的唯一标识符字符串

	/**
	 * @function clear
	 * @description 清除水印元素
	 */
	const clear = () => {
		const domId = document.getElementById(id) // 获取水印元素
		if (domId) {
			// 如果水印元素存在
			const el = appendEl // 获取附加元素
			el && el.removeChild(domId) // 从附加元素中移除水印
		}
		window.removeEventListener('resize', func) // 移除窗口大小变化时的事件监听
	}

	/**
	 * @function createWatermark
	 * @description 创建水印元素并添加到页面
	 * @param {string} str - 要设置为水印的文本
	 * @returns {string} - 返回水印元素的 ID
	 */
	const createWatermark = (str: string) => {
		clear() // 清除之前的水印

		const can = document.createElement('canvas') // 创建一个 canvas 元素
		can.width = 300 // 设置 canvas 的宽度
		can.height = 240 // 设置 canvas 的高度

		const cans = can.getContext('2d') // 获取 canvas 的 2D 绘图上下文
		if (cans) {
			// 如果获取成功
			cans.rotate((-20 * Math.PI) / 120) // 旋转绘图上下文
			cans.font = '15px Vedana' // 设置字体和字号
			cans.fillStyle = 'rgba(0, 0, 0, 0.15)' // 设置填充颜色为半透明黑色
			cans.textAlign = 'left' // 设置文本对齐方式为左对齐
			cans.textBaseline = 'middle' // 设置文本基线为中间基线
			cans.fillText(str, can.width / 20, can.height) // 在 canvas 中绘制水印文本
		}

		const div = document.createElement('div') // 创建一个 div 元素
		div.id = id // 设置 div 的 id 为水印元素的唯一标识符
		div.style.pointerEvents = 'none' // 设置 div 不响应鼠标事件
		div.style.top = '0px' // 设置 div 的顶部位置
		div.style.left = '0px' // 设置 div 的左侧位置
		div.style.position = 'absolute' // 设置 div 的定位方式为绝对定位
		div.style.zIndex = '100000000' // 设置 div 的层级
		div.style.width = document.documentElement.clientWidth + 'px' // 设置 div 的宽度为视口宽度
		div.style.height = document.documentElement.clientHeight + 'px' // 设置 div 的高度为视口高度
		div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat' // 将 canvas 的图片作为 div 的背景

		const el = appendEl // 获取附加元素
		el && el.appendChild(div) // 将水印 div 添加到附加元素中
		return id // 返回水印元素的 id
	}

	/**
	 * @function setWatermark
	 * @description 设置水印文本并在窗口大小变化时自动更新
	 * @param {string} str - 要设置为水印的文本
	 */
	function setWatermark(str: string) {
		createWatermark(str) // 创建水印
		func = () => {
			// 定义窗口大小变化时的函数
			createWatermark(str) // 重新创建水印
		}
		window.addEventListener('resize', func) // 添加窗口大小变化的事件监听
	}

	// 返回设置水印和清除水印的函数
	return { setWatermark, clear }
}
