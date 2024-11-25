/**
 * @file Stylelint 配置文件
 * @description 配置 Stylelint 规则，确保项目的 CSS/SASS/LESS 等样式代码风格统一
 * @example 使用此文件的配置，Stylelint 会根据规则校验样式文件
 * @version 1.0.0
 * @date 2024-11-19
 * @module StylelintConfig
 * @see https://stylelint.io/
 * @see https://stylelint.io/user-guide/rules/list/
 * @requires stylelint-order
 * @requires postcss-html
 * @requires stylelint-config-standard
 * @requires stylelint-config-recommended
 * @requires stylelint-config-html
 * @requires vue-eslint-parser
 * @author [吴尘](https://github.com/wucunping)
 */

module.exports = {
  /**
   * 指定 Stylelint 是否运行在项目根目录
   */
  root: true,

  /**
   * 配置使用的 Stylelint 插件
   * - stylelint-order: 用于对 CSS 属性进行排序
   */
  plugins: ['stylelint-order'],

  /**
   * 自定义语法解析器
   * - postcss-html: 支持 HTML 文件中嵌入的样式
   */
  customSyntax: 'postcss-html',

  /**
   * 扩展的规则集合
   * - stylelint-config-standard: 标准规则集合
   */
  extends: ['stylelint-config-standard'],

  /**
   * 自定义规则
   */
  rules: {
    /**
     * 允许使用未知的伪类，例如 `:global` 和 `:deep`
     */
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep']
      }
    ],

    /**
     * 允许使用未知的 at-rules，例如 SASS 的 `@mixin`
     */
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin']
      }
    ],

    'media-query-no-invalid': null, // 禁用无效媒体查询校验
    'function-no-unknown': null, // 禁用无效函数校验
    'no-empty-source': null, // 禁用空文件的警告
    'named-grid-areas-no-invalid': null, // 禁用无效的命名网格区域校验
    'no-descending-specificity': null, // 禁用选择器优先级降序警告
    'font-family-no-missing-generic-family-keyword': null, // 禁用字体缺少通用族关键字警告

    /**
     * 在规则前插入空行
     */
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested']
      }
    ],

    /**
     * 允许未知的单位，例如 `rpx`
     */
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx']
      }
    ],

    /**
     * 属性、规则和声明的排序规则
     */
    'order/order': [
      [
        'dollar-variables', // SASS 变量
        'custom-properties', // 自定义 CSS 属性
        'at-rules', // @ 规则
        'declarations', // 样式声明
        {
          type: 'at-rule',
          name: 'supports' // @supports 规则
        },
        {
          type: 'at-rule',
          name: 'media' // 媒体查询
        },
        'rules' // 嵌套规则
      ],
      {
        severity: 'warning' // 设置排序警告级别
      }
    ],

    /**
     * CSS 属性的排序规则
     * 使用字母顺序排列
     */
    'order/properties-order': [
      // 详细的属性排序规则...
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'margin-collapse',
      'margin-top-collapse',
      'margin-right-collapse',
      'margin-bottom-collapse',
      'margin-left-collapse',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
      'font',
      'font-family',
      'font-size',
      'font-smoothing',
      'osx-font-smoothing',
      'font-style',
      'font-weight',
      'hyphens',
      'src',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'color',
      'text-align',
      'text-decoration',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-size-adjust',
      'text-shadow',
      'text-transform',
      'word-break',
      'word-wrap',
      'white-space',
      'vertical-align',
      'list-style',
      'list-style-type',
      'list-style-position',
      'list-style-image',
      'pointer-events',
      'cursor',
      'background',
      'background-attachment',
      'background-color',
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'border',
      'border-collapse',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-color',
      'border-image',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'border-spacing',
      'border-style',
      'border-top-style',
      'border-right-style',
      'border-bottom-style',
      'border-left-style',
      'border-width',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'border-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-top-left-radius',
      'border-radius-topright',
      'border-radius-bottomright',
      'border-radius-bottomleft',
      'border-radius-topleft',
      'content',
      'quotes',
      'outline',
      'outline-offset',
      'opacity',
      'filter',
      'visibility',
      'size',
      'zoom',
      'transform',
      'box-align',
      'box-flex',
      'box-orient',
      'box-pack',
      'box-shadow',
      'box-sizing',
      'table-layout',
      'animation',
      'animation-delay',
      'animation-duration',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
      'animation-fill-mode',
      'transition',
      'transition-delay',
      'transition-duration',
      'transition-property',
      'transition-timing-function',
      'background-clip',
      'backface-visibility',
      'resize',
      'appearance',
      'user-select',
      'interpolation-mode',
      'direction',
      'marks',
      'page',
      'set-link-source',
      'unicode-bidi',
      'speak'
    ]
  },

  /**
   * 忽略的文件类型
   */
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],

  /**
   * 针对特定文件的规则覆盖
   */
  overrides: [
    {
      files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
      extends: ['stylelint-config-recommended', 'stylelint-config-html'],
      rules: {
        'keyframes-name-pattern': null, // 禁用 keyframe 名称模式校验
        'selector-class-pattern': null, // 禁用选择器类名模式校验
        'no-duplicate-selectors': null, // 禁用重复选择器警告

        /**
         * 允许未知伪类，例如 `:deep` 和 `:global`
         */
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['deep', 'global']
          }
        ],

        /**
         * 允许未知伪元素，例如 `::v-deep`
         */
        'selector-pseudo-element-no-unknown': [
          true,
          {
            ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
          }
        ]
      }
    }
  ]
}
