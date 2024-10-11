<script setup lang="ts">
/**
 * @file Logo.vue
 * @description Logo 组件，用于显示应用的 Logo 和标题。
 * @example <Logo />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Logo
 */

// 导入 Vue 的 ref, watch, computed, onMounted 和 unref 函数
import { ref, watch, computed, onMounted, unref } from 'vue'
// 导入应用状态管理的 appStore
import { useAppStore } from '@/store/modules/app'
// 导入设计相关的 hook
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计相关的前缀类名函数
const { getPrefixCls } = useDesign()

// 定义 Logo 的前缀类名
const prefixCls = getPrefixCls('logo')

// 使用应用状态管理
const appStore = useAppStore()

// 定义一个响应式变量，控制 Logo 的显示
const show = ref(true)

// 计算方法，用于获取应用标题
const title = computed(() => appStore.getTitle)

// 计算方法，用于获取布局类型
const layout = computed(() => appStore.getLayout)

// 计算方法，用于获取折叠状态
const collapse = computed(() => appStore.getCollapse)

// 组件挂载后执行的生命周期钩子
onMounted(() => {
	// 如果折叠状态为真，则隐藏 Logo
	if (unref(collapse)) show.value = false
})

// 监听折叠状态的变化
watch(
	() => collapse.value,
	(collapse: boolean) => {
		// 根据布局类型决定 Logo 的显示状态
		if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
			show.value = true
			return
		}
		show.value = !collapse
	}
)

// 监听布局类型的变化
watch(
	() => layout.value,
	(layout) => {
		// 根据布局类型决定 Logo 的显示状态
		if (layout === 'top' || layout === 'cutMenu') {
			show.value = true
		} else {
			if (unref(collapse)) {
				show.value = false
			} else {
				show.value = true
			}
		}
	}
)

/*
<template>
	<div>
		<router-link
			:class="[
				prefixCls, // Logo 的基本类名
				layout !== 'classic' ? `${prefixCls}__Top` : '', // 根据布局类型添加类名
				'flex !h-[var(--logo-height)] items-center cursor-pointer pl-8px relative decoration-none overflow-hidden' // 设置链接的样式
			]"
			to="/"
		>
			<img
				src="@/assets/imgs/logo.png" // Logo 图片路径
				class="w-[calc(var(--logo-height)-10px)] h-[calc(var(--logo-height)-10px)]" // 设置 Logo 图片的宽高
			/>
			<div
				v-if="show" // 当 show 为 true 时显示标题
				:class="[
					'ml-10px text-16px font-700', // 设置标题的样式
					{
						'text-[var(--logo-title-text-color)]': layout === 'classic', // 根据布局类型设置颜色
						'text-[var(--top-header-text-color)]':
							layout === 'topLeft' || layout === 'top' || layout === 'cutMenu' // 根据布局类型设置颜色
					}
				]"
			>
				{{ title }} // 显示应用标题
			</div>
		</router-link>
	</div>
</template>
*/
</script>

<template>
	<div>
		<router-link
			:class="[
				prefixCls,
				layout !== 'classic' ? `${prefixCls}__Top` : '',
				'flex !h-[var(--logo-height)] items-center cursor-pointer pl-8px relative decoration-none overflow-hidden'
			]"
			to="/"
		>
			<img
				src="@/assets/imgs/logo.png"
				class="w-[calc(var(--logo-height)-10px)] h-[calc(var(--logo-height)-10px)]"
			/>
			<div
				v-if="show"
				:class="[
					'ml-10px text-16px font-700',
					{
						'text-[var(--logo-title-text-color)]': layout === 'classic',
						'text-[var(--top-header-text-color)]':
							layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
					}
				]"
			>
				{{ title }}
			</div>
		</router-link>
	</div>
</template>
