/**
 * @file helper.ts
 * @description 提供设置 HTML 页面语言的辅助函数
 * @example
 * // 设置页面语言为中文
 * setHtmlPageLang('zh-CN');
 *
 * // 设置页面语言为英文
 * setHtmlPageLang('en-US');
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module helper
 */
/**
 * 设置 HTML 页面的语言属性
 *
 * @param {LocaleType} locale - 要设置的语言区域码，例如 'zh-CN' 代表中文（中国）
 *
 * @example
 * // 使用示例
 * setHtmlPageLang('en-US'); // 设置页面语言为英语（美国）
 */
export const setHtmlPageLang = (locale: LocaleType) => {
	// 查找 HTML 标签，并设置其 lang 属性为传入的 locale 参数
	document.querySelector('html')?.setAttribute('lang', locale)
}
