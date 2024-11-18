/**
 * @file index.ts
 * @description 部门相关的API接口
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module api
 */

// 导入request模块用于发送HTTP请求
import request from '@/axios'
// 导入类型定义
import { DepartmentListResponse, DepartmentUserParams, DepartmentUserResponse } from './types'

/**
 * 获取部门列表的API请求
 * @returns {Promise<DepartmentListResponse>} 返回部门列表的响应
 */
export const getDepartmentApi = () => {
  return request.get<DepartmentListResponse>({ url: '/mock/department/list' })
}

/**
 * 根据用户ID获取用户信息的API请求
 * @param {DepartmentUserParams} params - 请求参数，包括用户ID等信息
 * @returns {Promise<DepartmentUserResponse>} 返回用户信息的响应
 */
export const getUserByIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/mock/department/users', params })
}

/**
 * 根据用户ID删除用户的API请求
 * @param {string[] | number[]} ids - 要删除的用户ID数组
 * @returns {Promise<any>} 返回删除用户操作的响应
 */
export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/mock/department/user/delete', data: { ids } })
}

/**
 * 保存用户信息的API请求
 * @param {any} data - 要保存的用户数据
 * @returns {Promise<any>} 返回保存用户操作的响应
 */
export const saveUserApi = (data: any) => {
  return request.post({ url: '/mock/department/user/save', data })
}

/**
 * 保存部门信息的API请求
 * @param {any} data - 要保存的部门数据
 * @returns {Promise<any>} 返回保存部门操作的响应
 */
export const saveDepartmentApi = (data: any) => {
  return request.post({ url: '/mock/department/save', data })
}

/**
 * 根据ID删除部门的API请求
 * @param {string[] | number[]} ids - 要删除的部门ID数组
 * @returns {Promise<any>} 返回删除部门操作的响应
 */
export const deleteDepartmentApi = (ids: string[] | number[]) => {
  return request.post({ url: '/mock/department/delete', data: { ids } })
}

/**
 * 获取部门表格数据的API请求
 * @param {any} params - 请求参数
 * @returns {Promise<any>} 返回部门表格数据的响应
 */
export const getDepartmentTableApi = (params: any) => {
  return request.get({ url: '/mock/department/table/list', params })
}
