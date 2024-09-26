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

/** 根据环境判断ie版本，服务器环境默认为0，否则通过document对象的documentMode属性获取 */
const ieVersion = isServer ? 0 : Number((document as any).documentMode)

/** 定义用于匹配特殊字符的正则表达式 */
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g

/** 定义用于匹配以moz开头的字符串的正则表达式 */
const MOZ_HACK_REGEXP = /^moz([A-Z])/

/** 定义一个接口，用于描述元素相对于视口的偏移量信息 */
export interface ViewportOffsetResult {
	/** 元素左边框距离视口左边框的水平距离 */
	left: number
	/** 元素上边框距离视口上边框的垂直距离 */
	top: number
	/** 元素右侧距离视口左侧的水平距离（不包括元素自身宽度） */
	right: number
	/** 元素底部距离视口上部的垂直距离（不包括元素自身高度） */
	bottom: number
	/** 元素左侧距离视口右侧的水平距离（包括元素自身宽度） */
	rightIncludeBody: number
	/** 元素上部距离视口底部的垂直距离（包括元素自身高度） */
	bottomIncludeBody: number
}

/**
 * 去除字符串两端的空白字符
 *
 * @param string 需要处理的字符串
 * @returns 处理后的字符串
 */
const trim = function (string: string) {
	// 检查输入的字符串，如果不是字符串则返回空字符串
	return (
		(string || '')
			// 使用正则表达式去除字符串两端的空白字符
			.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
	)
}

/**
 * 将字符串转换为驼峰命名格式
 *
 * @param name 需要转换的字符串
 * @returns 转换后的字符串
 */
const camelCase = function (name: string) {
	// 将输入字符串中的每个非字母字符替换为下一个字母的大写形式，并保持第一个字母为小写
	return (
		name
			// 使用正则表达式找到特殊字符，并将其后面的字母转换为大写
			.replace(SPECIAL_CHARS_REGEXP, function (_, __, letter, offset) {
				// 如果当前字符有偏移，则表示不是字符串的开头，进行大写转换
				return offset ? letter.toUpperCase() : letter
			})
			// 替换 Mozilla 特定的 hack 格式
			.replace(MOZ_HACK_REGEXP, 'Moz$1')
	)
}

/**
 * 检查元素是否具有指定的类名
 *
 * @param el 需要检查的元素
 * @param cls 需要检查的类名
 * @returns 如果元素具有指定的类名，返回true，否则返回false
 */
