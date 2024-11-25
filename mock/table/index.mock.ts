/**
 * @file 模拟接口定义文件
 * @description 提供了多个模拟接口，包括树形列表、普通列表、保存、详情和删除等操作
 * @example 引入此文件即可在开发环境中使用这些模拟接口
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-19
 * @module MockTable
 */

// 引入 Mock.js 库，用于生成模拟数据
import Mock from 'mockjs'

// 引入常量定义，SUCCESS_CODE 表示成功的状态码
import { SUCCESS_CODE } from '@/constants'

// 引入工具函数，用于生成唯一字符串
import { toAnyString } from '@/utils'

/**
 * 响应延迟时间，单位为毫秒
 */
const timeout = 1000

/**
 * 数据条目数
 */
const count = 100

/**
 * 基础 HTML 内容
 */
const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'

/**
 * 列表数据的属性定义
 */
interface ListProps {
  /** 数据唯一标识 */
  id: string
  /** 作者 */
  author: string
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 重要性级别 */
  importance: number
  /** 显示时间 */
  display_time: any
  /** 浏览次数 */
  pageviews: number
  /** 图片地址 */
  image_uri: string
  /** 视频地址（可选） */
  video_uri?: string
}

/**
 * 树形列表数据的属性定义
 */
interface TreeListProps {
  /** 数据唯一标识 */
  id: string
  /** 作者 */
  author: string
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 重要性级别 */
  importance: number
  /** 显示时间 */
  display_time: any
  /** 图片地址 */
  image_uri: string
  /** 浏览次数 */
  pageviews: number
  /** 视频地址（可选） */
  video_uri?: string
  /** 子节点数据（可选） */
  children?: TreeListProps[]
}

/**
 * 列表数组
 */
let List: ListProps[] = []

// 使用循环生成模拟数据并添加到列表中
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: toAnyString(), // 使用工具函数生成唯一标识
      author: '@first', // 随机生成作者名
      title: '@title(5, 10)', // 随机生成标题
      content: baseContent, // 设置固定内容
      importance: '@integer(1, 3)', // 随机生成重要性
      display_time: '@datetime', // 随机生成时间
      pageviews: '@integer(100, 500)', // 随机生成浏览次数
      image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)'), // 随机生成图片地址
      video_uri:
        '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4' // 固定视频地址
    })
  )
}

/**
 * 树形列表数组
 */
const treeList: TreeListProps[] = []

// 使用循环生成模拟数据并添加到树形列表中
for (let i = 0; i < count; i++) {
  treeList.push(
    Mock.mock({
      id: toAnyString(), // 使用工具函数生成唯一标识
      author: '@first', // 随机生成作者名
      title: '@title(5, 10)', // 随机生成标题
      content: baseContent, // 设置固定内容
      importance: '@integer(1, 3)', // 随机生成重要性
      display_time: '@datetime', // 随机生成时间
      pageviews: '@integer(300, 5000)', // 随机生成浏览次数
      image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)'), // 随机生成图片地址
      children: [
        {
          id: toAnyString(),
          // timestamp: +Mock.Random.date('T'),
          author: '@first',
          title: '@title(5, 10)',
          content: baseContent,
          importance: '@integer(1, 3)',
          display_time: '@datetime',
          pageviews: '@integer(300, 5000)',
          image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)'),
          children: [
            {
              id: toAnyString(),
              // timestamp: +Mock.Random.date('T'),
              author: '@first',
              title: '@title(5, 10)',
              content: baseContent,
              importance: '@integer(1, 3)',
              display_time: '@datetime',
              pageviews: '@integer(300, 5000)',
              image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)')
            },
            {
              id: toAnyString(),
              // timestamp: +Mock.Random.date('T'),
              author: '@first',
              title: '@title(5, 10)',
              content: baseContent,
              importance: '@integer(1, 3)',
              display_time: '@datetime',
              pageviews: '@integer(300, 5000)',
              image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)')
            }
          ]
        },
        {
          id: toAnyString(),
          // timestamp: +Mock.Random.date('T'),
          author: '@first',
          title: '@title(5, 10)',
          content: baseContent,
          importance: '@integer(1, 3)',
          display_time: '@datetime',
          pageviews: '@integer(300, 5000)',
          image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)')
        },
        {
          id: toAnyString(),
          // timestamp: +Mock.Random.date('T'),
          author: '@first',
          title: '@title(5, 10)',
          content: baseContent,
          importance: '@integer(1, 3)',
          display_time: '@datetime',
          pageviews: '@integer(300, 5000)',
          image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)')
        },
        {
          id: toAnyString(),
          // timestamp: +Mock.Random.date('T'),
          author: '@first',
          title: '@title(5, 10)',
          content: baseContent,
          importance: '@integer(1, 3)',
          display_time: '@datetime',
          pageviews: '@integer(300, 5000)',
          image_uri: Mock.Random.image('@integer(100, 500)x@integer(100, 500)')
        }
      ]
      // image_uri
    })
  )
}

/**
 * 卡片列表
 */
const cardList = [
  {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    name: 'Alipay',
    desc: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  },
  {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    name: 'Angular',
    desc: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  },
  {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    name: 'Bootstrap',
    desc: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  },
  {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    name: 'React',
    desc: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  },
  {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
    name: 'Vue',
    desc: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  },
  {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
    name: 'Webpack',
    desc: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  }
]

/**
 * 导出模拟接口配置
 */
export default [
  // 树形列表接口
  {
    url: '/mock/example/treeList',
    method: 'get',
    timeout,
    /**
     * 响应函数
     * @param {Object} query 查询参数
     * @returns 模拟数据
     */
    response: ({ query }) => {
      const { title, pageIndex, pageSize } = query // 解构查询参数
      const mockList = treeList.filter((item) => {
        if (title && item.title.indexOf(title) < 0) return false // 过滤数据
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: SUCCESS_CODE, // 返回成功状态码
        data: {
          total: mockList.length, // 数据总数
          list: pageList // 当前页数据
        }
      }
    }
  },
  // 列表接口
  {
    url: '/mock/example/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { title, pageIndex, pageSize } = query
      const mockList = List.filter((item) => {
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: SUCCESS_CODE,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },
  // 保存接口
  {
    url: '/mock/example/save',
    method: 'post',
    timeout,
    response: ({ body }) => {
      if (!body.id) {
        List = [
          Object.assign(body, {
            id: toAnyString()
          })
        ].concat(List)
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      } else {
        List.map((item) => {
          if (item.id === body.id) {
            for (const key in item) {
              item[key] = body[key]
            }
          }
        })
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      }
    }
  },
  // 详情接口
  {
    url: '/mock/example/detail',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      for (const example of List) {
        if (example.id === id) {
          return {
            code: SUCCESS_CODE,
            data: example
          }
        }
      }
    }
  },
  // 删除接口
  {
    url: '/mock/example/delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids
      if (!ids) {
        return {
          code: 500,
          message: '请选择需要删除的数据'
        }
      } else {
        let i = List.length
        while (i--) {
          if (ids.indexOf(List[i].id) !== -1) {
            List.splice(i, 1)
          }
        }
        return {
          code: SUCCESS_CODE,
          data: 'success'
        }
      }
    }
  },
  {
    url: '/mock/card/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { name, pageIndex, pageSize } = query
      const mockList = cardList.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )
      return {
        code: SUCCESS_CODE,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  }
]
