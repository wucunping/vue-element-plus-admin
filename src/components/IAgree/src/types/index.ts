/**
 * @file index.ts
 * @description IAgree组件的类型定义文件，包含LinkItem和IAgreeProps的接口定义。
 * @version 1.0.0
 * @date 2024-11-22
 * @module IAgreeTypes
 * @author
 * [吴尘](https://github.com/wucunping)
 */

/**
 * @interface LinkItem
 * @description 定义超链接项目的结构。
 */
export interface LinkItem {
  /**
   * @property {string} text
   * @description 超链接的显示文本。
   */
  text: string

  /**
   * @property {string} [url]
   * @description 超链接的地址（可选）。
   */
  url?: string

  /**
   * @property {() => void} [onClick]
   * @description 点击超链接时触发的回调函数（可选）。
   */
  onClick?: () => void
}

/**
 * @interface IAgreeProps
 * @description 定义IAgree组件的属性。
 */
export interface IAgreeProps {
  /**
   * @property {string} text
   * @description 文本内容，用于显示组件的主说明。
   */
  text: string

  /**
   * @property {LinkItem[]} link
   * @description 包含多个超链接的数组。
   */
  link: LinkItem[]
}
