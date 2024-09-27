/**
 * @file service.ts
 * @description 该文件定义了一个 Axios 实例服务，用于封装 HTTP 请求的相关操作，包括请求和响应拦截器、请求的取消机制等功能。
 * @example
 * // 使用示例
 * import service from './service';
 *
 * service.request({
 *     method: 'GET',
 *     url: '/api/data',
 * }).then(response => {
 *     console.log(response.data);
 * }).catch(error => {
 *     console.error(error);
 * });
 *
 * // 取消请求示例
 * service.cancelRequest('/api/data');
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module HTTPService
 */

// 引入 axios 和 AxiosError 类型
import axios, { AxiosError } from 'axios'
// 引入默认的请求和响应拦截器
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

// 引入类型定义，对于 Axios 相关的接口和类型
import type {
	AxiosInstance, // Axios 实例类型
	InternalAxiosRequestConfig, // 内部 Axios 请求配置类型
	RequestConfig, // 请求配置类型
	AxiosResponse // Axios 响应类型
} from './types'
// 引入 Element Plus 的消息组件
import { ElMessage } from 'element-plus'
// 引入请求超时时间常量
import { REQUEST_TIMEOUT } from '@/constants'

/** 定义 API 的基础路径，来源于环境变量 */
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

/** 创建一个 Map 用于存储 AbortController */
const abortControllerMap: Map<string, AbortController> = new Map()

/** 创建一个 Axios 实例，设置请求的超时时间和基础路径 */
const axiosInstance: AxiosInstance = axios.create({
	timeout: REQUEST_TIMEOUT, // 请求超时设置
	baseURL: PATH_URL // 基础请求路径
})

/** 请求拦截器 */
axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
	const controller = new AbortController() // 创建一个 AbortController 实例
	const url = res.url || '' // 获取请求 URL
	res.signal = controller.signal // 将信号绑定到请求配置中
	// 将控制器存储到 abortControllerMap 中
	abortControllerMap.set(
		import.meta.env.VITE_USE_MOCK === 'true' ? url.replace('/mock', '') : url,
		controller
	)
	return res // 返回处理后的请求配置
})

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
	(res: AxiosResponse) => {
		const url = res.config.url || '' // 获取响应的请求 URL
		abortControllerMap.delete(url) // 在响应中删除对应的控制器
		// 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
		return res // 返回响应
	},
	(error: AxiosError) => {
		console.log('err： ' + error) // 打印错误信息以用于调试
		ElMessage.error(error.message) // 显示错误消息
		return Promise.reject(error) // 拒绝 Promise，传递错误
	}
)

/** 使用默认请求拦截器 */
axiosInstance.interceptors.request.use(defaultRequestInterceptors)
/** 使用默认响应拦截器 */
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

/** 定义 service 对象 */
const service = {
	/**
	 * 发起请求的方法
	 * @param config - 请求配置对象
	 * @returns 返回一个 Promise
	 */
	request: (config: RequestConfig) => {
		return new Promise((resolve, reject) => {
			// 如果有请求拦截器则执行
			if (config.interceptors?.requestInterceptors) {
				config = config.interceptors.requestInterceptors(config as any) // 执行请求拦截器
			}

			// 发送请求
			axiosInstance
				.request(config) // 使用 Axios 实例发送请求
				.then((res) => {
					resolve(res) // 请求成功，解析结果
				})
				.catch((err: any) => {
					reject(err) // 请求失败，拒绝 Promise
				})
		})
	},
	/**
	 * 取消指定的请求
	 * @param url - 请求的 URL，可以是字符串或字符串数组
	 */
	cancelRequest: (url: string | string[]) => {
		const urlList = Array.isArray(url) ? url : [url] // 将单个 URL 转换为数组
		for (const _url of urlList) {
			abortControllerMap.get(_url)?.abort() // 取消请求
			abortControllerMap.delete(_url) // 删除控制器
		}
	},
	/**
	 * 取消所有请求
	 */
	cancelAllRequest() {
		for (const [_, controller] of abortControllerMap) {
			controller.abort() // 取消所有存储的请求
		}
		abortControllerMap.clear() // 清空控制器映射
	}
}

// 导出 service 对象
export default service
