/**
 * @file config.ts
 * @description Axios请求和响应的默认拦截器配置
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module AxiosInterceptors
 */

import { AxiosResponse, InternalAxiosRequestConfig } from './types' // 导入Axios响应和请求配置类型
import { ElMessage } from 'element-plus' // 导入Element Plus的消息组件
import qs from 'qs' // 导入qs库，用于处理查询字符串
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants' // 导入常量
import { useUserStoreWithOut } from '@/store/modules/user' // 导入用户状态管理
import { objToFormData } from '@/utils' // 导入对象转FormData的工具函数

/**
 * 默认请求拦截器
 * @param config - Axios请求配置
 * @returns Modified Axios request configuration
 */
const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  // 判断请求方法是否为POST且Content-Type为application/x-www-form-urlencoded
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data) // 将数据转换为查询字符串
  }
  // 判断请求方法是否为POST且Content-Type为multipart/form-data且数据不是FormData实例
  else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData)
  ) {
    config.data = objToFormData(config.data) // 将数据对象转换为FormData
  }
  // 如果请求方法是GET且存在params
  if (config.method === 'get' && config.params) {
    let url = config.url as string // 获取请求URL
    url += '?' // 在URL后添加问号
    const keys = Object.keys(config.params) // 获取参数的键
    for (const key of keys) {
      // 若参数的值不是undefined或null
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&` // 将参数拼接到URL中
      }
    }
    url = url.substring(0, url.length - 1) // 去除最后一个&
    config.params = {} // 清空params
    config.url = url // 更新config.url
  }
  return config // 返回修改后的请求配置
}

/**
 * 默认响应拦截器
 * @param response - Axios响应对象
 * @returns Processed response data
 */
const defaultResponseInterceptors = (response: AxiosResponse) => {
  // 如果响应类型是blob，直接返回响应
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  }
  // 判断响应数据的状态码是否为成功代码
  else if (response.data.code === SUCCESS_CODE) {
    return response.data // 返回响应数据
  } else {
    ElMessage.error(response?.data?.message) // 显示错误消息
    // 如果响应状态码是401，执行登出操作
    if (response?.data?.code === 401) {
      const userStore = useUserStoreWithOut() // 获取用户状态管理实例
      userStore.logout() // 执行登出操作
    }
  }
}

/** 导出默认响应拦截器和请求拦截器 */
export { defaultResponseInterceptors, defaultRequestInterceptors }
