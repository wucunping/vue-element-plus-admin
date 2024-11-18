/**
 * @file locale.ts
 * @description 多语言状态管理模块，支持语言切换及本地化设置。
 * @example
 *  // 获取当前语言
 *  const localeStore = useLocaleStore();
 *  console.log(localeStore.getCurrentLocale);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module locales
 */

// 引入pinia中的defineStore函数用于定义状态管理商店
import { defineStore } from 'pinia'
// 引入全局store对象
import { store } from '../index'
// 引入Element Plus 中文和英文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
// 引入自定义的存储hook
import { useStorage } from '@/hooks/web/useStorage'
// 引入语言下拉组件的类型
import { LocaleDropdownType } from '@/components/LocaleDropdown'

//使用存储钩子，用于处理语言设置的持久化
const { getStorage, setStorage } = useStorage('localStorage')

/** Element Plus 内置语言映射表 */
const elLocaleMap = {
  'zh-CN': zhCn,
  en: en
}

/** 定义LocaleState接口，表示语言状态的结构 */
interface LocaleState {
  /** 当前语言 */
  currentLocale: LocaleDropdownType
  /** 可用语言列表 */
  localeMap: LocaleDropdownType[]
}

/**
 * useLocaleStore函数，定义一个状态管理商店
 * @returns {Object} 返回包含状态、getter和action的商店
 */
export const useLocaleStore = defineStore('locales', {
  state: (): LocaleState => {
    return {
      // 初始化当前语言，使用localStorage中的语言，默认为简体中文
      currentLocale: {
        lang: getStorage('lang') || 'zh-CN',
        elLocale: elLocaleMap[getStorage('lang') || 'zh-CN'] // 当前语言对应的 Element Plus 配置
      },
      // 多语言 支持的语言映射表
      localeMap: [
        {
          lang: 'zh-CN', // 语言代码
          name: '简体中文' // 语言名称
        },
        {
          lang: 'en',
          name: 'English'
        }
      ]
    }
  },
  getters: {
    /**
     * 获取当前语言设置
     * @returns {LocaleDropdownType} 当前语言配置
     */
    getCurrentLocale(): LocaleDropdownType {
      return this.currentLocale
    },
    /**
     * 获取所有支持的语言映射表
     * @returns {LocaleDropdownType[]} 支持的语言映射表
     */
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap
    }
  },
  actions: {
    /**
     * 设置当前语言
     * @param {LocaleDropdownType} localeMap 语言配置对象
     */
    setCurrentLocale(localeMap: LocaleDropdownType) {
      // this.locale = Object.assign(this.locale, localeMap)
      this.currentLocale.lang = localeMap?.lang // 设置当前语言代码
      this.currentLocale.elLocale = elLocaleMap[localeMap?.lang] // 设置当前语言包
      setStorage('lang', localeMap?.lang) // 将选定的语言存储到localStorage
    }
  }
})

/**
 * 用于无需外部实例的情况下创建 Locale Store
 * @returns {ReturnType<typeof useLocaleStore>} Locale Store 实例
 */
export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
