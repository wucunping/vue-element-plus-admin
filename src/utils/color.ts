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
	const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
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
	const hex = ((r << 16) | (g << 8) | b).toString(16)
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
	let sHex = hex.toLowerCase()
	if (isHexColor(hex)) {
		if (sHex.length === 4) {
			let sColorNew = '#'
			for (let i = 1; i < 4; i += 1) {
				sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
			}
			sHex = sColorNew
		}
		const sColorChange: number[] = []
		for (let i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
		}
		return opacity
			? 'RGBA(' + sColorChange.join(',') + ',' + opacity + ')'
			: 'RGB(' + sColorChange.join(',') + ')'
	}
	return sHex
}

/**
 * 判断颜色是否为暗色。
 *
 * @param color 十六进制颜色值
 * @returns 如果颜色为暗色则返回 true，否则返回 false
 */
export const colorIsDark = (color: string) => {
	if (!isHexColor(color)) return
	const [r, g, b] = hexToRGB(color)
		.replace(/(?:\(|\)|rgb|RGB)*/g, '')
		.split(',')
		.map((item) => Number(item))
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
	color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
	amount = Math.trunc((255 * amount) / 100)
	return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
		color.substring(2, 4),
		amount
	)}${subtractLight(color.substring(4, 6), amount)}`
}

/**
 * 减淡颜色的色调。
 *
 * @param color 十六进制颜色值
 * @param amount 色调减淡的百分比
 * @returns 减淡色调后的颜色
 */
export const lighten = (color: string, amount: number) => {
	color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
	amount = Math.trunc((255 * amount) / 100)
	return `#${addLight(color.substring(0, 2), amount)}${addLight(
		color.substring(2, 4),
		amount
	)}${addLight(color.substring(4, 6), amount)}`
}

/**
 * 将颜色值中的特定部分加亮。
 *
 * @param color 十六进制颜色值
 * @param amount 要加亮的数量
 * @returns 加亮后的颜色部分
 */
const addLight = (color: string, amount: number) => {
	const cc = parseInt(color, 16) + amount
	const c = cc > 255 ? 255 : cc
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
	const a = [r, g, b].map((v) => {
		v /= 255
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
	})
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
	return (
		(luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
		(luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
	)
}

/**
 * 根据背景颜色选择最佳的文本颜色（黑色或白色）。
 *
 * @param hexColor 最后选择的颜色
 * @returns 最佳的文本颜色
 */
export const calculateBestTextColor = (hexColor: string) => {
	const rgbColor = hexToRGB(hexColor.substring(1))
	const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

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
	const cc = parseInt(color, 16) - amount
	const c = cc < 0 ? 0 : cc
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
	let color = '#'
	for (let i = 0; i <= 2; i++) {
		const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16)
		const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16)
		const c = Math.round(c1 * weight + c2 * (1 - weight))
		color += c.toString(16).padStart(2, '0')
	}
	return color
}
