/**
 * @file locale.ts
 * @description 定义和管理应用的多语言状态，包括当前语言和可用语言列表
 * @example
 * // 使用语言存储
 * import { useLocaleStore } from '@/store/modules/locale';
 *
 * const localeStore = useLocaleStore();
 * console.log(localeStore.getCurrentLocale); // 获取当前语言
 * localeStore.setCurrentLocale({ lang: 'en' }); // 设置当前语言为英文
 * @version 1.0.0
 * @author Fitten Tech
 * @date 2023-10-01
 * @module locale
 */

// 从 pinia 导入 defineStore，用于定义状态管理存储
import { defineStore } from 'pinia'

// 导入全局 store 实例
import { store } from '../index'

// 从 element-plus 导入中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 从 element-plus 导入英文语言包
import en from 'element-plus/es/locale/lang/en'

// 导入自定义 hook，用于处理本地存储
import { useStorage } from '@/hooks/web/useStorage'

// 导入语言选择组件的类型
import type { LocaleDropdownType } from '@/components/LocaleDropdown'

/** 初始化存储操作，获取本地存储的方法 */
const { getStorage, setStorage } = useStorage('localStorage')

/** 映射 Element Plus 语言 */
const elLocaleMap = {
	'zh-CN': zhCn, // 中文语言包
	en: en // 英文语言包
}

/** 定义语言状态接口 */
interface LocaleState {
	/** 当前语言状态 */
	currentLocale: LocaleDropdownType
	/** 支持的语言列表 */
	localeMap: LocaleDropdownType[]
}

/**
 * 定义语言存储
 * @returns {Object} 返回一个包含当前语言状态、语言列表和相关操作的对象
 */
export const useLocaleStore = defineStore('locales', {
	state: (): LocaleState => {
		/**
		 * @returns {LocaleState} 返回当前语言状态和支持的语言列表
		 */
		return {
			currentLocale: {
				lang: getStorage('lang') || 'zh-CN' // 从存储获取当前语言，默认中文
				// elLocale: elLocaleMap[getStorage('lang') || 'zh-CN'] // 对应的 Element Plus 语言
			},
			/** 多语言支持 */
			localeMap: [
				// 定义支持的语言列表
				/**
				 * @typedef {Object} LocaleDropdownType
				 * @property {string} lang - 语言代码
				 * @property {string} name - 语言名称
				 */
				{
					lang: 'zh-CN', // 中文
					name: '简体中文' // 语言名称
				},
				{
					lang: 'en', // 英文
					name: 'English' // 语言名称
				}
			]
		}
	},
	getters: {
		/**
		 * 获取当前语言的 getter 方法
		 * @returns {LocaleDropdownType} 当前语言状态
		 */
		getCurrentLocale(): LocaleDropdownType {
			// 获取当前语言
			return this.currentLocale // 返回当前语言状态
		},
		/**
		 * 获取可用语言列表的 getter 方法
		 * @returns {LocaleDropdownType[]} 支持的语言列表
		 */
		getLocaleMap(): LocaleDropdownType[] {
			// 获取可用语言列表
			return this.localeMap // 返回支持的语言列表
		}
	},
	actions: {
		/**
		 * 设置当前语言的 action 方法
		 * @param {LocaleDropdownType} localeMap - 需要设置的语言对象
		 */
		setCurrentLocale(localeMap: LocaleDropdownType) {
			// 设置当前语言
			this.currentLocale.lang = localeMap?.lang // 更新当前语言
			this.currentLocale.elLocale = elLocaleMap[localeMap?.lang] // 更新对应的 Element Plus 语言
			setStorage('lang', localeMap?.lang) // 更新存储
		}
	}
})

/**
 * 无需参数的语言存储访问方法
 * @returns {Object} 返回语言存储实例
 */
export const useLocaleStoreWithOut = () => {
	// 返回语言存储实例
	return useLocaleStore(store) // 返回语言存储实例
}
