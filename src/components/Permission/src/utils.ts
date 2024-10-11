/**
 * @file utils.ts
 * @description 权限检测工具函数
 * @module 权限管理
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @example
 * // 使用示例
 * const hasAccess = hasPermi('admin')
 */

import { useI18n } from '@/hooks/web/useI18n' // 从国际化钩子中导入 useI18n 方法
import router from '@/router' // 导入路由实例

/**
 * 判断用户是否具有特定权限
 * @param {string} value - 要检测的权限字符串
 * @throws {Error} 如果没有传入权限值，则抛出错误
 * @returns {boolean} 返回是否具有该权限
 */
export const hasPermi = (value: string) => {
	const { t } = useI18n() // 获取国际化函数 t
	const permission = (router.currentRoute.value.meta.permission || []) as string[] // 获取当前路由的权限元数据，默认为空数组
	if (!value) {
		// 判断是否传入权限值
		throw new Error(t('permission.hasPermission')) // 如果没有权限值，则抛出国际化错误信息
	}
	if (permission.includes(value)) {
		// 检查当前权限是否包含传入的权限值
		return true // 如果包含，则返回 true
	}
	return false // 如果不包含，则返回 false
}
