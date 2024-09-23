// 引入Vue的App类型，这是为了后续在setupStore函数中，能正确识别传入的app参数类型
import type { App } from 'vue'
// 引入pinia的createPinia方法，用于创建一个pinia store实例
import { createPinia } from 'pinia'
// 引入pinia的持久化插件，该插件可以帮助我们将store中的数据持久化到localStorage等存储介质中
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 调用createPinia方法，创建一个pinia store实例
const store = createPinia()

// 使用pinia的持久化插件，将store中的数据持久化
store.use(piniaPluginPersistedstate)

// 定义一个setupStore函数，该函数接收一个Vue应用实例作为参数，
// 并在该Vue应用实例上安装我们之前创建的pinia store
export const setupStore = (app: App<Element>) => {
	app.use(store)
}

// 导出store，这样其他模块也可以直接使用这个store实例
export { store }
