/**
 * @fileOverview 此文件用于扩展 Vue 的全局组件类型定义。
 *
 * 通过在此文件中声明自定义组件的类型，我们能够在 Vue 模板中使用这些组件时获得更好的
 * TypeScript 类型检查和代码编辑体验。目前，该文件为三个自定义组件：Icon、Permission 和
 * BaseButton 提供了类型定义。
 *
 * 注意：该文件是一个 TypeScript 声明文件（.d.ts），用于提供类型信息，不包含实际的可执行代码。
 */

/**
 * 声明一个 Vue 模块，以扩展 Vue 的全局类型。
 */
declare module 'vue' {
	/**
	 * 在 Vue 模块内定义一个接口，名为 GlobalComponents，用于表示全局可用的 Vue 组件。
	 */
	export interface GlobalComponents {
		/**
		 * 定义 Icon 组件，类型来源于 '../src/components/Icon/index' 文件中的 Icon 组件。
		 * 这允许我们在全局范围内使用 Icon 组件，而无需在每个文件中单独导入。
		 */
		Icon: (typeof import('../src/components/Icon/index'))['Icon']

		/**
		 * 定义 Permission 组件，类型来源于 '../src/components/Permission/index' 文件中的 Permission 组件。
		 */
		Permission: (typeof import('../src/components/Permission/index'))['Permission']

		/**
		 * 定义 BaseButton 组件，类型来源于 '../src/components/Button/index' 文件中的 BaseButton 组件。
		 */
		BaseButton: (typeof import('../src/components/Button/index'))['BaseButton']
	}
}

/**
 * 导出一个空对象，以确保此文件被视为模块。
 * 此文件主要关注类型声明，因此不需要导出任何运行时值。
 */
export {}
