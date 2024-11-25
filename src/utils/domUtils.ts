/**
 * @file domUtils.ts
 * @description 提供对 DOM 操作的实用工具函数，包括类名管理、样式操作、滚动检测等。
 * @example
 * // 添加类名
 * addClass(element, 'active');
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module DOMUtils
 */

// 引入是否是服务器端渲染的检测工具，用于判断当前运行环境
import { isServer } from './is'

/**
 * 检测 IE 浏览器的版本
 */
const ieVersion: number = isServer ? 0 : Number((document as any).documentMode)

/**
 * 匹配特殊字符的正则表达式（用于转换为驼峰命名法）
 */
const SPECIAL_CHARS_REGEXP: RegExp = /([\:\-\_]+(.))/g

/**
 * 匹配以 "moz" 开头的样式名正则表达式（用于识别 Mozilla 样式前缀）
 */
const MOZ_HACK_REGEXP: RegExp = /^moz([A-Z])/i

/**
 * 定义视口偏移结果接口
 */
export interface ViewportOffsetResult {
  /** 元素左侧距离文档左侧的距离 */
  left: number
  /** 元素顶部距离文档顶部的距离 */
  top: number
  /** 元素右侧距离文档右侧的距离 */
  right: number
  /** 元素底部距离文档底部的距离 */
  bottom: number
  /** 元素左侧距离文档右侧的距离（包含 body） */
  rightIncludeBody: number
  /** 元素底部距离文档底部的距离（包含 body） */
  bottomIncludeBody: number
}

/**
 * 去除字符串两端的空格和特殊字符
 * @param {string} string 目标字符串
 * @returns {string} 返回去除空格后的字符串
 */
