/**
 * @file index.ts
 * @description 该文件用于导入并导出代码编辑器组件，以便在其他模块中使用。
 * @example
 * // 导入 CodeEditor 组件
 * import { CodeEditor } from './index';
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module CodeEditorModule
 */

// 从指定路径导入 CodeEditor 组件
import CodeEditor from './src/CodeEditor.vue'

// 导出 CodeEditor 组件，以供其他模块使用
export { CodeEditor }
