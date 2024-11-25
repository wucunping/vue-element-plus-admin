/**
 * @file ImageViewer 创建逻辑模块
 * @description 提供动态创建 ImageViewer 实例的方法，用于显示图片查看器组件。支持配置初始索引、无限循环、点击遮罩关闭等功能。
 * @example
 * import { createImageViewer } from '@/components/ImageViewer'
 * createImageViewer({
 *   urlList: ['image1.jpg', 'image2.jpg'],
 *   initialIndex: 1,
 *   infinite: true,
 *   hideOnClickModal: false,
 *   teleported: false,
 *   zIndex: 3000,
 *   show: true
 * })
 * @version 1.0.0
 * @date 2024-11-22
 * @module /src/components/ImageViewer/index.ts
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 ImageViewer 组件
import ImageViewer from './src/ImageViewer.vue'

// 引入判断是否是客户端环境的工具函数
import { isClient } from '@/utils/is'

// 引入 Vue 的核心 API，用于创建和渲染虚拟节点
import { createVNode, render, VNode } from 'vue'

// 引入 ImageViewer 的属性类型定义
import { ImageViewerProps } from './src/types'

// 声明全局的实例变量，用于存储动态创建的 ImageViewer 组件节点
let instance: Nullable<VNode> = null

/**
 * 创建 ImageViewer 实例
 * @param options 配置项，包含图片地址列表、初始索引、是否无限循环等
 */
export function createImageViewer(options: ImageViewerProps) {
  if (!isClient) return // 如果不是客户端环境，直接返回

  // 解构配置项中的参数并提供默认值
  const {
    urlList, // 图片地址列表
    initialIndex = 0, // 初始图片索引，默认值为 0
    infinite = true, // 是否支持无限循环查看，默认开启
    hideOnClickModal = false, // 是否点击遮罩层关闭查看器，默认关闭
    teleported = false, // 是否将组件渲染到父级之外，默认关闭
    zIndex = 2000, // 图片查看器的 zIndex 值，默认 2000
    show = true // 是否显示图片查看器，默认显示
  } = options

  // 创建一个对象来存储组件的属性
  const propsData: Partial<ImageViewerProps> = {}

  // 创建一个容器 DOM 节点
  const container = document.createElement('div')

  // 将传入的配置赋值到属性对象中
  propsData.urlList = urlList // 设置图片列表
  propsData.initialIndex = initialIndex // 设置初始显示的图片索引
  propsData.infinite = infinite // 设置是否无限循环
  propsData.hideOnClickModal = hideOnClickModal // 设置是否点击遮罩关闭
  propsData.teleported = teleported // 设置是否脱离父级渲染
  propsData.zIndex = zIndex // 设置组件的 zIndex 值
  propsData.show = show // 设置组件是否显示

  // 将创建的容器节点添加到 HTML 的 body 中
  document.body.appendChild(container)

  // 使用 createVNode 创建 ImageViewer 的虚拟节点
  instance = createVNode(ImageViewer, propsData)

  // 将虚拟节点渲染到容器节点上
  render(instance, container)
}
