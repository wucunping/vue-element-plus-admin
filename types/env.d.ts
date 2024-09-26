/**
 * @fileOverview 此文件用于提供 TypeScript 类型声明，以增强对 Vue 单文件组件（.vue 文件）
 * 和 Vite 环境变量的类型支持。
 *
 * 1. 通过对 '*.vue' 文件的声明，我们使得 TypeScript 能够识别并正确处理 Vue 单文件组件。
 * 这允许我们在项目中导入 .vue 文件时获得正确的类型信息。
 *
 * 2. 声明了全局的 `ImportMeta` 接口，并扩展了其 `env` 属性，以便 TypeScript 能够理解和
 * 检查通过 `import.meta.env` 访问的 Vite 环境变量。这有助于在开发过程中捕获可能的环境变量
 * 访问错误。
 *
 * 注意：此文件是一个 TypeScript 声明文件（.d.ts），它仅提供类型信息，并不包含实际的可执行代码。
 */

/// <reference types="vite/client" />

/**
 * 声明一个模块，该模块匹配所有以 '.vue' 结尾的文件。
 * 这允许 TypeScript 正确处理 Vue 单文件组件的导入。
 */
declare module '*.vue' {
	/**
	 * 从 'vue' 包中导入 'DefineComponent' 类型，它是定义 Vue 组件的选项对象的类型。
	 */
	import { DefineComponent } from 'vue'

	/**
	 * 声明一个名为 'component' 的常量，其类型为 'DefineComponent'。
	 * 这里的类型参数 <{}, {}, any> 分别代表组件的 props、setup 函数的上下文和组件的其他选项，这里使用了泛型默认值。
	 */
	const component: DefineComponent<{}, {}, any>

	/**
	 * 导出 'component' 常量作为模块的默认导出。
	 * 这意味着当其他文件导入 '.vue' 文件时，它们实际上是在导入这个 'component' 常量。
	 */
	export default component
}

/**
 * 声明全局的 'ImportMeta' 接口，以便在此文件中扩展它。
 * 'ImportMeta' 接口通常用于描述 ECMAScript 模块导入语句的 'import.meta' 对象的类型。
 */
declare global {
	/**
	 * 在全局作用域中声明 'ImportMeta' 接口。
	 */
	interface ImportMeta {
		/**
		 * 在 'ImportMeta' 接口中添加一个名为 'env' 的只读属性。
		 * 'ImportMetaEnv' 类型是 Vite 定义的，用于描述通过 'import.meta.env' 访问的环境变量的类型。
		 */
		readonly env: ImportMetaEnv
	}
}
