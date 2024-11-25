/**
 * @file useRenderSelect.tsx
 * @description 提供用于渲染 Select 下拉选项的工具函数
 * @version 1.0.0
 * @date 2024-11-21
 * @module Form
 * @requires 'element-plus'
 * @requires '../types'
 * @export { useRenderSelect }
 */

// 导入所需的 Element Plus 组件
import { ElOption, ElOptionGroup } from 'element-plus'
// 导入类型定义
import { FormSchema, SelectComponentProps, SelectOption } from '../types'

/**
 * 渲染 Select 组件的工具函数
 * @returns {Object} 包含 renderSelectOptions 方法的对象
 */
export const useRenderSelect = () => {
  /**
   * 渲染 Select 的所有选项
   * @param {FormSchema} item - 表单字段配置
   * @returns {JSX.Element[]} 渲染的 JSX 元素数组
   */
  const renderSelectOptions = (item: FormSchema) => {
    // 提取组件的属性配置
    const componentsProps = item?.componentProps as SelectComponentProps
    // 获取自定义分组槽
    const optionGroupDefaultSlot = componentsProps?.slots?.optionGroupDefault
    // 动态别名映射字段
    const labelAlias = componentsProps?.props?.label
    const keyAlias = componentsProps?.props?.key

    // 遍历选项数据生成 JSX 元素
    return componentsProps?.options?.map((option) => {
      // 如果当前选项包含子选项（分组）
      if (option?.options?.length) {
        // 优先渲染自定义分组槽，否则渲染默认的分组选项
        return optionGroupDefaultSlot ? (
          optionGroupDefaultSlot(option)
        ) : (
          <ElOptionGroup label={option[labelAlias || 'label']} key={option[keyAlias || 'key']}>
            {{
              default: () =>
                option?.options?.map((v) => {
                  return renderSelectOptionItem(item, v) // 渲染分组内的选项
                })
            }}
          </ElOptionGroup>
        )
      } else {
        // 如果没有子选项，则直接渲染普通选项
        return renderSelectOptionItem(item, option)
      }
    })
  }

  /**
   * 渲染单个 Select 选项项
   * @param {FormSchema} item - 表单字段配置
   * @param {SelectOption} option - 单个选项数据
   * @returns {JSX.Element} 渲染的 JSX 元素
   */
  const renderSelectOptionItem = (item: FormSchema, option: SelectOption) => {
    // 动态别名映射字段
    const componentsProps = item.componentProps as SelectComponentProps
    const labelAlias = componentsProps?.props?.label
    const valueAlias = componentsProps?.props?.value
    const keyAlias = componentsProps?.props?.key
    const optionDefaultSlot = componentsProps.slots?.optionDefault

    // 渲染单个选项，支持自定义插槽
    return (
      <ElOption
        {...option} // 其他属性
        key={option[keyAlias || 'key']} // 动态 key 属性
        label={option[labelAlias || 'label']} // 动态 label 属性
        value={option[valueAlias || 'value']} // 动态 value 属性
      >
        {{
          default: () => (optionDefaultSlot ? optionDefaultSlot(option) : undefined) // 自定义内容插槽
        }}
      </ElOption>
    )
  }

  // 返回工具函数
  return {
    renderSelectOptions
  }
}
