/**
 * @file useConfigGlobal.ts
 * @description 该文件定义了一个用来注入全局配置的自定义组合函数。
 * @example
 * const { configGlobal } = useConfigGlobal();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module ConfigGlobal
 */

import { ConfigGlobalTypes } from '@/components/ConfigGlobal' // 引入 ConfigGlobalTypes 类型，用于类型注解
import { inject } from 'vue' // 从 Vue 中引入 inject 函数，用于依赖注入

/**
 * 自定义组合函数，用于获取全局配置。
 * @function useConfigGlobal
 * @returns {Object} 返回包含全局配置的对象
 */
export const useConfigGlobal = () => {
  /** 使用 inject 函数注入 'configGlobal' 依赖，并指定默认值为一个空对象 */
  const configGlobal = inject('configGlobal', {}) as ConfigGlobalTypes

  return {
    configGlobal // 返回注入的全局配置
  }
}
