/**
 * @file useNow.ts
 * @description 提供当前时间的状态管理和更新时间的功能
 * @example
 * const { year, month, week, day, hour, minute, second, meridiem, start, stop } = useNow();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useNow
 */

import { dateUtil } from '@/utils/dateUtil' // 导入日期工具函数
import { reactive, toRefs } from 'vue' // 导入Vue的响应式API和转换为引用的函数
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core' // 导入VueUse库的生命周期函数

/**
 * useNow Hook
 *
 * @param {boolean} immediate - 是否立即启动定时器，默认为true
 * @returns {Object} 包含当前时间的响应式状态和控制定时器的函数
 */
export const useNow = (immediate = true) => {
  let timer: IntervalHandle // 定义定时器的句柄

  /** 定义响应式状态对象，存储时间的各个部分 */
  const state = reactive({
    /** 年份 */
    year: 0,
    /** 月份 */
    month: 0,
    /** 星期 */
    week: '',
    /** 日期 */
    day: 0,
    /** 小时 */
    hour: '',
    /** 分钟 */
    minute: '',
    /** 秒 */
    second: 0,
    /** 上午/下午 */
    meridiem: ''
  })

  /**
   * 更新当前时间状态
   */
  const update = () => {
    const now = dateUtil() // 获取当前日期时间的工具实例

    const h = now.format('HH') // 获取当前小时
    const m = now.format('mm') // 获取当前分钟
    const s = now.get('s') // 获取当前秒数

    // 更新状态对象的各个字段
    state.year = now.get('y') // 更新年份
    state.month = now.get('M') + 1 // 更新月份（注意加1）
    state.week = '星期' + ['日', '一', '二', '三', '四', '五', '六'][now.day()] // 更新星期
    state.day = now.get('date') // 更新日期
    state.hour = h // 更新小时
    state.minute = m // 更新小时
    state.second = s // 更新秒数

    state.meridiem = now.format('A') // 更新上午/下午标识
  }

  /**
   * 启动定时器，以每秒更新一次时间
   */
  function start() {
    update() // 更新一次时间
    clearInterval(timer) // 清除已有的定时器
    timer = setInterval(() => update(), 1000) // 每秒更新一次
  }

  /**
   * 停止定时器
   */
  function stop() {
    clearInterval(timer) // 清除定时器
  }

  // 在组件挂载时调用start函数（如果immediate为true）
  tryOnMounted(() => {
    immediate && start()
  })

  // 在组件卸载时调用stop函数
  tryOnUnmounted(() => {
    stop()
  })

  // 返回响应式状态的引用和控制函数
  return {
    ...toRefs(state),
    start,
    stop
  }
}
