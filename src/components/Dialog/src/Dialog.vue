<script setup lang="ts">
/**
 * @file Dialog.vue
 * @description 自定义对话框组件，支持全屏、大小调整等功能
 * @example
 * <Dialog :modelValue="showDialog" title="My Dialog" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Dialog
 */

import { ElDialog, ElScrollbar } from 'element-plus' // 从 Element Plus 导入 ElDialog 和 ElScrollbar 组件
import { propTypes } from '@/utils/propTypes' // 导入自定义的 propTypes 工具
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick } from 'vue' // 导入 Vue 的各种响应式和生命周期API
import { isNumber } from '@/utils/is' // 导入用于判断是否为数字的工具函数

/** 获取插槽信息 */
const slots = useSlots()

// 定义组件的props
const props = defineProps({
	/** 绑定的值，默认为 false */
	modelValue: propTypes.bool.def(false),
	/** 对话框标题，默认为 'Dialog' */
	title: propTypes.string.def('Dialog'),
	/** 是否全屏，默认为 true */
	fullscreen: propTypes.bool.def(true),
	/** 最大高度，可以是字符串或数字，默认为 '400px' */
	maxHeight: propTypes.oneOfType([String, Number]).def('400px')
})

/** 计算属性，返回不需要的属性，用于事件绑定 */
const getBindValue = computed(() => {
	/** 不需要绑定的属性数组 */
	const delArr: string[] = ['fullscreen', 'title', 'maxHeight']
	/** 获取当前组件的属性 */
	const attrs = useAttrs()
	/** 合并 attrs 和 props */
	const obj = { ...attrs, ...props }
	for (const key in obj) {
		if (delArr.indexOf(key) !== -1) {
			// 如果属性在不需要绑定的数组中
			delete obj[key] // 删除该属性
		}
	}
	return obj // 返回需要绑定的属性对象
})

/** 状态变量，标识是否全屏 */
const isFullscreen = ref(false)

/**
 * 切换全屏状态
 */
const toggleFull = () => {
	isFullscreen.value = !unref(isFullscreen) // 切换全屏状态
}

/**
 * 存储对话框高度的响应式引用
 * @type {ref<string>}
 */
const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight) // 初始化对话框高度

// 监听全屏状态的变化
watch(
	() => isFullscreen.value, // 监听 isFullscreen 的变化
	async (val: boolean) => {
		// 变化后的回调
		await nextTick() // 确保 DOM 更新完成
		if (val) {
			// 如果进入全屏
			const windowHeight = document.documentElement.offsetHeight // 获取窗口高度
			dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px` // 更新对话框高度
		} else {
			// 如果退出全屏
			dialogHeight.value = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight // 还原对话框高度
		}
	},
	{
		immediate: true // 立即触发监听器
	}
)

// 监听最大高度的变化
watch(
	() => props.maxHeight, // 监听 maxHeight 的变化
	(val) => {
		dialogHeight.value = isNumber(val) ? `${val}px` : val // 更新对话框高度
	}
)

// 计算对话框的样式
const dialogStyle = computed(() => {
	return {
		height: unref(dialogHeight) // 设置对话框的高度
	}
})

/*
<template>
	<ElDialog // 使用 Element Plus 的对话框组件
		v-bind="getBindValue" // 绑定的属性
		:fullscreen="isFullscreen" // 控制全屏属性
		destroy-on-close // 关闭时销毁对话框
		lock-scroll // 锁定背景滚动
		draggable // 可拖动
		top="0" // 顶部位置
		:close-on-click-modal="false" // 点击遮罩不关闭对话框
		:show-close="false" // 不显示关闭按钮
	>
		<template #header="{ close }"> <!-- 自定义头部插槽 -->
			<div class="flex justify-between items-center h-54px pl-15px pr-15px relative"> <!-- 控制头部样式 -->
				<slot name="title"> <!-- 使用插槽作为标题 -->
					{{ title }} <!-- 显示标题 -->
				</slot>
				<div
					class="h-54px flex justify-between items-center absolute top-[50%] right-15px translate-y-[-50%]" <!-- 控制右侧按钮样式 -->
				>
					<Icon
						v-if="fullscreen" // 如果是全屏
						class="cursor-pointer is-hover !h-54px mr-10px" 
						:icon="
							isFullscreen ? 'vi-radix-icons:exit-full-screen' : 'vi-radix-icons:enter-full-screen'
						" // 根据全屏状态显示不同图标
						color="var(--el-color-info)" // 图标颜色
						hover-color="var(--el-color-primary)" // 悬停颜色
						@click="toggleFull" // 点击切换全屏
					/>
					<Icon
						class="cursor-pointer is-hover !h-54px"
						icon="vi-ep:close" // 关闭按钮图标
						hover-color="var(--el-color-primary)" // 悬停颜色
						color="var(--el-color-info)" // 图标颜色
						@click="close" // 点击关闭对话框
					/>
				</div>
			</div>
		</template>

		<ElScrollbar :style="dialogStyle"> <!-- 添加滚动条 -->
			<slot></slot> <!-- 渲染默认插槽内容 -->
		</ElScrollbar>

		<template v-if="slots.footer" #footer> <!-- 判断是否有底部插槽 -->
			<slot name="footer"></slot> <!-- 渲染底部插槽 -->
		</template>
	</ElDialog>
</template>
*/
</script>

<template>
	<ElDialog
		v-bind="getBindValue"
		:fullscreen="isFullscreen"
		destroy-on-close
		lock-scroll
		draggable
		top="0"
		:close-on-click-modal="false"
		:show-close="false"
	>
		<template #header="{ close }">
			<div class="flex justify-between items-center h-54px pl-15px pr-15px relative">
				<slot name="title">
					{{ title }}
				</slot>
				<div
					class="h-54px flex justify-between items-center absolute top-[50%] right-15px translate-y-[-50%]"
				>
					<Icon
						v-if="fullscreen"
						class="cursor-pointer is-hover !h-54px mr-10px"
						:icon="
							isFullscreen ? 'vi-radix-icons:exit-full-screen' : 'vi-radix-icons:enter-full-screen'
						"
						color="var(--el-color-info)"
						hover-color="var(--el-color-primary)"
						@click="toggleFull"
					/>
					<Icon
						class="cursor-pointer is-hover !h-54px"
						icon="vi-ep:close"
						hover-color="var(--el-color-primary)"
						color="var(--el-color-info)"
						@click="close"
					/>
				</div>
			</div>
		</template>

		<ElScrollbar :style="dialogStyle">
			<slot></slot>
		</ElScrollbar>

		<template v-if="slots.footer" #footer>
			<slot name="footer"></slot>
		</template>
	</ElDialog>
</template>

<style lang="less">
.@{elNamespace}-overlay-dialog {
	display: flex; // 使用flex布局
	justify-content: center; // 居中对齐
	align-items: center; // 垂直居中对齐
}

.@{elNamespace}-dialog {
	margin: 0 !important; // 强制对话框无边距

	&__header {
		height: 54px; // 头部高度
		padding: 0; // 无内边距
		margin-right: 0 !important; // 强制右边距为0
		border-bottom: 1px solid var(--el-border-color); // 底部边框
	}

	&__body {
		padding: 15px !important; // 强制内边距
	}

	&__footer {
		border-top: 1px solid var(--el-border-color); // 顶部边框
	}

	&__headerbtn {
		top: 0; // 设置按钮的纵向位置
	}
}
</style>
