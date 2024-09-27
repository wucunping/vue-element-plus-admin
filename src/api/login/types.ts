/**
 * @file 文件名: types.ts
 * @description 用户登录和信息类型接口定义
 * @example
 * const userLogin: UserLoginType = {
 *     username: 'user123',
 *     password: 'securePassword'
 * };
 *
 * const user: UserType = {
 *     username: 'user123',
 *     password: 'securePassword',
 *     role: 'admin',
 *     roleId: '1'
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module User Types
 */

/**
 * 用户登录信息类型接口
 */
export interface UserLoginType {
	/** 用户名 */
	username: string // 用户的登录名
	/** 密码 */
	password: string // 用户的登录密码
}

/**
 * 用户信息类型接口
 */
export interface UserType {
	/** 用户名 */
	username: string // 用户的名称
	/** 密码 */
	password: string // 用户的密码
	/** 角色 */
	role: string // 用户的角色，例如：管理员、普通用户等
	/** 角色ID */
	roleId: string // 用户角色的唯一标识符
}
