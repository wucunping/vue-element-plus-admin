/**
 * @fileOverview 此文件定义了全局类型声明，用于提供类型安全性和代码自动完成。
 *
 * 此文件主要用于定义和声明全局的 TypeScript 类型和接口，以便在整个项目中共享这些类型。
 * 它定义了多个全局类型，如 `Fn`、`Nullable`、`Recordable`、`RemoveReadonly`、`ComponentRef`、`LocaleType`、`TimeoutHandle`、`IntervalHandle`、`ElementPlusInfoType`、`LayoutType`、`AxiosContentType`、`AxiosMethod`、`AxiosResponseType`、`AxiosConfig`、`IResponse`、`ThemeTypes` 和 `ImportMetaEnv`。
 *
 * 通过定义这些全局类型，我们可以在项目的任何地方使用这些类型，而无需在每个文件中重复定义。
 *
 * 这有助于增强代码的可读性和可维护性，并提供了类型安全性，帮助防止因类型错误而导致的运行时错误。
 */

// 导入 vue 的 CSSProperties 类型，用于定义 CSS 样式属性
import type { CSSProperties } from 'vue'

// 导入 axios 的 RawAxiosRequestHeaders 类型，用于定义 Axios 请求的 headers
import { RawAxiosRequestHeaders } from 'axios'

/**
 * 声明全局，用于定义全局的 TypeScript 类型和接口
 */
