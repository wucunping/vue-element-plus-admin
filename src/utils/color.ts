/**
 * color.ts - 颜色处理工具函数
 *
 * @description
 * 该文件包含一系列用于处理颜色的函数，包括判断是否为十六进制颜色值、RGB颜色值转换为十六进制颜色值、十六进制颜色值转换为RGB表示、判断颜色是否为深色、颜色变暗、颜色变亮、计算颜色亮度、计算颜色对比度、计算最佳文本颜色以及颜色混合等。
 *
 * @example
 * 使用示例：
 * 判断是否为十六进制颜色值：`isHexColor('#fff000')`
 * RGB颜色值转换为十六进制颜色值：`rgbToHex(255, 0, 0)`
 * 十六进制颜色值转换为RGB表示：`hexToRGB('#ff0000')`
 * 判断颜色是否为深色：`colorIsDark('#000000')`
 * 颜色变暗：`darken('#ff0000', 20)`
 * 颜色变亮：`lighten('#000000', 20)`
 * 计算最佳文本颜色：`calculateBestTextColor('#ffffff')`
 * 颜色混合：`mix('#ff0000', '#00ff00', 0.5)`
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 判断是否为十六进制颜色值。
 * 输入形式可为 #fff000 或 #f00。
 *
 * @param color 十六进制颜色值字符串
 * @returns 若是有效的十六进制颜色值则返回 true，否则返回 false
 */
export const isHexColor = (color: string) => {
	/** 定义一个正则表达式reg，用于匹配有效的十六进制颜色值格式 */
	const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
	/** 使用正则表达式reg测试color，若匹配成功则返回true，否者返回false */
	return reg.test(color)
}

/**
 * 将 RGB 颜色值转换为十六进制颜色值。
 * r, g, 和 b 需要在 [0, 255] 范围内。
 *
 * @param r 红色通道值
 * @param g 绿色通道值
 * @param b 蓝色通道值
 * @returns 转换后的十六进制颜色值，例如：#ff00ff
 */
export const rgbToHex = (r: number, g: number, b: number) => {
	// tslint:disable-next-line:no-bitwise
	/**
	 * 计算RGB颜色的十六进制表示，使用位运算将红色、绿色和蓝色通道的值组合为一个十六进制数。
	 *
	 * 将红色通道值左移16位，绿色通道值左移8位，再与蓝色通道值进行按位或运算。
	 */
	const hex = ((r << 16) | (g << 8) | b).toString(16)

	/**
	 * 在十六进制字符串前添加必要的前导零，以确保结果为七位（包含#符号）。
	 * 通过计算hex的长度与7的差值，创建一个数组，并将其内容用'0'填充。
	 */
	return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

/**
 * 将十六进制颜色转换为 RGB 表示。
 *
 * @param hex 十六进制颜色值
 * @param opacity 可选的透明度值，默认为不透明
 * @returns RGB 表示的十六进制颜色
 */
export const hexToRGB = (hex: string, opacity?: number) => {
	// 将传入的 HEX 颜色转为小写
	let sHex = hex.toLowerCase()
	// 检查输入的字符串是否是有效的 HEX 颜色
	if (isHexColor(hex)) {
		// 如果字符串长度为 4（如：#abc），则进行转换
		if (sHex.length === 4) {
			let sColorNew = '#' // 初始化新的 HEX 颜色字符串
			// 将每个字符重复一次并拼接形成标准的 HEX 颜色格式
			for (let i = 1; i < 4; i += 1) {
				sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
			}
			// 更新 sHex 为标准格式的 HEX
			sHex = sColorNew
		}
		const sColorChange: number[] = [] // 定义一个数组来存储转换后的 RGB 值
		// 遍历 HEX 颜色的每两个字符，将其转换为 RGB 颜色值
		for (let i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2))) // 将 HEX 转换为十进制并存入数组
		}
		// 根据是否提供不透明度，返回 RGB 或 RGBA 格式的字符串
		return opacity
			? 'RGBA(' + sColorChange.join(',') + ',' + opacity + ')' // 包含不透明度
			: 'RGB(' + sColorChange.join(',') + ')' // 不包含不透明度
	}
	// 如果不是有效的 HEX 颜色，则返回原始的 sHex 值
	return sHex
}

/**
 * 判断颜色是否为暗色。
 *
 * @param color 十六进制颜色值
 * @returns 如果颜色为暗色则返回 true，否则返回 false
 */
