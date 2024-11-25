/**
 * @file color.ts
 * @description 提供与颜色处理相关的实用工具函数，包括 HEX 和 RGB 转换、颜色加深/变浅、对比度计算等功能。
 * @example
 *  // 判断是否是有效的 HEX 颜色
 *  const isValidHex = isHexColor('#fff000');
 *  console.log(isValidHex); // true
 * @version 1.0.0
 * @date 2024-11-18
 * @author [吴尘](https://github.com/wucunping)
 * @module Color
 */

/**
 * 判断是否是有效的十六进制颜色值.
 * 支持 #fff 或 #ffffff 格式.
 *
 * @param {string} color 十六进制颜色值
 * @returns {boolean} 是否是有效的十六进制颜色
 */
export const isHexColor = (color: string): boolean => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return reg.test(color)
}

/**
 * 将 RGB 颜色值转换为十六进制颜色值.
 * r, g, b 需要在 [0, 255] 范围内.
 *
 * @param {number} r 红色通道值
 * @param {number} g 绿色通道值
 * @param {number} b 蓝色通道值
 * @returns {string} 十六进制颜色值，如 #ff00ff
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

/**
 * 将 HEX 颜色值转换为 RGB 表示.
 *
 * @param {string} hex 十六进制颜色值
 * @param {number} [opacity] 可选的不透明度
 * @returns {string} RGB 或 RGBA 颜色表示
 */
export const hexToRGB = (hex: string, opacity?: number): string => {
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
    return opacity ? `RGBA(${sColorChange.join(',')},${opacity})` : `RGB(${sColorChange.join(',')})`
  }
  return sHex
}

/**
 * 判断颜色是否为深色.
 *
 * @param {string} color 十六进制颜色值
 * @returns {boolean | undefined} 是否为深色
 */
export const colorIsDark = (color: string): boolean | undefined => {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * 加深 HEX 颜色的亮度.
 *
 * @param {string} color HEX 颜色值
 * @param {number} amount 加深的百分比 (0-100)
 * @returns {string} 加深后的 HEX 颜色值
 */
export const darken = (color: string, amount: number): string => {
  color = color.startsWith('#') ? color.slice(1) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.slice(0, 2), amount)}${subtractLight(
    color.slice(2, 4),
    amount
  )}${subtractLight(color.slice(4, 6), amount)}`
}

/**
 * 调亮颜色
 * @param {string} color - 十六进制颜色值 (如: "#ff0000" 或 "ff0000")
 * @param {number} amount - 调亮的百分比 (0-100)
 * @returns {string} - 调亮后的十六进制颜色值
 */
export const lighten = (color: string, amount: number) => {
  // 如果颜色以 "#" 开头，去掉 "#"
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color

  // 计算调亮的数值
  amount = Math.trunc((255 * amount) / 100)

  // 调整颜色值并返回
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`
}

/**
 * 调整单个颜色通道的亮度
 * @param {string} color - 单个颜色通道的十六进制值 (两位)
 * @param {number} amount - 调亮的数值
 * @returns {string} - 调整后的十六进制值
 */
const addLight = (color: string, amount: number) => {
  // 将颜色值转为数字并添加亮度
  const cc = parseInt(color, 16) + amount

  // 如果超过255，取255
  const c = cc > 255 ? 255 : cc

  // 将数字转回十六进制，并确保为两位
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 计算RGB颜色的相对亮度
 * @param {number} r - 红色通道 (0-255)
 * @param {number} g - 绿色通道 (0-255)
 * @param {number} b - 蓝色通道 (0-255)
 * @returns {number} - 相对亮度值
 */
const luminanace = (r: number, g: number, b: number) => {
  // 归一化并计算每个通道的亮度
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  // 返回加权总和
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * 计算两个RGB颜色之间的对比度
 * @param {string} rgb1 - 第一个RGB颜色值 (数组形式)
 * @param {string} rgb2 - 第二个RGB颜色值 (数组形式)
 * @returns {number} - 对比度值
 */
const contrast = (rgb1: string[], rgb2: number[]) => {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}

/**
 * 根据背景颜色，计算最佳的文字颜色 (黑色或白色)
 * @param {string} hexColor - 背景颜色的十六进制值 (如: "#ff0000")
 * @returns {string} - 最佳的文字颜色 (黑色 "#000000" 或白色 "#FFFFFF")
 */
export const calculateBestTextColor = (hexColor: string) => {
  // 将十六进制颜色转换为RGB值
  const rgbColor = hexToRGB(hexColor.substring(1))

  // 计算与黑色的对比度
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  // 如果与黑色的对比度高于阈值，返回黑色，否则返回白色
  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * 减少 HEX 颜色的亮度.
 *
 * @param {string} color HEX 颜色部分 (RR, GG 或 BB)
 * @param {number} amount 减少的值
 * @returns {string} 处理后的 HEX 颜色部分
 */
const subtractLight = (color: string, amount: number): string => {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).padStart(2, '0')
}

/**
 * 混合两个 HEX 颜色值.
 *
 * @param {string} color1 第一个 HEX 颜色值
 * @param {string} color2 第二个 HEX 颜色值
 * @param {number} [weight=0.5] 混合比例 (0-1)
 * @returns {string} 混合后的 HEX 颜色值
 */
export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
  let color = '#'
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.slice(1 + i * 2, 3 + i * 2), 16)
    const c2 = parseInt(color2.slice(1 + i * 2, 3 + i * 2), 16)
    const c = Math.round(c1 * weight + c2 * (1 - weight))
    color += c.toString(16).padStart(2, '0')
  }
  return color
}
