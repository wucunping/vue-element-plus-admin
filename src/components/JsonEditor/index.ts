/**
 * @file /src/components/JsonEditor/index.ts
 * @description JsonEditor 组件的入口文件，导入并导出组件及相关类型
 * @example 使用方式：import { JsonEditor } from '@/components/JsonEditor'
 * @version 1.0.0
 * @date 2024-11-22
 * @module JsonEditorComponentModuleIndexFile
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 JsonEditor 组件
import JsonEditor from './src/JsonEditor.vue'

// 导出 JsonEditorProps 类型，用于定义组件的属性
export type { JsonEditorProps } from './src/types'

// 导出 JsonEditor 组件
export { JsonEditor }
