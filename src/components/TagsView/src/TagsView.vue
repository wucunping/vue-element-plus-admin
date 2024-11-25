<script setup lang="ts">
/*
 * @file TagsView.vue
 * @description 用于显示和管理标签页的组件，实现了标签页的新增、关闭、刷新和滚动等功能。
 * @example <TagsView />
 * @version 1.0.0
 * @date 2024-11-22
 * @module TagsView
 * @author [吴尘](https://github.com/wucunping)
 */

/** 导入 Vue 的核心 API，用于生命周期管理、响应式数据、计算属性等 */
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
/** 导入 Vue Router 的核心 API 和类型 */
import { useRouter } from 'vue-router'
/** 导入路由相关的类型 */
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
/** 导入权限模块的 Store，用于权限路由管理 */
import { usePermissionStore } from '@/store/modules/permission'
/** 导入 TagsView 的 Store，用于管理标签页 */
import { useTagsViewStore } from '@/store/modules/tagsView'
/** 导入应用程序的 Store，用于全局状态管理 */
import { useAppStore } from '@/store/modules/app'
/** 导入国际化工具 */
import { useI18n } from '@/hooks/web/useI18n'
/** 导入辅助函数，用于过滤固定标签 */
import { filterAffixTags } from './helper'
/** 导入右键菜单组件及其类型 */
import { ContextMenu, ContextMenuExpose } from '@/components/ContextMenu'
/** 导入设计系统相关的工具 */
import { useDesign } from '@/hooks/web/useDesign'
/** 导入 VueUse 的模板引用列表工具 */
import { useTemplateRefsList } from '@vueuse/core'
/** 导入 Element Plus 的滚动条组件 */
import { ElScrollbar } from 'element-plus'
/** 导入滚动工具，用于滚动到指定位置 */
import { useScrollTo } from '@/hooks/event/useScrollTo'
/** 导入 TagsView 的逻辑处理 */
import { useTagsView } from '@/hooks/web/useTagsView'
/** 导入 Lodash 的深拷贝工具 */
import { cloneDeep } from 'lodash-es'

/** 获取设计系统的前缀，用于生成特定组件的类名 */
const { getPrefixCls } = useDesign()

/** TagsView 的前缀类名 */
const prefixCls = getPrefixCls('tags-view')

/** 国际化的翻译函数 */
const { t } = useI18n()

/** 当前路由和路由跳转方法 */
const { currentRoute, push } = useRouter()

/** TagsView 中的关闭和刷新操作 */
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()

/** 权限管理的 Store */
const permissionStore = usePermissionStore()

/** 路由表的计算属性 */
const routers = computed(() => permissionStore.getRouters)

/** 标签页管理的 Store */
const tagsViewStore = useTagsViewStore()

/** 已访问标签的计算属性 */
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

/** 固定标签数组 */
const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

/** 当前选中的标签 */
const selectedTag = computed(() => tagsViewStore.getSelectedTag)

/** 设置当前选中标签的方法 */
const setSelectTag = tagsViewStore.setSelectedTag

/** 全局应用的 Store */
const appStore = useAppStore()

/** 是否显示 TagsView 图标 */
const tagsViewIcon = computed(() => appStore.getTagsViewIcon)

/** 是否处于深色模式 */
const isDark = computed(() => appStore.getIsDark)

/** 初始化标签，将固定标签添加到标签视图中 */
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers)) // 过滤出固定标签
  for (const tag of unref(affixTagArr)) {
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag)) // 添加到已访问标签列表
    }
  }
}

/** 新增标签，将当前路由添加到标签视图中 */
const addTags = () => {
  const { name } = unref(currentRoute) // 获取当前路由名称
  if (name) {
    setSelectTag(unref(currentRoute)) // 设置当前选中标签
    tagsViewStore.addView(unref(currentRoute)) // 添加到标签视图中
  }
}

/** 关闭选中的标签 */
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  closeCurrent(view, () => {
    if (isActive(view)) {
      toLastView() // 如果是当前标签，跳转到最后一个标签
    }
  })
}

