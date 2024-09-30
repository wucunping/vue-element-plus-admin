/**
 * is.ts - 类型检查工具
 *
 * @description
 * 本文件包含一系列类型检查函数，用于判断变量的类型，如是否为对象、数组、字符串、数字、函数等。
 * 还包含一些特定类型的检查，如日期、Promise、窗口对象、元素、Map、服务器/客户端环境等。
 *
 * @example
 * 使用示例：
 * 判断是否为对象：`isObject({})`
 * 判断是否为数组：`isArray([])`
 * 判断是否为字符串：`isString('')`
 * 判断是否为Promise：`isPromise(new Promise(() => {}))`
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 获取Object的原型方法toString，用于判断值的类型
 */
const toString = Object.prototype.toString

/**
 * 判断给定值是否为指定类型
 * @param val 待检查的值
 * @param type 类型字符串，如'Object', 'Number'等
 * @returns 如果val的类型是type，则返回true，否则返回false
 */
export const is = (val: unknown, type: string) => {
	return toString.call(val) === `[object ${type}]`
}

/**
 * 判断给定值是否已定义
 * @param val 待检查的值
 * @returns 如果val已定义（非undefined），则返回true，否则返回false
 */
export const isDef = <T = unknown>(val?: T): val is T => {
	return typeof val !== 'undefined'
}

/**
 * 判断给定值是否未定义
 * @param val 待检查的值
 * @returns 如果val未定义（为undefined），则返回true，否则返回false
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
	return !isDef(val)
}

/**
 * 判断给定值是否为对象类型
 * @param val 待检查的值
 * @returns 如果val是对象类型，则返回true，否则返回false
 */
export const isObject = (val: any): val is Record<any, any> => {
	return val !== null && is(val, 'Object')
}

/**
 * 判断给定值是否为空
 * @param val 待检查的值
 * @returns 如果val为空，则返回true，否则返回false
 */
export const isEmpty = <T = unknown>(val: T): val is T => {
	// 检查值是否为数组或字符串，如果是，则返回其长度是否为 0
	if (isArray(val) || isString(val)) {
		return val.length === 0
	}

	// 检查值是否为 Map 或 Set 实例，如果是，则返回其大小是否为 0
	if (val instanceof Map || val instanceof Set) {
		return val.size === 0
	}

	// 检查值是否为对象，如果是，则返回其键的数量是否为 0
	if (isObject(val)) {
		return Object.keys(val).length === 0
	}

	// 对于其他类型的值，返回 false，表示该值不为空
	return false
}

/**
 * 判断给定值是否为日期类型
 * @param val 待检查的值
 * @returns 如果val是日期类型，则返回true，否则返回false
 */
export const isDate = (val: unknown): val is Date => {
	return is(val, 'Date')
}

/**
 * 判断给定值是否为null
 * @param val 待检查的值
 * @returns 如果val为null，则返回true，否则返回false
 */
export const isNull = (val: unknown): val is null => {
	return val === null
}

/**
 * 判断给定值是否为null或undefined
 * @param val 待检查的值
 * @returns 如果val为null或undefined，则返回true，否则返回false
 */
export const isNullAndUnDef = (val: unknown): val is null | undefined => {
	return isUnDef(val) && isNull(val)
}

/**
 * 判断给定值是否为null或undefined
 * @param val 待检查的值
 * @returns 如果val为null或undefined，则返回true，否则返回false
 */
export const isNullOrUnDef = (val: unknown): val is null | undefined => {
	return isUnDef(val) || isNull(val)
}

/**
 * 判断给定值是否为数字类型
 * @param val 待检查的值
 * @returns 如果val是数字类型，则返回true，否则返回false
 */
export const isNumber = (val: unknown): val is number => {
	return is(val, 'Number')
}

/**
 * 判断给定值是否为Promise类型
 * @param val 待检查的值
 * @returns 如果val是Promise类型，则返回true，否则返回false
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
	return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * 判断给定值是否为字符串类型
 * @param val 待检查的值
 * @returns 如果val是字符串类型，则返回true，否则返回false
 */
export const isString = (val: unknown): val is string => {
	return is(val, 'String')
}

/**
 * 判断给定值是否为函数类型
 * @param val 待检查的值
 * @returns 如果val是函数类型，则返回true，否则返回false
 */
// export const isFunction = (val: unknown): val is Function => {
export const isFunction = (val: unknown): val is (...args: any[]) => any => {
	return typeof val === 'function'
}

/**
 * 判断给定值是否为布尔类型
 * @param val 待检查的值
 * @returns 如果val是布尔类型，则返回true，否则返回false
 */
export const isBoolean = (val: unknown): val is boolean => {
	return is(val, 'Boolean')
}

/**
 * 判断给定值是否为正则表达式类型
 * @param val 待检查的值
 * @returns 如果val是正则表达式类型，则返回true，否则返回false
 */
export const isRegExp = (val: unknown): val is RegExp => {
	return is(val, 'RegExp')
}

/**
 * 判断给定值是否为数组类型
 * @param val 待检查的值
 * @returns 如果val是数组类型，则返回true，否则返回false
 */
export const isArray = (val: any): val is Array<any> => {
	return val && Array.isArray(val)
}

/**
 * 判断给定值是否为Window对象
 * @param val 待检查的值
 * @returns 如果val是Window对象，则返回true，否则返回false
 */
export const isWindow = (val: any): val is Window => {
	return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * 判断给定值是否为DOM元素
 * @param val 待检查的值
 * @returns 如果val是DOM元素，则返回true，否则返回false
 */
export const isElement = (val: unknown): val is Element => {
	return isObject(val) && !!val.tagName
}

/**
 * 判断给定值是否为Map类型
 * @param val 待检查的值
 * @returns 如果val是Map类型，则返回true，否则返回false
 */
export const isMap = (val: unknown): val is Map<any, any> => {
	return is(val, 'Map')
}

/**
 * 判断当前环境是否为服务器环境
 * @returns 如果是服务器环境，返回true，否则返回false
 */
export const isServer = typeof window === 'undefined'

/**
 * 判断当前环境是否为客户端环境
 * @returns 如果是客户端环境，返回true，否则返回false
 */
export const isClient = !isServer

/**
 * 判断给定字符串是否为URL
 * @param path 待检查的字符串
 * @returns 如果path是有效的URL，则返回true，否则返回false
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
 * 判断当前环境是否为暗色模式
 * @returns 如果是暗色模式，返回true，否则返回false
 */
export const isDark = (): boolean => {
	return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 判断给定路径是否为图片链接
 * @param path 待检查的路径
 * @returns 如果path是图片链接，则返回true，否则返回false
 */
export const isImgPath = (path: string): boolean => {
	return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path)
}

/**
 * 判断给定值是否为空值
 * @param val 待检查的值
 * @returns 如果val为空值（空字符串、null、undefined），则返回true，否则返回false
 */
export const isEmptyVal = (val: any): boolean => {
	return val === '' || val === null || val === undefined
}
