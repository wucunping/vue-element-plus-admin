/**
 * @file componentMap.ts
 * @description 映射表，关联表单组件名称与实际组件
 * @version 1.0.0
 * @date 2024-11-21
 * @module Form
 * @requires 'vue'
 * @requires 'element-plus'
 * @requires '@/components/InputPassword'
 * @requires '@/components/Editor'
 * @requires '@/components/JsonEditor'
 * @requires '@/components/IconPicker'
 * @requires '@/components/IAgree'
 * @requires '../types'
 * @export { componentMap }
 */

// 导入 Vue 的 Component 类型
import type { Component } from 'vue'
// 导入 Element Plus 的表单相关组件
import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider,
  ElTreeSelect,
  ElUpload
} from 'element-plus'
// 导入自定义的表单组件
import { InputPassword } from '@/components/InputPassword'
import { Editor } from '@/components/Editor'
import { JsonEditor } from '@/components/JsonEditor'
import { IconPicker } from '@/components/IconPicker'
import { IAgree } from '@/components/IAgree'
// 导入组件名称的类型定义
import { ComponentName } from '../types'

/**
 * 组件映射表
 * @type {Recordable<Component, ComponentName>}
 * @description 关联表单组件名称与实际组件
 */
const componentMap: Recordable<Component, ComponentName> = {
  // 单选框组
  RadioGroup: ElRadioGroup,
  RadioButton: ElRadioGroup,
  // 多选框组
  CheckboxGroup: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  // 输入框
  Input: ElInput,
  // 自动完成输入框
  Autocomplete: ElAutocomplete,
  // 数字输入框
  InputNumber: ElInputNumber,
  // 下拉选择框
  Select: ElSelect,
  // 级联选择器
  Cascader: ElCascader,
  // 开关
  Switch: ElSwitch,
  // 滑块
  Slider: ElSlider,
  // 时间选择器
  TimePicker: ElTimePicker,
  // 日期选择器
  DatePicker: ElDatePicker,
  // 评分
  Rate: ElRate,
  // 颜色选择器
  ColorPicker: ElColorPicker,
  // 穿梭框
  Transfer: ElTransfer,
  // 分隔符
  Divider: ElDivider,
  // 时间选择下拉框
  TimeSelect: ElTimeSelect,
  // 虚拟化选择框
  SelectV2: ElSelectV2,
  // 密码输入框
  InputPassword: InputPassword,
  // 富文本编辑器
  Editor: Editor,
  // 树形选择框
  TreeSelect: ElTreeSelect,
  // 上传组件
  Upload: ElUpload,
  // JSON 编辑器
  JsonEditor: JsonEditor,
  // 图标选择器
  IconPicker: IconPicker,
  // 同意协议组件
  IAgree: IAgree
}

// 导出组件映射表
export { componentMap }
