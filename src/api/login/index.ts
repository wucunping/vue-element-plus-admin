/**
 * @file index.ts
 * @description 用户登录相关API请求接口
 * @example
 * const loginResponse = await loginApi({ username: 'user1', password: 'pass123' });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module User API
 */

// 导入请求工具
import request from '@/axios'
// 导入用户类型
import type { UserType } from './types'

/**
 * 角色参数接口
 */
interface RoleParams {
  /** 角色名称 */
  roleName: string
}

/**
 * 用户登录API
 * @param {UserType} data - 登录所需的用户信息
 * @returns {Promise<IResponse<UserType>>} - 返回一个Promise，包含登录响应
 */
export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/mock/user/login', data })
}

/**
 * 用户登出API
 * @returns {Promise<IResponse>} - 返回一个Promise，包含登出响应
 */
export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

/**
 * 获取用户列表API
 * @param {AxiosConfig} params - 请求参数
 * @returns {Promise<IResponse<{ list: UserType[], total: number}>>} - 返回一个Promise，包含用户列表响应
 */
export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

/**
 * 获取管理员角色API
 * @param {RoleParams} params - 角色参数
 * @returns {Promise<IResponse<AppCustomRouteRecordRaw[]>>} - 返回一个Promise，包含角色信息响应
 */
export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

/**
 * 获取测试角色API
 * @param {RoleParams} params - 角色参数
 * @returns {Promise<IResponse<string[]>>} - 返回一个Promise，包含测试角色响应
 */
export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
