/**
 * @file useRenderCheckbox.tsx
 * @description 提供用于渲染表单中 Checkbox 组件的函数
 * @version 1.0.0
 * @date 2024-11-21
 * @module Form
 * @requires '../types'
 * @requires 'element-plus'
 * @requires 'vue'
 * @export { useRenderCheckbox }
 */

// 导入相关类型和组件
import { FormSchema, ComponentNameEnum, CheckboxGroupComponentProps } from '../types' // 表单类型定义
import { ElCheckbox, ElCheckboxButton } from 'element-plus' // Element Plus 复选框组件
import { defineComponent } from 'vue' // Vue 组合式 API 工具

/**
 * 渲染复选框选项的工具函数
 * @returns {Object} 包含 renderCheckboxOptions 方法的对象
 */
export const useRenderCheckbox = () => {
  /**
   * 渲染 Checkbox 或 CheckboxButton 组件的选项
   * @param {FormSchema} item - 表单字段配置
   * @returns {JSX.Element[]} 渲染的 JSX 元素数组
   */
  const renderCheckboxOptions = (item: FormSchema) => {
    // 获取组件属性配置
    const componentProps = item?.componentProps as CheckboxGroupComponentProps

    /** 值的别名，用于支持动态字段映射 */
    const valueAlias = componentProps?.props?.value || 'value'
    /** 标签的别名 */
    const labelAlias = componentProps?.props?.label || 'label'
    /** 是否禁用的别名 */
    const disabledAlias = componentProps?.props?.disabled || 'disabled'

    // 确定渲染的组件类型
    const Com = (
      item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton
    ) as ReturnType<typeof defineComponent>

    // 遍历选项并生成组件数组
    return componentProps?.options?.map((option) => {
      const { ...other } = option // 复制选项对象
      return (
        <Com
          {...other} // 其他属性
          disabled={option[disabledAlias || 'disabled']} // 动态禁用属性
          label={option[labelAlias || 'label']} // 动态标签属性
          value={option[valueAlias || 'value']} // 动态值属性
        ></Com>
      )
    })
  }

  // 返回工具函数
  return {
    renderCheckboxOptions
  }
}
