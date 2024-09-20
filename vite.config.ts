import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite' // 从 Vite 引入 defineConfig，用于导出 Vite 配置
import vue from '@vitejs/plugin-vue' // 引入 Vite 的 Vue 插件，支持 Vue 文件的处理

// 使用 defineConfig 方法定义并导出 Vite 的配置
// https://vitejs.dev/config/
export default defineConfig({
	// plugins 数组定义 Vite 的插件
	plugins: [
		vue() // 使用 Vue 插件处理 .vue 文件
	],
	// resolve 选项用于配置模块如何解析
	resolve: {
		// alias 选项定义路径别名
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)) // '@' 代表 'src' 目录，简化导入路径
		}
	}
})
