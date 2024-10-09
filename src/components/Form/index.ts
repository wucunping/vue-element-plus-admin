/**
 * @file index.ts
 * @description 该文件是表单组件的入口文件，导入并导出相关类型和组件。
 * @example
 * // 使用示例
 * import { Form, FormExpose } from './index'
 * const formExpose: FormExpose = ...
 * formExpose.setValues({ name: 'John Doe' })
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module 表单组件模块
 */

// 导入 Form 组件
import Form from './src/Form.vue'

// 导入类型定义 FormSchema 和 FormSetProps
import type {
	FormSchema, // 表单的 schema 类型
	FormSetProps // 表单属性类型集合
} from './src/types'

// 导出多个类型定义
export type {
	ComponentNameEnum, // 组件名称枚举
	ComponentName, // 组件名称类型
	InputComponentProps, // 输入组件的属性类型
	AutocompleteComponentProps, // 自动完成组件的属性类型
	InputNumberComponentProps, // 数字输入组件的属性类型
	SelectOption, // 选择框选项类型
	SelectComponentProps, // 选择框组件的属性类型
	SelectV2ComponentProps, // 选择框 V2 组件的属性类型
	CascaderComponentProps, // 级联选择器组件的属性类型
	SwitchComponentProps, // 开关组件的属性类型
	RateComponentProps, // 评分组件的属性类型
	ColorPickerComponentProps, // 颜色选择器组件的属性类型
	TransferComponentProps, // 穿梭框组件的属性类型
	RadioOption, // 单选框选项类型
	RadioGroupComponentProps, // 单选框组组件的属性类型
	RadioButtonComponentProps, // 单选按钮组件的属性类型
	CheckboxOption, // 多选框选项类型
	CheckboxGroupComponentProps, // 多选框组组件的属性类型
	DividerComponentProps, // 分隔线组件的属性类型
	DatePickerComponentProps, // 日期选择器组件的属性类型
	DateTimePickerComponentProps, // 日期时间选择器组件的属性类型
	TimePickerComponentProps, // 时间选择器组件的属性类型
	TimeSelectComponentProps, // 时间选择器选择组件的属性类型
	ColProps, // 列属性类型
	FormSetProps, // 表单属性集合类型
	FormItemProps, // 表单项属性类型
	FormSchema, // 表单 schema 类型
	FormProps, // 表单属性类型
	PlaceholderModel, // 占位符模型类型
	InputPasswordComponentProps, // 密码输入组件的属性类型
	TreeSelectComponentProps // 树形选择器组件的属性类型
} from './src/types'

/** 定义 FormExpose 接口 */
export interface FormExpose {
	/** 设置表单的值
	 * @param data 表单数据对象
	 */
	setValues: (data: Recordable) => void

	/** 设置表单的属性
	 * @param props 表单属性对象
	 */
	setProps: (props: Recordable) => void

	/** 删除表单项的 schema
	 * @param field 表单项的字段名
	 */
	delSchema: (field: string) => void

	/** 添加新的表单项 schema
	 * @param formSchema 表单项 schema
	 * @param index 可选的索引位置
	 */
	addSchema: (formSchema: FormSchema, index?: number) => void

	/** 设置表单的 schema
	 * @param schemaProps 表单属性集合
	 */
	setSchema: (schemaProps: FormSetProps[]) => void

	/** 表单模型数据对象 */
	formModel: Recordable

	/** 获取组件的暴露接口
	 * @param field 字段名
	 * @returns 组件的暴露接口
	 */
	getComponentExpose: (field: string) => any

	/** 获取表单项的暴露接口
	 * @param field 字段名
	 * @returns 表单项的暴露接口
	 */
	getFormItemExpose: (field: string) => any
}

// 导出 Form 组件
export { Form }
