<script setup lang="ts">
/**
 * @file InterfaceDisplay.vue
 * @description 该文件用于实现界面的设置显示功能，提供多种界面选项的开关。
 * @example
 * <InterfaceDisplay />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module InterfaceDisplay
 */

// 导入 Element Plus 的开关组件和消息提示
import { ElSwitch, ElMessage } from 'element-plus'

// 导入国际化钩子
import { useI18n } from '@/hooks/web/useI18n'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

// 导入 Vue 的响应式 API
import { computed, ref, watch } from 'vue'

// 导入设置 CSS 变量的工具函数
import { setCssVar } from '@/utils'

// 导入设计相关的钩子
import { useDesign } from '@/hooks/web/useDesign'

// 从设计钩子中获取前缀类名的方法
const { getPrefixCls } = useDesign()

// 定义组件的前缀类名
const prefixCls = getPrefixCls('interface-display')

// 使用应用状态管理
const appStore = useAppStore()

// 获取国际化翻译函数
const { t } = useI18n()

// 面包屑的响应式引用
const breadcrumb = ref(appStore.getBreadcrumb)

/**
 * 切换面包屑显示状态
 * @param {boolean} show - 是否显示面包屑
 */
const breadcrumbChange = (show: boolean) => {
	appStore.setBreadcrumb(show)
}

// 面包屑图标的响应式引用
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

/**
 * 切换面包屑图标显示状态
 * @param {boolean} show - 是否显示面包屑图标
 */
const breadcrumbIconChange = (show: boolean) => {
	appStore.setBreadcrumbIcon(show)
}

// 折叠图标的响应式引用
const hamburger = ref(appStore.getHamburger)

/**
 * 切换折叠图标显示状态
 * @param {boolean} show - 是否显示折叠图标
 */
const hamburgerChange = (show: boolean) => {
	appStore.setHamburger(show)
}

// 全屏图标的响应式引用
const screenfull = ref(appStore.getScreenfull)

/**
 * 切换全屏图标显示状态
 * @param {boolean} show - 是否显示全屏图标
 */
const screenfullChange = (show: boolean) => {
	appStore.setScreenfull(show)
}

// 尺寸图标的响应式引用
const size = ref(appStore.getSize)

/**
 * 切换尺寸图标显示状态
 * @param {boolean} show - 是否显示尺寸图标
 */
const sizeChange = (show: boolean) => {
	appStore.setSize(show)
}

// 多语言图标的响应式引用
const locale = ref(appStore.getLocale)

/**
 * 切换多语言图标显示状态
 * @param {boolean} show - 是否显示多语言图标
 */
const localeChange = (show: boolean) => {
	appStore.setLocale(show)
}

// 标签页的响应式引用
const tagsView = ref(appStore.getTagsView)

/**
 * 切换标签页显示状态
 * @param {boolean} show - 是否显示标签页
 */
const tagsViewChange = (show: boolean) => {
	// 切换标签栏显示时，同步切换标签栏的高度
	setCssVar('--tags-view-height', show ? '35px' : '0px')
	appStore.setTagsView(show)
}

// 标签页图标的响应式引用
const tagsViewIcon = ref(appStore.getTagsViewIcon)

/**
 * 切换标签页图标显示状态
 * @param {boolean} show - 是否显示标签页图标
 */
const tagsViewIconChange = (show: boolean) => {
	appStore.setTagsViewIcon(show)
}

// logo 的响应式引用
const logo = ref(appStore.getLogo)

/**
 * 切换 logo 显示状态
 * @param {boolean} show - 是否显示 logo
 */
const logoChange = (show: boolean) => {
	appStore.setLogo(show)
}

// 菜单手风琴的响应式引用
const uniqueOpened = ref(appStore.getUniqueOpened)

/**
 * 切换菜单手风琴状态
 * @param {boolean} uniqueOpened - 是否唯一打开菜单
 */
const uniqueOpenedChange = (uniqueOpened: boolean) => {
	appStore.setUniqueOpened(uniqueOpened)
}

// 固定头部的响应式引用
const fixedHeader = ref(appStore.getFixedHeader)

/**
 * 切换固定头部状态
 * @param {boolean} show - 是否固定头部
 */
