// 导入 Node.js 的 path 模块
import { resolve } from 'path'
// 从 vite 中导入 loadEnv 方法
import { loadEnv } from 'vite'
// 从 vite 中导入 UserConfig 和 ConfigEnv 类型
import type { UserConfig, ConfigEnv } from 'vite'
// 导入 Vue 插件
import vue from '@vitejs/plugin-vue'
// 导入 Vue JSX 插件
import VueJsx from '@vitejs/plugin-vue-jsx'
// 导入进度插件
import progress from 'vite-plugin-progress'
// 导入 ESLint 插件
import EslintPlugin from 'vite-plugin-eslint'
// 导入 EJS 插件
import { ViteEjsPlugin } from 'vite-plugin-ejs'
// 导入 Mock 插件
import { viteMockServe } from 'vite-plugin-mock'
// 导入 Purge Icons 插件
import PurgeIcons from 'vite-plugin-purge-icons'
// 导入 URL 复制插件
import ServerUrlCopy from 'vite-plugin-url-copy'
// 导入 国际化多语言 插件
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
// 导入 SVG 图标插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 导入样式导入插件
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
// 导入 UnoCSS 插件
import UnoCSS from 'unocss/vite'
// 导入 Rollup 可视化插件
import { visualizer } from 'rollup-plugin-visualizer'

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite' // 从 Vite 引入 defineConfig，用于导出 Vite 配置
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

//调试函数
function thisDebug(command: string, mode: string, env: any) {
	console.log(`output->当前工作目录`, root)
	console.log(`output->command`, command)
	console.log(`output->mode`, mode)
	console.log(`output->env`, env)
	console.log(`output->__dirname`, __dirname)
	console.log(`output->语言包路径`, resolve(__dirname, 'src/locales/**'))
	console.log(`output->是否全量引入element-plus样式`, env.VITE_USE_ALL_ELEMENT_PLUS_STYLE)
}

