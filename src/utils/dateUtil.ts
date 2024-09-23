/**
 * dateUtil.ts - 日期操作工具
 *
 * @description
 * 本文件为日期操作工具，使用dayjs库进行日期和时间处理。提供了将日期转换为指定格式的字符串的方法。
 *
 * @example
 * 使用示例：
 * 格式化日期时间为字符串：`formatToDateTime(new Date(), 'YYYY-MM-DD HH:mm:ss')`
 * 格式化日期为字符串：`formatToDate(new Date(), 'YYYY-MM-DD')`
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入dayjs库，一个轻量级的日期处理库
import dayjs from 'dayjs'

// 定义日期时间格式常量
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
// 定义日期格式常量
const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 将日期格式化为指定格式的日期时间字符串
 *
 * @param date - 要格式化的日期（可选）
 * @param format - 格式化样式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间字符串
 */
export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
	return dayjs(date).format(format)
}

/**
 * 将日期格式化为指定格式的日期字符串
 *
 * @param date - 要格式化的日期（可选）
 * @param format - 格式化样式，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
	return dayjs(date).format(format)
}

// 导出dayjs库
export const dateUtil = dayjs
