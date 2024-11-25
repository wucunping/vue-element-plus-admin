<script lang="tsx">
/**
 * @file Breadcrumb 组件
 * @description 提供基于 Vue 和 Element Plus 的动态面包屑导航组件
 * @example <Breadcrumb />
 * @version 1.0.0
 * @date 2024-11-21
 * @module BreadcrumbComponent
 * @requires vue-router
 * @requires element-plus
 * @requires vue
 * @requires @/store/modules/permission
 * @requires @/store/modules/app
 * @requires @/hooks/web/useDesign
 * @requires @/hooks/web/useI18n
 * @requires @/utils/tree
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Element Plus 的 Breadcrumb 组件和子组件
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

// 引入 Vue 的核心方法和 API
import { ref, watch, computed, unref, defineComponent, TransitionGroup } from 'vue'

// 引入 Vue Router，用于访问当前路由
import { useRouter } from 'vue-router'

// 引入权限存储模块
import { usePermissionStore } from '@/store/modules/permission'

// 引入辅助方法，过滤面包屑相关路由
import { filterBreadcrumb } from './helper'

// 引入工具方法，用于树形结构操作
import { filter, treeToList } from '@/utils/tree'

// 引入 Vue Router 类型定义
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// 引入国际化工具
import { useI18n } from '@/hooks/web/useI18n'

// 引入图标组件
import { Icon } from '@/components/Icon'

// 引入应用存储模块
import { useAppStore } from '@/store/modules/app'

// 引入设计系统的前缀工具
import { useDesign } from '@/hooks/web/useDesign'

/** 生成设计系统的 Breadcrumb 前缀 */
const { getPrefixCls } = useDesign()

/** Breadcrumb 前缀 */
const prefixCls = getPrefixCls('breadcrumb')

/** 应用存储模块实例 */
const appStore = useAppStore()

/** 是否显示面包屑图标 */
const breadcrumbIcon = computed(() => appStore.getBreadcrumbIcon)

export default defineComponent({
  name: 'Breadcrumb', // 组件名称
  setup() {
    /** 当前路由 */
    const { currentRoute } = useRouter()

    /** 国际化翻译函数 */
    const { t } = useI18n()

    /** 当前面包屑的层级列表 */
    const levelList = ref<AppRouteRecordRaw[]>([])

    /** 权限存储模块实例 */
    const permissionStore = usePermissionStore()

    /** 计算处理后的路由，用于生成面包屑 */
    const menuRouters = computed(() => {
      const routers = permissionStore.getRouters
      return filterBreadcrumb(routers)
    })

    /**
     * 获取当前路由对应的面包屑层级
     */
    const getBreadcrumb = () => {
      const currentPath = currentRoute.value.matched.slice(-1)[0].path
      levelList.value = filter<AppRouteRecordRaw>(unref(menuRouters), (node: AppRouteRecordRaw) => {
        return node.path === currentPath
      })
    }

    /**
     * 渲染面包屑列表
     * @returns 面包屑 JSX 元素数组
     */
    const renderBreadcrumb = () => {
      const breadcrumbList = treeToList<AppRouteRecordRaw[]>(unref(levelList))
      return breadcrumbList.map((v) => {
        const disabled = !v.redirect || v.redirect === 'noredirect' // 判断是否禁用跳转
        const meta = v.meta
        return (
          <ElBreadcrumbItem to={{ path: disabled ? '' : v.path }} key={v.name}>
            {meta?.icon && breadcrumbIcon.value ? (
              <>
                <Icon icon={meta.icon} class="mr-[5px]" /> {t(v?.meta?.title || '')}
              </>
            ) : (
              t(v?.meta?.title || '')
            )}
          </ElBreadcrumbItem>
        )
      })
    }

    // 监听路由变化，更新面包屑
    watch(
      () => currentRoute.value,
      (route: RouteLocationNormalizedLoaded) => {
        if (route.path.startsWith('/redirect/')) {
          return // 忽略重定向路由
        }
        getBreadcrumb()
      },
      {
        immediate: true // 初始化时立即执行
      }
    )

    // 返回组件的 JSX 渲染函数
    return () => (
      <ElBreadcrumb separator="/" class={`${prefixCls} flex items-center h-full ml-[10px]`}>
        <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
          {renderBreadcrumb()}
        </TransitionGroup>
      </ElBreadcrumb>
    )
  }
})
</script>

<style lang="less" scoped>
/* 定义 Breadcrumb 样式前缀 */
@prefix-cls: ~'@{elNamespace}-breadcrumb';

/* 组件的基础样式 */
.@{prefix-cls} {
  :deep(&__item) {
    display: flex;
    .@{prefix-cls}__inner {
      display: flex;
      align-items: center;
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary); /* 鼠标悬停时更改颜色 */
      }
    }
  }

  /* 非最后一个面包屑的样式 */
  :deep(&__item):not(:last-child) {
    .@{prefix-cls}__inner {
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  /* 最后一个面包屑的样式 */
  :deep(&__item):last-child {
    .@{prefix-cls}__inner {
      color: var(--el-text-color-placeholder);

      &:hover {
        color: var(--el-text-color-placeholder); /* 保持占位符颜色不变 */
      }
    }
  }
}
</style>
