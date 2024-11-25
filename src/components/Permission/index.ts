/**
 * @file /src/components/Permission/index.ts
 * @description Permission 组件的入口文件，导入并导出 Permission 组件和权限验证工具函数
 * @example 使用方式：
 * import { Permission, hasPermi } from '@/components/Permission'
 * @version 1.0.0
 * @date 2024-11-22
 * @module PermissionComponentModuleIndexFile
 * @exports Permission, hasPermi
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Permission 组件
import Permission from './src/Permission.vue'

// 导入权限验证工具函数
import { hasPermi } from './src/utils'

// 导出 Permission 组件和 hasPermi 工具函数
export { Permission, hasPermi }
