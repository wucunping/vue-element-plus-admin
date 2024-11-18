/**
 * @file index.ts
 * @description 封装的请求模块，提供多个接口的请求方法
 * @example 使用方法：request1().then(response => console.log(response));
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module 请求模块
 */

// 导入axios请求实例
import request from '@/axios'

// 导入请求响应类型
import { RequestResponse } from './types'

/**
 * 请求接口1
 * @returns 请求响应
 */
export const request1 = () => {
  // 发送GET请求，获取请求1的数据
  return request.get<IResponse<RequestResponse>>({
    url: '/mock/request/1' // 请求的URL路径
  })
}

/**
 * 请求接口2
 * @returns 请求响应
 */
export const request2 = () => {
  // 发送GET请求，获取请求2的数据
  return request.get<IResponse<RequestResponse>>({
    url: '/mock/request/2' // 请求的URL路径
  })
}

/**
 * 请求接口3
 * @returns 请求响应
 */
export const request3 = () => {
  // 发送GET请求，获取请求3的数据
  return request.get<IResponse<RequestResponse>>({
    url: '/mock/request/3' // 请求的URL路径
  })
}

/**
 * 请求接口4
 * @returns 请求响应
 */
export const request4 = () => {
  // 发送GET请求，获取请求4的数据
  return request.get<IResponse<RequestResponse>>({
    url: '/mock/request/4' // 请求的URL路径
  })
}

/**
 * 请求接口5
 * @returns 请求响应
 */
export const request5 = () => {
  // 发送GET请求，获取请求5的数据
  return request.get<IResponse<RequestResponse>>({
    url: '/mock/request/5' // 请求的URL路径
  })
}

/**
 * 请求过期接口
 * @returns 请求响应
 */
export const expired = () => {
  // 发送GET请求，获取过期请求的数据
  return request.get<IResponse<RequestResponse>>({
    url: '/mock/request/expired' // 请求的URL路径
  })
}
