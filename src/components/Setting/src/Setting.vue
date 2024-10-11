<script setup lang="ts">
/**
 * @file Setting.vue
 * @description 设置组件，用于展示和修改主题、布局等配置信息
 * @example <Setting />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Setting
 */

// 导入 Element Plus 组件
import { ElDrawer, ElDivider, ElMessage } from 'element-plus'

// 导入 Vue 相关的工具
import { ref, unref } from 'vue'

// 导入国际化支持的钩子
import { useI18n } from '@/hooks/web/useI18n'

// 导入主题切换组件
import { ThemeSwitch } from '@/components/ThemeSwitch'

// 导入 VueUse 中的 CSS 变量操作
import { useCssVar } from '@vueuse/core'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

// 导入工具函数
import { trim, setCssVar, getCssVar } from '@/utils'

// 导入颜色选择组件
import ColorRadioPicker from './components/ColorRadioPicker.vue'

// 导入界面显示组件
import InterfaceDisplay from './components/InterfaceDisplay.vue'

// 导入布局选择组件
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'

// 导入本地存储钩子
import { useStorage } from '@/hooks/web/useStorage'

// 导入剪贴板操作
import { useClipboard } from '@vueuse/core'

// 导入设计钩子
import { useDesign } from '@/hooks/web/useDesign'

// 清空本地存储的工具
const { clear: storageClear } = useStorage('localStorage')

// 获取前缀类名的函数
const { getPrefixCls } = useDesign()

// 定义组件的前缀类名
const prefixCls = getPrefixCls('setting')

// 使用应用状态管理
const appStore = useAppStore()

// 获取国际化翻译函数
const { t } = useI18n()

// 控制抽屉的显示
const drawer = ref(false)

// 主题色相关
const systemTheme = ref(appStore.getTheme.elColorPrimary)

/**
 * 设置系统主题色
 * @param {string} color - 主题颜色
 */
const setSystemTheme = (color: string) => {
	// 设置 CSS 变量
	setCssVar('--el-color-primary', color)
	// 更新状态管理中的主题颜色
	appStore.setTheme({ elColorPrimary: color })
	// 获取左侧菜单背景色变量
	const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
	// 设置菜单主题
	setMenuTheme(trim(unref(leftMenuBgColor)))
}

// 头部主题相关
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

/**
 * 设置头部主题色
 * @param {string} color - 头部颜色
 */
const setHeaderTheme = (color: string) => {
	// 更新状态管理中的头部主题颜色
	appStore.setHeaderTheme(color)
}

// 菜单主题相关
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || '')

/**
 * 设置菜单主题色
 * @param {string} color - 菜单颜色
 */
const setMenuTheme = (color: string) => {
	// 更新状态管理中的菜单主题颜色
	appStore.setMenuTheme(color)
}

// 拷贝配置
const copyConfig = async () => {
	// 使用剪贴板工具
	const { copy, copied, isSupported } = useClipboard({
		source: `
      // 面包屑
      breadcrumb: ${appStore.getBreadcrumb},
      // 面包屑图标
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // 折叠图标
      hamburger: ${appStore.getHamburger},
      // 全屏图标
      screenfull: ${appStore.getScreenfull},
      // 尺寸图标
      size: ${appStore.getSize},
      // 多语言图标
      locale: ${appStore.getLocale},
      // 标签页
      tagsView: ${appStore.getTagsView},
      // 标签页图标
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // 菜单手风琴
      uniqueOpened: ${appStore.getUniqueOpened},
      // 固定header
      fixedHeader: ${appStore.getFixedHeader},
      // 页脚
      footer: ${appStore.getFooter},
      // 灰色模式
      greyMode: ${appStore.getGreyMode},
      // layout布局
      layout: '${appStore.getLayout}',
      // 暗黑模式
      isDark: ${appStore.getIsDark},
      // 组件尺寸
      currentSize: '${appStore.getCurrentSize}',
      // 主题相关
      theme: {
        // 主题色
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // 左侧菜单边框颜色
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // 左侧菜单背景颜色
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // 左侧菜单字体颜色
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo字体颜色
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logo边框颜色
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // 头部背景颜色
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // 头部字体颜色
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // 头部悬停颜色
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // 头部边框颜色
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `,
		legacy: true
	})

	// 判断剪贴板是否支持
	if (!isSupported) {
		// 显示错误信息
		ElMessage.error(t('setting.copyFailed'))
	} else {
		// 复制内容到剪贴板
		await copy()
		// 判断是否复制成功
		if (unref(copied)) {
			// 显示成功信息
			ElMessage.success(t('setting.copySuccess'))
		}
	}
}

// 清空缓存
const clear = () => {
	// 清空存储
	storageClear()
	// 刷新当前页面
	window.location.reload()
}

// 主题变更处理
const themeChange = () => {
	// 获取当前背景色
	const color = getCssVar('--el-bg-color')
	// 更新菜单和头部主题
	setMenuTheme(color)
	setHeaderTheme(color)
}

