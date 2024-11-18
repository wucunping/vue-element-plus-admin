/**
 * @file types.ts
 * @description 定义部门相关的数据类型
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module types
 */

/**
 * DepartmentItem 接口
 * 表示部门的基本信息
 */
export interface DepartmentItem {
  /** 部门的唯一标识符 */
  id: string
  /** 部门的名称 */
  departmentName: string
  /** 子部门列表（可选） */
  children?: DepartmentItem[]
}

/**
 * DepartmentListResponse 接口
 * 表示部门列表的响应结构
 */
export interface DepartmentListResponse {
  /** 部门项的数组 */
  list: DepartmentItem[]
}

/**
 * DepartmentUserParams 接口
 * 表示获取用户信息的请求参数
 */
export interface DepartmentUserParams {
  /** 每页的用户数量 */
  pageSize: number
  /** 当前页的索引 */
  pageIndex: number
  /** 部门的唯一标识符 */
  id: string
  /** 用户名（可选） */
  username?: string
  /** 账号（可选） */
  account?: string
}

/**
 * DepartmentUserItem 接口
 * 表示部门用户的基本信息
 */
export interface DepartmentUserItem {
  /** 用户的唯一标识符 */
  id: string
  /** 用户名 */
  username: string
  /** 账号名 */
  account: string
  /** 电子邮箱 */
  email: string
  /** 创建时间 */
  createTime: string
  /** 用户角色 */
  role: string
  /** 所属部门信息 */
  department: DepartmentItem
}

/**
 * DepartmentUserResponse 接口
 * 表示获取用户信息的响应结构
 */
export interface DepartmentUserResponse {
  /** 用户项的数组 */
  list: DepartmentUserItem[]
  /** 用户总数 */
  total: number
}
