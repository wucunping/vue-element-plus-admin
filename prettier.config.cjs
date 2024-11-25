/**
 * @file Prettier 配置文件
 * @description 配置代码格式化规则，统一项目代码风格
 * @example 使用此文件的配置，Prettier 将根据规则格式化代码
 * @version 1.0.0
 * @date 2024-11-19
 * @module PrettierConfig
 * @see https://prettier.io/docs/en/configuration.html
 * @see https://prettier.io/playground/
 * @requires prettier
 * @author [吴尘](https://github.com/wucunping)
 */

module.exports = {
  /**
   * 单行代码的最大长度
   * 默认值：80
   */
  printWidth: 100,

  /**
   * 每个缩进级别的空格数
   * 默认值：2
   */
  tabWidth: 2,

  /**
   * 是否使用制表符缩进（true）或空格缩进（false）
   * 默认值：false
   */
  useTabs: false,

  /**
   * 是否在语句末尾添加分号
   * 默认值：true
   */
  semi: false,

  /**
   * 是否缩进 Vue 文件中的 `<script>` 和 `<style>` 标签内容
   * 默认值：false
   */
  vueIndentScriptAndStyle: false,

  /**
   * 是否使用单引号代替双引号
   * 默认值：false
   */
  singleQuote: true,

  /**
   * 在对象属性中仅在需要时为属性添加引号
   * 选项：
   * - "as-needed"：仅在需要时添加引号
   * - "consistent"：所有属性都添加引号
   * - "preserve"：保持原样
   * 默认值："as-needed"
   */
  quoteProps: 'as-needed',

  /**
   * 在对象文字中是否在括号和对象内容之间添加空格
   * 默认值：true
   */
  bracketSpacing: true,

  /**
   * 是否在多行中最后一行后添加逗号
   * 选项：
   * - "none"：不添加逗号
   * - "es5"：在 ES5 兼容的语法中添加逗号
   * - "all"：在可能的地方添加逗号
   * 默认值："es5"
   */
  trailingComma: 'none',

  /**
   * 是否在 JSX 中使用单引号
   * 默认值：false
   */
  jsxSingleQuote: false,

  /**
   * 箭头函数参数是否总是加括号
   * 选项：
   * - "always"：总是添加括号
   * - "avoid"：仅在必要时添加括号
   * 默认值："always"
   */
  arrowParens: 'always',

  /**
   * 是否在文件头部插入特殊的格式化注释
   * 默认值：false
   */
  insertPragma: false,

  /**
   * 是否仅格式化包含特殊格式化注释的文件
   * 默认值：false
   */
  requirePragma: false,

  /**
   * 是否换行 Markdown 文本
   * 选项：
   * - "always"：总是换行
   * - "never"：不换行
   * - "preserve"：保持原样
   * 默认值："preserve"
   */
  proseWrap: 'never',

  /**
   * HTML 文件中的空白敏感度
   * 选项：
   * - "css"：依据 CSS 显示属性的默认值
   * - "strict"：空白敏感
   * - "ignore"：空白不敏感
   * 默认值："css"
   */
  htmlWhitespaceSensitivity: 'strict',

  /**
   * 行结束符的使用方式
   * 选项：
   * - "lf"：使用 Line Feed (\n)
   * - "crlf"：使用 Carriage Return and Line Feed (\r\n)
   * - "cr"：使用 Carriage Return (\r)
   * - "auto"：保持现有行结束符
   * 默认值："lf"
   */
  endOfLine: 'auto',

  /**
   * 格式化的起始范围
   * 默认值：0
   */
  rangeStart: 0
}
