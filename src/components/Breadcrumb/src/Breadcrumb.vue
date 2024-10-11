<script lang="tsx">
/**
 * @file Breadcrumb.vue
 * @description 面包屑组件，提供导航上下文展示，方便用户了解当前页面位置并进行快速导航。
 * @example
 * <Breadcrumb />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Breadcrumb
 */

// 从 element-plus 库中导入 ElBreadcrumb 和 ElBreadcrumbItem 组件
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

// 从 vue 库中导入必要的功能
import { ref, watch, computed, unref, defineComponent, TransitionGroup } from 'vue'

// 导入 vue-router 的路由功能
import { useRouter } from 'vue-router'

// 导入权限管理的状态管理模块
import { usePermissionStore } from '@/store/modules/permission'

// 导入用于过滤面包屑的帮助函数
import { filterBreadcrumb } from './helper'

// 导入用于树形结构的函数
import { filter, treeToList } from '@/utils/tree'

// 导入 vue-router 中的路由类型
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// 导入国际化功能的 hook
import { useI18n } from '@/hooks/web/useI18n'

// 导入自定义图标组件
import { Icon } from '@/components/Icon'

// 导入应用状态管理的模块
import { useAppStore } from '@/store/modules/app'

// 导入设计相关的 hook
import { useDesign } from '@/hooks/web/useDesign'

// 调用 useDesign 以获取前缀类名的函数
const { getPrefixCls } = useDesign()

// 获取面包屑的前缀类名
const prefixCls = getPrefixCls('breadcrumb')

// 使用应用状态管理
const appStore = useAppStore()

// 定义计算属性以获取面包屑图标
const breadcrumbIcon = computed(() => appStore.getBreadcrumbIcon)

// 定义 Breadcrumb 组件
export default defineComponent({
	name: 'Breadcrumb',
	setup() {
		// 获取当前路由
		const { currentRoute } = useRouter()

		// 获取国际化函数
		const { t } = useI18n()

		// 定义一个响应式引用来存放路由级别列表
		const levelList = ref<AppRouteRecordRaw[]>([])

		// 使用权限状态管理
		const permissionStore = usePermissionStore()

		// 定义计算属性以获取菜单路由
		const menuRouters = computed(() => {
			// 获取权限状态中的路由
			const routers = permissionStore.getRouters
			// 过滤路由返回面包屑
			return filterBreadcrumb(routers)
		})

		/**
		 * 获取当前面包屑
		 * @function getBreadcrumb
		 */
		const getBreadcrumb = () => {
			// 获取当前路径
			const currentPath = currentRoute.value.matched.slice(-1)[0].path
			// 根据当前路径过滤路由并更新级别列表
			levelList.value = filter<AppRouteRecordRaw>(unref(menuRouters), (node: AppRouteRecordRaw) => {
				return node.path === currentPath
			})
		}

		/**
		 * 渲染面包屑
		 * @function renderBreadcrumb
		 * @returns {JSX.Element[]} 渲染的面包屑列表
		 */
		const renderBreadcrumb = () => {
			// 将级别列表转换为面包屑列表
			const breadcrumbList = treeToList<AppRouteRecordRaw[]>(unref(levelList))
			// 返回 JSX 元素的数组
			return breadcrumbList.map((v) => {
				const disabled = !v.redirect || v.redirect === 'noredirect' // 判断是否禁用
				const meta = v.meta // 获取路由元信息
				return (
					<ElBreadcrumbItem to={{ path: disabled ? '' : v.path }} key={v.name}>
						{meta?.icon && breadcrumbIcon.value ? ( // 判断是否存在图标并且图标启用
							<>
								<Icon icon={meta.icon} class="mr-[5px]"></Icon> {t(v?.meta?.title || '')} //
								渲染图标和标题
							</>
						) : (
							t(v?.meta?.title || '') // 只渲染标题
						)}
					</ElBreadcrumbItem>
				)
			})
		}

		// 观察当前路由的变化
		watch(
			() => currentRoute.value,
			(route: RouteLocationNormalizedLoaded) => {
				if (route.path.startsWith('/redirect/')) {
					// 如果路由是重定向路径则返回
					return
				}
				getBreadcrumb() // 获取面包屑
			},
			{
				immediate: true // 立即执行
			}
		)

		// 返回渲染的面包屑组件
		return () => (
			<ElBreadcrumb separator="/" class={`${prefixCls} flex items-center h-full ml-[10px]`}>
				<TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
					{renderBreadcrumb()} // 渲染面包屑
				</TransitionGroup>
			</ElBreadcrumb>
		)
	}
})
</script>

<style lang="less" scoped>
/* 定义 Less 样式 */
/* 定义面包屑组件的样式前缀 */
@prefix-cls: ~'@{elNamespace}-breadcrumb';

/* 面包屑的基本样式 */
.@{prefix-cls} {
	:deep(&__item) {
		display: flex; /* 使用弹性盒模型布局 */
		.@{prefix-cls}__inner {
			display: flex; /* 使用弹性盒模型布局 */
			align-items: center; /* 垂直居中对齐 */
			color: var(--top-header-text-color); /* 设置文本颜色 */

			&:hover {
				color: var(--el-color-primary); /* hover 时改变文本颜色 */
			}
		}
	}

	/* 面包屑的非最后一个项目样式 */
	:deep(&__item):not(:last-child) {
		.@{prefix-cls}__inner {
			color: var(--top-header-text-color); /* 设置文本颜色 */

			&:hover {
				color: var(--el-color-primary); /* hover 时改变文本颜色 */
			}
		}
	}

	/* 面包屑的最后一个项目样式 */
	:deep(&__item):last-child {
		.@{prefix-cls}__inner {
			color: var(--el-text-color-placeholder); /* 设置为占位符颜色 */

			&:hover {
				color: var(--el-text-color-placeholder); /* hover 时保持颜色不变 */
			}
		}
	}
}
</style>
