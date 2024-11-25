/**
 * @file dictMock.ts
 * @description 模拟字典相关接口的数据返回，用于模拟字典管理相关功能。
 * @example 包括字典列表接口和获取单个字典的接口。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module dictMock
 */

// 导入请求成功的返回码常量
import { SUCCESS_CODE } from '@/constants'

/*** 模拟接口延时（毫秒） ***/
const timeout = 1000

/*** 字典对象数据 ***/
const dictObj: Recordable = {
  /** 重要性字典列表 **/
  importance: [
    {
      value: 0, // 值为0
      label: 'tableDemo.commonly' // 标签为“普通”
    },
    {
      value: 1, // 值为1
      label: 'tableDemo.good' // 标签为“良好”
    },
    {
      value: 2, // 值为2
      label: 'tableDemo.important' // 标签为“重要”
    }
  ]
}

/*** 模拟接口集合 ***/
export default [
  /**
   * 字典列表接口
   * @description 获取字典列表
   */
  {
    url: '/mock/dict/list', // 请求路径
    method: 'get', // 请求方法
    timeout, // 延时时间
    response: () => {
      return {
        code: SUCCESS_CODE, // 返回成功状态码
        data: dictObj // 返回字典数据
      }
    }
  },
  /**
   * 获取单个字典接口
   * @description 根据需求获取单个字典内容
   */
  {
    url: '/mock/dict/one', // 请求路径
    method: 'get', // 请求方法
    timeout, // 延时时间
    response: () => {
      return {
        code: SUCCESS_CODE, // 返回成功状态码
        data: [
          {
            label: 'test1', // 标签为“test1”
            value: 0 // 值为0
          },
          {
            label: 'test2', // 标签为“test2”
            value: 1 // 值为1
          },
          {
            label: 'test3', // 标签为“test3”
            value: 2 // 值为2
          }
        ] // 返回的单个字典内容
      }
    }
  }
]
