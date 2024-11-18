/**
 * @file useScrollTo.ts
 * @description 实现平滑滚动的钩子函数
 * @example
 * const { start, stop } = useScrollTo({ el: element, to: 300, position: 'scrollTop' });
 * start(); // 开始滚动
 * stop(); // 停止滚动
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useScrollTo
 */

import { ref, unref } from 'vue' // 引入 Vue 的 ref 和 unref 函数

/**
 * @interface ScrollToParams
 * @description 滚动参数接口
 */
export interface ScrollToParams {
  /** 目标元素 */
  el: HTMLElement
  /** 滚动的目标位置 */
  to: number
  /** 滚动的方向（如 'scrollTop' 或 'scrollLeft'） */
  position: string
  /** 滚动持续时间（可选） */
  duration?: number
  /** 滚动完成后的回调函数（可选） */
  callback?: () => void
}

/**
 * @function easeInOutQuad
 * @description 二次缓动函数，用于计算动画中的位置
 * @param {number} t - 当前时间
 * @param {number} b - 初始值
 * @param {number} c - 变化量
 * @param {number} d - 持续时间
 * @returns {number} - 随时间变化的动画值
 */
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2 // 将时间t进行缩放
  if (t < 1) {
    return (c / 2) * t * t + b // 前半段
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b // 后半段
}
/**
 * @function move
 * @description 移动目标元素的特定属性到指定的值
 * @param {HTMLElement} el - 目标元素
 * @param {string} position - 需要修改的属性名称
 * @param {number} amount - 要设置的目标值
 */
const move = (el: HTMLElement, position: string, amount: number) => {
  el[position] = amount // 设置目标元素的属性值
}

/**
 * @function useScrollTo
 * @description 平滑滚动的自定义钩子函数
 * @param {ScrollToParams} params - 滚动参数对象
 * @returns {Object} - 提供 start 和 stop 方法
 */
export function useScrollTo({
  el,
  position = 'scrollLeft', // 默认滚动方向为 'scrollLeft'
  to,
  duration = 500, // 默认滚动持续时间为 500毫秒
  callback
}: ScrollToParams) {
  const isActiveRef = ref(false) // 状态引用，表示动画是否正在进行
  const start = el[position] // 获取初始位置
  const change = to - start // 计算变化量
  const increment = 20 // 每次动画帧递增的时间
  let currentTime = 0 // 当前时间计数器

  /**
   * @function animateScroll
   * @description 实现动画滚动的主体函数
   */
  function animateScroll() {
    // 如果动画未激活则返回
    if (!unref(isActiveRef)) {
      return
    }
    currentTime += increment // 增加当前时间
    const val = easeInOutQuad(currentTime, start, change, duration) // 计算当前值
    move(el, position, val) // 移动目标元素
    // 如果未到达结束时间且动画仍激活，则继续动画
    if (currentTime < duration && unref(isActiveRef)) {
      requestAnimationFrame(animateScroll) // 递归调用
    } else {
      if (callback) {
        callback() // 执行回调函数
      }
    }
  }

  /**
   * @function run
   * @description 启动动画滚动
   */
  function run() {
    isActiveRef.value = true // 激活动画状态
    animateScroll() // 开始动画
  }

  /**
   * @function stop
   * @description 停止动画滚动
   */
  function stop() {
    isActiveRef.value = false // 禁用动画状态
  }

  return { start: run, stop } // 返回启动和停止方法
}
