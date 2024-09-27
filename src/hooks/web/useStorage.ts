/**
 * @file useStorage.ts
 * @description 该模块提供了一组用于操作浏览器存储（sessionStorage 和 localStorage）的 API，包括设置、获取、删除和清除存储项的功能。
 * @example
 * import { useStorage } from './useStorage'
 *
 * const { setStorage, getStorage, removeStorage, clear } = useStorage('localStorage')
 *
 * // 存储数据
 * setStorage('key', { example: 'value' })
 *
 * // 获取数据
 * const data = getStorage('key')
 *
 * // 移除数据
 * removeStorage('key')
 *
 * // 清除存储
 * clear(['excludeKey'])
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date ${new Date().toISOString().split('T')[0]}  // 当前日期
 * @module StorageUtility
 */

/**
 * 获取传入值的类型
 * @param value 要检查类型的值
 * @returns 返回值的字符串类型
 */
const getValueType = (value: any) => {
	const type = Object.prototype.toString.call(value) // 使用Object.prototype.toString获取值的类型
	return type.slice(8, -1) // 返回类型字符串（去掉前后缀）
}

/**
 * 创建一个操作浏览器存储的组合函数
 * @param type 存储类型，支持'sessionStorage'或'localStorage'
 * @returns 返回包含存储操作方法的对象
 */
export const useStorage = (type: 'sessionStorage' | 'localStorage' = 'sessionStorage') => {
	/**
	 * 设置存储数据
	 * @param key 存储的键名
	 * @param value 要存储的值
	 */
	const setStorage = (key: string, value: any) => {
		const valueType = getValueType(value) // 获取值的类型
		// 将值及其类型转换为JSON字符串并存入存储中
		window[type].setItem(key, JSON.stringify({ type: valueType, value }))
	}

	/**
	 * 获取存储数据
	 * @param key 要获取的键名
	 * @returns 返回存储的数据
	 */
	const getStorage = (key: string) => {
		const value = window[type].getItem(key) // 获取存储中的值
		if (value) {
			const { value: val } = JSON.parse(value) // 解析存储的字符串
			return val // 返回实际存储的值
		} else {
			return value // 如果没有值，直接返回null
		}
	}

	/**
	 * 移除存储中的数据
	 * @param key 要移除的键名
	 */
	const removeStorage = (key: string) => {
		window[type].removeItem(key) // 从存储中移除指定的键
	}

	/**
	 * 清空存储
	 * @param excludes 排除的键名数组，清空时不会清除这些键
	 */
	const clear = (excludes?: string[]) => {
		// 获取当前存储中的所有键名
		const keys = Object.keys(window[type])
		const defaultExcludes = ['dynamicRouter', 'serverDynamicRouter'] // 默认排除项
		// 如果有传入排除项，则合并
		const excludesArr = excludes ? [...excludes, ...defaultExcludes] : defaultExcludes
		// 过滤出需要清除的键名
		const excludesKeys = excludesArr ? keys.filter((key) => !excludesArr.includes(key)) : keys
		// 移除不在排除列表中的所有键
		excludesKeys.forEach((key) => {
			window[type].removeItem(key)
		})
		// window[type].clear() // 可选：清空整个存储，但因为排除项不清空，因此这里被注释掉
	}

	// 返回包含存储操作的函数
	return {
		setStorage, // 设置函数
		getStorage, // 获取函数
		removeStorage, // 移除函数
		clear // 清空函数
	}
}
