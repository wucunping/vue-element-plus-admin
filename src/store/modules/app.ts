/**
 * @file app.ts
 * @description 应用状态管理模块，使用 Pinia 定义应用的状态和相应的操作。
 * @example
 * // 使用方式
 * const appStore = useAppStore();
 * appStore.setTitle('新标题');
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module app
 */

import { defineStore } from 'pinia' // 从 pinia 中导入定义状态管理的函数
import { store } from '../index' // 导入全局储存状态
import { setCssVar, humpToUnderline } from '@/utils' // 导入设置 CSS 变量和驼峰转下划线的工具函数
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color' // 导入颜色处理工具函数
import { ElMessage, ComponentSize } from 'element-plus' // 从 element-plus 中导入消息提示组件和组件尺寸类型
import { useCssVar } from '@vueuse/core' // 从 @vueuse/core 中导入用于使用 CSS 变量的函数
import { unref } from 'vue' // 从 vue 导入解引用函数
import { useDark } from '@vueuse/core' // 从 @vueuse/core 中导入用于识别暗黑模式的函数

/** 定义应用状态接口 */
interface AppState {
  /** 面包屑是否显示 */
  breadcrumb: boolean
  /** 面包屑图标是否显示 */
  breadcrumbIcon: boolean
  /** 菜单是否折叠 */
  collapse: boolean
  /** 是否只保持一个子菜单的展开 */
  uniqueOpened: boolean
  /** 是否显示折叠图标 */
  hamburger: boolean
  /** 是否显示全屏图标 */
  screenfull: boolean
  /** 是否显示尺寸图标 */
  size: boolean
  /** 是否显示多语言图标 */
  locale: boolean
  /** 是否显示标签页 */
  tagsView: boolean
  /**  标签页图标是否显示 */
  tagsViewIcon: boolean
  /** 是否显示 logo */
  logo: boolean
  /** 是否固定头部 */
  fixedHeader: boolean
  /** 是否启用灰色模式 */
  greyMode: boolean
  /** 是否使用动态路由 */
  dynamicRouter: boolean
  /** 是否启用服务端动态路由 */
  serverDynamicRouter: boolean
  /** 页面是否正在加载 */
  pageLoading: boolean
  /** 布局类型 */
  layout: LayoutType
  /** 应用标题 */
  title: string
  /** 是否为暗黑模式 */
  isDark: boolean
  /** 当前组件尺寸 */
  currentSize: ComponentSize
  /** 组件尺寸映射列表 */
  sizeMap: ComponentSize[]
  /** 是否为移动端 */
  mobile: boolean
  /** 是否显示页脚 */
  footer: boolean
  /** 主题相关信息 */
  theme: ThemeTypes
  /** 菜单是否固定 */
  fixedMenu: boolean
}

