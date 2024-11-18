/**
 * @file index.ts
 * @description 权限指令设置
 * @example
 * // 用法示例
 * import { setupPermission } from './index';
 * setupPermission(app);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module permission
 */
import type { App } from 'vue' // 导入 Vue 的 App 类型
import { setupPermissionDirective } from './permission/hasPermi' // 导入权限指令设置方法

/**
 * 设置权限指令
 * @param app - Vue 应用实例
 * 导出指令：v-xxx
 * @methods hasPermi 按钮权限，用法: v-hasPermi
 */
export const setupPermission = (app: App<Element>) => {
  setupPermissionDirective(app) // 调用权限指令设置方法，传入 Vue 应用实例
}
