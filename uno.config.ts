/**
 * @file UnoCSS 配置文件
 * @description 用于配置 UnoCSS 规则、预设和转换器，提供高效的按需生成 CSS 样式功能
 * @example 使用此配置文件，结合预设和自定义规则生成对应的样式
 * @version 1.0.0
 * @date 2024-11-19
 * @module UnoCSSConfig
 * @see https://github.com/unocss/unocss
 * @requires unocss
 * @requires vite
 * @requires @unocss/transformer-variant-group
 */

// 引入 UnoCSS 的配置定义方法和工具函数
import { defineConfig, toEscapedSelector as e, presetUno, presetIcons } from 'unocss'

// 引入 UnoCSS 的变体分组转换器，用于支持分组类名
import transformerVariantGroup from '@unocss/transformer-variant-group'

// 引入 Vite 的环境变量加载方法，用于动态读取环境变量
import { loadEnv } from 'vite'

// 引入项目中定义的图标前缀常量
import { ICON_PREFIX } from './src/constants'

/**
 * 项目根路径
 */
const root = process.cwd()

/**
 * 创建图标预设
 * 根据环境变量选择是否启用在线图标
 * @returns {Array} 图标预设数组
 */
const createPresetIcons = () => {
  const isBuild = !!process.argv[4] // 判断是否为构建环境
  let env = {} as any

  if (!isBuild) {
    env = loadEnv(process.argv[3], root) // 加载开发环境变量
  } else {
    env = loadEnv(process.argv[4], root) // 加载生产环境变量
  }

  // 根据环境变量决定是否启用在线图标
  if (env.VITE_USE_ONLINE_ICON === 'true') {
    return [] // 不启用本地图标
  } else {
    return [
      presetIcons({
        autoInstall: false, // 禁用自动安装
        prefix: ICON_PREFIX // 图标前缀
      })
    ]
  }
}

/**
 * UnoCSS 配置
 */
export default defineConfig({
  /**
   * 自定义规则
   * @description 定义特定功能的 CSS 规则
   */
  rules: [
    /**
     * 单行文字溢出省略号样式
     * 选择器：`overflow-ellipsis`
     */
    [
      /^overflow-ellipsis$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  text-overflow: ellipsis;
}
`
      }
    ],
    /**
     * 自定义 hover 样式
     * 选择器：`custom-hover`
     */
    [
      /^custom-hover$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  display: flex;
  height: 100%;
  padding: 1px 10px 0;
  cursor: pointer;
  align-items: center;
  transition: background var(--transition-time-02);
}
${selector}:hover {
  background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
  background-color: var(--el-bg-color-overlay);
}
`
      }
    ],
    /**
     * 左边框样式
     * 选择器：`layout-border__left`
     */
    [
      /^layout-border__left$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    /**
     * 右边框样式
     * 选择器：`layout-border__right`
     */
    [
      /^layout-border__right$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    /**
     * 上边框样式
     * 选择器：`layout-border__top`
     */
    [
      /^layout-border__top$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    /**
     * 下边框样式
     * 选择器：`layout-border__bottom`
     */
    [
      /^layout-border__bottom$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ]
  ],

  /**
   * UnoCSS 预设
   * 包含 UnoCSS 的基础预设和自定义的图标预设
   */
  presets: [
    presetUno({
      dark: 'class', // 使用 class 控制深色模式
      attributify: false // 禁用属性化模式
    }),
    ...createPresetIcons() // 动态添加图标预设
  ],

  /**
   * UnoCSS 转换器
   * @description 组合类名时支持分组语法
   */
  transformers: [transformerVariantGroup()],

  /**
   * UnoCSS 内容选项
   * 指定扫描的文件类型和内容
   */
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/] // 匹配需要处理的文件类型
    }
  }
})
