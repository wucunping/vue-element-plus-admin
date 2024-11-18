/**
 * @file types.ts
 * @description 定义项目相关的数据类型
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module types
 */

/**
 * WorkplaceTotal 类型
 * 包含当前工作场所的总数据信息
 */
export type WorkplaceTotal = {
  /** 项目的数量 */
  project: number
  /** 访问的数量 */
  access: number
  /** 待办事项的数量 */
  todo: number
}

/**
 * Project 类型
 * 表示项目的基本信息
 */
export type Project = {
  /** 项目的名称 */
  name: string
  /** 项目的图标 */
  icon: string
  /** 项目的信息描述 */
  message: string
  /** 个人的标识信息 */
  personal: string
  /** 项目时间，可以是日期、数字或字符串 */
  time: Date | number | string
}

/**
 * Dynamic 类型
 * 用于存储动态信息的结构
 */
export type Dynamic = {
  /** 动态的键名数组 */
  keys: string[]
  /** 动态时间，可以是日期、数字或字符串 */
  time: Date | number | string
}

/**
 * Team 类型
 * 表示团队的基本信息
 */
export type Team = {
  /** 团队的名称 */
  name: string
  /** 团队的图标 */
  icon: string
}

/**
 * RadarData 类型
 * 用于雷达图的数据结构
 */
export type RadarData = {
  /** 个人的评分 */
  personal: number
  /** 团队的评分 */
  team: number
  /** 最大评分值 */
  max: number
  /** 数据项的名称 */
  name: string
}
