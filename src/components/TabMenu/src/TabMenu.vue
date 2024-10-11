<script lang="tsx">
/**
 * @file TabMenu.vue
 * @description TabMenu 组件，提供标签栏菜单的功能实现
 * @example <TabMenu />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module components/TabMenu
 */

// 导入所需的模块和库
import { usePermissionStore } from '@/store/modules/permission' // 权限状态管理
import { useAppStore } from '@/store/modules/app' // 应用状态管理
import { computed, unref, defineComponent, watch, ref, onMounted } from 'vue' // Vue 相关函数
import { useI18n } from '@/hooks/web/useI18n' // 国际化hooks
import { ElScrollbar, ClickOutside } from 'element-plus' // Element Plus 组件
import { Icon } from '@/components/Icon' // 自定义图标组件
import { Menu } from '@/components/Menu' // 自定义菜单组件
import { useRouter } from 'vue-router' // 路由管理
import { pathResolve } from '@/utils/routerHelper' // 路径解析工具
import { cloneDeep } from 'lodash-es' // 深拷贝工具
import { filterMenusPath, initTabMap, tabPathMap } from './helper' // 菜单相关工具函数
import { useDesign } from '@/hooks/web/useDesign' // UI 设计相关hooks
import { isUrl } from '@/utils/is' // URL 检测工具

// 获取设计相关的前缀类名和变量
const { getPrefixCls, variables } = useDesign() // 获取设计前缀和变量

// 定义前缀类
const prefixCls = getPrefixCls('tab-menu') // 获取 tab-menu 的前缀类名

