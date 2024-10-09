/**
 * @file index.ts
 * @description 该文件为图标组件的入口文件，导入并导出相关组件及类型定义。
 * @example
 * // 使用示例
 * import { Icon, IconTypes } from './index'
 * const myIconProps: IconTypes = {
 *     size: 32,
 *     color: 'red',
 *     icon: 'user',
 *     hoverColor: 'blue'
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module 图标组件模块
 */

// 导入 Icon 组件
import Icon from './src/Icon.vue'

// 导入 IconTypes 类型定义
export type { IconTypes } from './src/types'

// 导出 Icon 组件
export { Icon }
