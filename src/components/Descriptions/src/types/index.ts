/**
 * @file index.ts
 * @description Descriptions 组件类型定义，用于描述组件的字段配置和属性
 * @module DescriptionsSchema
 * @version 1.0.0
 * @date 2024-11-21
 * @author [吴尘](https://github.com/wucunping)
 */

/** Descriptions 组件的字段配置类型定义 */
export interface DescriptionsSchema {
  /** 当前字段占用的列数 */
  span?: number
  /** 字段名 */
  field: string
  /** 字段的标签名 */
  label?: string
  /** 字段的宽度 */
  width?: string | number
  /** 字段的最小宽度 */
  minWidth?: string | number
  /** 字段内容的对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 字段标签的对齐方式 */
  labelAlign?: 'left' | 'center' | 'right'
  /** 自定义字段的 CSS 类名 */
  className?: string
  /** 自定义标签的 CSS 类名 */
  labelClassName?: string
  /** 插槽定义 */
  slots?: {
    /** 自定义字段的默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 自定义字段标签的插槽 */
    label?: (...args: any[]) => JSX.Element | null
  }
}
