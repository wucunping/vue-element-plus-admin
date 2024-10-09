/**
 * @file componentMap.ts
 * @description 组件映射表，用于将 Element Plus 和自定义组件映射为对应的名称。
 * @example
 * // 使用方式
 * const MyComponent = componentMap['Input']; // 获取 Input 组件
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module ComponentMap
 */

// 导入 Vue 的 Component 类型
import type { Component } from 'vue'

// 导入 Element Plus 组件
// 级联选择器
import { ElCascader } from 'element-plus'
// 多选框组
import { ElCheckboxGroup } from 'element-plus'
// 颜色选择器
import { ElColorPicker } from 'element-plus'
// 日期选择器
import { ElDatePicker } from 'element-plus'
// 输入框
import { ElInput } from 'element-plus'
// 数字输入框
import { ElInputNumber } from 'element-plus'
// 单选框组
import { ElRadioGroup } from 'element-plus'
// 评分组件
import { ElRate } from 'element-plus'
// 下拉选择框
import { ElSelect } from 'element-plus'
// 选择框（V2版本）
import { ElSelectV2 } from 'element-plus'
// 滑块
import { ElSlider } from 'element-plus'
// 开关
import { ElSwitch } from 'element-plus'
// 时间选择器
import { ElTimePicker } from 'element-plus'
// 时间选择
import { ElTimeSelect } from 'element-plus'
// 转移组件
import { ElTransfer } from 'element-plus'
// 自动完成输入框
import { ElAutocomplete } from 'element-plus'
// 分割线组件
import { ElDivider } from 'element-plus'
// 树形选择框
import { ElTreeSelect } from 'element-plus'
// 上传组件
import { ElUpload } from 'element-plus'

// 导入自定义组件
// 密码输入框组件
import { InputPassword } from '@/components/InputPassword'
// 编辑器组件
import { Editor } from '@/components/Editor'
// JSON 编辑器组件
import { JsonEditor } from '@/components/JsonEditor'
// 图标选择器组件
import { IconPicker } from '@/components/IconPicker'
// 同意框组件
import { IAgree } from '@/components/IAgree'
// 导入类型定义
import type { ComponentName } from '../types'

/**
 * 组件映射表
 *
 * @type {Recordable<Component, ComponentName>}
 */
const componentMap: Recordable<Component, ComponentName> = {
	/** 单选框组组件*/
	RadioGroup: ElRadioGroup,
	// 单选框按钮组件
	RadioButton: ElRadioGroup,
	// 多选框组组件
	CheckboxGroup: ElCheckboxGroup,
	// 多选框按钮组件
	CheckboxButton: ElCheckboxGroup,
	// 输入框组件
	Input: ElInput,
	// 自动完成输入框组件
	Autocomplete: ElAutocomplete,
	// 数字输入框组件
	InputNumber: ElInputNumber,
	// 下拉选择框组件
	Select: ElSelect,
	// 级联选择器组件
	Cascader: ElCascader,
	// 开关组件
	Switch: ElSwitch,
	// 滑块组件
	Slider: ElSlider,
	// 时间选择器组件
	TimePicker: ElTimePicker,
	// 日期选择器组件
	DatePicker: ElDatePicker,
	// 评分组件
	Rate: ElRate,
	// 颜色选择器组件
	ColorPicker: ElColorPicker,
	// 转移组件
	Transfer: ElTransfer,
	// 分割线组件
	Divider: ElDivider,
	// 时间选择组件
	TimeSelect: ElTimeSelect,
	// 选择框（V2版本）组件
	SelectV2: ElSelectV2,
	// 密码输入框组件
	InputPassword: InputPassword,
	// 编辑器组件
	Editor: Editor,
	// 树形选择框组件
	TreeSelect: ElTreeSelect,
	// 上传组件
	Upload: ElUpload,
	// JSON 编辑器组件
	JsonEditor: JsonEditor,
	// 图标选择器组件
	IconPicker: IconPicker,
	// 同意框组件
	IAgree: IAgree
}

/** 导出组件映射表 */
export { componentMap }
