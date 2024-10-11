/**
 * @file index.ts
 * @description 描述schema的接口
 * @example
 * const example: DescriptionsSchema = {
 *   field: 'name',
 *   label: '姓名'
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module schema
 */

export interface DescriptionsSchema {
	/** 占多少分 */
	span?: number
	/** 字段名 */
	field: string
	/** label名 */
	label?: string
	/** 宽度 */
	width?: string | number
	/** 最小宽度 */
	minWidth?: string | number
	/** 对齐方式 */
	align?: 'left' | 'center' | 'right'
	/** label 对齐方式 */
	labelAlign?: 'left' | 'center' | 'right'
	/** 自定义类名 */
	className?: string
	/** 自定义 label 类名 */
	labelClassName?: string
	/** 插槽设置 */
	slots?: {
		/** 默认插槽 */
		default?: (...args: any[]) => JSX.Element | null
		/** label 插槽 */
		label?: (...args: any[]) => JSX.Element | null
	}
}
