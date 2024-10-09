/**
 * @file index.ts
 * @description 该文件定义了各种组件的属性接口，包括表单、输入框、选择器等的详细类型说明。
 * @example
 * // 使用 FormProps 接口
 * const formProps: FormProps = {
 *   schema: [
 *     {
 *       field: 'username',
 *       label: '用户名',
 *       component: 'Input',
 *       componentProps: {
 *         placeholder: '请输入用户名'
 *       }
 *     }
 *   ],
 *   isCol: true,
 *   model: {
 *     username: ''
 *   },
 *   autoSetPlaceholder: true
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module 表单组件属性接口模块
 */

// 导入 Element Plus 组件及其类型定义
import type {
	AutocompleteProps, // 自动完成功能的属性
	InputNumberProps, // 输入框数字的属性
	CascaderProps, // 级联选择器的属性
	CascaderNode, // 级联节点
	CascaderValue, // 级联值
	SwitchProps, // 开关的属性
	ComponentSize, // 组件大小
	InputProps, // 输入框的属性
	RateProps, // 评分的属性
	ColorPickerProps, // 颜色选择器的属性
	TransferProps, // 移动组件的属性
	RadioGroupProps, // 单选框组的属性
	RadioButtonProps, // 单选按钮的属性
	CheckboxGroupProps, // 多选框组的属性
	DividerProps, // 分隔符的属性
	DatePickerProps, // 日期选择器的属性
	FormItemProps as ElFormItemProps, // 表单项的属性，重命名为 ElFormItemProps
	FormProps as ElFormProps, // 表单的属性，重命名为 ElFormProps
	ISelectProps, // 选择框的属性
	UploadProps // 上传组件的属性
} from 'element-plus'

// 导入编辑器配置接口
import type { IEditorConfig } from '@wangeditor/editor'
// 导入 JSON 编辑器组件的属性类型
import type { JsonEditorProps } from '@/components/JsonEditor'
// 导入 IAgree 组件的属性类型
import type { IAgreeProps } from '@/components/IAgree'
// 导入 CSS 样式属性类型
import type { CSSProperties } from 'vue'
import 'vue/jsx' //显式导入 JSX 命名空间

/** 定义占位符模型接口 */
export interface PlaceholderModel {
	/** 普通占位符 */
	placeholder?: string
	/** 开始占位符 */
	startPlaceholder?: string
	/** 结束占位符 */
	endPlaceholder?: string
	/** 范围分隔符 */
	rangeSeparator?: string
}

/** 定义组件名称枚举 */
export enum ComponentNameEnum {
	/** 单选框组 */
	RADIO_GROUP = 'RadioGroup',
	/** 单选按钮 */
	RADIO_BUTTON = 'RadioButton',
	/** 多选框组 */
	CHECKBOX_GROUP = 'CheckboxGroup',
	/** 多选按钮 */
	CHECKBOX_BUTTON = 'CheckboxButton',
	/** 输入框 */
	INPUT = 'Input',
	/** 自动完成 */
	AUTOCOMPLETE = 'Autocomplete',
	/** 输入数字 */
	INPUT_NUMBER = 'InputNumber',
	/** 选择框 */
	SELECT = 'Select',
	/** 级联选择器 */
	CASCADER = 'Cascader',
	/** 开关 */
	SWITCH = 'Switch',
	/** 滑块 */
	SLIDER = 'Slider',
	/** 时间选择器 */
	TIME_PICKER = 'TimePicker',
	/** 日期选择器 */
	DATE_PICKER = 'DatePicker',
	/** 评分 */
	RATE = 'Rate',
	/** 颜色选择器 */
	COLOR_PICKER = 'ColorPicker',
	/** 转移组件 */
	TRANSFER = 'Transfer',
	/** 分隔符 */
	DIVIDER = 'Divider',
	/** 时间选择 */
	TIME_SELECT = 'TimeSelect',
	/** 选择框 V2 */
	SELECT_V2 = 'SelectV2',
	/** 密码输入框 */
	INPUT_PASSWORD = 'InputPassword',
	/** 编辑器 */
	EDITOR = 'Editor',
	/** 树选择 */
	TREE_SELECT = 'TreeSelect',
	/** 上传 */
	UPLOAD = 'Upload',
	/** JSON 编辑器 */
	JSON_EDITOR = 'JsonEditor',
	/** 图标选择器 */
	ICON_PICKER = 'IconPicker',
	/** 同意框 */
	I_AGREE = 'IAgree'
}

/**
 * CamelCaseComponentName 类型用于根据 ComponentNameEnum 中的键创建一个驼峰命名的字符串类型。
 */
type CamelCaseComponentName = keyof typeof ComponentNameEnum extends infer K
	? K extends string
		? K extends `${infer A}_${infer B}`
			? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
			: Capitalize<Lowercase<K>>
		: never
	: never

/**
 * ComponentName 类型为 CamelCaseComponentName 类型。
 */
export type ComponentName = CamelCaseComponentName

/**
 * InputPasswordComponentProps 接口定义了输入密码组件的属性。
 */
export interface InputPasswordComponentProps {
	/** strength 属性可选，表示是否显示强度指示器。 */
	strength?: boolean

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * InputComponentProps 接口扩展了输入属性，定义了输入组件的属性。
 */
export interface InputComponentProps extends Partial<InputProps> {
	/** rows 属性可选，表示输入区域的行数。 */
	rows?: number

