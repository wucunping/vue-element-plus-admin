/**
 * @file /src/components/LocaleDropdown/src/types/index.ts
 * @description 定义 LocaleDropdown 组件的类型接口
 * @example 使用方式：<LocaleDropdown :lang="language" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module LocaleDropdownTypeDefinitionsModule
 * @author [吴尘](https://github.com/wucunping)
 */

/** 定义语言类型接口 */
export interface Language {
  /** Element Plus 的语言包 */
  el: Recordable // 使用 Recordable 类型定义语言包的键值对
  /** 语言名称 */
  name: string // 语言的显示名称
}

/** 定义 LocaleDropdown 的下拉选项类型 */
export interface LocaleDropdownType {
  /** 语言代码 */
  lang: LocaleType // 使用 LocaleType 类型定义语言代码
  /** 语言显示名称（可选） */
  name?: string // 下拉选项中显示的语言名称
  /** 语言的完整配置（可选） */
  elLocale?: Language // 包含 Element Plus 的语言包及显示名称
}
