/**
 * @file mock-api.ts
 * @description 模拟 API 请求的定义文件，用于提供测试环境下的请求响应。
 * @example
 * import mockApi from './mock-api';
 * console.log(mockApi[0].response()); // { code: SUCCESS_CODE, data: 'request-1' }
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-19
 * @module mockApi
 */

// 导入常量定义：SUCCESS_CODE 代表请求成功的状态码
import { SUCCESS_CODE } from '@/constants'

/** 常量：默认请求超时时间，单位为毫秒 */
const timeout = 600000

/**
 * 模拟 API 请求配置数组
 * 每个配置包含 URL、请求方法、超时时间和响应数据
 */
export default [
  {
    /**
     * 请求 URL
     * @type {string}
     */
    url: '/mock/request/1',
    /**
     * 请求方法
     * @type {string}
     */
    method: 'get',
    /**
     * 请求超时时间
     * @type {number}
     */
    timeout,
    /**
     * 响应函数：返回请求的模拟数据
     * @returns {object} 返回包含状态码和数据的响应
     */
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'request-1'
      }
    }
  },
  {
    url: '/mock/request/2',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'request-2'
      }
    }
  },
  {
    url: '/mock/request/3',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'request-3'
      }
    }
  },
  {
    url: '/mock/request/4',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'request-4'
      }
    }
  },
  {
    url: '/mock/request/5',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'request-5'
      }
    }
  },
  {
    /**
     * 模拟请求失败的 API，用于模拟 token 过期的场景
     */
    url: '/mock/request/expired',
    method: 'get',
    /**
     * 超时时间设置为 0，模拟即时失败的请求
     */
    timeout: 0,
    /**
     * 响应函数：返回 token 过期的错误信息
     * @returns {object} 返回包含错误码和错误消息的响应
     */
    response: () => {
      return {
        code: 401,
        message: 'token expired'
      }
    }
  }
]
