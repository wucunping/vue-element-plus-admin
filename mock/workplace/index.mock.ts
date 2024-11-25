/**
 * @file 工作台相关的模拟接口
 * @description 提供获取统计、项目、动态、团队信息和指数的模拟接口
 * @example 使用此文件模拟工作台相关的接口数据
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module MockWorkplaceAPI
 */

// 引入常量 SUCCESS_CODE，表示请求成功的状态码
import { SUCCESS_CODE } from '@/constants'

/**
 * 接口响应延迟时间，单位为毫秒
 */
const timeout = 1000

/**
 * 导出工作台相关的模拟接口配置
 */
export default [
  /**
   * 获取统计接口
   */
  {
    url: '/mock/workplace/total', // 接口地址
    method: 'get', // 请求方法
    timeout, // 接口延迟时间
    /**
     * 响应函数
     * @returns 返回统计数据
     */
    response: () => {
      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: {
          project: 40, // 项目数
          access: 2340, // 访问量
          todo: 10 // 待办事项数量
        }
      }
    }
  },
  /**
   * 获取项目接口
   */
  {
    url: '/mock/workplace/project', // 接口地址
    method: 'get', // 请求方法
    timeout, // 接口延迟时间
    /**
     * 响应函数
     * @returns 返回项目数据列表
     */
    response: () => {
      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: [
          {
            name: 'Github', // 项目名称
            icon: 'akar-icons:github-fill', // 项目图标
            message: 'workplace.introduction', // 项目描述
            personal: 'Archer', // 负责人
            time: new Date() // 更新时间
          },
          {
            name: 'Vue',
            icon: 'logos:vue',
            message: 'workplace.introduction',
            personal: 'Archer',
            time: new Date()
          },
          {
            name: 'Angular',
            icon: 'logos:angular-icon',
            message: 'workplace.introduction',
            personal: 'Archer',
            time: new Date()
          },
          {
            name: 'React',
            icon: 'logos:react',
            message: 'workplace.introduction',
            personal: 'Archer',
            time: new Date()
          },
          {
            name: 'Webpack',
            icon: 'logos:webpack',
            message: 'workplace.introduction',
            personal: 'Archer',
            time: new Date()
          },
          {
            name: 'Vite',
            icon: 'vscode-icons:file-type-vite',
            message: 'workplace.introduction',
            personal: 'Archer',
            time: new Date()
          }
        ]
      }
    }
  },
  /**
   * 获取动态接口
   */
  {
    url: '/mock/workplace/dynamic', // 接口地址
    method: 'get', // 请求方法
    timeout, // 接口延迟时间
    /**
     * 响应函数
     * @returns 返回动态数据列表
     */
    response: () => {
      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: [
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          }
        ]
      }
    }
  },
  /**
   * 获取团队信息接口
   */
  {
    url: '/mock/workplace/team', // 接口地址
    method: 'get', // 请求方法
    timeout, // 接口延迟时间
    /**
     * 响应函数
     * @returns 返回团队信息列表
     */
    response: () => {
      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: [
          {
            name: 'Github', // 团队名称
            icon: 'akar-icons:github-fill' // 团队图标
          },
          {
            name: 'Vue',
            icon: 'logos:vue'
          },
          {
            name: 'Angular',
            icon: 'logos:angular-icon'
          },
          {
            name: 'React',
            icon: 'logos:react'
          },
          {
            name: 'Webpack',
            icon: 'logos:webpack'
          },
          {
            name: 'Vite',
            icon: 'vscode-icons:file-type-vite'
          }
        ]
      }
    }
  },
  /**
   * 获取指数接口
   */
  {
    url: '/mock/workplace/radar', // 接口地址
    method: 'get', // 请求方法
    timeout, // 接口延迟时间
    /**
     * 响应函数
     * @returns 返回指数数据列表
     */
    response: () => {
      return {
        code: SUCCESS_CODE, // 请求成功状态码
        data: [
          { name: 'workplace.quote', max: 65, personal: 42, team: 50 }, // 引用指数
          { name: 'workplace.contribution', max: 160, personal: 30, team: 140 }, // 贡献指数
          { name: 'workplace.hot', max: 300, personal: 20, team: 28 }, // 热度指数
          { name: 'workplace.yield', max: 130, personal: 35, team: 35 }, // 产出指数
          { name: 'workplace.follow', max: 100, personal: 80, team: 90 } // 关注指数
        ]
      }
    }
  }
]
