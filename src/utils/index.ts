/**
 * index.ts - 工具函数库
 *
 * @description
 * 本文件提供了一系列实用的工具函数，包括Vue组件注册助手、字符串格式转换、CSS变量设置与获取、
 * 数组查找、字符串修剪、日期格式化、随机字符串生成、首字母大写以及对象转为FormData等功能。
 *
 * @example
 * 使用示例：
 * Vue组件注册助手：`withInstall(MyComponent, 'my-component')`
 * 字符串转下划线：`humpToUnderline('myVariableName')`
 * 字符串转驼峰：`underlineToHump('my-variable-name')`
 * 设置CSS变量：`setCssVar('--my-var', 'red')`
 * 获取CSS变量：`getCssVar('--my-var')`
 * 查找数组下标：`findIndex(myArray, item => item.id === 1)`
 * 字符串修剪：`trim('  my string  ')`
 * 日期格式化：`formatTime(new Date(), 'yyyy-MM-dd')`
 * 生成随机字符串：`toAnyString()`
 * 首字母大写：`firstUpperCase('my string')`
 * 对象转为FormData：`objToFormData({ key: 'value' })`
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 注册并安装组件的函数
 *
 * @param component 需要注册的组件
 * @param alias 组件别名，如果为undefined或null则不添加
 * @returns 注册后的组件
 */
export const withInstall = <T>(component: T, alias?: string) => {
	const comp = component as any
	comp.install = (app: any) => {
		app.component(comp.name || comp.displayName, component)
		if (alias) {
			app.config.globalProperties[alias] = component
		}
	}
	return component as T & Plugin
}

/**
 * 将驼峰字符串转换为下划线字符串
 *
 * @param str 需要转换的驼峰字符串
 * @returns 转换后的下划线字符串
 */
export const humpToUnderline = (str: string): string => {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 将下划线字符串转换为驼峰字符串
 *
 * @param str 需要转换的下划线字符串
 * @returns 转换后的驼峰字符串
 */
export const underlineToHump = (str: string): string => {
	if (!str) return ''
	return str.replace(/\-(\w)/g, (_, letter: string) => {
		return letter.toUpperCase()
	})
}

/**
 * 将驼峰字符串转换为横杠字符串
 *
 * @param str 需要转换的驼峰字符串
 * @returns 转换后的横杠字符串
 */
export const humpToDash = (str: string): string => {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 设置CSS变量的函数
 *
 * @param prop 需要设置的CSS变量名
 * @param val 需要设置的CSS变量值
 * @param dom 默认的dom元素为document.documentElement，如果传入其他值则使用传入的值
 * @returns 设置的CSS变量
 */
export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
	dom.style.setProperty(prop, val)
}

/**
 * 获取CSS变量的函数
 *
 * @param prop 需要获取的CSS变量名
 * @param dom 默认的dom元素为document.documentElement，如果传入其他值则使用传入的值
 * @returns 获取的CSS变量值
 */
export const getCssVar = (prop: string, dom = document.documentElement) => {
	return getComputedStyle(dom).getPropertyValue(prop)
}

/**
 * 查找数组对象的某个下标
 *
 * @param ary 查找的数组
 * @param fn 判断的方法
 * @returns 找到的下标，如果未找到则返回-1
 */
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
	if (ary.findIndex) {
		return ary.findIndex(fn)
	}
	let index = -1
	ary.some((item: T, i: number, ary: Array<T>) => {
		const ret: T = fn(item, i, ary)
		if (ret) {
			index = i
			return ret
		}
	})
	return index
}

/**
 * 去除字符串两端的空格
 *
 * @param str 需要去除空格的字符串
 * @returns 去除空格后的字符串
 */
export const trim = (str: string) => {
	return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 格式化时间函数
 *
 * @param time 需要转换的时间，可以是Date、number或string类型
 * @param fmt 需要转换的格式，如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 * @returns 格式化后的时间字符串
 */
export function formatTime(time: Date | number | string, fmt: string) {
	if (!time) return ''
	else {
		const date = new Date(time)
		const o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'H+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
			'q+': Math.floor((date.getMonth() + 3) / 3),
			S: date.getMilliseconds()
		}
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		for (const k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(
					RegExp.$1,
					RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
				)
			}
		}
		return fmt
	}
}

/**
 * 生成随机字符串的函数
 *
 * @returns 随机生成的字符串
 */
export function toAnyString() {
	const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
		const r: number = (Math.random() * 16) | 0
		const v: number = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString()
	})
	return str
}

/**
 * 首字母大写的函数
 *
 * @param str 需要转换的字符串
 * @returns 首字母大写的字符串
 */
export function firstUpperCase(str: string) {
	return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 把对象转为formData的函数
 *
 * @param obj 需要转换的对象
 * @returns 转换后的formData对象
 */
export function objToFormData(obj: Recordable) {
	const formData = new FormData()
	Object.keys(obj).forEach((key) => {
		formData.append(key, obj[key])
	})
	return formData
}
