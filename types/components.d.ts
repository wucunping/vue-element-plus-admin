/**
 * @fileOverview 此文件用于扩展 Vue 的全局组件类型定义。
 *
 * 通过在此文件中声明自定义组件的类型，我们能够在 Vue 模板中使用这些组件时获得更好的
 * TypeScript 类型检查和代码编辑体验。目前，该文件为三个自定义组件：Icon、Permission 和
 * BaseButton 提供了类型定义。
 *
 * 注意：该文件是一个 TypeScript 声明文件（.d.ts），用于提供类型信息，不包含实际的可执行代码。
 */

// 声明一个模块 'vue'，以便在此模块内扩展 Vue 的全局类型。
declare module 'vue' {
	// 在 Vue 模块内导出一个名为 'GlobalComponents' 的接口。
	// 这个接口用于定义全局可用的 Vue 组件。
	export interface GlobalComponents {
		// 定义一个名为 'Icon' 的属性，其类型是从 '../src/components/Icon/index' 文件中导入的 'Icon' 组件的类型。
		// 通过这种方式，我们可以在全局范围内使用 'Icon' 组件，而无需在每个使用它的文件中单独导入。
		Icon: (typeof import('../src/components/Icon/index'))['Icon']

		// 定义一个名为 'Permission' 的属性，其类型是从 '../src/components/Permission/index' 文件中导入的 'Permission' 组件的类型。
		Permission: (typeof import('../src/components/Permission/index'))['Permission']

		// 定义一个名为 'BaseButton' 的属性，其类型是从 '../src/components/Button/index' 文件中导入的 'BaseButton' 组件的类型。
		BaseButton: (typeof import('../src/components/Button/index'))['BaseButton']
	}
}

// 导出一个空对象，这是 TypeScript 的一个常见模式，用于确保文件被视为模块。
// 在这个特定的文件中，我们主要关注于类型声明，并不需要导出任何实际的运行时值。
export {}
