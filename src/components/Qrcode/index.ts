/**
 * @file index.ts
 * @description 包含二维码组件的导入和类型定义的模块
 * @example
 * // 导入 Qrcode 组件
 * import { Qrcode } from './index'
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module QrcodeModule
 */

// 导入 Qrcode 组件，来自于 src/Qrcode.vue 文件
import Qrcode from './src/Qrcode.vue'

// 导出 QrcodeLogo 类型，来自于 src/types 文件
export type { QrcodeLogo } from './src/types'

// 导出 Qrcode 组件
export { Qrcode }
