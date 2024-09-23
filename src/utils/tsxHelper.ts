/**
 * src/utils/tsxHelper.ts - Vue 组件槽处理工具
 *
 * @description
 * 该文件定义了一个 getSlot 函数，用于从 Vue 组件的 slots 属性中获取指定槽的渲染函数，并执行它。如果指定的槽不存在或者不是函数，函数会输出错误信息并返回 null。
 * 此工具主要用于处理 Vue 组件中的插槽逻辑，包括获取、验证和执行插槽函数。
 *
 * @example
 * 使用示例：
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Vue 的 Slots 类型
import { Slots } from 'vue'

// 导入自定义的 is 模块的 isFunction 函数
import { isFunction } from '@/utils/is'

/**
 * 获取并执行指定槽的渲染函数
 *
 * @param slots Vue 组件的 slots 属性
 * @param slot 要获取的槽的名称，默认为 'default'
 * @param data 传递给槽函数的参数，可选
 * @returns 返回槽函数的执行结果，如果指定的槽不存在或不是函数，则返回 null
 */
export const getSlot = (slots: Slots, slot = 'default', data?: Recordable) => {
	// 判断提供的 slots 对象是否存在以及是否包含指定的槽
	if (!slots || !Reflect.has(slots, slot)) {
		// 如果指定的槽不存在，则返回 null
		return null
	}

	// 验证指定的槽是否是一个函数
	if (!isFunction(slots[slot])) {
		// 如果不是函数，则输出错误信息并返回 null
		console.error(`${slot} is not a function!`)
		return null
	}

	// 获取槽函数
	const slotFn = slots[slot]

	// 如果槽函数不存在，则返回 null
	if (!slotFn) {
		return null
	}

	// 执行槽函数并返回结果
	return slotFn(data)
}
