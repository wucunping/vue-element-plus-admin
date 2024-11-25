<script lang="tsx">
/**
 * @file TabMenu.vue
 * @description Tab 菜单组件，支持动态路由的展示、导航以及折叠功能
 * @example
 * <TabMenu />
 * @version 1.0.0
 * @date 2024-11-22
 * @module src/components/TabMenu/src/TabMenu.vue
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入权限管理模块的 store
import { usePermissionStore } from '@/store/modules/permission'
// 导入应用管理模块的 store
import { useAppStore } from '@/store/modules/app'
// 导入 Vue 的核心方法和钩子
import { computed, unref, defineComponent, watch, ref, onMounted } from 'vue'
// 导入国际化方法
import { useI18n } from '@/hooks/web/useI18n'
// 从 element-plus 导入滚动条组件和指令
import { ElScrollbar, ClickOutside } from 'element-plus'
// 导入图标组件
import { Icon } from '@/components/Icon'
// 导入菜单组件
import { Menu } from '@/components/Menu'
// 导入 Vue 路由的工具方法
import { useRouter } from 'vue-router'
// 导入路径解析工具
import { pathResolve } from '@/utils/routerHelper'
// 从 lodash-es 导入深拷贝方法
import { cloneDeep } from 'lodash-es'
// 导入辅助方法和变量
import { filterMenusPath, initTabMap, tabPathMap } from './helper'
// 导入设计相关的工具方法
import { useDesign } from '@/hooks/web/useDesign'
// 导入判断是否为 URL 的方法
import { isUrl } from '@/utils/is'

/** 获取样式前缀和设计变量 */
const { getPrefixCls, variables } = useDesign()

/** Tab 菜单的样式前缀 */
const prefixCls = getPrefixCls('tab-menu')

