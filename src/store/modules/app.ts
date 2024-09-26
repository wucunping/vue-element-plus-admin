/**
 * 应用状态管理模块
 *
 * 此模块负责维护应用级别的状态，包括：
 * - 界面布局（如：是否显示面包屑、是否折叠菜单等）
 * - 主题和暗黑模式
 * - 动态路由和服务器端渲染动态路由
 * - 其他全局应用设置（如：是否显示页脚、是否固定头部等）
 *
 * 提供了相应的getter和action来访问和修改这些状态。
 */

// 引入pinia的defineStore方法，用于定义store
import { defineStore } from 'pinia'

// 引入根store
import { store } from '../index'

// 引入设置css变量和驼峰转下划线的工具函数
import { setCssVar, humpToUnderline } from '@/utils'

// 引入颜色处理工具函数
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'

// 引入Element Plus的Message组件和组件尺寸类型
import { ElMessage } from 'element-plus'
import type { ComponentSize } from 'element-plus'

// 引入vueuse的useCssVar函数，用于获取css变量值
import { useCssVar } from '@vueuse/core'

// 引入vue的unref函数，用于获取ref的原始值
import { unref } from 'vue'

// 引入vueuse的useDark函数，用于获取当前是否是暗黑模式
import { useDark } from '@vueuse/core'

/** 定义应用状态接口 */
interface AppState {
	/** 是否显示面包屑 */
	breadcrumb: boolean
	/** 是否显示面包屑图标 */
	breadcrumbIcon: boolean
	/** 是否折叠菜单 */
	collapse: boolean
	/** 是否只保持一个子菜单的展开 */
	uniqueOpened: boolean
	/** 是否显示折叠菜块图标 */
	hamburger: boolean
	/** 是否显示全屏图标 */
	screenfull: boolean
	/** 是否显示尺寸图标 */
	size: boolean
	/** 是否显示多语言图标 */
	locale: boolean
	/** 是否显示标签页 */
	tagsView: boolean
	/** 是否显示标签图标 */
	tagsViewIcon: boolean
	/** 是否显示logo */
	logo: boolean
	/** 是否固定toolheader */
	fixedHeader: boolean
	/** 是否显示页脚 */
	footer: boolean
	/** 是否开始灰色模式，用于特殊悼念日 */
	greyMode: boolean
	/** 是否动态路由 */
	dynamicRouter: boolean
	/** 是否服务端渲染动态路由 */
	serverDynamicRouter: boolean
	/** 是否加载页面 */
	pageLoading: boolean
	/** 布局类型 */
	layout: LayoutType
	/** 标题 */
	title: string
	/** 是否是暗黑模式 */
	isDark: boolean
	/** 组件尺寸 */
	currentSize: ComponentSize
	/** 组件尺寸列表 */
	sizeMap: ComponentSize[]
	/** 是否是移动端 */
	mobile: boolean
	/** 主题设置 */
	theme: ThemeTypes
	/** 是否固定菜单 */
	fixedMenu: boolean
}

