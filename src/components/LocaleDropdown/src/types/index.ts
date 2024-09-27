/**
 * @interface Language
 * @description 表示一种语言的接口
 */
export interface Language {
	/** 该语言的可记录对象 */
	el: Recordable
	/** 语言的名称 */
	name: string
}

/**
 * @interface LocaleDropdownType
 * @description 表示区域下拉菜单项的接口
 */
export interface LocaleDropdownType {
	/** 语言类型 */
	lang: LocaleType
	/** 菜单项名称，可选 */
	name?: string
	/** 该菜单项对应的语言对象，可选 */
	elLocale?: Language
}
