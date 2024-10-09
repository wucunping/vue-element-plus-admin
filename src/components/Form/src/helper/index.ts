/**
 * @file index.ts
 * @description 该文件包含表单组件的工具函数，用于设置占位符、栅格属性、组件属性和初始化表单模型等功能。
 * @example
 * // 使用 setTextPlaceholder 设置文本输入框占位符
 * const placeholder = setTextPlaceholder(schema);
 *
 * // 使用 setGridProp 设置栅格属性
 * const gridProps = setGridProp(col);
 *
 * // 使用 initModel 初始化表单模型
 * const formModel = initModel(schema, existingModel);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module FormUtility
 */

// 导入 useI18n 钩子函数，用于国际化
import { useI18n } from '@/hooks/web/useI18n'

// 导入类型 PlaceholderModel、FormSchema 和 ColProps
import type { PlaceholderModel, FormSchema, ColProps } from '../types'

// 导入组件名称枚举
import { ComponentNameEnum } from '../types'

// 导入工具函数 isFunction
import { isFunction } from '@/utils/is'

// 导入工具函数 firstUpperCase 和 humpToDash
import { firstUpperCase, humpToDash } from '@/utils'

// 导入 lodash-es 库中的 set 和 get 函数
import { set, get } from 'lodash-es'

// 获取国际化函数 t
const { t } = useI18n()

/**
 * 设置文本输入框的占位符
 * @param schema 对应组件数据
 * @returns 返回提示信息对象
 * @description 用于自动设置 placeholder
 */
export const setTextPlaceholder = (schema: FormSchema): PlaceholderModel => {
	// 定义文本组件类型数组
	const textMap = [
		ComponentNameEnum.INPUT,
		ComponentNameEnum.AUTOCOMPLETE,
		ComponentNameEnum.INPUT_NUMBER,
		ComponentNameEnum.INPUT_PASSWORD
	]

	// 定义选择组件类型数组
	const selectMap = [
		ComponentNameEnum.SELECT,
		ComponentNameEnum.TIME_PICKER,
		ComponentNameEnum.DATE_PICKER,
		ComponentNameEnum.TIME_SELECT,
		ComponentNameEnum.SELECT_V2
	]

	// 如果当前组件为文本组件
	if (textMap.includes(schema?.component as ComponentNameEnum)) {
		return {
			placeholder: t('common.inputText') // 返回文本输入框占位符
		}
	}

	// 如果当前组件为选择组件
	if (selectMap.includes(schema?.component as ComponentNameEnum)) {
		// 一些范围选择器
		const twoTextMap = ['datetimerange', 'daterange', 'monthrange', 'datetimerange', 'daterange']
		// 判断组件是否为范围选择器
		if (
			twoTextMap.includes(
				((schema?.componentProps as any)?.type ||
					(schema?.componentProps as any)?.isRange) as string
			)
		) {
			return {
				startPlaceholder: t('common.startTimeText'), // 返回开始时间的占位符
				endPlaceholder: t('common.endTimeText'), // 返回结束时间的占位符
				rangeSeparator: '-' // 返回范围分隔符
			}
		} else {
			return {
				placeholder: t('common.selectText') // 返回选择框的占位符
			}
		}
	}
	return {} // 如果没有符合条件则返回空对象
}

/**
 * 设置栅格属性
 * @param col 内置栅格
 * @returns 返回合并后的栅格属性
 * @description 合并传入进来的栅格属性
 */
export const setGridProp = (col: ColProps = {}): ColProps => {
	// 定义栅格属性
	const colProps: ColProps = {
		// 如果有 span，代表用户优先级更高，所以不需要默认栅格
		...(col.span
			? {}
			: {
					xs: 24, // 手机屏幕
					sm: 12, // 平板屏幕
					md: 12, // 小型桌面屏幕
					lg: 12, // 大型桌面屏幕
					xl: 12 // 超大型桌面屏幕
				}),
		...col // 合并传入的栅格属性
	}
	return colProps // 返回合并后的栅格属性
}

/**
 * 设置组件属性
 * @param item 传入的组件属性
 * @returns 返回处理后的组件属性
 * @description 默认添加 clearable 属性
 */
export const setComponentProps = (item: FormSchema): Recordable => {
	// const notNeedClearable = ['ColorPicker'] // 不需要添加清除功能的组件
	// 拆分事件并组合
	const onEvents = (item?.componentProps as any)?.on || {} // 获取事件属性
	const newOnEvents: Recordable = {} // 新的事件对象

	// 遍历事件对象并转换为新的事件对象
	for (const key in onEvents) {
		if (onEvents[key]) {
			newOnEvents[`on${firstUpperCase(key)}`] = (...args: any[]) => {
				onEvents[key](...args) // 调用原事件
			}
		}
	}

	const componentProps: Recordable = {
		clearable: true, // 默认添加可清除属性
		...item.componentProps, // 合并原组件属性
		...newOnEvents // 合并新的事件属性
	}
	// 需要删除不必要的属性
	if (componentProps.slots) {
		delete componentProps.slots // 删除插槽属性
	}
	if (componentProps.on) {
		delete componentProps.on // 删除事件属性
	}
	return componentProps // 返回处理后的组件属性
}

/**
 * 设置组件插槽
 * @param slotsProps 插槽属性
 * @returns 返回处理后的插槽对象
 */
export const setItemComponentSlots = (slotsProps: Recordable = {}): Recordable => {
	const slotObj: Recordable = {} // 定义插槽对象
	// 遍历插槽属性
	for (const key in slotsProps) {
		if (slotsProps[key]) {
			if (isFunction(slotsProps[key])) {
				// 如果插槽属性是函数
				slotObj[humpToDash(key)] = (...args: any[]) => {
					return slotsProps[key]?.(...args) // 调用插槽函数并返回结果
				}
			} else {
				// 如果插槽属性不是函数
				slotObj[humpToDash(key)] = () => {
					return slotsProps[key] // 返回插槽值
				}
			}
		}
	}
	return slotObj // 返回处理后的插槽对象
}

/**
 * 初始化表单模型
 * @param schema Form表单结构化数组
 * @param formModel FormMoel
 * @returns 返回初始化后的 FormMoel
 * @description 生成对应的 formModel
 */
export const initModel = (schema: FormSchema[], formModel: Recordable) => {
	const model: Recordable = { ...formModel } // 浅拷贝 formModel
	// 遍历 schema 数组
	schema.map((v) => {
		if (v.remove) {
			delete model[v.field] // 如果组件需要删除，则移除对应字段
		} else if (v.component !== 'Divider') {
			const hasField = get(model, v.field) // 获取键值
			// 如果先前已经有值存在，则不进行重新赋值，而是采用现有的值
			set(
				model,
				v.field,
				hasField !== void 0 ? get(model, v.field) : v.value !== void 0 ? v.value : undefined
			) // 赋值逻辑
		}
	})
	// 如果 schema 对应的 field 不存在，则删除 model 中的对应的 field
	for (let i = 0; i < schema.length; i++) {
		const key = schema[i].field // 获取当前字段
		if (!get(model, key) && get(model, key) !== 0) {
			delete model[key] // 如果不存在，则移除
		}
	}
	return model // 返回初始化后的模型
}
