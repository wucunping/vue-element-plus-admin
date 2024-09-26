/**
 * @file useTitle.ts
 * @description 自定义 hook 函数，用于设置和更新网页标题。根据应用程序的当前标题和可选的新标题动态生成网页标题。
 * @example
 * const title = useTitle('新标题');
 * // 在响应式数据变化时，页面标题将自动更新
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module Title
 */

import { watch, ref } from 'vue' // 从 Vue 导入观察者和响应式引用
import { isString } from '@/utils/is' // 导入用于检查字符串类型的工具函数
import { useAppStoreWithOut } from '@/store/modules/app' // 导入无参数应用程序 store
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化相关的 hook

/**
 * @function useTitle
 * @description 自定义 hook 函数，用于设置和更新网页标题
 * @param {string} [newTitle] - 可选的新标题，如果提供则将与应用程序标题合并
 * @returns {Ref<string>} - 返回一个响应式的标题引用
 */
export const useTitle = (newTitle?: string) => {
	const { t } = useI18n() // 使用国际化 hook 获取翻译函数
	const appStore = useAppStoreWithOut() // 获取应用程序 store

	// 初始化标题，默认使用应用程序的标题，如果提供了 newTitle 则合并
	const title = ref(
		newTitle ? `${appStore.getTitle} - ${t(newTitle as string)}` : appStore.getTitle
	)

	// 观察 title 的变化，若变化则更新文档标题
	watch(
		title, // 要观察的特性
		(n, o) => {
			// 变化回调函数，n 为新值，o 为旧值
			if (isString(n) && n !== o && document) {
				// 检查新值是字符串且与旧值不同，并确认 document 存在
				document.title = n // 更新文档标题
			}
		},
		{ immediate: true } // 立即执行一次观察
	)

	return title // 返回响应式标题
}
