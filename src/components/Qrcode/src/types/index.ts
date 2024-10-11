/**
 * @file index.ts
 * @description 定义二维码 logo 接口
 * @example
 * const logo: QrcodeLogo = {
 *   src: 'logo.png',
 *   logoSize: 50,
 *   bgColor: '#ffffff',
 *   borderSize: 2,
 *   crossOrigin: 'anonymous',
 *   borderRadius: 5,
 *   logoRadius: 10
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module QrcodeLogo
 */

/**
 * 定义一个接口 QrcodeLogo
 */
export interface QrcodeLogo {
	/**
	 * logo 图片的 src 地址
	 * 可选参数
	 */
	src?: string

	/**
	 * logo 图片的大小
	 * 可选参数，单位为像素
	 */
	logoSize?: number

	/**
	 * 二维码背景颜色
	 * 可选参数，格式为十六进制颜色值或 rgb
	 */
	bgColor?: string

	/**
	 * 边框的大小
	 * 可选参数，单位为像素
	 */
	borderSize?: number

	/**
	 * 跨域设置
	 * 可选参数
	 */
	crossOrigin?: string

	/**
	 * 边框的圆角半径
	 * 可选参数，单位为像素
	 */
	borderRadius?: number

	/**
	 * logo 的圆角半径
	 * 可选参数，单位为像素
	 */
	logoRadius?: number
}
