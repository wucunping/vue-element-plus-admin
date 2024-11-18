/**
 * @file useEventBus.ts
 * @description 事件总线的实现，用于在 Vue 组件间传递事件
 * @example
 * const { on, emit } = useEventBus({ name: 'eventName', callback: () => {} });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module EventBus
 */

import mitt from 'mitt' // 导入mitt库，用于创建事件总线
import { onBeforeUnmount } from 'vue' // 从vue中导入onBeforeUnmount钩子，便于在组件卸载前进行清理

/** 定义一个接口Option，用于描述事件名称及其回调函数 */
interface Option {
  name: string // 事件名称
  callback: Fn // 事件处理回调函数
}

const emitter = mitt() // 创建一个事件总线实例

/**
 * useEventBus - 自定义组合函数，用于注册事件和管理事件总线
 * @param {Option} option - 事件名称及其回调
 * @returns {Object} - 返回事件总线的相关方法
 */
export const useEventBus = (option?: Option) => {
  // 如果传入了选项
  if (option) {
    emitter.on(option.name, option.callback) // 注册事件监听器

    // 在组件卸载前执行
    onBeforeUnmount(() => {
      emitter.off(option.name) // 移除事件监听器
    })
  }

  return {
    on: emitter.on, // 绑定事件监听方法
    off: emitter.off, // 解绑事件监听方法
    emit: emitter.emit, // 触发事件
    all: emitter.all // 获取所有已注册的事件
  }
}
