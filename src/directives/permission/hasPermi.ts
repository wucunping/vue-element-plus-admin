/**
 * @file 权限指令文件
 * @description 提供一个自定义指令，用于根据权限控制元素的显示
 * @example
 * <div v-has-permi="'admin'">管理区域</div>
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module permissionDirective
 */

import type { App, Directive, DirectiveBinding } from 'vue' // 导入 Vue 相关类型
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化钩子
import router from '@/router' // 导入路由实例

const { t } = useI18n() // 获取国际化函数 t

/**
 * 检查是否具有特定权限
 * @param value - 权限值
 * @returns {boolean} - 返回当前用户是否具有该权限
 * @throws {Error} - 如果未传入权限值，抛出错误
 */
const hasPermission = (value: string): boolean => {
  const permission = (router.currentRoute.value.meta.permission || []) as string[] // 获取当前路由的权限信息
  if (!value) {
    throw new Error(t('permission.hasPermission')) // 如果未提供权限值，抛出错误
  }
  // 检查权限是否包含在当前用户的权限中
  if (permission.includes(value)) {
    return true // 返回真，表示有权限
  }
  return false // 返回假，表示没有权限
}
/**
 * 自定义指令的核心逻辑
 * @param el - 绑定的 DOM 元素
 * @param binding - 指令的绑定信息
 */
function hasPermi(el: Element, binding: DirectiveBinding) {
  const value = binding.value // 获取指令传入的值

  const flag = hasPermission(value) // 检查是否具有该权限
  if (!flag) {
    el.parentNode?.removeChild(el) // 如果没有权限，移除 DOM 元素
  }
}
/**
 * 自定义指令的挂载钩子
 * @param el - 绑定的 DOM 元素
 * @param binding - 指令的绑定信息
 */
const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  hasPermi(el, binding) // 调用权限检查函数
}

/** 定义指令对象 */
const permiDirective: Directive = {
  mounted // 指定挂载钩子
}

/**
 * 设置权限指令
 * @param app - Vue 应用实例
 */
export const setupPermissionDirective = (app: App<Element>) => {
  app.directive('hasPermi', permiDirective) // 注册自定义指令
}

export default permiDirective // 导出指令对象
