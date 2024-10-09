/**
 * @file 编辑器组件接口定义
 * @description 此文件定义了 Editor 组件及其相关接口。
 * @example
 * // 使用示例
 * import { Editor, EditorExpose } from './index';
 * const editor: EditorExpose = { getEditorRef: async () => { /* ... *\/ } };
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module Editor
 */

// 导入 Editor 组件
import Editor from './src/Editor.vue'

// 导入 Wangeditor 编辑器相关的接口
import type { IDomEditor } from '@wangeditor/editor'

/**
 * EditorExpose 接口定义
 */
export interface EditorExpose {
	/**
	 * 获取编辑器引用的方法
	 * @returns 返回一个 Promise，解析为 IDomEditor 类型
	 */
	getEditorRef: () => Promise<IDomEditor>
}

// 导出 Editor 组件
export { Editor }