/** 定义应用状态管理的 Store */
export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      sizeMap: ['default', 'large', 'small'], // 组件尺寸选项
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading
      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: false, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      size: true, // 尺寸图标
      locale: true, // 多语言图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: true, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      dynamicRouter: true, // 是否动态路由
      serverDynamicRouter: true, // 是否服务端渲染动态路由
      fixedMenu: false, // 是否固定菜单

      layout: 'classic', // layout布局
      isDark: false, // 是否是暗黑模式
      currentSize: 'default', // 组件尺寸
      theme: {
        // 主题色
        elColorPrimary: '#409eff',
        // 左侧菜单边框颜色
        leftMenuBorderColor: 'inherit',
        // 左侧菜单背景颜色
        leftMenuBgColor: '#001529',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '#0f2438',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单字体颜色
        leftMenuTextColor: '#bfcbd9',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '#fff',
        // logo字体颜色
        logoTitleTextColor: '#fff',
        // logo边框颜色
        logoBorderColor: 'inherit',
        // 头部背景颜色
        topHeaderBgColor: '#fff',
        // 头部字体颜色
        topHeaderTextColor: 'inherit',
        // 头部悬停颜色
        topHeaderHoverColor: '#f6f6f6',
        // 头部边框颜色
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    /**
     * 获取面包屑显示状态
     * @returns {boolean} 是否显示面包屑
     */
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    /**
     * 获取面包屑图标显示状态
     * @returns {boolean} 是否显示面包屑图标
     */
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    /**
     * 获取菜单折叠状态
     * @returns {boolean} 菜单是否折叠
     */
    getCollapse(): boolean {
      return this.collapse
    },
    /**
     * 获取是否只展开一个子菜单
     * @returns {boolean} 是否只展开一个子菜单
     */
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    /**
     * 获取汉堡菜单显示状态
     * @returns {boolean} 是否显示汉堡菜单
     */
    getHamburger(): boolean {
      return this.hamburger
    },
    /**
     * 获取全屏图标显示状态
     * @returns {boolean} 是否显示全屏图标
     */
    getScreenfull(): boolean {
      return this.screenfull
    },
    /**
     * 获取尺寸图标显示状态
     * @returns {boolean} 是否显示尺寸图标
     */
    getSize(): boolean {
      return this.size
    },
    /**
     * 获取语言切换图标显示状态
     * @returns {boolean} 是否显示语言切换图标
     */
    getLocale(): boolean {
      return this.locale
    },
    /**
     * 获取标签页显示状态
     * @returns {boolean} 是否显示标签页
     */
    getTagsView(): boolean {
      return this.tagsView
    },
    /**
     * 获取标签页图标显示状态
     * @returns {boolean} 是否显示标签页图标
     */
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    /**
     * 获取 logo 显示状态
     * @returns {boolean} 是否显示 logo
     */
    getLogo(): boolean {
      return this.logo
    },
    /**
     * 获取工具栏是否固定
     * @returns {boolean} 是否固定工具栏
     */
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    /**
     * 获取是否启用灰色模式
     * @returns {boolean} 是否启用灰色模式
     */
    getGreyMode(): boolean {
      return this.greyMode
    },
    /**
     * 获取动态路由启用状态
     * @returns {boolean} 是否启用动态路由
     */
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    /**
     * 获取服务端动态路由启用状态
     * @returns {boolean} 是否启用服务端动态路由
     */
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter
    },
    /**
     * 获取菜单固定状态
     * @returns {boolean} 是否固定菜单
     */
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    /**
     * 获取页面加载状态
     * @returns {boolean} 页面是否加载
     */
    getPageLoading(): boolean {
      return this.pageLoading
    },
    /**
     * 获取布局类型
     * @returns {LayoutType} 当前布局类型
     */
    getLayout(): LayoutType {
      return this.layout
    },
    /**
     * 获取应用标题
     * @returns {string} 当前应用标题
     */
    getTitle(): string {
      return this.title
    },
    /**
     * 获取暗黑模式状态
     * @returns {boolean} 是否为暗黑模式
     */
    getIsDark(): boolean {
      return this.isDark
    },
    /**
     * 获取当前组件尺寸
     * @returns {ComponentSize} 当前组件尺寸
     */
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },
    /**
     * 获取尺寸映射表
     * @returns {ComponentSize[]} 尺寸映射表
     */
    getSizeMap(): ComponentSize[] {
      return this.sizeMap
    },
    /**
     * 获取是否为移动端
     * @returns {boolean} 是否为移动端
     */
    getMobile(): boolean {
      return this.mobile
    },
    /**
     * 获取主题配置
     * @returns {ThemeTypes} 当前主题配置
     */
    getTheme(): ThemeTypes {
      return this.theme
    },
    /**
     * 获取页脚显示状态
     * @returns {boolean} 是否显示页脚
     */
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    /**
     * 设置面包屑显示状态
     * @param {boolean} breadcrumb 是否显示面包屑
     */
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    /**
     * 设置面包屑图标显示状态
     * @param {boolean} breadcrumbIcon 是否显示面包屑图标
     */
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    /**
     * 设置菜单折叠状态
     * @param {boolean} collapse 是否折叠菜单
     */
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    /**
     * 设置是否只展开一个子菜单
     * @param {boolean} uniqueOpened 是否只展开一个子菜单
     */
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    /**
     * 设置汉堡菜单显示状态
     * @param {boolean} hamburger 是否显示汉堡菜单
     */
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    /**
     * 设置全屏图标显示状态
     * @param {boolean} screenfull 是否显示全屏图标
     */
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    /**
     * 设置尺寸图标显示状态
     * @param {boolean} size 是否显示尺寸图标
     */
    setSize(size: boolean) {
      this.size = size
    },
    /**
     * 设置语言切换图标显示状态
     * @param {boolean} locale 是否显示语言切换图标
     */
    setLocale(locale: boolean) {
      this.locale = locale
    },
    /**
     * 设置标签页显示状态
     * @param {boolean} tagsView 是否显示标签页
     */
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    /**
     * 设置标签页图标显示状态
     * @param {boolean} tagsViewIcon 是否显示标签页图标
     */
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    /**
     * 设置 logo 显示状态
     * @param {boolean} logo 是否显示 logo
     */
    setLogo(logo: boolean) {
      this.logo = logo
    },
    /**
     * 设置工具栏固定状态
     * @param {boolean} fixedHeader 是否固定工具栏
     */
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    /**
     * 设置是否启用灰色模式
     * @param {boolean} greyMode 是否启用灰色模式
     */
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    /**
     * 设置动态路由状态
     * @param {boolean} dynamicRouter 是否启用动态路由
     */
    setDynamicRouter(dynamicRouter: boolean) {
      this.dynamicRouter = dynamicRouter
    },
    /**
     * 设置服务端动态路由状态
     * @param {boolean} serverDynamicRouter 是否启用服务端动态路由
     */
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      this.serverDynamicRouter = serverDynamicRouter
    },
    /**
     * 设置菜单固定状态
     * @param {boolean} fixedMenu 是否固定菜单
     */
    setFixedMenu(fixedMenu: boolean) {
      this.fixedMenu = fixedMenu
    },
    /**
     * 设置页面加载状态
     * @param {boolean} pageLoading 是否显示页面加载动画
     */
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    /**
     * 设置布局类型
     * @param {LayoutType} layout 布局类型
     */
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其它布局')
        return
      }
      this.layout = layout
    },
    /**
     * 设置应用标题
     * @param {string} title 应用标题
     */
    setTitle(title: string) {
      this.title = title
    },
    /**
     * 设置暗黑模式状态
     * @param {boolean} isDark 是否为暗黑模式
     */
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      this.setPrimaryLight()
    },
    /**
     * 设置当前组件尺寸
     * @param {ComponentSize} currentSize 当前组件尺寸
     */
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize
    },
    /**
     * 设置是否为移动端
     * @param {boolean} mobile 是否为移动端
     */
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    /**
     * 设置主题配置
     * @param {ThemeTypes} theme 主题配置对象
     */
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
    },
    /**
     * 更新CSS变量的主题配置
     */
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
      this.setPrimaryLight()
    },
    /**
     * 设置页脚显示状态
     * @param {boolean} footer 是否显示页脚
     */
    setFooter(footer: boolean) {
      this.footer = footer
    },
    /**
     * 设置主要颜色的亮色系列
     */
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary
        const color = this.isDark ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    /**
     * 设置左侧菜单的主题
     * @param {string} color 菜单的背景颜色
     */
    setMenuTheme(color: string) {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      const theme: Recordable = {
        // 左侧菜单边框颜色
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        // 左侧菜单背景颜色
        leftMenuBgColor: color,
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 左侧菜单字体颜色
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        // logo字体颜色
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        // logo边框颜色
        logoBorderColor: isDarkColor ? color : '#eee'
      }
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    /**
     * 设置头部的主题
     * @param {string} color 头部的背景颜色
     */
    setHeaderTheme(color: string) {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
      if (this.getLayout === 'top') {
        this.setMenuTheme(color)
      }
    },
    /**
     * 初始化主题
     */
    initTheme() {
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
    }
  },
  // 启用持久化存储
  persist: true
})

/** 导出应用状态管理实例 */
export const useAppStoreWithOut = () => {
  return useAppStore(store) // 返回应用状态管理实例
}
