/**
 * @file index.ts
 * @description 表格组件模块
 * @example
 * import { Table } from 'your-module-path';
 * const myTable = new Table();
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Table
 */

// 导入 Table 组件
import Table from './src/Table.vue'

// 导入 Element Plus 中的 ElTable 组件
import { ElTable } from 'element-plus'

// 导入类型定义
import type { TableColumn, TableSetProps } from './src/types'

// 导出类型定义
export type {
	TableColumn, // 表格列类型
	TableSlotDefault, // 表格插槽默认类型
	Pagination, // 分页类型
	TableSetProps, // 表格设置属性类型
	TableProps // 表格属性类型
} from './src/types'

// 定义表格接口
export interface TableExpose {
	/**
	 * 设置表格属性
	 * @param props 需要设置的属性，类型为 Recordable
	 */
	setProps: (props: Recordable) => void

	/**
	 * 设置表格列
	 * @param columnProps 表格列属性数组，类型为 TableSetProps[]
	 */
	setColumn: (columnProps: TableSetProps[]) => void

	/**
	 * 添加一列到表格
	 * @param column 要添加的列，类型为 TableColumn
	 * @param index 列的索引，可选，类型为 number
	 */
	addColumn: (column: TableColumn, index?: number) => void

	/**
	 * 删除指定字段的列
	 * @param field 要删除列的字段名，类型为 string
	 */
	delColumn: (field: string) => void

	// Element Plus 的 ElTable 组件的引用
	elTableRef: ComponentRef<typeof ElTable>
}

// 导出 Table 组件
export { Table }
