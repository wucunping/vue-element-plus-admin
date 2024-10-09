/**
 * @file index.ts
 * @description 该文件用于导入并导出IAgree组件及相关类型
 * @example
 * // 导入IAgree组件
 * import { IAgree } from './index';
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module IAgreeModule
 */

// 导入IAgree组件
import IAgree from './src/IAgree.vue'

// 导出类型LinkItem和IAgreeProps
export type { LinkItem, IAgreeProps } from './src/types'

// 导出IAgree组件
export { IAgree }
