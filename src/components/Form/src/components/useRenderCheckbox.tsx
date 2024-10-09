/**
 * @file useRenderCheckbox.tsx
 * @description 定义了一个用于渲染复选框选项的自定义钩子函数。
 * @example
 * const { renderCheckboxOptions } = useRenderCheckbox();
 * const checkboxComponents = renderCheckboxOptions(item);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module useRenderCheckbox
 */

// 导入 FormSchema 和 CheckboxGroupComponentProps 类型
import type { FormSchema, CheckboxGroupComponentProps } from '../types'
// 导入组件名称枚举
import { ComponentNameEnum } from '../types'
// 从 Element Plus 库导入复选框和复选框按钮组件
import { ElCheckbox, ElCheckboxButton } from 'element-plus'
// 导入 Vue 的 defineComponent 方法
import { defineComponent } from 'vue'

// 定义 useRenderCheckbox 函数，用于渲染复选框选项
export const useRenderCheckbox = () => {
	/**
	 * 渲染复选框选项
	 * @param item 表单模式 schema
	 * @returns 复选框组件列表
	 */
	const renderCheckboxOptions = (item: FormSchema) => {
		// 如果有别名，就取别名
		const componentProps = item?.componentProps as CheckboxGroupComponentProps
		// 获取值的别名，默认为 'value'
		const valueAlias = componentProps?.props?.value || 'value'
		// 获取标签的别名，默认为 'label'
		const labelAlias = componentProps?.props?.label || 'label'
		// 获取禁用状态的别名，默认为 'disabled'
		const disabledAlias = componentProps?.props?.disabled || 'disabled'
		// 判断组件类型，选择对应的组件
		const Com = (
			item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton
		) as ReturnType<typeof defineComponent>

		// 返回映射后的复选框组件列表
		return componentProps?.options?.map((option) => {
			const { ...other } = option // 复制其他属性
			return (
				// 渲染复选框组件
				<Com
					{...other} // 传递其他属性
					disabled={option[disabledAlias || 'disabled']} // 设置禁用状态
					label={option[labelAlias || 'label']} // 设置标签
					value={option[valueAlias || 'value']} // 设置值
				></Com>
			)
		})
	}

	// 返回渲染复选框选项的函数
	return {
		renderCheckboxOptions
	}
}
