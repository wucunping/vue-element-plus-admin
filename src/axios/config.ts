/**
 * @file 文件名: config.ts
 * @description Axios 请求和响应的默认拦截器配置
 * @example
 * const axiosInstance = axios.create(); // 创建 Axios 实例
 * axiosInstance.interceptors.request.use(defaultRequestInterceptors); // 添加请求拦截器
 * axiosInstance.interceptors.response.use(defaultResponseInterceptors); // 添加响应拦截器
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module Axios Interceptors
 */

// 导入必要的类型
import type {
	AxiosResponse, // Axios 响应类型
	InternalAxiosRequestConfig // 内部 Axios 请求配置类型
} from './types'

// 从 Element Plus 导入消息提示
import {
	ElMessage // 消息提示功能
} from 'element-plus'

// 导入 qs 用于对象与查询字符串之间的转换
import qs from 'qs'

// 导入常量
import {
	SUCCESS_CODE, // 成功代码常量
	TRANSFORM_REQUEST_DATA // 请求数据转换标识
} from '@/constants'

// 导入用户状态管理功能
import {
	useUserStoreWithOut // 用户状态管理的 hook
} from '@/store/modules/user'

// 导入对象转 FormData 的工具函数
import {
	objToFormData // 对象转换为 FormData 的工具函数
} from '@/utils'

/**
 * 默认请求拦截器
 * @param config - 内部 Axios 请求配置
 * @returns 处理后的请求配置
 */
const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
	// 如果请求方式为 POST 且 Content-Type 为 application/x-www-form-urlencoded
	if (
		config.method === 'post' &&
		config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
	) {
		// 将请求数据转换为查询字符串
		config.data = qs.stringify(config.data)
	} else if (
		TRANSFORM_REQUEST_DATA &&
		config.method === 'post' &&
		config.headers['Content-Type'] === 'multipart/form-data' &&
		!(config.data instanceof FormData) // 检查数据是否已经是 FormData
	) {
		// 将请求数据转换为 FormData 对象
		config.data = objToFormData(config.data)
	}

	// 如果请求方式为 GET 且有查询参数
	if (config.method === 'get' && config.params) {
		let url = config.url as string // 获取请求 URL
		url += '?' // 添加查询字符串开始符号

		const keys = Object.keys(config.params) // 获取参数键名
		for (const key of keys) {
			// 如果参数值不为 undefined 和 null
			if (config.params[key] !== void 0 && config.params[key] !== null) {
				// 将参数添加到 URL
				url += `${key}=${encodeURIComponent(config.params[key])}&`
			}
		}
		url = url.substring(0, url.length - 1) // 移除最后一个多余的 &
		config.params = {} // 清空参数
		config.url = url // 更新请求 URL
	}
	return config // 返回处理后的请求配置
}

/**
 * 默认响应拦截器
 * @param response - Axios 响应对象
 * @returns 处理后的响应数据
 */
const defaultResponseInterceptors = (response: AxiosResponse) => {
	// 如果响应类型为 blob，直接返回响应
	if (response?.config?.responseType === 'blob') {
		return response
	} else if (response.data.code === SUCCESS_CODE) {
		// 如果响应结果为成功代码，返回响应数据
		return response.data
	} else {
		// 其他情况显示错误消息
		ElMessage.error(response?.data?.message)

		// 如果响应结果为未授权代码，进行登出处理
		if (response?.data?.code === 401) {
			const userStore = useUserStoreWithOut()
			userStore.logout() // 调用登出方法
		}
	}
}

// 导出默认响应拦截器和请求拦截器
export {
	defaultResponseInterceptors, // 默认响应拦截器
	defaultRequestInterceptors // 默认请求拦截器
}
