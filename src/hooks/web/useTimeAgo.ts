/**
 * @file useTimeAgo.ts
 * @description 处理时间相关的展示，将给定的时间转换为“多久之前”或“多久之后”的格式。
 * @module useTimeAgo
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @example
 * const timeAgo = useTimeAgo(new Date());
 */

import { useTimeAgo as useTimeAgoCore, UseTimeAgoMessages } from '@vueuse/core' // 引入核心时间处理函数和类型定义
import { computed, unref } from 'vue' // 从 Vue 引入 computed 和 unref 方法
import { useLocaleStoreWithOut } from '@/store/modules/locale' // 引入语言状态管理模块

/** 定义一个映射，将语言代码映射到对应的时间格式消息 */
const TIME_AGO_MESSAGE_MAP: {
  'zh-CN': UseTimeAgoMessages // 简体中文消息类型
  en: UseTimeAgoMessages // 英文消息类型
} = {
  // 简体中文设置
  'zh-CN': {
    justNow: '刚刚', // 刚刚过去
    invalid: '无效时间', // 无效的时间格式
    past: (n) => (n.match(/\d/) ? `${n}前` : n), // 过去的时间
    future: (n) => (n.match(/\d/) ? `${n}后` : n), // 将来的时间
    month: (n, past) => (n === 1 ? (past ? '上个月' : '下个月') : `${n} 个月`), // 月的处理
    year: (n, past) => (n === 1 ? (past ? '去年' : '明年') : `${n} 年`), // 年的处理
    day: (n, past) => (n === 1 ? (past ? '昨天' : '明天') : `${n} 天`), // 天的处理
    week: (n, past) => (n === 1 ? (past ? '上周' : '下周') : `${n} 周`), // 周的处理
    hour: (n) => `${n} 小时`, // 小时的处理
    minute: (n) => `${n} 分钟`, // 分钟的处理
    second: (n) => `${n} 秒` // 秒的处理
  },
  // 英文设置
  en: {
    justNow: '刚刚', // 刚刚过去
    invalid: 'Invalid Date', // 无效的时间格式
    past: (n) => (n.match(/\d/) ? `${n} ago` : n), // 过去的时间
    future: (n) => (n.match(/\d/) ? `in ${n}` : n), // 将来的时间
    month: (n, past) =>
      n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`, // 月的处理
    year: (n, past) =>
      n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`, // 年的处理
    day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`), // 天的处理
    week: (n, past) =>
      n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`, // 周的处理
    hour: (n) => `${n} hour${n > 1 ? 's' : ''}`, // 小时的处理
    minute: (n) => `${n} minute${n > 1 ? 's' : ''}`, // 分钟的处理
    second: (n) => `${n} second${n > 1 ? 's' : ''}` // 秒的处理
  }
}

/**
 * 使用给定的时间生成“多久之前”或“多久之后”的格式
 * @param time - 要处理的时间，可以为 Date 对象、时间戳或时间字符串
 * @returns 返回处理后的时间字符串
 */
export const useTimeAgo = (time: Date | number | string) => {
  const localeStore = useLocaleStoreWithOut() // 获取语言状态管理器

  const currentLocale = computed(() => localeStore.getCurrentLocale) // 计算当前语言

  /** 使用核心时间处理函数，传入时间和对应的消息 */
  const timeAgo = useTimeAgoCore(time, {
    messages: TIME_AGO_MESSAGE_MAP[unref(currentLocale).lang] // 根据当前语言选择消息
  })

  return timeAgo // 返回处理后的时间
}
