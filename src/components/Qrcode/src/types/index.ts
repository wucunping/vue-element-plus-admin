/**
 * @file /src/components/Qrcode/src/types/index.ts
 * @description 定义二维码组件的 Logo 配置接口，用于自定义二维码中嵌入的 Logo 样式
 * @example 使用方式：
 * const logoConfig: QrcodeLogo = {
 *   src: 'logo.png',
 *   logoSize: 40,
 *   bgColor: '#ffffff',
 *   borderSize: 10,
 *   crossOrigin: 'anonymous',
 *   borderRadius: 8,
 *   logoRadius: 4,
 * }
 * @version 1.0.0
 * @date 2024-11-22
 * @module QrcodeLogoTypeModule
 * @interface QrcodeLogo
 * @exports QrcodeLogo
 * @author [吴尘](https://github.com/wucunping)
 */

/** 定义二维码 Logo 配置的接口 */
export interface QrcodeLogo {
  /** Logo 的图片路径 */
  src?: string
  /** Logo 的尺寸，单位为像素 */
  logoSize?: number
  /** Logo 背景的颜色 */
  bgColor?: string
  /** Logo 背景边框的大小，单位为像素 */
  borderSize?: number
  /** 设置跨域属性 */
  crossOrigin?: string
  /** Logo 背景的圆角大小，单位为像素 */
  borderRadius?: number
  /** Logo 的圆角大小，单位为像素 */
  logoRadius?: number
}
