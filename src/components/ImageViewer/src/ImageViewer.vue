<script setup lang="ts">
/**
 * @file ImageViewer.vue
 * @description 这是一个图片查看器组件，基于 Element Plus 库实现，支持多种配置选项，如图片列表、z-index、初始索引等。
 * @example
 * <ImageViewer
 *   :urlList="['image1.jpg', 'image2.jpg']"
 *   :zIndex="300"
 *   :initialIndex="0"
 *   :infinite="true"
 *   :hideOnClickModal="false"
 *   :teleported="false"
 *   :show="isViewerVisible"
 * />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ImageViewer
 */

// 导入 Element Plus 的图片查看器组件
import { ElImageViewer } from 'element-plus'

// 导入 Vue 类型定义
import type { PropType } from 'vue'

// 从 Vue 中导入计算属性和响应式引用
import { computed, ref } from 'vue'

// 导入自定义的属性类型定义
import { propTypes } from '@/utils/propTypes'

/**
 * 定义组件的 props
 * @property {string[]} urlList - 图片列表，默认为空数组
 * @property {number} zIndex - 弹出层的 z-index，默认为 200
 * @property {number} initialIndex - 初始显示的图片索引，默认为 0
 * @property {boolean} infinite - 是否循环显示，默认为 true
 * @property {boolean} hideOnClickModal - 点击模态框是否隐藏查看器，默认为 false
 * @property {boolean} teleported - 是否使用传送模式，默认为 false
 * @property {boolean} show - 是否显示图片查看器，默认为 false
 */
const props = defineProps({
	/** 默认返回空数组 */
	urlList: {
		type: Array as PropType<string[]>,
		default: (): string[] => []
	},
	/** 设置 z-index 的默认值 */
	zIndex: propTypes.number.def(200),
	/** 设置初始索引的默认值 */
	initialIndex: propTypes.number.def(0),
	/** 设置循环显示的默认值 */
	infinite: propTypes.bool.def(true),
	/** 设置点击模态框时是否隐藏的默认值 */
	hideOnClickModal: propTypes.bool.def(false),
	/** 设置传送模式的默认值 */
	teleported: propTypes.bool.def(false),
	/** 设置显示状态的默认值 */
	show: propTypes.bool.def(false)
})

/**
 * 计算属性，用于得到绑定值
 * @returns {Recordable} 计算出的 props 除了 show 之外的属性
 */
const getBindValue = computed(() => {
	const propsData: Recordable = { ...props } // 复制 props
	delete propsData.show // 删除 show 属性
	return propsData
})

// 创建响应式引用，用于控制显示状态
const show = ref(props.show)

/**
 * 关闭图片查看器的函数
 */
const close = () => {
	show.value = false // 设置显示状态为 false
}
</script>

<template>
	<!-- 如果 show 为 true，则渲染图片查看器，并传递计算出的绑定值 -->
	<ElImageViewer v-if="show" v-bind="getBindValue" @close="close" />
</template>
