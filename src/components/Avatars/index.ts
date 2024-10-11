/**
 * @file index.ts
 * @description 该文件用于导入和导出 Avatars 组件以及相关类型
 * @example
 * // 导入 Avatars 组件
 * import { Avatars } from './index'
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module AvatarsModule
 */

// 导入 Avatars 组件
import Avatars from './src/Avatars.vue'

// 导出 AvatarItem 类型
export type { AvatarItem } from './src/types'

// 导出 Avatars 组件
export { Avatars }
