/**
 * @file locale.ts
 * @description 该文件定义了设置和切换应用程序的本地化语言的功能。
 * @example
 * 引入useLocale并使用changeLocale方法切换语言
 * import { useLocale } from './locale'
 * const { changeLocale } = useLocale()
 * changeLocale('en-US')
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入vue-i18n的国际化实例
import { i18n } from '@/plugins/vueI18n'
// 引入自定义的locale状态管理库
import { useLocaleStoreWithOut } from '@/store/modules/locale'
// 引入用于设置HTML页面语言的辅助函数
import { setHtmlPageLang } from '@/plugins/vueI18n/helper'

/**
 * 定义设置i18n语言的函数，接受一个LocaleType类型的参数
 *
 * @description 设置i18n语言
 * @param {LocaleType} locale - 语言类型
 */
const setI18nLanguage = (locale: LocaleType) => {
	// 使用locale状态管理库，获取当前的locale状态
	const localeStore = useLocaleStoreWithOut()

	// 判断i18n的模式，如果是legacy模式，则直接设置locale，否则设置locale的value属性
	if (i18n.mode === 'legacy') {
		i18n.global.locale = locale
	} else {
		;(i18n.global.locale as any).value = locale
	}
	// 在locale状态管理库中设置当前的语言
	localeStore.setCurrentLocale({
		lang: locale
	})
	// 设置HTML页面的语言
	setHtmlPageLang(locale)
}

/**
 * 定义一个名为useLocale的hook，用于切换语言
 *
 * @description 切换语言的hook
 * @returns {{changeLocale: Function}} 返回一个包含changeLocale方法的对象
 */
export const useLocale = () => {
	/**
	 * 定义一个异步的changeLocale方法，接受一个LocaleType类型的参数
	 *
	 * @description 切换语言的方法
	 * @param {LocaleType} locale - 要切换到的语言
	 * @returns {Promise<void>} 返回一个Promise对象，表示异步操作的结果
	 */
	const changeLocale = async (locale: LocaleType) => {
		// 获取i18n的全局实例
		const globalI18n = i18n.global

		// 动态导入对应语言的本地化模块
		const langModule = await import(`../../locales/${locale}.ts`)

		// 在i18n的全局实例中设置对应语言的本地化信息
		globalI18n.setLocaleMessage(locale, langModule.default)

		// 调用setI18nLanguage函数，设置i18n的语言
		setI18nLanguage(locale)
	}

	// 返回一个包含changeLocale方法的对象
	return {
		changeLocale
	}
}