/** 跳转到最后一个标签 */
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews // 获取已访问标签
  const latestView = visitedViews.slice(-1)[0] // 获取最后一个标签
  if (latestView) {
    push(latestView) // 跳转到最后一个标签
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags() // 添加标签
      return
    }
    push(permissionStore.getAddRouters[0].path) // 跳转到默认路由
  }
}

/** 关闭所有标签 */
const closeAllTags = () => {
  closeAll(() => {
    toLastView() // 关闭所有标签后跳转到最后一个标签
  })
}

/** 关闭其他标签 */
const closeOthersTags = () => {
  closeOther() // 关闭其他标签
}

/** 刷新选中的标签 */
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  refreshPage(view) // 刷新页面
}

/** 关闭左侧标签 */
const closeLeftTags = () => {
  closeLeft() // 关闭左侧标签
}

/** 关闭右侧标签 */
const closeRightTags = () => {
  closeRight() // 关闭右侧标签
}

/** 滚动到选中的标签 */
const moveToCurrentTag = async () => {
  await nextTick() // 等待 DOM 更新
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v) // 滚动到目标标签
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute)) // 更新已访问标签
      }
      break
    }
  }
}

/** 标签链接的引用列表 */
const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

/** 滚动到目标标签 */
const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef // 获取滚动容器
  let firstTag: Nullable<RouterLinkProps> = null // 第一个标签
  let lastTag: Nullable<RouterLinkProps> = null // 最后一个标签

  const tagList = unref(tagLinksRefs) // 获取标签列表
  if (tagList.length > 0) {
    firstTag = tagList[0] // 设置第一个标签
    lastTag = tagList[tagList.length - 1] // 设置最后一个标签
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0, // 滚动到起始位置
      duration: 500
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth, // 滚动到末尾
      duration: 500
    })
    start()
  } else {
    // 滚动到前一个或后一个标签
    const currentIndex: number = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement // 前一个标签
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement // 后一个标签

    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4 // 后一个标签的右侧偏移
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4 // 前一个标签的左侧偏移

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

/** 判断是否为当前活动标签 */
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

/** 右键菜单的所有元素引用列表 */
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

/** 右键菜单状态改变时触发 */
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef // 菜单引用
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose() // 关闭其他菜单
        setSelectTag(tagItem) // 设置选中标签
      }
    }
  }
}

/** ElScrollbar 的实例引用，用于操作滚动条 */
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

/** 当前滚动位置的左偏移量 */
const scrollLeftNumber = ref(0)

/**
 * 监听滚动事件，更新滚动位置
 * @param scrollLeft 当前滚动条的左偏移量
 */
const scroll = ({ scrollLeft }) => {
  scrollLeftNumber.value = scrollLeft as number
}

/**
 * 滚动到某个特定位置
 * @param to 偏移量，滚动到当前位置的偏移值
 */
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef // 获取滚动容器的引用
  const { start } = useScrollTo({
    el: wrap$!, // 滚动容器元素
    position: 'scrollLeft', // 水平滚动
    to: unref(scrollLeftNumber) + to, // 滚动到目标位置
    duration: 500 // 动画持续时间
  })
  start() // 开始滚动
}

/**
 * 判断当前标签是否可以显示图标
 * @param item 标签项的路由信息
 * @returns 是否可以显示图标
 */
const canShowIcon = (item: RouteLocationNormalizedLoaded) => {
  if (
    (item?.matched?.[1]?.meta?.icon && unref(tagsViewIcon)) || // 有匹配的图标且启用了标签视图图标
    (item?.meta?.affix && unref(tagsViewIcon) && item?.meta?.icon) // 固定标签且有图标
  ) {
    return true
  }
  return false
}

/** 组件挂载时初始化标签视图 */
onMounted(() => {
  initTags() // 初始化固定标签
  addTags() // 添加当前路由为标签
})

/** 监听当前路由变化，动态添加标签并滚动到当前标签 */
watch(
  () => currentRoute.value, // 监听当前路由
  () => {
    addTags() // 添加新标签
    moveToCurrentTag() // 滚动到当前标签
  }
)
</script>

