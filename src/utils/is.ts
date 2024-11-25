/**
 * @file is.ts
 * @description 提供类型判断的实用工具函数。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * Object 原型方法 toString
 */
const toString = Object.prototype.toString

/**
 * 判断值是否为指定类型
 * @param {unknown} val 需要判断的值
 * @param {string} type 类型字符串，如 'Object'、'Array'
 * @returns {boolean} 是否为指定类型
 */
export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`
}

/**
 * 判断值是否已定义
 * @template T
 * @param {T} [val] 值
 * @returns {boolean} 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

/**
 * 判断值是否未定义
 * @template T
 * @param {T} [val] 值
 * @returns {boolean} 是否未定义
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val)
}

/**
 * 判断值是否为对象
 * @param {any} val 需要判断的值
 * @returns {boolean} 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object')
}

/**
 * 判断值是否为空
 * @template T
 * @param {T} val 值
 * @returns {boolean} 是否为空
 */
export const isEmpty = <T = unknown>(val: T): val is T => {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

/**
 * 判断值是否为日期类型
 * @param {unknown} val 值
 * @returns {boolean} 是否为日期
 */
export const isDate = (val: unknown): val is Date => {
  return is(val, 'Date')
}

/**
 * 判断值是否为 null
 * @param {unknown} val 值
 * @returns {boolean} 是否为 null
 */
export const isNull = (val: unknown): val is null => {
  return val === null
}

/**
 * 判断值是否为 null 且未定义
 * @param {unknown} val 值
 * @returns {boolean} 是否为 null 且未定义
 */
export const isNullAndUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) && isNull(val)
}

/**
 * 判断值是否为 null 或未定义
 * @param {unknown} val 值
 * @returns {boolean} 是否为 null 或未定义
 */
export const isNullOrUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) || isNull(val)
}

/**
 * 判断值是否为数字
 * @param {unknown} val 值
 * @returns {boolean} 是否为数字
 */
export const isNumber = (val: unknown): val is number => {
  return is(val, 'Number')
}

/**
 * 判断值是否为 Promise
 * @template T
 * @param {unknown} val 值
 * @returns {boolean} 是否为 Promise
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * 判断值是否为字符串
 * @param {unknown} val 值
 * @returns {boolean} 是否为字符串
 */
export const isString = (val: unknown): val is string => {
  return is(val, 'String')
}

/**
 * 判断值是否为函数
 * @param {unknown} val 值
 * @returns {boolean} 是否为函数
 */
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

/**
 * 判断值是否为布尔值
 * @param {unknown} val 值
 * @returns {boolean} 是否为布尔值
 */
export const isBoolean = (val: unknown): val is boolean => {
  return is(val, 'Boolean')
}

/**
 * 判断值是否为正则表达式
 * @param {unknown} val 值
 * @returns {boolean} 是否为正则表达式
 */
export const isRegExp = (val: unknown): val is RegExp => {
  return is(val, 'RegExp')
}

/**
 * 判断值是否为数组
 * @param {any} val 值
 * @returns {boolean} 是否为数组
 */
export const isArray = (val: any): val is Array<any> => {
  return val && Array.isArray(val)
}

/**
 * 判断值是否为窗口对象
 * @param {any} val 值
 * @returns {boolean} 是否为窗口对象
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * 判断值是否为 HTML 元素
 * @param {unknown} val 值
 * @returns {boolean} 是否为 HTML 元素
 */
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName
}

/**
 * 判断值是否为 Map
 * @param {unknown} val 值
 * @returns {boolean} 是否为 Map
 */
export const isMap = (val: unknown): val is Map<any, any> => {
  return is(val, 'Map')
}

/**
 * 是否是服务器端渲染
 */
export const isServer = typeof window === 'undefined'

/**
 * 是否是客户端
 */
export const isClient = !isServer

/**
 * 判断字符串是否为有效 URL
 * @param {string} path 字符串
 * @returns {boolean} 是否为有效 URL
 */
export const isUrl = (path: string): boolean => {
  try {
    new URL(path)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * 判断当前是否为暗黑模式
 * @returns {boolean} 是否为暗黑模式
 */
export const isDark = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 判断字符串是否为图片路径
 * @param {string} path 字符串
 * @returns {boolean} 是否为图片路径
 */
export const isImgPath = (path: string): boolean => {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path)
}

/**
 * 判断值是否为空值
 * @param {any} val 值
 * @returns {boolean} 是否为空值
 */
export const isEmptyVal = (val: any): boolean => {
  return val === '' || val === null || val === undefined
}
