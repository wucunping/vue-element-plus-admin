/**
 * @file useDesign.ts
 * @description 定义了一个名为useDesign的自定义钩子函数，它用于获取less变量和生成带命名空间的前缀类名。
 * @example
 * 导入useDesign钩子并使用返回的变量和方法
 * import { useDesign } from './useDesign'
 * const { variables, getPrefixCls } = useDesign()
 * console.log(variables.primaryColor) // 输出主色变量
 * console.log(getPrefixCls('button')) // 输出'namespace-button'
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 导入样式变量模块
import variables from '@/styles/variables.module.less'

/**
 * 使用设计样式
 *
 * @returns 返回一个包含样式变量和获取带前缀类名方法的对象
 */
export const useDesign = () => {
	// 将导入的样式变量赋值给本地变量 lessVariables
	const lessVariables = variables

	/**
	 * 获取带前缀的类名
	 *
	 * @param scope 类名
	 * @returns 返回带前缀的类名，格式为 "namespace-scope"
	 */
	const getPrefixCls = (scope: string) => {
		// 返回由命名空间（namespace）和传入的类名（scope）组成的带前缀类名
		return `${lessVariables.namespace}-${scope}`
	}

	// 返回一个包含样式变量和 getPrefixCls 方法的对象
	return {
		variables: lessVariables, // 样式变量
		getPrefixCls // 获取带前缀类名的方法
	}
}
