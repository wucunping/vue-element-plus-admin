/**
 * @file 表格组件类型定义文件
 * @description 定义表格组件使用的类型，包括表格列、分页和表格属性等
 * @module TableTypes
 * @example
 * import { TableColumn, Pagination } from '@/components/Table/src/types';
 * const columns: TableColumn[] = [{ field: 'name', label: 'Name' }];
 * @version 1.0.0
 * @date 2024-11-22
 * @author [吴尘](https://github.com/wucunping)
 */

//引入 element-plus 中的表格属性类型
import { TableProps as ElTableProps } from 'element-plus'

/**
 * 表格列配置
 */
export interface TableColumn {
  /** 列字段名称 */
  field: string
  /** 列显示的标题 */
  label?: string
  /** 列的类型（例如：selection, index） */
  type?: string
  /** 是否隐藏该列 */
  hidden?: boolean
  /** 子列配置 */
  children?: TableColumn[]
  /** 插槽配置 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | JSX.Element[] | null
    /** 表头插槽 */
    header?: (...args: any[]) => JSX.Element | null
  }
  /** 索引列的计算函数 */
  index?: number | ((index: number) => number)
  /** 列的唯一键 */
  columnKey?: string
  /** 列的宽度 */
  width?: string | number
  /** 列的最小宽度 */
  minWidth?: string | number
  /** 是否固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 自定义表头渲染函数 */
  renderHeader?: (...args: any[]) => JSX.Element | null
  /** 自定义排序函数 */
  sortMethod?: (...args: any[]) => number
  /** 排序的字段或函数 */
  sortBy?: string | string[] | ((...args: any[]) => string | string[])
  /** 自定义排序顺序 */
  sortOrders?: (string | null)[]
  /** 是否允许调整列宽 */
  resizable?: boolean
  /** 格式化函数 */
  formatter?: (...args: any[]) => any
  /** 是否显示溢出提示 */
  showOverflowTooltip?: boolean
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right'
  /** 列样式类名 */
  className?: string
  /** 表头样式类名 */
  labelClassName?: string
  /** 是否可选择行 */
  selectable?: (...args: any[]) => boolean
  /** 保留选择 */
  reserveSelection?: boolean
  /** 过滤选项 */
  filters?: Array<{ text: string; value: string }>
  /** 过滤器位置 */
  filterPlacement?: string
  /** 是否多选过滤 */
  filterMultiple?: boolean
  /** 过滤函数 */
  filterMethod?: (...args: any[]) => boolean
  /** 过滤值 */
  filteredValue?: string[]
  /** 其它扩展属性 */
  [key: string]: any
}

/**
 * 表格插槽默认参数
 */
export interface TableSlotDefault {
  /** 当前行数据 */
  row: Recordable
  /** 当前列配置 */
  column: TableColumn
  /** 当前行索引 */
  $index: number
  /** 其它扩展属性 */
  [key: string]: any
}

/**
 * 分页配置
 */
export interface Pagination {
  /** 是否小型分页 */
  small?: boolean
  /** 是否显示背景 */
  background?: boolean
  /** 每页条数 */
  pageSize?: number
  /** 默认每页条数 */
  defaultPageSize?: number
  /** 数据总条数 */
  total?: number
  /** 总页数 */
  pageCount?: number
  /** 分页按钮数 */
  pagerCount?: number
  /** 当前页 */
  currentPage?: number
  /** 默认当前页 */
  defaultCurrentPage?: number
  /** 分页布局 */
  layout?: string
  /** 可选择的每页条数 */
  pageSizes?: number[]
  /** 下拉框类名 */
  popperClass?: string
  /** 上一页按钮文本 */
  prevText?: string
  /** 下一页按钮文本 */
  nextText?: string
  /** 是否禁用分页 */
  disabled?: boolean
  /** 是否隐藏单页 */
  hideOnSinglePage?: boolean
}

/**
 * 表格设置属性
 */
export interface TableSetProps {
  /** 属性字段名 */
  field: string
  /** 属性路径 */
  path: string
  /** 属性值 */
  value: any
}

/**
 * 表格属性定义
 */
export interface TableProps extends Omit<Partial<ElTableProps<any[]>>, 'data'> {
  /** 每页条数 */
  pageSize?: number
  /** 当前页 */
  currentPage?: number
  /** 是否显示操作列 */
  showAction?: boolean
  /** 是否显示溢出隐藏提示 */
  showOverflowTooltip?: boolean
  /** 表头配置 */
  columns?: TableColumn[]
  /** 分页配置 */
  pagination?: Pagination | undefined
  /** 是否保留选择项 */
  reserveSelection?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 是否叠加索引 */
  reserveIndex?: boolean
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right'
  /** 图片预览 */
  imagePreview?: string[]
  /** 视频预览 */
  videoPreview?: string[]
  /** 是否支持排序 */
  sortable?: boolean
  /** 表格数据 */
  data?: Recordable
}