/*
<template>
	<div
		:class="prefixCls"
		// 设置样式和事件
		class="fixed top-[45%] right-0 w-40px h-40px flex items-center justify-center bg-[var(--el-color-primary)] cursor-pointer z-10"
		@click="drawer = true" // 点击事件打开抽屉
	>
		<Icon icon="vi-ant-design:setting-outlined" color="#fff" /> <!-- 设置图标 -->
	</div>

	<ElDrawer v-model="drawer" direction="rtl" size="350px" :z-index="4000"> <!-- 抽屉组件 -->
		<template #header>
			<span class="text-16px font-700">{{ t('setting.projectSetting') }}</span> <!-- 抽屉标题 -->
		</template>

		<div class="text-center">
			<!-- 主题 -->
			<ElDivider>{{ t('setting.theme') }}</ElDivider> <!-- 主题分隔符 -->
			<ThemeSwitch @change="themeChange" /> <!-- 主题切换组件 -->

			<!-- 布局 -->
			<ElDivider>{{ t('setting.layout') }}</ElDivider> <!-- 布局分隔符 -->
			<LayoutRadioPicker /> <!-- 布局选择组件 -->

			<!-- 系统主题 -->
			<ElDivider>{{ t('setting.systemTheme') }}</ElDivider> <!-- 系统主题分隔符 -->
			<ColorRadioPicker
				v-model="systemTheme" <!-- 绑定系统主题 -->
				:schema="[
					'#409eff',
					'#009688',
					'#536dfe',
					'#ff5c93',
					'#ee4f12',
					'#0096c7',
					'#9c27b0',
					'#ff9800'
				]"
				@change="setSystemTheme" <!-- 主题变更事件 -->
			/>

			<!-- 头部主题 -->
			<ElDivider>{{ t('setting.headerTheme') }}</ElDivider> <!-- 头部主题分隔符 -->
			<ColorRadioPicker
				v-model="headerTheme" <!-- 绑定头部主题 -->
				:schema="[
					'#fff',
					'#151515',
					'#5172dc',
					'#e74c3c',
					'#24292e',
					'#394664',
					'#009688',
					'#383f45'
				]"
				@change="setHeaderTheme" <!-- 头部主题变更事件 -->
			/>

			<!-- 菜单主题 -->
			<ElDivider>{{ t('setting.menuTheme') }}</ElDivider> <!-- 菜单主题分隔符 -->
			<ColorRadioPicker
				v-model="menuTheme" <!-- 绑定菜单主题 -->
				:schema="[
					'#fff',
					'#001529',
					'#212121',
					'#273352',
					'#191b24',
					'#383f45',
					'#001628',
					'#344058'
				]"
				@change="setMenuTheme" <!-- 菜单主题变更事件 -->
			/>
		</div>

		<!-- 界面显示 -->
		<ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider> <!-- 界面显示分隔符 -->
		<InterfaceDisplay /> <!-- 界面显示组件 -->

		<ElDivider /> <!-- 分隔符 -->
		<div>
			<BaseButton type="primary" class="w-full" @click="copyConfig">{{
				t('setting.copy')
			}}</BaseButton> <!-- 复制配置按钮 -->
		</div>
		<div class="mt-5px">
			<BaseButton type="danger" class="w-full" @click="clear">
				{{ t('setting.clearAndReset') }} <!-- 清空缓存按钮 -->
			</BaseButton>
		</div>
	</ElDrawer>
</template>
*/
</script>

<template>
	<div
		:class="prefixCls"
		class="fixed top-[45%] right-0 w-40px h-40px flex items-center justify-center bg-[var(--el-color-primary)] cursor-pointer z-10"
		@click="drawer = true"
	>
		<Icon icon="vi-ant-design:setting-outlined" color="#fff" />
	</div>

	<ElDrawer v-model="drawer" direction="rtl" size="350px" :z-index="4000">
		<template #header>
			<span class="text-16px font-700">{{ t('setting.projectSetting') }}</span>
		</template>

		<div class="text-center">
			<!-- 主题 -->
			<ElDivider>{{ t('setting.theme') }}</ElDivider>
			<ThemeSwitch @change="themeChange" />

			<!-- 布局 -->
			<ElDivider>{{ t('setting.layout') }}</ElDivider>
			<LayoutRadioPicker />

			<!-- 系统主题 -->
			<ElDivider>{{ t('setting.systemTheme') }}</ElDivider>
			<ColorRadioPicker
				v-model="systemTheme"
				:schema="[
					'#409eff',
					'#009688',
					'#536dfe',
					'#ff5c93',
					'#ee4f12',
					'#0096c7',
					'#9c27b0',
					'#ff9800'
				]"
				@change="setSystemTheme"
			/>

			<!-- 头部主题 -->
			<ElDivider>{{ t('setting.headerTheme') }}</ElDivider>
			<ColorRadioPicker
				v-model="headerTheme"
				:schema="[
					'#fff',
					'#151515',
					'#5172dc',
					'#e74c3c',
					'#24292e',
					'#394664',
					'#009688',
					'#383f45'
				]"
				@change="setHeaderTheme"
			/>

			<!-- 菜单主题 -->
			<ElDivider>{{ t('setting.menuTheme') }}</ElDivider>
			<ColorRadioPicker
				v-model="menuTheme"
				:schema="[
					'#fff',
					'#001529',
					'#212121',
					'#273352',
					'#191b24',
					'#383f45',
					'#001628',
					'#344058'
				]"
				@change="setMenuTheme"
			/>
		</div>

		<!-- 界面显示 -->
		<ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider>
		<InterfaceDisplay />

		<ElDivider />
		<div>
			<BaseButton type="primary" class="w-full" @click="copyConfig">{{
				t('setting.copy')
			}}</BaseButton>
		</div>
		<div class="mt-5px">
			<BaseButton type="danger" class="w-full" @click="clear">
				{{ t('setting.clearAndReset') }}
			</BaseButton>
		</div>
	</ElDrawer>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-setting'; // 定义前缀类名

.@{prefix-cls} {
	border-radius: 6px 0 0 6px; // 设置类的圆角样式
}
</style>