	/** on 属性可选，定义了输入事件的回调函数。 */
	on?: {
		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void
		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void
		/** change 事件的回调函数，接收字符串或数字类型的值。 */
		change?: (value: string | number) => void
		/** clear 事件的回调函数，无参数。 */
		clear?: () => void
		/** input 事件的回调函数，接收字符串或数字类型的值。 */
		input?: (value: string | number) => void
	}

	/** slots 属性可选，定义了插槽组件。 */
	slots?: {
		/** prefix 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		prefix?: (...args: any[]) => JSX.Element | null
		/** suffix 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		suffix?: (...args: any[]) => JSX.Element | null
		/** prepend 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		prepend?: (...args: any[]) => JSX.Element | null
		/** append 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		append?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * AutocompleteComponentProps 接口扩展了自动完成的属性，定义了自动完成组件的属性。
 */
export interface AutocompleteComponentProps extends Partial<AutocompleteProps> {
	/** on 属性可选，定义了自动完成事件的回调函数。 */
	on?: {
		/** select 事件的回调函数，接收选中的项目。 */
		select?: (item: any) => void
		/** change 事件的回调函数，接收字符串或数字类型的值。 */
		change?: (value: string | number) => void
	}

	/** slots 属性可选，定义了插槽组件。 */
	slots?: {
		/** default 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null
		/** prefix 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		prefix?: (...args: any[]) => JSX.Element | null
		/** suffix 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		suffix?: (...args: any[]) => JSX.Element | null
		/** prepend 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		prepend?: (...args: any[]) => JSX.Element | null
		/** append 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		append?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * InputNumberComponentProps 接口扩展了输入数字的属性，定义了输入数字组件的属性。
 */
export interface InputNumberComponentProps extends Partial<InputNumberProps> {
	/** on 属性可选，定义了输入事件的回调函数。 */
	on?: {
		/** change 事件的回调函数，接收当前值和旧值。 */
		change?: (currentValue: number | undefined, oldValue: number | undefined) => void
		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void
		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * SelectOption 接口定义了选择项的属性。
 */
export interface SelectOption {
	/** label 属性可选，表示选择项的标签。 */
	label?: string

	/** disabled 属性可选，表示选择项是否禁用。 */
	disabled?: boolean

	/** value 属性可选，表示选择项的值。 */
	value?: any

	/** key 属性可选，表示选择项的唯一标识。 */
	key?: string | number

	/** options 属性可选，表示子选择项。 */
	options?: SelectOption[]

	/** 允许任意其他属性。 */
	[key: string]: any
}

/**
 * SelectComponentProps 接口定义了选择组件的属性，继承了 ISelectProps 的部分属性，但排除了 options。
 */
export interface SelectComponentProps extends Omit<Partial<ISelectProps>, 'options'> {
	/** props 是数据源的字段别名，可以包含 key、value、label 和 children。 */
	props?: {
		/** key 属性可选，表示选择项的唯一标识。 */
		key?: string

		/** value 属性可选，表示选择项的值。 */
		value?: string

		/** label 属性可选，表示选择项的标签。 */
		label?: string

		/** children 属性可选，表示选择项的子项。 */
		children?: string
	}

	/** on 属性定义了选择组件的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: string | number | boolean | object) => void

		/** visibleChange 事件的回调函数，接收一个布尔值表示可见性变化。 */
		visibleChange?: (visible: boolean) => void

		/** removeTag 事件的回调函数，接收被移除的标签。 */
		removeTag?: (tag: any) => void

		/** clear 事件的回调函数，无参数。 */
		clear?: () => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void
	}

	/** slots 属性定义了插槽组件。 */
	slots?: {
		/** default 插槽，接收选择项数组，返回 JSX.Element 数组或 null。 */
		default?: (options: SelectOption[]) => JSX.Element[] | null

		/** optionGroupDefault 插槽，接收选择项，返回 JSX.Element。 */
		optionGroupDefault?: (item: SelectOption) => JSX.Element

		/** optionDefault 插槽，接收选择项，返回 JSX.Element 或 null。 */
		optionDefault?: (option: SelectOption) => JSX.Element | null

		/** prefix 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		prefix?: (...args: any[]) => JSX.Element | null

		/** empty 插槽，可接收任意参数，返回 JSX.Element 或 null。 */
		empty?: (...args: any[]) => JSX.Element | null
	}

	/** options 属性可选，表示选择项的数组。 */
	options?: SelectOption[]

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * SelectV2ComponentProps 接口定义了增强版选择组件的属性。
 */
export interface SelectV2ComponentProps {
	/** multiple 属性可选，表示是否支持多选。 */
	multiple?: boolean

	/** disabled 属性可选，表示组件是否禁用。 */
	disabled?: boolean

	/** valueKey 属性可选，表示值的键名称。 */
	valueKey?: string

	/** size 属性可选，表示组件的大小。 */
	size?: ComponentSize

	/** clearable 属性可选，表示是否可清空选择。 */
	clearable?: boolean

	/** clearIcon 属性可选，表示清空图标。 */
	clearIcon?: string | JSX.Element | null

	/** collapseTags 属性可选，表示是否折叠标签。 */
	collapseTags?: boolean

	/** multipleLimit 属性可选，表示多选时的限制数量。 */
	multipleLimit?: number

	/** name 属性可选，表示组件的名称。 */
	name?: string

	/** effect 属性可选，表示组件的效果。 */
	effect?: string

	/** autocomplete 属性可选，表示组件的自动完成类型。 */
	autocomplete?: string

	/** placeholder 属性可选，表示占位符文本。 */
	placeholder?: string

	/** filterable 属性可选，表示是否支持过滤。 */
	filterable?: boolean

	/** allowCreate 属性可选，表示是否允许创建新选项。 */
	allowCreate?: boolean

	/** reserveKeyword 属性可选，表示是否保留关键字。 */
	reserveKeyword?: boolean

	/** noDataText 属性可选，表示无数据时的提示文本。 */
	noDataText?: string

	/** popperClass 属性可选，表示弹出层的类名。 */
	popperClass?: string

	/** teleported 属性可选，表示是否进行传送。 */
	teleported?: boolean

	/** persistent 属性可选，表示是否保持弹出层的持久状态。 */
	persistent?: boolean

	/** popperOptions 属性可选，表示弹出层的选项。 */
	popperOptions?: any

	/** automaticDropdown 属性可选，表示是否自动下拉。 */
	automaticDropdown?: boolean

	/** height 属性可选，表示组件的高度。 */
	height?: number

	/** scrollbarAlwaysOn 属性可选，表示滚动条是否始终显示。 */
	scrollbarAlwaysOn?: boolean

	/** remote 属性可选，表示是否支持远程查询。 */
	remote?: boolean

	/** remoteMethod 属性可选，表示远程查询的方法。 */
	remoteMethod?: (query: string) => void

	/** validateEvent 属性可选，表示事件是否验证。 */
	validateEvent?: boolean

	/** placement 属性可选，表示弹出层的位置。 */
	placement?: AutocompleteProps['placement']

	/** collapseTagsTooltip 属性可选，表示是否显示折叠标签的提示。 */
	collapseTagsTooltip?: boolean

	/** on 属性定义了选择组件的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: string | number | boolean | object) => void

		/** visibleChange 事件的回调函数，接收一个布尔值表示可见性变化。 */
		visibleChange?: (visible: boolean) => void

		/** removeTag 事件的回调函数，接收被移除的标签。 */
		removeTag?: (tag: any) => void

		/** clear 事件的回调函数，无参数。 */
		clear?: () => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void
	}

	/** options 属性可选，表示选择项的数组。 */
	options?: SelectOption[]

	/** slots 属性定义了插槽组件。 */
	slots?: {
		/** default 插槽，接收选择项，返回 JSX.Element 或 null。 */
		default?: (option: SelectOption) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * CascaderComponentProps 接口定义了级联选择组件的属性。
 */
export interface CascaderComponentProps {
	/** options 属性可选，表示级联选择的数据源，类型为 Record<string, unknown>[]。 */
	options?: Record<string, unknown>[]

	/** props 属性可选，表示级联选择组件的具体属性。 */
	props?: CascaderProps

	/** size 属性可选，表示组件的大小。 */
	size?: ComponentSize

	/** placeholder 属性可选，表示组件的占位符文本。 */
	placeholder?: string

	/** disabled 属性可选，表示组件是否禁用。 */
	disabled?: boolean

	/** clearable 属性可选，表示是否支持清空操作。 */
	clearable?: boolean

	/** showAllLevels 属性可选，表示是否显示所有层级。 */
	showAllLevels?: boolean

	/** collapseTags 属性可选，表示是否折叠标签。 */
	collapseTags?: boolean

	/** collapseTagsTooltip 属性可选，表示折叠标签的提示是否显示。 */
	collapseTagsTooltip?: boolean

	/** separator 属性可选，表示级联选项之间的分隔符。 */
	separator?: string

	/** filterable 属性可选，表示是否支持过滤功能。 */
	filterable?: boolean

	/** filterMethod 属性可选，定义过滤方法，接收节点和关键词，返回布尔值。 */
	filterMethod?: (node: CascaderNode, keyword: string) => boolean

	/** debounce 属性可选，表示防抖时间（以毫秒为单位）。 */
	debounce?: number

	/** beforeFilter 属性可选，接收过滤值并返回布尔值以决定是否进行过滤。 */
	beforeFilter?: (value: string) => boolean

	/** popperClass 属性可选，表示弹出层的类名。 */
	popperClass?: string

	/** teleported 属性可选，实际显示弹出元素的方式，可以进行DOM传送。 */
	teleported?: boolean

	/** tagType 属性可选，表示标签类型，其值为 ElementPlusInfoType 类型。 */
	tagType?: ElementPlusInfoType

	/** validateEvent 属性可选，表示事件是否需要被验证。 */
	validateEvent?: boolean

	/** on 属性定义了级联选择组件的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收选择的值。 */
		change?: (value: CascaderValue) => void

		/** expandChange 事件的回调函数，接收展开的值。 */
		expandChange?: (value: CascaderValue) => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void

		/** visibleChange 事件的回调函数，接收可见性变化的布尔值。 */
		visibleChange?: (value: boolean) => void

		/** removeTag 事件的回调函数，接收被移除的标签。 */
		removeTag?: (value: CascaderNode['valueByOption']) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** empty 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		empty?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * SwitchComponentProps 接口定义了开关组件的属性，扩展了基本开关属性。
 */
export interface SwitchComponentProps extends Partial<SwitchProps> {
	/** on 属性定义了开关事件的回调函数。 */
	on?: {
		/** change 事件的回调函数，接收布尔值或其他类型的值。 */
		change?: (value: boolean | string | number) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * RateComponentProps 接口定义了评分组件的属性，扩展了基本评分属性。
 */
export interface RateComponentProps extends Partial<RateProps> {
	/** on 属性定义了评分事件的回调函数。 */
	on?: {
		/** change 事件的回调函数，接收评分的值。 */
		change?: (value: number) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * ColorPickerComponentProps 接口定义了颜色选择器组件的属性，扩展了基本颜色选择器属性。
 */
export interface ColorPickerComponentProps extends Partial<ColorPickerProps> {
	/** on 属性定义了颜色选择事件的回调函数。 */
	on?: {
		/** change 事件的回调函数，接收选择的颜色值。 */
		change?: (value: string) => void

		/** activeChange 事件的回调函数，接收活动颜色值。 */
		activeChange?: (value: string) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * TransferComponentProps 接口定义了数据传输组件的属性，扩展了基本传输属性。
 */
export interface TransferComponentProps extends Partial<TransferProps> {
	/** on 属性定义了数据传输事件的回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值、方向和被移动的键数组。 */
		change?: (
			value: number | string,
			direction: 'left' | 'right',
			movedKeys: string[] | number[]
		) => void

		/** leftCheckChange 事件的回调函数，接收左侧选择项的变化。 */
		leftCheckChange?: (value: any[]) => void

		/** rightCheckChange 事件的回调函数，接收右侧选择项的变化。 */
		rightCheckChange?: (value: any[]) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** leftFooter 插槽，返回左侧底部的 JSX.Element 或 null。 */
		leftFooter?: (...args: any[]) => JSX.Element | null

		/** rightFooter 插槽，返回右侧底部的 JSX.Element 或 null。 */
		rightFooter?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * RadioOption 接口定义了单选框选项的属性。
 */
export interface RadioOption {
	/** label 属性可选，表示选项的标签。 */
	label?: string

	/** value 属性可选，表示选项的值，类型可以是字符串、数字或布尔值。 */
	value?: string | number | boolean

	/** disabled 属性可选，表示选项是否禁用。 */
	disabled?: boolean

	/** border 属性可选，表示选项是否有边框。 */
	border?: boolean

	/** size 属性可选，表示选项的大小，类型为 ComponentSize。 */
	size?: ComponentSize

	/** name 属性可选，表示选项的名称。 */
	name?: string

	/** 允许任意其他属性。 */
	[key: string]: any
}

/**
 * RadioGroupComponentProps 接口定义了单选框组的属性，扩展了基本单选框组属性。
 */
export interface RadioGroupComponentProps extends Partial<RadioGroupProps> {
	/** options 属性可选，表示单选框的选项数组。 */
	options?: RadioOption[]

	/** props 属性可选，定义了数据源的字段别名。 */
	props?: {
		/** label 属性可选，表示选项的标签字段名称。 */
		label?: string

		/** value 属性可选，表示选项的值字段名称。 */
		value?: string

		/** disabled 属性可选，表示选项的禁用字段名称。 */
		disabled?: string
	}

	/** on 属性定义了单选框组的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: string | number | boolean) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 数组或 null。 */
		default?: (...args: any[]) => JSX.Element[] | null
	}

	/** style 属性可选，表示组的样式。 */
	style?: CSSProperties
}

/**
 * RadioButtonComponentProps 接口定义了单选按钮组件的属性，扩展了基本单选按钮属性。
 */
export interface RadioButtonComponentProps extends Partial<RadioButtonProps> {
	/** options 属性可选，表示单选按钮的选项数组。 */
	options?: RadioOption[]

	/** props 属性可选，定义了数据源的字段别名。 */
	props?: {
		/** label 属性可选，表示选项的标签字段名称。 */
		label?: string

		/** value 属性可选，表示选项的值字段名称。 */
		value?: string

		/** disabled 属性可选，表示选项的禁用字段名称。 */
		disabled?: string
	}

	/** on 属性定义了单选按钮的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: string | number | boolean) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 数组或 null。 */
		default?: (...args: any[]) => JSX.Element[] | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * CheckboxOption 接口定义了复选框选项的属性。
 */
export interface CheckboxOption {
	/** label 属性可选，表示选项的标签。 */
	label?: string

	/** value 属性可选，表示选项的值，可以为字符串、数字或布尔值。 */
	value?: string | number | boolean

	/** disabled 属性可选，表示选项是否禁用。 */
	disabled?: boolean

	/** trueLabel 属性可选，表示选中时的标签值。 */
	trueLabel?: string | number

	/** falseLabel 属性可选，表示未选中时的标签值。 */
	falseLabel?: string | number

	/** border 属性可选，表示选项是否有边框。 */
	border?: boolean

	/** size 属性可选，表示选项的大小，类型为 ComponentSize。 */
	size?: ComponentSize

	/** name 属性可选，表示选项的名称。 */
	name?: string

	/** checked 属性可选，表示选项是否被选中。 */
	checked?: boolean

	/** indeterminate 属性可选，表示选项的部分选中状态。 */
	indeterminate?: boolean

	/** validateEvent 属性可选，表示事件是否需要被验证。 */
	validateEvent?: boolean

	/** tabindex 属性可选，表示选项的标签顺序。 */
	tabindex?: number | string

	/** id 属性可选，表示选项的唯一标识符。 */
	id?: string

	/** controls 属性可选，表示选项是否控制其他组件。 */
	controls?: boolean

	/** 允许任意其他属性。 */
	[key: string]: any
}

/**
 * CheckboxGroupComponentProps 接口定义了复选框组的属性，扩展了基本复选框组属性。
 */
export interface CheckboxGroupComponentProps extends Partial<CheckboxGroupProps> {
	/** options 属性可选，表示复选框的选项数组。 */
	options?: CheckboxOption[]

	/** props 属性可选，定义了数据源的字段别名。 */
	props?: {
		/** label 属性可选，表示选项的标签字段名称。 */
		label?: string

		/** value 属性可选，表示选项的值字段名称。 */
		value?: string

		/** disabled 属性可选，表示选项的禁用字段名称。 */
		disabled?: string
	}

	/** on 属性定义了复选框组的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: string | number | boolean) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 数组或 null。 */
		default?: (...args: any[]) => JSX.Element[] | null
	}

	/** style 属性可选，表示组的样式。 */
	style?: CSSProperties
}

/**
 * DividerComponentProps 接口定义了分隔符组件的属性，扩展了基本分隔符属性。
 */
export interface DividerComponentProps extends Partial<DividerProps> {
	/** on 属性定义了分隔符事件的回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: number) => void

		/** input 事件的回调函数，接收输入的值。 */
		input?: (value: number) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * DatePickerComponentProps 接口定义了日期选择器组件的属性，扩展了基本日期选择器属性。
 */
export interface DatePickerComponentProps extends Partial<DatePickerProps> {
	/** on 属性定义了日期选择器的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收选择的日期值，可以为字符串、日期或数字。 */
		change?: (value: string | Date | number | string[]) => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void

		/** calendarChange 事件的回调函数，接收日期的范围值。 */
		calendarChange?: (val: [Date, Date]) => void

		/** panelChange 事件的回调函数，接收日期、模式和视图。 */
		panelChange?: (date: Date, mode: string, view: string) => void

		/** visibleChange 事件的回调函数，接收可见性变化的布尔值。 */
		visibleChange?: (visibility: boolean) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** rangeSeparator 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		rangeSeparator?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * DateTimePickerComponentProps 接口定义了日期时间选择器组件的属性。
 */
export interface DateTimePickerComponentProps {
	/** readonly 属性可选，表示是否为只读模式。 */
	readonly?: boolean

	/** disabled 属性可选，表示组件是否禁用。 */
	disabled?: boolean

	/** editable 属性可选，表示输入框是否可编辑。 */
	editable?: boolean

	/** clearable 属性可选，表示是否支持清空操作。 */
	clearable?: boolean

	/** size 属性可选，表示组件的大小。 */
	size?: ComponentSize

	/** placeholder 属性可选，表示组件的占位符文本。 */
	placeholder?: string

	/** startPlaceholder 属性可选，表示开始时间的占位符文本。 */
	startPlaceholder?: string

	/** endPlaceholder 属性可选，表示结束时间的占位符文本。 */
	endPlaceholder?: string

	/** timeArrowControl 属性可选，表示是否启用时间箭头控制。 */
	timeArrowControl?: boolean

	/** type 属性可选，表示组件的类型，可以是年份、月份、日期等。 */
	type?: 'year' | 'month' | 'date' | 'datetime' | 'datetimerange' | 'daterange' | 'week'

	/** format 属性可选，表示日期的格式。 */
	format?: string

	/** popperClass 属性可选，表示弹出层的类名。 */
	popperClass?: string

	/** rangeSeparator 属性可选，表示范围选择的分隔符。 */
	rangeSeparator?: string

	/** defaultValue 属性可选，表示组件的默认值，可以是单个日期或日期数组。 */
	defaultValue?: Date | [Date, Date]

	/** defaultTime 属性可选，表示组件的默认时间，可以是单个日期或日期数组。 */
	defaultTime?: Date | [Date, Date]

	/** valueFormat 属性可选，表示日期值的格式。 */
	valueFormat?: string

	/** id 属性可选，表示组件的唯一标识符。 */
	id?: string

	/** name 属性可选，表示组件的名称。 */
	name?: string

	/** unlinkPanels 属性可选，表示是否解除面板的联系。 */
	unlinkPanels?: boolean

	/** prefixIcon 属性可选，表示前缀图标，可以是字符串或 JSX.Element。 */
	prefixIcon?: string | JSX.Element

	/** clearIcon 属性可选，表示清空图标，可以是字符串或 JSX.Element。 */
	clearIcon?: string | JSX.Element

	/** shortcuts 属性可选，表示快捷选项的数组，每个快捷选项都有文本和对应的值。 */
	// shortcuts?: Array<{ text: string; value: Date | Function }>
	shortcuts?: Array<{ text: string; value: Date | ((date: Date) => any) }>

	/** disabledDate 属性可选，表示禁止选择某些日期的方法，接收一个日期参数并返回布尔值。 */
	disabledDate?: (date: Date) => boolean

	/** cellClassName 属性可选，表示日期单元格的类名，可以是字符串或函数。 */
	cellClassName?: string | ((date: Date) => string | undefined)

	/** teleported 属性可选，表示组件是否进行 DOM 传送。 */
	teleported?: boolean

	/** on 属性定义了日期时间选择器的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收选择的值，可以为字符串、日期、数字或字符串数组。 */
		change?: (value: string | Date | number | string[]) => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void

		/** calendarChange 事件的回调函数，接收日期范围的值。 */
		calendarChange?: (val: [Date, Date]) => void

		/** visibleChange 事件的回调函数，接收可见性变化的布尔值。 */
		visibleChange?: (visibility: boolean) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** rangeSeparator 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		rangeSeparator?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * TimePickerComponentProps 接口定义了时间选择器组件的属性。
 */
export interface TimePickerComponentProps {
	/** readonly 属性可选，表示是否为只读模式。 */
	readonly?: boolean

	/** disabled 属性可选，表示组件是否禁用。 */
	disabled?: boolean

	/** editable 属性可选，表示输入框是否可编辑。 */
	editable?: boolean

	/** clearable 属性可选，表示是否支持清空操作。 */
	clearable?: boolean

	/** size 属性可选，表示组件的大小。 */
	size?: ComponentSize

	/** placeholder 属性可选，表示组件的占位符文本。 */
	placeholder?: string

	/** startPlaceholder 属性可选，表示开始时间的占位符文本。 */
	startPlaceholder?: string

	/** endPlaceholder 属性可选，表示结束时间的占位符文本。 */
	endPlaceholder?: string

	/** isRange 属性可选，表示是否支持范围选择。 */
	isRange?: boolean

	/** arrowControl 属性可选，表示是否启用时间箭头控制。 */
	arrowControl?: boolean

	/** popperClass 属性可选，表示弹出层的类名。 */
	popperClass?: string

	/** rangeSeparator 属性可选，表示范围选择的分隔符。 */
	rangeSeparator?: string

	/** format 属性可选，表示时间的格式。 */
	format?: string

	/** defaultValue 属性可选，表示组件的默认值，可以为单个日期或日期数组。 */
	defaultValue?: Date | [Date, Date]

	/** id 属性可选，表示组件的唯一标识符。 */
	id?: string

	/** name 属性可选，表示组件的名称。 */
	name?: string

	/** label 属性可选，表示组件的标签。 */
	label?: string

	/** prefixIcon 属性可选，表示前缀图标，可以是字符串或 JSX.Element。 */
	prefixIcon?: string | JSX.Element

	/** clearIcon 属性可选，表示清空图标，可以是字符串或 JSX.Element。 */
	clearIcon?: string | JSX.Element

	/** disabledHours 属性可选，接收角色和比较日期，返回不可选择的小时数组。 */
	disabledHours?: (role: string, comparingDate?: any) => number[]

	/** disabledMinutes 属性可选，接收小时和角色，返回不可选择的分钟数组。 */
	disabledMinutes?: (hour: number, role: string, comparingDate?: any) => number[]

	/** disabledSeconds 属性可选，接收小时、分钟和角色，返回不可选择的秒数组。 */
	disabledSeconds?: (hour: number, minute: number, role: string, comparingDate?: any) => number[]

	/** teleported 属性可选，表示组件是否进行 DOM 传送。 */
	teleported?: boolean

	/** tabindex 属性可选，表示组件的标签顺序。 */
	tabindex?: number | string

	/** on 属性定义了时间选择器的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收选择的值，可以为数字、字符串、日期等。 */
		change: (
			val: number | string | Date | [number, number] | [string, string] | [Date, Date]
		) => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void

		/** visibleChange 事件的回调函数，接收可见性变化的布尔值。 */
		visibleChange?: (visibility: boolean) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * TimeSelectComponentProps 接口定义了时间选择选择器的属性。
 */
export interface TimeSelectComponentProps {
	/** disabled 属性可选，表示组件是否禁用。 */
	disabled?: boolean

	/** editable 属性可选，表示输入框是否可编辑。 */
	editable?: boolean

	/** clearable 属性可选，表示是否支持清空操作。 */
	clearable?: boolean

	/** size 属性可选，表示组件的大小。 */
	size?: ComponentSize

	/** placeholder 属性可选，表示组件的占位符文本。 */
	placeholder?: string

	/** name 属性可选，表示组件的名称。 */
	name?: string

	/** effect 属性可选，表示组件的效果。 */
	effect?: string

	/** prefixIcon 属性可选，表示前缀图标，可以是字符串或 JSX.Element。 */
	prefixIcon?: string | JSX.Element

	/** clearIcon 属性可选，表示清空图标，可以是字符串或 JSX.Element。 */
	clearIcon?: string | JSX.Element

	/** start 属性可选，表示时间选择的开始时间。 */
	start?: string

	/** end 属性可选，表示时间选择的结束时间。 */
	end?: string

	/** step 属性可选，表示时间选择的步长设置。 */
	step?: string

	/** minTime 属性可选，表示时间选择的最小时间。 */
	minTime?: string

	/** maxTime 属性可选，表示时间选择的最大时间。 */
	maxTime?: string

	/** format 属性可选，表示时间的格式。 */
	format?: string

	/** on 属性定义了时间选择器的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收选择的时间值。 */
		change?: (val: string) => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * EditorComponentProps 接口定义了文本编辑器组件的属性。
 */
export interface EditorComponentProps {
	/** editorConfig 属性可选，表示编辑器的配置。 */
	editorConfig?: IEditorConfig

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * ColProps 接口定义了栅格布局中列的属性。
 */
export interface ColProps {
	/** span 属性可选，表示列所占的栅格数。 */
	span?: number

	/** xs 属性可选，表示在屏幕宽度小于768px时列所占的栅格数。 */
	xs?: number

	/** sm 属性可选，表示在屏幕宽度大于等于768px且小于992px时列所占的栅格数。 */
	sm?: number

	/** md 属性可选，表示在屏幕宽度大于等于992px且小于1200px时列所占的栅格数。 */
	md?: number

	/** lg 属性可选，表示在屏幕宽度大于等于1200px且小于1600px时列所占的栅格数。 */
	lg?: number

	/** xl 属性可选，表示在屏幕宽度大于等于1600px时列所占的栅格数。 */
	xl?: number

	/** tag 属性可选，表示列的标签名称。 */
	tag?: string
}

/**
 * FormSetProps 接口定义了表单设置的属性。
 */
export interface FormSetProps {
	/** field 属性表示字段的名称。 */
	field: string

	/** path 属性表示字段的路径。 */
	path: string

	/** value 属性表示字段的值。 */
	value: any
}

/**
 * FormItemProps 接口定义了表单项的属性，扩展了基本表单项属性。
 */
export interface FormItemProps extends Partial<ElFormItemProps> {
	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** label 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		label?: (...args: any[]) => JSX.Element | null

		/** error 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		error?: (...args: any[]) => JSX.Element | null
	}
}

/**
 * UploadComponentProps 接口定义了上传组件的属性。
 */
export interface UploadComponentProps extends Partial<UploadProps> {
	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** trigger 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		trigger?: (...args: any[]) => JSX.Element | null

		/** tip 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		tip?: (...args: any[]) => JSX.Element | null

		/** file 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		file?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * TreeSelectComponentProps 接口定义了树形选择组件的属性，扩展了选择组件的部分属性。
 */
export interface TreeSelectComponentProps
	extends Omit<Partial<SelectComponentProps>, 'props' | 'on' | 'slots'> {
	/** data 属性可选，表示树形选择的数据源，类型为数组。 */
	data?: any[]

	/** emptyText 属性可选，表示无数据时的提示文本。 */
	emptyText?: string

	/** nodeKey 属性可选，表示树节点的唯一标识。 */
	nodeKey?: string

	/** props 属性可选，定义了数据源的字段别名。 */
	props?: {
		/** children 属性可选，表示子节点的字段名称。 */
		children?: string

		/** label 属性可选，表示节点的标签字段名称。 */
		label?: string | ((...args: any[]) => string)

		/** disabled 属性可选，表示节点的禁用字段名称。 */
		disabled?: string | ((...args: any[]) => string)

		/** isLeaf 属性可选，表示节点是否为叶子节点的字段名称。 */
		isLeaf?: string | ((...args: any[]) => string)

		/** class 属性可选，表示节点的 CSS 类名字段名称。 */
		class?: string | ((...args: any[]) => string)
	}

	/** renderAfterExpand 属性可选，表示展开后是否渲染。 */
	renderAfterExpand?: boolean

	/** load 属性可选，接收加载方法，返回 Promise。 */
	load?: (...args: any[]) => Promise<any>

	/** renderContent 属性可选，接收节点参数，返回自定义的节点内容。 */
	renderContent?: (...args: any[]) => JSX.Element | null

	/** highlightCurrent 属性可选，表示是否高亮当前选中节点。 */
	highlightCurrent?: boolean

	/** defaultExpandAll 属性可选，表示是否默认全部展开。 */
	defaultExpandAll?: boolean

	/** expandOnClickNode 属性可选，表示点击节点时是否展开。 */
	expandOnClickNode?: boolean

	/** checkOnClickNode 属性可选，表示点击节点时是否选择。 */
	checkOnClickNode?: boolean

	/** autoExpandParent 属性可选，表示父节点是否自动展开。 */
	autoExpandParent?: boolean

	/** defaultExpandedKeys 属性可选，表示默认展开的节点键数组。 */
	defaultExpandedKeys?: any[]

	/** showCheckbox 属性可选，表示是否显示复选框。 */
	showCheckbox?: boolean

	/** checkStrictly 属性可选，表示选择和展开是否相互独立。 */
	checkStrictly?: boolean

	/** defaultCheckedKeys 属性可选，表示默认选中的节点键数组。 */
	defaultCheckedKeys?: any[]

	/** currentNodeKey 属性可选，表示当前选中的节点键。 */
	currentNodeKey?: string | number

	/** filterNodeMethod 属性可选，接收节点参数和关键词，返回布尔值以决定是否显示该节点。 */
	filterNodeMethod?: (...args: any[]) => boolean

	/** accordion 属性可选，表示是否为手风琴模式。 */
	accordion?: boolean

	/** indent 属性可选，表示节点缩进的距离。 */
	indent?: number

	/** icon 属性可选，接收图标字符串或函数返回自定义图标。 */
	icon?: string | ((...args: any[]) => JSX.Element | null)

	/** lazy 属性可选，表示是否启用懒加载。 */
	lazy?: boolean

	/** draggable 属性可选，表示节点是否可拖拽。 */
	draggable?: boolean

	/** allowDrag 属性可选，接收节点参数，返回布尔值以决定是否允许拖拽。 */
	allowDrag?: (...args: any[]) => boolean

	/** allowDrop 属性可选，接收节点参数，返回布尔值以决定是否允许放置。 */
	allowDrop?: (...args: any[]) => boolean

	/** on 属性定义了树形选择的事件回调函数。 */
	on?: {
		/** change 事件的回调函数，接收变化的值。 */
		change?: (value: string | number | boolean | object) => void

		/** visibleChange 事件的回调函数，接收可见性变化的布尔值。 */
		visibleChange?: (visible: boolean) => void

		/** removeTag 事件的回调函数，接收被移除的标签。 */
		removeTag?: (tag: any) => void

		/** clear 事件的回调函数，无参数。 */
		clear?: () => void

		/** blur 事件的回调函数，接收 FocusEvent 对象。 */
		blur?: (event: FocusEvent) => void

		/** focus 事件的回调函数，接收 FocusEvent 对象。 */
		focus?: (event: FocusEvent) => void

		/** nodeClick 事件的回调函数，接收节点参数。 */
		nodeClick?: (...args: any[]) => void

		/** nodeContextMenu 事件的回调函数，接收节点参数。 */
		nodeContextMenu?: (...args: any[]) => void

		/** checkChange 事件的回调函数，接收选中项变化参数。 */
		checkChange?: (...args: any[]) => void

		/** check 事件的回调函数，接收选中项参数。 */
		check?: (...args: any[]) => void

		/** currentChange 事件的回调函数，接收当前节点变化参数。 */
		currentChange?: (...args: any[]) => void

		/** nodeExpand 事件的回调函数，接收节点展开参数。 */
		nodeExpand?: (...args: any[]) => void

		/** nodeCollapse 事件的回调函数，接收节点收起参数。 */
		nodeCollapse?: (...args: any[]) => void

		/** nodeDragStart 事件的回调函数，接收拖动开始的节点参数。 */
		nodeDragStart?: (...args: any[]) => void

		/** nodeDragEnter 事件的回调函数，接收拖动进入的节点参数。 */
		nodeDragEnter?: (...args: any[]) => void

		/** nodeDragLeave 事件的回调函数，接收拖动离开的节点参数。 */
		nodeDragLeave?: (...args: any[]) => void

		/** nodeDragOver 事件的回调函数，接收拖动悬浮的节点参数。 */
		nodeDragOver?: (...args: any[]) => void

		/** nodeDragEnd 事件的回调函数，接收拖动结束的节点参数。 */
		nodeDragEnd?: (...args: any[]) => void

		/** nodeDrop 事件的回调函数，接收拖释放的节点参数。 */
		nodeDrop?: (...args: any[]) => void
	}

	/** slots 属性定义了可以自定义的插槽组件。 */
	slots?: {
		/** default 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		default?: (...args: any[]) => JSX.Element | null

		/** optionGroupDefault 插槽，接收分组项，返回 JSX.Element。 */
		optionGroupDefault?: (item: SelectOption) => JSX.Element

		/** optionDefault 插槽，接收选择项，返回 JSX.Element 或 null。 */
		optionDefault?: (option: SelectOption) => JSX.Element | null

		/** prefix 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		prefix?: (...args: any[]) => JSX.Element | null

		/** empty 插槽，接收任意参数，返回 JSX.Element 或 null。 */
		empty?: (...args: any[]) => JSX.Element | null
	}

	/** style 属性可选，表示组件的样式。 */
	style?: CSSProperties
}

/**
 * FormSchema 接口定义了表单的结构和属性。
 */
export interface FormSchema {
	/** field 属性表示唯一标识。 */
	field: string

	/** label 属性可选，表示表单项的标题。 */
	label?: string

	/** colProps 属性可选，表示列组件的属性。 */
	colProps?: ColProps

	/** componentProps 属性可选，表示组件的详细属性，具体可参考 element-plus 文档。 */
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

	/** formItemProps 属性可选，表示表单项的属性，具体可参考 element-plus 文档。 */
	formItemProps?: FormItemProps

	/** component 属性可选，表示渲染的组件名称。 */
	component?: ComponentName

	/** value 属性可选，表示组件的初始值。 */
	value?: any

	/** remove 属性可选，表示是否隐藏，如果为 true，连同值一同删除。 */
	remove?: boolean

	/** hidden 属性可选，表示样式隐藏，不会删除值。 */
	hidden?: boolean

	/** optionApi 属性可选，表示远程加载下拉项的接口。 */
	optionApi?: any
}

/**
 * FormProps 接口定义了表单的属性，扩展了 ElFormProps。
 */
export interface FormProps extends Partial<ElFormProps> {
	/** schema 属性可选，表示表单的结构。 */
	schema?: FormSchema[]

	/** isCol 属性可选，表示是否为列布局。 */
	isCol?: boolean

	/** model 属性可选，表示表单模型。 */
	model?: Recordable

	/** autoSetPlaceholder 属性可选，表示是否自动设置占位符。 */
	autoSetPlaceholder?: boolean

	/** isCustom 属性可选，表示是否自定义。 */
	isCustom?: boolean

	/** 允许任意其他属性。 */
	[key: string]: any
}
