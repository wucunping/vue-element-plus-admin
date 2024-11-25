/**
 * @file index.ts
 * @description 表格组件的导入导出入口文件，包含组件和类型的定义与导出
 * @example
 * import { Table } from '@/components/Table'
 * @version 1.0.0
 * @date 2024-11-22
 * @module src/components/Table/index.ts
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Table 组件
import Table from './src/Table.vue'

// 从 element-plus 导入表格组件
import { ElTable } from 'element-plus'

// 导入表格类型定义
import { TableColumn, TableSetProps } from './src/types'

// 导出表格类型定义
export type {
  TableColumn, // 表格列配置类型
  TableSlotDefault, // 表格插槽默认类型
  Pagination, // 分页配置类型
  TableSetProps, // 表格列设置类型
  TableProps // 表格属性类型
} from './src/types'

/** 表格暴露的接口 */
export interface TableExpose {
  /** 设置表格属性的方法 */
  setProps: (props: Recordable) => void
  /** 设置列属性的方法 */
  setColumn: (columnProps: TableSetProps[]) => void
  /** 添加列的方法 */
  addColumn: (column: TableColumn, index?: number) => void
  /** 删除列的方法 */
  delColumn: (field: string) => void
  /** 表格组件的引用 */
  elTableRef: ComponentRef<typeof ElTable>
}

// 导出 Table 组件
export { Table }
