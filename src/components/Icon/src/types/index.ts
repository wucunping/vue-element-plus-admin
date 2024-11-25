/**
 * @file index.ts
 * @description 定义 Icon 组件的类型，用于描述图标的属性
 * @version 1.0.0
 * @date 2024-11-22
 * @module IconTypesModule
 * @author [吴尘](https://github.com/wucunping)
 */

/** 定义图标类型的接口 */
export interface IconTypes {
  /** 图标的大小 */
  size?: number
  /** 图标的颜色 */
  color?: string
  /** 图标的名称 */
  icon: string
  /** 图标的悬停颜色 */
  hoverColor?: string
}
