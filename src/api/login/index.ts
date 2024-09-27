/**
 * @file index.ts
 * @description 该文件包含与用户和角色相关的API接口方法
 * @example
 * // 登录示例
 * loginApi({ username: 'test', password: '123456' }).then(response => {
 *   console.log(response.data);
 * });
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-27
 * @module userRoleApi
 */

// 导入axios请求库
import request from '@/axios'
// 导入用户类型定义
import type { UserType } from './types'

// 定义角色参数接口
interface RoleParams {
	roleName: string // 角色名称
}

/**
 * 登录接口
 * @param data 用户信息
 * @returns Promise<IResponse<UserType>> 登录返回的用户信息
 */
export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
	return request.post({ url: '/mock/user/login', data }) // 发起登录请求
}

/**
 * 登出接口
 * @returns Promise<IResponse> 登出返回的结果
 */
export const loginOutApi = (): Promise<IResponse> => {
	return request.get({ url: '/mock/user/loginOut' }) // 发起登出请求
}

/**
 * 获取用户列表接口
 * @param params Axios配置参数
 * @returns Promise<IResponse<{ code: string; data: { list: UserType[]; total: number; }; }>> 用户列表和总数
 */
export const getUserListApi = ({ params }: AxiosConfig) => {
	return request.get<{
		code: string // 响应代码
		data: {
			list: UserType[] // 用户列表
			total: number // 用户总数
		}
	}>({ url: '/mock/user/list', params }) // 获取用户列表请求
}

/**
 * 获取管理员角色接口
 * @param params 角色参数
 * @returns Promise<IResponse<AppCustomRouteRecordRaw[]>> 管理员角色列表
 */
export const getAdminRoleApi = (
	params: RoleParams // 传入的角色参数
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
	return request.get({ url: '/mock/role/list', params }) // 获取管理员角色请求
}

/**
 * 获取测试角色接口
 * @param params 角色参数
 * @returns Promise<IResponse<string[]>> 测试角色列表
 */
export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
	return request.get({ url: '/mock/role/list2', params }) // 获取测试角色请求
}
