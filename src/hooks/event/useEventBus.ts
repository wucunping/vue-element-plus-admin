/**
 * useEventBus.ts - 事件总线自定义hook
 *
 * @file useEventBus.ts
 * @description 该文件定义了一个自定义的Vue Composition API钩子`useEventBus`，用于在Vue组件中方便地管理事件。
 * 使用mitt库作为事件总线，可以跨组件触发和监听事件，增强组件之间的通信能力。
 *
 * @example
 * const { on, off, emit } = useEventBus({ name: 'myEvent', callback: () => console.log('Event triggered!') });
 * emit('myEvent'); // 触发事件
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 *
 * @export { useEventBus } - 导出自定义hook以供其他组件使用
 */

// 引入mitt库，用于创建事件总线
import mitt from 'mitt'
// 引入vue的onBeforeUnmount生命周期钩子，用于在组件卸载前执行清理操作
import { onBeforeUnmount } from 'vue'

/**
 * 定义Option接口，约束传入useEventBus的参数类型
 */
interface Option {
	/**
	 * 事件名称。
	 */
	name: string
	/**
	 * 事件回调，注意Fn类型应在此文件或其他地方定义，例如type Fn = () => void;名称。
	 */
	callback: Fn
}

// 创建mitt实例，作为事件总线
const emitter = mitt()

/**
 * 使用事件总线的自定义Vue Composition API钩子。
 * @param option 可选参数，包含事件名称和回调
 * @returns 返回事件总线的方法，包括监听、取消监听、触发事件和获取所有事件监听器,包含on、off、emit和all方法。
 */
export const useEventBus = (option?: Option) => {
	// 如果提供了option参数，则注册事件监听器
	if (option) {
		// 使用事件名称和回调注册事件监听器
		emitter.on(option.name, option.callback)

		// 在组件卸载前，取消事件监听器
		onBeforeUnmount(() => {
			emitter.off(option.name)
		})
	}

	// 返回一个对象，包含事件监听、取消监听、触发事件和获取所有事件监听器的方法
	return {
		on: emitter.on, // 注册事件监听器
		off: emitter.off, // 取消事件监听器
		emit: emitter.emit, // 触发事件
		all: emitter.all // 获取所有事件监听器
	}
}

// 注意：Fn类型应在此文件或其他地方定义，例如：
// type Fn = () => void;
// 如果Fn类型未定义，则需要补充定义或替换为合适的函数类型。
