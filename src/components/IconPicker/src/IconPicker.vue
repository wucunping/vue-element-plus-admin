<script setup lang="ts">
/** 导入自定义图标 */
import epIcons from './data/icons.ep' // 引入 EP 图标数据
import antIcons from './data/icons.ant-design' // 引入 Ant Design 图标数据
import tIcons from './data/icons.tdesign' // 引入 TDesign 图标数据
import { useDesign } from '@/hooks/web/useDesign' // 引入自定义设计风格的 hook
import { ElInput, ElPopover, ElScrollbar, ElTabs, ElTabPane, ElPagination } from 'element-plus' // 引入 Element Plus 组件
import { useAppStore } from '@/store/modules/app' // 引入应用状态管理
import type { CSSProperties } from 'vue' // 引入 Vue 类型
import { computed, ref, unref, watch } from 'vue' // 引入 Vue 响应式 API
import { nextTick } from 'vue' // 引入 Vue 的 nextTick 方法

/** 初始化图标信息的函数 */
const init = async (icon?: string) => {
	if (!icon) return // 如果未传入图标，则返回
	const iconInfo = icon.split(':') // 通过 ':' 分割图标信息
	iconName.value = iconInfo[0] // 设置当前图标名称
	const wrapIndex = icons.findIndex((item) => item.prefix === iconInfo[0]) // 查找当前图标的前缀索引
	// 查询当前icon的索引
	const index = filterItemIcons(icons[wrapIndex].icons).findIndex((item) => item === icon) // 查找图标索引
	// 计算当前icon的页码
	await nextTick() // 等待下一个 DOM 更新周期
	currentPage.value = Math.ceil((index + 1) / unref(pageSize)) // 计算当前页
}

/** 定义模型值，类型为字符串 */
const modelValue = defineModel<string>() // 定义响应式模型值

const appStore = useAppStore() // 获取应用状态管理实例

/** 计算当前的组件大小 */
const size = computed(() => appStore.getCurrentSize) // 计算当前组件大小

/** 计算图标大小 */
const iconSize = computed(() => {
	return unref(size) === 'small'
		? 'var(--el-component-size-small)' // 如果为小号则返回小号样式
		: unref(size) === 'large'
			? 'var(--el-component-size-large)' // 如果为大号则返回大号样式
			: 'var(--el-component-size)' // 否则返回默认样式
})

/** 计算图标包装样式 */
const iconWrapStyle = computed((): CSSProperties => {
	return {
		width: unref(iconSize), // 设置宽度
		height: unref(iconSize), // 设置高度
		display: 'flex', // 设置为 flex 布局
		alignItems: 'center', // 垂直居中
		justifyContent: 'center', // 水平居中
		boxShadow: '0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset', // 内阴影样式
		position: 'relative', // 相对定位
		left: '-1px', // 向左偏移
		cursor: 'pointer' // 设置为手型光标
	}
})

const { getPrefixCls } = useDesign() // 获取前缀类名

/** 定义图标选择器的前缀类名 */
const prefixCls = getPrefixCls('icon-picker') // 获取图标选择器的前缀类名

/** 定义图标数据，包括三种图标 */
const icons = [epIcons, antIcons, tIcons] // 存储可选图标数据

/** 定义当前图标名称 */
const iconName = ref(icons[0].prefix) // 设置初始图标名称为第一个图标的前缀

/** 计算当前图标名称索引 */
const currentIconNameIndex = computed(() => {
	return icons.findIndex((item) => item.prefix === unref(iconName)) // 查找当前图标名称的索引
})

/** 切换标签时的处理 */
const tabChange = () => {
	currentPage.value = 1 // 切换标签时重置当前页为 1
}

/** 定义每页显示图标数量 */
const pageSize = ref(49) // 设置每页显示 49 个图标

/** 定义当前页数 */
const currentPage = ref(1) // 当前页 默认为 1

/** 过滤图标集合 */
const filterIcons = (icons: string[]) => {
	const start = (unref(currentPage) - 1) * unref(pageSize) // 计算开始索引
	const end = unref(currentPage) * unref(pageSize) // 计算结束索引
	return icons.slice(start, end) // 返回当前页的图标
}

/** 观察 modelValue 的变化 */
watch(
	() => modelValue.value, // 监听 modelValue 的变化
	async (val) => {
		await nextTick() // 等待下一个 DOM 更新周期
		// val && init(val) // 如果值存在，则初始化图标
		if (val) init(val) // 如果值存在，则初始化图标
	},
	{
		immediate: true // 立即执行
	}
)

/** 展示弹出框时的处理 */
const popoverShow = () => {
	init(unref(modelValue)) // 初始化弹出框时图标
}

/** 选择图标的处理 */
const iconSelect = (icon: string) => {
	// 如果是同一个icon则不做处理，则相当于点击了清空按钮
	if (icon === unref(modelValue)) {
		modelValue.value = '' // 清空选中的图标
		return // 结束函数
	}
	modelValue.value = icon // 设置当前选中的图标
}

/** 定义搜索关键词 */
const search = ref('') // 响应式搜索关键词

/** 过滤图标项 */
const filterItemIcons = (icons: string[]) => {
	return icons.filter((item) => item.includes(unref(search))) // 根据搜索关键词过滤图标
}

/** 清空输入框的处理 */
const inputClear = () => {
	init(unref(modelValue)) // 清空输入框后初始化图标
}

