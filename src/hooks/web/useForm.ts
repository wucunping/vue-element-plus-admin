/**
 * @file useForm.ts
 * @description 定义了一个名为useForm的自定义钩子函数，用于管理表单数据和与表单相关的操作。
 * @example
 * 导入useForm钩子并使用返回的表单注册方法和表单方法
 * import { useForm } from './useForm'
 * const { formRegister, formMethods } = useForm()
 * formRegister(form, elForm)
 * formMethods.setProps({ model: { a: 1, b: 2 } })
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-24
 */

// 引入Form和FormExpose类型
import type { Form, FormExpose } from '@/components/Form'
// 引入Element Plus的ElForm和ElFormItem类型
import type { ElForm, ElFormItem } from 'element-plus'
// 引入Vue的ref, unref和nextTick函数
import { ref, unref, nextTick } from 'vue'
// 引入表单相关的类型
import { FormSchema, FormSetProps, FormProps } from '@/components/Form'
// 引入工具函数
import { isEmptyVal, isObject } from '@/utils/is'

/**
 * 返回一个对象，包含formRegister和formMethods，用于注册Form实例和ElForm实例，并提供一系列操作表单的方法。
 *
 * @returns 包含formRegister和formMethods的对象
 */
export const useForm = () => {
	// 使用ref创建响应式引用，存储Form实例
	const formRef = ref<typeof Form & FormExpose>()
	// 使用ref创建响应式引用，存储ElForm实例
	const elFormRef = ref<ComponentRef<typeof ElForm>>()

	/**
	 * 注册Form实例和ElForm实例到对应的ref中
	 * @param ref Form实例
	 * @param elRef ElForm实例
	 */
	const register = (ref: typeof Form & FormExpose, elRef: ComponentRef<typeof ElForm>) => {
		formRef.value = ref
		elFormRef.value = elRef
	}

	/**
	 * 获取表单对象
	 *
	 * @returns 返回表单对象，若未注册则返回undefined
	 */
	const getForm = async () => {
		await nextTick()
		const form = unref(formRef)
		if (!form) {
			console.error('The form is not registered. Please use the register method to register')
		}
		return form
	}

	// 定义一些内置的方法
	const methods = {
		/**
		 * 设置form组件的props
		 * @param props form组件的props
		 */
		setProps: async (props: FormProps = {}) => {
			const form = await getForm()
			if (form) {
				form.setProps(props)
				if (props.model) {
					form.setValues(props.model)
				}
			}
		},

		/**
		 * 设置form的值
		 * @param data 需要设置的数据
		 */
		setValues: async (data: Recordable) => {
			const form = await getForm()
			if (form) {
				form.setValues(data)
			}
		},

		/**
		 * 设置schema
		 * @param schemaProps 需要设置的schemaProps
		 */
		setSchema: async (schemaProps: FormSetProps[]) => {
			const form = await getForm()
			if (form) {
				form.setSchema(schemaProps)
			}
		},

		/**
		 * 新增schema
		 * @param formSchema 需要新增数据
		 * @param index 在哪里新增
		 */
		addSchema: async (formSchema: FormSchema, index?: number) => {
			const form = await getForm()
			if (form) {
				form.addSchema(formSchema, index)
			}
		},

		/**
		 * 删除schema
		 * @param field 删除哪个数据
		 */
		delSchema: async (field: string) => {
			const form = await getForm()
			if (form) {
				form.delSchema(field)
			}
		},

		/**
		 * 获取表单数据
		 * @returns form data
		 */
		getFormData: async <T = Recordable>(filterEmptyVal = true): Promise<T> => {
			const form = await getForm()
			if (form) {
				const model = form.formModel as any
				if (filterEmptyVal) {
					// 使用reduce过滤空值，并返回一个新对象
					return Object.keys(model).reduce((prev, next) => {
						const value = model[next]
						if (!isEmptyVal(value)) {
							if (isObject(value)) {
								if (Object.keys(value).length > 0) {
									prev[next] = value
								}
							} else {
								prev[next] = value
							}
						}
						return prev
					}, {}) as T
				} else {
					return model as T
				}
			}
		},

		/**
		 * 获取表单组件的实例
		 * @param field 表单项唯一标识
		 * @returns component instance
		 */
		getComponentExpose: async (field: string) => {
			const form = await getForm()
			if (form) {
				return form.getComponentExpose(field)
			}
		},

		/**
		 * 获取formItem组件的实例
		 * @param field 表单项唯一标识
		 * @returns formItem instance
		 */
		getFormItemExpose: async (field: string) => {
			const form = await getForm()
			if (form) {
				return form.getFormItemExpose(field) as ComponentRef<typeof ElFormItem>
			}
		},

		/**
		 * 获取ElForm组件的实例
		 * @returns ElForm instance
		 */
		getElFormExpose: async () => {
			await getForm()
			return unref(elFormRef)
		},

		/**
		 * 获取Form实例
		 * @returns Form instance
		 */
		getFormExpose: async () => {
			await getForm()
			return unref(formRef)
		}
	}

	// 返回一个对象，包含formRegister和formMethods
	return {
		formRegister: register,
		formMethods: methods
	}
}
