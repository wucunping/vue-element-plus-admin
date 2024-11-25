/**
 * @file index.ts
 * @description 表单组件类型定义，用于统一表单组件中可能用到的所有类型定义
 * @version 1.0.0
 * @date 2024-11-21
 * @module FormTypes
 * @requires 'element-plus' 引入 Element Plus 的组件类型
 * @requires '@wangeditor/editor' 引入 WangEditor 编辑器类型
 * @requires '@/components/JsonEditor' 引入自定义 JSON 编辑器类型
 * @requires '@/components/IAgree' 引入自定义同意条款组件类型
 */

// 引入 Element Plus 提供的组件属性类型和其他依赖
import {
  AutocompleteProps, // 自动完成组件的属性类型定义
  InputNumberProps, // 数字输入框组件的属性类型定义
  CascaderProps, // 级联选择器组件的属性类型定义
  CascaderNode, // 级联选择器节点类型定义
  CascaderValue, // 级联选择器值类型定义
  SwitchProps, // 开关组件的属性类型定义
  ComponentSize, // 组件尺寸大小类型定义
  InputProps, // 输入框组件的属性类型定义
  RateProps, // 评分组件的属性类型定义
  ColorPickerProps, // 颜色选择器组件的属性类型定义
  TransferProps, // 穿梭框组件的属性类型定义
  RadioGroupProps, // 单选组组件的属性类型定义
  RadioButtonProps, // 单选按钮组件的属性类型定义
  CheckboxGroupProps, // 复选框组组件的属性类型定义
  DividerProps, // 分割线组件的属性类型定义
  DatePickerProps, // 日期选择器组件的属性类型定义
  FormItemProps as ElFormItemProps, // 表单项的属性类型定义（重命名为 ElFormItemProps）
  FormProps as ElFormProps, // 表单组件的整体属性类型定义（重命名为 ElFormProps）
  ISelectProps, // 下拉选择器组件的属性类型定义
  UploadProps // 上传组件的属性类型定义
} from 'element-plus'

// 引入其他库的依赖类型定义
import { IEditorConfig } from '@wangeditor/editor' // 富文本编辑器配置的类型定义
import { JsonEditorProps } from '@/components/JsonEditor' // JSON 编辑器的属性类型定义
import { IAgreeProps } from '@/components/IAgree' // 同意协议组件的属性类型定义
import { CSSProperties } from 'vue' // CSS 样式的属性类型定义

/**
 * 定义表单组件的占位符模型
 */
export interface PlaceholderModel {
  /** 通用占位符文本 */
  placeholder?: string
  /** 范围选择器的起始占位符文本 */
  startPlaceholder?: string
  /** 范围选择器的结束占位符文本 */
  endPlaceholder?: string
  /** 范围选择器的分隔符文本 */
  rangeSeparator?: string
}

/**
 * 定义支持的表单组件名称
 */
export enum ComponentNameEnum {
  /** 单选按钮组 */
  RADIO_GROUP = 'RadioGroup',
  /** 单选按钮 */
  RADIO_BUTTON = 'RadioButton',
  /** 多选框组 */
  CHECKBOX_GROUP = 'CheckboxGroup',
  /** 多选框按钮 */
  CHECKBOX_BUTTON = 'CheckboxButton',
  /** 输入框 */
  INPUT = 'Input',
  /** 自动完成输入框 */
  AUTOCOMPLETE = 'Autocomplete',
  /** 数字输入框 */
  INPUT_NUMBER = 'InputNumber',
  /** 下拉选择框 */
  SELECT = 'Select',
  /** 级联选择器 */
  CASCADER = 'Cascader',
  /** 开关组件 */
  SWITCH = 'Switch',
  /** 滑块组件 */
  SLIDER = 'Slider',
  /** 时间选择器 */
  TIME_PICKER = 'TimePicker',
  /** 日期选择器 */
  DATE_PICKER = 'DatePicker',
  /** 评分组件 */
  RATE = 'Rate',
  /** 颜色选择器 */
  COLOR_PICKER = 'ColorPicker',
  /** 穿梭框组件 */
  TRANSFER = 'Transfer',
  /** 分割线组件 */
  DIVIDER = 'Divider',
  /** 时间选择组件 */
  TIME_SELECT = 'TimeSelect',
  /** 虚拟滚动选择器 */
  SELECT_V2 = 'SelectV2',
  /** 密码输入框 */
  INPUT_PASSWORD = 'InputPassword',
  /** 富文本编辑器 */
  EDITOR = 'Editor',
  /** 树形选择器 */
  TREE_SELECT = 'TreeSelect',
  /** 文件上传组件 */
  UPLOAD = 'Upload',
  /** JSON 编辑器 */
  JSON_EDITOR = 'JsonEditor',
  /** 图标选择器 */
  ICON_PICKER = 'IconPicker',
  /** 自定义的同意协议组件 */
  I_AGREE = 'IAgree'
}

