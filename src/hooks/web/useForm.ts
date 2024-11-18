/**
 * @file useForm.ts
 * @description Form相关的配置和方法
 * @example
 * // 使用示例
 * const { formRegister, formMethods } = useForm();
 * formRegister(formRef, elFormRef);
 * formMethods.setProps({ model: myModel });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module useForm
 */

import type { Form, FormExpose } from '@/components/Form' // 导入Form和FormExpose类型
import type { ElForm, ElFormItem } from 'element-plus' // 导入Element Plus框架的ElForm和ElFormItem类型
import { ref, unref, nextTick } from 'vue' // 从Vue中导入ref、unref和nextTick方法
import { FormSchema, FormSetProps, FormProps } from '@/components/Form' // 导入表单相关的类型
import { isEmptyVal, isObject } from '@/utils/is' // 导入检查空值和对象的方法

/**
 * @description 创建Form的组合式API
 * @returns 组合式API的返回对象
 */
export const useForm = () => {
  /** From实例  定义一个响应式引用，类型为Form及其暴露的接口 */
  const formRef = ref<typeof Form & FormExpose>()

  /** ElForm实例  定义一个响应式引用，类型为ElForm */
  const elFormRef = ref<ComponentRef<typeof ElForm>>()

  /**
   * @description 注册Form和ElForm实例
   * @param ref Form实例
   * @param elRef ElForm实例
   */
  const register = (ref: typeof Form & FormExpose, elRef: ComponentRef<typeof ElForm>) => {
    formRef.value = ref // 将传入的Form实例赋值给formRef
    elFormRef.value = elRef // 将传入的ElForm实例赋值给elFormRef
  }

  /**
   * @description 获取Form实例
   * @returns Form实例
   */
  const getForm = async () => {
    await nextTick() // 等待下一次DOM更新
    const form = unref(formRef) // 获取formRef的值
    if (!form) {
      console.error('The form is not registered. Please use the register method to register') // 如果form未注册，输出错误信息
    }
    return form // 返回Form实例
  }

  /** 一些内置的方法 */
  const methods = {
    /**
     * @description 设置form组件的props
     * @param props form组件的props
     */
    setProps: async (props: FormProps = {}) => {
      const form = await getForm() // 获取Form实例
      form?.setProps(props) // 设置Form的props
      if (props.model) {
        form?.setValues(props.model) // 如果有model，设置Form的值
      }
    },

    /**
     * @description 设置form的值
     * @param data 需要设置的数据
     */
    setValues: async (data: Recordable) => {
      const form = await getForm() // 获取Form实例
      form?.setValues(data) // 设置Form的值
    },

    /**
     * @description 设置schema
     * @param schemaProps 需要设置的schemaProps
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const form = await getForm() // 获取Form实例
      form?.setSchema(schemaProps) // 设置Form的schema
    },

    /**
     * @description 新增schema
     * @param formSchema 需要新增数据
     * @param index 在哪里新增
     */
    addSchema: async (formSchema: FormSchema, index?: number) => {
      const form = await getForm() // 获取Form实例
      form?.addSchema(formSchema, index) // 新增schema
    },

    /**
     * @description 删除schema
     * @param field 删除哪个数据
     */
    delSchema: async (field: string) => {
      const form = await getForm() // 获取Form实例
      form?.delSchema(field) // 删除指定的schema
    },

    /**
     * @description 获取表单数据
     * @returns form data
     */
    getFormData: async <T = Recordable>(filterEmptyVal = true): Promise<T> => {
      const form = await getForm() // 获取Form实例
      const model = form?.formModel as any // 获取Form模型
      if (filterEmptyVal) {
        // 使用reduce过滤空值，并返回一个新对象
        return Object.keys(model).reduce((prev, next) => {
          const value = model[next] // 获取当前值
          // 如果值不为空
          if (!isEmptyVal(value)) {
            // 如果值是对象
            if (isObject(value)) {
              // 如果对象有属性
              if (Object.keys(value).length > 0) {
                prev[next] = value // 添加到返回对象
              }
            } else {
              prev[next] = value // 直接添加到返回对象
            }
          }
          return prev // 返回累积的结果
        }, {}) as T
      } else {
        return model as T // 直接返回模型
      }
    },

    /**
     * @description 获取表单组件的实例
     * @param field 表单项唯一标识
     * @returns component instance
     */
    getComponentExpose: async (field: string) => {
      const form = await getForm() // 获取Form实例
      return form?.getComponentExpose(field) // 返回表单组件的实例
    },

    /**
     * @description 获取formItem组件的实例
     * @param field 表单项唯一标识
     * @returns formItem instance
     */
    getFormItemExpose: async (field: string) => {
      const form = await getForm() // 获取Form实例
      return form?.getFormItemExpose(field) as ComponentRef<typeof ElFormItem> // 返回formItem组件的实例
    },

    /**
     * @description 获取ElForm组件的实例
     * @returns ElForm instance
     */
    getElFormExpose: async () => {
      await getForm() // 确保获取Form实例
      return unref(elFormRef) // 返回ElForm的引用
    },

    /**
     * @description 获取Form组件的实例
     * @returns Form instance
     */
    getFormExpose: async () => {
      await getForm() // 确保获取Form实例
      return unref(formRef) // 返回Form的引用
    }
  }

  return {
    formRegister: register, // 返回注册方法
    formMethods: methods // 返回所有表单方法
  }
}
