/**
 * @file index.ts
 * @description 该文件定义了请求拦截器接口和请求配置接口。
 * @example
 * // 使用请求拦截器
 * const config: RequestConfig = {
 *   interceptors: {
 *     requestInterceptors: (config) => {
 *       // 在请求发送之前做一些处理
 *       return config;
 *     },
 *   },
 * };
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module RequestModule
 */

// 导入axios库中的类型定义
import type {
  InternalAxiosRequestConfig, // 内部请求配置类型
  AxiosResponse, // 响应类型
  AxiosRequestConfig, // 请求配置类型
  AxiosInstance, // axios实例类型
  AxiosRequestHeaders, // 请求头类型
  AxiosError // 错误类型
} from 'axios'

/** 请求拦截器接口定义 */
interface RequestInterceptors<T> {
  /**
   * 请求拦截
   * @param config - 请求的配置信息
   * @returns 返回处理后的请求配置
   */
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig

  /**
   * 请求拦截错误处理
   * @param err - 错误信息
   * @returns 处理后的错误信息
   */
  requestInterceptorsCatch?: (err: any) => any

  /**
   * 响应拦截
   * @param config - 响应的配置信息
   * @returns 返回处理后的响应配置
   */
  responseInterceptors?: (config: T) => T

  /**
   * 响应拦截错误处理
   * @param err - 错误信息
   * @returns 处理后的错误信息
   */
  responseInterceptorsCatch?: (err: any) => any
}

/** 请求配置接口定义 */
interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  /**
   * 拦截器配置
   * @type {RequestInterceptors<T>} - 请求拦截器
   */
  interceptors?: RequestInterceptors<T>
}

// 导出相关类型和接口
export {
  /** 导出响应类型 */
  AxiosResponse,
  /** 导出请求拦截器接口 */
  RequestInterceptors,
  /** 导出请求配置接口 */
  RequestConfig,
  /** 导出axios实例类型 */
  AxiosInstance,
  /** 导出内部请求配置类型 */
  InternalAxiosRequestConfig,
  /** 导出请求头类型 */
  AxiosRequestHeaders,
  /** 导出错误类型 */
  AxiosError
}
