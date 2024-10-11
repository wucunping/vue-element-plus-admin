/**
 * @file index.ts
 * @description 搜索组件的类型定义和导出
 * @example
 * // 用法示例
 * const searchInstance = new Search();
 * searchInstance.setValues({ key: 'value' });
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Search
 */

// 导入 FormSchema 和 FormSetProps 相关类型
import type { FormSchema, FormSetProps } from '../Form'

// 导入 Search 组件
import Search from './src/Search.vue'

// 导出 SearchProps 类型
export type { SearchProps } from './src/types'

// 定义 SearchExpose 接口
export interface SearchExpose {
	/**
	 * 设置值的方法
	 * @param data - 要设置的值的记录
	 */
	setValues: (data: Recordable) => void

	/**
	 * 设置属性的方法
	 * @param props - 要设置的属性记录
	 */
	setProps: (props: Recordable) => void

	/**
	 * 删除 schema 的方法
	 * @param field - 要删除的字段名称
	 */
	delSchema: (field: string) => void

	/**
	 * 添加 schema 的方法
	 * @param formSchema - 要添加的表单 schema
	 * @param index - 可选的索引位置（默认值为 undefined）
	 */
	addSchema: (formSchema: FormSchema, index?: number) => void

	/**
	 * 设置 schema 的方法
	 * @param schemaProps - 要设置的 schema 属性数组
	 */
	setSchema: (schemaProps: FormSetProps[]) => void

	/**
	 * 获取表单数据的方法
	 * @returns Promise<T> - 返回表单数据的 Promise
	 */
	getFormData: <T = Recordable>() => Promise<T>
}

// 导出 Search 组件
export { Search }
