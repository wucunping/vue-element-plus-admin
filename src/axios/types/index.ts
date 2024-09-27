/**
 * @file 文件名: request.ts
 * @description Axios 请求配置和拦截器类型定义
 * @example
 * const config: RequestConfig = {
 *     url: '/api/data',
 *     method: 'GET',
 *     interceptors: {
 *         requestInterceptors: (config) => {
 *             // 在请求发送之前做一些处理
 *             return config;
 *         },
 *         responseInterceptors: (response) => {
 *             // 对响应数据做一些处理
 *             return response;
 *         }
 *     }
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module Axios Request Config
 */

/** 导入 Axios 类型 */
import type {
	/** 内部请求配置类型 */
	InternalAxiosRequestConfig, // 该类型用于配置 Axios 请求时的内部参数

	/** Axios 响应类型 */
	AxiosResponse, // 该类型表示 Axios 请求返回的数据结构

	/** Axios 请求配置类型 */
	AxiosRequestConfig, // 该类型用于定义 Axios 请求的配置选项

	/** Axios 实例类型 */
	AxiosInstance, // 该类型表示 Axios 的实例对象，可以用于发起请求

	/** Axios 请求头类型 */
	AxiosRequestHeaders, // 该类型用于定义请求时的头部信息

	/** Axios 错误类型 */
	AxiosError // 该类型表示请求过程中可能出现的错误信息
} from 'axios'

/**
 * 请求拦截器接口定义
 */
interface RequestInterceptors<T> {
	/** 请求拦截函数 */
	requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
	/** 请求拦截错误处理函数 */
	requestInterceptorsCatch?: (err: any) => any
	/** 响应拦截函数 */
	responseInterceptors?: (config: T) => T
	/** 响应拦截错误处理函数 */
	responseInterceptorsCatch?: (err: any) => any
}

/**
 * 请求配置接口定义，扩展 AxiosRequestConfig
 */
interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
	/** 自定义拦截器配置 */
	interceptors?: RequestInterceptors<T>
}

/** 导出 Axios 请求配置类型 */
export type {
	/** Axios 响应类型 */
	AxiosResponse, // 表示 Axios 请求返回的数据结构

	/** 请求拦截器接口类型 */
	RequestInterceptors, // 定义请求拦截器的相关方法和配置

	/** 请求配置接口类型 */
	RequestConfig, // 扩展自 AxiosRequestConfig，用于定义请求的配置选项

	/** Axios 实例类型 */
	AxiosInstance, // 表示 Axios 的实例对象，可以用于发起请求

	/** 内部请求配置类型 */
	InternalAxiosRequestConfig, // 该类型用于配置 Axios 请求时的内部参数

	/** 请求头类型 */
	AxiosRequestHeaders, // 定义请求的头部信息结构

	/** Axios 错误类型 */
	AxiosError // 表示请求过程中可能出现的错误信息
}
