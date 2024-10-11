/**
 * @file index.ts
 * @description 表格组件的类型定义
 * @example
 * // 使用示例
 * const columns: TableColumn[] = [
 *   { field: 'name', label: '姓名', type: 'string' },
 *   { field: 'age', label: '年龄', type: 'number' }
 * ];
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Table
 */

import type { TableProps as ElTableProps } from 'element-plus' // 导入 Element Plus 表格组件的属性类型

/** 表格列的接口定义 */
export interface TableColumn {
	/** 列字段名 */
	field: string
	/** 列标签名（可选） */
	label?: string
	/** 列类型（可选） */
	type?: string
	/** 是否隐藏此列 */
	hidden?: boolean
	/** 子列（可选） */
	children?: TableColumn[]
	/** 自定义插槽（可选） */
	slots?: {
		/** 默认插槽内容函数（可选） */
		default?: (...args: any[]) => JSX.Element | JSX.Element[] | null
		/** 表头插槽内容函数（可选） */
		header?: (...args: any[]) => JSX.Element | null
	}
	/** 列索引（可选，可为数字或函数） */
	index?: number | ((index: number) => number)
	/** 列的关键字（可选） */
	columnKey?: string
	/** 列宽度（可选） */
	width?: string | number
	/** 列最小宽度（可选） */
	minWidth?: string | number
	/** 列是否固定（可选） */
	fixed?: boolean | 'left' | 'right'
	/** 自定义表头渲染函数（可选） */
	renderHeader?: (...args: any[]) => JSX.Element | null
	/** 是否可排序（已注释） */
	// sortable?: boolean
	/** 自定义排序方法函数（可选） */
	sortMethod?: (...args: any[]) => number
	/** 自定义排序依据（可选） */
	sortBy?: string | string[] | ((...args: any[]) => string | string[])
	/** 排序顺序（可选） */
	sortOrders?: (string | null)[]
	/** 列是否可调整大小（可选） */
	resizable?: boolean
	/** 格式化函数（可选） */
	formatter?: (...args: any[]) => any
	/** 是否显示超出提示工具（可选） */
	showOverflowTooltip?: boolean
	/** 列对齐方式（可选） */
	align?: 'left' | 'center' | 'right'
	/** 表头对齐方式（可选） */
	headerAlign?: 'left' | 'center' | 'right'
	/** 列自定义样式类名（可选） */
	className?: string
	/** 列标签自定义样式类名（可选） */
	labelClassName?: string
	/** 是否可选的函数（可选） */
	selectable?: (...args: any[]) => boolean
	/** 保留选中状态（可选） */
	reserveSelection?: boolean
	/** 过滤器数组（可选） */
	filters?: Array<{ text: string; value: string }>
	/** 过滤器显示位置（可选） */
	filterPlacement?: string
	/** 是否支持多选过滤（可选） */
	filterMultiple?: boolean
	/** 自定义过滤方法函数（可选） */
	filterMethod?: (...args: any[]) => boolean
	/** 已应用的过滤值（可选） */
	filteredValue?: string[]
	/** 其他任意属性 */
	[key: string]: any
}

/** 表格插槽默认参数的接口定义 */
export interface TableSlotDefault {
	/** 当前行的数据记录 */
	row: Recordable
	/** 当前列的列定义 */
	column: TableColumn
	/** 当前行的索引 */
	$index: number
	/** 其他任意属性 */
	[key: string]: any
}

/** 分页的接口定义 */
export interface Pagination {
	/** 是否为小型分页（可选） */
	small?: boolean
	/** 是否有背景（可选） */
	background?: boolean
	/** 每页显示的条数（可选） */
	pageSize?: number
	/** 默认每页显示的条数（可选） */
	defaultPageSize?: number
	/** 总记录数（可选） */
	total?: number
	/** 总页数（可选） */
	pageCount?: number
	/** 显示的页码数量（可选） */
	pagerCount?: number
	/** 当前页码（可选） */
	currentPage?: number
	/** 默认当前页码（可选） */
	defaultCurrentPage?: number
	/** 布局方式（可选） */
	layout?: string
	/** 每页显示条数的选择列表（可选） */
	pageSizes?: number[]
	/** 弹出框的自定义类名（可选） */
	popperClass?: string
	/** 上一页按钮文本（可选） */
	prevText?: string
	/** 下一页按钮文本（可选） */
	nextText?: string
	/** 是否禁用分页（可选） */
	disabled?: boolean
	/** 单页时是否隐藏分页（可选） */
	hideOnSinglePage?: boolean
}

/** 表格设置属性的接口定义 */
export interface TableSetProps {
	/** 设置的字段名 */
	field: string
	/** 路径 */
	path: string
	/** 要设置的值 */
	value: any
}

/** 表格组件的属性接口定义 */
export interface TableProps extends Omit<Partial<ElTableProps<any[]>>, 'data'> {
	/** 每页显示的条数（可选） */
	pageSize?: number
	/** 当前页码（可选） */
	currentPage?: number
	/** 是否显示操作按钮（可选） */
	showAction?: boolean
	/** 是否显示超出提示工具（可选） */
	showOverflowTooltip?: boolean
	/** 列定义数组（可选） */
	columns?: TableColumn[]
	/** 分页设置（可选） */
	pagination?: Pagination | undefined
	/** 是否保留选中状态（可选） */
	reserveSelection?: boolean
	/** 是否正在加载（可选） */
	loading?: boolean
	/** 是否保留索引（可选） */
	reserveIndex?: boolean
	/** 列对齐方式（可选） */
	align?: 'left' | 'center' | 'right'
	/** 表头对齐方式（可选） */
	headerAlign?: 'left' | 'center' | 'right'
	/** 图片预览链接数组（可选） */
	imagePreview?: string[]
	/** 视频预览链接数组（可选） */
	videoPreview?: string[]
	/** 是否可排序（可选） */
	sortable?: boolean
	/** 表格数据（可选） */
	data?: Recordable
}