const trim = function (string: string): string {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/**
 * 将字符串转换为驼峰命名法
 * @param {string} name 输入的字符串
 * @returns {string} 返回转换后的驼峰字符串
 */
const camelCase = function (name: string): string {
  return name
    .replace(SPECIAL_CHARS_REGEXP, (_, __, letter, offset) =>
      offset ? letter.toUpperCase() : letter
    ) // 特殊字符后面的字母大写
    .replace(MOZ_HACK_REGEXP, 'Moz$1') // 将 Mozilla 前缀转化为标准形式
}

/**
 * 判断元素是否包含某个类名
 * @param {Element} el 目标元素
 * @param {string} cls 类名
 * @returns {boolean} 如果包含返回 true，否则返回 false
 */
export function hasClass(el: Element, cls: string): boolean {
  if (!el || !cls) return false // 如果元素或类名为空，直接返回 false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.') // 类名中不应包含空格
  return el.classList
    ? el.classList.contains(cls)
    : (' ' + el.className + ' ').includes(' ' + cls + ' ') // 使用 classList 或字符串判断
}

/**
 * 为元素添加类名
 * @param {Element} el 目标元素
 * @param {string} cls 要添加的类名
 */
export function addClass(el: Element, cls: string): void {
  if (!el) return // 如果元素为空，直接返回
  const classes = (cls || '').split(' ') // 将类名按空格分隔为数组
  classes.forEach((clsName) => {
    if (clsName) {
      el.classList
        ? el.classList.add(clsName)
        : !hasClass(el, clsName) && (el.className += ' ' + clsName) // 使用 classList 或字符串操作
    }
  })
}

/**
 * 移除元素的类名
 * @param {Element} el 目标元素
 * @param {string} cls 要移除的类名
 */
export function removeClass(el: Element, cls: string): void {
  if (!el || !cls) return // 如果元素或类名为空，直接返回
  const classes = cls.split(' ') // 将类名按空格分隔为数组
  let curClass = ' ' + el.className + ' ' // 当前类名的字符串形式
  classes.forEach((clsName) => {
    if (clsName) {
      el.classList
        ? el.classList.remove(clsName)
        : hasClass(el, clsName) && (curClass = curClass.replace(' ' + clsName + ' ', ' ')) // 使用 classList 或字符串操作
    }
  })
  !el.classList && (el.className = trim(curClass)) // 更新类名
}

/**
 * 获取元素的边界矩形
 * @param {Element} element 目标元素
 * @returns {DOMRect | number} 边界矩形对象或 0（无效元素）
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0 // 如果元素无效，返回 0
  }
  return element.getBoundingClientRect() // 返回边界矩形对象
}

/**
 * 获取元素的视口偏移量
 * @param {Element} element 目标元素
 * @returns {ViewportOffsetResult} 视口偏移结果
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement // 获取文档的根元素

  const docScrollLeft = doc.scrollLeft // 文档滚动的左偏移
  const docScrollTop = doc.scrollTop // 文档滚动的上偏移
  const docClientLeft = doc.clientLeft // 文档内容左边界的偏移
  const docClientTop = doc.clientTop // 文档内容顶部的偏移

  const pageXOffset = window.pageXOffset // 页面水平滚动量
  const pageYOffset = window.pageYOffset // 页面垂直滚动量

  const box = getBoundingClientRect(element) // 获取元素的边界矩形

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect // 解构矩形信息

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0) // 计算滚动后的左偏移
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0) // 计算滚动后的上偏移
  const offsetLeft = retLeft + pageXOffset // 元素左偏移
  const offsetTop = rectTop + pageYOffset // 元素顶部偏移

  const left = offsetLeft - scrollLeft // 计算元素左侧的实际偏移
  const top = offsetTop - scrollTop // 计算元素顶部的实际偏移

  const clientWidth = window.document.documentElement.clientWidth // 视口宽度
  const clientHeight = window.document.documentElement.clientHeight // 视口高度

  return {
    left: left, // 左偏移
    top: top, // 上偏移
    right: clientWidth - rectWidth - left, // 右偏移
    bottom: clientHeight - rectHeight - top, // 下偏移
    rightIncludeBody: clientWidth - left, // 包含 body 的右偏移
    bottomIncludeBody: clientHeight - top // 包含 body 的底部偏移
  }
}

/**
 * 为指定元素绑定事件监听器
 * @param {HTMLElement | Document | Window} element 目标元素
 * @param {string} event 事件类型
 * @param {EventListenerOrEventListenerObject} handler 事件处理器
 */
export const on = function (
  element: HTMLElement | Document | Window, // 目标元素，可以是 HTML 元素、文档或窗口
  event: string, // 事件类型，例如 'click' 或 'scroll'
  handler: EventListenerOrEventListenerObject // 事件处理器函数
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false) // 添加事件监听器
  }
}

/**
 * 移除指定元素的事件监听器
 * @param {HTMLElement | Document | Window} element 目标元素
 * @param {string} event 事件类型
 * @param {any} handler 事件处理器
 */
export const off = function (
  element: HTMLElement | Document | Window, // 目标元素
  event: string, // 事件类型
  handler: any // 事件处理器
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false) // 移除事件监听器
  }
}

/**
 * 为指定元素绑定一次性事件监听器
 * @param {HTMLElement} el 目标元素
 * @param {string} event 事件类型
 * @param {EventListener} fn 事件处理器
 */
export const once = function (el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: unknown[]) {
    if (fn) {
      fn.apply(this, args) // 调用事件处理器
    }
    off(el, event, listener) // 事件触发后移除监听器
  }
  on(el, event, listener) // 添加事件监听器
}

/**
 * 获取元素的样式属性值
 * @param {Element | any} element 目标元素
 * @param {string} styleName 样式属性名
 * @returns {any} 样式属性值
 */
