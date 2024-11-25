/**
 * @file /src/components/JsonEditor/src/types/index.ts
 * @description 定义 JsonEditor 组件的属性接口类型
 * @example 用法示例：<JsonEditor :value="data" :editable="true" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module JsonEditorPropsInterfaceModule
 * @author [吴尘](https://github.com/wucunping)
 */

/** JsonEditor 组件的属性接口 */
export interface JsonEditorProps {
  /** 编辑器绑定的值 */
  value: any
  /** 嵌套深度 */
  deep?: number
  /** 是否显示对象/数组长度 */
  showLength?: boolean
  /** 是否显示行号（优先级低） */
  showLineNumbers?: boolean
  /** 是否显示行号（优先级高） */
  showLineNumber?: boolean
  /** 是否显示图标 */
  showIcon?: boolean
  /** 是否显示双引号 */
  showDoubleQuotes?: boolean
  /** 是否启用虚拟滚动 */
  virtual?: boolean
  /** 编辑器高度 */
  height?: number
  /** 每项的高度 */
  itemHeight?: number
  /** 根路径标识 */
  rootPath?: string
  /** 节点是否可选的回调函数 */
  nodeSelectable?: (...args: any[]) => boolean
  /** 节点选择的类型 */
  selectableType?: 'multiple' | 'single'
  /** 是否显示选择控制器 */
  showSelectController?: boolean
  /** 是否单击节点时触发选择 */
  selectOnClickNode?: boolean
  /** 是否高亮选中的节点 */
  highlightSelectedNode?: boolean
  /** 点击括号时是否折叠 */
  collapsedOnClickBrackets?: boolean
  /** 自定义节点键渲染函数 */
  renderNodeKey?: (...args: any[]) => any
  /** 自定义节点值渲染函数 */
  renderNodeValue?: (...args: any[]) => any
  /** 是否允许编辑 */
  editable?: boolean
  /** 编辑触发方式 */
  editableTrigger?: 'click' | 'dblclick'
}
