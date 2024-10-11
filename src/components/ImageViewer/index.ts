/**
 * @file index.ts
 * @description 图像查看器的创建逻辑
 * @example
 * createImageViewer({
 *   urlList: ['image1.jpg', 'image2.jpg'],
 *   initialIndex: 0
 * });
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ImageViewer
 */

import ImageViewer from './src/ImageViewer.vue' // 导入ImageViewer组件
import { isClient } from '@/utils/is' // 导入isClient工具函数
import type { VNode } from 'vue' // 导入VNode类型
import { createVNode, render } from 'vue' // 从Vue导入createVNode和render方法
import type { ImageViewerProps } from './src/types' // 导入ImageViewerProps类型

/** 声明一个可能为null的VNode实例 */
let instance: Nullable<VNode> = null

/**
 * 创建图像查看器的函数
 * @param options - 图像查看器的配置选项
 */
export function createImageViewer(options: ImageViewerProps) {
	if (!isClient) return // 如果不是客户端环境，直接返回

	const {
		urlList, // 图像列表
		initialIndex = 0, // 初始显示的图像索引, 默认为0
		infinite = true, // 是否无限循环, 默认为true
		hideOnClickModal = false, // 是否在点击模态框时隐藏, 默认为false
		teleported = false, // 是否传送到其他 DOM 节点, 默认为false
		zIndex = 2000, // zIndex值, 默认为2000
		show = true // 是否显示, 默认为true
	} = options // 解构赋值获取配置选项

	const propsData: Partial<ImageViewerProps> = {} // 声明一个部分类型的属性数据对象
	const container = document.createElement('div') // 创建一个div容器
	propsData.urlList = urlList // 将urlList赋值给propsData
	propsData.initialIndex = initialIndex // 将initialIndex赋值给propsData
	propsData.infinite = infinite // 将infinite赋值给propsData
	propsData.hideOnClickModal = hideOnClickModal // 将hideOnClickModal赋值给propsData
	propsData.teleported = teleported // 将teleported赋值给propsData
	propsData.zIndex = zIndex // 将zIndex赋值给propsData
	propsData.show = show // 将show赋值给propsData

	document.body.appendChild(container) // 将容器添加到文档主体中
	instance = createVNode(ImageViewer, propsData) // 使用createVNode方法创建ImageViewer的虚拟节点
	render(instance, container) // 使用render方法将虚拟节点渲染到容器中
}
