/**
 * @file useRenderRadio.tsx
 * @description 提供用于渲染表单中 Radio 组件的工具函数
 * @version 1.0.0
 * @date 2024-11-21
 * @module Form
 * @requires '../types'
 * @requires 'element-plus'
 * @requires 'vue'
 * @export { useRenderRadio }
 */

// 导入类型定义和组件
import { FormSchema, ComponentNameEnum, RadioGroupComponentProps } from '../types' // 表单类型定义
import { ElRadio, ElRadioButton } from 'element-plus' // Element Plus 单选框组件
import { defineComponent } from 'vue' // Vue 组合式 API 工具

/**
 * 渲染单选框选项的工具函数
 * @returns {Object} 包含 renderRadioOptions 方法的对象
 */
export const useRenderRadio = () => {
  /**
   * 渲染 Radio 或 RadioButton 组件的选项
   * @param {FormSchema} item - 表单字段配置
   * @returns {JSX.Element[]} 渲染的 JSX 元素数组
   */
  const renderRadioOptions = (item: FormSchema) => {
    // 获取组件的属性配置
    const componentProps = item?.componentProps as RadioGroupComponentProps

    /** 动态值的映射字段 */
    const valueAlias = componentProps?.props?.value || 'value'
    /** 动态标签的映射字段 */
    const labelAlias = componentProps?.props?.label || 'label'
    /** 动态禁用的映射字段 */
    const disabledAlias = componentProps?.props?.disabled || 'disabled'

    // 确定要渲染的组件类型（单选框或按钮单选框）
    const Com = (
      item.component === ComponentNameEnum.RADIO_GROUP ? ElRadio : ElRadioButton
    ) as ReturnType<typeof defineComponent>

    // 遍历选项数组生成对应的组件元素
    return componentProps?.options?.map((option) => {
      const { ...other } = option // 解构选项对象以提取剩余属性
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
    renderRadioOptions
  }
}
