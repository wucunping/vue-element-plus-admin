/**
 * @file index.ts
 * @description 提供表单组件的辅助工具函数
 * @version 1.0.0
 * @date 2024-11-21
 * @module FormHelper
 * @requires '@/hooks/web/useI18n'
 * @requires '../types'
 * @requires 'lodash-es'
 */

// 引入国际化工具
import { useI18n } from '@/hooks/web/useI18n'
// 引入类型定义
import { PlaceholderModel, FormSchema, ComponentNameEnum, ColProps } from '../types'
// 引入工具函数
import { isFunction } from '@/utils/is'
import { firstUpperCase, humpToDash } from '@/utils'
// 引入 lodash 中的 set 和 get 工具
import { set, get } from 'lodash-es'

// 获取国际化翻译函数
const { t } = useI18n()

/**
 * @function setTextPlaceholder
 * @param {FormSchema} schema - 表单组件的数据结构
 * @returns {PlaceholderModel} 返回提示信息对象
 * @description 根据组件类型自动生成 placeholder
 */
export const setTextPlaceholder = (schema: FormSchema): PlaceholderModel => {
  // 定义文本输入类型组件
  const textMap = [
    ComponentNameEnum.INPUT,
    ComponentNameEnum.AUTOCOMPLETE,
    ComponentNameEnum.INPUT_NUMBER,
    ComponentNameEnum.INPUT_PASSWORD
  ]
  // 定义选择类型组件
  const selectMap = [
    ComponentNameEnum.SELECT,
    ComponentNameEnum.TIME_PICKER,
    ComponentNameEnum.DATE_PICKER,
    ComponentNameEnum.TIME_SELECT,
    ComponentNameEnum.SELECT_V2
  ]
  // 为文本类型组件设置 placeholder
  if (textMap.includes(schema?.component as ComponentNameEnum)) {
    return {
      placeholder: t('common.inputText') // 输入提示文本
    }
  }
  // 为选择类型组件设置 placeholder
  if (selectMap.includes(schema?.component as ComponentNameEnum)) {
    const twoTextMap = ['datetimerange', 'daterange', 'monthrange', 'datetimerange', 'daterange']
    if (
      twoTextMap.includes(
        ((schema?.componentProps as any)?.type ||
          (schema?.componentProps as any)?.isRange) as string
      )
    ) {
      return {
        startPlaceholder: t('common.startTimeText'), // 起始时间提示
        endPlaceholder: t('common.endTimeText'), // 结束时间提示
        rangeSeparator: '-' // 范围分隔符
      }
    } else {
      return {
        placeholder: t('common.selectText') // 选择提示文本
      }
    }
  }
  return {}
}

/**
 * @function setGridProp
 * @param {ColProps} col - 栅格属性
 * @returns {ColProps} 返回合并后的栅格属性
 * @description 根据传入的属性，自动设置默认的栅格布局
 */
export const setGridProp = (col: ColProps = {}): ColProps => {
  return {
    ...(col.span
      ? {}
      : {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12 // 默认栅格配置
        }),
    ...col
  }
}

/**
 * @function setComponentProps
 * @param {FormSchema} item - 表单项的组件属性
 * @returns {Recordable} 返回组件的属性
 * @description 自动为组件添加 `clearable` 属性，并处理事件绑定
 */
export const setComponentProps = (item: FormSchema): Recordable => {
  const onEvents = (item?.componentProps as any)?.on || {}
  const newOnEvents: Recordable = {}

  // 自动绑定事件
  for (const key in onEvents) {
    if (onEvents[key]) {
      newOnEvents[`on${firstUpperCase(key)}`] = (...args: any[]) => {
        onEvents[key](...args)
      }
    }
  }

  const componentProps: Recordable = {
    clearable: true, // 默认清除属性
    ...item.componentProps,
    ...newOnEvents
  }

  // 移除多余的属性
  if (componentProps.slots) {
    delete componentProps.slots
  }
  if (componentProps.on) {
    delete componentProps.on
  }

  return componentProps
}

/**
 * @function setItemComponentSlots
 * @param {Recordable} slotsProps - 插槽属性
 * @returns {Recordable} 返回处理后的插槽
 * @description 将驼峰命名的插槽属性转为短横线形式，并绑定插槽
 */
export const setItemComponentSlots = (slotsProps: Recordable = {}): Recordable => {
  const slotObj: Recordable = {}
  for (const key in slotsProps) {
    if (slotsProps[key]) {
      if (isFunction(slotsProps[key])) {
        slotObj[humpToDash(key)] = (...args: any[]) => {
          return slotsProps[key]?.(...args)
        }
      } else {
        slotObj[humpToDash(key)] = () => {
          return slotsProps[key]
        }
      }
    }
  }
  return slotObj
}

/**
 * @function initModel
 * @param {FormSchema[]} schema - 表单结构数组
 * @param {Recordable} formModel - 表单模型
 * @returns {Recordable} 返回初始化后的表单模型
 * @description 根据表单结构数组，初始化表单模型
 */
export const initModel = (schema: FormSchema[], formModel: Recordable): Recordable => {
  const model: Recordable = { ...formModel }

  // 遍历表单结构，初始化模型
  schema.map((v) => {
    if (v.remove) {
      delete model[v.field]
    } else if (v.component !== 'Divider') {
      const hasField = get(model, v.field)
      set(
        model,
        v.field,
        hasField !== void 0 ? get(model, v.field) : v.value !== void 0 ? v.value : undefined
      )
    }
  })

  // 删除模型中不存在的字段
  for (let i = 0; i < schema.length; i++) {
    const key = schema[i].field
    if (!get(model, key) && get(model, key) !== 0) {
      delete model[key]
    }
  }

  return model
}
