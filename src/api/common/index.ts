/**
 * @file index.ts
 * @description 字典相关 API 接口
 * @example
 * import { getDictApi, getDictOneApi } from './index';
 *
 * getDictApi().then(response => console.log(response));
 * getDictOneApi().then(response => console.log(response));
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module dictionary
 */

import request from '@/axios' // 导入自定义的 axios 请求实例

/**
 * 获取所有字典
 * @function getDictApi
 * @returns {Promise} 返回一个 Promise 对象，包含所有字典的列表
 */
export const getDictApi = () => {
  return request.get({ url: '/mock/dict/list' }) // 发送 GET 请求获取字典列表
}

/**
 * 模拟获取某个字典
 * @function getDictOneApi
 * @returns {Promise} 返回一个 Promise 对象，包含某个字典的信息
 */
export const getDictOneApi = async () => {
  return request.get({ url: '/mock/dict/one' }) // 发送 GET 请求获取单个字典
}
