/**
 * @file index.ts
 * @description 菜单列表 API
 * @example
 * // 调用示例
 * getMenuListApi().then(response => {
 *   console.log(response.data);
 * });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module API
 */

import request from '@/axios' // 导入 axios 请求库

/**
 * 获取菜单列表的 API 接口
 * @returns {Promise} 返回一个 Promise 对象
 */
export const getMenuListApi = () => {
  // 导出获取菜单列表的函数
  return request.get({ url: '/mock/menu/list' }) // 发送 GET 请求获取菜单列表
}