/*
<template>
	<div :class="prefixCls" class="flex justify-center items-center box">
		<ElInput disabled v-model="modelValue" clearable /> <!-- 禁用的输入框，绑定模型值 -->
		<ElPopover
			placement="bottom" <!-- 弹出框位置 -->
			trigger="click" <!-- 触发方式为点击 -->
			:width="450" <!-- 设置弹出框宽度 -->
			popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; height: 380px;" <!-- 设置弹出框样式 -->
			@show="popoverShow" <!-- 展示时的事件处理 -->
		>
			<template #reference>
				<div :style="iconWrapStyle"> <!-- 显示图标的包装 -->
					<Icon v-if="modelValue" :icon="modelValue" /> <!-- 绑定选中的图标 -->
				</div>
			</template>
			<ElScrollbar class="h-[calc(100%-50px)]!"> <!-- 滚动条组件 -->
				<ElInput
					v-model="search" <!-- 绑定搜索输入 -->
					class="mb-20px" <!-- 设置 margin -->
					clearable <!-- 清空按钮 -->
					placeholder="搜索图标" <!-- 输入框占位符 -->
					@clear="inputClear" <!-- 清空时的事件处理 -->
				/>
				<ElTabs tab-position="left" v-model="iconName" @tab-change="tabChange"> <!-- 标签组件 -->
					<ElTabPane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix"> <!-- 标签项 -->
						<div class="flex flex-wrap box-border"> <!-- 图标包装 -->
							<div
								v-for="icon in filterIcons(filterItemIcons(item.icons))" <!-- 根据过滤后图标列表生成图标 -->
								:key="icon" <!-- 每个图标唯一 key -->
								:style="{
									width: iconSize, // 图标宽度
									height: iconSize, // 图标高度
									display: 'flex', // 设置为 flex 布局
									alignItems: 'center', // 垂直居中
									justifyContent: 'center', // 水平居中
									cursor: 'pointer', // 设置为手型光标
									border: `1px solid ${
										icon === modelValue ? 'var(--el-color-primary)' : 'var(--el-border-color)'
									}`, // 根据选中状态设置边框颜色
									boxSizing: 'border-box', // 设置盒子模型
									margin: '2px', // 设置边距
									transition: 'all 0.3s' // 添加过渡效果
								}"
								class="hover:border-color-[var(--el-color-primary)]!" <!-- 鼠标悬停时变色 -->
								@click="iconSelect(icon)" <!-- 点击图标的事件处理 -->
							>
								<Icon
									:icon="icon" <!-- 绑定图标 -->
									:color="icon === modelValue ? 'var(--el-color-primary)' : 'inherit'" <!-- 根据选中状态设置图标颜色 -->
								/>
							</div>
						</div>
					</ElTabPane>
				</ElTabs>
			</ElScrollbar>
			<div
				class="h-50px absolute bottom-0 left-0 flex items-center pl-[var(--el-popover-padding)] pr-[var(--el-popover-padding)]" <!-- 分页控制区域 -->
			>
				<ElPagination
					v-model:current-page="currentPage" <!-- 绑定当前页 -->
					v-model:page-size="pageSize" <!-- 绑定每页显示数量 -->
					:pager-count="5" <!-- 设置分页按钮数量 -->
					small <!-- 小型分页 -->
					:page-sizes="[100, 200, 300, 400]" <!-- 每页可选数量 -->
					layout="total, prev, pager, next, jumper" <!-- 定义分页布局 -->
					:total="filterItemIcons(icons[currentIconNameIndex].icons).length" <!-- 计算总图标数量 -->
				/>
			</div>
		</ElPopover>
	</div>
</template>
*/
</script>

<template>
	<div :class="prefixCls" class="flex justify-center items-center box">
		<ElInput disabled v-model="modelValue" clearable />
		<ElPopover
			placement="bottom"
			trigger="click"
			:width="450"
			popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; height: 380px;"
			@show="popoverShow"
		>
			<template #reference>
				<div :style="iconWrapStyle">
					<Icon v-if="modelValue" :icon="modelValue" />
				</div>
			</template>
			<ElScrollbar class="h-[calc(100%-50px)]!">
				<ElInput
					v-model="search"
					class="mb-20px"
					clearable
					placeholder="搜索图标"
					@clear="inputClear"
				/>
				<ElTabs tab-position="left" v-model="iconName" @tab-change="tabChange">
					<ElTabPane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix">
						<div class="flex flex-wrap box-border">
							<div
								v-for="icon in filterIcons(filterItemIcons(item.icons))"
								:key="icon"
								:style="{
									width: iconSize,
									height: iconSize,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									border: `1px solid ${
										icon === modelValue ? 'var(--el-color-primary)' : 'var(--el-border-color)'
									}`,
									boxSizing: 'border-box',
									margin: '2px',
									transition: 'all 0.3s'
								}"
								class="hover:border-color-[var(--el-color-primary)]!"
								@click="iconSelect(icon)"
							>
								<Icon
									:icon="icon"
									:color="icon === modelValue ? 'var(--el-color-primary)' : 'inherit'"
								/>
							</div>
						</div>
					</ElTabPane>
				</ElTabs>
			</ElScrollbar>
			<div
				class="h-50px absolute bottom-0 left-0 flex items-center pl-[var(--el-popover-padding)] pr-[var(--el-popover-padding)]"
			>
				<ElPagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:pager-count="5"
					small
					:page-sizes="[100, 200, 300, 400]"
					layout="total, prev, pager, next, jumper"
					:total="filterItemIcons(icons[currentIconNameIndex].icons).length"
				/>
			</div>
		</ElPopover>
	</div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-icon-picker'; // 定义前缀类名

.@{prefix-cls} {
	:deep(.@{elNamespace}-input__wrapper) {
		// 深度选择器，样式覆盖
		border-top-right-radius: 0; // 取消右上角圆角
		border-bottom-right-radius: 0; // 取消右下角圆角
	}
}
</style>