export const getStyle =
  ieVersion < 9
    ? function (element: Element | any, styleName: string) {
        if (isServer) return // 如果是服务器端渲染，直接返回
        if (!element || !styleName) return null // 如果元素或样式名无效，返回 null
        styleName = camelCase(styleName) // 将样式名转换为驼峰命名法
        if (styleName === 'float') {
          styleName = 'styleFloat' // 处理 float 样式兼容性
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100 // 获取透明度
              } catch (e) {
                return 1.0 // 默认透明度为 1
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null // 获取样式值
          }
        } catch (e) {
          return element.style[styleName] // 返回样式值
        }
      }
    : function (element: Element | any, styleName: string) {
        if (isServer) return // 如果是服务器端渲染，直接返回
        if (!element || !styleName) return null // 如果元素或样式名无效，返回 null
        styleName = camelCase(styleName) // 将样式名转换为驼峰命名法
        if (styleName === 'float') {
          styleName = 'cssFloat' // 处理 float 样式兼容性
        }
        try {
          const computed = (document as any).defaultView.getComputedStyle(element, '') // 获取计算后的样式
          return element.style[styleName] || (computed ? computed[styleName] : null) // 返回样式值
        } catch (e) {
          return element.style[styleName] // 返回样式值
        }
      }

/**
 * 设置元素的样式属性值
 * @param {Element | any} element 目标元素
 * @param {any} styleName 样式属性名或样式对象
 * @param {any} value 样式属性值
 */
export function setStyle(element: Element | any, styleName: any, value: any): void {
  if (!element || !styleName) return // 如果元素或样式名无效，直接返回

  if (typeof styleName === 'object') {
    for (const prop in styleName) {
      if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
        setStyle(element, prop, styleName[prop]) // 遍历对象设置样式
      }
    }
  } else {
    styleName = camelCase(styleName) // 将样式名转换为驼峰命名法
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')' // 设置透明度样式
    } else {
      element.style[styleName] = value // 设置样式值
    }
  }
}

/**
 * 判断元素是否具有滚动条
 * @param {Element} el 目标元素
 * @param {any} vertical 是否检测垂直滚动
 * @returns {any} 返回滚动属性
 */
export const isScroll = (el: Element, vertical: any): any => {
  if (isServer) return // 如果是服务器端渲染，直接返回

  const determinedDirection = vertical !== null && vertical !== undefined // 判断方向是否已确定
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, 'overflow-y') // 获取垂直滚动样式
      : getStyle(el, 'overflow-x') // 获取水平滚动样式
    : getStyle(el, 'overflow') // 获取通用滚动样式

  return overflow.match(/(scroll|auto)/) // 检测滚动条类型
}

/**
 * 获取滚动容器
 * @param {Element} el 目标元素
 * @param {any} vertical 是否检测垂直滚动
 * @returns {any} 返回滚动容器
 */
export const getScrollContainer = (el: Element, vertical?: any): any => {
  if (isServer) return // 如果是服务器端渲染，直接返回

  let parent: any = el // 从目标元素开始
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window // 如果父元素是窗口或文档，返回 window
    }
    if (isScroll(parent, vertical)) {
      return parent // 如果父元素是可滚动的，返回该父元素
    }
    parent = parent.parentNode // 继续向上查找父元素
  }

  return parent // 返回最终的滚动容器
}

/**
 * 判断元素是否在容器内
 * @param {Element} el 目标元素
 * @param {any} container 容器元素
 * @returns {boolean} 是否在容器内
 */
export const isInContainer = (el: Element, container: any): boolean => {
  if (isServer || !el || !container) return false // 如果是服务器端渲染或参数无效，返回 false

  const elRect = el.getBoundingClientRect() // 获取目标元素的边界矩形
  let containerRect // 容器的边界矩形

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0, // 容器顶部为 0
      right: window.innerWidth, // 容器右侧为窗口宽度
      bottom: window.innerHeight, // 容器底部为窗口高度
      left: 0 // 容器左侧为 0
    }
  } else {
    containerRect = container.getBoundingClientRect() // 获取容器的边界矩形
  }

  // 判断目标元素是否在容器的边界范围内
  return (
    elRect.top < containerRect.bottom && // 元素顶部小于容器底部
    elRect.bottom > containerRect.top && // 元素底部大于容器顶部
    elRect.right > containerRect.left && // 元素右侧大于容器左侧
    elRect.left < containerRect.right // 元素左侧小于容器右侧
  )
}
