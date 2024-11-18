/**
 * @file index.ts
 * @description 该文件用于全局设置 Element Plus 组件和插件
 * @example
 * import { createApp } from 'vue'
 * import { setupElementPlus } from './index'
 *
 * const app = createApp(App)
 * setupElementPlus(app)
 * app.mount('#app')
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module setupElementPlus
 */

// 引入 Vue 的 App 类型
import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import { ElLoading, ElScrollbar } from 'element-plus' // 从 element-plus 引入 ElLoading 和 ElScrollbar 组件

/** 定义需要全局注册的插件数组，包含 ElLoading */
const plugins = [ElLoading]

/** 定义需要全局注册的组件数组，包含 ElScrollbar */
const components = [ElScrollbar]

/**
 * 设置 Element Plus 组件和插件
 * @param app - Vue 应用实例
 */
export const setupElementPlus = (app: App<Element>) => {
  // 遍历插件数组，将每个插件注册到 Vue 应用
  plugins.forEach((plugin) => {
    app.use(plugin) // 注册插件
  })

  // 为了开发环境启动更快，一次性引入所有样式
  if (import.meta.env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === 'true') {
    import('element-plus/dist/index.css') // 条件引入 Element Plus 样式
    return // 如果引入所有样式，则结束函数
  }

  // 遍历组件数组，将每个组件注册到 Vue 应用
  components.forEach((component) => {
    app.component(component.name!, component) // 注册组件
  })
}
