/**
 * @file helper.ts
 * @description 提供设置 HTML 页面语言的工具函数
 * @example
 * // 使用示例
 * setHtmlPageLang('zh-CN');
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module Helper
 */

/**
 * 设置 HTML 页面语言
 * @param locale - 语言类型，符合 LocaleType
 */
export const setHtmlPageLang = (locale: LocaleType) => {
  // 查询 HTML 标签并设置 lang 属性
  document.querySelector('html')?.setAttribute('lang', locale)
}
