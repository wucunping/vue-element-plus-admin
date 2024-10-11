<script setup lang="ts">
/**
 * @file LayoutRadioPicker.vue
 * @description 布局单选框组件，用于选择不同的布局样式
 * @example <LayoutRadioPicker />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module LayoutRadioPicker
 */

// 导入应用状态管理的store
import { useAppStore } from '@/store/modules/app'
// 导入计算属性的函数
import { computed } from 'vue'
// 导入设计相关的hook
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计的前缀类
const { getPrefixCls } = useDesign()

// 生成布局单选框的前缀类
const prefixCls = getPrefixCls('layout-radio-picker')

// 获取应用状态管理的store实例
const appStore = useAppStore()

// 计算当前布局的值
const layout = computed(() => appStore.getLayout)

/*
<template>
	<!-- 布局单选框的根元素 -->
	<div :class="prefixCls" class="flex flex-wrap space-x-14px">
		<!-- 经典布局选择项 -->
		<div
			:class="[
				`${prefixCls}__classic`, // 应用经典布局的前缀类
				'relative w-56px h-48px cursor-pointer bg-gray-300', // 样式设置
				{
					'is-acitve': layout === 'classic' // 判断当前布局是否为经典布局
				}
			]"
			@click="appStore.setLayout('classic')" // 点击事件设置当前布局为经典
		></div>
		<!-- 左上布局选择项 -->
		<div
			:class="[
				`${prefixCls}__top-left`, // 应用左上布局的前缀类
				'relative w-56px h-48px cursor-pointer bg-gray-300', // 样式设置
				{
					'is-acitve': layout === 'topLeft' // 判断当前布局是否为左上布局
				}
			]"
			@click="appStore.setLayout('topLeft')" // 点击事件设置当前布局为左上布局
		></div>
		<!-- 顶部布局选择项 -->
		<div
			:class="[
				`${prefixCls}__top`, // 应用顶部布局的前缀类
				'relative w-56px h-48px cursor-pointer bg-gray-300', // 样式设置
				{
					'is-acitve': layout === 'top' // 判断当前布局是否为顶部布局
				}
			]"
			@click="appStore.setLayout('top')" // 点击事件设置当前布局为顶部布局
		></div>
		<!-- 切割菜单布局选择项 -->
		<div
			:class="[
				`${prefixCls}__cut-menu`, // 应用切割菜单布局的前缀类
				'relative w-56px h-48px cursor-pointer bg-gray-300', // 样式设置
				{
					'is-acitve': layout === 'cutMenu' // 判断当前布局是否为切割菜单布局
				}
			]"
			@click="appStore.setLayout('cutMenu')" // 点击事件设置当前布局为切割菜单布局
		>
			<!-- 切割菜单的装饰元素 -->
			<div class="absolute h-full w-[33%] top-0 left-[10%] bg-gray-200"></div>
		</div>
	</div>
</template>
*/
</script>

<template>
	<div :class="prefixCls" class="flex flex-wrap space-x-14px">
		<div
			:class="[
				`${prefixCls}__classic`,
				'relative w-56px h-48px cursor-pointer bg-gray-300',
				{
					'is-acitve': layout === 'classic'
				}
			]"
			@click="appStore.setLayout('classic')"
		></div>
		<div
			:class="[
				`${prefixCls}__top-left`,
				'relative w-56px h-48px cursor-pointer bg-gray-300',
				{
					'is-acitve': layout === 'topLeft'
				}
			]"
			@click="appStore.setLayout('topLeft')"
		></div>
		<div
			:class="[
				`${prefixCls}__top`,
				'relative w-56px h-48px cursor-pointer bg-gray-300',
				{
					'is-acitve': layout === 'top'
				}
			]"
			@click="appStore.setLayout('top')"
		></div>
		<div
			:class="[
				`${prefixCls}__cut-menu`,
				'relative w-56px h-48px cursor-pointer bg-gray-300',
				{
					'is-acitve': layout === 'cutMenu'
				}
			]"
			@click="appStore.setLayout('cutMenu')"
		>
			<div class="absolute h-full w-[33%] top-0 left-[10%] bg-gray-200"></div>
		</div>
	</div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-layout-radio-picker'; // 定义前缀类，用于样式选择

.@{prefix-cls} {
	&__classic {
		border: 2px solid #e5e7eb; // 设置边框
		border-radius: 4px; // 设置圆角

		&::before {
			// 创建伪元素before，作为经典布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			z-index: 1; // 设置层级
			width: 33%; // 宽度设置
			height: 100%; // 高度设置
			background-color: #273352; // 背景色
			border-radius: 4px 0 0 4px; // 设置圆角
			content: ''; // 内容为空
		}

		&::after {
			// 创建伪元素after，作为经典布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			width: 100%; // 设置宽度
			height: 25%; // 设置高度
			background-color: #fff; // 背景色
			border-radius: 4px 4px 0; // 设置圆角
			content: ''; // 内容为空
		}
	}

	&__top-left {
		border: 2px solid #e5e7eb; // 设置边框
		border-radius: 4px; // 设置圆角

		&::before {
			// 创建伪元素before，作为左上布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			z-index: 1; // 设置层级
			width: 100%; // 设置宽度
			height: 33%; // 设置高度
			background-color: #273352; // 背景色
			border-radius: 4px 4px 0 0; // 设置圆角
			content: ''; // 内容为空
		}

		&::after {
			// 创建伪元素after，作为左上布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			width: 33%; // 设置宽度
			height: 100%; // 设置高度
			background-color: #fff; // 背景色
			border-radius: 4px 0 0 4px; // 设置圆角
			content: ''; // 内容为空
		}
	}

	&__top {
		border: 2px solid #e5e7eb; // 设置边框
		border-radius: 4px; // 设置圆角

		&::before {
			// 创建伪元素before，作为顶部布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			z-index: 1; // 设置层级
			width: 100%; // 设置宽度
			height: 33%; // 设置高度
			background-color: #273352; // 背景色
			border-radius: 4px 4px 0 0; // 设置圆角
			content: ''; // 内容为空
		}
	}

	&__cut-menu {
		border: 2px solid #e5e7eb; // 设置边框
		border-radius: 4px; // 设置圆角

		&::before {
			// 创建伪元素before，作为切割菜单布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			z-index: 1; // 设置层级
			width: 100%; // 设置宽度
			height: 33%; // 设置高度
			background-color: #273352; // 背景色
			border-radius: 4px 4px 0 0; // 设置圆角
			content: ''; // 内容为空
		}

		&::after {
			// 创建伪元素after，作为切割菜单布局的装饰
			position: absolute; // 绝对定位
			top: 0; // 顶部对齐
			left: 0; // 左侧对齐
			width: 10%; // 设置宽度
			height: 100%; // 设置高度
			background-color: #fff; // 背景色
			border-radius: 4px 0 0 4px; // 设置圆角
			content: ''; // 内容为空
		}
	}

	.is-acitve {
		// 选中状态的样式
		border-color: var(--el-color-primary); // 边框颜色为主色
	}
}
</style>
