/**
 * @file 用户相关的模拟接口
 * @description 提供用户列表、登录及退出功能的模拟接口
 * @example 使用此文件提供的模拟数据以支持开发过程中的接口请求
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module MockUserAPI
 */

// 引入常量 SUCCESS_CODE，表示请求成功的状态码
import { SUCCESS_CODE } from '@/constants'

/**
 * 接口响应的延迟时间，单位为毫秒
 */
const timeout = 1000

/**
 * 用户列表
 * @property {string} username 用户名
 * @property {string} password 密码
 * @property {string} role 用户角色
 * @property {string} roleId 角色ID
 * @property {string | string[]} permissions 用户权限，支持单个或多个权限
 */
const List: {
  username: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}[] = [
  {
    username: 'admin', // 管理员用户名
    password: 'admin', // 管理员密码
    role: 'admin', // 管理员角色
    roleId: '1', // 管理员角色ID
    permissions: ['*.*.*'] // 管理员权限，所有权限
  },
  {
    username: 'test', // 测试用户名
    password: 'test', // 测试用户密码
    role: 'test', // 测试用户角色
    roleId: '2', // 测试用户角色ID
    permissions: ['example:dialog:create', 'example:dialog:delete'] // 测试用户权限
  }
]

/**
 * 导出用户相关的模拟接口配置
 */
export default [
  /**
   * 用户列表接口
   */
  {
    url: '/mock/user/list', // 接口地址
    method: 'get', // 请求方法
    /**
     * 响应函数
     * @param {object} query 请求参数
     * @param {string} query.username 用户名查询条件
     * @param {number} query.pageIndex 当前页码
     * @param {number} query.pageSize 每页显示数量
     * @returns 模拟用户列表分页数据
     */
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query // 解构查询参数

      // 根据用户名过滤用户列表
      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false
        return true
      })

      // 分页逻辑
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )

      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: {
          total: mockList.length, // 总数据条目数
          list: pageList // 当前页数据
        }
      }
    }
  },
  /**
   * 用户登录接口
   */
  {
    url: '/mock/user/login', // 接口地址
    method: 'post', // 请求方法
    timeout, // 响应延迟时间
    /**
     * 响应函数
     * @param {object} body 请求体
     * @param {string} body.username 用户名
     * @param {string} body.password 密码
     * @returns 登录成功返回用户数据，失败返回错误信息
     */
    response: ({ body }) => {
      const data = body // 获取请求体数据
      let hasUser = false // 标记是否找到匹配的用户

      // 遍历用户列表进行匹配
      for (const user of List) {
        if (user.username === data.username && user.password === data.password) {
          hasUser = true
          return {
            code: SUCCESS_CODE, // 登录成功状态码
            data: user // 返回用户数据
          }
        }
      }

      // 如果未匹配到用户，则返回错误信息
      if (!hasUser) {
        return {
          code: 500, // 错误状态码
          message: '账号或密码错误' // 错误提示信息
        }
      }
    }
  },
  /**
   * 用户退出接口
   */
  {
    url: '/mock/user/loginOut', // 接口地址
    method: 'get', // 请求方法
    timeout, // 响应延迟时间
    /**
     * 响应函数
     * @returns 返回成功状态，无具体数据
     */
    response: () => {
      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: null // 无数据返回
      }
    }
  }
]
