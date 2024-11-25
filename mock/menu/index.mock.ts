/**
 * @file menu.mock.ts
 * @description 模拟菜单管理相关接口的数据返回，包括菜单的层级结构和权限配置。
 * @example 提供获取菜单列表的接口。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module menuMock
 */

// 引入 Mock.js，用于生成模拟数据
import Mock from 'mockjs'

// 引入常量：成功状态码
import { SUCCESS_CODE } from '@/constants'

/**
 * @const {number} timeout 接口延迟时间，单位：毫秒
 */
const timeout = 1000

/**
 * @type {Array} MockMethod[] 模拟接口数据定义
 */
export default [
  /**
   * 菜单列表接口
   * @property {string} url 接口路径
   * @property {string} method 请求方法
   * @property {number} timeout 接口延迟
   * @property {Function} response 接口响应
   */
  {
    url: '/mock/menu/list', // 接口路径
    method: 'get', // 请求方法
    timeout, // 接口延迟时间
    response: () => {
      return {
        code: SUCCESS_CODE, // 响应状态码
        data: {
          list: [
            {
              path: '/dashboard', // 菜单路径
              component: '#', // 菜单组件占位符
              redirect: '/dashboard/analysis', // 重定向路径
              name: 'Dashboard', // 菜单名称
              status: Mock.Random.integer(0, 1), // 菜单状态，0 表示禁用，1 表示启用
              id: 1, // 菜单 ID
              type: 0, // 菜单类型，0 表示主菜单
              parentId: undefined, // 父菜单 ID，顶级菜单无父级
              title: '首页', // 菜单标题
              meta: {
                title: '首页', // 菜单元数据标题
                icon: 'vi-ant-design:dashboard-filled', // 菜单图标
                alwaysShow: true // 是否始终显示菜单
              },
              children: [
                {
                  path: 'analysis', // 子菜单路径
                  component: 'views/Dashboard/Analysis', // 子菜单组件路径
                  name: 'Analysis', // 子菜单名称
                  status: Mock.Random.integer(0, 1), // 子菜单状态
                  id: 2, // 子菜单 ID
                  type: 1, // 菜单类型，1 表示子菜单
                  parentId: 1, // 父菜单 ID
                  title: '分析页', // 菜单标题
                  permissionList: [
                    { id: 1, label: '新增', value: 'add' }, // 权限：新增
                    { id: 2, label: '编辑', value: 'edit' } // 权限：编辑
                  ],
                  meta: {
                    title: '分析页', // 菜单元数据标题
                    noCache: true, // 是否缓存页面
                    permission: ['add', 'edit'] // 菜单权限
                  }
                },
                {
                  path: 'workplace', // 子菜单路径
                  component: 'views/Dashboard/Workplace', // 子菜单组件路径
                  name: 'Workplace', // 子菜单名称
                  status: Mock.Random.integer(0, 1), // 子菜单状态
                  id: 3, // 子菜单 ID
                  type: 1, // 菜单类型，1 表示子菜单
                  parentId: 1, // 父菜单 ID
                  title: '工作台', // 菜单标题
                  permissionList: [
                    { id: 1, label: '新增', value: 'add' }, // 权限：新增
                    { id: 2, label: '编辑', value: 'edit' }, // 权限：编辑
                    { id: 3, label: '删除', value: 'delete' } // 权限：删除
                  ],
                  meta: {
                    title: '工作台', // 菜单元数据标题
                    noCache: true // 是否缓存页面
                  }
                }
              ]
            },
            {
              path: '/external-link', // 外部链接菜单路径
              component: '#', // 菜单组件占位符
              meta: {
                title: '文档', // 菜单标题
                icon: 'vi-clarity:document-solid' // 菜单图标
              },
              name: 'ExternalLink', // 菜单名称
              status: Mock.Random.integer(0, 1), // 菜单状态
              id: 4, // 菜单 ID
              type: 0, // 菜单类型
              parentId: undefined, // 父菜单 ID
              title: '文档', // 菜单标题
              children: [
                {
                  path: 'https://element-plus-admin-doc.cn/', // 外部链接路径
                  name: 'DocumentLink', // 菜单名称
                  status: Mock.Random.integer(0, 1), // 菜单状态
                  id: 5, // 菜单 ID
                  type: 1, // 菜单类型
                  parentId: 4, // 父菜单 ID
                  title: '文档', // 菜单标题
                  meta: {
                    title: '文档' // 菜单元数据标题
                  }
                }
              ]
            },
            {
              path: '/level', // 多级菜单路径
              component: '#', // 菜单组件占位符
              redirect: '/level/menu1/menu1-1/menu1-1-1', // 重定向路径
              name: 'Level', // 菜单名称
              status: Mock.Random.integer(0, 1), // 菜单状态
              id: 6, // 菜单 ID
              type: 0, // 菜单类型
              parentId: undefined, // 父菜单 ID
              title: '菜单', // 菜单标题
              meta: {
                title: '菜单', // 菜单元数据标题
                icon: 'vi-carbon:skill-level-advanced' // 菜单图标
              },
              children: [
                {
                  path: 'menu1', // 子菜单路径
                  name: 'Menu1', // 子菜单名称
                  component: '##', // 菜单组件
                  status: Mock.Random.integer(0, 1), // 菜单状态
                  id: 7, // 菜单 ID
                  type: 0, // 菜单类型
                  parentId: 6, // 父菜单 ID
                  title: '菜单1', // 菜单标题
                  redirect: '/level/menu1/menu1-1/menu1-1-1', // 重定向路径
                  meta: {
                    title: '菜单1' // 菜单元数据标题
                  },
                  children: [
                    {
                      path: 'menu1-1', // 二级菜单路径
                      name: 'Menu11', // 二级菜单名称
                      component: '##', // 菜单组件
                      status: Mock.Random.integer(0, 1), // 菜单状态
                      id: 8, // 菜单 ID
                      type: 0, // 菜单类型
                      parentId: 7, // 父菜单 ID
                      title: '菜单1-1', // 菜单标题
                      redirect: '/level/menu1/menu1-1/menu1-1-1', // 重定向路径
                      meta: {
                        title: '菜单1-1', // 菜单元数据标题
                        alwaysShow: true // 是否始终显示菜单
                      },
                      children: [
                        {
                          path: 'menu1-1-1', // 三级菜单路径
                          name: 'Menu111', // 三级菜单名称
                          component: 'views/Level/Menu111', // 菜单组件路径
                          status: Mock.Random.integer(0, 1), // 菜单状态
                          id: 9, // 菜单 ID
                          type: 1, // 菜单类型
                          parentId: 8, // 父菜单 ID
                          title: '菜单1-1-1', // 菜单标题
                          meta: {
                            title: '菜单1-1-1' // 菜单元数据标题
                          }
                        }
                      ]
                    },
                    {
                      path: 'menu1-2', // 二级菜单路径
                      name: 'Menu12', // 二级菜单名称
                      component: 'views/Level/Menu12', // 菜单组件路径
                      status: Mock.Random.integer(0, 1), // 菜单状态
                      id: 10, // 菜单 ID
                      type: 1, // 菜单类型
                      parentId: 7, // 父菜单 ID
                      title: '菜单1-2', // 菜单标题
                      meta: {
                        title: '菜单1-2' // 菜单元数据标题
                      }
                    }
                  ]
                },
                {
                  path: 'menu2', // 二级菜单路径
                  name: 'Menu2Demo', // 二级菜单名称
                  component: 'views/Level/Menu2', // 菜单组件路径
                  status: Mock.Random.integer(0, 1), // 菜单状态
                  id: 11, // 菜单 ID
                  type: 1, // 菜单类型
                  parentId: 6, // 父菜单 ID
                  title: '菜单2', // 菜单标题
                  meta: {
                    title: '菜单2' // 菜单元数据标题
                  }
                }
              ]
            },
            {
              path: '/example', // 示例菜单路径
              component: '#', // 菜单组件占位符
              redirect: '/example/example-dialog', // 重定向路径
              name: 'Example', // 菜单名称
              status: Mock.Random.integer(0, 1), // 菜单状态
              id: 12, // 菜单 ID
              type: 0, // 菜单类型
              parentId: undefined, // 父菜单 ID
              title: '综合示例', // 菜单标题
              meta: {
                title: '综合示例', // 菜单元数据标题
                icon: 'vi-ep:management', // 菜单图标
                alwaysShow: true // 是否始终显示菜单
              },
              children: [
                {
                  path: 'example-dialog', // 示例子菜单路径
                  component: 'views/Example/Dialog/ExampleDialog', // 子菜单组件路径
                  name: 'ExampleDialog', // 子菜单名称
                  status: Mock.Random.integer(0, 1), // 菜单状态
                  id: 13, // 子菜单 ID
                  type: 1, // 菜单类型
                  parentId: 12, // 父菜单 ID
                  title: '综合示例-弹窗', // 菜单标题
                  permissionList: [
                    { id: 1, label: '新增', value: 'add' }, // 权限：新增
                    { id: 2, label: '编辑', value: 'edit' }, // 权限：编辑
                    { id: 3, label: '删除', value: 'delete' }, // 权限：删除
                    { id: 4, label: '查看', value: 'view' } // 权限：查看
                  ],
                  meta: {
                    title: '综合示例-弹窗' // 菜单元数据标题
                  }
                },
                {
                  path: 'example-page', // 示例页面路径
                  component: 'views/Example/Page/ExamplePage', // 页面组件路径
                  name: 'ExamplePage', // 页面名称
                  status: Mock.Random.integer(0, 1), // 页面状态
                  id: 14, // 页面 ID
                  type: 1, // 菜单类型
                  parentId: 12, // 父菜单 ID
                  title: '综合示例-页面', // 菜单标题
                  permissionList: [
                    { id: 1, label: '新增', value: 'add' }, // 权限：新增
                    { id: 2, label: '编辑', value: 'edit' }, // 权限：编辑
                    { id: 3, label: '删除', value: 'delete' }, // 权限：删除
                    { id: 4, label: '查看', value: 'view' } // 权限：查看
                  ],
                  meta: {
                    title: '综合示例-页面' // 菜单元数据标题
                  }
                },
                {
                  path: 'example-add', // 示例新增路径
                  component: 'views/Example/Page/ExampleAdd', // 新增组件路径
                  name: 'ExampleAdd', // 新增名称
                  status: Mock.Random.integer(0, 1), // 新增状态
                  id: 15, // 新增 ID
                  type: 1, // 菜单类型
                  parentId: 12, // 父菜单 ID
                  title: '综合示例-新增', // 菜单标题
                  meta: {
                    title: '综合示例-新增', // 菜单元数据标题
                    noTagsView: true, // 是否不展示标签页
                    noCache: true, // 是否不缓存页面
                    hidden: true, // 是否隐藏菜单
                    showMainRoute: true, // 是否显示主路由
                    activeMenu: '/example/example-page' // 活跃菜单路径
                  }
                },
                {
                  path: 'example-edit', // 示例编辑路径
                  component: 'views/Example/Page/ExampleEdit', // 编辑组件路径
                  name: 'ExampleEdit', // 编辑名称
                  status: Mock.Random.integer(0, 1), // 编辑状态
                  id: 16, // 编辑 ID
                  type: 1, // 菜单类型
                  parentId: 12, // 父菜单 ID
                  title: '综合示例-编辑', // 菜单标题
                  meta: {
                    title: '综合示例-编辑', // 菜单元数据标题
                    noTagsView: true, // 是否不展示标签页
                    noCache: true, // 是否不缓存页面
                    hidden: true, // 是否隐藏菜单
                    showMainRoute: true, // 是否显示主路由
                    activeMenu: '/example/example-page' // 活跃菜单路径
                  }
                },
                {
                  path: 'example-detail', // 示例详情路径
                  component: 'views/Example/Page/ExampleDetail', // 详情组件路径
                  name: 'ExampleDetail', // 详情名称
                  status: Mock.Random.integer(0, 1), // 详情状态
                  id: 17, // 详情 ID
                  type: 1, // 菜单类型
                  parentId: 12, // 父菜单 ID
                  title: '综合示例-详情', // 菜单标题
                  meta: {
                    title: '综合示例-详情', // 菜单元数据标题
                    noTagsView: true, // 是否不展示标签页
                    noCache: true, // 是否不缓存页面
                    hidden: true, // 是否隐藏菜单
                    showMainRoute: true, // 是否显示主路由
                    activeMenu: '/example/example-page' // 活跃菜单路径
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
]
