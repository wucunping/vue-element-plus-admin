/**
 * @file /src/components/Permission/src/utils.ts
 * @description 提供权限验证的工具函数，用于检查用户是否具备指定权限
 * @example 使用方式：const hasAccess = hasPermi('admin')
 * @version 1.0.0
 * @date 2024-11-22
 * @module PermissionUtilsModule
 * @returns boolean 表示是否具有指定权限
 * @throws Error 如果未提供权限值，则抛出错误
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入国际化 Hook，用于获取多语言文本
import { useI18n } from '@/hooks/web/useI18n'

// 引入路由实例，用于获取当前路由的权限信息
import router from '@/router'

/**
 * @description 检查用户是否具有指定权限
 * @param value 权限标识字符串
 * @returns boolean 如果用户具有指定权限，返回 true；否则返回 false
 * @throws Error 如果未提供权限标识，抛出错误
 */
export const hasPermi = (value: string) => {
  // 获取国际化工具函数
  const { t } = useI18n()

  // 从当前路由的 meta 数据中获取权限列表
  const permission = (router.currentRoute.value.meta.permission || []) as string[]

  // 如果未提供权限标识，抛出错误
  if (!value) {
    throw new Error(t('permission.hasPermission')) // 抛出错误信息，提示需要权限标识
  }

  // 检查权限列表中是否包含指定的权限标识
  if (permission.includes(value)) {
    return true // 如果包含，返回 true
  }

  return false // 如果不包含，返回 false
}