<template>
  <!-- 主容器 -->
  <div
    :id="prefixCls"
    :class="prefixCls"
    class="flex w-full relative bg-[#fff] dark:bg-[var(--el-bg-color)]"
  >
    <!-- 左侧滚动工具 -->
    <!-- :class="`${prefixCls}__tool ${prefixCls}__tool--first`" 工具的类名 -->
    <!-- class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer" 工具的尺寸和样式 -->
    <!-- @click="move(-200)" 点击触发向左滚动 -->
    <span
      :class="`${prefixCls}__tool ${prefixCls}__tool--first`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="move(-200)"
    >
      <!-- 左箭头图标 -->
      <!-- icon="vi-ep:d-arrow-left" 图标名称 -->
      <!-- color="var(--el-text-color-placeholder)" 图标默认颜色 -->
      <!-- :hover-color="isDark ? '#fff' : 'var(--el-color-black)'" 图标悬停时的颜色 -->
      <Icon
        icon="vi-ep:d-arrow-left"
        color="var(--el-text-color-placeholder)"
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
      />
    </span>

    <!-- 主内容区域 -->
    <div class="overflow-hidden flex-1">
      <!-- 滚动条容器 -->
      <!-- ref="scrollbarRef" 绑定滚动条实例 -->
      <!-- class="h-full" 设置高度为100% -->
      <!-- @scroll="scroll" 滚动时触发scroll事件 -->
      <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
        <!-- 内容区域 -->
        <!-- class="flex h-full" 使用Flex布局，高度为100% -->
        <div class="flex h-full">
          <!-- 上下文菜单 -->
          <!-- :ref="itemRefs.set" 绑定菜单实例 -->
          <!-- :schema 定义菜单项 -->
          <!-- v-for="item in visitedViews" 遍历所有已访问的标签 -->
          <!-- :key="item.fullPath" 每个菜单的唯一标识 -->
          <!-- :tag-item="item" 绑定当前标签项 -->
          <!-- :class 设置类名 -->
          <!-- @visible-change="visibleChange" 菜单可见性改变时触发 -->
          <ContextMenu
            :ref="itemRefs.set"
            :schema="[
              {
                icon: 'vi-ant-design:sync-outlined',
                label: t('common.reload'),
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  refreshSelectedTag(item)
                }
              },
              {
                icon: 'vi-ant-design:close-outlined',
                label: t('common.closeTab'),
                disabled: !!visitedViews?.length && selectedTag?.meta.affix,
                command: () => {
                  closeSelectedTag(item)
                }
              },
              {
                divided: true,
                icon: 'vi-ant-design:vertical-right-outlined',
                label: t('common.closeTheLeftTab'),
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[0].fullPath ||
                    selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeLeftTags()
                }
              },
              {
                icon: 'vi-ant-design:vertical-left-outlined',
                label: t('common.closeTheRightTab'),
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[visitedViews.length - 1].fullPath ||
                    selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeRightTags()
                }
              },
              {
                divided: true,
                icon: 'vi-ant-design:tag-outlined',
                label: t('common.closeOther'),
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  closeOthersTags()
                }
              },
              {
                icon: 'vi-ant-design:line-outlined',
                label: t('common.closeAll'),
                command: () => {
                  closeAllTags()
                }
              }
            ]"
            v-for="item in visitedViews"
            :key="item.fullPath"
            :tag-item="item"
            :class="[
              `${prefixCls}__item`,
              item?.meta?.affix ? `${prefixCls}__item--affix` : '',
              {
                'is-active': isActive(item)
              }
            ]"
            @visible-change="visibleChange"
          >
            <!-- 标签内容 -->
            <div>
              <!-- 路由链接 -->
              <!-- :ref="tagLinksRefs.set" 绑定路由实例 -->
              <!-- :to="{ ...item }" 跳转到当前标签的路由 -->
              <!-- custom 自定义插槽 -->
              <router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                <!-- 标签项 -->
                <!-- @click="navigate" 点击跳转 -->
                <!-- class 设置标签样式 -->
                <div
                  @click="navigate"
                  class="h-full flex justify-center items-center whitespace-nowrap pl-15px"
                >
                  <!-- 标签图标 -->
                  <!-- v-if="canShowIcon(item)" 判断是否显示图标 -->
                  <!-- :icon 设置图标 -->
                  <!-- :size 设置图标大小 -->
                  <!-- class 设置图标样式 -->
                  <Icon
                    v-if="canShowIcon(item)"
                    :icon="item?.matched?.[1]?.meta?.icon || item?.meta?.icon"
                    :size="12"
                    class="mr-5px"
                  />
                  <!-- 标签标题 -->
                  {{ t(item?.meta?.title as string) }}
                  <!-- 关闭标签按钮 -->
                  <!-- :class 设置样式 -->
                  <!-- color 设置颜色 -->
                  <!-- :size 设置大小 -->
                  <!-- @click.prevent.stop 阻止冒泡并触发关闭 -->
                  <Icon
                    :class="`${prefixCls}__item--close`"
                    color="#333"
                    icon="vi-ant-design:close-outlined"
                    :size="12"
                    @click.prevent.stop="closeSelectedTag(item)"
                  />
                </div>
              </router-link>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>

    <!-- 向右滚动按钮 -->
    <!-- :class="`${prefixCls}__tool`" 动态设置类名 -->
    <!-- class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer" 设置宽高、居中样式和鼠标指针样式 -->
    <!-- @click="move(200)" 点击事件：向右滚动200像素 -->
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="move(200)"
    >
      <!-- 图标 -->
      <!-- icon="vi-ep:d-arrow-right" 向右箭头图标 -->
      <!-- color="var(--el-text-color-placeholder)" 设置默认颜色 -->
      <!-- :hover-color="isDark ? '#fff' : 'var(--el-color-black)'" 鼠标悬停时的颜色 -->
      <Icon
        icon="vi-ep:d-arrow-right"
        color="var(--el-text-color-placeholder)"
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
      />
    </span>

    <!-- 刷新当前选中标签按钮 -->
    <!-- :class="`${prefixCls}__tool`" 动态设置类名 -->
    <!-- class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer" 设置宽高、居中样式和鼠标指针样式 -->
    <!-- @click="refreshSelectedTag(selectedTag)" 点击事件：刷新当前选中标签 -->
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="refreshSelectedTag(selectedTag)"
    >
      <!-- 图标 -->
      <!-- icon="vi-ant-design:reload-outlined" 刷新图标 -->
      <!-- color="var(--el-text-color-placeholder)" 设置默认颜色 -->
      <!-- :hover-color="isDark ? '#fff' : 'var(--el-color-black)'" 鼠标悬停时的颜色 -->
      <Icon
        icon="vi-ant-design:reload-outlined"
        color="var(--el-text-color-placeholder)"
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
      />
    </span>

    <!-- 右键菜单组件 -->
    <!-- trigger="click" 触发方式为点击 -->
    <!-- :schema 定义右键菜单的选项 -->
    <ContextMenu
      trigger="click"
      :schema="[
        {
          // 刷新标签页
          icon: 'vi-ant-design:sync-outlined', // 图标：刷新
          label: t('common.reload'), // 标签：刷新
          command: () => {
            // 点击时执行的命令
            refreshSelectedTag(selectedTag) // 刷新选中的标签页
          }
        },
        {
          // 关闭当前标签页
          icon: 'vi-ant-design:close-outlined', // 图标：关闭
          label: t('common.closeTab'), // 标签：关闭标签页
          disabled: !!visitedViews?.length && selectedTag?.meta.affix, // 是否禁用：如果选中标签是固定的则禁用
          command: () => {
            // 点击时执行的命令
            closeSelectedTag(selectedTag!) // 关闭选中的标签页
          }
        },
        {
          // 关闭左侧标签页
          divided: true, // 添加分隔线
          icon: 'vi-ant-design:vertical-right-outlined', // 图标：关闭左侧
          label: t('common.closeTheLeftTab'), // 标签：关闭左侧标签页
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath, // 是否禁用：如果当前标签是第一个标签则禁用
          command: () => {
            // 点击时执行的命令
            closeLeftTags() // 关闭左侧标签页
          }
        },
        {
          // 关闭右侧标签页
          icon: 'vi-ant-design:vertical-left-outlined', // 图标：关闭右侧
          label: t('common.closeTheRightTab'), // 标签：关闭右侧标签页
          disabled:
            !!visitedViews?.length &&
            selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath, // 是否禁用：如果当前标签是最后一个标签则禁用
          command: () => {
            // 点击时执行的命令
            closeRightTags() // 关闭右侧标签页
          }
        },
        {
          // 关闭其它标签页
          divided: true, // 添加分隔线
          icon: 'vi-ant-design:tag-outlined', // 图标：关闭其它
          label: t('common.closeOther'), // 标签：关闭其它
          command: () => {
            // 点击时执行的命令
            closeOthersTags() // 关闭其它标签页
          }
        },
        {
          // 关闭所有标签页
          icon: 'vi-ant-design:line-outlined', // 图标：关闭所有
          label: t('common.closeAll'), // 标签：关闭所有
          command: () => {
            // 点击时执行的命令
            closeAllTags() // 关闭所有标签页
          }
        }
      ]"
    >
      <!-- 菜单按钮 -->
      <!-- :class="`${prefixCls}__tool`" 动态设置类名 -->
      <!-- class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer block" 设置按钮的样式 -->
      <span
        :class="`${prefixCls}__tool`"
        class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer block"
      >
        <!-- 图标 -->
        <!-- icon="vi-ant-design:setting-outlined" 菜单设置图标 -->
        <!-- color="var(--el-text-color-placeholder)" 默认颜色 -->
        <!-- :hover-color="isDark ? '#fff' : 'var(--el-color-black)'" 鼠标悬停时的颜色 -->
        <Icon
          icon="vi-ant-design:setting-outlined"
          color="var(--el-text-color-placeholder)"
          :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        />
      </span>
    </ContextMenu>
  </div>
