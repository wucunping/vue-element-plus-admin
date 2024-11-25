<script setup lang="ts">
/**
 * @file Setting.vue
 * @description 项目设置组件，包括主题设置、布局切换、界面显示控制等功能。
 * @example 使用 <Setting /> 组件加载到页面，实现系统设置功能。
 * @version 1.0.0
 * @date 2024-11-22
 * @module components/Setting/src/Setting.vue
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入所需的Element Plus组件
import { ElDrawer, ElDivider, ElMessage } from 'element-plus'

// 引入Vue相关的核心工具
import { ref, unref } from 'vue'

// 引入多语言工具
import { useI18n } from '@/hooks/web/useI18n'

// 引入主题切换组件
import { ThemeSwitch } from '@/components/ThemeSwitch'

// 引入CSS变量操作工具
import { useCssVar } from '@vueuse/core'

// 引入应用状态管理模块
import { useAppStore } from '@/store/modules/app'

// 引入工具函数
import { trim, setCssVar, getCssVar } from '@/utils'

// 引入颜色选择、布局切换和界面显示组件
import ColorRadioPicker from './components/ColorRadioPicker.vue'
import InterfaceDisplay from './components/InterfaceDisplay.vue'
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'

// 引入本地存储工具
import { useStorage } from '@/hooks/web/useStorage'

// 引入剪贴板工具
import { useClipboard } from '@vueuse/core'

// 引入自定义设计工具
import { useDesign } from '@/hooks/web/useDesign'

// 从本地存储工具中获取清除存储的方法
const { clear: storageClear } = useStorage('localStorage')

// 从自定义设计工具中获取CSS类名前缀生成方法
const { getPrefixCls } = useDesign()

// 设置组件的CSS类名前缀
const prefixCls = getPrefixCls('setting')

// 获取应用状态管理实例
const appStore = useAppStore()

// 获取多语言实例
const { t } = useI18n()

// 控制抽屉组件的显示状态
const drawer = ref(false)

/** 系统主题相关 */
// 系统主题颜色
const systemTheme = ref(appStore.getTheme.elColorPrimary)

// 设置系统主题颜色
const setSystemTheme = (color: string) => {
  // 更新CSS变量
  setCssVar('--el-color-primary', color)
  // 更新应用状态管理中的主题配置
  appStore.setTheme({ elColorPrimary: color })
  // 获取左侧菜单背景色并同步更新菜单主题
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor)))
}

/** 头部主题相关 */
// 头部主题颜色
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

// 设置头部主题颜色
const setHeaderTheme = (color: string) => {
  // 更新应用状态管理中的头部主题配置
  appStore.setHeaderTheme(color)
}

/** 菜单主题相关 */
// 菜单主题颜色
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || '')

// 设置菜单主题颜色
const setMenuTheme = (color: string) => {
  // 更新应用状态管理中的菜单主题配置
  appStore.setMenuTheme(color)
}

// 监听layout变化，重置一些主题色
// watch(
//   () => layout.value,
//   (n) => {
//     if (n === 'top' && !appStore.getIsDark) {
//       headerTheme.value = '#fff'
//       setHeaderTheme('#fff')
//     } else {
//       setMenuTheme(unref(menuTheme))
//     }
//   }
// )

// 拷贝
const copyConfig = async () => {
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
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
}

// 清空缓存
const clear = () => {
  storageClear()
  window.location.reload()
}

const themeChange = () => {
  const color = getCssVar('--el-bg-color')
  setMenuTheme(color)
  setHeaderTheme(color)
}
</script>

<template>
  <!-- 设置按钮 -->
  <div
    :class="prefixCls"
    class="fixed top-[45%] right-0 w-40px h-40px flex items-center justify-center bg-[var(--el-color-primary)] cursor-pointer z-10"
    @click="drawer = true"
  >
    <!-- 设置图标 -->
    <Icon icon="vi-ant-design:setting-outlined" color="#fff" />
  </div>

  <!-- 设置抽屉 -->
  <ElDrawer v-model="drawer" direction="rtl" size="350px" :z-index="4000">
    <!-- 抽屉头部 -->
    <template #header>
      <span class="text-16px font-700">{{ t('setting.projectSetting') }}</span>
    </template>

    <div class="text-center">
      <!-- 主题切换 -->
      <ElDivider>{{ t('setting.theme') }}</ElDivider>
      <ThemeSwitch @change="themeChange" />

      <!-- 布局切换 -->
      <ElDivider>{{ t('setting.layout') }}</ElDivider>
      <LayoutRadioPicker />

      <!-- 系统主题颜色选择 -->
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

      <!-- 头部主题颜色选择 -->
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

      <!-- 菜单主题颜色选择 -->
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

    <!-- 界面显示配置 -->
    <ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider>
    <InterfaceDisplay />

    <!-- 操作按钮 -->
    <ElDivider />
    <div>
      <!-- 复制配置按钮 -->
      <BaseButton type="primary" class="w-full" @click="copyConfig">
        {{ t('setting.copy') }}
      </BaseButton>
    </div>
    <div class="mt-5px">
      <!-- 清空缓存按钮 -->
      <BaseButton type="danger" class="w-full" @click="clear">
        {{ t('setting.clearAndReset') }}
      </BaseButton>
    </div>
  </ElDrawer>
</template>

<style lang="less" scoped>
/* 设置组件的样式 */
@prefix-cls: ~'@{adminNamespace}-setting';

.@{prefix-cls} {
  border-radius: 6px 0 0 6px; /* 设置边角圆角 */
}
</style>
