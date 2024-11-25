<script setup lang="ts">
/**
 * @file /src/components/Setting/src/components/InterfaceDisplay.vue
 * @description 接口显示设置组件，动态控制应用界面各部分的显示与隐藏
 * @example
 * <InterfaceDisplay />
 * @version 1.0.0
 * @date 2024-11-22
 * @module InterfaceDisplayModule
 * @see /src/components/Setting
 * @author [吴尘](https://github.com/wucunping)
 */

/** 引入 Element Plus 的开关组件和消息组件 */
import { ElSwitch, ElMessage } from 'element-plus'
/** 引入国际化工具 */
import { useI18n } from '@/hooks/web/useI18n'
/** 引入应用状态管理 */
import { useAppStore } from '@/store/modules/app'
/** 引入 Vue 的核心方法 */
import { computed, ref, watch } from 'vue'
/** 引入工具函数用于动态设置 CSS 变量 */
import { setCssVar } from '@/utils'
/** 引入设计样式相关方法 */
import { useDesign } from '@/hooks/web/useDesign'

/** 获取样式前缀 */
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('interface-display')

/** 获取应用状态管理实例 */
const appStore = useAppStore()

/** 获取国际化方法 */
const { t } = useI18n()

/** 面包屑导航状态 */
const breadcrumb = ref(appStore.getBreadcrumb)

/** 更新面包屑导航显示状态 */
const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

/** 面包屑图标状态 */
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

/** 更新面包屑图标显示状态 */
const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

/** 折叠图标状态 */
const hamburger = ref(appStore.getHamburger)

/** 更新折叠图标显示状态 */
const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

/** 全屏图标状态 */
const screenfull = ref(appStore.getScreenfull)

/** 更新全屏图标显示状态 */
const screenfullChange = (show: boolean) => {
  appStore.setScreenfull(show)
}

/** 尺寸切换图标状态 */
const size = ref(appStore.getSize)

/** 更新尺寸切换图标显示状态 */
const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

/** 多语言图标状态 */
const locale = ref(appStore.getLocale)

/** 更新多语言图标显示状态 */
const localeChange = (show: boolean) => {
  appStore.setLocale(show)
}

/** 标签页状态 */
const tagsView = ref(appStore.getTagsView)

/** 更新标签页显示状态，并同步切换标签栏高度 */
const tagsViewChange = (show: boolean) => {
  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

/** 标签页图标状态 */
const tagsViewIcon = ref(appStore.getTagsViewIcon)

/** 更新标签页图标显示状态 */
const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

/** 应用 Logo 状态 */
const logo = ref(appStore.getLogo)

/** 更新 Logo 显示状态 */
const logoChange = (show: boolean) => {
  appStore.setLogo(show)
}

/** 菜单手风琴模式状态 */
const uniqueOpened = ref(appStore.getUniqueOpened)

/** 更新菜单手风琴模式状态 */
const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

/** 固定头部状态 */
const fixedHeader = ref(appStore.getFixedHeader)

/** 更新固定头部显示状态 */
const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

/** 页脚状态 */
const footer = ref(appStore.getFooter)

/** 更新页脚显示状态 */
const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

/** 灰色模式状态 */
const greyMode = ref(appStore.getGreyMode)

/** 更新灰色模式状态 */
const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

/** 动态路由状态 */
const dynamicRouter = ref(!!appStore.getDynamicRouter)

/** 更新动态路由状态，并提示用户体验将会更新 */
const dynamicRouterChange = (show: boolean) => {
  ElMessage.info(t('setting.reExperienced')) // 显示重新体验的提示信息
  appStore.setDynamicRouter(show)
}

/** 服务端动态路由状态 */
const serverDynamicRouter = ref(appStore.getServerDynamicRouter)

/** 更新服务端动态路由状态，并提示用户体验将会更新 */
const serverDynamicRouterChange = (show: boolean) => {
  ElMessage.info(t('setting.reExperienced')) // 显示重新体验的提示信息
  appStore.setServerDynamicRouter(show)
}

/** 固定菜单状态 */
const fixedMenu = ref(appStore.getFixedMenu)

/** 更新固定菜单显示状态 */
const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

/** 当前布局模式，动态获取应用布局类型 */
const layout = computed(() => appStore.getLayout)

/** 监听布局模式的变化，切换到顶部布局时取消菜单折叠状态 */
watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false) // 顶部布局时强制取消菜单折叠
    }
  }
)
</script>

