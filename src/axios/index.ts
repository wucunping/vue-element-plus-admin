/**
 * @file 文件名: config.ts
 * @description Axios 请求配置和拦截器
 * @example
 * const axiosInstance = axios.create(); // 创建 Axios 实例
 * axiosInstance.interceptors.request.use(defaultRequestInterceptors); // 添加请求拦截器
 * axiosInstance.interceptors.response.use(defaultResponseInterceptors); // 添加响应拦截器
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module Axios Interceptors
 */

// 导入服务配置
import service from './service' // 导入 Axios 服务
// 导入常量
import { CONTENT_TYPE } from '@/constants' // 导入内容类型常量
// 导入用户状态管理功能
import { useUserStoreWithOut } from '@/store/modules/user' // 导入用户状态管理的 hook

/**
 * 发起请求的函数
 * @param option - Axios 请求配置选项
 * @returns Axios 响应
 */
const request = (option: AxiosConfig) => {
	const { url, method, params, data, headers, responseType } = option // 解构请求配置选项

	const userStore = useUserStoreWithOut() // 获取用户状态管理实例
	// 发起请求并返回响应
	return service.request({
		url: url, // 请求 URL
		method, // 请求方法
		params, // URL 查询参数
		data: data, // 请求体数据
		responseType: responseType, // 响应类型
		headers: {
			'Content-Type': CONTENT_TYPE, // 设置请求内容类型
			[userStore.getTokenKey ?? 'Authorization']: userStore.getToken ?? '', // 添加用户的 Token
			...headers // 合并额外的请求头
		}
	})
}

// 导出默认的请求方法
export default {
	/**
	 * GET 请求方法
	 * @param option - Axios 请求配置选项
	 * @returns Promise<IResponse<T>> - 响应数据
	 */
	get: <T = any>(option: AxiosConfig) => {
		return request({ method: 'get', ...option }) as Promise<IResponse<T>> // 发起 GET 请求
	},

	/**
	 * POST 请求方法
	 * @param option - Axios 请求配置选项
	 * @returns Promise<IResponse<T>> - 响应数据
	 */
	post: <T = any>(option: AxiosConfig) => {
		return request({ method: 'post', ...option }) as Promise<IResponse<T>> // 发起 POST 请求
	},

	/**
	 * DELETE 请求方法
	 * @param option - Axios 请求配置选项
	 * @returns Promise<IResponse<T>> - 响应数据
	 */
	delete: <T = any>(option: AxiosConfig) => {
		return request({ method: 'delete', ...option }) as Promise<IResponse<T>> // 发起 DELETE 请求
	},

	/**
	 * PUT 请求方法
	 * @param option - Axios 请求配置选项
	 * @returns Promise<IResponse<T>> - 响应数据
	 */
	put: <T = any>(option: AxiosConfig) => {
		return request({ method: 'put', ...option }) as Promise<IResponse<T>> // 发起 PUT 请求
	},

	/**
	 * 取消特定请求
	 * @param url - 请求 URL 或 URL 数组
	 * @returns 取消请求的结果
	 */
	cancelRequest: (url: string | string[]) => {
		return service.cancelRequest(url) // 调用服务的取消请求方法
	},

	/**
	 * 取消所有请求
	 * @returns 取消所有请求的结果
	 */
	cancelAllRequest: () => {
		return service.cancelAllRequest() // 调用服务的取消所有请求方法
	}
}
