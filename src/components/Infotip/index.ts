/**
 * @file index.ts
 * @description 入口文件，用于导入和导出 Infotip 组件及相关类型
 * @example
 * // 导入 Infotip 组件并使用
 * import Infotip from './index.ts';
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Infotip
 */

// 导入 Infotip 组件
import Infotip from './src/Infotip.vue'

// 导出 InfoTipSchema 类型
export type { InfoTipSchema } from './src/types'

// 导出导入的 Infotip 组件
export { Infotip }
