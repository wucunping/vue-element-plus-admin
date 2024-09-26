/**
 * @file useTimeAgo.ts
 * @description 自定义hook，用于格式化时间显示为"多久之前"或"多久之后"的样式，支持多语言（中文和英文）。
 * @example
 * const timeAgo = useTimeAgo(new Date('2022-01-01'));
 * console.log(timeAgo.value); // 输出格式化后的时间字符串
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module useTimeAgo
 */
import { useTimeAgo as useTimeAgoCore, UseTimeAgoMessages } from '@vueuse/core' // 从 @vueuse/core 导入核心的时间计算函数和类型
import { computed, unref } from 'vue' // 从 Vue 导入计算属性和解引用函数
import { useLocaleStoreWithOut } from '@/store/modules/locale' // 导入用于获取当前语言环境的 store

/**
 * 定义一个时间格式化消息映射对象，支持中文和英文
 */
const TIME_AGO_MESSAGE_MAP: {
	'zh-CN': UseTimeAgoMessages //简体中文消息格式
	en: UseTimeAgoMessages // 英文消息格式
} = {
	'zh-CN': {
		justNow: '刚刚', // 刚发生的时间
		invalid: '无效时间', // 表示无效时间
		past: (n) => (n.match(/\d/) ? `${n}前` : n), // 过去的时间
		future: (n) => (n.match(/\d/) ? `${n}后` : n), // 未来的时间
		month: (n, past) => (n === 1 ? (past ? '上个月' : '下个月') : `${n} 个月`), // 月份
		year: (n, past) => (n === 1 ? (past ? '去年' : '明年') : `${n} 年`), // 年
		day: (n, past) => (n === 1 ? (past ? '昨天' : '明天') : `${n} 天`), // 天
		week: (n, past) => (n === 1 ? (past ? '上周' : '下周') : `${n} 周`), // 周
		hour: (n) => `${n} 小时`, // 小时
		minute: (n) => `${n} 分钟`, // 分钟
		second: (n) => `${n} 秒` // 秒
	},
	en: {
		justNow: '刚刚', //刚刚发生的时间
		invalid: 'Invalid Date', // 表示无效时间的英文
		past: (n) => (n.match(/\d/) ? `${n} ago` : n), // 过去的时间
		future: (n) => (n.match(/\d/) ? `in ${n}` : n), // 未来的时间
		month: (n, past) =>
			n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`, // 月份
		year: (n, past) =>
			n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`, // 年
		day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`), // 天
		week: (n, past) =>
			n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`, // 周
		hour: (n) => `${n} hour${n > 1 ? 's' : ''}`, // 小时
		minute: (n) => `${n} minute${n > 1 ? 's' : ''}`, // 分钟
		second: (n) => `${n} second${n > 1 ? 's' : ''}` // 秒
	}
}

/**
 * @function useTimeAgo
 * @description 自定义 hook 函数，用于获取给定时间的相对表示
 * @param {Date | number | string} time - 要计算相对时间的时间参数，可以是 Date 对象、时间戳或时间字符串
 * @returns {ComputedRef<string>} - 返回计算后的相对时间字符串
 */
export const useTimeAgo = (time: Date | number | string) => {
	const localeStore = useLocaleStoreWithOut() // 获取语言环境 store

	const currentLocale = computed(() => localeStore.getCurrentLocale) // 计算并获取当前语言环境

	// 使用核心时间计算函数，传入时间和对应的消息模板
	const timeAgo = useTimeAgoCore(time, {
		messages: TIME_AGO_MESSAGE_MAP[unref(currentLocale).lang] // 根据当前语言选择消息模板
	})

	return timeAgo // 返回计算后的时间
}