/**
 * 定义组件名称的驼峰命名形式
 */
type CamelCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : Capitalize<Lowercase<K>>
    : never
  : never

/**
 * 定义组件名称类型
 */
export type ComponentName = CamelCaseComponentName

/**
 * 定义密码输入框组件的属性类型
 */
export interface InputPasswordComponentProps {
  /** 是否显示密码强度 */
  strength?: boolean
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义输入框组件的属性类型
 */
export interface InputComponentProps extends Partial<InputProps> {
  /** 文本域的行数 */
  rows?: number
  /** 事件绑定 */
  on?: {
    /** 失焦事件处理 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件处理 */
    focus?: (event: FocusEvent) => void
    /** 内容改变事件处理 */
    change?: (value: string | number) => void
    /** 清空内容事件处理 */
    clear?: () => void
    /** 输入事件处理 */
    input?: (value: string | number) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 前缀插槽 */
    prefix?: (...args: any[]) => JSX.Element | null
    /** 后缀插槽 */
    suffix?: (...args: any[]) => JSX.Element | null
    /** 前置插槽 */
    prepend?: (...args: any[]) => JSX.Element | null
    /** 后置插槽 */
    append?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义自动完成组件的属性类型
 */
export interface AutocompleteComponentProps extends Partial<AutocompleteProps> {
  /** 事件绑定 */
  on?: {
    /** 选中事件处理 */
    select?: (item: any) => void
    /** 内容改变事件处理 */
    change?: (value: string | number) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 前缀插槽 */
    prefix?: (...args: any[]) => JSX.Element | null
    /** 后缀插槽 */
    suffix?: (...args: any[]) => JSX.Element | null
    /** 前置插槽 */
    prepend?: (...args: any[]) => JSX.Element | null
    /** 后置插槽 */
    append?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义数字输入框组件的属性类型
 */
export interface InputNumberComponentProps extends Partial<InputNumberProps> {
  /** 事件绑定 */
  on?: {
    /** 内容改变事件处理 */
    change?: (currentValue: number | undefined, oldValue: number | undefined) => void
    /** 失焦事件处理 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件处理 */
    focus?: (event: FocusEvent) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义选择框选项类型
 */
export interface SelectOption {
  /** 选项标签 */
  label?: string
  /** 是否禁用选项 */
  disabled?: boolean
  /** 选项值 */
  value?: any
  /** 选项唯一标识 */
  key?: string | number
  /** 子选项 */
  options?: SelectOption[]
  /** 其他自定义字段 */
  [key: string]: any
}

/**
 * 定义选择框组件的属性类型
 */
export interface SelectComponentProps extends Omit<Partial<ISelectProps>, 'options'> {
  /** 数据源的字段别名 */
  props?: {
    /** 标识字段的别名 */
    key?: string
    /** 值字段的别名 */
    value?: string
    /** 标签字段的别名 */
    label?: string
    /** 子节点字段的别名 */
    children?: string
  }
  /** 事件绑定 */
  on?: {
    /** 选中值改变事件处理 */
    change?: (value: string | number | boolean | Object) => void
    /** 下拉框显示状态改变事件处理 */
    visibleChange?: (visible: boolean) => void
    /** 标签移除事件处理 */
    removeTag?: (tag: any) => void
    /** 清空内容事件处理 */
    clear?: () => void
    /** 失焦事件处理 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件处理 */
    focus?: (event: FocusEvent) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (options: SelectOption[]) => JSX.Element[] | null
    /** 分组选项插槽 */
    optionGroupDefault?: (item: SelectOption) => JSX.Element
    /** 单个选项插槽 */
    optionDefault?: (option: SelectOption) => JSX.Element | null
    /** 前缀插槽 */
    prefix?: (...args: any[]) => JSX.Element | null
    /** 空数据插槽 */
    empty?: (...args: any[]) => JSX.Element | null
  }
  /** 数据选项 */
  options?: SelectOption[]
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 SelectV2 组件的属性类型
 */
export interface SelectV2ComponentProps {
  /** 是否多选 */
  multiple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 数据的键名 */
  valueKey?: string
  /** 组件尺寸 */
  size?: ComponentSize
  /** 是否可清空 */
  clearable?: boolean
  /** 自定义清除图标 */
  clearIcon?: string | JSX.Element | null
  /** 是否折叠 Tag */
  collapseTags?: boolean
  /** 多选时最多可选个数 */
  multipleLimit?: number
  /** 原生 input name 属性 */
  name?: string
  /** 自定义特效样式 */
  effect?: string
  /** 原生 input autocomplete 属性 */
  autocomplete?: string
  /** 占位符 */
  placeholder?: string
  /** 是否可筛选 */
  filterable?: boolean
  /** 是否允许用户创建新条目 */
  allowCreate?: boolean
  /** 多选时是否保留关键字 */
  reserveKeyword?: boolean
  /** 无数据时显示的内容 */
  noDataText?: string
  /** 弹窗的自定义类名 */
  popperClass?: string
  /** 是否将弹出框插入 body 元素 */
  teleported?: boolean
  /** 是否持久化下拉框 */
  persistent?: boolean
  /** 自定义弹出框配置 */
  popperOptions?: any
  /** 是否自动下拉 */
  automaticDropdown?: boolean
  /** 自定义下拉框高度 */
  height?: number
  /** 是否始终显示滚动条 */
  scrollbarAlwaysOn?: boolean
  /** 是否为远程搜索 */
  remote?: boolean
  /** 远程搜索方法 */
  remoteMethod?: (query: string) => void
  /** 是否触发校验 */
  validateEvent?: boolean
  /** 下拉框的弹出位置 */
  placement?: AutocompleteProps['placement']
  /** 折叠的 Tags 是否显示 tooltip */
  collapseTagsTooltip?: boolean
  /** 配置事件的回调函数 */
  on?: {
    /** 值改变时的回调 */
    change?: (value: string | number | boolean | Object) => void
    /** 下拉框可见性变化时的回调 */
    visibleChange?: (visible: boolean) => void
    /** Tag 被删除时的回调 */
    removeTag?: (tag: any) => void
    /** 清空时的回调 */
    clear?: () => void
    /** 失焦时的回调 */
    blur?: (event: FocusEvent) => void
    /** 获焦时的回调 */
    focus?: (event: FocusEvent) => void
  }
  /** 配置下拉选项 */
  options?: SelectOption[]
  /** 配置插槽 */
  slots?: {
    /** 默认插槽 */
    default?: (option: SelectOption) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义级联选择器组件的属性类型
 */
export interface CascaderComponentProps {
  /** 级联选择器选项 */
  options?: Record<string, unknown>[]
  /** 级联选择器的属性配置 */
  props?: CascaderProps
  /** 组件大小 */
  size?: ComponentSize
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否支持清空 */
  clearable?: boolean
  /** 是否显示所有级别的选项 */
  showAllLevels?: boolean
  /** 是否折叠标签 */
  collapseTags?: boolean
  /** 折叠标签时显示的提示 */
  collapseTagsTooltip?: boolean
  /** 选项之间的分隔符 */
  separator?: string
  /** 是否支持搜索 */
  filterable?: boolean
  /** 自定义搜索方法 */
  filterMethod?: (node: CascaderNode, keyword: string) => boolean
  /** 搜索时的防抖延迟 */
  debounce?: number
  /** 过滤前的钩子函数 */
  beforeFilter?: (value: string) => boolean
  /** 自定义弹出层样式类名 */
  popperClass?: string
  /** 是否使用传送 */
  teleported?: boolean
  /** 标签类型 */
  tagType?: ElementPlusInfoType
  /** 是否触发校验 */
  validateEvent?: boolean
  /** 事件绑定 */
  on?: {
    /** 值改变事件处理 */
    change?: (value: CascaderValue) => void
    /** 节点展开事件处理 */
    expandChange?: (value: CascaderValue) => void
    /** 失焦事件处理 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件处理 */
    focus?: (event: FocusEvent) => void
    /** 显示状态改变事件处理 */
    visibleChange?: (value: boolean) => void
    /** 标签移除事件处理 */
    removeTag?: (value: CascaderNode['valueByOption']) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 空数据插槽 */
    empty?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 Switch 组件的属性类型
 */
export interface SwitchComponentProps extends Partial<SwitchProps> {
  /** 事件绑定 */
  on?: {
    /** 值改变事件处理 */
    change?: (value: boolean | string | number) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 Rate 组件的属性类型
 */
export interface RateComponentProps extends Partial<RateProps> {
  /** 事件绑定 */
  on?: {
    /** 值改变事件处理 */
    change?: (value: number) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 ColorPicker 组件的属性类型
 */
export interface ColorPickerComponentProps extends Partial<ColorPickerProps> {
  /** 事件绑定 */
  on?: {
    /** 值改变事件处理 */
    change?: (value: string) => void
    /** 活跃值改变事件处理 */
    activeChange?: (value: string) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 Transfer 组件的属性类型
 */
export interface TransferComponentProps extends Partial<TransferProps> {
  /** 事件绑定 */
  on?: {
    /** 数据变化事件 */
    change?: (
      value: number | string,
      direction: 'left' | 'right',
      movedKeys: string[] | number[]
    ) => void
    /** 左侧数据选中事件 */
    leftCheckChange?: (value: any[]) => void
    /** 右侧数据选中事件 */
    rightCheckChange?: (value: any[]) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 左侧底部插槽 */
    leftFooter?: (...args: any[]) => JSX.Element | null
    /** 右侧底部插槽 */
    rightFooter?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义单选选项类型
 */
export interface RadioOption {
  /** 标签文本 */
  label?: string
  /** 选项值 */
  value?: string | number | boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示边框 */
  border?: boolean
  /** 组件尺寸 */
  size?: ComponentSize
  /** 名称 */
  name?: string
  /** 其他属性 */
  [key: string]: any
}

/**
 * 定义 RadioGroup 组件的属性类型
 */
export interface RadioGroupComponentProps extends Partial<RadioGroupProps> {
  /** 单选选项集合 */
  options?: RadioOption[]
  /** 数据源的字段别名 */
  props?: {
    /** 标签字段别名 */
    label?: string
    /** 值字段别名 */
    value?: string
    /** 禁用字段别名 */
    disabled?: string
  }
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: string | number | boolean) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element[] | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 RadioButton 组件的属性类型
 */
export interface RadioButtonComponentProps extends Partial<RadioButtonProps> {
  /** 单选选项集合 */
  options?: RadioOption[]
  /** 数据源的字段别名 */
  props?: {
    /** 标签字段别名 */
    label?: string
    /** 值字段别名 */
    value?: string
    /** 禁用字段别名 */
    disabled?: string
  }
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: string | number | boolean) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element[] | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义多选框选项类型
 */
export interface CheckboxOption {
  /** 标签文本 */
  label?: string
  /** 选项值 */
  value?: string | number | boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 选中状态的值 */
  trueLabel?: string | number
  /** 未选中状态的值 */
  falseLabel?: string | number
  /** 是否显示边框 */
  border?: boolean
  /** 组件尺寸 */
  size?: ComponentSize
  /** 名称 */
  name?: string
  /** 是否选中 */
  checked?: boolean
  /** 是否显示半选中状态 */
  indeterminate?: boolean
  /** 是否触发校验 */
  validateEvent?: boolean
  /** tabindex 属性 */
  tabindex?: number | string
  /** 唯一标识 */
  id?: string
  /** 是否可被控 */
  controls?: boolean
  /** 其他属性 */
  [key: string]: any
}

/**
 * 定义 CheckboxGroup 组件的属性类型
 */
export interface CheckboxGroupComponentProps extends Partial<CheckboxGroupProps> {
  /** 多选框选项集合 */
  options?: CheckboxOption[]
  /** 数据源的字段别名 */
  props?: {
    /** 标签字段别名 */
    label?: string
    /** 值字段别名 */
    value?: string
    /** 禁用字段别名 */
    disabled?: string
  }
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: string | number | boolean) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element[] | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 Divider 组件的属性类型
 */
export interface DividerComponentProps extends Partial<DividerProps> {
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: number) => void
    /** 输入事件 */
    input?: (value: number) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 DatePicker 组件的属性类型
 */
export interface DatePickerComponentProps extends Partial<DatePickerProps> {
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: string | Date | number | string[]) => void
    /** 失焦事件 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件 */
    focus?: (event: FocusEvent) => void
    /** 日历改变事件 */
    calendarChange?: (val: [Date, Date]) => void
    /** 面板改变事件 */
    panelChange?: (date, mode, view) => void
    /** 可见性改变事件 */
    visibleChange?: (visibility: boolean) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 范围分隔符插槽 */
    rangeSeparator?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 DateTimePicker 组件的属性类型
 */
export interface DateTimePickerComponentProps {
  /** 是否只读 */
  readonly?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 是否支持清空 */
  clearable?: boolean
  /** 组件大小 */
  size?: ComponentSize
  /** 占位符文本 */
  placeholder?: string
  /** 范围选择器的起始占位符文本 */
  startPlaceholder?: string
  /** 范围选择器的结束占位符文本 */
  endPlaceholder?: string
  /** 是否使用箭头控制时间 */
  timeArrowControl?: boolean
  /** 类型 */
  type?: 'year' | 'month' | 'date' | 'datetime' | 'datetimerange' | 'daterange' | 'week'
  /** 格式化字符串 */
  format?: string
  /** 自定义弹出层样式类名 */
  popperClass?: string
  /** 范围分隔符 */
  rangeSeparator?: string
  /** 默认值 */
  defaultValue?: Date | [Date, Date]
  /** 默认时间 */
  defaultTime?: Date | [Date, Date]
  /** 值的格式化 */
  valueFormat?: string
  /** 唯一标识 */
  id?: string
  /** 名称 */
  name?: string
  /** 是否取消面板联动 */
  unlinkPanels?: boolean
  /** 前缀图标 */
  prefixIcon?: string | JSX.Element
  /** 清空图标 */
  clearIcon?: string | JSX.Element
  /** 快捷方式配置 */
  shortcuts?: Array<{ text: string; value: Date | Function }>
  /** 禁用日期函数 */
  disabledDate?: (date: Date) => boolean
  /** 单元格类名 */
  cellClassName?: string | ((date: Date) => string | undefined)
  /** 是否使用传送 */
  teleported?: boolean
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: string | Date | number | string[]) => void
    /** 失焦事件 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件 */
    focus?: (event: FocusEvent) => void
    /** 日历改变事件 */
    calendarChange?: (val: [Date, Date]) => void
    /** 可见性改变事件 */
    visibleChange?: (visibility: boolean) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 范围分隔符插槽 */
    rangeSeparator?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 TimePicker 组件的属性类型
 */
export interface TimePickerComponentProps {
  /** 是否只读 */
  readonly?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 是否支持清空 */
  clearable?: boolean
  /** 组件大小 */
  size?: ComponentSize
  /** 占位符文本 */
  placeholder?: string
  /** 范围选择器的起始占位符文本 */
  startPlaceholder?: string
  /** 范围选择器的结束占位符文本 */
  endPlaceholder?: string
  /** 是否为范围选择器 */
  isRange?: boolean
  /** 是否使用箭头控制时间 */
  arrowControl?: boolean
  /** 自定义弹出层样式类名 */
  popperClass?: string
  /** 范围分隔符 */
  rangeSeparator?: string
  /** 格式化字符串 */
  format?: string
  /** 默认值 */
  defaultValue?: Date | [Date, Date]
  /** 唯一标识 */
  id?: string
  /** 名称 */
  name?: string
  /** 标签 */
  label?: string
  /** 前缀图标 */
  prefixIcon?: string | JSX.Element
  /** 清空图标 */
  clearIcon?: string | JSX.Element
  /** 禁用小时 */
  disabledHours?: (role: string, comparingDate?: any) => number[]
  /** 禁用分钟 */
  disabledMinutes?: (hour: number, role: string, comparingDate?: any) => number[]
  /** 禁用秒 */
  disabledSeconds?: (hour: number, minute: number, role: string, comparingDate?: any) => number[]
  /** 是否使用传送 */
  teleported?: boolean
  /** tabindex 属性 */
  tabindex?: number | string
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change: (
      val: number | string | Date | [number, number] | [string, string] | [Date, Date]
    ) => void
    /** 失焦事件 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件 */
    focus?: (event: FocusEvent) => void
    /** 可见性改变事件 */
    visibleChange?: (visibility: boolean) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 TimeSelect 组件的属性类型
 */
export interface TimeSelectComponentProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 是否支持清空 */
  clearable?: boolean
  /** 组件大小 */
  size?: ComponentSize
  /** 占位符文本 */
  placeholder?: string
  /** 名称 */
  name?: string
  /** 效果 */
  effect?: string
  /** 前缀图标 */
  prefixIcon?: string | JSX.Element
  /** 清空图标 */
  clearIcon?: string | JSX.Element
  /** 起始时间 */
  start?: string
  /** 结束时间 */
  end?: string
  /** 步长 */
  step?: string
  /** 最小时间 */
  minTime?: string
  /** 最大时间 */
  maxTime?: string
  /** 格式化字符串 */
  format?: string
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (val: string) => void
    /** 失焦事件 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件 */
    focus?: (event: FocusEvent) => void
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 Editor 组件的属性类型
 */
export interface EditorComponentProps {
  /** 富文本编辑器配置 */
  editorConfig?: IEditorConfig
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 ColProps 的属性类型
 */
export interface ColProps {
  /** 栅格占位格数 */
  span?: number
  /** <768px 响应式占位格数 */
  xs?: number
  /** ≥768px 响应式占位格数 */
  sm?: number
  /** ≥992px 响应式占位格数 */
  md?: number
  /** ≥1200px 响应式占位格数 */
  lg?: number
  /** ≥1920px 响应式占位格数 */
  xl?: number
  /** 自定义标签 */
  tag?: string
}

/**
 * 定义 FormSetProps 的属性类型
 */
export interface FormSetProps {
  /** 表单字段 */
  field: string
  /** 字段路径 */
  path: string
  /** 字段值 */
  value: any
}

/**
 * 定义 FormItemProps 的属性类型
 */
export interface FormItemProps extends Partial<ElFormItemProps> {
  /** 自定义样式 */
  style?: CSSProperties
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 标签插槽 */
    label?: (...args: any[]) => JSX.Element | null
    /** 错误插槽 */
    error?: (...args: any[]) => JSX.Element | null
  }
}

/**
 * 定义 Upload 组件的属性类型
 */
export interface UploadComponentProps extends Partial<UploadProps> {
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 触发器插槽 */
    trigger?: (...args: any[]) => JSX.Element | null
    /** 提示信息插槽 */
    tip?: (...args: any[]) => JSX.Element | null
    /** 文件展示插槽 */
    file?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 TreeSelect 组件的属性类型
 */
export interface TreeSelectComponentProps
  extends Omit<Partial<SelectComponentProps>, 'props' | 'on' | 'slots'> {
  /** 树形数据 */
  data?: any[]
  /** 无数据时的提示文本 */
  emptyText?: string
  /** 节点的唯一标识 */
  nodeKey?: string
  /** 数据源的字段别名 */
  props?: {
    /** 子节点字段 */
    children?: string
    /** 标签字段 */
    label?: string | ((...args: any[]) => string)
    /** 禁用字段 */
    disabled?: string | ((...args: any[]) => string)
    /** 是否叶子节点字段 */
    isLeaf?: string | ((...args: any[]) => string)
    /** 自定义类名字段 */
    class?: string | ((...args: any[]) => string)
  }
  /** 是否在展开节点后渲染子节点 */
  renderAfterExpand?: boolean
  /** 加载节点数据的函数 */
  load?: (...args: any[]) => Promise<any>
  /** 自定义节点内容渲染函数 */
  renderContent?: (...args: any[]) => JSX.Element | null
  /** 是否高亮当前节点 */
  highlightCurrent?: boolean
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 是否点击节点时展开 */
  expandOnClickNode?: boolean
  /** 是否点击节点时选中 */
  checkOnClickNode?: boolean
  /** 是否自动展开父节点 */
  autoExpandParent?: boolean
  /** 默认展开的节点的 key 集合 */
  defaultExpandedKeys?: any[]
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 是否严格的父子节点选择模式 */
  checkStrictly?: boolean
  /** 默认勾选的节点的 key 集合 */
  defaultCheckedKeys?: any[]
  /** 当前选中节点的 key */
  currentNodeKey?: string | number
  /** 过滤节点方法 */
  filterNodeMethod?: (...args: any[]) => boolean
  /** 是否以手风琴模式展示 */
  accordion?: boolean
  /** 相邻节点间的缩进 */
  indent?: number
  /** 自定义图标 */
  icon?: string | ((...args: any[]) => JSX.Element | null)
  /** 是否懒加载子节点 */
  lazy?: boolean
  /** 是否启用节点拖拽 */
  draggable?: boolean
  /** 拖拽前是否允许拖拽 */
  allowDrag?: (...args: any[]) => boolean
  /** 拖拽后是否允许放置 */
  allowDrop?: (...args: any[]) => boolean
  /** 事件绑定 */
  on?: {
    /** 值改变事件 */
    change?: (value: string | number | boolean | Object) => void
    /** 可见性改变事件 */
    visibleChange?: (visible: boolean) => void
    /** 标签移除事件 */
    removeTag?: (tag: any) => void
    /** 清空事件 */
    clear?: () => void
    /** 失焦事件 */
    blur?: (event: FocusEvent) => void
    /** 获焦事件 */
    focus?: (event: FocusEvent) => void
    /** 节点点击事件 */
    nodeClick?: (...args: any[]) => void
    /** 节点右键菜单事件 */
    nodeContextMenu?: (...args: any[]) => void
    /** 勾选状态改变事件 */
    checkChange?: (...args: any[]) => void
    /** 勾选事件 */
    check?: (...args: any[]) => void
    /** 当前选中节点改变事件 */
    currentChange?: (...args: any[]) => void
    /** 节点展开事件 */
    nodeExpand?: (...args: any[]) => void
    /** 节点收缩事件 */
    nodeCollapse?: (...args: any[]) => void
    /** 拖拽开始事件 */
    nodeDragStart?: (...args: any[]) => void
    /** 拖拽进入节点事件 */
    nodeDragEnter?: (...args: any[]) => void
    /** 拖拽离开节点事件 */
    nodeDragLeave?: (...args: any[]) => void
    /** 拖拽悬停节点事件 */
    nodeDragOver?: (...args: any[]) => void
    /** 拖拽结束事件 */
    nodeDragEnd?: (...args: any[]) => void
    /** 节点放置事件 */
    nodeDrop?: (...args: any[]) => void
  }
  /** 插槽定义 */
  slots?: {
    /** 默认插槽 */
    default?: (...args: any[]) => JSX.Element | null
    /** 分组默认插槽 */
    optionGroupDefault?: (item: SelectOption) => JSX.Element
    /** 选项默认插槽 */
    optionDefault?: (option: SelectOption) => JSX.Element | null
    /** 前缀插槽 */
    prefix?: (...args: any[]) => JSX.Element | null
    /** 空数据插槽 */
    empty?: (...args: any[]) => JSX.Element | null
  }
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 定义 FormSchema 的属性类型
 */
export interface FormSchema {
  /** 唯一标识 */
  field: string
  /** 标题 */
  label?: string
  /** col组件属性 */
  colProps?: ColProps
  /**
   * 表单组件属性，具体可以查看 element-plus 文档
   */
  componentProps?:
    | InputComponentProps
    | AutocompleteComponentProps
    | InputNumberComponentProps
    | SelectComponentProps
    | SelectV2ComponentProps
    | CascaderComponentProps
    | SwitchComponentProps
    | RateComponentProps
    | ColorPickerComponentProps
    | TransferComponentProps
    | RadioGroupComponentProps
    | RadioButtonComponentProps
    | DividerComponentProps
    | DatePickerComponentProps
    | DateTimePickerComponentProps
    | TimePickerComponentProps
    | InputPasswordComponentProps
    | TreeSelectComponentProps
    | UploadComponentProps
    | JsonEditorProps
    | IAgreeProps
    | any
  /**
   * formItem组件属性，具体可以查看 element-plus 文档
   */
  formItemProps?: FormItemProps
  /** 渲染的组件名称 */
  component?: ComponentName
  /** 初始值 */
  value?: any
  /**
   * 是否隐藏，如果为 true，会连同值一同删除，类似 v-if
   */
  remove?: boolean
  /**
   * 样式隐藏，不会把值一同删掉，类似 v-show
   */
  hidden?: boolean
  /** 远程加载下拉项的接口 */
  optionApi?: any
}

/**
 * 定义 FormProps 的属性类型
 */
export interface FormProps extends Partial<ElFormProps> {
  /** 表单 schema 配置数组 */
  schema?: FormSchema[]
  /** 是否以 col 布局 */
  isCol?: boolean
  /** 表单模型数据 */
  model?: Recordable
  /** 是否自动设置占位符 */
  autoSetPlaceholder?: boolean
  /** 是否自定义表单 */
  isCustom?: boolean
  /** 其他扩展属性 */
  [key: string]: any
}