// 定义 TabMenu 组件
export default defineComponent({
  /** 组件名称 */
  name: 'TabMenu',
  /** 自定义指令 */
  directives: {
    ClickOutside // 点击外部隐藏菜单指令
  },
  /** 组件 setup 方法 */
  setup() {
    /** Vue 路由的 push 方法和当前路由对象 */
    const { push, currentRoute } = useRouter()

    /** 国际化方法 */
    const { t } = useI18n()

    /** 应用 store */
    const appStore = useAppStore()

    /** 是否折叠的状态 */
    const collapse = computed(() => appStore.getCollapse)

    /** 固定菜单的状态 */
    const fixedMenu = computed(() => appStore.getFixedMenu)

    /** 权限管理 store */
    const permissionStore = usePermissionStore()

    /** 当前的路由列表 */
    const routers = computed(() => permissionStore.getRouters)

    /** 过滤掉隐藏的路由 */
    const tabRouters = computed(() => unref(routers).filter((v) => !v?.meta?.hidden))

    /**
     * @function 切换折叠状态
     * @description 更新菜单折叠状态
     */
    const setCollapse = () => {
      appStore.setCollapse(!unref(collapse))
    }

    /**
     * @function 初始化菜单
     * @description 根据当前路由和固定菜单状态，初始化 Tab 菜单的激活状态和子菜单
     */
    onMounted(() => {
      if (unref(fixedMenu)) {
        const path = `/${unref(currentRoute).path.split('/')[1]}` // 获取当前路径的顶级路径
        const children = unref(tabRouters).find(
          (v) =>
            (v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1)) &&
            v.path === path
        )?.children // 查找符合条件的子路由

        tabActive.value = path // 设置当前激活的 Tab
        if (children) {
          // 如果存在子路由，设置菜单 Tab 路由
          permissionStore.setMenuTabRouters(
            cloneDeep(children).map((v) => {
              v.path = pathResolve(unref(tabActive), v.path) // 解析完整路径
              return v
            })
          )
        }
      }
    })

    /**
     * @function 监听路由变化
     * @description 初始化 Tab 路径映射并过滤菜单路径
     * @param {AppRouteRecordRaw[]} routers 路由列表
     */
    watch(
      () => routers.value,
      (routers: AppRouteRecordRaw[]) => {
        initTabMap(routers) // 初始化 Tab 路径映射
        filterMenusPath(routers, routers) // 过滤菜单路径
      },
      {
        immediate: true, // 立即执行一次
        deep: true // 深度监听
      }
    )

    /** 是否显示标题 */
    const showTitle = ref(true)

    /**
     * @function 监听折叠状态变化
     * @description 根据折叠状态延迟设置标题显示状态
     * @param {boolean} collapse 折叠状态
     */
    watch(
      () => collapse.value,
      (collapse: boolean) => {
        if (!collapse) {
          setTimeout(() => {
            showTitle.value = !collapse // 设置标题显示状态
          }, 200)
        } else {
          showTitle.value = !collapse // 设置标题显示状态
        }
      },
      {
        immediate: true // 立即执行一次
      }
    )

    /** 是否显示菜单 */
    const showMenu = ref(unref(fixedMenu) ? true : false)

    /** 当前激活的 Tab */
    const tabActive = ref('')

    /**
     * @function Tab 点击事件
     * @description 处理 Tab 点击后的导航或菜单展开
     * @param {AppRouteRecordRaw} item 当前点击的 Tab 对应的路由
     */
    const tabClick = (item: AppRouteRecordRaw) => {
      if (isUrl(item.path)) {
        window.open(item.path) // 如果是外部链接，打开新窗口
        return
      }
      const newPath = item.children ? item.path : item.path.split('/')[0] // 获取新的路径
      const oldPath = unref(tabActive) // 获取旧的激活路径
      tabActive.value = item.children ? item.path : item.path.split('/')[0] // 更新激活路径
      if (item.children) {
        if (newPath === oldPath || !unref(showMenu)) {
          showMenu.value = !unref(showMenu) // 切换菜单显示状态
        }
        if (unref(showMenu)) {
          permissionStore.setMenuTabRouters(
            cloneDeep(item.children).map((v) => {
              v.path = pathResolve(unref(tabActive), v.path) // 解析完整路径
              return v
            })
          )
        }
      } else {
        push(item.path) // 导航到新的路径
        permissionStore.setMenuTabRouters([]) // 清空菜单 Tab 路由
        showMenu.value = false // 隐藏菜单
      }
    }

    /**
     * @function 判断高亮状态
     * @description 根据当前路径判断是否高亮指定路径
     * @param {string} currentPath 要判断的路径
     * @returns {boolean} 是否高亮
     */
    const isActive = (currentPath: string) => {
      const { path } = unref(currentRoute) // 获取当前路径
      if (tabPathMap[currentPath].includes(path)) {
        return true // 如果路径匹配，则高亮
      }
      return false // 否则不高亮
    }

    /**
     * @function 点击外部事件
     * @description 点击菜单外部时隐藏菜单
     */
    const clickOut = () => {
      if (!unref(fixedMenu)) {
        showMenu.value = false // 隐藏菜单
      }
    }

    /**
     * @function 渲染 Tab 菜单组件
     * @description 根据当前状态渲染 Tab 菜单、滚动条、折叠按钮及子菜单
     * @returns {JSX.Element} 渲染的 Tab 菜单组件
     */
    return () => (
      <div
        id={`${variables.namespace}-menu`} // 设置组件的唯一 ID
        v-click-outside={clickOut} // 绑定点击外部指令
        class={[
          prefixCls, // 添加样式前缀
          'relative bg-[var(--left-menu-bg-color)] top-1px layout-border__right', // 设置基本样式
          {
            'w-[var(--tab-menu-max-width)]': !unref(collapse), // 未折叠时的宽度样式
            'w-[var(--tab-menu-min-width)]': unref(collapse) // 折叠时的宽度样式
          }
        ]}
      >
        <ElScrollbar class="!h-[calc(100%-var(--tab-menu-collapse-height)-1px)]">
          {/* 渲染 Tab 菜单项 */}
          <div>
            {() => {
              return unref(tabRouters).map((v) => {
                const item = (
                  v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1)
                    ? v // 如果需要始终显示或有子路由，则直接使用当前项
                    : {
                        ...(v?.children && v?.children[0]), // 否则使用第一个子路由
                        path: pathResolve(v.path, (v?.children && v?.children[0])?.path as string) // 解析完整路径
                      }
                ) as AppRouteRecordRaw
                return (
                  <div
                    class={[
                      `${prefixCls}__item`, // 样式前缀
                      'text-center text-12px relative py-12px cursor-pointer', // 基本样式
                      {
                        'is-active': isActive(v.path) // 高亮状态
                      }
                    ]}
                    onClick={() => {
                      tabClick(item) // 绑定点击事件
                    }}
                  >
                    <div>
                      <Icon icon={item?.meta?.icon}></Icon> {/* 渲染图标 */}
                    </div>
                    {!unref(showTitle) ? undefined : (
                      <p class="break-words mt-5px px-2px">
                        {t(item.meta?.title || '')} {/* 渲染标题 */}
                      </p>
                    )}
                  </div>
                )
              })
            }}
          </div>
        </ElScrollbar>
        {/* 渲染折叠按钮 */}
        <div
          class={[
            `${prefixCls}--collapse`, // 样式前缀
            'text-center h-[var(--tab-menu-collapse-height)] leading-[var(--tab-menu-collapse-height)] cursor-pointer' // 基本样式
          ]}
          onClick={setCollapse} // 绑定折叠点击事件
        >
          <Icon
            icon={unref(collapse) ? 'ep:d-arrow-right' : 'ep:d-arrow-left'} // 根据折叠状态切换图标
          ></Icon>
        </div>
        {/* 渲染子菜单 */}
        <Menu
          class={[
            '!absolute top-0 z-3000', // 设置子菜单的样式
            {
              '!left-[var(--tab-menu-min-width)]': unref(collapse), // 折叠时的位置
              '!left-[var(--tab-menu-max-width)]': !unref(collapse), // 未折叠时的位置
              '!w-[var(--left-menu-max-width)] border-r-1 border-r-solid border-[var(--el-border-color)]':
                unref(showMenu) || unref(fixedMenu), // 显示子菜单时的样式
              '!w-0': !unref(showMenu) && !unref(fixedMenu) // 隐藏子菜单时的样式
            }
          ]}
          style="transition: width var(--transition-time-02), left var(--transition-time-02);" // 设置动画样式
        ></Menu>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
// 定义样式前缀
@prefix-cls: ~'@{adminNamespace}-tab-menu';

// Tab 菜单的整体样式
.@{prefix-cls} {
  transition: all var(--transition-time-02); // 添加过渡效果

  // Tab 项的样式
  &__item {
    color: var(--left-menu-text-color); // 默认文本颜色
    transition: all var(--transition-time-02); // 添加过渡效果

    &:hover {
      color: var(--left-menu-text-active-color); // 悬停时的文本颜色
      // background-color: var(--left-menu-bg-active-color); // 悬停时的背景颜色（已注释）
    }
  }

  // 折叠按钮的样式
  &--collapse {
    color: var(--left-menu-text-color); // 默认文本颜色
    background-color: var(--left-menu-bg-light-color); // 默认背景颜色
  }

  // 高亮状态的样式
  .is-active {
    color: var(--left-menu-text-active-color); // 高亮时的文本颜色
    background-color: var(--left-menu-bg-active-color); // 高亮时的背景颜色
  }
}
</style>
