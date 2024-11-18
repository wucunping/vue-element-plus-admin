/**
 * @file useTitle.ts
 * @description 用于设置页面标题的自定义 Hooks。
 * @example
 * const title = useTitle('新标题');
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module Title Management
 */

import { watch, ref } from 'vue' // 从 'vue' 库中导入 watch 和 ref 方法
import { isString } from '@/utils/is' // 导入用于判断字符串类型的工具函数
import { useAppStoreWithOut } from '@/store/modules/app' // 导入应用状态管理模块
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化 Hooks

/**
 * 设置页面标题的自定义钩子
 * @param {string} [newTitle] - 可选的新标题
 * @returns {Ref<string>} 返回响应式标题
 */
export const useTitle = (newTitle?: string) => {
  const { t } = useI18n() // 获取国际化函数 t
  const appStore = useAppStoreWithOut() // 获取无应用上下文的应用状态管理

  /** 创建响应式的标题，默认为应用标题加上新标题（如果提供） */
  const title = ref(
    newTitle ? `${appStore.getTitle} - ${t(newTitle as string)}` : appStore.getTitle // 如果提供了新标题，则格式化为 "应用标题 - 新标题"
  )

  // 监视 title 的变化
  watch(
    title,
    (n, o) => {
      // 如果新值为字符串且不等于旧值，并且 document 对象存在，则设置页面标题
      if (isString(n) && n !== o && document) {
        document.title = n // 更新文档标题
      }
    },
    { immediate: true } // 设置立即执行监视器
  )

  return title // 返回响应式标题
}
