/**
 * @file dateUtil.ts
 * @description 提供独立的时间操作工具，基于 dayjs 实现，方便后续切换到其他时间库。
 * @example
 *  // 格式化日期时间
 *  const dateTime = formatToDateTime(new Date());
 *  console.log(dateTime); // 输出：2024-11-18 12:34:56
 * @version 1.0.0
 * @date 2024-11-18
 * @author [吴尘](https://github.com/wucunping)
 * @module DateUtil
 */

// 引入 dayjs 库，用于时间处理
import dayjs from 'dayjs'

/**
 * 默认的日期时间格式
 * @example
 *  'YYYY-MM-DD HH:mm:ss'
 */
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 默认的日期格式
 * @example
 *  'YYYY-MM-DD'
 */
const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 格式化日期时间
 * @param {dayjs.ConfigType} [date] 要格式化的日期，支持 Date 对象、字符串、时间戳等
 * @param {string} [format=DATE_TIME_FORMAT] 日期时间格式
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 格式化日期
 * @param {dayjs.ConfigType} [date] 要格式化的日期，支持 Date 对象、字符串、时间戳等
 * @param {string} [format=DATE_FORMAT] 日期格式
 * @returns {string} 格式化后的日期字符串
 */
export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * dayjs 工具实例
 * 提供完整的 dayjs 方法支持
 * @example
 *  const now = dateUtil().format();
 */
export const dateUtil = dayjs
