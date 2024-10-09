/**
 * @file useRenderRadio.tsx
 * @description 该文件包含用于渲染单选框的组合式函数，支持根据配置动态生成单选框组件。
 * @example
 * const { renderRadioOptions } = useRenderRadio();
 * const radioOptions = renderRadioOptions(formSchemaItem);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module useRenderRadio
 */

// 导入FormSchema和RadioGroupComponentProps类型
import type { FormSchema, RadioGroupComponentProps } from '../types'
// 导入组件名称枚举
import { ComponentNameEnum } from '../types'
// 导入Element Plus中的单选框组件
import { ElRadio, ElRadioButton } from 'element-plus'
// 导入Vue的defineComponent函数
import { defineComponent } from 'vue'

/** 定义一个用于渲染单选框的组合式函数 */
export const useRenderRadio = () => {
	/**
	 * 渲染单选框选项
	 * @param item 表单组件的配置选项
	 * @returns 返回渲染的单选框组件
	 */
	const renderRadioOptions = (item: FormSchema) => {
		// 如果有别名，就取别名
		const componentProps = item?.componentProps as RadioGroupComponentProps
		// 获取值的别名，默认为'value'
		const valueAlias = componentProps?.props?.value || 'value'
		// 获取标签的别名，默认为'label'
		const labelAlias = componentProps?.props?.label || 'label'
		// 获取禁用状态的别名，默认为'disabled'
		const disabledAlias = componentProps?.props?.disabled || 'disabled'
		// 根据组件类型选择相应的组件
		const Com = (
			item.component === ComponentNameEnum.RADIO_GROUP ? ElRadio : ElRadioButton
		) as ReturnType<typeof defineComponent>
		// 返回渲染的单选框选项
		return componentProps?.options?.map((option) => {
			// 解构其他属性
			const { ...other } = option
			// 渲染单选框组件
			return (
				<Com
					{...other} // 传递其他属性
					disabled={option[disabledAlias || 'disabled']} // 设置禁用状态
					label={option[labelAlias || 'label']} // 设置标签
					value={option[valueAlias || 'value']} // 设置值
				></Com>
			)
		})
	}

	// 返回renderRadioOptions函数
	return {
		renderRadioOptions
	}
}
