/**
 * @file types.ts
 * @description 定义与分析相关的数据类型
 * @example
 * // 使用方法示例
 * const analysis: AnalysisTotalTypes = {
 *   users: 100,
 *   messages: 200,
 *   moneys: 300,
 *   shoppings: 400
 * }
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module AnalysisTypes
 */

/**
 * 分析总计类型，包含用户、消息、金额和购物记录的数量
 */
export type AnalysisTotalTypes = {
  /** 用户数 */
  users: number
  /** 消息数 */
  messages: number
  /** 金额 */
  moneys: number
  /** 购物数 */
  shoppings: number
}

/**
 * 用户访问来源类型，包含值和名称
 */
export type UserAccessSource = {
  /** 访问来源的值 */
  value: number
  /** 访问来源的名称 */
  name: string
}

/**
 * 每周用户活动类型，包含值和名称
 */
export type WeeklyUserActivity = {
  /** 活动值 */
  value: number
  /** 活动名称 */
  name: string
}

/**
 * 月销售数据类型，包含名称、预计值和实际值
 */
export type MonthlySales = {
  /** 销售名称 */
  name: string
  /** 预计销售额 */
  estimate: number
  /** 实际销售额 */
  actual: number
}
