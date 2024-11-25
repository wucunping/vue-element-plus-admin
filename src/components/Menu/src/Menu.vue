<script lang="tsx">
/**
 * @file /src/components/Menu/src/Menu.vue
 * @description Menu 组件，用于生成动态菜单，支持多种布局模式（垂直、水平等）和菜单选项
 * @example 使用方式：<Menu :menuSelect="handleMenuSelect" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module MenuComponentModule
 * @jsx tsx
 * @style Scoped Less, Global Less
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 Vue 引入工具函数和组件定义
import { computed, defineComponent, unref, PropType } from 'vue'

// 从 Element Plus 引入菜单和滚动条组件
import { ElMenu, ElScrollbar } from 'element-plus'

// 引入应用状态管理模块
import { useAppStore } from '@/store/modules/app'

// 引入权限管理模块
import { usePermissionStore } from '@/store/modules/permission'

// 引入渲染菜单项的逻辑
import { useRenderMenuItem } from './components/useRenderMenuItem'

// 从 Vue 路由中引入路由相关方法
import { useRouter } from 'vue-router'

// 引入工具方法，用于判断是否为 URL
import { isUrl } from '@/utils/is'

// 引入样式设计工具
import { useDesign } from '@/hooks/web/useDesign'

// 获取样式前缀函数
const { getPrefixCls } = useDesign()

// 定义菜单组件的样式前缀
const prefixCls = getPrefixCls('menu')

// 定义并导出菜单组件
export default defineComponent({
  name: 'Menu', // 组件名称
  props: {
    /** 菜单选中事件 */
    menuSelect: {
      type: Function as PropType<(index: string) => void>, // 自定义函数类型
      default: undefined // 默认值为 undefined
    }
  },
  setup(props) {
    // 获取应用状态
    const appStore = useAppStore()

    // 计算属性：获取当前布局模式
    const layout = computed(() => appStore.getLayout)

    // 从路由中获取导航方法和当前路由信息
    const { push, currentRoute } = useRouter()

    // 获取权限状态
    const permissionStore = usePermissionStore()

    // 计算属性：确定菜单模式（垂直或水平）
    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 定义垂直布局类型
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      // 判断当前布局是否属于垂直模式
      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    // 计算属性：获取菜单路由
    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    // 计算属性：获取菜单折叠状态
    const collapse = computed(() => appStore.getCollapse)

    // 计算属性：获取唯一展开状态
    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    // 计算属性：获取当前激活的菜单项
    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // 如果 meta 中设置了 activeMenu，则高亮指定路径
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path // 否则高亮当前路径
    })

    // 方法：处理菜单项选中事件
    const menuSelect = (index: string) => {
      // 如果定义了外部的 menuSelect 回调，则执行
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 如果是 URL，则在新标签页打开
      if (isUrl(index)) {
        window.open(index)
      } else {
        // 否则使用路由导航
        push(index)
      }
    }

    // 方法：渲染菜单容器
    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        // 如果是顶部布局，直接渲染菜单
        return renderMenu()
      } else {
        // 否则在滚动条内渲染菜单
        return <ElScrollbar>{renderMenu()}</ElScrollbar>
      }
    }

    // 方法：渲染菜单组件
    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)} // 设置默认激活的菜单项，根据当前路由的 activeMenu 或路径
          mode={unref(menuMode)} // 设置菜单模式（垂直或水平），由 menuMode 动态计算
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          } // 是否折叠菜单，根据布局和菜单折叠状态动态设置
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)} // 是否开启独立展开模式，根据布局设置
          backgroundColor="var(--left-menu-bg-color)" // 菜单背景颜色
          textColor="var(--left-menu-text-color)" // 菜单文字颜色
          activeTextColor="var(--left-menu-text-active-color)" // 激活菜单项的文字颜色
          popperClass={
            unref(menuMode) === 'vertical'
              ? `${prefixCls}-popper--vertical` // 如果是垂直菜单，使用垂直弹出样式
              : `${prefixCls}-popper--horizontal` // 如果是水平菜单，使用水平弹出样式
          }
          onSelect={menuSelect} // 菜单项选择事件的回调函数
        >
          {{
            // 默认插槽：渲染菜单项
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(menuMode) // 获取渲染菜单项的方法
              return renderMenuItem(unref(routers)) // 使用渲染方法动态生成菜单项
            }
          }}
        </ElMenu>
      )
    }

    // 返回一个函数组件，渲染菜单容器
    return () => (
      <div
        id={prefixCls} // 设置容器的 ID，基于样式前缀
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`, // 动态设置样式类名，基于样式前缀和菜单模式
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]', // 容器的基础样式
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu', // 折叠状态时设置最小宽度
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu' // 非折叠状态时设置最大宽度
          }
        ]}
      >
        {renderMenuWrap()} {/* 调用渲染菜单包装函数 */}
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
/** 定义菜单组件的样式前缀变量 */
@prefix-cls: ~'@{adminNamespace}-menu';

/** 菜单的基础样式 */
.@{prefix-cls} {
  position: relative; // 设置菜单的相对定位
  transition: width var(--transition-time-02); // 菜单宽度变化的过渡效果

  /** 深度选择器：应用 Element Plus 菜单的样式 */
  :deep(.@{elNamespace}-menu) {
    width: 100% !important; // 强制设置菜单宽度
    border-right: none; // 移除右侧边框

    /** 设置选中状态的子菜单标题颜色 */
    .is-active {
      & > .@{elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important; // 设置选中子菜单标题的文字颜色
      }
    }

    /** 设置子菜单悬停时的高亮和背景色 */
    .@{elNamespace}-sub-menu__title,
    .@{elNamespace}-menu-item {
      &:hover {
        color: var(--left-menu-text-active-color) !important; // 悬停时的文字颜色
        background-color: var(--left-menu-bg-color) !important; // 悬停时的背景颜色
      }
    }

    /** 设置选中菜单项的高亮背景和文字颜色 */
    .@{elNamespace}-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important; // 选中项文字颜色
      background-color: var(--left-menu-bg-active-color) !important; // 选中项背景颜色

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important; // 悬停选中项的背景颜色
      }
    }

    /** 设置选中菜单项的相对定位 */
    .@{elNamespace}-menu-item.is-active {
      position: relative;
    }

    /** 设置子菜单的背景颜色 */
    .@{elNamespace}-menu {
      .@{elNamespace}-sub-menu__title,
      .@{elNamespace}-menu-item:not(.is-active) {
        background-color: var(--left-menu-bg-light-color) !important; // 子菜单背景颜色
      }
    }
  }

  /** 折叠状态下的菜单样式 */
  :deep(.@{elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width); // 设置折叠状态的最小宽度

    & > .is-active,
    & > .is-active > .@{elNamespace}-sub-menu__title {
      position: relative; // 设置选中项的相对定位
      background-color: var(
        --left-menu-collapse-bg-active-color
      ) !important; // 折叠选中项的背景颜色
    }
  }

  /** 折叠动画时隐藏文字 */
  :deep(.horizontal-collapse-transition) {
    .@{prefix-cls}__title {
      display: none; // 隐藏菜单文字
    }
  }

  /** 水平菜单样式 */
  &__horizontal {
    height: calc(~'var(--top-tool-height)') !important; // 设置水平菜单的高度

    /** 深度选择器：水平菜单样式 */
    :deep(.@{elNamespace}-menu--horizontal) {
      height: calc(~'var(--top-tool-height)'); // 设置水平菜单高度
      border-bottom: none; // 移除底部边框

      /** 设置选中子菜单的底部高亮颜色 */
      & > .@{elNamespace}-sub-menu.is-active {
        .@{elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important; // 设置高亮边框颜色
        }
      }

      /** 设置选中菜单项的相对定位 */
      .@{elNamespace}-menu-item.is-active {
        position: relative;

        &::after {
          display: none !important; // 隐藏默认的高亮效果
        }
      }

      /** 设置水平菜单标题的高度和行高 */
      .@{prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(~'var(--top-tool-height) - 2px') !important; // 最大高度
        /* stylelint-disable-next-line */
        line-height: calc(~'var(--top-tool-height) - 2px'); // 行高
      }
    }
  }
}
</style>

<style lang="less">
/**
 * 定义菜单弹出样式，支持垂直和水平菜单的选中状态、高亮效果，以及子菜单滚动条样式
 */

/** 定义菜单弹出样式的前缀变量 */
@prefix-cls: ~'@{adminNamespace}-menu-popper';

/** 垂直和水平菜单的通用样式 */
.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {
  /** 设置选中状态的子标题颜色 */
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important; // 高亮选中的子菜单标题文字颜色
    }
  }

  /** 设置子菜单悬停时的高亮和背景色 */
  .el-sub-menu__title,
  .el-menu-item {
    &:hover {
      color: var(--left-menu-text-active-color) !important; // 悬停时的文字颜色
      background-color: var(--left-menu-bg-color) !important; // 悬停时的背景颜色
    }
  }

  /** 设置选中菜单项的高亮背景 */
  .el-menu-item.is-active {
    position: relative; // 设置相对定位，确保样式层级正确
    background-color: var(--left-menu-bg-active-color) !important; // 选中菜单项的背景颜色

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important; // 悬停选中项时保持背景颜色
    }
  }
}

/** 定义子菜单弹出样式的前缀变量 */
@submenu-prefix-cls: ~'@{adminNamespace}-submenu-popper';

/** 设置子菜单溢出时的滚动样式 */
.@{submenu-prefix-cls}--vertical {
  max-height: 100%; // 设置子菜单的最大高度为 100%
  overflow-y: auto; // 启用垂直滚动条

  /** 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px; // 设置滚动条的宽度
    background-color: transparent; // 滚动条背景设置为透明
  }

  /** 自定义滚动条的滑块样式 */
  &::-webkit-scrollbar-thumb {
    background-color: rgb(144 147 153 / 30%); // 滑块的颜色，带透明度
    border-radius: 4px; // 滑块的圆角效果
  }
}
</style>
