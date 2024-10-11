/**
 * @file index.ts
 * @description 上下文菜单组件的导入和类型定义
 * @example
 * const item: ContextMenuExpose = {
 *   elDropdownMenuRef: someRef,
 *   tagItem: someRoute,
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ContextMenu
 */

/** 导入上下文菜单组件 */
import ContextMenu from './src/ContextMenu.vue'

/** 导入 Element Plus 的下拉菜单组件 */
import { ElDropdown } from 'element-plus'

/** 导入 Vue Router 中的路由类型 */
import type { RouteLocationNormalizedLoaded } from 'vue-router'

/** 导出 ContextMenuSchema 类型，以便其他模块使用 */
export type { ContextMenuSchema } from './src/types'

/** 定义上下文菜单的暴露接口 */
export interface ContextMenuExpose {
	/** 参考 Element Plus 的下拉菜单组件 */
	elDropdownMenuRef: ComponentRef<typeof ElDropdown>
	/** 当前选中的路由项 */
	tagItem: RouteLocationNormalizedLoaded
}

/** 导出上下文菜单组件 */
export { ContextMenu }
