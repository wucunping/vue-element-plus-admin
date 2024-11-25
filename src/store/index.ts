/**
 * @file store.ts
 * @description 全局状态管理模块的入口文件，使用 Pinia 作为状态管理工具，并集成持久化插件。
 * @example
 *  // 在主应用中初始化状态管理
 *  import { setupStore } from './store';
 *  setupStore(app);
 * @version 1.0.0
 * @date 2024-11-18
 * @author [吴尘](https://github.com/wucunping)
 * @module Store
 */

// 引入 Vue 的 App 类型，用于类型定义
import type { App } from 'vue'

// 引入 Pinia，用于创建全局状态管理实例
import { createPinia } from 'pinia'

// 引入 Pinia 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const store = createPinia()

// 使用持久化插件，将状态持久化到本地存储
store.use(piniaPluginPersistedstate)

/**
 * 设置全局状态管理
 * @param {App<Element>} app Vue 应用实例
 * @description 将 Pinia 作为插件安装到 Vue 应用中
 */
export const setupStore = (app: App<Element>) => {
  app.use(store) // 将 Pinia 注入到 Vue 应用中
}

// 导出 Pinia 实例，供其他模块使用
export { store }