export function hasClass(el: Element, cls: string) {
	// 检查元素和类名是否存在，如果不存在则返回 false
	if (!el || !cls) return false

	// 检查类名中是否包含空格，如果包含则抛出错误
	if (cls.indexOf(' ') !== -1) {
		throw new Error('className should not contain space.')
	}

	// 如果元素支持 classList 属性，则使用该属性检查类名
	if (el.classList) {
		// 检查元素的 classList 中是否包含指定的类名
		return el.classList.contains(cls)
	} else {
		// 如果没有 classList 属性，则通过字符串方式检查类名
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
	// 检查元素是否存在，如果不存在则返回
	if (!el) return

	// 获取当前元素的 className 属性
	let curClass = el.className
	// 将输入的类名字符串按空格分割成数组
	const classes = (cls || '').split(' ')

	// 遍历每一个类名
	for (let i = 0, j = classes.length; i < j; i++) {
		// 获取当前遍历的类名
		const clsName = classes[i]
		// 如果类名为空，则跳过
		if (!clsName) continue

		// 如果元素支持 classList 属性，则使用 classList 添加类名
		if (el.classList) {
			el.classList.add(clsName)
		}
		// 如果不支持 classList，且该类名未被添加，则添加到 className 字符串中
		else if (!hasClass(el, clsName)) {
			curClass += ' ' + clsName
		}
	}
	// 如果元素不支持 classList，则更新元素的 className 属性
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
	// 检查元素和类名是否存在，如果不存在则返回
	if (!el || !cls) return

	// 将类名按空格分割成数组
	const classes = cls.split(' ')
	// 获取当前元素的 className，并在前后加上空格以便于匹配
	let curClass = ' ' + el.className + ' '

	// 遍历每一个类名
	for (let i = 0, j = classes.length; i < j; i++) {
		// 获取当前遍历的类名
		const clsName = classes[i]
		// 如果类名为空，则跳过
		if (!clsName) continue

		// 如果元素支持 classList 属性，则使用 classList 移除类名
		if (el.classList) {
			el.classList.remove(clsName)
		}
		// 如果不支持 classList，且该类名在元素中存在，则从 className 字符串中移除该类名
		else if (hasClass(el, clsName)) {
			// 使用正则表达式替换掉类名（前后加空格以确保精确匹配）
			curClass = curClass.replace(' ' + clsName + ' ', ' ')
		}
	}
	// 如果元素不支持 classList，则更新元素的 className 属性
	if (!el.classList) {
		// 通过 trim 函数去除 className 两侧的空格
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
	// 检查元素是否存在以及是否具有 getBoundingClientRect 方法，如果不满足条件则返回 0
	if (!element || !element.getBoundingClientRect) {
		return 0
	}
	// 调用元素的 getBoundingClientRect 方法，返回该元素的边界框信息
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
	// 获取文档的根元素（通常是 <html> 标签）
	const doc = document.documentElement

	// 获取文档当前滚动偏移量（水平和垂直）
	const docScrollLeft = doc.scrollLeft
	const docScrollTop = doc.scrollTop
	// 获取文档的客户端左和顶边距
	const docClientLeft = doc.clientLeft
	const docClientTop = doc.clientTop

	// 获取窗口的页面滚动偏移量（水平和垂直）
	const pageXOffset = window.pageXOffset
	const pageYOffset = window.pageYOffset

	// 获取指定元素的边界框信息
	const box = getBoundingClientRect(element)

	// 解构边界框信息，提取左、顶、宽度和高度
	const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

	// 计算要用于偏移的水平和垂直滚动距离
	const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
	const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)

	// 计算元素的绝对位置
	const offsetLeft = retLeft + pageXOffset
	const offsetTop = rectTop + pageYOffset

	// 计算元素相对于视口的左和上边距
	const left = offsetLeft - scrollLeft
	const top = offsetTop - scrollTop

	// 获取当前视口的宽度和高度
	const clientWidth = window.document.documentElement.clientWidth
	const clientHeight = window.document.documentElement.clientHeight

	// 返回元素与视口的偏移结果，包括四个边距和包含文档的边距
	return {
		left: left,
		top: top,
		right: clientWidth - rectWidth - left, // 右侧可用空间
		bottom: clientHeight - rectHeight - top, // 底部可用空间
		rightIncludeBody: clientWidth - left, // 包含文档的右侧空间
		bottomIncludeBody: clientHeight - top // 包含文档的底部空间
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
	element: HTMLElement | Document | Window, // 事件绑定的目标元素，可以是 HTML 元素、文档或窗口
	event: string, // 需要监听的事件名称
	handler: EventListenerOrEventListenerObject // 事件处理函数
): void {
	// 检查元素、事件和处理函数是否存在
	if (element && event && handler) {
		// 为指定的元素添加事件监听器
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
	element: HTMLElement | Document | Window, // 事件解绑的目标元素，可以是 HTML 元素、文档或窗口
	event: string, // 需要解绑的事件名称
	handler: any // 事件处理函数
): void {
	// 检查元素、事件和处理函数是否存在
	if (element && event && handler) {
		// 从指定的元素移除事件监听器
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
	// 定义一个内部监听器函数，用于调用一次性的处理函数
	const listener = function (this: any, ...args: unknown[]) {
		// 检查处理函数是否存在
		if (fn) {
			// 使用 apply 方法调用处理函数，将当前上下文和参数传递给它
			// @ts-ignore 忽略 TypeScript 的类型检查错误
			fn.apply(this, args)
		}
		// 移除内部监听器，以确保处理函数只调用一次
		off(el, event, listener)
	}
	// 为元素添加事件监听器，监听指定的事件
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
	// 根据 IE 版本判断使用不同的获取样式方法
	ieVersion < 9
		? function (element: Element | any, styleName: string) {
				// 检查是否处于服务器环境，如果是则返回
				if (isServer) return
				// 检查元素和样式名称是否存在，如果不存在则返回 null
				if (!element || !styleName) return null
				// 将样式名称转换为驼峰命名格式
				styleName = camelCase(styleName)
				// 如果样式名称是 'float'，则转换为 'styleFloat'（IE 特有）
				if (styleName === 'float') {
					styleName = 'styleFloat'
				}
				try {
					// 根据样式名称进行不同的处理
					switch (styleName) {
						// 处理不透明度样式
						case 'opacity':
							try {
								// 尝试获取元素的不透明度
								return element.filters.item('alpha').opacity / 100
							} catch (e) {
								// 如果获取失败，则返回 1.0（完全不透明）
								return 1.0
							}
						// 默认情况下返回当前样式
						default:
							// 如果元素的样式或当前样式存在，返回对应的样式值
							return element.style[styleName] || element.currentStyle
								? element.currentStyle[styleName]
								: null
					}
				} catch (e) {
					// 捕获异常并返回直接的样式值
					return element.style[styleName]
				}
			}
		: function (element: Element | any, styleName: string) {
				// 检查是否处于服务器环境，如果是则返回
				if (isServer) return
				// 检查元素和样式名称是否存在，如果不存在则返回 null
				if (!element || !styleName) return null
				// 将样式名称转换为驼峰命名格式
				styleName = camelCase(styleName)
				// 如果样式名称是 'float'，则转换为 'cssFloat'
				if (styleName === 'float') {
					styleName = 'cssFloat'
				}
				try {
					// 获取计算后的样式对象
					const computed = (document as any).defaultView.getComputedStyle(element, '')
					// 返回元素的当前样式或计算样式
					return element.style[styleName] || computed ? computed[styleName] : null
				} catch (e) {
					// 捕获异常并返回直接的样式值
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
	// 检查元素和样式名称是否存在，如果不存在则返回
	if (!element || !styleName) return

	// 如果样式名称是一个对象，说明要批量设置样式
	if (typeof styleName === 'object') {
		// 遍历对象中的每个属性
		for (const prop in styleName) {
			// 确保属性是对象的自身属性
			if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
				// 递归调用 setStyle 来设置单个样式属性
				setStyle(element, prop, styleName[prop])
			}
		}
	} else {
		// 将样式名称转换为驼峰命名格式
		styleName = camelCase(styleName)
		// 如果样式名称是 'opacity' 且 IE 版本小于 9，使用滤镜设置不透明度
		if (styleName === 'opacity' && ieVersion < 9) {
			// 根据不透明度值设置滤镜样式
			element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
		} else {
			// 直接设置元素的样式属性值
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
	// 检查是否处于服务器环境，如果是则返回
	if (isServer) return

	// 确定滚动方向，如果 vertical 不是 null 或 undefined 则为确定方向
	const determinedDirection = vertical !== null || vertical !== undefined
	// 根据确定方向获取对应的溢出样式
	const overflow = determinedDirection
		? vertical // 如果是垂直方向，获取纵向溢出样式
			? getStyle(el, 'overflow-y') // 获取 y 轴的溢出样式
			: getStyle(el, 'overflow-x') // 获取 x 轴的溢出样式
		: getStyle(el, 'overflow') // 否则获取元素的默认溢出样式

	// 检查溢出样式是否包含 "scroll" 或 "auto" 字符串，表示可滚动
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
	// 检查是否处于服务器环境，如果是则返回
	if (isServer) return

	// 初始化 parent 为传入的元素
	let parent: any = el
	// 循环直到找到滚动容器
	while (parent) {
		// 检查当前父元素是否是窗口、文档或文档根元素，如果是，则返回窗口
		if ([window, document, document.documentElement].includes(parent)) {
			return window
		}
		// 检查父元素是否可滚动
		if (isScroll(parent, vertical)) {
			// 如果可滚动，则返回当前父元素
			return parent
		}
		// 如果不可滚动，则继续向上遍历父元素
		parent = parent.parentNode
	}

	// 如果没有找到滚动容器，则返回 parent（将为 null 或 undefined）
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
	// 检查是否处于服务器环境或元素和容器是否不存在，如果是则返回 false
	if (isServer || !el || !container) return false

	// 获取元素的边界框信息
	const elRect = el.getBoundingClientRect()
	let containerRect

	// 检查容器是否是窗口、文档或文档根元素，如果是，创建一个默认的矩形对象
	if ([window, document, document.documentElement, null, undefined].includes(container)) {
		containerRect = {
			top: 0, // 容器顶端为 0
			right: window.innerWidth, // 容器右侧为窗口宽度
			bottom: window.innerHeight, // 容器底部为窗口高度
			left: 0 // 容器左侧为 0
		}
	} else {
		// 获取容器的边界框信息
		containerRect = container.getBoundingClientRect()
	}

	// 检查元素是否在容器范围内，返回布尔值
	return (
		elRect.top < containerRect.bottom && // 元素上边界在容器底边界之上
		elRect.bottom > containerRect.top && // 元素下边界在容器上边界之下
		elRect.right > containerRect.left && // 元素右边界在容器左边界之外
		elRect.left < containerRect.right // 元素左边界在容器右边界之内
	)
}
