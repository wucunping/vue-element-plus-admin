/**
 * @file global.d.ts
 * @description 类型声明文件，声明全局使用的类型和接口
 * @example
 * // 用法示例
 * type MyNullable = Nullable<string>; // 使用 Nullable 类型
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module global
 */

import type { CSSProperties } from 'vue' // 导入Vue的CSSProperties类型
import { RawAxiosRequestHeaders } from 'axios' // 导入Axios的请求头类型

/**
 * 声明全局，用于定义全局的 TypeScript 类型和接口
 */
declare global {
  /**
   * 定义通用函数类型
   * @template T - 函数参数的类型
   */
  declare interface Fn<T = any> {
    (...arg: T[]): T // 函数接收多个参数，返回类型为T
  }

  /**
   * 定义可为null的类型
   * @template T - 泛型类型
   */
  declare type Nullable<T> = T | null // 类型T或null

  /**
   * 定义HTMLElement的引用类型
   * @template T - HTMLElement的类型，默认是HTMLDivElement
   */
  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T> // 可为null的HTMLElement引用类型

  /**
   * 定义可记录的对象类型
   * @template T - 对象值的类型，默认为 any
   * @template K - 对象键的类型，默认为 string
   */
  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T> // 泛型对象类型

  /**
   * 去除只读属性的类型
   * @template T - 目标类型
   */
  declare type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P] // 去除只读修饰符
  }

  /**
   * 组件引用类型
   * @template T - 组件类型
   */
  declare type ComponentRef<T> = InstanceType<T> // 组件实例类型

  /**
   * 语言类型
   * 值为 'zh-CN' 或 'en'
   */
  declare type LocaleType = 'zh-CN' | 'en' // 语言类型：中文或英文

  /**
   * 定义超时处理句柄类型
   */
  declare type TimeoutHandle = ReturnType<typeof setTimeout> // setTimeout的返回类型
  /**
   * 定义间隔处理句柄类型
   */
  declare type IntervalHandle = ReturnType<typeof setInterval> // setInterval的返回类型

  /**
   * ElementPlus信息类型
   * 值为 'success'、'info'、'warning' 或 'danger'
   */
  declare type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger' // 提示类型
  /**
   * 布局类型
   * 值为 'classic'、'topLeft'、'top' 或 'cutMenu'
   */
  declare type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu' // 布局选择
  /**
   * Axios内容类型
   * 值为 'application/json'、'application/x-www-form-urlencoded'、'multipart/form-data' 或 'text/plain'
   */
  declare type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'

  /**
   * Axios请求方法类型
   * 值为 'get'、'post'、'delete' 或 'put'
   */
  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  /**
   * Axios响应类型
   * 值为 'arraybuffer'、'blob'、'document'、'json'、'text' 或 'stream'
   */
  declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  /**
   * Axios配置接口
   */
  declare interface AxiosConfig {
    /** 请求参数 */
    params?: any
    /** 请求的主体数据 */
    data?: any
    /** 请求的URL */
    url?: string
    /** 请求方法，如 'get'、'post' 等 */
    method?: AxiosMethod
    /** 请求头 headers */
    headers?: RawAxiosRequestHeaders
    /** 响应类型 */
    responseType?: AxiosResponseType
  }

  /**
   * 响应接口，用于定义 Axios 响应的结构
   * @template T - 响应的数据类型，默认为 any
   */
  declare interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
  }

  /** 主题类型接口 */
  declare interface ThemeTypes {
    /** 元素的主要颜色 */
    elColorPrimary?: string
    /** 左侧菜单边框色 */
    leftMenuBorderColor?: string
    /** 左侧菜单背景色 */
    leftMenuBgColor?: string
    /** 左侧菜单的浅色背景颜色 */
    leftMenuBgLightColor?: string
    /** 左侧菜单激活背景色 */
    leftMenuBgActiveColor?: string
    /** 左侧菜单折叠激活背景色 */
    leftMenuCollapseBgActiveColor?: string
    /** 左侧菜单文本色 */
    leftMenuTextColor?: string
    /** 左侧菜单激活文本色 */
    leftMenuTextActiveColor?: string
    /** Logo标题文本色 */
    logoTitleTextColor?: string
    /** Logo边框色 */
    logoBorderColor?: string
    /** 顶部头部背景色 */
    topHeaderBgColor?: string
    /** 顶部头部文本色 */
    topHeaderTextColor?: string
    /** 顶部头部悬停色 */
    topHeaderHoverColor?: string
    /** 顶部工具边框色 */
    topToolBorderColor?: string
  }

  /** 导入元环境接口 */
  declare interface ImportMetaEnv {
    /** Node环境变量 */
    readonly VITE_NODE_ENV: string
    /** 应用标题 */
    readonly VITE_APP_TITLE: string
    /** API基础路径 */
    readonly VITE_API_BASE_PATH: string
    /** 基础路径 */
    readonly VITE_BASE_PATH: string
    /** 是否移除调试器 */
    readonly VITE_DROP_DEBUGGER: string
    /** 是否移除控制台日志 */
    readonly VITE_DROP_CONSOLE: string
    /** 是否生成源映射 */
    readonly VITE_SOURCEMAP: string
    /**  输出目录 */
    readonly VITE_OUT_DIR: string
    /** 是否使用打包分析 */
    readonly VITE_USE_BUNDLE_ANALYZER: string
    /** 是否使用全ElementPlus样式 */
    readonly VITE_USE_ALL_ELEMENT_PLUS_STYLE: string
    /** 是否使用Mock */
    readonly VITE_USE_MOCK: string
    /** 是否使用CSS分割 */
    readonly VITE_USE_CSS_SPLIT: string
    /** 是否使用在线图标 */
    readonly VITE_USE_ONLINE_ICON: string
    /** 图标前缀 */
    readonly VITE_ICON_PREFIX: string
    /** 是否隐藏全局设置 */
    readonly VITE_HIDE_GLOBAL_SETTING: string
  }
}
