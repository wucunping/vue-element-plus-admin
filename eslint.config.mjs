/**
 * @file ESLint 配置文件
 * @description 针对 Vue 3 项目，结合 TypeScript、Prettier 和 ESLint 的推荐配置，定制了代码校验规则
 * @example 使用此文件配置 ESLint 检查代码的规范性
 * @version 1.0.0
 * @date 2024-11-19
 * @module ESLintConfigVueTS
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Vue 模板的 ESLint 插件
import pluginVue from 'eslint-plugin-vue'

// 引入 ESLint 的核心配置
import eslint from '@eslint/js'

// 引入 TypeScript ESLint，用于解析 TypeScript 语法
import tseslint from 'typescript-eslint'

// 引入 Vue 文件解析器
import vueParser from 'vue-eslint-parser'

// 引入 Prettier 插件
import prettier from 'eslint-plugin-prettier'

export default tseslint.config({
  /**
   * 配置文件作用的文件范围
   * 支持 TS、TSX 和 Vue 文件
   */
  files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],

  /**
   * 扩展的规则集
   * 包括 ESLint、TypeScript 和 Vue 的推荐规则
   */
  extends: [
    eslint.configs.recommended, // ESLint 推荐规则
    ...tseslint.configs.recommended, // TypeScript 推荐规则
    ...pluginVue.configs['flat/essential'] // Vue 推荐的基础规则
  ],

  /**
   * 插件配置
   */
  plugins: {
    prettier // Prettier 插件，用于格式化代码
  },

  /**
   * 语言选项配置
   */
  languageOptions: {
    parser: vueParser, // 使用 Vue 文件解析器，支持 .vue 文件
    parserOptions: {
      parser: tseslint.parser, // 在 Vue 文件中使用 TypeScript 解析器
      sourceType: 'module', // 使用 ES 模块语法
      ecmaVersion: 2020, // 支持 ECMAScript 2020
      ecmaFeatures: {
        jsx: true // 支持 JSX 语法
      }
    }
  },

  /**
   * 自定义规则
   */
  rules: {
    'prettier/prettier': 'error', // 强制使用 Prettier 格式化
    'no-useless-escape': 0, // 允许不必要的转义字符
    'no-undef': 0, // 允许使用未定义的变量
    'vue/no-setup-props-destructure': 0, // 允许解构 setup 中的 props
    'vue/script-setup-uses-vars': 1, // 警告未使用的变量
    'vue/no-reserved-component-names': 0, // 允许使用保留的组件名称

    // TypeScript 相关规则
    '@typescript-eslint/ban-ts-ignore': 0, // 允许使用 @ts-ignore
    '@typescript-eslint/explicit-function-return-type': 0, // 不强制要求显式声明函数返回类型
    '@typescript-eslint/no-explicit-any': 0, // 允许使用 any 类型
    '@typescript-eslint/no-var-requires': 0, // 允许使用 require
    '@typescript-eslint/no-empty-function': 0, // 允许空函数
    'vue/custom-event-name-casing': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 0, // 允许变量在定义前使用
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-unused-vars': 0, // 允许未使用的变量
    'no-unused-vars': 0,
    'space-before-function-paren': 0,
    // Vue 相关规则
    'vue/attributes-order': 0, // 不强制要求属性顺序
    'vue/one-component-per-file': 0, // 允许一个文件中多个组件
    'vue/html-closing-bracket-newline': 0, // 不强制要求 HTML 闭合标签换行
    'vue/max-attributes-per-line': 0, // 不限制每行最大属性数
    'vue/multiline-html-element-content-newline': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/attribute-hyphenation': 0,
    'vue/require-default-prop': 0,
    'vue/require-explicit-emits': 0,
    'vue/html-self-closing': [
      1,
      {
        html: {
          void: 'always', // 空标签总是自闭合
          normal: 'never', // 普通标签不使用自闭合
          component: 'always' // 组件总是自闭合
        },
        svg: 'always', // SVG 标签总是自闭合
        math: 'always' // Math 标签总是自闭合
      }
    ],
    'vue/multi-word-component-names': 0, // 允许单词组件名称
    'vue/no-v-html': 0, // 允许使用 v-html 指令
    'vue/require-toggle-inside-transition': 0 // 不强制要求在过渡中使用显式的切换元素
  }
})
