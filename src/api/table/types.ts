/**
 * @file types.ts
 * @description 表格数据类型定义
 * @example
 *  const example: TableData = { id: '1', author: 'John', title: 'Sample', content: 'Content here', importance: 5, display_time: '2023-10-10', pageviews: 100 };
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module types
 */

/**
 * 表格数据类型
 *
 * @typedef {Object} TableData
 * @property {string} id - 表格项的唯一标识符
 * @property {string} author - 作者姓名
 * @property {string} title - 标题
 * @property {string} content - 内容
 * @property {number} importance - 重要性等级
 * @property {string} display_time - 显示时间
 * @property {number} pageviews - 浏览次数
 */
export type TableData = {
  /** 表格项的唯一标识符 */
  id: string
  /** 作者姓名 */
  author: string
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 重要性等级 */
  importance: number
  /** 显示时间 */
  display_time: string
  /** 浏览次数 */
  pageviews: number
}
