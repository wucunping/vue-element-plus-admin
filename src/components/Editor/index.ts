/**
 * @file index.ts
 * @description Editor 组件的导出入口
 * @example
 * import { Editor } from '@/components/Editor'
 * @version 1.0.0
 * @date 2024-11-21
 * @module Editor
 * @requires '@/components/Editor/src/Editor.vue', '@wangeditor/editor'
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Editor 组件
import Editor from './src/Editor.vue'
// WangEditor 编辑器实例类型
import { IDomEditor } from '@wangeditor/editor'

/** Editor 组件的公开方法定义 */
export interface EditorExpose {
  /** 获取编辑器实例的方法 */
  getEditorRef: () => Promise<IDomEditor>
}

// 导出 Editor 组件
export { Editor }
