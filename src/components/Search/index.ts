/**
 * @file /src/components/Search/index.ts
 * @description 搜索组件的入口文件，导出搜索组件及相关类型和接口
 * @example
 * import { Search } from '@/components/Search'
 * @version 1.0.0
 * @date 2024-11-22
 * @module SearchComponentModule
 * @exports Search, SearchProps, SearchExpose
 * @see /src/components/Search/src/Search.vue
 * @see /src/components/Form
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入表单的相关类型
import { FormSchema, FormSetProps } from '../Form'

// 引入搜索组件的实现
import Search from './src/Search.vue'

// 导出搜索组件的属性类型
export type { SearchProps } from './src/types'

/** 搜索组件对外暴露的接口定义 */
export interface SearchExpose {
  /** 设置表单的值 */
  setValues: (data: Recordable) => void
  /** 设置组件的属性 */
  setProps: (props: Recordable) => void
  /** 删除表单的指定字段 */
  delSchema: (field: string) => void
  /** 添加新的表单结构 */
  addSchema: (formSchema: FormSchema, index?: number) => void
  /** 更新表单的结构 */
  setSchema: (schemaProps: FormSetProps[]) => void
  /** 获取表单的数据 */
  getFormData: <T = Recordable>() => Promise<T>
}

// 导出搜索组件
export { Search }
