/**
 * @file Vite 配置文件
 * @description 配置 Vite 开发工具，包括插件、路径别名、构建配置等
 * @example 使用此文件配置后，运行 `vite` 或 `vite build` 生成对应的开发/生产环境构建
 * @version 1.0.0
 * @date 2024-11-19
 * @module ViteConfig
 * @see https://vitejs.dev/config/
 * @requires vite
 */

// 引入 Node.js 的路径解析模块，用于生成绝对路径
import { resolve } from 'path'

// 引入 Vite 的环境变量加载方法，用于根据模式加载环境配置
import { loadEnv } from 'vite'

// 引入 Vite 的类型定义
import type { UserConfig, ConfigEnv } from 'vite'

// 引入 Vite 插件：支持 Vue 文件解析
import Vue from '@vitejs/plugin-vue'

// 引入 Vite 插件：支持 Vue JSX 语法
import VueJsx from '@vitejs/plugin-vue-jsx'

// 引入 Vite 插件：显示构建进度条
import progress from 'vite-plugin-progress'

// 引入 Vite 插件：启用 ESLint 静态检查
import EslintPlugin from 'vite-plugin-eslint'

// 引入 Vite 插件：支持 EJS 模板语法
import { ViteEjsPlugin } from 'vite-plugin-ejs'

// 引入 Vite 插件：启用 Mock 数据功能
import { viteMockServe } from 'vite-plugin-mock'

// 引入 Vite 插件：优化图标加载
import PurgeIcons from 'vite-plugin-purge-icons'

// 引入 Vite 插件：自动复制服务器 URL 到剪贴板
import ServerUrlCopy from 'vite-plugin-url-copy'

// 引入 Vite 插件：支持国际化 Vue I18n
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// 引入 Vite 插件：启用 SVG 图标功能
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 引入 Vite 插件：按需加载 Element Plus 样式
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

// 引入 UnoCSS 插件：支持 CSS 原子化
import UnoCSS from 'unocss/vite'

// 引入 Rollup 插件：生成可视化报告
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * 项目根路径
 */
const root = process.cwd()

/**
 * 路径解析函数
 * @param dir 相对路径
 * @returns 绝对路径
 */
function pathResolve(dir: string) {
  return resolve(root, '.', dir) // 返回基于项目根路径的绝对路径
}