const fixedHeaderChange = (show: boolean) => {
	appStore.setFixedHeader(show)
}

// 页脚的响应式引用
const footer = ref(appStore.getFooter)

/**
 * 切换页脚显示状态
 * @param {boolean} show - 是否显示页脚
 */
const footerChange = (show: boolean) => {
	appStore.setFooter(show)
}

// 灰色模式的响应式引用
const greyMode = ref(appStore.getGreyMode)

/**
 * 切换灰色模式状态
 * @param {boolean} show - 是否启用灰色模式
 */
const greyModeChange = (show: boolean) => {
	appStore.setGreyMode(show)
}

// 动态路由的响应式引用
const dynamicRouter = ref(!!appStore.getDynamicRouter)

/**
 * 切换动态路由状态
 * @param {boolean} show - 是否启用动态路由
 */
const dynamicRouterChange = (show: boolean) => {
	ElMessage.info(t('setting.reExperienced'))
	appStore.setDynamicRouter(show)
}

// 服务端动态路由的响应式引用
const serverDynamicRouter = ref(appStore.getServerDynamicRouter)

/**
 * 切换服务端动态路由状态
 * @param {boolean} show - 是否启用服务端动态路由
 */
const serverDynamicRouterChange = (show: boolean) => {
	ElMessage.info(t('setting.reExperienced'))
	appStore.setServerDynamicRouter(show)
}

// 固定菜单的响应式引用
const fixedMenu = ref(appStore.getFixedMenu)

/**
 * 切换固定菜单状态
 * @param {boolean} show - 是否启用固定菜单
 */
const fixedMenuChange = (show: boolean) => {
	appStore.setFixedMenu(show)
}

// 计算属性，获取当前布局
const layout = computed(() => appStore.getLayout)

// 监听布局变化
watch(
	() => layout.value,
	(n) => {
		if (n === 'top') {
			appStore.setCollapse(false) // 如果布局为顶部布局，则展开
		}
	}
)
</script>

<template>
	<div :class="prefixCls">
		<!-- 面包屑设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.breadcrumb') }}</span>
			<ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
		</div>

		<!-- 面包屑图标设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.breadcrumbIcon') }}</span>
			<ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
		</div>

		<!-- 折叠图标设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.hamburgerIcon') }}</span>
			<ElSwitch v-model="hamburger" @change="hamburgerChange" />
		</div>

		<!-- 全屏图标设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.screenfullIcon') }}</span>
			<ElSwitch v-model="screenfull" @change="screenfullChange" />
		</div>

		<!-- 尺寸图标设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.sizeIcon') }}</span>
			<ElSwitch v-model="size" @change="sizeChange" />
		</div>

		<!-- 多语言图标设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.localeIcon') }}</span>
			<ElSwitch v-model="locale" @change="localeChange" />
		</div>

		<!-- 标签页设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.tagsView') }}</span>
			<ElSwitch v-model="tagsView" @change="tagsViewChange" />
		</div>

		<!-- 标签页图标设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.tagsViewIcon') }}</span>
			<ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
		</div>

		<!-- logo 设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.logo') }}</span>
			<ElSwitch v-model="logo" @change="logoChange" />
		</div>

		<!-- 菜单手风琴设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.uniqueOpened') }}</span>
			<ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
		</div>

		<!-- 固定头部设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.fixedHeader') }}</span>
			<ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
		</div>

		<!-- 页脚设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.footer') }}</span>
			<ElSwitch v-model="footer" @change="footerChange" />
		</div>

		<!-- 灰色模式设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.greyMode') }}</span>
			<ElSwitch v-model="greyMode" @change="greyModeChange" />
		</div>

		<!-- 动态路由设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.dynamicRouter') }}</span>
			<ElSwitch v-model="dynamicRouter" @change="dynamicRouterChange" />
		</div>

		<!-- 服务端动态路由设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.serverDynamicRouter') }}</span>
			<ElSwitch v-model="serverDynamicRouter" @change="serverDynamicRouterChange" />
		</div>

		<!-- 固定菜单设置 -->
		<div class="flex justify-between items-center">
			<span class="text-14px">{{ t('setting.fixedMenu') }}</span>
			<ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
		</div>
	</div>
</template>
