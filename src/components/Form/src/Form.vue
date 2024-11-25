<script lang="tsx">
/**
 * @file Form.vue
 * @description 表单组件，支持动态渲染表单布局与元素，提供丰富的功能扩展和自定义能力
 * @example 用法示例请参考项目文档
 * @version 1.0.0
 * @date 2024-11-22
 * @module Form
 * @requires 'vue' 提供 Vue.js 的核心功能
 * @requires 'element-plus' 使用 Element Plus 组件库
 * @requires '@/utils/tsxHelper' 提供 TypeScript 和 JSX 的辅助工具
 * @requires './helper' 包含表单组件的辅助工具函数
 * @requires './helper/componentMap' 提供表单组件的映射
 * @requires './components/useRenderSelect' 渲染 Select 组件选项的逻辑
 * @requires './components/useRenderRadio' 渲染 Radio 组件选项的逻辑
 * @requires './components/useRenderCheckbox' 渲染 Checkbox 组件选项的逻辑
 * @requires '@/hooks/web/useDesign' 提供设计相关的全局逻辑
 * @requires '@/utils' 包含通用的工具函数
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Vue 的核心功能
import { PropType, defineComponent, ref, computed, unref, watch, onMounted } from 'vue'

// 从 Element Plus 导入表单组件相关的模块
import {
  ElForm, // 表单组件
  ElFormItem, // 表单项组件
  ElRow, // 栅格布局行
  ElCol, // 栅格布局列
  FormRules, // 表单验证规则类型
  ComponentSize // 组件大小类型
  // FormItemProp // 表单项属性类型（暂未使用）
} from 'element-plus'

// 导入表单组件的映射配置，用于动态渲染表单
import { componentMap } from './helper/componentMap'

// 导入工具函数类型定义，用于校验和默认值设置
import { propTypes } from '@/utils/propTypes'

// 导入帮助处理插槽内容的工具函数
import { getSlot } from '@/utils/tsxHelper'

// 导入表单相关的辅助函数
import {
  setTextPlaceholder, // 设置占位符文本
  setGridProp, // 设置栅格布局属性
  setComponentProps, // 设置组件的自定义属性
  setItemComponentSlots, // 设置组件插槽
  initModel // 初始化表单模型
} from './helper'

// 导入渲染不同表单组件的逻辑
import { useRenderSelect } from './components/useRenderSelect' // 渲染 Select 组件的逻辑
import { useRenderRadio } from './components/useRenderRadio' // 渲染 Radio 组件的逻辑
import { useRenderCheckbox } from './components/useRenderCheckbox' // 渲染 Checkbox 组件的逻辑

// 导入设计相关的全局逻辑
import { useDesign } from '@/hooks/web/useDesign'

// 导入工具函数，用于对象操作
import { findIndex } from '@/utils' // 查找数组中符合条件的索引
import { get, set } from 'lodash-es' // Lodash 的 `get` 和 `set` 方法，用于深层次对象操作

// 导入表单组件的类型定义
import { FormProps } from './types' // 表单组件的属性类型
import {
  FormSchema, // 表单结构类型
  FormSetProps, // 表单设置类型
  ComponentNameEnum, // 组件名称枚举类型
  SelectComponentProps, // Select 组件的属性类型
  RadioGroupComponentProps, // RadioGroup 组件的属性类型
  CheckboxGroupComponentProps // CheckboxGroup 组件的属性类型
} from './types'

// 使用渲染逻辑函数提取不同组件的渲染逻辑
const { renderSelectOptions } = useRenderSelect() // 提取渲染 Select 组件选项的逻辑
const { renderRadioOptions } = useRenderRadio() // 提取渲染 Radio 组件选项的逻辑
const { renderCheckboxOptions } = useRenderCheckbox() // 提取渲染 Checkbox 组件选项的逻辑

// 获取全局的样式前缀
const { getPrefixCls } = useDesign()

// 定义当前组件的样式前缀
const prefixCls = getPrefixCls('form') // 表单组件的样式前缀

export default defineComponent({
  /** 组件名称 */
  name: 'Form',
  /** 组件的 props 定义 */
  props: {
    /** 表单布局结构数组 */
    schema: {
      type: Array as PropType<FormSchema[]>, // 表单结构类型的数组
      default: () => [] // 默认值为空数组
    },
    /** 是否需要栅格布局 */
    isCol: propTypes.bool.def(true), // 默认开启栅格布局
    /** 表单数据对象 */
    model: {
      type: Object as PropType<any>, // 任意类型的对象
      default: () => ({}) // 默认值为空对象
    },
    /** 是否自动设置占位符 */
    autoSetPlaceholder: propTypes.bool.def(true), // 默认开启占位符自动设置
    /** 是否使用自定义内容 */
    isCustom: propTypes.bool.def(false), // 默认不启用自定义内容
    /** 表单 label 的宽度 */
    labelWidth: propTypes.oneOfType([String, Number]).def('auto'), // 默认自动宽度
    /** 表单验证规则 */
    rules: {
      type: Object as PropType<FormRules>, // 表单验证规则对象
      default: () => ({}) // 默认值为空对象
    },
    /** label 的位置 */
    labelPosition: propTypes.oneOf(['left', 'right', 'top']).def('right'), // 默认右对齐
    /** label 的后缀 */
    labelSuffix: propTypes.string.def(''), // 默认无后缀
    /** 是否隐藏必填项的星号 */
    hideRequiredAsterisk: propTypes.bool.def(false), // 默认不隐藏
    /** 必填项星号的位置 */
    requireAsteriskPosition: propTypes.oneOf(['left', 'right']).def('left'), // 默认在左侧
    /** 是否显示校验信息 */
    showMessage: propTypes.bool.def(true), // 默认显示
    /** 是否以行内形式展示校验信息 */
    inlineMessage: propTypes.bool.def(false), // 默认不启用行内形式
    /** 是否显示校验状态图标 */
    statusIcon: propTypes.bool.def(false), // 默认不显示
    /** 校验规则变化时是否触发校验 */
    validateOnRuleChange: propTypes.bool.def(true), // 默认触发校验
    /** 组件尺寸 */
    size: {
      type: String as PropType<ComponentSize>, // 尺寸类型
      default: undefined // 默认无设置
    },
    /** 表单是否禁用 */
    disabled: propTypes.bool.def(false), // 默认不禁用
    /** 是否滚动到错误位置 */
    scrollToError: propTypes.bool.def(false), // 默认不滚动
    /** 滚动到错误的偏移量 */
    scrollToErrorOffset: propTypes.oneOfType([Boolean, Object]).def(undefined) // 默认无偏移
  },
  /** 组件事件定义 */
  emits: ['register'],
  /** 组件 setup 方法 */
  setup(props, { slots, expose, emit }) {
    /** 表单组件实例 */
    const elFormRef = ref<ComponentRef<typeof ElForm>>() // 存储表单的实例

    /** 合并后的 props */
    const mergeProps = ref<FormProps>({}) // 存储合并后的属性

    /** 获取当前的 props */
    const getProps = computed(() => {
      const propsObj = { ...props } // 解构 props
      Object.assign(propsObj, unref(mergeProps)) // 合并 props
      return propsObj
    })

    /** 表单组件实例映射 */
    const formComponents = ref({}) // 存储表单组件实例

    /** 表单项组件实例映射 */
    const formItemComponents = ref({}) // 存储表单项组件实例

    /** 表单数据 */
    const formModel = ref<Recordable>(props.model) // 初始化表单数据模型

    /** 组件挂载完成后触发 */
    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef)) // 发出注册事件
    })

    /** 设置表单值 */
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data) // 合并表单数据
    }

    /** 设置 props */
    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props) // 合并传入的属性
    }

    /** 删除表单项的 schema */
    const delSchema = (field: string) => {
      const { schema } = unref(getProps) // 获取 schema 数组
      const index = findIndex(schema, (v: FormSchema) => v.field === field) // 找到需要删除的索引
      if (index > -1) {
        schema.splice(index, 1) // 从数组中移除
      }
    }

    /** 添加表单项的 schema */
    const addSchema = (formSchema: FormSchema, index?: number) => {
      const { schema } = unref(getProps) // 获取 schema 数组
      if (index !== void 0) {
        schema.splice(index, 0, formSchema) // 在指定位置插入
        return
      }
      schema.push(formSchema) // 在末尾追加
    }

    /** 更新表单 schema 的值 */
    const setSchema = (schemaProps: FormSetProps[]) => {
      const { schema } = unref(getProps) // 获取 schema 数组
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value) // 更新对应的值
          }
        }
      }
    }

    /** 异步获取选项 */
    const getOptions = async (fn: Function, item: FormSchema) => {
      const options = await fn() // 调用异步函数获取选项
      setSchema([
        {
          field: item.field,
          path:
            item.component === ComponentNameEnum.TREE_SELECT ||
            item.component === ComponentNameEnum.TRANSFER
              ? 'componentProps.data' // 如果是树选择或穿梭框组件，更新 data
              : 'componentProps.options', // 否则更新 options
          value: options // 设置选项值
        }
      ])
    }

    /**
     * @description: 获取表单组件实例
     * @param filed 表单字段
     */
    const getComponentExpose = (filed: string) => {
      return unref(formComponents)[filed]
    }

    /**
     * @description: 获取formItem实例
     * @param filed 表单字段
     */
    const getFormItemExpose = (filed: string) => {
      return unref(formItemComponents)[filed]
    }

    /** 将组件实例存储到 formComponents 的引用映射 */
    const setComponentRefMap = (ref: any, filed: string) => {
      formComponents.value[filed] = ref // 保存组件引用
    }

    /** 将组件实例存储到 formItemComponents 的引用映射 */
    const setFormItemRefMap = (ref: any, filed: string) => {
      formItemComponents.value[filed] = ref // 保存表单项组件引用
    }

    /** 暴露方法供父组件调用 */
    expose({
      setValues, // 设置表单值
      formModel, // 表单数据模型
      setProps, // 设置组件属性
      delSchema, // 删除表单项 schema
      addSchema, // 添加表单项 schema
      setSchema, // 更新表单 schema 的值
      getComponentExpose, // 获取表单组件实例
      getFormItemExpose // 获取表单项实例
    })

    /** 监听表单 schema 的变化，重新生成 formModel */
    watch(
      () => unref(getProps).schema, // 监听 schema 属性
      (schema = []) => {
        formModel.value = initModel(schema, unref(formModel)) // 重新初始化表单模型
      },
      {
        immediate: true, // 立即执行一次回调
        deep: true // 深度监听对象属性变化
      }
    )

    /** 渲染表单包裹标签 */
    const renderWrap = () => {
      const { isCol } = unref(getProps) // 获取是否栅格布局的配置
      const content = isCol ? (
        <ElRow gutter={20}>{renderFormItemWrap()}</ElRow> // 使用栅格布局
      ) : (
        renderFormItemWrap() // 非栅格布局
      )
      return content
    }

    /** 渲染表单项是否需要栅格布局 */
    const renderFormItemWrap = () => {
      const { schema = [], isCol } = unref(getProps) // 获取 schema 和布局配置

      return schema
        .filter((v) => !v.remove) // 过滤掉被移除的项
        .map((item) => {
          // 判断是否为分割线组件
          const isDivider = item.component === 'Divider'
          const Com = componentMap['Divider'] as ReturnType<typeof defineComponent>
          return isDivider ? (
            <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com> // 渲染分割线
          ) : isCol ? (
            <ElCol {...setGridProp(item.colProps)}>{renderFormItem(item)}</ElCol> // 渲染栅格布局
          ) : (
            renderFormItem(item) // 渲染普通表单项
          )
        })
    }

    /** 渲染单个表单项 */
    const renderFormItem = (item: FormSchema) => {
      // 如果存在 optionApi，优先加载选项数据
      if (
        item.optionApi &&
        (!item.componentProps?.options || !item.componentProps?.options.length)
      ) {
        getOptions(item.optionApi, item) // 异步加载选项
      }

      /** 定义表单项的插槽 */
      const formItemSlots: Recordable = {
        default: () => {
          if (item?.formItemProps?.slots?.default) {
            return item?.formItemProps?.slots?.default(formModel.value) // 渲染默认插槽
          } else {
            const Com = componentMap[item.component as string] as ReturnType<typeof defineComponent>

            const { autoSetPlaceholder } = unref(getProps) // 获取是否自动设置占位符

            const componentSlots = (item?.componentProps as any)?.slots || {} // 获取组件自定义插槽
            const slotsMap: Recordable = {
              ...setItemComponentSlots(componentSlots) // 设置组件插槽
            }

            // 针对下拉选择组件，渲染选项
            if (item.component === ComponentNameEnum.SELECT) {
              slotsMap.default = !componentSlots.default
                ? () => renderSelectOptions(item) // 渲染默认选项
                : () =>
                    componentSlots.default(
                      unref((item?.componentProps as SelectComponentProps)?.options)
                    )
            }

            // 针对虚拟滚动选择器的插槽
            if (item.component === ComponentNameEnum.SELECT_V2 && componentSlots.default) {
              slotsMap.default = ({ item }) => {
                return componentSlots.default(item)
              }
            }

            // 针对单选组和单选按钮的插槽
            if (
              item.component === ComponentNameEnum.RADIO_GROUP ||
              item.component === ComponentNameEnum.RADIO_BUTTON
            ) {
              slotsMap.default = !componentSlots.default
                ? () => renderRadioOptions(item) // 渲染默认单选选项
                : () =>
                    componentSlots.default(
                      unref((item?.componentProps as RadioGroupComponentProps)?.options)
                    )
            }

            // 针对多选组和多选按钮的插槽
            if (
              item.component === ComponentNameEnum.CHECKBOX_GROUP ||
              item.component === ComponentNameEnum.CHECKBOX_BUTTON
            ) {
              slotsMap.default = !componentSlots.default
                ? () => renderCheckboxOptions(item) // 渲染默认多选选项
                : () =>
                    componentSlots.default(
                      unref((item?.componentProps as CheckboxGroupComponentProps)?.options)
                    )
            }

            // 定义具体组件的渲染逻辑
            const Comp = () => {
              const itemVal = computed({
                get: () => get(formModel.value, item.field), // 从表单模型中获取值
                set: (val) => set(formModel.value, item.field, val) // 设置值到表单模型
              })

              return item.component === ComponentNameEnum.UPLOAD ? (
                <Com
                  vModel:file-list={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={item.componentProps?.style || { width: '100%' }}
                >
                  {{ ...slotsMap }}
                </Com>
              ) : (
                <Com
                  vModel={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={item.componentProps?.style || { width: '100%' }}
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }

            return <>{Comp()}</>
          }
        }
      }

      // 渲染表单项的 label 插槽
      if (item?.formItemProps?.slots?.label) {
        formItemSlots.label = (...args: any[]) =>
          (item?.formItemProps?.slots as any)?.label(...args)
      }

      // 渲染表单项的错误提示插槽
      if (item?.formItemProps?.slots?.error) {
        formItemSlots.error = (...args: any[]) =>
          (item?.formItemProps?.slots as any)?.error(...args)
      }

      return (
        <ElFormItem
          v-show={!item.hidden} // 是否显示表单项
          ref={(el: any) => setFormItemRefMap(el, item.field)} // 设置引用
          {...(item.formItemProps || {})} // 表单项的属性
          prop={item.field} // 表单项的字段名
          label={item.label || ''} // 表单项的标签
        >
          {formItemSlots} {/* 渲染表单项插槽 */}
        </ElFormItem>
      )
    }

    // 过滤传入Form组件的属性
    const getFormBindValue = () => {
      // 避免在标签上出现多余的属性
      const delKeys = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model']
      const props = { ...unref(getProps) }
      for (const key in props) {
        if (delKeys.indexOf(key) !== -1) {
          delete props[key]
        }
      }
      return props as FormProps
    }

    return () => (
      <ElForm
        ref={elFormRef}
        {...getFormBindValue()}
        model={unref(getProps).isCustom ? unref(getProps).model : formModel}
        class={prefixCls}
        // @ts-ignore
        onSubmit={(e: Event) => {
          e.preventDefault()
        }}
      >
        {{
          // 如果需要自定义，就什么都不渲染，而是提供默认插槽
          default: () => {
            const { isCustom } = unref(getProps)
            return isCustom ? getSlot(slots, 'default') : renderWrap()
          }
        }}
      </ElForm>
    )
  }
})
</script>

<style lang="less" scoped>
/** 
 * 定义表单容器的全局样式，适用于特定的命名空间组合
 * 确保表单行两边无边距 
 */
.@{elNamespace}-form.@{adminNamespace}-form .@{elNamespace}-row {
  margin-right: 0 !important; // 去除右边距
  margin-left: 0 !important; // 去除左边距
}

/** 
 * 定义内联表单模式下的样式规则
 * 主要调整内容宽度及兼容性
 */
.@{elNamespace}-form--inline {
  /** 深度选择器，用于调整表单项内容的宽度 */
  :deep(.el-form-item__content) {
    /** 
     * 表单项第一个子元素的最小宽度 
     * 确保内联布局的一致性
     */
    & > :first-child {
      min-width: 229.5px;
    }
  }

  /** 
   * 针对数字输入框的特殊处理
   * 设置最小宽度以保持表单布局稳定
   */
  .@{elNamespace}-input-number {
    // 229.5px是兼容el-input-number的最小宽度
    min-width: 229.5px;
  }
}
</style>
