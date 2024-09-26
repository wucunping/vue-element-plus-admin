/**
 * propTypes.ts - Vue 组件属性类型定义与验证工具
 *
 * @description
 * 本文件定义了一个名为 propTypes 的 TypeScript 类，该类扩展了 vue-types 库提供的基础类型，
 * 并添加了一个自定义的 style 属性类型。这个类主要用于 Vue.js 组件开发中，为组件的 props 提供类型定义和验证。
 * 通过使用 propTypes，我们可以确保传入组件的 props 符合预期的类型，从而在开发阶段就捕捉到可能的类型错误，
 * 提高代码的健壮性和可维护性。
 *
 * @example
 * 使用示例：
 * import { propTypes } from '@/utils/propTypes';
 * export default {
 * props: {
 * myFunc: propTypes.func.isRequired, // 函数类型，且为必传项
 * myBool: propTypes.bool.def(false), // 布尔类型，默认为 false
 * myStyle: propTypes.style, // 自定义的 style 类型
 * // ... 其他 props 定义
 * },
 * // ... 组件的其他选项
 * };
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 *
 * vue3中 使用vue-types
 * https://blog.csdn.net/u013190012/article/details/138234781
 */

// 导入 vue-types 库中的相关类型和函数
import { VueTypeValidableDef, VueTypesInterface, createTypes, toValidableType } from 'vue-types'
// 导入 Vue 中的 CSSProperties 类型，用于定义 style 属性的类型
import { CSSProperties } from 'vue'

/**
 * 定义一个扩展了 VueTypesInterface 的 PropTypes 类型，添加了一个只读的 style 属性
 */
type PropTypes = VueTypesInterface & {
	readonly style: VueTypeValidableDef<CSSProperties> // style 属性的类型为 VueTypeValidableDef<CSSProperties>
}

/**
 * 使用 createTypes 函数创建一个包含基础类型定义的新 PropTypes 对象
 */
const newPropTypes = createTypes({
	func: undefined, // 函数类型
	bool: undefined, // 布尔类型
	string: undefined, // 字符串类型
	number: undefined, // 数字类型
	object: undefined, // 对象类型
	integer: undefined // 整数类型（虽然 JS 中没有真正的整数类型，但这里可以作为一种约束）
}) as PropTypes // 断言新创建的对象符合我们定义的 PropTypes 类型

/**
 * 定义一个 propTypes 类，继承自新创建的 newPropTypes 对象
 */
class propTypes extends newPropTypes {
	/**
	 * 定义一个静态的 style 方法，用于获取 style 属性的验证类型定义
	 */
	static get style() {
		/**
		 * 使用 toValidableType 函数创建一个可以验证的类型定义，指定其名称为 'style'，并定义其类型为 String 或 Object
		 */
		return toValidableType('style', {
			type: [String, Object] // style 属性可以接受字符串或对象类型的值
		})
	}
}

/**
 * 导出 propTypes 类，以便在其他文件中使用
 */
export { propTypes }
