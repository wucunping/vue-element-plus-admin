<script setup lang="tsx">
/**
 * @file /src/components/Search/src/Search.vue
 * @description 搜索组件，用于动态生成搜索表单，支持搜索、重置、展开等功能
 * @example 使用方式：
 * <Search
 *   :schema="formSchema"
 *   :model="formData"
 *   layout="inline"
 *   @search="onSearch"
 *   @reset="onReset"
 *   @expand="onExpand"
 * />
 * @version 1.0.0
 * @date 2024-11-22
 * @module SearchComponentModule
 * @exports SearchComponent
 * @see /src/components/Form
 * @see /src/components/Search/src/components/ActionButton.vue
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入表单组件和相关类型
import { Form, FormSchema, FormSetProps } from '@/components/Form'

// 引入 Vue 核心工具
import { PropType, computed, unref, ref, watch, onMounted } from 'vue'

// 引入 propTypes 工具，用于定义组件属性
import { propTypes } from '@/utils/propTypes'

// 引入 useForm，提供表单操作方法
import { useForm } from '@/hooks/web/useForm'

// 引入工具函数，findIndex 用于查找索引
import { findIndex } from '@/utils'

// 引入 lodash-es 的深拷贝和设置工具
import { cloneDeep, set } from 'lodash-es'

// 引入初始化表单模型的帮助方法
import { initModel } from '@/components/Form/src/helper'

// 引入操作按钮组件
import ActionButton from './components/ActionButton.vue'

// 引入搜索组件的属性类型
import { SearchProps } from './types'

// 引入表单项类型
import { FormItemProp } from 'element-plus'

// 引入工具函数，用于判断值是否为空或是否为对象
import { isObject, isEmptyVal } from '@/utils/is'

// 定义组件的属性
const props = defineProps({
  schema: {
    type: Array as PropType<FormSchema[]>, // 定义 schema 属性类型为 FormSchema 数组
    default: () => [] // 默认值为空数组
  },
  isCol: propTypes.bool.def(false), // 是否使用栅格布局，默认值为 false
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'), // 标签宽度，默认值为 'auto'
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'), // 表单布局方式
  buttonPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('center'), // 按钮位置
  showSearch: propTypes.bool.def(true), // 是否显示搜索按钮
  showReset: propTypes.bool.def(true), // 是否显示重置按钮
  showExpand: propTypes.bool.def(false), // 是否显示展开按钮
  expandField: propTypes.string.def(''), // 展开按钮的字段名称
  inline: propTypes.bool.def(true), // 是否使用行内布局
  removeNoValueItem: propTypes.bool.def(true), // 是否移除空值字段
  model: {
    type: Object as PropType<Recordable>, // 定义模型数据的类型
    default: () => ({}) // 默认值为空对象
  },
  searchLoading: propTypes.bool.def(false), // 搜索按钮加载状态，默认值为 false
  resetLoading: propTypes.bool.def(false) // 重置按钮加载状态，默认值为 false
})

// 定义组件的事件
const emit = defineEmits(['search', 'reset', 'register', 'validate']) // 包括搜索、重置、注册、验证事件

// 定义展开状态，初始值为 true
const visible = ref(true)

// 表单模型，绑定 props.model 的值
const formModel = ref<Recordable>(props.model)

// 定义动态生成的表单结构
const newSchema = computed(() => {
  const propsComputed = unref(getProps) // 获取计算属性的值
  let schema: FormSchema[] = cloneDeep(propsComputed.schema) // 深拷贝 schema

  // 如果展开按钮显示且未展开，则隐藏部分字段
  if (propsComputed.showExpand && propsComputed.expandField && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === propsComputed.expandField) // 查找展开字段的索引
    schema.map((v, i) => {
      v.hidden = i >= index // 隐藏展开字段之后的字段
      return v
    })
  }

  // 如果是行内布局，添加操作按钮
  if (propsComputed.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'action', // 操作按钮字段
        formItemProps: {
          labelWidth: '0px', // 标签宽度为 0
          slots: {
            default: () => (
              <div>
                <ActionButton
                  showSearch={propsComputed.showSearch} // 是否显示搜索按钮
                  showReset={propsComputed.showReset} // 是否显示重置按钮
                  showExpand={propsComputed.showExpand} // 是否显示展开按钮
                  searchLoading={propsComputed.searchLoading} // 搜索按钮加载状态
                  resetLoading={propsComputed.resetLoading} // 重置按钮加载状态
                  visible={visible.value} // 展开状态
                  onExpand={setVisible} // 展开事件
                  onReset={reset} // 重置事件
                  onSearch={search} // 搜索事件
                />
              </div>
            ),
            label: () => <span>&nbsp;</span> // 标签占位符
          }
        }
      }
    ])
  }

  return schema // 返回处理后的表单结构
})

// 表单工具方法
const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, getFormExpose } = formMethods

// 外部传入的属性
const outsideProps = ref<SearchProps>({})

// 合并后的属性
const mergeProps = ref<SearchProps>({})

// 获取最终属性
const getProps = computed(() => {
  const propsObj = { ...props } // 克隆 props
  Object.assign(propsObj, unref(mergeProps)) // 合并属性
  return propsObj // 返回合并后的属性
})

/**
 * 设置组件的动态属性
 * @param {SearchProps} props - 新的属性对象
 */