declare global {
	/**
	 * 声明一个泛型接口 Fn，允许传入一个类型参数 T，并定义一个函数类型，该函数接受一个参数列表 arg，返回类型为 T
	 */
	declare interface Fn<T = any> {
		(...arg: T[]): T // 函数接受任意类型参数并返回类型 T
	}

	/**
	 * 声明一个类型 Nullable，允许传入一个类型参数 T，然后返回 T 或 null
	 * @template T - 任意类型
	 */
	declare type Nullable<T> = T | null

	/**
	 * 声明一个类型 ElRef，允许传入一个类型参数 T，默认值为 HTMLDivElement，然后返回 T 或 null
	 * @template T - HTML 元素类型，默认为 HTMLDivElement
	 */
	declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

	/**
	 * 声明一个类型 Recordable，允许传入两个类型参数 T 和 K，默认值为 any 和 string，然后返回一个对象类型，
	 * 该对象的键为 K 类型，值为 T 类型
	 * @template T - 值的类型，默认为 any
	 * @template K - 键的类型，默认为 string
	 */
	declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

	/**
	 * 声明一个类型 RemoveReadonly，允许传入一个类型参数 T，然后返回一个对象类型，
	 * 该对象类型的所有属性都不是只读的
	 * @template T - 需要移除只读属性的对象类型
	 */
	declare type RemoveReadonly<T> = {
		-readonly [P in keyof T]: T[P] // 通过映射类型去除只读属性
	}

	/**
	 * 声明一个类型 ComponentRef，允许传入一个类型参数 T，然后返回 T 的实例类型
	 * @template T - 组件类型
	 */
	declare type ComponentRef<T> = InstanceType<T>

	/**
	 * 声明一个类型 LocaleType，允许为字符串类型，值为 'zh-CN' 或 'en'
	 */
	declare type LocaleType = 'zh-CN' | 'en'

	/**
	 * 声明一个类型 TimeoutHandle，返回 setTimeout 函数的返回值类型
	 */
	declare type TimeoutHandle = ReturnType<typeof setTimeout>

	/**
	 * 声明一个类型 IntervalHandle，返回 setInterval 函数的返回值类型
	 */
	declare type IntervalHandle = ReturnType<typeof setInterval>

	/**
	 * 声明一个类型 ElementPlusInfoType，允许为字符串类型，值为 'success'、'info'、'warning' 或 'danger'
	 */
	declare type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger'

	/**
	 * 声明一个类型 LayoutType，允许为字符串类型，值为 'classic'、'topLeft'、'top' 或 'cutMenu'
	 */
	declare type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'

	/**
	 * 声明一个类型 AxiosContentType，允许为字符串类型，
	 * 值为 'application/json'、'application/x-www-form-urlencoded'、'multipart/form-data' 或 'text/plain'
	 */
	declare type AxiosContentType =
		| 'application/json'
		| 'application/x-www-form-urlencoded'
		| 'multipart/form-data'
		| 'text/plain'

	/**
	 * 声明一个类型 AxiosMethod，允许为字符串类型，值为 'get'、'post'、'delete' 或 'put'
	 */
	declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

	/**
	 * 声明一个类型 AxiosResponseType，允许为字符串类型，值为 'arraybuffer'、'blob'、'document'、'json'、'text' 或 'stream'
	 */
	declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

	/**
	 * 声明一个接口 AxiosConfig，用于定义 Axios 请求的配置
	 */
	declare interface AxiosConfig {
		/** 请求的参数 */
		params?: any
		/** 请求的数据 */
		data?: any
		/** 请求的 URL */
		url?: string
		/** 请求的方法，如 'get'、'post' 等 */
		method?: AxiosMethod
		/** 请求的 headers */
		headers?: RawAxiosRequestHeaders
		/** 响应的数据类型 */
		responseType?: AxiosResponseType
	}

	/**
	 * 声明一个接口 IResponse，用于定义 Axios 响应的结构
	 * @template T - 响应的数据类型，默认为 any
	 */
	declare interface IResponse<T = any> {
		/** 响应的状态码 */
		code: number
		/** 响应的数据 */
		data: T extends any ? T : T & any
	}

	/**
	 * 声明一个接口 ThemeTypes，用于定义主题相关的类型
	 */
	declare interface ThemeTypes {
		/** 元素的主要颜色 */
		elColorPrimary?: string
		/** 左侧菜单的边框颜色 */
		leftMenuBorderColor?: string
		/** 左侧菜单的背景颜色 */
		leftMenuBgColor?: string
		/** 左侧菜单的浅色背景颜色 */
		leftMenuBgLightColor?: string
		/** 左侧菜单的背景激活颜色 */
		leftMenuBgActiveColor?: string
		/** 左侧菜单折叠菜单后的背景激活颜色 */
		leftMenuCollapseBgActiveColor?: string
		/** 左侧菜单的文本颜色 */
		leftMenuTextColor?: string
		/** 左侧菜单的文本激活颜色 */
		leftMenuTextActiveColor?: string
		/** Logo 的标题文本颜色 */
		logoTitleTextColor?: string
		/** Logo 的边框颜色 */
		logoBorderColor?: string
		/** 顶部头部的背景颜色 */
		topHeaderBgColor?: string
		/** 顶部头部的文本颜色 */
		topHeaderTextColor?: string
		/** 顶部头部的悬停颜色 */
		topHeaderHoverColor?: string
		/** 顶部工具的边框颜色 */
		topToolBorderColor?: string
	}

	/**
	 * 声明一个接口 ImportMetaEnv，用于定义 Vite 环境变量的类型
	 */
	declare interface ImportMetaEnv {
		/** Vite 的 Node 环境变量 */
		readonly VITE_NODE_ENV: string
		/** Vite 的应用标题 */
		readonly VITE_APP_TITLE: string
		/** Vite 的 API 基础路径 */
		readonly VITE_API_BASE_PATH: string
		/** Vite 的基础路径 */
		readonly VITE_BASE_PATH: string
		/** Vite 是否禁用调试器 */
		readonly VITE_DROP_DEBUGGER: string
		/** Vite 是否禁用控制台 */
		readonly VITE_DROP_CONSOLE: string
		/** Vite 是否生成 source map */
		readonly VITE_SOURCEMAP: string
		/** Vite 的输出目录 */
		readonly VITE_OUT_DIR: string
		/** Vite 是否使用 bundle 分析器 */
		readonly VITE_USE_BUNDLE_ANALYZER: string
		/** Vite 是否使用所有 Element Plus 样式 */
		readonly VITE_USE_ALL_ELEMENT_PLUS_STYLE: string
		/** Vite 是否使用模拟数据 */
		readonly VITE_USE_MOCK: string
		/** Vite 是否使用 CSS 分割 */
		readonly VITE_USE_CSS_SPLIT: string
		/** Vite 是否使用在线图标 */
		readonly VITE_USE_ONLINE_ICON: string
		/** Vite 的图标前缀 */
		readonly VITE_ICON_PREFIX: string
		/** Vite 是否隐藏全局设置 */
		readonly VITE_HIDE_GLOBAL_SETTING: string
	}
}

/**
 * 导出空对象，这是 TypeScript 的一个常见模式，用于确保文件被视为模块
 */
export {}