/**
 * Vite 配置
 * @param {ConfigEnv} param0 Vite 提供的环境变量
 * @returns {UserConfig} 配置对象
 */
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build' // 判断是否为构建模式
  let env = {} as any // 用于存储加载的环境变量

  // 加载环境变量，根据开发模式或构建模式动态加载
  if (!isBuild) {
    env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)
  } else {
    env = loadEnv(mode, root)
  }

  return {
    /**
     * 公共基础路径
     * 用于设置资源文件的引用路径，默认为 `/`
     */
    base: env.VITE_BASE_PATH,

    /**
     * 插件配置
     * 包括 Vue 支持、Mock 数据、国际化、按需加载样式等
     */
    plugins: [
      Vue({
        script: {
          defineModel: true // 开启 defineModel 支持，支持 Vue 3 新语法
        }
      }),
      VueJsx(), // 启用 JSX 支持
      ServerUrlCopy(), // 自动将服务器 URL 复制到剪贴板
      progress(), // 显示构建进度条
      env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === 'false'
        ? createStyleImportPlugin({
            resolves: [ElementPlusResolve()], // 按需加载 Element Plus 样式
            libs: [
              {
                libraryName: 'element-plus',
                esModule: true,
                resolveStyle: (name) => {
                  if (name === 'click-outside') {
                    return '' // 忽略 `click-outside` 的样式加载
                  }
                  return `element-plus/es/components/${name.replace(/^el-/, '')}/style/css` // 按需解析样式路径
                }
              }
            ]
          })
        : undefined,
      EslintPlugin({
        cache: false, // 禁用 ESLint 缓存
        failOnWarning: false, // 忽略警告
        failOnError: false, // 忽略错误
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件类型
      }),
      VueI18nPlugin({
        runtimeOnly: true, // 使用运行时模式
        compositionOnly: true, // 仅支持 Composition API
        include: [resolve(__dirname, 'src/locales/**')] // 加载国际化语言包路径
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve('src/assets/svgs')], // 指定 SVG 文件路径
        symbolId: 'icon-[dir]-[name]', // 图标 ID 规则
        svgoOptions: true // 启用 SVGO 优化
      }),
      PurgeIcons(), // 清理未使用的图标
      env.VITE_USE_MOCK === 'true'
        ? viteMockServe({
            ignore: /^\_/, // 忽略下划线开头的文件
            mockPath: 'mock', // Mock 数据文件路径
            localEnabled: !isBuild, // 开发模式下启用
            prodEnabled: isBuild, // 构建模式下启用
            injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer'
          setupProdMockServer()
          ` // 注入 Mock 数据代码
          })
        : undefined,
      ViteEjsPlugin({
        title: env.VITE_APP_TITLE // 使用环境变量设置 EJS 模板标题
      }),
      UnoCSS() // 启用 UnoCSS 支持
    ],

    /**
     * CSS 预处理器配置
     * 支持 Less 语法，并加载全局样式变量
     */
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/variables.module.less";', // 全局变量
          javascriptEnabled: true // 支持在 Less 中使用 JavaScript
        }
      }
    },

    /**
     * 模块解析配置
     * 设置文件扩展名和路径别名
     */
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'], // 支持的文件扩展名
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js' // 替换为 CommonJS 格式的 vue-i18n
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/` // `@` 路径别名映射到 `src` 目录
        }
      ]
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE === 'true' ? ['console.log'] : undefined, // 当环境变量 VITE_DROP_CONSOLE 为 'true' 时，删除控制台日志
      drop: env.VITE_DROP_DEBUGGER === 'true' ? ['debugger'] : undefined // 当环境变量 VITE_DROP_DEBUGGER 为 'true' 时，删除调试器语句
    },

    /**
     * 构建配置
     * 设置构建目标、输出目录和分包策略
     */
    build: {
      target: 'es2015', // 构建目标为 ES2015
      outDir: env.VITE_OUT_DIR || 'dist', // 输出目录
      sourcemap: env.VITE_SOURCEMAP === 'true', // 是否生成 Source Map
      rollupOptions: {
        plugins: env.VITE_USE_BUNDLE_ANALYZER === 'true' ? [visualizer()] : undefined, // 如果启用，添加构建分析插件
        output: {
          manualChunks: {
            'vue-chunks': ['vue', 'vue-router', 'pinia', 'vue-i18n'], // Vue 核心库分包
            'element-plus': ['element-plus'], // Element Plus 分包
            'wang-editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'], // 文本编辑器分包
            echarts: ['echarts', 'echarts-wordcloud'] // Echarts 分包
          }
        }
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === 'false'), // 是否拆分 CSS
      cssTarget: ['chrome31'] // 最低支持的浏览器版本
    },

    /**
     * 开发服务器配置
     * 设置端口号、代理规则和热更新选项
     */
    server: {
      port: 8000, // 开发服务器端口号
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000', // 代理到本地后端服务
          changeOrigin: true, // 修改源头
          rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
        }
      },
      hmr: {
        overlay: false // 禁用热更新错误覆盖层
      },
      host: '0.0.0.0' // 设置主机为 0.0.0.0，允许外部访问
    },

    /**
     * 依赖优化配置
     * 优化常用依赖包的加载速度
     */
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-types',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        '@iconify/iconify',
        '@vueuse/core',
        'axios',
        'qs',
        'echarts',
        'echarts-wordcloud',
        'qrcode',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
        'vue-json-pretty',
        '@zxcvbn-ts/core',
        'dayjs',
        'cropperjs'
      ]
    }
  }
}
