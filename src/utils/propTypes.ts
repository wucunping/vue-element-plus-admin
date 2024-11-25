/**
 * @file propTypes.ts
 * @description 定义 Vue 属性类型工具，扩展支持 CSSProperties 类型的校验。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module PropTypes
 */

/**
 * 从 vue-types 库导入工具函数和接口
 */
import { VueTypeValidableDef, VueTypesInterface, createTypes, toValidableType } from 'vue-types'
/**
 * 导入 Vue 中的 CSSProperties 类型
 */
import { CSSProperties } from 'vue'

/**
 * 扩展 VueTypesInterface，新增 style 属性类型
 */
type PropTypes = VueTypesInterface & {
  /** CSS 样式属性类型 */
  readonly style: VueTypeValidableDef<CSSProperties>
}

/**
 * 创建一个新的类型集合，用于定义属性类型
 */
const newPropTypes = createTypes({
  /** 函数类型 */
  func: undefined,
  /** 布尔类型 */
  bool: undefined,
  /** 字符串类型 */
  string: undefined,
  /** 数字类型 */
  number: undefined,
  /** 对象类型 */
  object: undefined,
  /** 整数类型 */
  integer: undefined
}) as PropTypes // 将类型断言为扩展后的 PropTypes

/**
 * 自定义的属性类型类，继承自 newPropTypes
 */
class propTypes extends newPropTypes {
  /**
   * 新增对 style 类型的支持，允许字符串或对象类型
   */
  static get style() {
    return toValidableType('style', {
      type: [String, Object] // 支持 String 或 Object 类型
    })
  }
}

/**
 * 导出 propTypes 类，用于组件中定义属性类型
 */
export { propTypes }
