/**
 * @file index.ts
 * @description 示例表格相关的API请求
 * @example
 *  const tableList = await getTableListApi(params);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module tableApi
 */

// 导入axios请求实例
import request from '@/axios'

// 导入类型定义
import type { TableData } from './types'

/**
 * 获取示例列表的API
 *
 * @param {any} params - 请求参数
 * @returns {Promise} 返回一个Promise，解决为示例列表数据
 */
export const getTableListApi = (params: any) => {
  // 发送GET请求以获取示例列表
  return request.get({ url: '/mock/example/list', params })
}

/**
 * 获取卡片表格列表的API
 *
 * @param {any} params - 请求参数
 * @returns {Promise} 返回一个Promise，解决为卡片表格列表数据
 */
export const getCardTableListApi = (params: any) => {
  // 发送GET请求以获取卡片表格列表
  return request.get({ url: '/mock/card/list', params })
}

/**
 * 获取树形表格列表的API
 *
 * @param {any} params - 请求参数
 * @returns {Promise} 返回一个Promise，解决为树形表格列表数据
 */
export const getTreeTableListApi = (params: any) => {
  // 发送GET请求以获取树形表格列表
  return request.get({ url: '/mock/example/treeList', params })
}

/**
 * 保存表格数据的API
 *
 * @param {Partial<TableData>} data - 表格数据
 * @returns {Promise<IResponse>} 返回一个Promise，解决为保存操作的响应结果
 */
export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  // 发送POST请求以保存表格数据
  return request.post({ url: '/mock/example/save', data })
}

/**
 * 获取表格详情的API
 *
 * @param {string} id - 表格项的唯一标识符
 * @returns {Promise<IResponse<TableData>>} 返回一个Promise，解决为表格详情数据
 */
export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  // 发送GET请求以获取表格详情
  return request.get({ url: '/mock/example/detail', params: { id } })
}

/**
 * 删除表格数据的API
 *
 * @param {string[] | number[]} ids - 要删除的表格项的ID列表
 * @returns {Promise<IResponse>} 返回一个Promise，解决为删除操作的响应结果
 */
export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  // 发送POST请求以删除表格数据
  return request.post({ url: '/mock/example/delete', data: { ids } })
}
