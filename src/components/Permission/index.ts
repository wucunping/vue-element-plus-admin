/**
 * @file index.ts
 * @description 该文件负责导入和导出权限相关的组件和工具函数
 * @example
 * import { Permission, hasPermi } from './index'
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module 权限模块
 */

// 导入 Permission 组件
import Permission from './src/Permission.vue'

// 导入 hasPermi 工具函数
import { hasPermi } from './src/utils'

// 导出 Permission 组件和 hasPermi 函数
export { Permission, hasPermi }
