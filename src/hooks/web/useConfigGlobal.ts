/**
 * useConfigGlobal.ts - 全局配置自定义hook
 *
 * @file useConfigGlobal.ts
 * @description 该文件定义了一个自定义hook `useConfigGlobal`，用于从上下文中注入全局配置信息。
 * 该hook可以方便地在组件中访问和使用全局配置，确保整个应用的一致性。
 *
 * @example
 * const { configGlobal } = useConfigGlobal();
 * console.log(configGlobal); // 输出全局配置信息
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 *
 * @export { useConfigGlobal } - 导出自定义hook以供其他组件使用
 */

// 引入全局配置的类型定义
import { ConfigGlobalTypes } from '@/components/ConfigGlobal'

// 引入Vue的inject函数，用于从祖先组件中注入依赖
import { inject } from 'vue'

/**
 * 使用全局配置
 *
 * @returns 返回一个包含全局配置信息的对象
 */
export const useConfigGlobal = () => {
	// 从依赖注入中获取名为'configGlobal'的配置，如果找不到则返回空对象{}
	const configGlobal = inject('configGlobal', {}) as ConfigGlobalTypes

	// 返回一个包含configGlobal的对象
	return {
		configGlobal
	}
}
