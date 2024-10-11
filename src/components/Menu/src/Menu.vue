<script lang="tsx">
/**
 * @file Menu.vue
 * @description 菜单组件，负责渲染应用的导航菜单。
 * @example <Menu :menuSelect="handleMenuSelect" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Menu
 */

// 导入相关类型
import type { PropType } from 'vue'
// 导入 Vue 的计算属性、定义组件和解构引用
import { computed, defineComponent, unref } from 'vue'
// 导入 Element Plus 的菜单和滚动条组件
import { ElMenu, ElScrollbar } from 'element-plus'
// 导入应用状态管理和权限状态管理
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
// 导入自定义渲染菜单项的钩子
import { useRenderMenuItem } from './components/useRenderMenuItem'
// 导入 Vue Router
import { useRouter } from 'vue-router'
// 导入工具函数 isUrl
import { isUrl } from '@/utils/is'
// 导入设计 Hooks
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计前缀类名
const { getPrefixCls } = useDesign()

// 定义菜单组件的前缀类名
const prefixCls = getPrefixCls('menu')

// 定义并导出菜单组件
export default defineComponent({
	name: 'Menu', // 组件名称
	props: {
		// 菜单选择回调函数
		menuSelect: {
			type: Function as PropType<(index: string) => void>, // 指定类型为函数，接受一个字符串参数
			default: undefined // 默认值为undefined
		}
	},
	setup(props) {
		// 使用应用状态管理
		const appStore = useAppStore()

		// 计算布局属性
		const layout = computed(() => appStore.getLayout)

		// 使用 Vue Router 的 push 方法和当前路由
		const { push, currentRoute } = useRouter()

		// 使用权限状态管理
		const permissionStore = usePermissionStore()

		// 计算菜单模式，返回竖直或水平
		const menuMode = computed((): 'vertical' | 'horizontal' => {
			// 定义竖直布局类型
			const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

			// 判断当前布局是否为竖直布局
			if (vertical.includes(unref(layout))) {
				return 'vertical'
			} else {
				return 'horizontal'
			}
		})

		// 计算路由集合
		const routers = computed(() =>
			unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
		)

		// 计算菜单收起状态
		const collapse = computed(() => appStore.getCollapse)

		// 计算唯一打开菜单状态
		const uniqueOpened = computed(() => appStore.getUniqueOpened)

		// 计算当前活动菜单
		const activeMenu = computed(() => {
			const { meta, path } = unref(currentRoute)
			// 如果设置了路径，则高亮显示该路径
			if (meta.activeMenu) {
				return meta.activeMenu as string
			}
			return path
		})

		// 定义菜单选择回调函数
		const menuSelect = (index: string) => {
			if (props.menuSelect) {
				props.menuSelect(index) // 调用父组件传入的回调函数
			}
			// 自定义事件处理
			if (isUrl(index)) {
				window.open(index) // 如果是URL，则在新窗口打开
			} else {
				push(index) // 否则使用路由导航
			}
		}

		// 渲染菜单的包裹组件
		const renderMenuWrap = () => {
			if (unref(layout) === 'top') {
				return renderMenu() // 如果布局为顶部，直接渲染菜单
			} else {
				return <ElScrollbar>{renderMenu()}</ElScrollbar> // 否则使用滚动条包裹菜单
			}
		}

		// 渲染菜单
		const renderMenu = () => {
			return (
				<ElMenu
					defaultActive={unref(activeMenu)} // 设置默认激活项
					mode={unref(menuMode)} // 设置菜单模式
					collapse={
						unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse) // 判断折叠状态
					}
					uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)} // 判断唯一打开状态
					backgroundColor="var(--left-menu-bg-color)" // 设置背景颜色
					textColor="var(--left-menu-text-color)" // 设置文本颜色
					activeTextColor="var(--left-menu-text-active-color)" // 设置激活文本颜色
					popperClass={
						unref(menuMode) === 'vertical'
							? `${prefixCls}-popper--vertical`
							: `${prefixCls}-popper--horizontal` // 根据菜单模式设置类名
					}
					onSelect={menuSelect} // 选择时的回调函数
				>
					{{
						default: () => {
							const { renderMenuItem } = useRenderMenuItem(menuMode) // 获取渲染菜单项的函数
							return renderMenuItem(unref(routers)) // 渲染菜单项
						}
					}}
				</ElMenu>
			)
		}

		// 返回渲染函数
		return () => (
			<div
				id={prefixCls}
				class={[
					`${prefixCls} ${prefixCls}__${unref(menuMode)}`, // 设置类名
					'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]', // 设置样式
					{
						'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu', // 判断收起时最小宽度
						'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu' // 判断展开时最大宽度
					}
				]}
			>
				{renderMenuWrap()} // 渲染菜单的包裹组件
			</div>
		)
	}
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-menu'; // 定义前缀类名