// 使用 defineConfig 方法定义并导出 Vite 的配置
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	let env = {} as any // 定义环境变量对象
	const isBuild = command === 'build' // 检查当前命令是否为构建命令
	// 根据命令加载不同的环境变量
	if (!isBuild) {
		env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)
	} else {
		env = loadEnv(mode, root)
	}
	if (mode === 'development') thisDebug(command, mode, env)
	return {
		// plugins 数组定义 Vite 的插件
		plugins: [
			vue({
				script: {
					// 开启定义模型
					defineModel: true
				}
			}), // 使用 Vue 插件处理 .vue 文件
			VueJsx(), // JSX 插件
			ServerUrlCopy(), // URL 复制插件
			progress(), // 进度插件
			env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === 'false'
				? createStyleImportPlugin({
						resolves: [ElementPlusResolve()], // 样式导入解析
						libs: [
							{
								libraryName: 'element-plus', // 指定库名称
								esModule: true,
								resolveStyle: (name) => {
									if (name === 'click-outside') {
										return '' // 特殊处理
									}
									return `element-plus/es/components/${name.replace(/^el-/, '')}/style/css` // 返回样式路径
								}
							}
						]
					})
				: undefined, // 全量引入 Element Plus 样式
			// ESLint 插件设置
			EslintPlugin({
				cache: false, // 不使用缓存
				failOnWarning: false, // 警告不失败
				failOnError: false, // 错误不失败
				include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
			}),
			// 国际化多语言 插件设置
			VueI18nPlugin({
				runtimeOnly: true, // 运行时支持
				compositionOnly: true, // 只支持组合式 API
				include: [resolve(__dirname, 'src/locales/**')] // 包含的路径
			}),
			// SVG 图标插件设置
			createSvgIconsPlugin({
				iconDirs: [pathResolve('src/assets/svgs')], // 图标目录
				symbolId: 'icon-[dir]-[name]', // 图标 ID 规则
				svgoOptions: true // 开启 svgo 优化
			}),
			PurgeIcons(), // Purge Icons 插件
			// 根据配置选择是否使用 Mock 服务
			env.VITE_USE_MOCK === 'true'
				? viteMockServe({
						ignore: /^\_/, // 忽略以 _ 开头的文件
						mockPath: 'mock', // Mock 文件路径
						enable: !isBuild // 本地启用
					})
				: undefined, // 如果不使用则返回 undefined
			// EJS 插件设置
			ViteEjsPlugin({
				title: env.VITE_APP_TITLE // 设置应用标题
			}),
			UnoCSS() // UnoCSS 插件
		],
		//css 配置项用于定制 CSS 相关的选项，比如预处理器、模块化、提取等功能。你可以在这里设置诸如支持的 CSS 预处理器（如 Sass、Less 等）、CSS 模块的启用与否等。
		css: {
			preprocessorOptions: {
				less: {
					additionalData: '@import "./src/styles/variables.module.less";', // 添加额外的样式变量
					javascriptEnabled: true // 启用 JavaScript
				}
			}
		},
		// resolve 选项用于配置模块如何解析
		resolve: {
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'], // 解析的文件扩展名
			// alias 选项定义路径别名
			alias: [
				{
					find: 'vue-i18n', // 替换 vue-i18n
					replacement: 'vue-i18n/dist/vue-i18n.cjs.js' // 指定替换路径
				},
				{
					find: '@', // 符号 '@' 代表 'src' 目录
					replacement: fileURLToPath(new URL('./src', import.meta.url)) // 具体替换路径
				}
			]
		},
		//esbuild 配置项用于配置 Vite 使用的 Esbuild 相关选项。Esbuild 是一个高性能的 JavaScript 和 CSS 打包工具。在这里你可以设置代码优化选项，比如是否移除 console.log 和 debugger 语句，以便在生产环境中减小代码体积。
		esbuild: {
			pure: env.VITE_DROP_CONSOLE === 'true' ? ['console.log'] : undefined, // 移除 console.log
			drop: env.VITE_DROP_DEBUGGER === 'true' ? ['debugger'] : undefined // 移除 debugger
		},
		//build 配置项用于设置项目的构建过程。这里可以定义构建目标、输出目录、是否生成 source map、使用的插件等。主要参数包括：
		build: {
			target: 'es2015', // 设置构建目标为 ES2015 ，指定构建目标的 JavaScript 版本。
			outDir: env.VITE_OUT_DIR || 'dist', // 定义构建输出文件的目录。
			sourcemap: env.VITE_SOURCEMAP === 'true', // 控制是否生成 sourcemap，以便于调试。
			// brotliSize: false,
			rollupOptions: {
				//用于进一步自定义 Rollup 相关打包过程的选项，包括启用插件和配置输出等。
				plugins: env.VITE_USE_BUNDLE_ANALYZER === 'true' ? [visualizer()] : undefined, // 根据配置启用 Rollup 可视化插件
				// 拆包配置
				output: {
					manualChunks: {
						'vue-chunks': ['vue', 'vue-router', 'pinia', 'vue-i18n'], // Vue 相关的 chunk
						'element-plus': ['element-plus'], // Element Plus 的 chunk
						'wang-editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'], // Wang Editor 的 chunk
						echarts: ['echarts', 'echarts-wordcloud'] // Echarts 的 chunk
					}
				}
			},
			cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === 'false'), // CSS 是否拆分
			cssTarget: ['chrome31'] // 目标浏览器版本
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
			include: [
				//里可以列出需要优化的依赖包，确保它们在项目启动时能够被更快地加载和使用
				'vue', // 包含的依赖 - Vue
				'vue-router', // 包含的依赖 - Vue Router
				'vue-types', // 包含的依赖 - Vue Types
				'element-plus/es/locale/lang/zh-cn', // 包含的依赖 - Element Plus 中文语言包
				'element-plus/es/locale/lang/en', // 包含的依赖 - Element Plus 英文语言包
				'@iconify/iconify', // 包含的依赖 - Iconify 图标库
				'@vueuse/core', // 包含的依赖 - VueUse 库
				'axios', // 包含的依赖 - Axios HTTP 客户端
				'qs', // 包含的依赖 - qs 查询字符串解析库
				'echarts', // 包含的依赖 - ECharts 图表库
				'echarts-wordcloud', // 包含的依赖 - ECharts 词云图插件
				'qrcode', // 包含的依赖 - QRCode 生成库
				'@wangeditor/editor', // 包含的依赖 - WangEditor 编辑器
				'@wangeditor/editor-for-vue', // 包含的依赖 - WangEditor Vue 适配器
				'vue-json-pretty', // 包含的依赖 - Vue JSON 格式化组件
				'@zxcvbn-ts/core', // 包含的依赖 - zxcvbn 密码强度检测库
				'dayjs', // 包含的依赖 - Day.js 日期处理库
				'cropperjs' // 包含的依赖 - Cropper.js 图片裁剪库
			]
		}
	}
})
