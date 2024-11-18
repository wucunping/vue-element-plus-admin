/**
 * @file useRenderLayout.tsx
 * @description 用于渲染布局的组合函数，提供多种布局样式的渲染方法。
 * @example
 * const { renderClassic, renderTopLeft } = useRenderLayout();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module UseRenderLayout
 */

import { computed } from 'vue' // 从 'vue' 中导入 computed 函数
import { useAppStore } from '@/store/modules/app' // 从应用状态管理中导入 useAppStore，用于获取应用的状态
import { Menu } from '@/components/Menu' // 从组件库中导入 Menu 组件
import { TabMenu } from '@/components/TabMenu' // 从组件库中导入 TabMenu 组件
import { TagsView } from '@/components/TagsView' // 从组件库中导入 TagsView 组件
import { Logo } from '@/components/Logo' // 从组件库中导入 Logo 组件
import AppView from './AppView.vue' // 导入主视图组件
import ToolHeader from './ToolHeader.vue' // 导入工具头部组件
import { ElScrollbar } from 'element-plus' // 从 element-plus 中导入 ElScrollbar 组件
import { useDesign } from '@/hooks/web/useDesign' // 从自定义 hook 中导入 useDesign 函数

const { getPrefixCls } = useDesign() // 获取设计相关的前缀类名

const prefixCls = getPrefixCls('layout') // 通过 getPrefixCls 获取布局的前缀类名

const appStore = useAppStore() // 使用状态管理钩子获取应用的状态

const pageLoading = computed(() => appStore.getPageLoading) // 计算属性，用于获取页面加载状态

const tagsView = computed(() => appStore.getTagsView) // 计算属性，用于获取标签页状态

const collapse = computed(() => appStore.getCollapse) // 计算属性，用于获取菜单折叠状态

const logo = computed(() => appStore.logo) // 计算属性，用于获取 logo 状态

const fixedHeader = computed(() => appStore.getFixedHeader) // 计算属性，用于获取固定头部状态

const mobile = computed(() => appStore.getMobile) // 计算属性，用于判断是否是移动端设备

const fixedMenu = computed(() => appStore.getFixedMenu) // 计算属性，用于获取固定菜单状态

/**
 * useRenderLayout 函数组合，提供多种布局渲染方法
 * @returns {Object} 返回多个布局渲染方法
 */
