/**
 * @file /src/components/Menu/src/components/useRenderMenuItem.tsx
 * @description 渲染菜单项的逻辑，支持动态生成菜单项和子菜单
 * @example 使用方式：const { renderMenuItem } = useRenderMenuItem(menuMode)
 * @version 1.0.0
 * @date 2024-11-22
 * @module UseRenderMenuItemHookModule
 * @jsx tsx
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 Element Plus 引入菜单组件
import { ElSubMenu, ElMenuItem } from 'element-plus'

// 从 Vue 引入 unref 工具，用于解包响应式对象
import { unref } from 'vue'

// 引入辅助方法，用于判断是否只有一个子菜单项
import { hasOneShowingChild } from '../helper'

// 引入工具方法，用于判断是否为 URL
import { isUrl } from '@/utils/is'

// 引入自定义 Hook，用于渲染菜单标题
import { useRenderMenuTitle } from './useRenderMenuTitle'

// 引入路由帮助方法，用于解析路径
import { pathResolve } from '@/utils/routerHelper'

// 引入设计样式 Hook
import { useDesign } from '@/hooks/web/useDesign'

// 获取样式前缀函数
const { getPrefixCls } = useDesign()

// 定义样式前缀
const prefixCls = getPrefixCls('submenu')

// 获取渲染菜单标题的方法
const { renderMenuTitle } = useRenderMenuTitle()

/**
 * @description 用于动态渲染菜单项
 * @param menuMode 菜单模式，支持 "vertical" 和其他模式
 * @returns 包含 renderMenuItem 方法的对象
 */
export const useRenderMenuItem = (menuMode) =>
  // 渲染菜单项的主函数
  {
    /**
     * @description 递归渲染菜单项
     * @param routers 路由数组
     * @param parentPath 父路径，默认为根路径
     * @returns 渲染后的菜单项
     */
    const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/') => {
      return routers
        .filter((v) => !v.meta?.hidden) // 过滤掉隐藏的菜单项
        .map((v) => {
          const meta = v.meta ?? {} // 获取路由的 meta 信息
          const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v) // 判断是否只有一个子菜单项
          const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path) // 获取完整路径

          // 如果只有一个子菜单项且不需要显示为父菜单
          if (
            oneShowingChild &&
            (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
            !meta?.alwaysShow
          ) {
            return (
              <ElMenuItem
                index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath} // 设置菜单项的路径
              >
                {{
                  default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta) // 渲染菜单标题
                }}
              </ElMenuItem>
            )
          } else {
            // 否则渲染为子菜单
            return (
              <ElSubMenu
                index={fullPath} // 设置子菜单的路径
                teleported // 开启子菜单的传送功能
                popperClass={unref(menuMode) === 'vertical' ? `${prefixCls}-popper--vertical` : ''} // 根据菜单模式动态设置弹出菜单的样式
              >
                {{
                  title: () => renderMenuTitle(meta), // 渲染子菜单的标题
                  default: () => renderMenuItem(v.children!, fullPath) // 递归渲染子菜单
                }}
              </ElSubMenu>
            )
          }
        })
    }

    return {
      renderMenuItem // 返回渲染菜单项的方法
    }
  }
