/**
 * @file /src/components/Menu/src/components/useRenderMenuTitle.tsx
 * @description 渲染菜单标题的逻辑，支持国际化和图标展示
 * @example 使用方式：const { renderMenuTitle } = useRenderMenuTitle()
 * @version 1.0.0
 * @date 2024-11-22
 * @module UseRenderMenuTitleHookModule
 * @jsx tsx
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 RouteMeta 类型，用于定义路由的 meta 信息
import type { RouteMeta } from 'vue-router'

// 引入图标组件
import { Icon } from '@/components/Icon'

// 引入国际化 Hook，用于实现多语言支持
import { useI18n } from '@/hooks/web/useI18n'

/**
 * @description 渲染菜单标题的逻辑
 * @returns 包含 renderMenuTitle 方法的对象
 */
export const useRenderMenuTitle = () => {
  /**
   * @description 渲染菜单标题
   * @param meta 路由的 meta 信息，包含标题和图标
   * @returns 菜单标题的 JSX 结构
   */
  const renderMenuTitle = (meta: RouteMeta) => {
    // 从国际化 Hook 中获取翻译函数
    const { t } = useI18n()

    // 解构路由的标题和图标信息，并设置默认值
    const { title = 'Please set title', icon } = meta

    // 如果有图标，渲染图标和标题
    return icon ? (
      <>
        <Icon icon={meta.icon}></Icon> {/* 渲染图标 */}
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t(title as string)} {/* 渲染标题并支持多语言 */}
        </span>
      </>
    ) : (
      // 如果没有图标，仅渲染标题
      <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
        {t(title as string)} {/* 渲染标题并支持多语言 */}
      </span>
    )
  }

  return {
    renderMenuTitle // 返回渲染菜单标题的方法
  }
}
