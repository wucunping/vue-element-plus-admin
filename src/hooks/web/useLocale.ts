/**
 * @file useLocale.ts
 * @description 处理语言环境相关的功能模块
 * @example
 * const { changeLocale } = useLocale();
 * changeLocale('en'); // 切换语言为英文
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module locale
 */

import { i18n } from '@/plugins/vueI18n' // 导入 i18n 实例，用于处理国际化
import { useLocaleStoreWithOut } from '@/store/modules/locale' // 导入 locale 存储模块，用于获取和设置语言状态
import { setHtmlPageLang } from '@/plugins/vueI18n/helper' // 导入设置 HTML 页面语言的辅助函数

/**
 * 设置国际化语言
 * @param locale {LocaleType} 需要设置的语言环境
 */
const setI18nLanguage = (locale: LocaleType) => {
  const localeStore = useLocaleStoreWithOut() // 获取语言状态存储

  // 如果 i18n 处于传统模式
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale // 设置全局语言为传入的语言
  }
  // 如果 i18n 处于非传统模式
  else {
    ;(i18n.global.locale as any).value = locale // 通过 value 属性设置语言
  }
  // 更新语言状态存储
  localeStore.setCurrentLocale({
    lang: locale // 更新当前语言
  })
  setHtmlPageLang(locale) // 设置 HTML 页面语言
}

/**
 * 使用语言环境
 * @returns {Object} 提供的语言更换功能
 */
export const useLocale = () => {
  // 切换语言会更改 useI18n 的语言环境，并提交配置修改
  /**
   * 更换语言环境
   * @param locale {LocaleType} 目标语言环境
   * @returns {Promise<void>} 更换语言后的 Promise
   */
  const changeLocale = async (locale: LocaleType) => {
    const globalI18n = i18n.global // 获取全局 i18n 实例

    const langModule = await import(`../../locales/${locale}.ts`) // 动态导入对应语言的语言包

    globalI18n.setLocaleMessage(locale, langModule.default) // 设置全局语言消息

    setI18nLanguage(locale) // 调用设置语言函数
  }

  return {
    changeLocale // 返回语言更换函数
  }
}
