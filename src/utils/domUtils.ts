/**
 * domUtils.ts - DOM操作工具
 *
 * @description
 * 本文件提供了一系列DOM操作的工具函数，包括获取元素偏移量、检查元素类、添加/删除类、获取元素的样式值、设置元素样式等。
 *
 * @example
 * 使用示例：
 * 获取元素偏移量：`getViewportOffset(element)`
 * 检查元素类：`hasClass(element, 'className')`
 * 添加类：`addClass(element, 'className')`
 * 删除类：`removeClass(element, 'className')`
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入isServer函数，用于判断当前环境是否为服务器端
import { isServer } from './is'

// 根据环境判断ie版本，服务器环境默认为0，否则通过document对象的documentMode属性获取
const ieVersion = isServer ? 0 : Number((document as any).documentMode)

// 定义用于匹配特殊字符的正则表达式
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g

// 定义用于匹配以moz开头的字符串的正则表达式
const MOZ_HACK_REGEXP = /^moz([A-Z])/

// 定义一个接口，用于描述元素相对于视口的偏移量信息
export interface ViewportOffsetResult {
	left: number // 元素左边框距离视口左边框的水平距离
	top: number // 元素上边框距离视口上边框的垂直距离
	right: number // 元素右侧距离视口左侧的水平距离（不包括元素自身宽度）
	bottom: number // 元素底部距离视口上部的垂直距离（不包括元素自身高度）
	rightIncludeBody: number // 元素左侧距离视口右侧的水平距离（包括元素自身宽度）
	bottomIncludeBody: number // 元素上部距离视口底部的垂直距离（包括元素自身高度）
}

/**
 * 去除字符串两端的空白字符
 *
 * @param string 需要处理的字符串
 * @returns 处理后的字符串
 */
const trim = function (string: string) {
	return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/**
 * 将字符串转换为驼峰命名格式
 *
 * @param name 需要转换的字符串
 * @returns 转换后的字符串
 */
const camelCase = function (name: string) {
	return name
		.replace(SPECIAL_CHARS_REGEXP, function (_, __, letter, offset) {
			return offset ? letter.toUpperCase() : letter
		})
		.replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/**
 * 检查元素是否具有指定的类名
 *
 * @param el 需要检查的元素
 * @param cls 需要检查的类名
 * @returns 如果元素具有指定的类名，返回true，否则返回false
 */
export function hasClass(el: Element, cls: string) {
	if (!el || !cls) return false
	if (cls.indexOf(' ') !== -1) {
		throw new Error('className should not contain space.')
	}
	if (el.classList) {
		return el.classList.contains(cls)
	} else {
		return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
	}
}

/**
 * 为元素添加指定的类名
 *
 * @param el 需要添加类名的元素
 * @param cls 需要添加的类名
 */
export function addClass(el: Element, cls: string) {
	if (!el) return
	let curClass = el.className
	const classes = (cls || '').split(' ')

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.add(clsName)
		} else if (!hasClass(el, clsName)) {
			curClass += ' ' + clsName
		}
	}
	if (!el.classList) {
		el.className = curClass
	}
}

/**
 * 从元素中移除指定的类名
 *
 * @param el 需要移除类名的元素
 * @param cls 需要移除的类名
 */
export function removeClass(el: Element, cls: string) {
	if (!el || !cls) return
	const classes = cls.split(' ')
	let curClass = ' ' + el.className + ' '

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.remove(clsName)
		} else if (hasClass(el, clsName)) {
			curClass = curClass.replace(' ' + clsName + ' ', ' ')
		}
	}
	if (!el.classList) {
		el.className = trim(curClass)
	}
}

/**
 * 获取元素的大小及其相对于视口的位置信息（DOMRect对象或数值0）
 *
 * @param element 需要获取信息的元素
 * @returns 元素的大小及其相对于视口的位置信息（DOMRect对象或数值0）
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
	if (!element || !element.getBoundingClientRect) {
		return 0
	}
	return element.getBoundingClientRect()
}

/**
 * 获取元素相对于视口的偏移量信息
 *   left：元素最左侧距离文档左侧的距离
 *   top:元素最顶端距离文档顶端的距离
 *   right:元素最右侧距离文档右侧的距离
 *   bottom：元素最底端距离文档底端的距离
 *   rightIncludeBody：元素最左侧距离文档右侧的距离
 *   bottomIncludeBody：元素最底端距离文档最底部的距离
 *
 * @param element 需要获取偏移量的元素
 * @returns 包含元素相对于视口的偏移量信息的对象
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
	const doc = document.documentElement

	const docScrollLeft = doc.scrollLeft
	const docScrollTop = doc.scrollTop
	const docClientLeft = doc.clientLeft
	const docClientTop = doc.clientTop

	const pageXOffset = window.pageXOffset
	const pageYOffset = window.pageYOffset

	const box = getBoundingClientRect(element)

	const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

	const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
	const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
	const offsetLeft = retLeft + pageXOffset
	const offsetTop = rectTop + pageYOffset

	const left = offsetLeft - scrollLeft
	const top = offsetTop - scrollTop

	const clientWidth = window.document.documentElement.clientWidth
	const clientHeight = window.document.documentElement.clientHeight
	return {
		left: left,
		top: top,
		right: clientWidth - rectWidth - left,
		bottom: clientHeight - rectHeight - top,
		rightIncludeBody: clientWidth - left,
		bottomIncludeBody: clientHeight - top
	}
}

/**
 * 在指定元素上添加事件监听器
 *
 * @param element 需要添加监听器的元素
 * @param event 事件名称
 * @param handler 事件处理函数
 */
