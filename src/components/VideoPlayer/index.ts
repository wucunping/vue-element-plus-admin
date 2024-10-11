/**
 * @file index.ts
 * @description 视频播放器相关功能的实现
 * @example 创建视频查看器并渲染到页面中
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module VideoPlayerModule
 */

import type { VNode } from 'vue' // 引入VNode类型，用于定义虚拟节点
import { createVNode, render } from 'vue' // 从vue.js库中引入createVNode和render方法
import VideoPlayer from './src/VideoPlayer.vue' // 导入视频播放器组件
import { isClient } from '@/utils/is' // 导入判断是否为客户端的工具函数
import { VideoPlayerViewer } from '@/components/VideoPlayerViewer' // 导入视频播放器查看器组件
import { toAnyString } from '@/utils' // 导入转换为字符串的工具函数

export { VideoPlayer } // 导出VideoPlayer组件

let instance: Nullable<VNode> = null // 声明一个虚拟节点的可空变量，用于存储播放实例

/**
 * 创建视频查看器并渲染到页面中
 * @param options - 视频查看器的配置选项
 * @param options.url - 视频的URL地址
 * @param options.poster - 视频的海报图像URL（可选）
 * @param options.show - 是否展示视频查看器（可选）
 */
export function createVideoViewer(options: { url: string; poster?: string; show?: boolean }) {
	if (!isClient) return // 如果不是在客户端环境中则返回
	const { url, poster } = options // 解构获取url和poster参数

	// 定义组件的属性数据，部分类型定义
	const propsData: Partial<{ url: string; poster?: string; show?: boolean; id?: string }> = {}
	const container = document.createElement('div') // 创建一个div容器
	const id = toAnyString() // 生成唯一的ID
	container.id = id // 设置div的ID
	propsData.url = url // 设置组件的url属性
	propsData.poster = poster // 设置组件的poster属性
	propsData.show = true // 默认展示视频查看器
	propsData.id = id // 设置组件的id属性

	document.body.appendChild(container) // 将容器添加到文档的body中
	instance = createVNode(VideoPlayerViewer, propsData) // 创建VideoPlayerViewer的虚拟节点实例
	render(instance, container) // 将虚拟节点渲染到容器中
}