<template>
  <!-- 主容器，动态绑定样式类 -->
  <div :class="prefixCls">
    <!-- 面包屑设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：面包屑 -->
      <span class="text-14px">{{ t('setting.breadcrumb') }}</span>
      <!-- 开关组件，绑定面包屑状态 -->
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <!-- 面包屑图标设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：面包屑图标 -->
      <span class="text-14px">{{ t('setting.breadcrumbIcon') }}</span>
      <!-- 开关组件，绑定面包屑图标状态 -->
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <!-- 折叠图标设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：折叠图标 -->
      <span class="text-14px">{{ t('setting.hamburgerIcon') }}</span>
      <!-- 开关组件，绑定折叠图标状态 -->
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <!-- 全屏图标设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：全屏图标 -->
      <span class="text-14px">{{ t('setting.screenfullIcon') }}</span>
      <!-- 开关组件，绑定全屏图标状态 -->
      <ElSwitch v-model="screenfull" @change="screenfullChange" />
    </div>

    <!-- 尺寸切换图标设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：尺寸切换图标 -->
      <span class="text-14px">{{ t('setting.sizeIcon') }}</span>
      <!-- 开关组件，绑定尺寸切换图标状态 -->
      <ElSwitch v-model="size" @change="sizeChange" />
    </div>

    <!-- 多语言图标设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：多语言图标 -->
      <span class="text-14px">{{ t('setting.localeIcon') }}</span>
      <!-- 开关组件，绑定多语言图标状态 -->
      <ElSwitch v-model="locale" @change="localeChange" />
    </div>

    <!-- 标签页设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：标签页 -->
      <span class="text-14px">{{ t('setting.tagsView') }}</span>
      <!-- 开关组件，绑定标签页状态 -->
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <!-- 标签页图标设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：标签页图标 -->
      <span class="text-14px">{{ t('setting.tagsViewIcon') }}</span>
      <!-- 开关组件，绑定标签页图标状态 -->
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <!-- Logo 设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：Logo -->
      <span class="text-14px">{{ t('setting.logo') }}</span>
      <!-- 开关组件，绑定 Logo 显示状态 -->
      <ElSwitch v-model="logo" @change="logoChange" />
    </div>

    <!-- 菜单手风琴设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：菜单手风琴 -->
      <span class="text-14px">{{ t('setting.uniqueOpened') }}</span>
      <!-- 开关组件，绑定菜单手风琴状态 -->
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <!-- 固定头部设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：固定头部 -->
      <span class="text-14px">{{ t('setting.fixedHeader') }}</span>
      <!-- 开关组件，绑定固定头部状态 -->
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <!-- 页脚设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：页脚 -->
      <span class="text-14px">{{ t('setting.footer') }}</span>
      <!-- 开关组件，绑定页脚状态 -->
      <ElSwitch v-model="footer" @change="footerChange" />
    </div>

    <!-- 灰色模式设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：灰色模式 -->
      <span class="text-14px">{{ t('setting.greyMode') }}</span>
      <!-- 开关组件，绑定灰色模式状态 -->
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <!-- 动态路由设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：动态路由 -->
      <span class="text-14px">{{ t('setting.dynamicRouter') }}</span>
      <!-- 开关组件，绑定动态路由状态 -->
      <ElSwitch v-model="dynamicRouter" @change="dynamicRouterChange" />
    </div>

    <!-- 服务端动态路由设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：服务端动态路由 -->
      <span class="text-14px">{{ t('setting.serverDynamicRouter') }}</span>
      <!-- 开关组件，绑定服务端动态路由状态 -->
      <ElSwitch v-model="serverDynamicRouter" @change="serverDynamicRouterChange" />
    </div>

    <!-- 固定菜单设置项 -->
    <div class="flex justify-between items-center">
      <!-- 设置项标题：固定菜单 -->
      <span class="text-14px">{{ t('setting.fixedMenu') }}</span>
      <!-- 开关组件，绑定固定菜单状态 -->
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>
  </div>
</template>