// 定义应用状态管理 store
export const useAppStore = defineStore('app', {
	// 定义状态
	state: (): AppState => {
		return {
			// 组件尺寸列表
			sizeMap: ['default', 'large', 'small'],
			// 是否是移动端
			mobile: false,
			// 标题
			title: import.meta.env.VITE_APP_TITLE,
			// 是否加载页面
			pageLoading: false,
			// 是否显示面包屑
			breadcrumb: true,
			// 是否显示面包屑图标
			breadcrumbIcon: true,
			// 是否折叠菜单
			collapse: false,
			// 是否只保持一个子菜单的展开
			uniqueOpened: false,
			// 是否显示折叠图标
			hamburger: true,
			// 是否显示全屏图标
			screenfull: true,
			// 是否显示尺寸图标
			size: true,
			// 是否显示多语言图标
			locale: true,
			// 是否显示标签页
			tagsView: true,
			// 是否显示标签图标
			tagsViewIcon: true,
			// 是否显示logo
			logo: true,
			// 是否固定toolheader
			fixedHeader: true,
			// 是否显示页脚
			footer: true,
			// 是否开始灰色模式，用于特殊悼念日
			greyMode: false,
			// 是否动态路由
			dynamicRouter: true,
			// 是否服务端渲染动态路由
			serverDynamicRouter: true,
			// 是否固定菜单
			fixedMenu: false,

			// 布局类型
			layout: 'classic',
			// 是否是暗黑模式
			isDark: false,
			// 组件尺寸
			currentSize: 'default',
			// 主题设置
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

	// 定义计算属性
	getters: {
		/**
		 * 获取是否显示面包屑
		 */
		getBreadcrumb(): boolean {
			return this.breadcrumb
		},
		/**
		 * 获取是否显示面包屑图标
		 */
		getBreadcrumbIcon(): boolean {
			return this.breadcrumbIcon
		},
		/**
		 * 获取是否折叠菜单
		 */
		getCollapse(): boolean {
			return this.collapse
		},
		/**
		 * 获取是否只保持一个子菜单的展开
		 */
		getUniqueOpened(): boolean {
			return this.uniqueOpened
		},
		/**
		 * 获取是否显示折叠菜图标
		 */
		getHamburger(): boolean {
			return this.hamburger
		},
		/**
		 * 获取是否显示全屏图标
		 */
		getScreenfull(): boolean {
			return this.screenfull
		},
		/**
		 * 获取是否显示尺寸图标
		 */
		getSize(): boolean {
			return this.size
		},
		/**
		 * 获取是否显示多语言图标
		 */
		getLocale(): boolean {
			return this.locale
		},
		/**
		 * 获取是否显示标签页
		 */
		getTagsView(): boolean {
			return this.tagsView
		},
		/**
		 * 获取是否显示标签图标
		 */
		getTagsViewIcon(): boolean {
			return this.tagsViewIcon
		},
		/**
		 * 获取是否显示logo
		 */
		getLogo(): boolean {
			return this.logo
		},
		/**
		 * 获取是否固定toolheader
		 */
		getFixedHeader(): boolean {
			return this.fixedHeader
		},
		/**
		 * 获取是否开始灰色模式，用于特殊悼念日
		 */
		getGreyMode(): boolean {
			return this.greyMode
		},
		/**
		 * 获取是否动态路由
		 */
		getDynamicRouter(): boolean {
			return this.dynamicRouter
		},
		/**
		 * 获取是否服务端渲染动态路由
		 */
		getServerDynamicRouter(): boolean {
			return this.serverDynamicRouter
		},
		/**
		 * 获取是否固定菜单
		 */
		getFixedMenu(): boolean {
			return this.fixedMenu
		},
		/**
		 * 获取是否加载页面
		 */
		getPageLoading(): boolean {
			return this.pageLoading
		},
		/**
		 * 获取布局类型
		 */
		getLayout(): LayoutType {
			return this.layout
		},
		/**
		 * 获取标题
		 */
		getTitle(): string {
			return this.title
		},
		/**
		 * 获取是否是暗黑模式
		 */
		getIsDark(): boolean {
			return this.isDark
		},
		/**
		 * 获取组件尺寸
		 */
		getCurrentSize(): ComponentSize {
			return this.currentSize
		},
		/**
		 * 获取组件尺寸列表
		 */
		getSizeMap(): ComponentSize[] {
			return this.sizeMap
		},
		/**
		 * 获取是否是移动端
		 */
		getMobile(): boolean {
			return this.mobile
		},
		/**
		 * 获取主题设置
		 */
		getTheme(): ThemeTypes {
			return this.theme
		},
		/**
		 * 获取是否显示页脚
		 */
		getFooter(): boolean {
			return this.footer
		}
	},

	// 定义方法
	actions: {
		/**
		 * 设置是否显示面包屑
		 * @param {boolean} breadcrumb - 是否显示面包屑
		 */
		setBreadcrumb(breadcrumb: boolean) {
			this.breadcrumb = breadcrumb
		},
		/**
		 * 设置是否显示面包屑图标
		 * @param {boolean} breadcrumbIcon - 是否显示面包屑图标
		 */
		setBreadcrumbIcon(breadcrumbIcon: boolean) {
			this.breadcrumbIcon = breadcrumbIcon
		},
		/**
		 * 设置是否折叠菜单
		 * @param {boolean} collapse - 是否折叠菜单
		 */
		setCollapse(collapse: boolean) {
			this.collapse = collapse
		},
		/**
		 * 设置是否只保持一个子菜单的展开
		 * @param {boolean} uniqueOpened - 是否只保持一个子菜单的展开
		 */
		setUniqueOpened(uniqueOpened: boolean) {
			this.uniqueOpened = uniqueOpened
		},
		/**
		 * 设置是否显示折叠图标
		 * @param {boolean} hamburger - 是否显示折叠图标
		 */
		setHamburger(hamburger: boolean) {
			this.hamburger = hamburger
		},
		/**
		 * 设置是否显示全屏图标
		 * @param {boolean} screenfull - 是否显示全屏图标
		 */
		setScreenfull(screenfull: boolean) {
			this.screenfull = screenfull
		},
		/**
		 * 设置是否显示尺寸图标
		 * @param {boolean} size - 是否显示尺寸图标
		 */
		setSize(size: boolean) {
			this.size = size
		},
		/**
		 * 设置是否显示多语言图标
		 * @param {boolean} locale - 是否显示多语言图标
		 */
		setLocale(locale: boolean) {
			this.locale = locale
		},
		/**
		 * 设置是否显示标签页
		 * @param {boolean} tagsView - 是否显示标签页
		 */
		setTagsView(tagsView: boolean) {
			this.tagsView = tagsView
		},
		/**
		 * 设置是否显示标签图标
		 * @param {boolean} tagsViewIcon - 是否显示标签图标
		 */
		setTagsViewIcon(tagsViewIcon: boolean) {
			this.tagsViewIcon = tagsViewIcon
		},
		/**
		 * 设置是否显示logo
		 * @param {boolean} logo - 是否显示logo
		 */
		setLogo(logo: boolean) {
			this.logo = logo
		},
		/**
		 * 设置是否固定toolheader
		 * @param {boolean} fixedHeader - 是否固定toolheader
		 */
		setFixedHeader(fixedHeader: boolean) {
			this.fixedHeader = fixedHeader
		},
		/**
		 * 设置是否开始灰色模式，用于特殊悼念日
		 * @param {boolean} greyMode - 是否开始灰色模式
		 */
		setGreyMode(greyMode: boolean) {
			this.greyMode = greyMode
		},
		/**
		 * 设置是否动态路由
		 * @param {boolean} dynamicRouter - 是否动态路由
		 */
		setDynamicRouter(dynamicRouter: boolean) {
			this.dynamicRouter = dynamicRouter
		},
		/**
		 * 设置是否服务端渲染动态路由
		 * @param {boolean} serverDynamicRouter - 是否服务端渲染动态路由
		 */
		setServerDynamicRouter(serverDynamicRouter: boolean) {
			this.serverDynamicRouter = serverDynamicRouter
		},
		/**
		 * 设置是否固定菜单
		 * @param {boolean} fixedMenu - 是否固定菜单
		 */
		setFixedMenu(fixedMenu: boolean) {
			this.fixedMenu = fixedMenu
		},
		/**
		 * 设置是否加载页面
		 * @param {boolean} pageLoading - 是否加载页面
		 */
		setPageLoading(pageLoading: boolean) {
			this.pageLoading = pageLoading
		},
		/**
		 * 设置布局类型
		 * @param {LayoutType} layout - 布局类型
		 */
		setLayout(layout: LayoutType) {
			if (this.mobile && layout !== 'classic') {
				ElMessage.warning('移动端模式下不支持切换其它布局')
				return
			}
			this.layout = layout
		},
		/**
		 * 设置标题
		 * @param {string} title - 页面标题
		 */
		setTitle(title: string) {
			this.title = title
		},
		/**
		 * 设置是否是暗黑模式
		 * @param {boolean} isDark - 是否是暗黑模式
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
			this.setPrimaryLight() // 注意：这里缺少函数定义，无法提供完整的函数注释
		},
		/**
		 * 设置组件尺寸
		 * @param {ComponentSize} currentSize - 当前组件尺寸
		 */
		setCurrentSize(currentSize: ComponentSize) {
			this.currentSize = currentSize
		},
		/**
		 * 设置是否是移动端
		 * @param {boolean} mobile - 是否是移动端
		 */
		setMobile(mobile: boolean) {
			this.mobile = mobile
		},
		/**
		 * 设置主题设置
		 * @param {ThemeTypes} theme - 主题设置
		 */
		setTheme(theme: ThemeTypes) {
			this.theme = Object.assign(this.theme, theme)
		},
		/**
		 * 设置CSS变量主题
		 */
		setCssVarTheme() {
			for (const key in this.theme) {
				setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
			}
			this.setPrimaryLight() // 注意：这里缺少函数定义，无法提供完整的函数注释
		},
		/**
		 * 设置页脚显示
		 * @param {boolean} footer - 是否显示页脚
		 */
		setFooter(footer: boolean) {
			this.footer = footer
		},
		/**
		 * 设置主题光度
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
		 * 设置菜单主题
		 * @param {string} color - 菜单主题颜色
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
		 * 设置头部主题
		 * @param {string} color - 头部主题颜色
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
	// 设置状态是否持久化
	persist: true
})

/**
 * 导出带有 store 的应用状态管理 store
 * @returns {ReturnType<typeof useAppStore>} - 返回应用状态管理 store 的实例
 */
export const useAppStoreWithOut = () => {
	return useAppStore(store) // 返回已定义的应用状态管理 store 实例
}
