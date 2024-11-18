/**
 * @file useNProgress.ts
 * @description 自定义钩子，用于配置和使用 NProgress 进度条
 * @example
 * const { start, done } = useNProgress();
 * start(); // 开始进度
 * done(); // 结束进度
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useNProgress
 */

import { nextTick, unref } from 'vue' // 从 Vue 库中导入 nextTick 和 unref 方法
import type { NProgressOptions } from 'nprogress' // 导入 NProgressOptions 类型用于类型注释
import NProgress from 'nprogress' // 导入 NProgress 进度条库
import 'nprogress/nprogress.css' // 导入 NProgress 的样式文件
import { useCssVar } from '@vueuse/core' // 从 VueUse 库中导入 useCssVar 方法

const primaryColor = useCssVar('--el-color-primary', document.documentElement) // 获取 CSS 变量 '--el-color-primary' 的值

/**
 * 自定义钩子，设置和控制 NProgress 进度条
 * @returns 返回开始和结束进度条的函数
 */
export const useNProgress = () => {
  NProgress.configure({ showSpinner: false } as NProgressOptions) // 配置 NProgress，隐藏进度条的旋转器

  /**
   * 初始化进度条颜色
   */
  const initColor = async () => {
    await nextTick() // 等待 Vue 完成 DOM 更新
    const bar = document.getElementById('nprogress')?.getElementsByClassName('bar')[0] as ElRef // 获取进度条的 DOM 元素
    // 如果找到了进度条
    if (bar) {
      bar.style.background = unref(primaryColor.value) // 设置进度条的背景颜色为 primaryColor 的值
    }
  }

  initColor() // 调用初始化函数，以设置进度条颜色

  /**
   * 开始显示进度条
   */
  const start = () => {
    NProgress.start() // 调用 NProgress 的 start 方法，开始显示进度
  }

  /**
   * 结束显示进度条
   */
  const done = () => {
    NProgress.done() // 调用 NProgress 的 done 方法，结束进度显示
  }

  // 返回开始和结束函数
  return {
    /** 开始显示进度条 */
    start,
    /** 结束显示进度条 */
    done
  }
}