const setProps = (props: SearchProps = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props) // 合并新的属性到现有属性
  // @ts-ignore 忽略外部属性赋值的类型检查
  outsideProps.value = props // 更新外部属性
}

// 定义一个表单结构的引用
const schemaRef = ref<FormSchema[]>([])

/**
 * 监听表单结构化数组的变化
 * 当表单结构变化时重新生成表单模型（formModel）
 */
watch(
  () => unref(newSchema), // 监听动态表单结构
  async (schema = []) => {
    formModel.value = initModel(schema, unref(formModel)) // 初始化表单模型
    schemaRef.value = schema // 更新表单结构引用
  },
  {
    immediate: true, // 初始化时立即执行回调
    deep: true // 深度监听表单结构的变化
  }
)

/**
 * 过滤模型中的空值字段
 * @returns {Promise<Recordable>} 返回过滤后的表单模型数据
 */
const filterModel = async () => {
  const model = await getFormData() // 获取当前表单数据
  if (unref(getProps).removeNoValueItem) {
    // 如果启用了移除空值项的功能
    return Object.keys(model).reduce((prev, next) => {
      const value = model[next]
      if (!isEmptyVal(value)) {
        // 如果值不为空
        if (isObject(value)) {
          // 如果值是对象且有内容
          if (Object.keys(value).length > 0) {
            prev[next] = value
          }
        } else {
          // 如果值是基本类型
          prev[next] = value
        }
      }
      return prev
    }, {})
  }
  return model // 如果未启用移除功能，返回原始模型
}

/**
 * 执行搜索操作
 * 验证表单并触发搜索事件
 */
const search = async () => {
  const elFormExpose = await getElFormExpose() // 获取表单实例
  await elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      // 如果验证通过
      const model = await filterModel() // 获取过滤后的表单数据
      emit('search', model) // 触发搜索事件并传递数据
    }
  })
}

/**
 * 执行重置操作
 * 重置表单并触发重置事件
 */
const reset = async () => {
  const elFormExpose = await getElFormExpose() // 获取表单实例
  elFormExpose?.resetFields() // 重置所有表单字段
  const model = await filterModel() // 获取过滤后的表单数据
  emit('reset', model) // 触发重置事件并传递数据
}

/**
 * 底部按钮样式
 * 根据属性动态设置按钮的对齐方式
 */
const bottomButtonStyle = computed(() => {
  return {
    textAlign: unref(getProps).buttonPosition as unknown as 'left' | 'center' | 'right' // 设置按钮的对齐方式
  }
})

/**
 * 切换展开状态
 * 更新组件的 `visible` 属性以显示或隐藏部分表单字段
 */
const setVisible = async () => {
  visible.value = !unref(visible) // 切换 visible 的值
}

/**
 * 更新表单结构的特定字段
 * @param {FormSetProps[]} schemaProps - 表单字段的配置数组
 */
const setSchema = (schemaProps: FormSetProps[]) => {
  const { schema } = unref(getProps) // 获取当前表单结构
  for (const v of schema) {
    for (const item of schemaProps) {
      if (v.field === item.field) {
        // 如果字段匹配
        set(v, item.path, item.value) // 更新字段的值
      }
    }
  }
}

/**
 * 对表单赋值
 * @param {Recordable} data - 需要赋值到表单的数据对象
 */
const setValues = async (data: Recordable = {}) => {
  formModel.value = Object.assign(props.model, unref(formModel), data) // 将数据合并到表单模型中
  const formExpose = await getFormExpose() // 获取表单实例方法
  formExpose?.setValues(data) // 使用表单实例设置表单的值
}