export const useRenderLayout = () => {
  /** 定义经典布局渲染方法 */
  const renderClassic = () => {
    return (
      <>
        <div
          class={[
            'absolute top-0 left-0 h-full layout-border__right',
            { '!fixed z-3000': mobile.value } // 当是移动端时，使布局固定
          ]}
        >
          {logo.value ? ( // 判断 logo 是否存在
            <Logo
              class={[
                'bg-[var(--left-menu-bg-color)] relative',
                {
                  '!pl-0': mobile.value && collapse.value, // 当是移动端且菜单折叠时，左边距为0
                  'w-[var(--left-menu-min-width)]': appStore.getCollapse, // 菜单折叠时的宽度
                  'w-[var(--left-menu-max-width)]': !appStore.getCollapse // 菜单展开时的宽度
                }
              ]}
              style="transition: all var(--transition-time-02);" // 添加过渡效果
            ></Logo>
          ) : undefined}
          {/* 菜单组件 */}
          <Menu class={[{ '!h-[calc(100%-var(--logo-height))]': logo.value }]}></Menu>
        </div>
        <div
          class={[
            `${prefixCls}-content`, // 使用前缀类名
            'absolute top-0 h-[100%]',
            {
              'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
                collapse.value && !mobile.value && !mobile.value, // 菜单折叠时的内容宽度
              'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]':
                !collapse.value && !mobile.value && !mobile.value, // 菜单展开时的内容宽度
              'fixed !w-full !left-0': mobile.value // 移动端的布局设置
            }
          ]}
          style="transition: all var(--transition-time-02);" // 添加过渡效果
        >
          <ElScrollbar
            v-loading={pageLoading.value} // 根据页面加载状态显示 loading
            class={[
              `${prefixCls}-content-scrollbar`,
              {
                '!h-[calc(100%-var(--top-tool-height)-var(--tags-view-height))] mt-[calc(var(--top-tool-height)+var(--tags-view-height))]':
                  fixedHeader.value // 当固定头部存在时的高度设置
              }
            ]}
          >
            <div
              class={[
                {
                  'fixed top-0 left-0 z-10': fixedHeader.value, // 当固定头部时，设置位置
                  'w-[calc(100%-var(--left-menu-min-width))] !left-[var(--left-menu-min-width)]':
                    collapse.value && fixedHeader.value && !mobile.value, // 菜单折叠状态下的宽度设置
                  'w-[calc(100%-var(--left-menu-max-width))] !left-[var(--left-menu-max-width)]':
                    !collapse.value && fixedHeader.value && !mobile.value, // 菜单展开状态下的宽度设置
                  '!w-full !left-0': mobile.value // 移动端的宽度设置
                }
              ]}
              style="transition: all var(--transition-time-02);" // 添加过渡效果
            >
              <ToolHeader
                class={[
                  'bg-[var(--top-header-bg-color)]', // 头部背景颜色
                  {
                    'layout-border__bottom': !tagsView.value // 根据标签页的状态设置底部边框
                  }
                ]}
              ></ToolHeader>

              {tagsView.value ? ( // 判断标签页是否存在
                <TagsView class="layout-border__bottom layout-border__top"></TagsView>
              ) : undefined}
            </div>

            {/* 主视图组件 */}
            <AppView></AppView>
          </ElScrollbar>
        </div>
      </>
    )
  }

  /** 定义渲染左上角区域的函数 */
  const renderTopLeft = () => {
    return (
      <>
        {/* 定义一个包含logo和工具头部的容器 */}
        <div class="flex items-center bg-[var(--top-header-bg-color)] relative layout-border__bottom dark:bg-[var(--el-bg-color)]">
          {/* 如果logo存在则渲染Logo组件 */}
          {logo.value ? <Logo class="custom-hover"></Logo> : undefined}

          {/* 渲染工具头部组件，占满剩余空间 */}
          <ToolHeader class="flex-1"></ToolHeader>
        </div>

        {/* 定义一个绝对定位的容器，用于菜单和内容部分 */}
        <div class="absolute top-[var(--logo-height)+1px] left-0 w-full h-[calc(100%-1px-var(--logo-height))] flex">
          {/* 渲染菜单组件，设置高度为满 */}
          <Menu class="!h-full relative layout-border__right"></Menu>

          {/* 渲染内容区域，根据是否折叠动态调整宽度和左边距 */}
          <div
            class={[
              `${prefixCls}-content`, // 基础类名
              'h-[100%]', // 设置高度为100%
              {
                // 根据collapse状态设置动态样式
                'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
                  collapse.value,
                'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]':
                  !collapse.value
              }
            ]}
            style="transition: all var(--transition-time-02);" // 设置过渡效果
          >
            {/* 渲染滚动条组件，并支持加载状态 */}
            <ElScrollbar
              v-loading={pageLoading.value} // 根据加载状态显示加载效果
              class={[
                `${prefixCls}-content-scrollbar`, // 基础类名
                {
                  // 根据fixedHeader和tagsView的状态设置样式
                  '!h-[calc(100%-var(--tags-view-height))] mt-[calc(var(--tags-view-height))]':
                    fixedHeader.value && tagsView.value
                }
              ]}
            >
              {/* 如果tagsView存在，则渲染TagsView组件 */}
              {tagsView.value ? (
                <TagsView
                  class={[
                    'layout-border__bottom absolute', // 定义标签视图样式
                    {
                      // 根据fixedHeader状态设置位置和层级
                      '!fixed top-0 left-0 z-10': fixedHeader.value,
                      'w-[calc(100%-var(--left-menu-min-width))] !left-[var(--left-menu-min-width)] mt-[calc(var(--logo-height)+1px)]':
                        collapse.value && fixedHeader.value,
                      'w-[calc(100%-var(--left-menu-max-width))] !left-[var(--left-menu-max-width)] mt-[calc(var(--logo-height)+1px)]':
                        !collapse.value && fixedHeader.value
                    }
                  ]}
                  style="transition: width var(--transition-time-02), left var(--transition-time-02);" // 设置宽度和左边距过渡
                ></TagsView>
              ) : undefined}

              {/* 渲染应用视图组件 */}
              <AppView></AppView>
            </ElScrollbar>
          </div>
        </div>
      </>
    )
  }

  /** 定义一个渲染顶部组件的常量 */
  const renderTop = () => {
    return (
      <>
        <div
          class={[
            // 设置顶部容器的样式类，使用flex布局以使内容水平排列
            'flex items-center justify-between bg-[var(--top-header-bg-color)] relative',
            {
              'layout-border__bottom': !tagsView.value // 如果没有标签视图，则会渲染底部边框
            }
          ]}
        >
          {/* 如果logo存在，则渲染Logo组件，并添加自定义悬停样式 */}
          {logo.value ? <Logo class="custom-hover"></Logo> : undefined}
          {/* 渲染菜单组件，Flex占满可用空间 */}
          <Menu class="flex-1 px-10px h-[var(--top-tool-height)]"></Menu>
          {/* 渲染工具头部组件 */}
          <ToolHeader></ToolHeader>
        </div>
        <div
          class={[
            // 设置组件内容的样式类
            `${prefixCls}-content`,
            'w-full',
            {
              // 根据fixedHeader的值决定内容区域的高度
              'h-[calc(100%-var(--top-tool-height))]': !fixedHeader.value,
              'h-[calc(100%-var(--tags-view-height)-var(--top-tool-height))]': fixedHeader.value
            }
          ]}
        >
          {/* 渲染带有滚动条的容器，并根据pageLoading的值显示加载指示器 */}
          <ElScrollbar
            v-loading={pageLoading.value}
            class={[
              `${prefixCls}-content-scrollbar`,
              {
                // 如果fixedHeader为true，添加不同的内边距
                'mt-[var(--tags-view-height)] !pb-[calc(var(--tags-view-height)+var(--app-footer-height))]':
                  fixedHeader.value,
                // 如果fixedHeader为false，添加底部边距
                'pb-[var(--app-footer-height)]': !fixedHeader.value
              }
            ]}
          >
            {tagsView.value ? ( // 如果tagsView存在，则渲染TagsView组件，并设置样式
              <TagsView
                class={[
                  'layout-border__bottom layout-border__top relative',
                  {
                    // 如果fixedHeader为true，设置为固定定位，并调整位置
                    '!fixed w-full top-[calc(var(--top-tool-height)+1px)] left-0': fixedHeader.value
                  }
                ]}
                // 设置过渡效果
                style="transition: width var(--transition-time-02), left var(--transition-time-02);"
              ></TagsView>
            ) : undefined}

            {/* 渲染应用视图组件 */}
            <AppView></AppView>
          </ElScrollbar>
        </div>
      </>
    )
  }

  /**
   * 渲染剪切菜单的函数
   * @returns {JSX.Element} 返回渲染的菜单组件
   */
  const renderCutMenu = () => {
    return (
      <>
        {/* 顶部菜单容器，包含 logo 和工具头部 */}
        <div class="flex items-center bg-[var(--top-header-bg-color)] relative layout-border__bottom">
          {/* 如果存在 logo，则渲染 Logo 组件 */}
          {logo.value ? <Logo class="custom-hover !pr-15px"></Logo> : undefined}

          {/* 渲染工具头部 */}
          <ToolHeader class="flex-1"></ToolHeader>
        </div>
        {/* 主内容区，绝对定位在 logo 下方 */}
        <div class="absolute top-[var(--logo-height)] left-0 w-[calc(100%-2px)] h-[calc(100%-var(--logo-height))] flex">
          {/* 渲染标签菜单 */}
          <TabMenu></TabMenu>
          <div
            class={[
              // 内容区的类名组合
              `${prefixCls}-content`, // 动态前缀类
              'h-[100%]', // 高度设置为100%
              {
                // 根据 collapse 和 fixedMenu 的状态动态设置宽度和左边距
                'w-[calc(100%-var(--tab-menu-min-width))] left-[var(--tab-menu-min-width)]':
                  collapse.value && !fixedMenu.value,
                'w-[calc(100%-var(--tab-menu-max-width))] left-[var(--tab-menu-max-width)]':
                  !collapse.value && !fixedMenu.value,
                'w-[calc(100%-var(--tab-menu-min-width)-var(--left-menu-max-width))] ml-[var(--left-menu-max-width)]':
                  collapse.value && fixedMenu.value,
                'w-[calc(100%-var(--tab-menu-max-width)-var(--left-menu-max-width))] ml-[var(--left-menu-max-width)]':
                  !collapse.value && fixedMenu.value
              }
            ]}
            style="transition: all var(--transition-time-02);" // 设置过渡效果
          >
            {/* 滚动条组件，带加载状态 */}
            <ElScrollbar
              v-loading={pageLoading.value} // 根据 pageLoading 的值显示加载状态
              class={[
                `${prefixCls}-content-scrollbar`, // 滚动条的动态前缀类
                {
                  // 如果有固定头部且有标签视图，调整滚动条的高度和上边距
                  '!h-[calc(100%-var(--tags-view-height))] mt-[calc(var(--tags-view-height))]':
                    fixedHeader.value && tagsView.value
                }
              ]}
            >
              {/* 如果存在标签视图，则渲染 TagsView 组件 */}
              {tagsView.value ? (
                <TagsView
                  class={[
                    'relative layout-border__bottom layout-border__top', // 标签视图的样式类
                    {
                      // 根据固定头部和菜单状态动态设置样式
                      '!fixed top-0 left-0 z-10': fixedHeader.value,
                      'w-[calc(100%-var(--tab-menu-min-width))] !left-[var(--tab-menu-min-width)] mt-[var(--logo-height)]':
                        collapse.value && fixedHeader.value,
                      'w-[calc(100%-var(--tab-menu-max-width))] !left-[var(--tab-menu-max-width)] mt-[var(--logo-height)]':
                        !collapse.value && fixedHeader.value,
                      '!fixed top-0 !left-[var(--tab-menu-min-width)+var(--left-menu-max-width)] z-10':
                        fixedHeader.value && fixedMenu.value,
                      'w-[calc(100%-var(--tab-menu-min-width)-var(--left-menu-max-width))] !left-[var(--tab-menu-min-width)+var(--left-menu-max-width)] mt-[var(--logo-height)]':
                        collapse.value && fixedHeader.value && fixedMenu.value,
                      'w-[calc(100%-var(--tab-menu-max-width)-var(--left-menu-max-width))] !left-[var(--tab-menu-max-width)+var(--left-menu-max-width)] mt-[var(--logo-height)]':
                        !collapse.value && fixedHeader.value && fixedMenu.value
                    }
                  ]}
                  style="transition: width var(--transition-time-02), left var(--transition-time-02);" // 设置标签视图的宽度和左边距的过渡效果
                ></TagsView>
              ) : undefined}

              {/* 渲染应用视图 */}
              <AppView></AppView>
            </ElScrollbar>
          </div>
        </div>
      </>
    )
  }

  return {
    /** 经典布局渲染方法 */
    renderClassic,
    /** 顶部左侧布局渲染方法 */
    renderTopLeft,
    /** 顶部布局渲染方法 */
    renderTop,
    /** 菜单折叠布局渲染方法 */
    renderCutMenu
  }
}
