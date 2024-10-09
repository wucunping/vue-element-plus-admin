// 导入 Node.js 的 path 模块
import { resolve } from 'path'
// 导入 Vue I18n 插件
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite' // 从 Vite 引入 defineConfig，用于导出 Vite 配置
import vue from '@vitejs/plugin-vue' // 引入 Vite 的 Vue 插件，支持 Vue 文件的处理

/** 获取当前工作目录 */
const root = process.cwd()

/**
 * 路径解析函数
 * @param dir - 目标目录
 * @returns 解析后的路径
 */
function pathResolve(dir: string) {
	return resolve(root, '.', dir) // 解析路径并返回
}

// 使用 defineConfig 方法定义并导出 Vite 的配置
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	let env = {} as any // 定义环境变量对象
	const isBuild = command === 'build' // 检查当前命令是否为构建命令
	// console.log('获取当前工作目录', root)
	// console.log(`output->env`, env)
	// console.log(`output->isBuild`, isBuild)
	// console.log(`output->command`, resolve(__dirname, 'src/locales/**'))
	return {
		// plugins 数组定义 Vite 的插件
		plugins: [
			vue(), // 使用 Vue 插件处理 .vue 文件
			// Vue I18n 插件设置
			VueI18nPlugin({
				runtimeOnly: true, // 运行时支持
				compositionOnly: true, // 只支持组合式 API
				include: [resolve(__dirname, 'src/locales/**')] // 包含的路径
			})
		],
		// resolve 选项用于配置模块如何解析
		resolve: {
			// alias 选项定义路径别名
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)) // '@' 代表 'src' 目录，简化导入路径
			}
		},
		server: {
			port: 8080, // 服务端口，设置为8080
			open: false, // 启动时自动打开浏览器
			proxy: {
				// 用于配置代理规则，可以将请求转发到其他服务器，处理跨域问题。
				'/api': {
					// 指定代理路径为 '/api'
					target: 'http://127.0.0.1:8080', // 代理目标地址
					changeOrigin: true, // 修改请求头中的 Origin，避免跨域问题
					rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，将 '/api' 替换为空字符串
				}
			},
			hmr: {
				//热模块替换（Hot Module Replacement）相关设置，允许在不重新加载整个页面的情况下更新模块。
				overlay: false // 不显示热更新（HMR）错误覆盖
			},
			host: '0.0.0.0' // 监听所有地址，以便外部访问
		},
		optimizeDeps: {
			//配置项用于优化依赖管理。在开发中，Vite 会对项目中的依赖进行预构建，以提高启动速度和运行时性能。这个选项主要用来指定哪些依赖需要被预构建。
			// include: [
			// 	//里可以列出需要优化的依赖包，确保它们在项目启动时能够被更快地加载和使用
			// 	'vue', // 包含的依赖 - Vue
			// 	'vue-router', // 包含的依赖 - Vue Router
			// 	'vue-types', // 包含的依赖 - Vue Types
			// 	'element-plus/es/locale/lang/zh-cn', // 包含的依赖 - Element Plus 中文语言包
			// 	'element-plus/es/locale/lang/en', // 包含的依赖 - Element Plus 英文语言包
			// 	'@iconify/iconify', // 包含的依赖 - Iconify 图标库
			// 	'@vueuse/core', // 包含的依赖 - VueUse 库
			// 	'axios', // 包含的依赖 - Axios HTTP 客户端
			// 	'qs', // 包含的依赖 - qs 查询字符串解析库
			// 	'echarts', // 包含的依赖 - ECharts 图表库
			// 	'echarts-wordcloud', // 包含的依赖 - ECharts 词云图插件
			// 	'qrcode', // 包含的依赖 - QRCode 生成库
			// 	'@wangeditor/editor', // 包含的依赖 - WangEditor 编辑器
			// 	'@wangeditor/editor-for-vue', // 包含的依赖 - WangEditor Vue 适配器
			// 	'vue-json-pretty', // 包含的依赖 - Vue JSON 格式化组件
			// 	'@zxcvbn-ts/core', // 包含的依赖 - zxcvbn 密码强度检测库
			// 	'dayjs', // 包含的依赖 - Day.js 日期处理库
			// 	'cropperjs' // 包含的依赖 - Cropper.js 图片裁剪库
			// ]
		}
	}
})