// 导出默认的组件
export default defineComponent({
	name: 'TabMenu', // 组件名称
	// 注册指令
	directives: {
		ClickOutside // 点击外部关闭菜单的指令
	},
	setup() {
		// 组件的 setup 函数
		const { push, currentRoute } = useRouter() // 获取路由推送和当前路由

		const { t } = useI18n() // 获取国际化函数

		const appStore = useAppStore() // 获取应用状态管理

		const collapse = computed(() => appStore.getCollapse) // 计算属性：折叠状态

		const fixedMenu = computed(() => appStore.getFixedMenu) // 计算属性：固定菜单状态

		const permissionStore = usePermissionStore() // 获取权限状态管理

		const routers = computed(() => permissionStore.getRouters) // 计算属性：路由列表

		const tabRouters = computed(() => unref(routers).filter((v) => !v?.meta?.hidden)) // 计算属性：过滤掉隐藏的路由，得到 tab 路由

		const setCollapse = () => {
			// 设置折叠状态
			appStore.setCollapse(!unref(collapse)) // 切换折叠状态
		}

		// 组件挂载时执行
		onMounted(() => {
			if (unref(fixedMenu)) {
				// 如果菜单是固定的
				const path = `/${unref(currentRoute).path.split('/')[1]}` // 获取当前路径的首个部分
				const children = unref(tabRouters).find(
					// 查找对应的子路由
					(v) =>
						(v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1)) &&
						v.path === path
				)?.children // 获取子路由

				tabActive.value = path // 设置活动标签的路径
				if (children) {
					// 如果有子路由
					permissionStore.setMenuTabRouters(
						// 设置菜单的 tab 路由
						cloneDeep(children).map((v) => {
							v.path = pathResolve(unref(tabActive), v.path) // 解析每个子路由的路径
							return v // 返回处理后的子路由
						})
					)
				}
			}
		})

		// 监视路由的变化
		watch(
			() => routers.value, // 监视 routers 的变化
			(routers: AppRouteRecordRaw[]) => {
				// 当 routers 变化时执行
				initTabMap(routers) // 初始化 tab 地图
				filterMenusPath(routers, routers) // 过滤菜单路径
			},
			{
				immediate: true, // 立即触发
				deep: true // 深度监视
			}
		)

		const showTitle = ref(true) // 控制标题显示的响应式状态

		// 监视折叠状态的变化
		watch(
			() => collapse.value, // 监视 collapse 的变化
			(collapse: boolean) => {
				// 当 collapse 变化时执行
				if (!collapse) {
					// 非折叠状态
					setTimeout(() => {
						showTitle.value = !collapse // 定时切换 showTitle 状态
					}, 200)
				} else {
					// 折叠状态
					showTitle.value = !collapse // 直接切换 showTitle 状态
				}
			},
			{
				immediate: true // 立即触发
			}
		)

		// 是否显示菜单
		const showMenu = ref(unref(fixedMenu) ? true : false) // 控制菜单显示的响应式状态

		// tab 选项卡激活状态
		const tabActive = ref('') // 存储当前激活的 tab

		/**
		 * tab 点击事件处理
		 * @param {AppRouteRecordRaw} item - 被点击的路由项
		 */
		const tabClick = (item: AppRouteRecordRaw) => {
			// 点击 tab 时处理
			if (isUrl(item.path)) {
				// 如果路径是 URL
				window.open(item.path) // 新开窗口打开该链接
				return // 结束函数
			}
			const newPath = item.children ? item.path : item.path.split('/')[0] // 新路径
			const oldPath = unref(tabActive) // 旧路径
			tabActive.value = item.children ? item.path : item.path.split('/')[0] // 设置当前激活的 tab
			if (item.children) {
				// 如果该项有子路由
				if (newPath === oldPath || !unref(showMenu)) {
					// 如果新旧路径相同或菜单未显示
					// showMenu.value = unref(fixedMenu) ? true : !unref(showMenu)
					showMenu.value = !unref(showMenu) // 切换 showMenu 状态
				}
				if (unref(showMenu)) {
					// 如果显示菜单
					permissionStore.setMenuTabRouters(
						// 设置菜单 tab 路由
						cloneDeep(item.children).map((v) => {
							v.path = pathResolve(unref(tabActive), v.path) // 解析每个子路由的路径
							return v // 返回处理后的子路由
						})
					)
				}
			} else {
				// 如果该项没有子路由
				push(item.path) // 路由跳转到该项
				permissionStore.setMenuTabRouters([]) // 清空菜单 tab 路由
				showMenu.value = false // 隐藏菜单
			}
		}

		/**
		 * 检查当前 tab 是否激活
		 * @param {string} currentPath - 当前路径
		 * @returns {boolean} - 是否激活
		 */
		const isActive = (currentPath: string) => {
			// 判断当前路径是否激活
			const { path } = unref(currentRoute) // 获取当前路由的路径
			if (tabPathMap[currentPath].includes(path)) {
				// 检查 tab 路径
				return true // 如果激活返回 true
			}
			return false // 否则返回 false
		}

		// 点击外部区域时关闭菜单
		const clickOut = () => {
			if (!unref(fixedMenu)) {
				// 如果菜单不是固定的
				showMenu.value = false // 隐藏菜单
			}
		}

		// 渲染组件
		return () => (
			<div
				id={`${variables.namespace}-menu`} // 设置菜单的 ID
				v-click-outside={clickOut} // 注册点击外部区域的指令
				class={[
					prefixCls, // 添加前缀类名
					'relative bg-[var(--left-menu-bg-color)] top-1px layout-border__right', // 菜单的其他类名
					{
						'w-[var(--tab-menu-max-width)]': !unref(collapse), // 当未折叠时的宽度
						'w-[var(--tab-menu-min-width)]': unref(collapse) // 当折叠时的宽度
					}
				]}
			>
				<ElScrollbar class="!h-[calc(100%-var(--tab-menu-collapse-height)-1px)]">
					{' '}
					// 自定义滚动条
					<div>
						{() => {
							return unref(tabRouters).map((v) => {
								// 遍历每个 tab 路由
								const item = (
									v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1) // 判断是否始终显示
										? v // 如果满足条件则直接返回项
										: {
												...(v?.children && v?.children[0]), // 如果存在子路由则解构第一个子路由
												path: pathResolve(v.path, (v?.children && v?.children[0])?.path as string) // 路径解析
											}
								) as AppRouteRecordRaw // 转换为 AppRouteRecordRaw 类型
								return (
									// 渲染每个 tab
									<div
										class={[
											`${prefixCls}__item`, // 添加前缀类名
											'text-center text-12px relative py-12px cursor-pointer', // 添加其他类名
											{
												'is-active': isActive(v.path) // 如果激活则添加类名
											}
										]}
										onClick={() => {
											// 点击事件
											tabClick(item) // 调用 tabClick 处理函数
										}}
									>
										<div>
											<Icon icon={item?.meta?.icon}></Icon> // 渲染图标
										</div>
										{!unref(showTitle) ? undefined : ( // 如果显示标题则渲染
											<p class="break-words mt-5px px-2px">{t(item.meta?.title || '')}</p> // 渲染标题
										)}
									</div>
								)
							})
						}}
					</div>
				</ElScrollbar>
				<div
					class={[
						`${prefixCls}--collapse`, // 添加折叠按钮的前缀类名
						'text-center h-[var(--tab-menu-collapse-height)] leading-[var(--tab-menu-collapse-height)] cursor-pointer' // 添加其他样式
					]}
					onClick={setCollapse} // 点击事件触发折叠状态切换
				>
					<Icon icon={unref(collapse) ? 'ep:d-arrow-right' : 'ep:d-arrow-left'}></Icon> //
					根据状态渲染图标
				</div>
				<Menu
					class={[
						'!absolute top-0 z-3000', // 设置菜单的绝对定位和层级
						{
							'!left-[var(--tab-menu-min-width)]': unref(collapse), // 折叠状态下的位置
							'!left-[var(--tab-menu-max-width)]': !unref(collapse), // 展开状态下的位置
							'!w-[var(--left-menu-max-width)] border-r-1 border-r-solid border-[var(--el-border-color)]':
								unref(showMenu) || unref(fixedMenu), // 根据 showMenu 或 fixedMenu 设置宽度和边框
							'!w-0': !unref(showMenu) && !unref(fixedMenu) // 隐藏状态的处理
						}
					]}
					style="transition: width var(--transition-time-02), left var(--transition-time-02);" // 设置过渡动画
				></Menu>
			</div>
		)
	}
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-tab-menu'; // 定义前缀类

.@{prefix-cls} {
	transition: all var(--transition-time-02); // 定义过渡效果

	&__item {
		color: var(--left-menu-text-color); // 定义 tab 项的文本颜色
		transition: all var(--transition-time-02); // 定义 tab 项的过渡效果

		&:hover {
			color: var(--left-menu-text-active-color); // 鼠标悬停时文本颜色
			// background-color: var(--left-menu-bg-active-color); // 鼠标悬停时背景颜色（注释掉）
		}
	}

	&--collapse {
		color: var(--left-menu-text-color); // 折叠按钮的文本颜色
		background-color: var(--left-menu-bg-light-color); // 折叠按钮的背景颜色
	}

	.is-active {
		color: var(--left-menu-text-active-color); // 激活状态的文本颜色
		background-color: var(--left-menu-bg-active-color); // 激活状态的背景颜色
	}
}
</style>
