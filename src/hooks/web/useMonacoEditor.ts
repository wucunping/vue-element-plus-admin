/**
 * @file src/hooks/web/useMonacoEditor.ts
 * @description 该文件定义了一个自定义的Vue Hook，名为useMonacoEditor，用于创建和管理Monaco Editor实例。
 * @example
 * 引入useMonacoEditor并使用返回的实例
 * import { useMonacoEditor } from './useMonacoEditor'
 * const { monacoEditorRef, createEditor, updateVal, getOption } = useMonacoEditor()
 *
 * // 创建一个编辑器实例
 * const editorDiv = document.getElementById('editor')
 * monacoEditorRef.value = editorDiv
 * createEditor()
 *
 * // 更新编辑器值
 * updateVal('let x = 5;')
 *
 * // 获取编辑器配置
 * console.log(getOption(monaco.editor.EditorOption.tabSize))
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入monaco-editor库，用于创建和管理代码编辑器
import * as monaco from 'monaco-editor'
// 引入vue的ref, nextTick, onBeforeUnmount方法，用于管理编辑器相关的状态和生命周期
import { ref, nextTick, onBeforeUnmount } from 'vue'
// 引入Monaco Editor的worker，用于在Web Worker中处理编辑器的操作
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// 引入用于处理JSON语言的worker
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// 引入用于处理CSS语言的worker
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// 引入用于处理HTML语言的worker
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// 引入用于处理TypeScript语言的worker
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

/**
 * 设置MonacoEnvironment的getWorker方法，用于根据label创建并返回对应的worker
 */
self.MonacoEnvironment = {
	/**
	 * 根据传入的标签获取对应的 Worker 实例
	 *
	 * @param _ 占位符，当前未使用
	 * @param label 用于确定返回worker实例的标签，可以是 'json', 'css', 'scss', 'less', 'html', 'handlebars', 'razor', 'typescript', 'javascript' 之一
	 * @returns 返回对应的 Worker 实例，若标签不匹配则返回默认的 editorWorker 实例
	 */
	getWorker(_, label) {
		// 如果标签为 'json'
		if (label === 'json') {
			// 返回一个新的 jsonWorker 实例
			return new jsonWorker()
		}
		// 如果标签为 'css'、'scss' 或 'less'
		if (label === 'css' || label === 'scss' || label === 'less') {
			// 返回一个新的 cssWorker 实例
			return new cssWorker()
		}
		// 如果标签为 'html'、'handlebars' 或 'razor'
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			// 返回一个新的 htmlWorker 实例
			return new htmlWorker()
		}
		// 如果标签为 'typescript' 或 'javascript'
		if (label === 'typescript' || label === 'javascript') {
			// 返回一个新的 tsWorker 实例
			return new tsWorker()
		}
		// 默认情况下返回一个新的 editorWorker 实例
		return new editorWorker()
	}
}

/**
 * 使用 Monaco Editor
 *
 * @param language 编辑器语言，默认为 'javascript'
 * @returns 包含 Monaco Editor 相关方法和属性的对象
 */
export function useMonacoEditor(language: string = 'javascript') {
	// 编辑器示例
	let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null
	// 目标元素
	const monacoEditorRef = ref<HTMLElement>()

	/**
	 * 创建 Monaco 编辑器
	 *
	 * @param editorOption Monaco 编辑器构造选项，默认为空对象
	 * @returns Monaco 编辑器实例
	 */
	function createEditor(editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {}) {
		if (!monacoEditorRef.value) return
		monacoEditor = monaco.editor.create(monacoEditorRef.value, {
			// 初始模型
			model: monaco.editor.createModel('', language),
			// 是否启用预览图
			minimap: { enabled: true },
			// 圆角
			roundedSelection: true,
			// 主题
			theme: 'vs-dark',
			// 主键
			multiCursorModifier: 'ctrlCmd',
			// 滚动条
			scrollbar: {
				verticalScrollbarSize: 8,
				horizontalScrollbarSize: 8
			},
			// 行号
			lineNumbers: 'on',
			// tab大小
			tabSize: 2,
			//字体大小
			fontSize: 14,
			// 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
			autoIndent: 'advanced',
			// 自动布局
			automaticLayout: true,
			...editorOption
		})
		return monacoEditor
	}

	/**
	 * 格式化文档
	 *
	 * @returns 格式化文档后的Promise对象
	 */
	async function formatDoc() {
		await monacoEditor?.getAction('editor.action.formatDocument')?.run()
	}

	/**
	 * 更新编辑器内容
	 *
	 * @param val 编辑器内容
	 */
	function updateVal(val: string) {
		// 在下一个DOM更新周期中执行回调函数
		nextTick(() => {
			// 判断当前编辑器是否只读
			if (getOption(monaco.editor.EditorOption.readOnly)) {
				// 如果只读，则更新编辑器选项为可编辑
				updateOptions({ readOnly: false })
			}
			// 设置编辑器的值为传入的val
			monacoEditor?.setValue(val)
			// 延迟10毫秒后执行异步函数
			setTimeout(async () => {
				// 格式化文档
				await formatDoc()
			}, 10)
		})
	}

	/**
	 * 更新 Monaco 编辑器的选项
	 *
	 * @param opt Monaco 编辑器的选项对象
	 */
	function updateOptions(opt: monaco.editor.IStandaloneEditorConstructionOptions) {
		monacoEditor?.updateOptions(opt)
	}

	// 获取配置
	function getOption(name: monaco.editor.EditorOption) {
		return monacoEditor?.getOption(name)
	}

	/**
	 * 获取 Monaco 编辑器实例
	 *
	 * @returns Monaco 编辑器实例
	 */
	function getEditor() {
		return monacoEditor
	}

	/**
	 * 更改 Monaco 编辑器中的语言模式
	 *
	 * @param newLanguage 新的语言模式
	 */
	function changeLanguage(newLanguage: string) {
		const model = monacoEditor?.getModel()
		if (model) {
			monaco.editor.setModelLanguage(model, newLanguage)
		}
	}

	/**
	 * 更改编辑器主题
	 *
	 * @param newTheme 新的主题名称
	 */
	function changeTheme(newTheme: string) {
		monaco.editor.setTheme(newTheme)
	}

	// 页面离开 销毁
	onBeforeUnmount(() => {
		if (monacoEditor) {
			monacoEditor.dispose()
		}
	})

	// 返回一个对象，包含了上述所有方法以及编辑器挂载的DOM元素的引用
	return {
		monacoEditorRef, // 编辑器挂载的DOM元素的引用
		createEditor, // 创建编辑器实例的方法
		getEditor, // 获取编辑器实例的方法
		updateVal, // 更新编辑器内容的方法
		updateOptions, // 更新编辑器配置的方法
		getOption, // 获取编辑器配置的方法
		formatDoc, // 格式化编辑器内容的方法
		changeLanguage, // 更改编辑器语言的方法
		changeTheme // 更改编辑器主题的方法
	}
}
