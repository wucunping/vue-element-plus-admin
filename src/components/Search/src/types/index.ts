/**
 * @file /src/components/Search/src/types/index.ts
 * @description 定义 Search 组件的属性类型接口，用于描述搜索表单的配置项和行为
 * @example 使用方式：
 * const searchProps: SearchProps = {
 *   schema: [{ field: 'name', label: 'Name', component: 'Input' }],
 *   isCol: true,
 *   labelWidth: '100px',
 *   layout: 'inline',
 *   buttonPosition: 'right',
 *   showSearch: true,
 *   showReset: true,
 *   model: { name: '' },
 * }
 * @version 1.0.0
 * @date 2024-11-22
 * @module SearchComponentTypesModule
 * @exports SearchProps
 * @exports FormSchema
 * @see /src/components/Form
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 FormSchema 类型，用于描述表单字段的配置项
import { FormSchema } from '@/components/Form'

/**
 * Search 组件的属性类型接口
 */
export interface SearchProps {
  /** 搜索表单的字段配置数组 */
  schema?: FormSchema[]
  /** 是否使用栅格布局 */
  isCol?: boolean
  /** 标签的宽度，支持像素值或百分比 */
  labelWidth?: string | number
  /** 布局方式，支持 'inline'（行内布局）和 'bottom'（按钮置底） */
  layout?: 'inline' | 'bottom'
  /** 按钮的位置，支持 'left'（左侧）、'right'（右侧）和 'center'（居中） */
  buttonPosition?: 'left' | 'right' | 'center'
  /** 是否显示搜索按钮 */
  showSearch?: boolean
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 是否显示展开按钮 */
  showExpand?: boolean
  /** 展开/收起按钮绑定的字段名称 */
  expandField?: string
  /** 是否为行内模式 */
  inline?: boolean
  /** 是否移除值为空的字段 */
  removeNoValueItem?: boolean
  /** 搜索表单绑定的模型数据 */
  model?: Recordable
}
