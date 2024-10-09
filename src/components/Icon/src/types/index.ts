/**
 * @file index.ts
 * @description 该文件定义了图标类型的接口，用于描述图标的属性。
 * @example
 * // 使用示例
 * const iconProps: IconTypes = {
 *     size: 24,
 *     color: 'blue',
 *     icon: 'user',
 *     hoverColor: 'lightblue'
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module 图标类型模块
 */

/** 图标类型接口 */
export interface IconTypes {
	/** 图标的大小，单位为像素 */
	size?: number // 可选，图标的大小

	/** 图标的颜色 */
	color?: string // 可选，图标的颜色

	/** 图标的名称或标识 */
	icon: string // 必填，图标名称或标识

	/** 图标悬停时的颜色 */
	hoverColor?: string // 可选，图标悬停时的颜色
}
