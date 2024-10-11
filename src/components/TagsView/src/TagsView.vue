<script setup lang="ts">
/**
 * @file TagsView.vue
 * @description 标签视图组件，负责管理和展示用户访问的路由标签，
 * 提供标签的添加、关闭、刷新等功能，并支持自定义滚动条。
 * @example <TagsView />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module TagsView
 */

// 导入 Vue 相关的生命周期钩子和反应式 API
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
// 导入路由相关的 hooks
import { useRouter } from 'vue-router'
// 导入路由类型
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
// 导入权限状态管理
import { usePermissionStore } from '@/store/modules/permission'
// 导入标签视图状态管理
import { useTagsViewStore } from '@/store/modules/tagsView'
// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'
// 导入国际化处理函数
import { useI18n } from '@/hooks/web/useI18n'
// 导入辅助函数，用于过滤固定标签
import { filterAffixTags } from './helper'
// 导入上下文菜单相关类型和组件
import type { ContextMenuExpose } from '@/components/ContextMenu'
import { ContextMenu } from '@/components/ContextMenu'
// 导入设计相关 hook
import { useDesign } from '@/hooks/web/useDesign'
// 导入模板引用列表
import { useTemplateRefsList } from '@vueuse/core'
// 导入滚动条组件
import { ElScrollbar } from 'element-plus'
// 导入自定义滚动到指定位置的 hook
import { useScrollTo } from '@/hooks/event/useScrollTo'
// 导入标签视图相关的 hook
import { useTagsView } from '@/hooks/web/useTagsView'
// 导入深拷贝函数
import { cloneDeep } from 'lodash-es'

// 获取设计前缀类名
const { getPrefixCls } = useDesign()

// 定义标签视图的前缀类名
const prefixCls = getPrefixCls('tags-view')

// 获取国际化翻译函数
const { t } = useI18n()

// 获取当前路由和路由推送方法
const { currentRoute, push } = useRouter()

// 获取关闭当前、关闭所有、关闭左侧、关闭右侧、关闭其他、刷新页面等函数
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()

// 使用权限状态管理
const permissionStore = usePermissionStore()

// 计算获取路由列表
const routers = computed(() => permissionStore.getRouters)

// 使用标签视图状态管理
const tagsViewStore = useTagsViewStore()

// 计算获取访问过的视图
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

// 定义固定标签数组
const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

// 计算获取选中的标签
const selectedTag = computed(() => tagsViewStore.getSelectedTag)

// 设置选中的标签
const setSelectTag = tagsViewStore.setSelectedTag

// 使用应用状态管理
const appStore = useAppStore()

// 计算获取标签视图图标
const tagsViewIcon = computed(() => appStore.getTagsViewIcon)

// 计算获取当前主题是否为暗色
const isDark = computed(() => appStore.getIsDark)

// 初始化标签函数
const initTags = () => {
	// 过滤固定标签并赋值给 affixTagArr
	affixTagArr.value = filterAffixTags(unref(routers))
	for (const tag of unref(affixTagArr)) {
		// 确保标签名存在
		if (tag.name) {
			// 深拷贝标签并添加到已访问视图中
			tagsViewStore.addVisitedView(cloneDeep(tag))
		}
	}
}

// 新增标签函数
const addTags = () => {
	const { name } = unref(currentRoute) // 获取当前路由的名称
	if (name) {
		setSelectTag(unref(currentRoute)) // 设置选中的标签
		tagsViewStore.addView(unref(currentRoute)) // 添加当前路由视图
	}
}

// 关闭选中的标签函数
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
	closeCurrent(view, () => {
		// 关闭当前标签
		if (isActive(view)) {
			// 检查是否是活动标签
			toLastView() // 如果是活动标签，返回到最后一个标签
		}
	})
}

// 去最后一个视图函数
const toLastView = () => {
	const visitedViews = tagsViewStore.getVisitedViews // 获取已访问的视图
	const latestView = visitedViews.slice(-1)[0] // 获取最后一个视图
	if (latestView) {
		push(latestView) // 跳转到最后一个视图
	} else {
		// 如果当前路由是添加路由的路径或重定向路径，新增标签
		if (
			unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
			unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
		) {
			addTags()
			return // 结束函数
		}
		// 跳转到另一条路由
		push(permissionStore.getAddRouters[0].path)
	}
}

