/**
 * @file index.ts
 * @description 该文件用于设置 Vue 应用的国际化(i18n)功能，包含创建 i18n 实例以及更新当前语言的方法。
 * @example
 * import { createApp } from 'vue';
 * import { setupI18n } from './index';
 * const app = createApp(App);
 * setupI18n(app);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module i18n
 */
import type { App } from 'vue' // 引入 Vue 的 App 类型，用于类型定义
import { createI18n } from 'vue-i18n' // 从 vue-i18n 中引入 createI18n 方法，用于创建国际化实例
import { useLocaleStoreWithOut } from '@/store/modules/locale' // 引入用于获取当前语言和语言映射的本地化存储方法
import type { I18n, I18nOptions } from 'vue-i18n' // 引入 I18n 和 I18nOptions 类型定义
import { setHtmlPageLang } from './helper' // 引入设置 HTML 页面语言的 helper 方法

/** 定义一个全局变量 i18n，用于存储创建的 i18n 实例 */
export let i18n: ReturnType<typeof createI18n>

/**
 * 创建 i18n 的选项
 * @returns {Promise<I18nOptions>} 返回一个包含国际化选项的 Promise
 */
const createI18nOptions = async (): Promise<I18nOptions> => {
  const localeStore = useLocaleStoreWithOut() // 获取本地化存储的实例
  const locale = localeStore.getCurrentLocale // 获取当前语言
  const localeMap = localeStore.getLocaleMap // 获取可用语言映射
  const defaultLocal = await import(`../../locales/${locale.lang}.ts`) // 动态导入当前语言的本地化文件
  const message = defaultLocal.default ?? {} // 获取本地化消息，如果不存在则为一个空对象

  setHtmlPageLang(locale.lang) // 设置 HTML 页面的语言

  localeStore.setCurrentLocale({
    // 更新当前语言到本地化存储
    lang: locale.lang
    // elLocale: elLocal
  })

  // 返回 i18n 的选项
  return {
    legacy: false, // 使用组合式 API，禁用遗留的 Vue 2 选项
    locale: locale.lang, // 当前语言
    fallbackLocale: locale.lang, // 后备语言
    messages: {
      // 国际化消息对象
      [locale.lang]: message // 当前语言的消息
    },
    availableLocales: localeMap.map((v) => v.lang), // 可用语言列表
    sync: true, // 同步更新
    silentTranslationWarn: true, // 静默翻译警告
    missingWarn: false, // 不显示缺失的警告
    silentFallbackWarn: true // 静默后备警告
  }
}

/**
 * 设置 i18n 实例
 * @param {App<Element>} app - Vue 应用实例
 */
export const setupI18n = async (app: App<Element>) => {
  const options = await createI18nOptions() // 获取国际化选项
  i18n = createI18n(options) as I18n // 创建 i18n 实例并赋值给全局变量
  app.use(i18n) // 在应用中使用 i18n 实例
}
