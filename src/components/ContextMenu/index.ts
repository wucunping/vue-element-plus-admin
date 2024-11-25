/**
 * @file index.ts
 * @description ContextMenu组件的导出入口文件
 * @version 1.0.0
 * @date 2024-11-21
 * @module ContextMenu
 * @requires element-plus, vue-router
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入ContextMenu组件
import ContextMenu from './src/ContextMenu.vue'
// 引入Element Plus的ElDropdown组件类型
import { ElDropdown } from 'element-plus'
// 引入Vue Router的类型定义
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// 导出ContextMenuSchema类型
export type { ContextMenuSchema } from './src/types'

/** ContextMenu组件的对外暴露接口类型定义 */
export interface ContextMenuExpose {
  /** 菜单组件的引用 */
  elDropdownMenuRef: ComponentRef<typeof ElDropdown>
  /** 当前关联的路由项 */
  tagItem: RouteLocationNormalizedLoaded
}

// 导出ContextMenu组件
export { ContextMenu }