</template>

<style lang="less" scoped>
/* 设置前缀类名，基于命名空间 adminNamespace */
@prefix-cls: ~'@{adminNamespace}-tags-view';

/* 主样式容器 */
.@{prefix-cls} {
  /* 设置滚动条内容区域的高度 */
  :deep(.@{elNamespace}-scrollbar__view) {
    height: 100%;
  }

  /* 工具按钮样式 */
  &__tool {
    position: relative;

    /* 工具按钮的左侧边框 */
    &::before {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(~'100% - 1px');
      border-left: 1px solid var(--el-border-color);
      content: '';
    }

    /* 第一个工具按钮样式 */
    &--first {
      /* 第一个工具按钮的右侧边框 */
      &::before {
        position: absolute;
        top: 1px;
        left: 0;
        width: 100%;
        height: calc(~'100% - 1px');
        border-right: 1px solid var(--el-border-color);
        border-left: none;
        content: '';
      }
    }
  }

  /* 标签项样式 */
  &__item {
    position: relative;
    top: 3px;
    height: calc(~'100% - 6px');
    padding-right: 25px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;

    /* 标签关闭按钮 */
    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }

    /* 非固定标签项的悬停样式 */
    &:not(.@{prefix-cls}__item--affix):hover {
      .@{prefix-cls}__item--close {
        display: block;
      }
    }
  }

  /* 非激活状态标签项的悬停样式 */
  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  /* 激活状态的标签项样式 */
  &__item.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);

    /* 激活状态下的关闭按钮颜色 */
    .@{prefix-cls}__item--close {
      :deep(svg) {
        color: var(--el-color-white) !important;
      }
    }
  }
}

/* 暗黑主题样式 */
.dark {
  .@{prefix-cls} {
    /* 工具按钮样式 */
    &__tool {
      /* 第一个工具按钮在暗黑模式下隐藏右侧分隔线 */
      &--first {
        &::after {
          display: none;
        }
      }
    }

    /* 标签项样式 */
    &__item {
      border: 1px solid var(--el-border-color);
    }

    /* 非激活状态标签项的悬停样式 */
    &__item:not(.is-active) {
      &:hover {
        color: var(--el-color-primary);
      }
    }

    /* 激活状态的标签项样式 */
    &__item.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);

      /* 激活状态下的关闭按钮颜色 */
      .@{prefix-cls}__item--close {
        :deep(svg) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }
}
</style>
