/**
 * @file index.ts
 * @description 数据分析相关 API 接口
 * @example
 * import { getCountApi, getUserAccessSourceApi } from './index';
 *
 * getCountApi().then(response => console.log(response));
 * getUserAccessSourceApi().then(response => console.log(response));
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module analysis
 */

import request from '@/axios' // 导入自定义的 axios 请求实例
// 导入类型定义
import type {
  AnalysisTotalTypes, // 数据分析总量类型
  UserAccessSource, // 用户访问来源类型
  WeeklyUserActivity, // 每周用户活动类型
  MonthlySales // 每月销售数据类型
} from './types' // 从 types 模块导入相关类型

/**
 * 获取分析总量数据
 * @function getCountApi
 * @returns {Promise<IResponse<AnalysisTotalTypes[]>>} 返回一个 Promise 对象，包含分析总量数据
 */
export const getCountApi = (): Promise<IResponse<AnalysisTotalTypes[]>> => {
  return request.get({ url: '/mock/analysis/total' }) // 发送 GET 请求获取分析总量数据
}

/**
 * 获取用户访问来源数据
 * @function getUserAccessSourceApi
 * @returns {Promise<IResponse<UserAccessSource[]>>} 返回一个 Promise 对象，包含用户访问来源数据
 */
export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: '/mock/analysis/userAccessSource' }) // 发送 GET 请求获取用户访问来源数据
}

/**
 * 获取每周用户活动数据
 * @function getWeeklyUserActivityApi
 * @returns {Promise<IResponse<WeeklyUserActivity[]>>} 返回一个 Promise 对象，包含每周用户活动数据
 */
export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: '/mock/analysis/weeklyUserActivity' }) // 发送 GET 请求获取每周用户活动数据
}

/**
 * 获取每月销售数据
 * @function getMonthlySalesApi
 * @returns {Promise<IResponse<MonthlySales[]>>} 返回一个 Promise 对象，包含每月销售数据
 */
export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: '/mock/analysis/monthlySales' }) // 发送 GET 请求获取每月销售数据
}