.@{prefix-cls} {
	position: relative; // 设置相对定位
	transition: width var(--transition-time-02); // 设置宽度过渡时间

	:deep(.@{elNamespace}-menu) {
		width: 100% !important; // 设置菜单宽度为100%
		border-right: none; // 去除右边边框

		// 设置选中时子标题的颜色
		.is-active {
			& > .@{elNamespace}-sub-menu__title {
				color: var(--left-menu-text-active-color) !important; // 高亮颜色
			}
		}

		// 设置子菜单悬停的高亮和背景色
		.@{elNamespace}-sub-menu__title,
		.@{elNamespace}-menu-item {
			&:hover {
				color: var(--left-menu-text-active-color) !important; // 悬停文本颜色
				background-color: var(--left-menu-bg-color) !important; // 悬停背景颜色
			}
		}

		// 设置选中时的高亮背景和高亮颜色
		.@{elNamespace}-menu-item.is-active {
			color: var(--left-menu-text-active-color) !important; // 激活文本颜色
			background-color: var(--left-menu-bg-active-color) !important; // 激活背景颜色

			&:hover {
				background-color: var(--left-menu-bg-active-color) !important; // 悬停时背景色保持不变
			}
		}

		.@{elNamespace}-menu-item.is-active {
			position: relative; // 设置相对定位
		}

		// 设置子菜单的背景颜色
		.@{elNamespace}-menu {
			.@{elNamespace}-sub-menu__title,
			.@{elNamespace}-menu-item:not(.is-active) {
				background-color: var(--left-menu-bg-light-color) !important; // 子菜单默认背景色
			}
		}
	}

	// 折叠时的最小宽度
	:deep(.@{elNamespace}-menu--collapse) {
		width: var(--left-menu-min-width); // 设置最小宽度

		& > .is-active,
		& > .is-active > .@{elNamespace}-sub-menu__title {
			position: relative;
			background-color: var(--left-menu-collapse-bg-active-color) !important; // 折叠时激活项背景色
		}
	}

	// 折叠动画的时候，就需要把文字给隐藏掉
	:deep(.horizontal-collapse-transition) {
		.@{prefix-cls}__title {
			display: none; // 隐藏标题文本
		}
	}

	// 水平菜单
	&__horizontal {
		height: calc(~'var(--top-tool-height)') !important; // 设置高度

		:deep(.@{elNamespace}-menu--horizontal) {
			height: calc(~'var(--top-tool-height)'); // 设置菜单高度
			border-bottom: none; // 去除底部边框

			// 重新设置底部高亮颜色
			& > .@{elNamespace}-sub-menu.is-active {
				.@{elNamespace}-sub-menu__title {
					border-bottom-color: var(--el-color-primary) !important; // 设置底部高亮颜色
				}
			}

			.@{elNamespace}-menu-item.is-active {
				position: relative;

				&::after {
					display: none !important; // 隐藏激活项下的伪元素
				}
			}

			.@{prefix-cls}__title {
				/* stylelint-disable-next-line */
				max-height: calc(~'var(--top-tool-height) - 2px') !important; // 最大高度
				/* stylelint-disable-next-line */
				line-height: calc(~'var(--top-tool-height) - 2px'); // 行高设置
			}
		}
	}
}
</style>

<style lang="less">
@prefix-cls: ~'@{adminNamespace}-menu-popper'; // 定义菜单弹出层的前缀类名

.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {
	// 设置选中时子标题的颜色
	.is-active {
		& > .el-sub-menu__title {
			color: var(--left-menu-text-active-color) !important; // 激活颜色
		}
	}

	// 设置子菜单悬停的高亮和背景色
	.el-sub-menu__title,
	.el-menu-item {
		&:hover {
			color: var(--left-menu-text-active-color) !important; // 悬停文本颜色
			background-color: var(--left-menu-bg-color) !important; // 悬停背景颜色
		}
	}

	// 设置选中时的高亮背景
	.el-menu-item.is-active {
		position: relative;
		background-color: var(--left-menu-bg-active-color) !important; // 激活背景色

		&:hover {
			background-color: var(--left-menu-bg-active-color) !important; // 悬停时激活背景色
		}
	}
}

@submenu-prefix-cls: ~'@{adminNamespace}-submenu-popper'; // 定义子菜单的前缀类名

// 设置子菜单溢出时滚动样式
.@{submenu-prefix-cls}--vertical {
	max-height: 100%; // 设置最大高度
	overflow-y: auto; // 启用垂直滚动条

	&::-webkit-scrollbar {
		width: 6px; // 设置滚动条宽度
		background-color: transparent; // 设置背景色为透明
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgb(144 147 153 / 30%); // 设置滚动条颜色
		border-radius: 4px; // 设置圆角
	}
}
</style>
