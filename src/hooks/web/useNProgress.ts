/**
 * @file useNProgress.ts
 * @description 自定义钩子，用于在 Vue 应用中实现 NProgress 进度条功能。
 * 该钩子允许用户在页面加载时，方便地通过控制进度条的启动和完成来提供视觉反馈。
 * @example
 * const { start, done } = useNProgress();
 * start(); // 启动进度条
 * done();  // 结束进度条
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module useNProgress
 */

// 导入 Vue 的 nextTick 和 unref 方法
import { nextTick, unref } from 'vue'

// 导入 NProgressOptions 类型，这用于配置 NProgress 的选项
import type { NProgressOptions } from 'nprogress'

// 导入 NProgress 库，用于显示进度条
import NProgress from 'nprogress'

// 导入 NProgress 的样式文件，以便于进行样式设置
import 'nprogress/nprogress.css'

// 导入 VueUse 中处理 CSS 变量的工具函数
import { useCssVar } from '@vueuse/core'

/** 定义主颜色变量，获取根元素的 CSS 变量 '--el-color-primary' */
const primaryColor = useCssVar('--el-color-primary', document.documentElement)

/**
 * 使用 NProgress 的自定义钩子
 * @returns {Object} 包含 start 和 done 方法的对象
 */
export const useNProgress = () => {
	// 配置 NProgress，设置不显示加载动画的选项
	NProgress.configure({ showSpinner: false } as NProgressOptions)

	/**
	 * 初始化颜色的异步函数
	 * 在 DOM 更新后设置进度条的颜色
	 */
	const initColor = async () => {
		// 等待下一个 DOM 更新周期
		await nextTick()
		// 获取 NProgress 的进度条元素
		const bar = document.getElementById('nprogress')?.getElementsByClassName('bar')[0] as ElRef
		// 如果找到了进度条元素，设置其背景颜色
		if (bar) {
			// bar.style.background = unref(primaryColor.value) // 设置进度条的背景颜色为主颜色
			bar.style.background = unref(primaryColor.value) || '#ffffff' // 设置进度条的背景颜色为主颜色,颜色为空的情况下使用使用白色作为默认值
		}
	}

	// 调用初始化颜色函数以设置进度条颜色
	initColor()

	/**
	 * 开始 NProgress 的函数
	 * 启动进度条的显示
	 */
	const start = () => {
		NProgress.start() // 启动 NProgress，显示进度条
	}

	/**
	 * 完成 NProgress 的函数
	 * 隐藏进度条
	 */
	const done = () => {
		NProgress.done() // 结束 NProgress，隐藏进度条
	}

	// 返回包含开始和完成方法的对象，供外部调用
	return {
		start, // 返回开始进度条的方法
		done // 返回完成进度条的方法
	}
}
