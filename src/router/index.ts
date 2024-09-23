import { createRouter, createWebHistory } from 'vue-router' // 引入 Vue Router 和历史模式

// 定义路由规则
const routes = [
	{
		path: '/', // 定义路径为根路径 '/'
		name: 'Home', // 路由名称为 'Home'
		component: () => import('@/views/Home.vue') // 组件对应的 Vue 文件为 Home.vue
	},
	{
		path: '/login', // 定义路径为根路径 '/Login'
		name: 'Login', // 路由名称为 'Login'
		component: () => import('@/views/Login/Login.vue') // 组件对应的 Vue 文件为 src/views/Login/Login.vue
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL), // 使用 Web History 模式
	routes // 应用定义的路由规则
})

export default router