export const colorIsDark = (color: string) => {
	// 检查输入的字符串是否是有效的 HEX 颜色；如果不是，则返回 undefined
	if (!isHexColor(color)) return
	// 调用 hexToRGB 函数将 HEX 颜色转换为 RGB，并使用正则表达式和 split 方法处理返回值
	const [r, g, b] = hexToRGB(color)
		.replace(/(?:$|$|rgb|RGB)*/g, '') // 去掉 RGB/RGBA 相关的字符
		.split(',') // 将字符串按逗号分割成数组
		.map((item) => Number(item)) // 将数组中的每个值转换为数字
	// 计算亮度值，如果亮度小于 192，则返回 true，表示颜色是深色
	return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * 加深颜色的色调。
 *
 * @param color 十六进制颜色值
 * @param amount 色调加深的百分比
 * @returns 加深色调后的颜色
 */
export const darken = (color: string, amount: number) => {
	// 检查颜色字符串中是否包含 '#' 符号，如果有，则去掉这个符号
	color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
	// 将不透明度参数转换为一个整数，表示要减少的光亮度
	amount = Math.trunc((255 * amount) / 100)
	// 返回一个新的 hex 颜色字符串，使用 subtractLight 函数减少每个颜色通道的亮度
	return (
		`#${subtractLight(color.substring(0, 2), amount)}` + // 减少红色通道
		`${subtractLight(color.substring(2, 4), amount)}` + // 减少绿色通道
		`${subtractLight(color.substring(4, 6), amount)}` // 减少蓝色通道
	)
}

/**
 * 减淡颜色的色调。
 *
 * @param color 十六进制颜色值
 * @param amount 色调减淡的百分比
 * @returns 减淡色调后的颜色
 */
export const lighten = (color: string, amount: number) => {
	// 检查颜色字符串中是否包含 '#' 符号，如果有，则去掉这个符号
	color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
	// 将不透明度参数转换为一个整数，表示要增加的光亮度
	amount = Math.trunc((255 * amount) / 100)
	// 返回一个新的 hex 颜色字符串，使用 addLight 函数增加每个颜色通道的亮度
	return (
		`#${addLight(color.substring(0, 2), amount)}` + // 增加红色通道
		`${addLight(color.substring(2, 4), amount)}` + // 增加绿色通道
		`${addLight(color.substring(4, 6), amount)}` // 增加蓝色通道
	)
}

/**
 * 将颜色值中的特定部分加亮。
 *
 * @param color 十六进制颜色值
 * @param amount 要加亮的数量
 * @returns 加亮后的颜色部分
 */
const addLight = (color: string, amount: number) => {
	// 将十六进制颜色字符串转换为十进制整数，并加上指定的亮度值
	const cc = parseInt(color, 16) + amount
	// 如果加亮后的值超过 255，则将其设为 255
	const c = cc > 255 ? 255 : cc
	// 判断转换后的十六进制字符串的长度，如果长度为 1，则在前面补 '0'
	return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 计算 rgb 颜色的亮度。
 *
 * @param r 红色通道值
 * @param g 绿色通道值
 * @param b 蓝色通道值
 * @returns 颜色的亮度值
 */
const luminanace = (r: number, g: number, b: number) => {
	// 将 RGB 颜色通道值归一化到 0 到 1 之间，并根据条件进行调整
	const a = [r, g, b].map((v) => {
		// 将颜色通道值除以 255 以获取归一化值
		v /= 255
		// 根据归一化值的大小，返回不同的亮度计算结果
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
	})
	// 根据一定的加权公式计算最终的亮度值
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * 计算两种 rgb 颜色之间的对比度。
 *
 * @param {string[]} rgb1 第一种颜色的 rgb 表示
 * @param {number[]} rgb2 第二种颜色的 rgb 表示
 * @returns 两种颜色之间的对比度
 */
const contrast = (rgb1: string[], rgb2: number[]) => {
	// 计算第一个 RGB 颜色的亮度值，并加上 0.05
	return (
		(luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) / // 计算第一个颜色的亮度
		(luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05) // 计算第二个颜色的亮度
	)
}

/**
 * 根据背景颜色选择最佳的文本颜色（黑色或白色）。
 *
 * @param hexColor 最后选择的颜色
 * @returns 最佳的文本颜色
 */
export const calculateBestTextColor = (hexColor: string) => {
	// 将十六进制颜色值转换为 RGB 格式
	const rgbColor = hexToRGB(hexColor.substring(1))
	// 计算与黑色的对比度
	const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

	// 如果与黑色的对比度大于或等于 12，则返回黑色；否则返回白色
	return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * 将颜色值中的特定部分减淡。
 *
 * @param color 十六进制颜色值
 * @param amount 要减淡的数量
 * @returns 减淡后的颜色部分
 */
const subtractLight = (color: string, amount: number) => {
	// 将十六进制颜色字符串转换为十进制整数，并减去指定的亮度值
	const cc = parseInt(color, 16) - amount
	// 如果减亮后的值小于 0，则将其设为 0
	const c = cc < 0 ? 0 : cc
	// 判断转换后的十六进制字符串的长度，如果长度为 1，则在前面补 '0'
	return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 混合两种颜色。
 *
 * @param color1 第一种颜色，应该是以 # 开头的 6 位十六进制颜色码
 * @param color2 第二种颜色，应该是以 # 开头的 6 位十六进制颜色码
 * @param weight color1 在混合中的权重，应该是一个介于 0 和 1 之间的数字，其中 0 代表 100% 的 color2，1 代表 100% 的 color1
 * @returns 混合后的颜色，是一个以 # 开头的 6 位十六进制颜色码
 */
export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
	// 初始化混合后颜色的字符串，以 '#' 开头
	let color = '#'
	// 循环通过三个颜色通道（红、绿、蓝）进行混合
	for (let i = 0; i <= 2; i++) {
		// 从 color1 中提取对应的颜色通道并转换为十进制整数
		const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16)
		// 从 color2 中提取对应的颜色通道并转换为十进制整数
		const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16)
		// 根据权重计算混合后的颜色通道值，并四舍五入到最近的整数
		const c = Math.round(c1 * weight + c2 * (1 - weight))
		// 将计算出的颜色通道值转换为十六进制字符串并添加到结果颜色字符串中
		color += c.toString(16).padStart(2, '0') // 确保每个颜色通道有 2 位
	}
	// 返回混合后的颜色字符串
	return color
}
