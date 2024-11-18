/**
 * @file index.ts
 * @description 角色列表相关的API请求
 * @example
 *  const roleList = await getRoleListApi();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module roleApi
 */

// 导入axios请求实例
import request from '@/axios'

/**
 * 获取角色列表的API
 *
 * @returns {Promise} 返回一个Promise，解决为角色列表数据
 */
export const getRoleListApi = () => {
  // 发送GET请求以获取角色列表
  return request.get({ url: '/mock/role/table' })
}
