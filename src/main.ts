/**
 * @file main.ts
 * @description 应用入口文件，主要负责全局插件的注册、路由的初始化、权限的配置以及挂载 Vue 实例。
 * @example
 * // 在浏览器中运行项目
 * npm run serve
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module Main
 */

// 引入 Vue 的 JSX 支持
import 'vue/jsx'

// 引入 Windi CSS，用于快速定义样式
import '@/plugins/unocss'

// 导入全局的 SVG 图标配置
import '@/plugins/svgIcon'

// 初始化多语言支持
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理工具 Pinia 的初始化方法
import { setupStore } from '@/store'

// 注册全局组件
import { setupGlobCom } from '@/components'

// 引入 Element Plus 组件库
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画效果
import '@/plugins/animate.css'

// 引入路由设置
import { setupRouter } from './router'

// 引入权限指令
import { setupPermission } from './directives'

// 引入 Vue 的 createApp 方法，用于创建 Vue 实例
import { createApp } from 'vue'

// 引入主应用组件
import App from './App.vue'

// 导入权限文件，初始化权限功能
import './permission'

/**
 * 创建并设置应用实例
 * @async
 * @description 初始化 Vue 应用，加载多语言、状态管理、全局组件、UI 库等，并挂载到页面上。
 */
const setupAll = async () => {
  // 创建 Vue 应用实例
  const app = createApp(App)

  // 初始化多语言支持
  await setupI18n(app)

  // 设置状态管理
  setupStore(app)

  // 注册全局组件
  setupGlobCom(app)

  // 设置 Element Plus 组件库
  setupElementPlus(app)

  // 初始化路由
  setupRouter(app)

  // 配置权限功能
  setupPermission(app)

  // 挂载 Vue 应用到 DOM 节点
  app.mount('#app')
}

// 启动应用
setupAll()
