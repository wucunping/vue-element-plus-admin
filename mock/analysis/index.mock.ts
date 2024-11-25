/**
 * @file analysisMock.ts
 * @description 用于分析页的 Mock 接口，模拟数据返回，支持用户统计、来源、活跃量等数据。
 * @example
 * 使用 Mock 服务时，可以通过调用对应的 URL 获取模拟数据。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module analysisMock
 */

// 导入常量 SUCCESS_CODE 表示请求成功的返回码
import { SUCCESS_CODE } from '@/constants'

// 导入 MockMethod 类型
import { MockMethod } from 'vite-plugin-mock'

/*** 请求延迟时间 ***/
const timeout = 1000

/*** 默认导出 Mock 数据集合 ***/
export default [
  /**
   * 分析页统计接口
   * URL: /mock/analysis/total
   * Method: GET
   * Timeout: 1000ms
   */
  {
    url: '/mock/analysis/total', // 接口地址
    method: 'get', // 请求方法
    timeout, // 请求延迟
    response: () => {
      return {
        code: SUCCESS_CODE, // 返回码
        data: {
          users: 102400, // 用户数量
          messages: 81212, // 消息数量
          moneys: 9280, // 收入金额
          shoppings: 13600 // 购物量
        }
      }
    }
  },
  /**
   * 用户来源接口
   * URL: /mock/analysis/userAccessSource
   * Method: GET
   * Timeout: 1000ms
   */
  {
    url: '/mock/analysis/userAccessSource',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 1000, name: 'analysis.directAccess' }, // 直接访问
          { value: 310, name: 'analysis.mailMarketing' }, // 邮件营销
          { value: 234, name: 'analysis.allianceAdvertising' }, // 联盟广告
          { value: 135, name: 'analysis.videoAdvertising' }, // 视频广告
          { value: 1548, name: 'analysis.searchEngines' } // 搜索引擎
        ]
      }
    }
  },
  /**
   * 每周用户活跃量接口
   * URL: /mock/analysis/weeklyUserActivity
   * Method: GET
   * Timeout: 1000ms
   */
  {
    url: '/mock/analysis/weeklyUserActivity',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 13253, name: 'analysis.monday' }, // 周一
          { value: 34235, name: 'analysis.tuesday' }, // 周二
          { value: 26321, name: 'analysis.wednesday' }, // 周三
          { value: 12340, name: 'analysis.thursday' }, // 周四
          { value: 24643, name: 'analysis.friday' }, // 周五
          { value: 1322, name: 'analysis.saturday' }, // 周六
          { value: 1324, name: 'analysis.sunday' } // 周日
        ]
      }
    }
  },
  /**
   * 每月销售额接口
   * URL: /mock/analysis/monthlySales
   * Method: GET
   * Timeout: 1000ms
   */
  {
    url: '/mock/analysis/monthlySales',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { estimate: 100, actual: 120, name: 'analysis.january' }, // 一月
          { estimate: 120, actual: 82, name: 'analysis.february' }, // 二月
          { estimate: 161, actual: 91, name: 'analysis.march' }, // 三月
          { estimate: 134, actual: 154, name: 'analysis.april' }, // 四月
          { estimate: 105, actual: 162, name: 'analysis.may' }, // 五月
          { estimate: 160, actual: 140, name: 'analysis.june' }, // 六月
          { estimate: 165, actual: 145, name: 'analysis.july' }, // 七月
          { estimate: 114, actual: 250, name: 'analysis.august' }, // 八月
          { estimate: 163, actual: 134, name: 'analysis.september' }, // 九月
          { estimate: 185, actual: 56, name: 'analysis.october' }, // 十月
          { estimate: 118, actual: 99, name: 'analysis.november' }, // 十一月
          { estimate: 123, actual: 123, name: 'analysis.december' } // 十二月
        ]
      }
    }
  }
] as MockMethod[]
