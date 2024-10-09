/**
 * @file 连接项和同意属性接口定义文件
 * @description 该文件定义了 LinkItem 和 IAgreeProps 两个接口，
 * 用于描述链接项和相关的属性。
 * @example
 * const link: LinkItem = {
 *   text: '点击这里',
 *   url: 'https://example.com',
 *   onClick: () => { console.log('链接被点击'); }
 * };
 *
 * const agreeProps: IAgreeProps = {
 *   text: '我同意以上条款',
 *   link: [link]
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module LinkItem和IAgreeProps接口
 */

/**
 * 定义一个接口 LinkItem
 * 该接口描述一个链接项
 */
export interface LinkItem {
	/** 链接文字 */
	text: string
	/** 可选的链接地址 */
	url?: string
	/** 可选的点击事件回调函数 */
	onClick?: () => void
}

/**
 * 定义一个接口 IAgreeProps
 * 该接口描述一个包含文本和链接项数组的属性
 */
export interface IAgreeProps {
	/** 显示的文本 */
	text: string
	/** 链接项数组 */
	link: LinkItem[]
}
