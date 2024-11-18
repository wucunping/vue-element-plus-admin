/**
 * @file 请求模块
 * @description 封装了对服务的请求，包括GET、POST、DELETE、PUT等方法
 * @example
 * import request from './request'
 * request.get({ url: '/api/data' })
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module request
 */

import service from './service' // 导入服务模块
import { CONTENT_TYPE } from '@/constants' // 导入常量
import { useUserStoreWithOut } from '@/store/modules/user' // 导入用户状态管理

/**
 * 封装的请求函数
 * @param option 请求配置
 * @returns Promise<IResponse<T>> 返回响应结果
 */
const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option // 解构请求配置

  const userStore = useUserStoreWithOut() // 获取用户状态
  // 发起请求
  return service.request({
    url: url, // 请求的URL
    method, // 请求方法
    params, // 请求参数
    data: data, // 请求体数据
    responseType: responseType, // 响应类型
    // 请求头
    headers: {
      'Content-Type': CONTENT_TYPE, // 内容类型
      [userStore.getTokenKey ?? 'Authorization']: userStore.getToken ?? '', // 用户token
      ...headers // 合并传入的请求头
    }
  })
}

// 导出请求方法
export default {
  /**
   * GET请求
   * @param option 请求配置
   * @returns Promise<IResponse<T>> 返回响应结果
   */
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>> // 调用request函数
  },
  /**
   * POST请求
   * @param option 请求配置
   * @returns Promise<IResponse<T>> 返回响应结果
   */
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>> // 调用request函数
  },
  /**
   * DELETE请求
   * @param option 请求配置
   * @returns Promise<IResponse<T>> 返回响应结果
   */
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>> // 调用request函数
  },
  /**
   * PUT请求
   * @param option 请求配置
   * @returns Promise<IResponse<T>> 返回响应结果
   */
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>> // 调用request函数
  },
  /**
   * 取消指定请求
   * @param url 请求的URL或URL数组
   * @returns Promise<void>
   */
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url) // 取消请求
  },
  /**
   * 取消所有请求
   * @returns Promise<void>
   */
  cancelAllRequest: () => {
    return service.cancelAllRequest() // 取消所有请求
  }
}
