import { createApp } from 'vue' // 引入 createApp 函数，用于创建 Vue 实例

// 引入状态管理
import { setupStore } from '@/store'

import App from '@/App.vue' // 引入根组件 App.vue，通过 '@' 别名从 src 目录中导入
import router from '@/router'
import '@/permission'

/**
 * 异步设置所有内容
 *
 * @returns Promise<void> 无返回值
 */
const setupAll = async () => {
	const app = createApp(App) // 创建 Vue 应用实例

	setupStore(app)

	app.use(router) // 注册 Vue Router 插件
	app.mount('#app') // 将 Vue 应用挂载到 index.html 中的 #app 元素上
}

await setupAll()
