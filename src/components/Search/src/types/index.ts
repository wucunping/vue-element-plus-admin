/**
 * @file index.ts
 * @description 搜索组件的属性定义
 * @example
 * // 使用示例
 * const searchProps: SearchProps = {
 *   schema: [],
 *   isCol: true,
 *   labelWidth: '100px',
 *   layout: 'inline',
 *   buttonPosition: 'left',
 *   showSearch: true,
 *   showReset: false,
 *   showExpand: true,
 *   expandField: 'details',
 *   inline: true,
 *   removeNoValueItem: false,
 *   model: {}
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module SearchProps
 */

// 引入 FormSchema 类型
import type { FormSchema } from '@/components/Form'

// 定义搜索属性的接口
export interface SearchProps {
	/** 表单模式的定义 */
	schema?: FormSchema[] // 表单模式，可选，类型为 FormSchema 数组

	/** 是否为列布局 */
	isCol?: boolean // 布局类型，可选，布尔值（默认：false）

	/** 标签宽度，可以是字符串或者数字 */
	labelWidth?: string | number // 标签宽度，可选（默认：'auto'）

	/** 布局类型：inline 或 bottom */
	layout?: 'inline' | 'bottom' // 布局方式，可选，字符串（默认：'inline'）

	/** 按钮位置：left、right 或 center */
	buttonPosition?: 'left' | 'right' | 'center' // 按钮位置，可选，字符串（默认：'left'）

	/** 是否显示搜索按钮 */
	showSearch?: boolean // 是否显示搜索按钮，可选，布尔值（默认：true）

	/** 是否显示重置按钮 */
	showReset?: boolean // 是否显示重置按钮，可选，布尔值（默认：true）

	/** 是否显示展开按钮 */
	showExpand?: boolean // 是否显示展开按钮，可选，布尔值（默认：false）

	/** 展开字段名称 */
	expandField?: string // 展开字段的名称，可选，字符串（默认：''）

	/** 是否使用行内布局 */
	inline?: boolean // 是否使用行内布局，可选，布尔值（默认：false）

	/** 是否移除无值项 */
	removeNoValueItem?: boolean // 是否移除无值项的配置，可选，布尔值（默认：false）

	/** 数据模型 */
	model?: Recordable // 绑定的数据模型，可选，Recordable 类型
}
