/**
 * @file useSearch.ts
 * @description 该模块为搜索功能提供了一组 API 接口，允许注册搜索实例并操作搜索组件的属性、值及模式等。
 * @example
 * import { useSearch } from './useSearch'
 *
 * const { searchRegister, searchMethods } = useSearch()
 *
 * // 注册搜索实例
 * searchRegister(searchInstance)
 *
 * // 设置搜索组件的props
 * await searchMethods.setProps({ model: { ... } })
 *
 * // 获取表单数据
 * const formData = await searchMethods.getFormData()
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module SearchComponent
 */
import { ref, unref, nextTick } from 'vue' // 从vue库中导入ref、unref和nextTick函数
import { FormSchema, FormSetProps } from '@/components/Form' // 从Form组件导入FormSchema和FormSetProps类型
import { SearchExpose, SearchProps } from '@/components/Search' // 从Search组件导入SearchExpose和SearchProps类型

/**
 * 导出 useSearch 函数
 */
export const useSearch = () => {
	// 创建一个ref类型的searchRef，初始值为undefined，用于存储Search实例
	const searchRef = ref<SearchExpose>()

	/**
	 * 注册Search实例
	 * @param ref Search实例
	 */
	const register = (ref: SearchExpose) => {
		searchRef.value = ref // 将传入的Search实例赋值给searchRef
	}

	/**
	 * 获取已注册的Search实例
	 * @returns 返回Search实例
	 */
	const getSearch = async () => {
		await nextTick() // 等待下一个DOM更新周期
		const search = unref(searchRef) // 获取searchRef的值
		if (!search) {
			console.error('The Search is not registered. Please use the register method to register') // 如果search未注册，输出错误信息
		}
		return search // 返回Search实例
	}

	// 定义一些内置的方法
	const methods = {
		/**
		 * @description 设置search组件的props
		 * @param props 要设置的props，类型为SearchProps
		 */
		setProps: async (props: SearchProps = {}) => {
			const search = await getSearch() // 获取Search实例
			search?.setProps(props) // 设置Search组件的props
			if (props.model) {
				search?.setValues(props.model) // 如果有model，则设置其值
			}
		},

		/**
		 * @description 设置form的值
		 * @param data 需要设置的数据，类型为Recordable
		 */
		setValues: async (data: Recordable) => {
			const search = await getSearch() // 获取Search实例
			search?.setValues(data) // 设置Search的值
		},

		/**
		 * @description 设置schema
		 * @param schemaProps 需要设置的schemaProps，类型为FormSetProps数组
		 */
		setSchema: async (schemaProps: FormSetProps[]) => {
			const search = await getSearch() // 获取Search实例
			search?.setSchema(schemaProps) // 设置Search的schema
		},

		/**
		 * @description 新增schema
		 * @param formSchema 需要新增的数据，类型为FormSchema
		 * @param index 在哪里新增，类型为可选的数字
		 */
		addSchema: async (formSchema: FormSchema, index?: number) => {
			const search = await getSearch() // 获取Search实例
			search?.addSchema(formSchema, index) // 在指定位置新增schema
		},

		/**
		 * @description 删除schema
		 * @param field 删除哪个数据，类型为字符串
		 */
		delSchema: async (field: string) => {
			const search = await getSearch() // 获取Search实例
			search?.delSchema(field) // 删除指定的schema
		},

		/**
		 * @description 获取表单数据
		 * @returns 返回表单数据，类型为Promise<T>
		 */
		getFormData: async <T = Recordable>(): Promise<T> => {
			const search = await getSearch() // 获取Search实例
			return search?.getFormData() as T // 获取并返回表单数据
		}
	}

	// 返回注册函数和方法集合
	return {
		searchRegister: register, // 注册函数
		searchMethods: methods // 内置方法集合
	}
}
