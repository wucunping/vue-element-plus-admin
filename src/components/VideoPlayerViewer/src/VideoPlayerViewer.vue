<script setup lang="ts">
/**
 * @file VideoPlayerViewer.vue
 * @description 视频播放器组件的视图
 * @example <VideoPlayerViewer :url="videoUrl" :poster="videoPoster" :show="true" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module 视频播放器视图模块
 */

// 引入 VideoPlayer 组件
import { VideoPlayer } from '@/components/VideoPlayer'

// 引入 ElOverlay 组件
import { ElOverlay } from 'element-plus'

// 引入 vue 的 ref 和 nextTick
import { ref, nextTick } from 'vue'

// 引入 Icon 组件
import { Icon } from '@/components/Icon'

// 定义 props
const props = defineProps({
	show: {
		// 控制是否展示的属性
		type: Boolean, // 类型为布尔值
		default: false // 默认值为 false
	},
	url: {
		// 视频 URL 属性
		type: String, // 类型为字符串
		default: '', // 默认值为空字符串
		required: true // 该属性为必填项
	},
	poster: {
		// 视频海报属性
		type: String, // 类型为字符串
		default: '' // 默认值为空字符串
	},
	id: {
		// 组件 ID 属性
		type: String, // 类型为字符串
		default: '' // 默认值为空字符串
	}
})

// 创建响应式 visible 变量，根据 props.show 初始化
const visible = ref(props.show)

/**
 * 关闭视频播放器
 * @async
 * @function close
 * @returns {Promise<void>}
 */
const close = async () => {
	visible.value = false // 设置 visible 为 false
	await nextTick() // 等待下一个 DOM 更新周期
	const wrap = document.getElementById(props.id) // 根据 ID 获取包裹元素
	if (!wrap) return // 如果没有找到元素，则返回
	document.body.removeChild(wrap) // 从文档中移除包裹元素
}
</script>

<template>
	<!-- 当 visible 为 true 时显示 ElOverlay -->
	<ElOverlay v-show="visible" @click="close">
		<div class="w-full h-full flex justify-center items-center relative" @click="close">
			<!-- 关闭按钮 -->
			<div
				class="w-44px h-44px color-[#fff] bg-[var(--el-text-color-regular)] rounded-full border-[#fff] flex justify-center items-center cursor-pointer absolute top-40px right-40px"
				@click="close"
			>
				<Icon icon="vi-ep:close" :size="24" />
				<!-- 关闭图标 -->
			</div>
			<!-- 视频播放器组件 -->
			<VideoPlayer :url="url" :poster="poster" />
		</div>
	</ElOverlay>
</template>
