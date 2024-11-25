/**
 * @file index.ts
 * @description Form组件的入口文件，导入和导出Form相关组件及类型定义。
 * @version 1.0.0
 * @date 2024-11-22
 * @module Form
 * @author [吴尘](https://github.com/wucunping)
 */

import Form from './src/Form.vue' // 导入Form组件
import type { FormSchema, FormSetProps } from './src/types' // 导入Form组件的类型定义

// 导出类型定义，用于组件外部调用
export type {
  ComponentNameEnum, // 组件名称枚举类型
  ComponentName, // 组件名称类型
  InputComponentProps, // 输入组件的属性类型
  AutocompleteComponentProps, // 自动完成组件的属性类型
  InputNumberComponentProps, // 数字输入组件的属性类型
  SelectOption, // 下拉选择器的选项类型
  SelectComponentProps, // 下拉选择器组件的属性类型
  SelectV2ComponentProps, // 虚拟滚动选择器组件的属性类型
  CascaderComponentProps, // 级联选择器组件的属性类型
  SwitchComponentProps, // 开关组件的属性类型
  RateComponentProps, // 评分组件的属性类型
  ColorPickerComponentProps, // 颜色选择器组件的属性类型
  TransferComponentProps, // 穿梭框组件的属性类型
  RadioOption, // 单选框选项的类型
  RadioGroupComponentProps, // 单选组组件的属性类型
  RadioButtonComponentProps, // 单选按钮组件的属性类型
  CheckboxOption, // 复选框选项的类型
  CheckboxGroupComponentProps, // 复选框组组件的属性类型
  DividerComponentProps, // 分割线组件的属性类型
  DatePickerComponentProps, // 日期选择器组件的属性类型
  DateTimePickerComponentProps, // 日期时间选择器组件的属性类型
  TimePickerComponentProps, // 时间选择器组件的属性类型
  TimeSelectComponentProps, // 时间选择组件的属性类型
  ColProps, // 栅格属性类型
  FormSetProps, // 表单设置属性类型
  FormItemProps, // 表单项属性类型
  FormSchema, // 表单结构类型
  FormProps, // 表单属性类型
  PlaceholderModel, // 占位符模型类型
  InputPasswordComponentProps, // 密码输入组件的属性类型
  TreeSelectComponentProps // 树形选择器组件的属性类型
} from './src/types'

// 定义Form组件的公共接口，用于暴露组件内部的方法
export interface FormExpose {
  setValues: (data: Recordable) => void // 设置表单值
  setProps: (props: Recordable) => void // 设置表单属性
  delSchema: (field: string) => void // 删除表单结构
  addSchema: (formSchema: FormSchema, index?: number) => void // 添加表单结构
  setSchema: (schemaProps: FormSetProps[]) => void // 设置表单结构
  formModel: Recordable // 表单数据模型
  getComponentExpose: (field: string) => any // 获取组件的实例
  getFormItemExpose: (field: string) => any // 获取表单项的实例
}

// 导出Form组件
export { Form }
