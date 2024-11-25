/**
 * @file /src/components/Qrcode/index.ts
 * @description Qrcode 组件的入口文件，导入并导出 Qrcode 组件及其相关类型
 * @example 使用方式：
 * import { Qrcode, QrcodeLogo } from '@/components/Qrcode'
 * @version 1.0.0
 * @date 2024-11-22
 * @module QrcodeComponentModuleIndexFile
 * @exports Qrcode, QrcodeLogo
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Qrcode 组件
import Qrcode from './src/Qrcode.vue'

// 导出 QrcodeLogo 类型，用于定义二维码 Logo 的配置
export type { QrcodeLogo } from './src/types'

// 导出 Qrcode 组件
export { Qrcode }