export const on = function (
	element: HTMLElement | Document | Window,
	event: string,
	handler: EventListenerOrEventListenerObject
): void {
	if (element && event && handler) {
		element.addEventListener(event, handler, false)
	}
}

/**
 * 从指定元素上移除事件监听器
 *
 * @param element 需要移除监听器的元素
 * @param event 事件名称
 * @param handler 事件处理函数或相关标识
 */
export const off = function (
	element: HTMLElement | Document | Window,
	event: string,
	handler: any
): void {
	if (element && event && handler) {
		element.removeEventListener(event, handler, false)
	}
}

/**
 * 在指定元素上添加一次性事件监听器，事件触发后自动移除监听器
 *
 * @param el 需要添加监听器的元素
 * @param event 事件名称
 * @param fn 事件处理函数
 */
export const once = function (el: HTMLElement, event: string, fn: EventListener): void {
	const listener = function (this: any, ...args: unknown[]) {
		if (fn) {
			// @ts-ignore
			fn.apply(this, args)
		}
		off(el, event, listener)
	}
	on(el, event, listener)
}

/**
 * 获取元素的样式属性值（兼容不同浏览器和版本）
 *
 * @param element 需要获取样式属性的元素
 * @param styleName 样式属性名称
 * @returns 样式属性值（如果无法获取，返回null）
 */
export const getStyle =
	ieVersion < 9
		? function (element: Element | any, styleName: string) {
				if (isServer) return
				if (!element || !styleName) return null
				styleName = camelCase(styleName)
				if (styleName === 'float') {
					styleName = 'styleFloat'
				}
				try {
					switch (styleName) {
						case 'opacity':
							try {
								return element.filters.item('alpha').opacity / 100
							} catch (e) {
								return 1.0
							}
						default:
							return element.style[styleName] || element.currentStyle
								? element.currentStyle[styleName]
								: null
					}
				} catch (e) {
					return element.style[styleName]
				}
			}
		: function (element: Element | any, styleName: string) {
				if (isServer) return
				if (!element || !styleName) return null
				styleName = camelCase(styleName)
				if (styleName === 'float') {
					styleName = 'cssFloat'
				}
				try {
					const computed = (document as any).defaultView.getComputedStyle(element, '')
					return element.style[styleName] || computed ? computed[styleName] : null
				} catch (e) {
					return element.style[styleName]
				}
			}

/**
 * 设置元素的样式属性值（兼容不同浏览器和版本）
 *
 * @param element 需要设置样式属性的元素
 * @param styleName 样式属性名称
 * @param value 样式属性值
 */
export function setStyle(element: Element | any, styleName: any, value: any) {
	if (!element || !styleName) return

	if (typeof styleName === 'object') {
		for (const prop in styleName) {
			if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
				setStyle(element, prop, styleName[prop])
			}
		}
	} else {
		styleName = camelCase(styleName)
		if (styleName === 'opacity' && ieVersion < 9) {
			element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
		} else {
			element.style[styleName] = value
		}
	}
}

/**
 * 检查元素是否可滚动（垂直方向或水平方向）
 *
 * @param el 需要检查的元素
 * @param vertical 指定检查垂直方向还是水平方向（true表示垂直方向，false表示水平方向，undefined表示不指定）
 * @returns 如果元素可滚动，返回true，否则返回false
 */
export const isScroll = (el: Element, vertical: any) => {
	if (isServer) return

	const determinedDirection = vertical !== null || vertical !== undefined
	const overflow = determinedDirection
		? vertical
			? getStyle(el, 'overflow-y')
			: getStyle(el, 'overflow-x')
		: getStyle(el, 'overflow')

	return overflow.match(/(scroll|auto)/)
}

/**
 * 获取元素的滚动容器（即最近的具有滚动条的父级元素）
 *
 * @param el 需要获取滚动容器的元素
 * @param vertical 指定获取垂直方向还是水平方向的滚动容器（默认不指定）
 * @returns 滚动容器元素或窗口对象
 */
export const getScrollContainer = (el: Element, vertical?: any) => {
	if (isServer) return

	let parent: any = el
	while (parent) {
		if ([window, document, document.documentElement].includes(parent)) {
			return window
		}
		if (isScroll(parent, vertical)) {
			return parent
		}
		parent = parent.parentNode
	}

	return parent
}

/**
 * 检查元素是否在指定的容器内（包括边界情况）
 *
 * @param el 需要检查的元素
 * @param container 指定的容器元素或窗口对象等
 * @returns 如果元素在容器内，返回true，否则返回false
 */
export const isInContainer = (el: Element, container: any) => {
	if (isServer || !el || !container) return false

	const elRect = el.getBoundingClientRect()
	let containerRect

	if ([window, document, document.documentElement, null, undefined].includes(container)) {
		containerRect = {
			top: 0,
			right: window.innerWidth,
			bottom: window.innerHeight,
			left: 0
		}
	} else {
		containerRect = container.getBoundingClientRect()
	}

	return (
		elRect.top < containerRect.bottom &&
		elRect.bottom > containerRect.top &&
		elRect.right > containerRect.left &&
		elRect.left < containerRect.right
	)
}
