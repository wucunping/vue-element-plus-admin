/**
 * @file getSlot.ts
 * @description 用于获取 Vue 组件的插槽内容，如果插槽存在且为函数，则返回插槽内容。
 * @example
 * // 获取默认插槽内容
 * const content = getSlot(slots, 'default', { key: 'value' });
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module Utils
 */

// 导入 Vue 的 Slots 类型定义，用于插槽的类型声明
import { Slots } from 'vue'

// 导入 isFunction 方法，用于判断一个值是否为函数
import { isFunction } from '@/utils/is'

/**
 * 获取指定的 Vue 插槽内容
 * @param {Slots} slots 插槽对象，包含所有定义的插槽
 * @param {string} [slot='default'] 插槽名称，默认为 default
 * @param {Recordable} [data] 插槽函数所需的参数
 * @returns {any | null} 插槽内容，如果插槽不存在或非函数，则返回 null
 */
export const getSlot = (slots: Slots, slot = 'default', data?: Recordable): any | null => {
  // 检查插槽对象是否存在指定的插槽名称
  if (!slots || !Reflect.has(slots, slot)) {
    return null // 插槽不存在
  }

  // 检查插槽是否为函数
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`) // 插槽不是函数
    return null
  }

  // 获取插槽函数
  const slotFn = slots[slot]

  // 如果插槽函数不存在，返回 null
  if (!slotFn) return null

  // 调用插槽函数并返回插槽内容
  return slotFn(data)
}
