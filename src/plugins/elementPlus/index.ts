/**
 * @file index.ts
 * @description 该文件用于设置 Element Plus 组件和插件的全局配置。
 * @example
 * import { createApp } from 'vue'
 * import { setupElementPlus } from './index'
 * const app = createApp(App)
 * setupElementPlus(app)
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ElementPlusSetup
 */

// 导入 Vue 类型
import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
// 导入 Element Plus 的插件和组件
import { ElLoading, ElScrollbar } from 'element-plus'

// 定义需要使用的插件数组
const plugins = [ElLoading]

// 定义需要使用的全局组件数组
const components = [ElScrollbar]

/**
 * 设置 Element Plus 插件和组件
 * @param {App<Element>} app - Vue 应用实例
 */
export const setupElementPlus = (app: App<Element>) => {
	// 遍历插件数组并使用每一个插件
	plugins.forEach((plugin) => {
		app.use(plugin)
	})

	// 为了开发环境启动更快，一次性引入所有样式
	// 判断是否需要引入所有 Element Plus 样式
	if (import.meta.env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === 'true') {
		// 动态导入所有样式
		import('element-plus/dist/index.css')
		return
	}

	// 遍历组件数组并注册每一个组件
	components.forEach((component) => {
		app.component(component.name!, component)
	})
}
