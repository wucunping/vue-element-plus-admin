/**
 * @file useI18n.ts
 * @description 定义一个名为useI18n的自定义钩子函数，用于获取国际化翻译函数t及其相关方法。
 * @example
 * 导入useI18n钩子并使用返回的t函数进行翻译
 * import { useI18n } from './useI18n'
 * const { t } = useI18n('namespace')
 * console.log(t('key'))
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入vueI18n插件中的i18n实例
import { i18n } from '@/plugins/vueI18n'

/**
 * 定义一个类型，表示全局翻译函数的形状，可以接收不同参数进行翻译
 */
type I18nGlobalTranslation = {
	(key: string): string // 只传入key
	(key: string, locale: string): string // 传入key和locale
	(key: string, locale: string, list: unknown[]): string // 传入key、locale和数组参数
	(key: string, locale: string, named: Record<string, unknown>): string // 传入key、locale和具名参数对象
	(key: string, list: unknown[]): string // 传入key和数组参数
	(key: string, named: Record<string, unknown>): string // 传入key和具名参数对象
}

/**
 * 定义翻译函数可能接收的剩余参数类型
 */
type I18nTranslationRestParameters = [string, any]

/**
 * 根据命名空间和键名获取完整的键名
 *
 * @param namespace 命名空间，可能为undefined
 * @param key 键名
 * @returns 完整的键名，如果没有命名空间则直接返回键名，如果键名已经以命名空间开头也直接返回键名，否则返回命名空间和键名拼接后的结果
 */
const getKey = (namespace: string | undefined, key: string) => {
	if (!namespace) {
		return key // 如果没有命名空间，直接返回key
	}
	if (key.startsWith(namespace)) {
		return key // 如果key已经以命名空间开头，直接返回key
	}
	return `${namespace}.${key}` // 否则，将命名空间和key拼接后返回
}

/**
 * 国际化钩子函数
 *
 * @param namespace 可选的命名空间参数
 * @returns 返回一个对象，其中包含一个翻译函数t
 */
export const useI18n = (
	namespace?: string // 可选的命名空间参数
): {
	t: I18nGlobalTranslation // 返回一个对象，其中包含一个翻译函数t
} => {
	// 定义一个常规函数对象，当i18n实例不存在时返回，其中的t函数只进行简单的key处理
	const normalFn = {
		t: (key: string) => {
			return getKey(namespace, key)
		}
	}

	if (!i18n) {
		return normalFn // 如果i18n实例不存在，返回常规函数对象
	}

	// 解构i18n.global对象，获取其中的翻译函数t和其他方法
	const { t, ...methods } = i18n.global

	/**
	 * 全局翻译函数
	 *
	 * @param key 翻译键
	 * @param arg 剩余参数
	 * @returns 翻译后的字符串
	 */
	const tFn: I18nGlobalTranslation = (key: string, ...arg: any[]) => {
		if (!key) return '' // 如果key为空，返回空字符串
		if (!key.includes('.') && !namespace) return key // 如果key中不包含点且没有命名空间，直接返回key
		// 调用i18n实例的翻译函数t，传入处理后的key和剩余参数进行翻译
		return (t as any)(getKey(namespace, key), ...(arg as I18nTranslationRestParameters))
	}
	// 返回一个对象，包含i18n实例的其他方法和翻译函数tFn
	return {
		...methods,
		t: tFn
	}
}

/**
 * 定义一个简单的翻译函数t，当key不存在时直接返回key本身，用于兜底或测试等场景
 */
export const t = (key: string) => key
