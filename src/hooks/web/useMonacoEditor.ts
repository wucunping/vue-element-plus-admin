/**
 * @file useMonacoEditor.ts
 * @description 一个用于初始化并管理Monaco Editor的hook
 * @example
 * const { monacoEditorRef, createEditor } = useMonacoEditor('javascript');
 * createEditor();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module MonacoEditor
 */

import * as monaco from 'monaco-editor' // 引入Monaco Editor
import { ref, nextTick, onBeforeUnmount } from 'vue' // 引入Vue的ref、nextTick和onBeforeUnmount API
// 引入Monaco Editor的各语言worker
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker' /// 编辑器主worker
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker' // JSON语言worker
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker' // CSS语言worker
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker' // HTML语言worker
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker' // TypeScript语言worker

// 设置Monaco环境以获取适当的worker
self.MonacoEnvironment = {
  // 获取worker的函数
  getWorker(_, label) {
    // 检查标签是否为JSON
    if (label === 'json') {
      return new jsonWorker() // 返回JSON worker实例
    }
    // 检查标签是否为CSS相关
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker() // 返回CSS worker实例
    }
    // 检查标签是否为HTML相关
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker() // 返回HTML worker实例
    }
    // 检查标签是否为TypeScript或JavaScript
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker() // 返回TypeScript worker实例
    }
    return new editorWorker() // 默认返回主编辑器worker实例
  }
}

/**
 * useMonacoEditor - 初始化并管理Monaco Editor的自定义hook
 * @param {string} language - 编辑器语言，默认为'javascript'
 * @returns {Object} - 返回记录编辑器相关操作的对象
 */
export function useMonacoEditor(language: string = 'javascript') {
  // 编辑器示例
  let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null
  // 目标元素
  const monacoEditorRef = ref<HTMLElement>()

  /**
   * createEditor - 创建Monaco Editor实例
   * @param {monaco.editor.IStandaloneEditorConstructionOptions} editorOption - 编辑器构造选项
   * @returns {monaco.editor.IStandaloneCodeEditor} - 返回创建的Monaco Editor实例
   */
  function createEditor(editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {}) {
    // 如果目标元素不存在则返回
    if (!monacoEditorRef.value) return
    // 创建编辑器实例
    monacoEditor = monaco.editor.create(monacoEditorRef.value, {
      // 初始模型
      model: monaco.editor.createModel('', language),
      // 是否启用预览图
      minimap: { enabled: true },
      // 启用圆角选择
      roundedSelection: true,
      // 设置主题为暗色
      theme: 'vs-dark',
      // 设置多光标修饰键
      multiCursorModifier: 'ctrlCmd',
      // 滚动条设置
      scrollbar: {
        verticalScrollbarSize: 8, // 垂直滚动条大小
        horizontalScrollbarSize: 8 // 水平滚动条大小
      },
      // 行号开关
      lineNumbers: 'on',
      // tab大小
      tabSize: 2,
      //字体大小
      fontSize: 14,
      // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
      autoIndent: 'advanced',
      // 启用自动布局
      automaticLayout: true,
      ...editorOption // 合并传入的编辑器选项
    })
    return monacoEditor // 返回编辑器实例
  }

  /**
   * formatDoc - 格式化当前文档
   * @returns {Promise<void>} - 无返回值的Promise
   */
  async function formatDoc() {
    await monacoEditor?.getAction('editor.action.formatDocument')?.run() // 执行格式化操作
  }

  /**
   * updateVal - 更新编辑器内容
   * @param {string} val - 新的内容
   */
  function updateVal(val: string) {
    // 等待下一个DOM更新周期
    nextTick(() => {
      // 如果编辑器为只读模式
      if (getOption(monaco.editor.EditorOption.readOnly)) {
        updateOptions({ readOnly: false }) // 设置为可编辑模式
      }
      monacoEditor?.setValue(val) // 设置编辑器的新值
      // 设置超时执行格式化
      setTimeout(async () => {
        await formatDoc() // 格式化文档
      }, 10)
    })
  }

  /**
   * updateOptions - 更新编辑器配置
   * @param {monaco.editor.IStandaloneEditorConstructionOptions} opt - 编辑器新选项
   */
  function updateOptions(opt: monaco.editor.IStandaloneEditorConstructionOptions) {
    monacoEditor?.updateOptions(opt) // 更新编辑器选项
  }

  /**
   * getOption - 获取指定的编辑器配置
   * @param {monaco.editor.EditorOption} name - 配置项名称
   * @returns {any} - 返回配置项的值
   */
  function getOption(name: monaco.editor.EditorOption) {
    return monacoEditor?.getOption(name) // 返回编辑器指定配置的值
  }

  /**
   * getEditor - 获取当前编辑器实例
   * @returns {monaco.editor.IStandaloneCodeEditor | null} - 返回编辑器实例或null
   */
  function getEditor() {
    return monacoEditor // 返回编辑器实例
  }

  /**
   * changeLanguage - 更改编辑器语言
   * @param {string} newLanguage - 新的语言
   */
  function changeLanguage(newLanguage: string) {
    const model = monacoEditor?.getModel() // 获取当前模型
    if (model) {
      monaco.editor.setModelLanguage(model, newLanguage) // 设置模型语言
    }
  }

  /**
   * changeTheme - 更改编辑器主题
   * @param {string} newTheme - 新的主题
   */
  function changeTheme(newTheme: string) {
    monaco.editor.setTheme(newTheme) // 设置新主题
  }

  // 页面离开 销毁，组件卸载前销毁编辑器实例
  onBeforeUnmount(() => {
    if (monacoEditor) {
      monacoEditor.dispose() // 销毁编辑器实例
    }
  })

  // 返回编辑器相关方法和引用
  return {
    /** 编辑器引用 */
    monacoEditorRef,
    /** 创建编辑器实例 */
    createEditor,
    /** 获取编辑器实例 */
    getEditor,
    /** 更新编辑器内容 */
    updateVal,
    /** 更新编辑器选项 */
    updateOptions,
    /** 获取编辑器选项 */
    getOption,
    /** 更改编辑器语言 */
    formatDoc,
    /** 更改编辑器语言 */
    changeLanguage,
    /** 更改编辑器主题 */
    changeTheme
  }
}
