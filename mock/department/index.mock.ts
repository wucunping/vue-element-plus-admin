/**
 * @file departmentMock.ts
 * @description 部门模块的 Mock 数据，用于模拟部门相关接口的返回值。
 * @example 模拟部门列表、用户列表、保存和删除接口等操作。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module departmentMock
 */

// 导入生成随机字符串的方法
import { toAnyString } from '@/utils'

// 导入 Mock.js
import Mock from 'mockjs'

// 导入请求成功的返回码常量
import { SUCCESS_CODE } from '@/constants'

/*** 部门数据列表 ***/
const departmentList: any = []

/*** 城市名称列表 ***/
const citys = ['厦门总公司', '北京分公司', '上海分公司', '福州分公司', '深圳分公司', '杭州分公司']

/*** 初始化部门数据 ***/
for (let i = 0; i < 5; i++) {
  departmentList.push({
    /** 部门名称 **/
    departmentName: citys[i],
    /** 部门ID **/
    id: toAnyString(),
    /** 创建时间 **/
    createTime: '@datetime',
    /** 状态 **/
    status: Mock.Random.integer(0, 1),
    /** 备注 **/
    remark: '@cword(10, 15)',
    /** 子部门列表 **/
    children: [
      {
        departmentName: '研发部',
        id: toAnyString(),
        createTime: '@datetime',
        status: Mock.Random.integer(0, 1),
        remark: '@cword(10, 15)'
      },
      {
        departmentName: '产品部',
        id: toAnyString(),
        createTime: '@datetime',
        status: Mock.Random.integer(0, 1),
        remark: '@cword(10, 15)'
      },
      {
        departmentName: '运营部',
        id: toAnyString(),
        createTime: '@datetime',
        status: Mock.Random.integer(0, 1),
        remark: '@cword(10, 15)'
      },
      {
        departmentName: '市场部',
        id: toAnyString(),
        createTime: '@datetime',
        status: Mock.Random.integer(0, 1),
        remark: '@cword(10, 15)'
      },
      {
        departmentName: '销售部',
        id: toAnyString(),
        createTime: '@datetime',
        status: Mock.Random.integer(0, 1),
        remark: '@cword(10, 15)'
      },
      {
        departmentName: '客服部',
        id: toAnyString(),
        createTime: '@datetime',
        status: Mock.Random.integer(0, 1),
        remark: '@cword(10, 15)'
      }
    ]
  })
}

/*** 模拟接口集合 ***/
export default [
  /**
   * 部门列表接口
   * @description 获取部门列表
   */
  {
    url: '/mock/department/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: departmentList
        }
      }
    }
  },
  /**
   * 部门表格接口
   * @description 获取带分页信息的部门表格数据
   */
  {
    url: '/mock/department/table/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: departmentList,
          total: 5
        }
      }
    }
  },
  /**
   * 用户列表接口
   * @description 获取部门下的用户列表
   */
  {
    url: '/mock/department/users',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const { pageSize } = query
      /** 根据分页大小生成用户列表 **/
      const mockList: any = []
      for (let i = 0; i < pageSize; i++) {
        mockList.push(
          Mock.mock({
            username: '@cname', // 用户名
            account: '@first', // 账号
            email: '@EMAIL', // 邮箱
            createTime: '@datetime', // 创建时间
            id: toAnyString() // 用户ID
          })
        )
      }
      return {
        code: SUCCESS_CODE,
        data: {
          total: 100,
          list: mockList
        }
      }
    }
  },
  /**
   * 保存用户接口
   * @description 保存用户信息
   */
  {
    url: '/mock/department/user/save',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'success'
      }
    }
  },
  /**
   * 删除用户接口
   * @description 删除指定用户
   */
  {
    url: '/mock/department/user/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: 500,
          message: '请选择需要删除的数据'
        }
      } else {
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      }
    }
  },
  /**
   * 保存部门接口
   * @description 保存部门信息
   */
  {
    url: '/mock/department/save',
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: 'success'
      }
    }
  },
  /**
   * 删除部门接口
   * @description 删除指定部门
   */
  {
    url: '/mock/department/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: 500,
          message: '请选择需要删除的数据'
        }
      } else {
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      }
    }
  }
]
