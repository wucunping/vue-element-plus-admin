/**
 * @file index.ts
 * @description 头像项接口定义文件
 * @example
 * // 使用示例
 * const avatar: AvatarItem = {
 *   url: 'https://example.com/avatar.png',
 *   name: '用户名称'
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module AvatarItem
 */

/**
 * 头像项接口
 */
export interface AvatarItem {
	/**
	 * 头像的URL地址
	 */
	url: string

	/**
	 * 头像的名称（可选）
	 */
	name?: string
}
