/**
 * @file index.ts
 * @description 定义右键菜单组件的类型接口
 * @version 1.0.0
 * @date 2024-11-21
 * @module ContextMenuTypes
 * @requires none
 * @export ContextMenuSchema
 * @author [吴尘](https://github.com/wucunping)
 */

/** 右键菜单项的类型定义 */
export interface ContextMenuSchema {
  /** 是否禁用菜单项 */
  disabled?: boolean
  /** 是否显示分割线 */
  divided?: boolean
  /** 菜单项图标 */
  icon?: string
  /** 菜单项的显示名称 */
  label: string
  /** 菜单项点击时触发的命令 */
  command?: (item: ContextMenuSchema) => void
}
