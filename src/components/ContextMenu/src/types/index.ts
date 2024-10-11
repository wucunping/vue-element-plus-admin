/**
 * @file index.ts
 * @description 上下文菜单的接口定义
 * @example
 * const menuItem: ContextMenuSchema = {
 *   label: '复制',
 *   command: (item) => {
 *     console.log(item.label);
 *   }
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ContextMenu
 */

/** 定义上下文菜单的模式接口 */
export interface ContextMenuSchema {
	/** 是否禁用菜单项 */
	disabled?: boolean
	/** 菜单项是否分隔 */
	divided?: boolean
	/** 菜单项的图标 */
	icon?: string
	/** 菜单项的标签，必填 */
	label: string
	/** 执行命令的函数，参数为当前菜单项 */
	command?: (item: ContextMenuSchema) => void
}