// 关闭全部标签函数
const closeAllTags = () => {
	closeAll(() => {
		toLastView() // 关闭所有标签后跳转到最后一个标签
	})
}

// 关闭其他标签函数
const closeOthersTags = () => {
	closeOther() // 调用关闭其他标签函数
}

// 重新加载选中的标签函数
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
	refreshPage(view) // 刷新页面
}

// 关闭左侧标签函数
const closeLeftTags = () => {
	closeLeft() // 调用关闭左侧标签的函数
}

// 关闭右侧标签函数
const closeRightTags = () => {
	closeRight() // 调用关闭右侧标签的函数
}

// 滚动到当前标签函数
const moveToCurrentTag = async () => {
	await nextTick() // 等待下一次 DOM 更新循环
	for (const v of unref(visitedViews)) {
		if (v.fullPath === unref(currentRoute).path) {
			// 检查当前路由是否为活动视图
			moveToTarget(v) // 移动到目标标签
			if (v.fullPath !== unref(currentRoute).fullPath) {
				// 更新已访问视图
				tagsViewStore.updateVisitedView(unref(currentRoute))
			}

			break // 结束循环
		}
	}
}

// 使用模板引用列表获取路由链接引用
const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

// 移动到目标函数
const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
	const wrap$ = unref(scrollbarRef)?.wrapRef // 获取滚动条包裹元素的引用
	let firstTag: Nullable<RouterLinkProps> = null // 定义第一个标签
	let lastTag: Nullable<RouterLinkProps> = null // 定义最后一个标签

	const tagList = unref(tagLinksRefs) // 获取标签列表
	// 找到第一个标签和最后一个标签
	if (tagList.length > 0) {
		firstTag = tagList[0]
		lastTag = tagList[tagList.length - 1]
	}
	if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
		// 如果当前标签是第一个标签，直接滚动到 0 的位置
		const { start } = useScrollTo({
			el: wrap$!,
			position: 'scrollLeft',
			to: 0,
			duration: 500
		})
		start() // 开始滚动
	} else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
		// 如果当前标签是最后一个标签，滚动到最后的位置
		const { start } = useScrollTo({
			el: wrap$!,
			position: 'scrollLeft',
			to: wrap$!.scrollWidth - wrap$!.offsetWidth,
			duration: 500
		})
		start() // 开始滚动
	} else {
		// 找到前一个标签和下一个标签
		const currentIndex: number = tagList.findIndex(
			(item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
		)
		const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`) // 获取所有标签的 DOM 元素

		const prevTag = tgsRefs[currentIndex - 1] as HTMLElement // 获取前一个标签
		const nextTag = tgsRefs[currentIndex + 1] as HTMLElement // 获取下一个标签

		// 获取下一个标签的右边偏移量
		const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

		// 获取前一个标签的左边偏移量
		const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

		if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
			// 如果 下一个标签经过的位置超出可视区域，则滚动到下一个标签前
			const { start } = useScrollTo({
				el: wrap$!,
				position: 'scrollLeft',
				to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
				duration: 500
			})
			start() // 开始滚动
		} else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
			// 如果 前一个标签的经过位置小于当前滚动位置，则滚动到前一个标签后
			const { start } = useScrollTo({
				el: wrap$!,
				position: 'scrollLeft',
				to: beforePrevTagOffsetLeft,
				duration: 500
			})
			start() // 开始滚动
		}
	}
}

// 检查是否是当前标签函数
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
	return route.path === unref(currentRoute).path // 返回当前路由是否是活动路由
}

// 所有右键菜单组件的元素引用列表
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单状态改变时的处理函数
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
	if (visible) {
		for (const v of unref(itemRefs)) {
			const elDropdownMenuRef = v.elDropdownMenuRef // 获取下拉菜单引用
			if (tagItem.fullPath !== v.tagItem.fullPath) {
				elDropdownMenuRef?.handleClose() // 关闭其他下拉菜单
				setSelectTag(tagItem) // 设置选中的标签
			}
		}
	}
}

// elscroll 实例引用
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 保存滚动位置的引用
const scrollLeftNumber = ref(0)

// 滚动事件处理函数
const scroll = ({ scrollLeft }) => {
	scrollLeftNumber.value = scrollLeft as number // 更新滚动位置
}

// 移动到某个位置的函数
const move = (to: number) => {
	const wrap$ = unref(scrollbarRef)?.wrapRef // 获取滚动条的包裹元素引用
	const { start } = useScrollTo({
		el: wrap$!,
		position: 'scrollLeft',
		to: unref(scrollLeftNumber) + to, // 计算新的滚动位置
		duration: 500 // 设置滚动时长
	})
	start() // 开始滚动
}

// 检查是否可以显示图标的函数
const canShowIcon = (item: RouteLocationNormalizedLoaded) => {
	if (
		(item?.matched?.[1]?.meta?.icon && unref(tagsViewIcon)) || // 如果匹配的路由有图标
		(item?.meta?.affix && unref(tagsViewIcon) && item?.meta?.icon) // 或者是 affix 且有图标
	) {
		return true // 可以显示图标
	}
	return false // 不可以显示图标
}

// 组件挂载时的初始化处理
onMounted(() => {
	initTags() // 初始化标签
	addTags() // 新增标签
})

// 监听当前路由变化
watch(
	() => currentRoute.value, // 监听的值
	() => {
		addTags() // 路由变化时新增标签
		moveToCurrentTag() // 移动到当前标签
	}
)

/*
<template>
	<!-- 主容器，动态绑定前缀类名和样式 -->
	<div
		:id="prefixCls"
		:class="prefixCls"
		class="flex w-full relative bg-[#fff] dark:bg-[var(--el-bg-color)]"
	>
		<!-- 左箭头工具按钮 -->
		<span
			:class="`${prefixCls}__tool ${prefixCls}__tool--first`"  <!-- 绑定工具类 -->
			class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"  <!-- 设置样式 -->
			@click="move(-200)"  <!-- 点击事件，移动标签 -->
		>
			<!-- 左箭头图标 -->
			<Icon
				icon="vi-ep:d-arrow-left"  <!-- 图标类型 -->
				color="var(--el-text-color-placeholder)"  <!-- 图标颜色 -->
				:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"  <!-- 鼠标悬停颜色 -->
			/>
		</span>
		<!-- 滚动容器 -->
		<div class="overflow-hidden flex-1">
			<ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">  <!-- 自定义滚动条 -->
				<div class="flex h-full">
					<!-- 上下文菜单组件，动态生成 -->
					<ContextMenu
						:ref="itemRefs.set"  <!-- 设置引用 -->
						:schema="[...]">  <!-- 菜单项配置 -->
						<!-- 循环遍历访问过的视图 -->
						<v-for="item in visitedViews"  <!-- 遍历已经访问的视图 -->
						:key="item.fullPath"  <!-- 每个菜单项的唯一键 -->
						:tag-item="item"  <!-- 传入当前标签项 -->
						:class="[  <!-- 设置动态类 -->
							`${prefixCls}__item`,  <!-- 基础类 -->
							item?.meta?.affix ? `${prefixCls}__item--affix` : '',  <!-- 处理固定标签 -->
							{
								'is-active': isActive(item)  <!-- 判断是否激活 -->
							}
						]"
						@visible-change="visibleChange"  <!-- 菜单可见性变化事件 -->
					>
						<!-- 标签内容 -->
						<div>
							<router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">  <!-- 路由链接 -->
								<div
									@click="navigate"  <!-- 点击导航 -->
									class="h-full flex justify-center items-center whitespace-nowrap pl-15px"  <!-- 设置样式 -->
								>
									<!-- 条件渲染图标 -->
									<Icon
										v-if="canShowIcon(item)"  <!-- 如果能显示图标 -->
										:icon="item?.matched?.[1]?.meta?.icon || item?.meta?.icon"  <!-- 使用匹配的图标 -->
										:size="12"  <!-- 图标大小 -->
										class="mr-5px"  <!-- 设置右边距 -->
									/>
									{{ t(item?.meta?.title as string) }}  <!-- 显示标题 -->
									<!-- 关闭图标 -->
									<Icon
										:class="`${prefixCls}__item--close`"  <!-- 设置关闭图标类 -->
										color="#333"  <!-- 设置颜色 -->
										icon="vi-ant-design:close-outlined"  <!-- 关闭图标类型 -->
										:size="12"  <!-- 图标大小 -->
										@click.prevent.stop="closeSelectedTag(item)"  <!-- 阻止默认事件并关闭标签 -->
									/>
								</div>
							</router-link>
						</div>
					</ContextMenu>
				</div>
			</ElScrollbar>
		</div>
		<!-- 右箭头工具按钮 -->
		<span
			:class="`${prefixCls}__tool`"  <!-- 绑定工具类 -->
			class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"  <!-- 设置样式 -->
			@click="move(200)"  <!-- 点击事件，移动标签 -->
		>
			<!-- 右箭头图标 -->
			<Icon
				icon="vi-ep:d-arrow-right"  <!-- 图标类型 -->
				color="var(--el-text-color-placeholder)"  <!-- 图标颜色 -->
				:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"  <!-- 鼠标悬停颜色 -->
			/>
		</span>
		<!-- 刷新工具按钮 -->
		<span
			:class="`${prefixCls}__tool`"  <!-- 绑定工具类 -->
			class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"  <!-- 设置样式 -->
			@click="refreshSelectedTag(selectedTag)"  <!-- 点击事件，刷新选中的标签 -->
		>
			<!-- 刷新图标 -->
			<Icon
				icon="vi-ant-design:reload-outlined"  <!-- 图标类型 -->
				color="var(--el-text-color-placeholder)"  <!-- 图标颜色 -->
				:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"  <!-- 鼠标悬停颜色 -->
			/>
		</span>
		<!-- 右键上下文菜单 -->
		<ContextMenu
			trigger="click"  <!-- 触发方式为点击 -->
			:schema="[...]">  <!-- 菜单项配置 -->
			<!-- 设置工具按钮 -->
			<span
				:class="`${prefixCls}__tool`"  <!-- 绑定工具类 -->
				class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer block"  <!-- 设置样式 -->
			>
				<!-- 设置图标 -->
				<Icon
					icon="vi-ant-design:setting-outlined"  <!-- 图标类型 -->
					color="var(--el-text-color-placeholder)"  <!-- 图标颜色 -->
					:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"  <!-- 鼠标悬停颜色 -->
				/>
			</span>
		</ContextMenu>
	</div>
</template>
*/
</script>

<template>
	<div
		:id="prefixCls"
		:class="prefixCls"
		class="flex w-full relative bg-[#fff] dark:bg-[var(--el-bg-color)]"
	>
		<span
			:class="`${prefixCls}__tool ${prefixCls}__tool--first`"
			class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
			@click="move(-200)"
		>
			<Icon
				icon="vi-ep:d-arrow-left"
				color="var(--el-text-color-placeholder)"
				:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
			/>
		</span>
		<div class="overflow-hidden flex-1">
			<ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
				<div class="flex h-full">
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
						<div>
							<router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
								<div
									@click="navigate"
									class="h-full flex justify-center items-center whitespace-nowrap pl-15px"
								>
									<Icon
										v-if="canShowIcon(item)"
										:icon="item?.matched?.[1]?.meta?.icon || item?.meta?.icon"
										:size="12"
										class="mr-5px"
									/>
									{{ t(item?.meta?.title as string) }}
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
		<span
			:class="`${prefixCls}__tool`"
			class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
			@click="move(200)"
		>
			<Icon
				icon="vi-ep:d-arrow-right"
				color="var(--el-text-color-placeholder)"
				:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
			/>
		</span>
		<span
			:class="`${prefixCls}__tool`"
			class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
			@click="refreshSelectedTag(selectedTag)"
		>
			<Icon
				icon="vi-ant-design:reload-outlined"
				color="var(--el-text-color-placeholder)"
				:hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
			/>
		</span>
		<ContextMenu
			trigger="click"
			:schema="[
				{
					icon: 'vi-ant-design:sync-outlined',
					label: t('common.reload'),
					command: () => {
						refreshSelectedTag(selectedTag)
					}
				},
				{
					icon: 'vi-ant-design:close-outlined',
					label: t('common.closeTab'),
					disabled: !!visitedViews?.length && selectedTag?.meta.affix,
					command: () => {
						closeSelectedTag(selectedTag!)
					}
				},
				{
					divided: true,
					icon: 'vi-ant-design:vertical-right-outlined',
					label: t('common.closeTheLeftTab'),
					disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
					command: () => {
						closeLeftTags()
					}
				},
				{
					icon: 'vi-ant-design:vertical-left-outlined',
					label: t('common.closeTheRightTab'),
					disabled:
						!!visitedViews?.length &&
						selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
					command: () => {
						closeRightTags()
					}
				},
				{
					divided: true,
					icon: 'vi-ant-design:tag-outlined',
					label: t('common.closeOther'),
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
		>
			<span
				:class="`${prefixCls}__tool`"
				class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer block"
			>
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
@prefix-cls: ~'@{adminNamespace}-tags-view'; // 定义前缀类名

.@{prefix-cls} {
	// 选择带有前缀的类
	:deep(.@{elNamespace}-scrollbar__view) {
		// 深度选择滚动条视图类
		height: 100%; // 设置高度为100%
	}

	&__tool {
		// 工具类
		position: relative; // 设置定位为相对定位

		&::before {
			// 在前面伪元素
			position: absolute; // 设置定位为绝对定位
			top: 1px; // 从顶部1像素开始
			left: 0; // 从左侧0开始
			width: 100%; // 宽度为100%
			height: calc(~'100% - 1px'); // 高度为100%减去1像素
			border-left: 1px solid var(--el-border-color); // 左边框为1像素实线，颜色为变量
			content: ''; // 内容为空
		}

		&--first {
			// 第一个工具类
			&::before {
				// 前面伪元素
				position: absolute; // 设置定位为绝对定位
				top: 1px; // 从顶部1像素开始
				left: 0; // 从左侧0开始
				width: 100%; // 宽度为100%
				height: calc(~'100% - 1px'); // 高度为100%减去1像素
				border-right: 1px solid var(--el-border-color); // 右边框为1像素实线，颜色为变量
				border-left: none; // 无左边框
				content: ''; // 内容为空
			}
		}
	}

	&__item {
		// 项目类
		position: relative; // 设置定位为相对定位
		top: 3px; // 从顶部3像素开始
		height: calc(~'100% - 6px'); // 高度为100%减去6像素
		padding-right: 25px; // 右侧内边距为25像素
		margin-left: 4px; // 左侧外边距为4像素
		font-size: 12px; // 字体大小为12像素
		cursor: pointer; // 鼠标悬浮时显示为手型
		border: 1px solid #d9d9d9; // 边框为1像素实线，颜色为灰色
		border-radius: 2px; // 边框圆角为2像素

		&--close {
			// 项目类的关闭按钮
			position: absolute; // 设置定位为绝对定位
			top: 50%; // 从顶部50%开始
			right: 5px; // 从右侧5像素开始
			display: none; // 默认不显示
			transform: translate(0, -50%); // 垂直居中
		}
		&:not(.@{prefix-cls}__item--affix):hover {
			// 非固定项的悬停效果
			.@{prefix-cls}__item--close {
				// 关闭按钮
				display: block; // 悬停时显示关闭按钮
			}
		}
	}

	&__item:not(.is-active) {
		// 非激活状态的项目
		&:hover {
			// 悬停效果
			color: var(--el-color-primary); // 字体颜色为主色
		}
	}

	&__item.is-active {
		// 激活状态的项目
		color: var(--el-color-white); // 字体颜色为白色
		background-color: var(--el-color-primary); // 背景颜色为主色
		border: 1px solid var(--el-color-primary); // 边框为主色
		.@{prefix-cls}__item--close {
			// 关闭按钮
			:deep(svg) {
				// 深度选择SVG元素
				color: var(--el-color-white) !important; // 设置颜色为白色并加上重要性
			}
		}
	}
}

.dark {
	// 深色主题
	.@{prefix-cls} {
		// 选择前缀类
		&__tool {
			// 工具类
			&--first {
				// 第一个工具类
				&::after {
					// 在后面伪元素
					display: none; // 不显示
				}
			}
		}

		&__item {
			// 项目类
			border: 1px solid var(--el-border-color); // 边框为变量的颜色
		}

		&__item:not(.is-active) {
			// 非激活状态的项目
			&:hover {
				// 悬停效果
				color: var(--el-color-primary); // 字体颜色为主色
			}
		}

		&__item.is-active {
			// 激活状态的项目
			color: var(--el-color-white); // 字体颜色为白色
			background-color: var(--el-color-primary); // 背景颜色为主色
			border: 1px solid var(--el-color-primary); // 边框为主色
			.@{prefix-cls}__item--close {
				// 关闭按钮
				:deep(svg) {
					// 深度选择SVG元素
					color: var(--el-color-white) !important; // 设置颜色为白色并加上重要性
				}
			}
		}
	}
}
</style>
