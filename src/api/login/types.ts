/**
 * @file types.ts
 * @description 定义用户登录相关的数据类型接口
 * @example
 * const userLogin: UserLoginType = { username: 'user1', password: 'pass123' };
 * const user: UserType = { username: 'user1', password: 'pass123', role: 'admin', roleId: '1' };
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module User Types
 */

/** 定义用户登录类型接口 */
export interface UserLoginType {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** 定义用户类型接口 */
export interface UserType {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 用户角色 */
  role: string
  /** 角色ID */
  roleId: string
}
