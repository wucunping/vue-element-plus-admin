/**
 * @file useSearch.ts
 * @description 此文件提供了搜索功能的组合式函数，允许对搜索组件进行注册和操作。
 * @example
 * const { searchRegister, searchMethods } = useSearch();
 * searchRegister(searchInstance);
 * searchMethods.setProps({ model: { name: "test" } });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module Search
 */

import { ref, unref, nextTick } from 'vue' // 引入 vue 的 ref、unref、nextTick 方法
import { FormSchema, FormSetProps } from '@/components/Form' // 引入表单相关的类型
import { SearchExpose, SearchProps } from '@/components/Search' // 引入搜索组件相关的类型

/**
 * useSearch 组合式函数
 * @returns {Object} 包含注册搜索实例的方法和内置搜索方法的对象
 */
export const useSearch = () => {
  // Search实例的引用
  const searchRef = ref<SearchExpose>() // 初始化 searchRef 为 ref 类型

  /**
   * 注册 Search 实例
   * @param ref Search实例
   */
  const register = (ref: SearchExpose) => {
    searchRef.value = ref // 将传入的 Search 实例赋值给 searchRef
  }

  /**
   * 获取注册的 Search 实例
   * @returns {Promise<SearchExpose>} 返回 Promise，解析为 Search 实例
   */
  const getSearch = async () => {
    await nextTick() // 等待下一个 DOM 更新周期
    const search = unref(searchRef) // 获取未引用的 searchRef
    // 如果没有注册
    if (!search) {
      console.error('The Search is not registered. Please use the register method to register') // 输出错误信息
    }
    return search // 返回获得的 search 实例
  }

  // 一些内置的方法
  const methods = {
    /**
     * @description 设置 Search 组件的 props
     * @param props SearchProps - 需要设置的 props
     */
    setProps: async (props: SearchProps = {}) => {
      const search = await getSearch() // 获取 Search 实例
      search?.setProps(props) // 设置 Search 的 props
      // 如果传入了 model 属性，则设置 model
      if (props.model) {
        search?.setValues(props.model) // 设置 Search 的值
      }
    },

    /**
     * @description 设置表单的值
     * @param data Recordable - 需要设置的数据
     */
    setValues: async (data: Recordable) => {
      const search = await getSearch() // 获取 Search 实例
      search?.setValues(data) // 设置 Search 的值
    },

    /**
     * @description 设置 schema
     * @param schemaProps FormSetProps[] - 需要设置的 schema props
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const search = await getSearch() // 获取 Search 实例
      search?.setSchema(schemaProps) // 设置 Search 的 schema
    },

    /**
     * @description 新增 schema
     * @param formSchema FormSchema - 需要新增的数据
     * @param index number? - 在哪里新增，默认为末尾
     */
    addSchema: async (formSchema: FormSchema, index?: number) => {
      const search = await getSearch() // 获取 Search 实例
      search?.addSchema(formSchema, index) // 在指定位置新增 schema
    },

    /**
     * @description 删除 schema
     * @param field string - 删除哪个数据
     */
    delSchema: async (field: string) => {
      const search = await getSearch() // 获取 Search 实例
      search?.delSchema(field) // 删除指定的 schema
    },

    /**
     * @description 获取表单数据
     * @returns {Promise<T>} 返回表单数据的 Promise
     */
    getFormData: async <T = Recordable>(): Promise<T> => {
      const search = await getSearch() // 获取 Search 实例
      return search?.getFormData() as T // 返回表单数据
    }
  }

  // 返回注册方法和内置方法
  return {
    /** 注册 Search 实例 */
    searchRegister: register,
    /** 内置方法 */
    searchMethods: methods
  }
}
