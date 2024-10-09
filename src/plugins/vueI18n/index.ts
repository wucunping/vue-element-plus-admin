/**
 * @file index.ts
 * @description 配置和初始化 Vue 应用的国际化(i18n)功能
 * @example
 * // 在 Vue 应用中设置 i18n
 * import { setupI18n } from './index';
 *
 * const app = createApp(App);
 * setupI18n(app);
 * app.mount('#app');
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module i18n
 */
import type { App } from 'vue' // 从 Vue 导入 App 类型
import { createI18n } from 'vue-i18n' // 从 vue-i18n 导入创建 i18n 实例的方法
import { useLocaleStoreWithOut } from '@/store/modules/locale' // 导入用于访问语言存储的 hooks
import type { I18n, I18nOptions } from 'vue-i18n' // 从 vue-i18n 导入 I18n 和 I18nOptions 类型
import { setHtmlPageLang } from './helper' // 导入设置 HTML 页面语言的辅助函数

/**
 * 导出创建的 i18n 实例
 */
export let i18n: ReturnType<typeof createI18n>

/**
 * 创建 i18n 配置选项
 * @returns {Promise<I18nOptions>} 返回 i18n 配置选项
 */
const createI18nOptions = async (): Promise<I18nOptions> => {
	// 获取 locale 存储
	const localeStore = useLocaleStoreWithOut() // 调用 useLocaleStoreWithOut 获取语言存储
	// 获取当前语言
	const locale = localeStore.getCurrentLocale // 从语言存储获取当前选定的语言
	// 获取可用语言映射
	const localeMap = localeStore.getLocaleMap // 从语言存储获取可用语言的映射
	// 动态导入默认语言包
	const defaultLocal = await import(`../../locales/${locale.lang}.ts`) // 根据当前语言动态导入对应的语言包
	const message = defaultLocal.default ?? {} // 提取导入的默认语言包中的消息对象，如果没有则使用空对象

	// 设置 HTML 页面语言
	setHtmlPageLang(locale.lang) // 调用函数设置 HTML 页面中的语言属性

	// 更新当前语言设置
	localeStore.setCurrentLocale({
		// 在语言存储中设置当前语言
		lang: locale.lang // 设置语言字段为当前语言
		// elLocale: elLocal // 注释掉的代码，可能用于其他地方
	})

	// 返回 i18n 配置选项
	return {
		// 返回一个包含 i18n 配置的对象
		legacy: false, // 设定是否使用 legacy 模式
		locale: locale.lang, // 当前语言设置
		fallbackLocale: locale.lang, // 回退语言设置，默认为当前语言
		messages: {
			// 设置语言消息
			[locale.lang]: message // 使用当前语言作为键，对应的消息对象为导入的消息
		},
		availableLocales: localeMap.map((v) => v.lang), // 提取可用语言列表
		sync: true, // 是否同步语言
		silentTranslationWarn: true, // 是否静默翻译警告
		missingWarn: false, // 是否提示缺失翻译的警告
		silentFallbackWarn: true // 是否静默回退警告
	}
}

/**
 * 设置 i18n 插件
 * @param {App<Element>} app - Vue 应用实例
 */
export const setupI18n = async (app: App<Element>) => {
	// 创建 i18n 配置选项
	const options = await createI18nOptions()
	// 创建 i18n 实例
	// i18n = createI18n(options) as I18n
	i18n = createI18n(options) as unknown as I18n<
		Record<string, unknown>,
		Record<string, unknown>,
		Record<string, unknown>,
		unknown,
		boolean
	>
	// 在 Vue 应用中使用 i18n 插件
	app.use(i18n)
}
