/**
 * @file types.ts
 * @description 该文件定义 JsonEditor 组件相关的类型。
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module types
 */

/** 定义 JsonEditorProps 接口 */
export interface JsonEditorProps {
	/** 组件的值，类型为任意 */
	value: any

	/** 数据的深度，类型为数字，默认为可选 */
	deep?: number

	/** 是否显示长度，类型为布尔值，默认为可选 */
	showLength?: boolean

	/** 是否显示行号，类型为布尔值，默认为可选 */
	showLineNumbers?: boolean

	/** 是否显示行号，类型为布尔值，默认为可选 */
	showLineNumber?: boolean

	/** 是否显示图标，类型为布尔值，默认为可选 */
	showIcon?: boolean

	/** 是否显示双引号，类型为布尔值，默认为可选 */
	showDoubleQuotes?: boolean

	/** 是否使用虚拟滚动，类型为布尔值，默认为可选 */
	virtual?: boolean

	/** 组件的高度，类型为数字，默认为可选 */
	height?: number

	/** 每项的高度，类型为数字，默认为可选 */
	itemHeight?: number

	/** 根路径，类型为字符串，默认为可选 */
	rootPath?: string

	/** 节点是否可选的函数，接收任意参数并返回布尔值，默认为可选 */
	nodeSelectable?: (...args: any[]) => boolean

	/** 选择类型，类型为字符串，表示可以选择 "multiple" 或 "single"，默认为可选 */
	selectableType?: 'multiple' | 'single'

	/** 是否显示选择控制器，类型为布尔值，默认为可选 */
	showSelectController?: boolean

	/** 点击节点时是否选择，类型为布尔值，默认为可选 */
	selectOnClickNode?: boolean

	/** 是否高亮选中的节点，类型为布尔值，默认为可选 */
	highlightSelectedNode?: boolean

	/** 点击括号时是否折叠，类型为布尔值，默认为可选 */
	collapsedOnClickBrackets?: boolean

	/** 自定义渲染节点键的函数，接收任意参数并返回任意值，默认为可选 */
	renderNodeKey?: (...args: any[]) => any

	/** 自定义渲染节点值的函数，接收任意参数并返回任意值，默认为可选 */
	renderNodeValue?: (...args: any[]) => any

	/** 是否可编辑，类型为布尔值，默认为可选 */
	editable?: boolean

	/** 触发可编辑的方式，类型为字符串，可以是 "click" 或 "dblclick"，默认为可选 */
	editableTrigger?: 'click' | 'dblclick'
}
