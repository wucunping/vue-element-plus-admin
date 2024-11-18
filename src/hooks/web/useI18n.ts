/**
 * @file useI18n.ts
 * @description 国际化 (i18n) 的使用接口和实现
 * @example
 * const { t } = useI18n('namespace')
 * const translatedText = t('key')
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useI18n
 */

import { i18n } from '@/plugins/vueI18n' // 从 vueI18n 插件中导入 i18n 实例

/**
 * 定义国际化全局翻译类型
 * @interface I18nGlobalTranslation
 * @param key - 翻译的键
 * @param locale - 语言环境
 * @param list - 可选参数，数组类型
 * @param named - 可选参数，命名的变量
 */
type I18nGlobalTranslation = {
  (key: string): string
  (key: string, locale: string): string
  (key: string, locale: string, list: unknown[]): string
  (key: string, locale: string, named: Record<string, unknown>): string
  (key: string, list: unknown[]): string
  (key: string, named: Record<string, unknown>): string
}

/**
 * 定义国际化翻译的剩余参数类型
 * @type I18nTranslationRestParameters
 */
type I18nTranslationRestParameters = [string, any]

/**
 * 获取翻译键的方法
 * @param namespace - 命名空间
 * @param key - 翻译的键
 * @returns 返回格式化后的翻译键
 */
const getKey = (namespace: string | undefined, key: string) => {
  // 如果没有命名空间
  if (!namespace) {
    return key // 返回原始键
  }
  // 如果键以命名空间开头
  if (key.startsWith(namespace)) {
    return key // 直接返回键
  }
  return `${namespace}.${key}` // 添加命名空间前缀
}

/**
 * useI18n 函数，用于获取国际化翻译的方法
 * @param namespace - 可选的命名空间
 * @returns 包含翻译方法的对象
 */
export const useI18n = (
  namespace?: string
): {
  t: I18nGlobalTranslation // 返回的对象中包含 t 方法
} => {
  const normalFn = {
    // 定义一个简单的 t 方法，用于获取翻译键
    t: (key: string) => {
      return getKey(namespace, key) // 返回格式化后的翻译键
    }
  }

  // 如果没有 i18n 实例
  if (!i18n) {
    return normalFn // 返回简单的 t 方法
  }

  const { t, ...methods } = i18n.global // 解构 i18n.global 中的 t 方法和其他方法

  /**
   * 定义国际化翻译函数
   * @param key - 翻译的键
   * @param arg - 可变参数，任意参数数组
   * @returns 返回翻译后的字符串
   */
  const tFn: I18nGlobalTranslation = (key: string, ...arg: any[]) => {
    if (!key) return '' // 如果没有键，返回空字符串
    if (!key.includes('.') && !namespace) return key // 如果没有点和命名空间，返回原始键
    return (t as any)(getKey(namespace, key), ...(arg as I18nTranslationRestParameters)) // 调用 i18n 的 t 方法并返回结果
  }
  return {
    ...methods, // 返回其他方法
    t: tFn // 用自定义的 t 函数替换 i18n 的 t 方法
  }
}

/**
 * 基础翻译函数，返回原始的键
 * @param key - 翻译的键
 * @returns 返回传入的键
 */
export const t = (key: string) => key // 返回传入的键
