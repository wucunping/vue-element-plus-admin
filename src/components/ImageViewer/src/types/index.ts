/**
 * @file index.ts
 * @description 图片查看器组件的属性接口
 * @example
 * const props: ImageViewerProps = {
 *   urlList: ['image1.jpg', 'image2.jpg'],
 *   zIndex: 100,
 *   initialIndex: 0,
 *   infinite: true,
 *   hideOnClickModal: false,
 *   teleported: true,
 *   show: true,
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ImageViewer
 */

/**
 * 图片查看器组件的属性接口
 * @interface ImageViewerProps
 */
export interface ImageViewerProps {
	/**
	 * 图片 URL 列表
	 * @type {string[]}
	 */
	urlList?: string[]

	/**
	 * Z轴层级
	 * @type {number}
	 */
	zIndex?: number

	/**
	 * 初始显示的图片索引
	 * @type {number}
	 */
	initialIndex?: number

	/**
	 * 是否开启无限循环
	 * @type {boolean}
	 */
	infinite?: boolean

	/**
	 * 点击模态框时是否隐藏
	 * @type {boolean}
	 */
	hideOnClickModal?: boolean

	/**
	 * 是否进行传送
	 * @type {boolean}
	 */
	teleported?: boolean

	/**
	 * 组件是否显示
	 * @type {boolean}
	 */
	show?: boolean
}
