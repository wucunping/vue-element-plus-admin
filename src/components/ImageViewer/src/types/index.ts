/**
 * @file 定义 ImageViewer 组件的类型接口
 * @description 提供 ImageViewer 组件的属性类型，用于限制和描述组件的 Props，确保类型安全和可读性。
 * @example
 * import type { ImageViewerProps } from '@/components/ImageViewer/src/types'
 *
 * const props: ImageViewerProps = {
 *   urlList: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
 *   zIndex: 2000,
 *   initialIndex: 0,
 *   infinite: true,
 *   hideOnClickModal: false,
 *   teleported: true,
 *   show: true
 * }
 *
 * @version 1.0.0
 * @date 2024-11-22
 * @module /src/components/ImageViewer/src/types/index.ts
 * @author [吴尘](https://github.com/wucunping)
 */

/** 定义 ImageViewer 组件的 Props 类型 */
export interface ImageViewerProps {
  /** 图片 URL 列表，用于展示的图片资源 */
  urlList?: string[]

  /** 设置组件的 z-index，控制图层的优先级 */
  zIndex?: number

  /** 初始显示的图片索引 */
  initialIndex?: number

  /** 是否允许循环查看图片 */
  infinite?: boolean

  /** 是否点击遮罩层隐藏图片预览 */
  hideOnClickModal?: boolean

  /** 是否将组件渲染到指定的 teleport 容器 */
  teleported?: boolean

  /** 控制图片查看器的显示状态 */
  show?: boolean
}
