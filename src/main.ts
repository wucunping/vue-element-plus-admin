import { createApp } from 'vue' // 引入 createApp 函数，用于创建 Vue 实例
import { createPinia } from 'pinia' // 引入 Pinia 状态管理库

import App from '@/App.vue' // 引入根组件 App.vue，通过 '@' 别名从 src 目录中导入
// import router from './router'

const app = createApp(App) // 创建 Vue 应用实例
// 创建 Pinia 实例，用于管理全局状态
const pinia = createPinia()
app.use(pinia) // 注册 Pinia 插件
// app.use(router)// 注册 Vue Router 插件

app.mount('#app') // 将 Vue 应用挂载到 index.html 中的 #app 元素上
