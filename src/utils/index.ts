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
	// 将组件强制转换为任何类型
	const comp = component as any

	// 为组件添加 install 方法，该方法接收一个应用实例作为参数
	comp.install = (app: any) => {
		// 将组件注册到 Vue 应用中，使用组件的名称或显示名称
		app.component(comp.name || comp.displayName, component)

		// 如果提供了别名，则将组件添加到全局属性中
		if (alias) {
			app.config.globalProperties[alias] = component
		}
	}

	// 返回增强后的组件，包含 install 方法
	return component as T & Plugin
}

/**
 * 将驼峰字符串转换为下划线字符串
 *
 * @param str 需要转换的驼峰字符串
 * @returns 转换后的下划线字符串
 */
export const humpToUnderline = (str: string): string => {
	// 使用正则表达式将所有大写字母前插入一个'-'，并将整个字符串转换为小写
	return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 将下划线字符串转换为驼峰字符串
 *
 * @param str 需要转换的下划线字符串
 * @returns 转换后的驼峰字符串
 */
export const underlineToHump = (str: string): string => {
	// 定义一个名为 underlineToHump 的函数，接收一个字符串参数 str，返回字符串
	if (!str) return '' // 如果 str 为空，则返回空字符串
	return str.replace(/\-(\w)/g, (_, letter: string) => {
		// 使用正则表达式替换 str 中每个连字符后的字母
		return letter.toUpperCase() // 将匹配到的字母转换为大写，并返回处理后的字符串
	})
}

/**
 * 将驼峰字符串转换为横杠字符串
 *
 * @param str 需要转换的驼峰字符串
 * @returns 转换后的横杠字符串
 */
export const humpToDash = (str: string): string => {
	// 定义一个名为 humpToDash 的函数，接收一个字符串参数 str，返回字符串
	return str.replace(/([A-Z])/g, '-$1').toLowerCase() // 使用正则表达式查找大写字母，并在其前添加连字符，最后将整个字符串转换为小写
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
	// 在指定的DOM元素上设置CSS变量，使用的属性名和属性值由参数提供
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
	// 获取指定DOM元素的计算样式，并返回指定CSS变量的值
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
	// 检查数组是否支持 findIndex 方法，若支持则直接使用该方法
	if (ary.findIndex) {
		return ary.findIndex(fn) // 使用 findIndex 方法查找符合条件的元素下标
	}

	// 初始化下标为 -1，表示未找到
	let index = -1

	// 使用 some 方法遍历数组，如果符合条件则更新下标并返回 true 以停止遍历
	ary.some((item: T, i: number, ary: Array<T>) => {
		// 调用判断函数对当前元素进行判断
		const ret: T = fn(item, i, ary)

		// 如果判断返回为 true，则记录下标，并终止循环
		if (ret) {
			index = i // 更新下标为当前元素的索引
			return ret // 返回 true 停止 some 的遍历
		}
	})

	// 返回找到的下标，如果未找到则返回 -1
	return index
}

/**
 * 去除字符串两端的空格
 *
 * @param str 需要去除空格的字符串
 * @returns 去除空格后的字符串
 */
export const trim = (str: string) => {
	// 使用正则表达式替换掉字符串开头和结尾的空格，并返回处理后的字符串
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
	// 如果传入的时间为 falsy 值，则返回空字符串
	if (!time) return ''
	else {
		// 使用传入的时间参数创建一个新的 Date 对象
		const date = new Date(time)

		// 定义一个对象 o，用于存储不同时间单位的值
		const o = {
			'M+': date.getMonth() + 1, // 获取月份（注意：月份从 0 开始，因此加 1）
			'd+': date.getDate(), // 获取日期
			'H+': date.getHours(), // 获取小时
			'm+': date.getMinutes(), // 获取分钟
			's+': date.getSeconds(), // 获取秒
			'q+': Math.floor((date.getMonth() + 3) / 3), // 获取当前季度
			S: date.getMilliseconds() // 获取毫秒
		}

		// 检查格式字符串 fmt 中是否包含年份的占位符
		if (/(y+)/.test(fmt)) {
			// 用当前年份替换格式中的年份占位符
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
		}

		// 遍历对象 o 的每一个键
		for (const k in o) {
			// 检查格式字符串 fmt 中是否包含当前时间单位的占位符
			if (new RegExp('(' + k + ')').test(fmt)) {
				// 替换格式中的占位符为对应的时间值
				fmt = fmt.replace(
					RegExp.$1, // 要替换的占位符
					RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length) // 单位数补零
				)
			}
		}

		// 返回格式化后的时间字符串
		return fmt
	}
}

/**
 * 生成随机字符串的函数
 *
 * @returns 随机生成的字符串
 */
export function toAnyString() {
	// 使用正则表达式生成一个随机字符串，其中包含 x 和 y 字符
	const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
		// 生成一个 0 到 15 的随机数
		const r: number = (Math.random() * 16) | 0
		// 根据当前字符确定返回值：
		// 如果是 'x'，返回随机数；如果是 'y'，生成一个符合特定条件的值
		const v: number = c === 'x' ? r : (r & 0x3) | 0x8
		// 返回生成的字符
		return v.toString()
	})
	// 返回生成的随机字符串
	return str
}

/**
 * 首字母大写的函数
 *
 * @param str 需要转换的字符串
 * @returns 首字母大写的字符串
 */
export function firstUpperCase(str: string) {
	// 将字符串转换为小写，并使用正则表达式替换首字母，将其转为大写
	return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 把对象转为formData的函数
 *
 * @param obj 需要转换的对象
 * @returns 转换后的formData对象
 */
export function objToFormData(obj: Recordable) {
	// 创建一个新的 FormData 对象
	const formData = new FormData()

	// 遍历对象的所有键，将每个键值对添加到 FormData 对象中
	Object.keys(obj).forEach((key) => {
		// 使用 append 方法将键值对添加到 FormData 对象
		formData.append(key, obj[key])
	})

	// 返回转换后的 FormData 对象
	return formData
}
