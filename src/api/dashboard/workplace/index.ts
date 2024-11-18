/**
 * @file index.ts
 * @description 包含与获取工作场所相关的数据的 API 函数
 * @example
 * // 使用示例
 * getCountApi().then(response => {
 *   console.log(response.data);
 * });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module WorkplaceApi
 */

import request from '@/axios' // 导入请求模块
import type { WorkplaceTotal, Project, Dynamic, Team, RadarData } from './types' // 导入类型定义

/**
 * 获取工作场所总计数据的 API
 * @returns Promise<IResponse<WorkplaceTotal>> - 返回工作场所总计的数据
 */
export const getCountApi = (): Promise<IResponse<WorkplaceTotal>> => {
  return request.get({ url: '/mock/workplace/total' })
}

/**
 * 获取项目数据的 API
 * @returns Promise<IResponse<Project>> - 返回项目的数据
 */
export const getProjectApi = (): Promise<IResponse<Project>> => {
  return request.get({ url: '/mock/workplace/project' })
}

/**
 * 获取动态数据的 API
 * @returns Promise<IResponse<Dynamic[]>> - 返回动态数据的数组
 */
export const getDynamicApi = (): Promise<IResponse<Dynamic[]>> => {
  return request.get({ url: '/mock/workplace/dynamic' })
}

/**
 * 获取团队数据的 API
 * @returns Promise<IResponse<Team[]>> - 返回团队数据的数组
 */
export const getTeamApi = (): Promise<IResponse<Team[]>> => {
  return request.get({ url: '/mock/workplace/team' })
}

/**
 * 获取雷达数据的 API
 * @returns Promise<IResponse<RadarData[]>> - 返回雷达数据的数组
 */
export const getRadarApi = (): Promise<IResponse<RadarData[]>> => {
  return request.get({ url: '/mock/workplace/radar' })
}
