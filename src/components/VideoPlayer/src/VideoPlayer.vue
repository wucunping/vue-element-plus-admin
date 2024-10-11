<script setup lang="ts">
/**
 * @file VideoPlayer.vue
 * @description 视频播放器组件，使用 xgplayer 实现播放功能
 * @example <VideoPlayer url="视频链接" poster="封面图链接" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module VideoPlayer
 */

// 导入 xgplayer 播放器
import Player from 'xgplayer'

// 导入 Vue 的相关功能
import { ref, unref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'

// 导入 xgplayer 的 CSS 样式
import 'xgplayer/dist/index.min.css'

// 定义组件的 props
const props = defineProps({
	// 视频 URL，必填
	url: {
		type: String,
		default: '', // 默认值为空字符串
		required: true // 必填项
	},
	// 封面图 URL，非必填
	poster: {
		type: String,
		default: '' // 默认值为空字符串
	}
})

// 创建一个引用，用于保存 Player 实例
const playerRef = ref<Player>()

// 创建一个引用，用于获取视频元素的 DOM
const videoEl = ref<HTMLDivElement>()

/**
 * 初始化播放器
 */
const intiPlayer = () => {
	// 检查 videoEl 是否存在，若不存在则返回
	if (!unref(videoEl)) return
	// 创建 Player 实例并传入配置
	playerRef.value = new Player({
		autoplay: false, // 不自动播放
		...props, // 合并 props 配置
		el: unref(videoEl) // 指定视频元素
	})
}

// 生命周期钩子：组件挂载后调用
onMounted(() => {
	intiPlayer() // 调用初始化播放器的方法
})

// 监听 props 的变化
watch(
	// 监听 props
	() => props,
	async (newProps) => {
		await nextTick() // 等待下一个 DOM 更新周期
		// 如果新 props 存在，更新播放器配置
		if (newProps) {
			unref(playerRef)?.setConfig(newProps)
		}
	},
	{
		deep: true // 深度观察 props 的变化
	}
)

// 生命周期钩子：组件卸载前调用
onBeforeUnmount(() => {
	// 销毁播放器实例
	unref(playerRef)?.destroy()
})

// 暴露给外部使用的播放器实例
defineExpose({
	playerExpose: () => unref(playerRef) // 返回播放器实例
})
</script>

<template>
	<!-- 视频元素的容器 -->
	<div ref="videoEl"></div>
</template>
