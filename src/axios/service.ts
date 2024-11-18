/**
 * @file service.ts
 * @description Axios 实例配置和请求服务封装
 * @example
 * const response = await service.request(config);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module Service
 */

import axios, { AxiosError } from 'axios' // 导入 axios 库和 AxiosError 类型
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config' // 导入默认请求和响应拦截器

import { AxiosInstance, InternalAxiosRequestConfig, RequestConfig, AxiosResponse } from './types' // 导入类型定义
import { ElMessage } from 'element-plus' // 导入 Element Plus 消息提示组件
import { REQUEST_TIMEOUT } from '@/constants' // 导入请求超时时间常量

/** 从环境变量中获取 API 基础路径 */
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

/** 定义一个 map 用于管理 AbortController 实例 */
const abortControllerMap: Map<string, AbortController> = new Map()

/** 创建一个 Axios 实例 */
const axiosInstance: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT, // 设置请求超时时间
  baseURL: PATH_URL // 设置基础路径
})

/** 请求拦截器 */
axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController() // 创建一个新的 AbortController 实例
  const url = res.url || '' // 获取请求的 URL
  res.signal = controller.signal // 将信号对象添加到请求配置中
  abortControllerMap.set(
    // 将 URL 和对应的 AbortController 存入 map
    import.meta.env.VITE_USE_MOCK === 'true' ? url.replace('/mock', '') : url,
    controller
  )
  return res // 返回请求配置
})

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
  // 处理成功的响应
  (res: AxiosResponse) => {
    const url = res.config.url || '' // 获取响应的 URL
    abortControllerMap.delete(url) // 从 map 中删除对应的 AbortController
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res // 返回响应数据
  },
  // 处理错误的响应
  (error: AxiosError) => {
    console.log('err： ' + error) // 进行调试输出
    ElMessage.error(error.message) // 显示错误消息
    return Promise.reject(error) // 返回错误 Promise
  }
)

/** 设置默认请求拦截器 */
axiosInstance.interceptors.request.use(defaultRequestInterceptors)
/** 设置默认响应拦截器 */
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

/** 定义服务对象 */
const service = {
  /**
   * 发送请求
   * @param config 请求配置
   * @returns Promise<AxiosResponse> 请求结果
   */
  request: (config: RequestConfig) => {
    // 返回一个 Promise 对象
    return new Promise((resolve, reject) => {
      // 如果有自定义请求拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any) // 调用自定义请求拦截器
      }

      axiosInstance // 使用 Axios 实例进行请求
        .request(config) // 发送请求
        // 处理成功的响应
        .then((res) => {
          resolve(res) // 解析响应
        })
        // 处理错误的响应
        .catch((err: any) => {
          reject(err) // 拒绝 Promise
        })
    })
  },
  /**
   * 取消特定请求
   * @param url 要取消请求的 URL 或 URL 数组
   */
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url] // 将单个 URL 转换为数组
    // 遍历每个 URL
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort() // 取消对应的请求
      abortControllerMap.delete(_url) // 从 map 中删除该 URL
    }
  },
  /**
   * 取消所有请求
   */
  cancelAllRequest() {
    // 遍历 map 中所有的 AbortController
    for (const [_, controller] of abortControllerMap) {
      controller.abort() // 取消请求
    }
    abortControllerMap.clear() // 清空 map
  }
}

export default service // 导出服务对象
