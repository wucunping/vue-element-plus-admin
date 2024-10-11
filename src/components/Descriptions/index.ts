/**
 * @file index.ts
 * @description 模块入口文件，导入并导出 Descriptions 组件及其类型
 * @example
 * import { Descriptions } from './index'
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module DescriptionsModule
 */

// 从 './src/Descriptions.vue' 文件中导入 Descriptions 组件
import Descriptions from './src/Descriptions.vue'

// 导出类型 DescriptionsSchema，类型定义来自 './src/types' 文件
export type { DescriptionsSchema } from './src/types'

// 导出 Descriptions 组件
export { Descriptions }