/**
 * 删除指定字段的表单结构
 * @param {string} field - 要删除的字段名称
 */
const delSchema = (field: string) => {
  const { schema } = unref(getProps) // 获取当前表单结构
  const index = findIndex(schema, (v: FormSchema) => v.field === field) // 查找字段的索引
  if (index > -1) {
    schema.splice(index, 1) // 删除指定字段的表单结构
  }
}

/**
 * 添加新的表单结构
 * @param {FormSchema} formSchema - 新的表单结构配置
 * @param {number} [index] - 插入的位置（可选）
 */
const addSchema = (formSchema: FormSchema, index?: number) => {
  const { schema } = unref(getProps) // 获取当前表单结构
  if (index !== void 0) {
    // 如果指定了插入的位置
    schema.splice(index, 0, formSchema) // 在指定位置插入表单结构
    return
  }
  schema.push(formSchema) // 如果未指定位置，则添加到末尾
}

/**
 * 默认暴露的表单方法
 */
const defaultExpose = {
  getElFormExpose, // 获取表单实例方法
  setProps, // 动态设置组件属性
  setSchema, // 更新表单结构
  setValues, // 设置表单值
  delSchema, // 删除表单结构
  addSchema, // 添加表单结构
  getFormData // 获取表单数据
}

/**
 * 组件挂载时触发
 * 向父组件注册暴露的方法
 */
onMounted(() => {
  emit('register', defaultExpose) // 向外部发出注册事件并传递方法
})

/**
 * 暴露方法供外部调用
 */
defineExpose(defaultExpose)

/**
 * 表单验证事件
 * @param {FormItemProp} prop - 验证的字段
 * @param {boolean} isValid - 验证是否通过
 * @param {string} message - 验证失败的消息
 */
const onFormValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emit('validate', prop, isValid, message) // 触发验证事件并传递参数
}
</script>

<template>
  <!-- 表单组件 -->
  <!-- :model="formModel" 绑定表单数据模型 -->
  <!-- :is-custom="false" 是否使用自定义布局，false 表示默认布局 -->
  <!-- :label-width="getProps.labelWidth" 设置动态的表单标签宽度 -->
  <!-- hide-required-asterisk 隐藏必填字段的星号 -->
  <!-- :inline="getProps.inline" 是否启用行内布局 -->
  <!-- :is-col="getProps.isCol" 是否使用栅格布局 -->
  <!-- :schema="schemaRef" 动态绑定表单结构 -->
  <!-- @register="formRegister" 注册表单方法的事件回调 -->
  <!-- @validate="onFormValidate" 表单验证的事件回调 -->
  <Form
    :model="formModel"
    :is-custom="false"
    :label-width="getProps.labelWidth"
    hide-required-asterisk
    :inline="getProps.inline"
    :is-col="getProps.isCol"
    :schema="schemaRef"
    @register="formRegister"
    @validate="onFormValidate"
  />

  <!-- 当布局为 bottom 时显示底部操作按钮 -->
  <!-- v-if="layout === 'bottom" 条件渲染：布局为 bottom 时显示 -->
  <template v-if="layout === 'bottom'">
    <!-- 按钮容器 -->
    <!-- :style="bottomButtonStyle" 动态设置底部按钮样式 -->
    <div :style="bottomButtonStyle">
      <!-- 操作按钮组件 -->
      <!-- :show-reset="getProps.showReset" 是否显示重置按钮 -->
      <!-- :show-search="getProps.showSearch" 是否显示搜索按钮 -->
      <!-- :show-expand="getProps.showExpand" 是否显示展开按钮 -->
      <!-- :search-loading="getProps.searchLoading" 搜索按钮的加载状态 -->
      <!-- :reset-loading="getProps.resetLoading" 重置按钮的加载状态 -->
      <!-- :visible="visible" 当前展开状态 -->
      <!-- @expand="setVisible" 展开按钮点击事件 -->
      <!-- @reset="reset" 重置按钮点击事件 -->
      <!-- @search="search" 搜索按钮点击事件 -->
      <ActionButton
        :show-reset="getProps.showReset"
        :show-search="getProps.showSearch"
        :show-expand="getProps.showExpand"
        :search-loading="getProps.searchLoading"
        :reset-loading="getProps.resetLoading"
        :visible="visible"
        @expand="setVisible"
        @reset="reset"
        @search="search"
      />
    </div>
  </template>
</template>
