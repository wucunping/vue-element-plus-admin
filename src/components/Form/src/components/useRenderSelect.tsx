/**
 * @file useRenderSelect.tsx
 * @description 该文件包含用于渲染选择框的组合式函数，支持根据配置动态生成选择框组件和选项。
 * @example
 * const { renderSelectOptions } = useRenderSelect();
 * const selectOptions = renderSelectOptions(formSchemaItem);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module useRenderSelect
 */

// 导入Element Plus中的选项和选项组组件
import { ElOption, ElOptionGroup } from 'element-plus'
// 导入FormSchema、SelectComponentProps和SelectOption类型
import type { FormSchema, SelectComponentProps, SelectOption } from '../types'

/** 定义一个用于渲染选择框的组合式函数 */
export const useRenderSelect = () => {
	/**
	 * 渲染选择框选项
	 * @param item 表单组件的配置选项
	 * @returns 返回渲染的选择框组件
	 */
	const renderSelectOptions = (item: FormSchema) => {
		const componentsProps = item?.componentProps as SelectComponentProps
		const optionGroupDefaultSlot = componentsProps?.slots?.optionGroupDefault
		// 如果有别名，就取别名
		const labelAlias = componentsProps?.props?.label
		const keyAlias = componentsProps?.props?.key
		// 遍历选项并渲染
		return componentsProps?.options?.map((option) => {
			// 如果选项有子选项
			if (option?.options?.length) {
				return optionGroupDefaultSlot ? (
					optionGroupDefaultSlot(option) // 使用自定义选项组插槽
				) : (
					<ElOptionGroup label={option[labelAlias || 'label']} key={option[keyAlias || 'key']}>
						{{
							default: () =>
								option?.options?.map((v) => {
									return renderSelectOptionItem(item, v) // 渲染子选项
								})
						}}
					</ElOptionGroup>
				)
			} else {
				return renderSelectOptionItem(item, option) // 渲染单个选项
			}
		})
	}

	/**
	 * 渲染选择框选项项
	 * @param item 表单组件的配置选项
	 * @param option 单个选择项的配置
	 * @returns 返回渲染的选择项组件
	 */
	const renderSelectOptionItem = (item: FormSchema, option: SelectOption) => {
		// 如果有别名，就取别名
		const componentsProps = item.componentProps as SelectComponentProps
		const labelAlias = componentsProps?.props?.label
		const valueAlias = componentsProps?.props?.value
		const keyAlias = componentsProps?.props?.key
		const optionDefaultSlot = componentsProps.slots?.optionDefault

		// 渲染选择项组件
		return (
			<ElOption
				{...option}
				key={option[keyAlias || 'key']}
				label={option[labelAlias || 'label']}
				value={option[valueAlias || 'value']}
			>
				{{
					default: () => (optionDefaultSlot ? optionDefaultSlot(option) : undefined)
				}}
			</ElOption>
		)
	}

	// 返回renderSelectOptions函数
	return {
		renderSelectOptions
	}
}
