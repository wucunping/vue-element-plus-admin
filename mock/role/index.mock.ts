/**
 * @file mock-role.ts
 * @description 模拟角色管理接口，包含角色列表、角色权限等模拟数据的接口定义。
 * @example
 * import mockRoleApi from './mock-role';
 * mockRoleApi[0].response(); // 获取角色列表数据
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module mockRole
 */

// 导入 Mock.js
import Mock from 'mockjs'

// 导入常量：表示请求成功的状态码
import { SUCCESS_CODE } from '@/constants'

// 导入工具函数：生成随机字符串
import { toAnyString } from '@/utils'

/**
 * 默认超时时间，单位为毫秒
 */
const timeout = 1000

/**
 * 管理员的路由配置列表
 */
const adminList = [
  {
    path: '/dashboard', // 路由路径
    component: '#', // 路由组件占位符
    redirect: '/dashboard/analysis', // 跳转路径
    name: 'Dashboard', // 路由名称
    meta: {
      title: 'router.dashboard', // 路由标题
      icon: 'vi-ant-design:dashboard-filled', // 路由图标
      alwaysShow: true // 是否始终显示
    },
    children: [
      {
        path: 'analysis', // 子路由路径
        component: 'views/Dashboard/Analysis', // 子路由组件
        name: 'Analysis', // 子路由名称
        meta: {
          title: 'router.analysis', // 子路由标题
          noCache: true, // 不缓存
          affix: true // 固定在标签页
        }
      },
      {
        path: 'workplace',
        component: 'views/Dashboard/Workplace',
        name: 'Workplace',
        meta: {
          title: 'router.workplace',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/external-link',
    component: '#',
    meta: {},
    name: 'ExternalLink',
    children: [
      {
        path: 'https://element-plus-admin-doc.cn/',
        name: 'DocumentLink',
        meta: {
          title: 'router.document',
          icon: 'vi-clarity:document-solid'
        }
      }
    ]
  },
  {
    path: '/guide',
    component: '#',
    name: 'Guide',
    meta: {},
    children: [
      {
        path: 'index',
        component: 'views/Guide/Guide',
        name: 'GuideDemo',
        meta: {
          title: 'router.guide',
          icon: 'vi-cib:telegram-plane'
        }
      }
    ]
  },
  {
    path: '/components',
    component: '#',
    redirect: '/components/form/default-form',
    name: 'ComponentsDemo',
    meta: {
      title: 'router.component',
      icon: 'vi-bx:bxs-component',
      alwaysShow: true
    },
    children: [
      {
        path: 'form',
        component: '##',
        name: 'Form',
        meta: {
          title: 'router.form',
          alwaysShow: true
        },
        children: [
          {
            path: 'default-form',
            component: 'views/Components/Form/DefaultForm',
            name: 'DefaultForm',
            meta: {
              title: 'router.defaultForm'
            }
          },
          {
            path: 'use-form',
            component: 'views/Components/Form/UseFormDemo',
            name: 'UseForm',
            meta: {
              title: 'UseForm'
            }
          }
        ]
      },
      {
        path: 'table',
        component: '##',
        redirect: '/components/table/default-table',
        name: 'TableDemo',
        meta: {
          title: 'router.table',
          alwaysShow: true
        },
        children: [
          {
            path: 'default-table',
            component: 'views/Components/Table/DefaultTable',
            name: 'DefaultTable',
            meta: {
              title: 'router.defaultTable'
            }
          },
          {
            path: 'use-table',
            component: 'views/Components/Table/UseTableDemo',
            name: 'UseTable',
            meta: {
              title: 'UseTable'
            }
          },
          {
            path: 'tree-table',
            component: 'views/Components/Table/TreeTable',
            name: 'TreeTable',
            meta: {
              title: 'TreeTable'
            }
          },
          {
            path: 'table-image-preview',
            component: 'views/Components/Table/TableImagePreview',
            name: 'TableImagePreview',
            meta: {
              title: 'router.PicturePreview'
            }
          },
          {
            path: 'table-video-preview',
            component: 'views/Components/Table/TableVideoPreview',
            name: 'TableVideoPreview',
            meta: {
              title: 'router.tableVideoPreview'
            }
          },
          {
            path: 'card-table',
            component: 'views/Components/Table/CardTable',
            name: 'CardTable',
            meta: {
              title: 'router.cardTable'
            }
          }
          // {
          //   path: 'ref-table',
          //   component: 'views/Components/Table/RefTable',
          //   name: 'RefTable',
          //   meta: {
          //     title: 'RefTable'
          //   }
          // }
        ]
      },
      {
        path: 'editor-demo',
        component: '##',
        redirect: '/components/editor-demo/editor',
        name: 'EditorDemo',
        meta: {
          title: 'router.editor',
          alwaysShow: true
        },
        children: [
          {
            path: 'editor',
            component: 'views/Components/Editor/Editor',
            name: 'Editor',
            meta: {
              title: 'router.richText'
            }
          },
          {
            path: 'json-editor',
            component: 'views/Components/Editor/JsonEditor',
            name: 'JsonEditor',
            meta: {
              title: 'router.jsonEditor'
            }
          },
          {
            path: 'code-editor',
            component: 'views/Components/Editor/CodeEditor',
            name: 'CodeEditor',
            meta: {
              title: 'router.codeEditor'
            }
          }
        ]
      },
      {
        path: 'search',
        component: 'views/Components/Search',
        name: 'Search',
        meta: {
          title: 'router.search'
        }
      },
      {
        path: 'descriptions',
        component: 'views/Components/Descriptions',
        name: 'Descriptions',
        meta: {
          title: 'router.descriptions'
        }
      },
      {
        path: 'image-viewer',
        component: 'views/Components/ImageViewer',
        name: 'ImageViewer',
        meta: {
          title: 'router.imageViewer'
        }
      },
      {
        path: 'dialog',
        component: 'views/Components/Dialog',
        name: 'Dialog',
        meta: {
          title: 'router.dialog'
        }
      },
      {
        path: 'icon',
        component: 'views/Components/Icon',
        name: 'Icon',
        meta: {
          title: 'router.icon'
        }
      },
      {
        path: 'icon-picker',
        component: 'views/Components/IconPicker',
        name: 'IconPicker',
        meta: {
          title: 'router.iconPicker'
        }
      },
      {
        path: 'echart',
        component: 'views/Components/Echart',
        name: 'Echart',
        meta: {
          title: 'router.echart'
        }
      },
      {
        path: 'count-to',
        component: 'views/Components/CountTo',
        name: 'CountTo',
        meta: {
          title: 'router.countTo'
        }
      },
      {
        path: 'qrcode',
        component: 'views/Components/Qrcode',
        name: 'Qrcode',
        meta: {
          title: 'router.qrcode'
        }
      },
      {
        path: 'highlight',
        component: 'views/Components/Highlight',
        name: 'Highlight',
        meta: {
          title: 'router.highlight'
        }
      },
      {
        path: 'infotip',
        component: 'views/Components/Infotip',
        name: 'Infotip',
        meta: {
          title: 'router.infotip'
        }
      },
      {
        path: 'input-password',
        component: 'views/Components/InputPassword',
        name: 'InputPassword',
        meta: {
          title: 'router.inputPassword'
        }
      },
      {
        path: 'waterfall',
        component: 'views/Components/Waterfall',
        name: 'Waterfall',
        meta: {
          title: 'router.waterfall'
        }
      },
      {
        path: 'image-cropping',
        component: 'views/Components/ImageCropping',
        name: 'ImageCropping',
        meta: {
          title: 'router.imageCropping'
        }
      },
      {
        path: 'video-player',
        component: 'views/Components/VideoPlayer',
        name: 'VideoPlayer',
        meta: {
          title: 'router.videoPlayer'
        }
      },
      {
        path: 'avatars',
        component: 'views/Components/Avatars',
        name: 'Avatars',
        meta: {
          title: 'router.avatars'
        }
      },
      {
        path: 'i-agree',
        component: 'views/Components/IAgree',
        name: 'IAgree',
        meta: {
          title: 'router.iAgree'
        }
      }
    ]
  },
  {
    path: '/function',
    component: '#',
    redirect: '/function/multipleTabs',
    name: 'Function',
    meta: {
      title: 'router.function',
      icon: 'vi-ri:function-fill',
      alwaysShow: true
    },
    children: [
      {
        path: 'multipleTabs',
        component: 'views/Function/MultipleTabs',
        name: 'MultipleTabs',
        meta: {
          title: 'router.multipleTabs'
        }
      },
      {
        path: 'multiple-tabs-demo/:id',
        component: 'views/Function/MultipleTabsDemo',
        name: 'MultipleTabsDemo',
        meta: {
          hidden: true,
          title: 'router.details',
          canTo: true
        }
      },
      {
        path: 'request',
        component: 'views/Function/Request',
        name: 'Request',
        meta: {
          title: 'router.request'
        }
      },
      {
        path: 'test',
        component: 'views/Function/Test',
        name: 'Test',
        meta: {
          title: 'router.permission',
          permission: ['add', 'edit', 'delete']
        }
      }
    ]
  },
  {
    path: '/hooks',
    component: '#',
    redirect: '/hooks/useWatermark',
    name: 'Hooks',
    meta: {
      title: 'hooks',
      icon: 'vi-ic:outline-webhook',
      alwaysShow: true
    },
    children: [
      {
        path: 'useWatermark',
        component: 'views/hooks/useWatermark',
        name: 'UseWatermark',
        meta: {
          title: 'useWatermark'
        }
      },
      {
        path: 'useTagsView',
        component: 'views/hooks/useTagsView',
        name: 'UseTagsView',
        meta: {
          title: 'useTagsView'
        }
      },
      {
        path: 'useValidator',
        component: 'views/hooks/useValidator',
        name: 'UseValidator',
        meta: {
          title: 'useValidator'
        }
      },
      {
        path: 'useCrudSchemas',
        component: 'views/hooks/useCrudSchemas',
        name: 'UseCrudSchemas',
        meta: {
          title: 'useCrudSchemas'
        }
      },
      {
        path: 'useClipboard',
        component: 'views/hooks/useClipboard',
        name: 'UseClipboard',
        meta: {
          title: 'useClipboard'
        }
      },
      {
        path: 'useNetwork',
        component: 'views/hooks/useNetwork',
        name: 'UseNetwork',
        meta: {
          title: 'useNetwork'
        }
      }
    ]
  },
  {
    path: '/level',
    component: '#',
    redirect: '/level/menu1/menu1-1/menu1-1-1',
    name: 'Level',
    meta: {
      title: 'router.level',
      icon: 'vi-carbon:skill-level-advanced'
    },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        component: '##',
        redirect: '/level/menu1/menu1-1/menu1-1-1',
        meta: {
          title: 'router.menu1'
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu11',
            component: '##',
            redirect: '/level/menu1/menu1-1/menu1-1-1',
            meta: {
              title: 'router.menu11',
              alwaysShow: true
            },
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu111',
                component: 'views/Level/Menu111',
                meta: {
                  title: 'router.menu111'
                }
              }
            ]
          },
          {
            path: 'menu1-2',
            name: 'Menu12',
            component: 'views/Level/Menu12',
            meta: {
              title: 'router.menu12'
            }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'Menu2Demo',
        component: 'views/Level/Menu2',
        meta: {
          title: 'router.menu2'
        }
      }
    ]
  },
  {
    path: '/example',
    component: '#',
    redirect: '/example/example-dialog',
    name: 'Example',
    meta: {
      title: 'router.example',
      icon: 'vi-ep:management',
      alwaysShow: true
    },
    children: [
      {
        path: 'example-dialog',
        component: 'views/Example/Dialog/ExampleDialog',
        name: 'ExampleDialog',
        meta: {
          title: 'router.exampleDialog'
        }
      },
      {
        path: 'example-page',
        component: 'views/Example/Page/ExamplePage',
        name: 'ExamplePage',
        meta: {
          title: 'router.examplePage'
        }
      },
      {
        path: 'example-add',
        component: 'views/Example/Page/ExampleAdd',
        name: 'ExampleAdd',
        meta: {
          title: 'router.exampleAdd',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/example/example-page'
        }
      },
      {
        path: 'example-edit',
        component: 'views/Example/Page/ExampleEdit',
        name: 'ExampleEdit',
        meta: {
          title: 'router.exampleEdit',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/example/example-page'
        }
      },
      {
        path: 'example-detail',
        component: 'views/Example/Page/ExampleDetail',
        name: 'ExampleDetail',
        meta: {
          title: 'router.exampleDetail',
          noTagsView: true,
          noCache: true,
          hidden: true,
          showMainRoute: true,
          activeMenu: '/example/example-page'
        }
      }
    ]
  },
  {
    path: '/error',
    component: '#',
    redirect: '/error/404',
    name: 'Error',
    meta: {
      title: 'router.errorPage',
      icon: 'vi-ci:error',
      alwaysShow: true
    },
    children: [
      {
        path: '404-demo',
        component: 'views/Error/404',
        name: '404Demo',
        meta: {
          title: '404'
        }
      },
      {
        path: '403-demo',
        component: 'views/Error/403',
        name: '403Demo',
        meta: {
          title: '403'
        }
      },
      {
        path: '500-demo',
        component: 'views/Error/500',
        name: '500Demo',
        meta: {
          title: '500'
        }
      }
    ]
  },
  {
    path: '/authorization',
    component: '#',
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: 'router.authorization',
      icon: 'vi-eos-icons:role-binding',
      alwaysShow: true
    },
    children: [
      {
        path: 'department',
        component: 'views/Authorization/Department/Department',
        name: 'Department',
        meta: {
          title: 'router.department'
        }
      },
      {
        path: 'user',
        component: 'views/Authorization/User/User',
        name: 'User',
        meta: {
          title: 'router.user'
        }
      },
      {
        path: 'menu',
        component: 'views/Authorization/Menu/Menu',
        name: 'Menu',
        meta: {
          title: 'router.menuManagement'
        }
      },
      {
        path: 'role',
        component: 'views/Authorization/Role/Role',
        name: 'Role',
        meta: {
          title: 'router.role'
        }
      }
    ]
  }
]

/**
 * 测试路由路径列表
 */
const testList: string[] = [
  '/dashboard', // 仪表盘首页
  '/dashboard/analysis', // 仪表盘分析页
  '/dashboard/workplace', // 仪表盘工作台
  '/external-link', // 外部链接
  'https://element-plus-admin-doc.cn/',
  '/guide',
  '/guide/index',
  '/components',
  '/components/form',
  '/components/form/default-form',
  '/components/form/use-form',
  '/components/form/ref-form',
  '/components/table',
  '/components/table/default-table',
  '/components/table/use-table',
  '/components/table/tree-table',
  '/components/table/table-image-preview',
  '/components/table/table-video-preview',
  '/components/table/ref-table',
  '/components/table/card-table',
  '/components/editor-demo',
  '/components/editor-demo/editor',
  '/components/editor-demo/json-editor',
  '/components/editor-demo/code-editor',
  '/components/search',
  '/components/descriptions',
  '/components/image-viewer',
  '/components/dialog',
  '/components/icon',
  '/components/iconPicker',
  '/components/echart',
  '/components/count-to',
  '/components/qrcode',
  '/components/highlight',
  '/components/infotip',
  '/components/input-password',
  '/components/waterfall',
  '/components/image-cropping',
  '/components/video-player',
  '/components/avatars',
  '/components/i-agree',
  'function',
  '/function/multiple-tabs',
  '/function/multiple-tabs-demo/:id',
  '/function/request',
  '/function/test',
  '/hooks',
  '/hooks/useWatermark',
  '/hooks/useTagsView',
  '/hooks/useValidator',
  '/hooks/useCrudSchemas',
  '/hooks/useClipboard',
  '/hooks/useNetwork',
  '/level',
  '/level/menu1',
  '/level/menu1/menu1-1',
  '/level/menu1/menu1-1/menu1-1-1',
  '/level/menu1/menu1-2',
  '/level/menu2',
  '/example',
  '/example/example-dialog',
  '/example/example-page',
  '/example/example-add',
  '/example/example-edit',
  '/example/example-detail',
  '/authorization',
  '/authorization/department',
  '/authorization/user',
  '/authorization/role',
  '/authorization/menu',
  '/error',
  '/error/404-demo',
  '/error/403-demo',
  '/error/500-demo'
]

/**
 * 存储生成的角色数据
 */
const List: any[] = [] // 动态生成的角色列表

/**
 * 定义角色名称数组
 */
const roleNames = ['超级管理员', '管理员', '普通用户', '游客']

/**
 * 动态菜单数据
 */
const menus = [
  [
    {
      path: '/dashboard',
      component: '#',
      redirect: '/dashboard/analysis',
      name: 'Dashboard',
      status: Mock.Random.integer(0, 1), // 随机启用状态
      id: 1, // 菜单唯一标识符
      meta: {
        title: '首页', // 菜单标题
        icon: 'vi-ant-design:dashboard-filled', // 菜单图标
        alwaysShow: true // 始终显示
      },
      children: [
        {
          path: 'analysis',
          component: 'views/Dashboard/Analysis',
          name: 'Analysis',
          status: Mock.Random.integer(0, 1), // 启用状态
          id: 2,
          meta: {
            title: '分析页', // 菜单标题
            noCache: true // 不缓存
          }
        },
        {
          path: 'workplace',
          component: 'views/Dashboard/Workplace',
          name: 'Workplace',
          status: Mock.Random.integer(0, 1),
          id: 3,
          meta: {
            title: '工作台',
            noCache: true
          }
        }
      ]
    },
    {
      path: '/external-link',
      component: '#',
      meta: {
        title: '文档',
        icon: 'vi-clarity:document-solid'
      },
      name: 'ExternalLink',
      status: Mock.Random.integer(0, 1),
      id: 4,
      children: [
        {
          path: 'https://element-plus-admin-doc.cn/',
          name: 'DocumentLink',
          status: Mock.Random.integer(0, 1),
          id: 5,
          meta: {
            title: '文档'
          }
        }
      ]
    },
    {
      path: '/level',
      component: '#',
      redirect: '/level/menu1/menu1-1/menu1-1-1',
      name: 'Level',
      status: Mock.Random.integer(0, 1),
      id: 6,
      meta: {
        title: '菜单',
        icon: 'vi-carbon:skill-level-advanced'
      },
      children: [
        {
          path: 'menu1',
          name: 'Menu1',
          component: '##',
          status: Mock.Random.integer(0, 1),
          id: 7,
          redirect: '/level/menu1/menu1-1/menu1-1-1',
          meta: {
            title: '菜单1'
          },
          children: [
            {
              path: 'menu1-1',
              name: 'Menu11',
              component: '##',
              status: Mock.Random.integer(0, 1),
              id: 8,
              redirect: '/level/menu1/menu1-1/menu1-1-1',
              meta: {
                title: '菜单1-1',
                alwaysShow: true
              },
              children: [
                {
                  path: 'menu1-1-1',
                  name: 'Menu111',
                  component: 'views/Level/Menu111',
                  status: Mock.Random.integer(0, 1),
                  id: 9,
                  permission: ['edit', 'add', 'delete'],
                  meta: {
                    title: '菜单1-1-1',
                    permission: ['edit', 'add', 'delete']
                  }
                }
              ]
            },
            {
              path: 'menu1-2',
              name: 'Menu12',
              component: 'views/Level/Menu12',
              status: Mock.Random.integer(0, 1),
              id: 10,
              permission: ['edit', 'add', 'delete'],
              meta: {
                title: '菜单1-2',
                permission: ['edit', 'add', 'delete']
              }
            }
          ]
        },
        {
          path: 'menu2',
          name: 'Menu2Demo',
          component: 'views/Level/Menu2',
          status: Mock.Random.integer(0, 1),
          id: 11,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '菜单2',
            permission: ['edit', 'add', 'delete']
          }
        }
      ]
    },
    {
      path: '/example',
      component: '#',
      redirect: '/example/example-dialog',
      name: 'Example',
      status: Mock.Random.integer(0, 1),
      id: 12,
      meta: {
        title: '综合示例',
        icon: 'vi-ep:management',
        alwaysShow: true
      },
      children: [
        {
          path: 'example-dialog',
          component: 'views/Example/Dialog/ExampleDialog',
          name: 'ExampleDialog',
          status: Mock.Random.integer(0, 1),
          id: 13,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '综合示例-弹窗',
            permission: ['edit', 'add', 'delete']
          }
        },
        {
          path: 'example-page',
          component: 'views/Example/Page/ExamplePage',
          name: 'ExamplePage',
          status: Mock.Random.integer(0, 1),
          id: 14,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '综合示例-页面',
            permission: ['edit', 'add', 'delete']
          }
        },
        {
          path: 'example-add',
          component: 'views/Example/Page/ExampleAdd',
          name: 'ExampleAdd',
          status: Mock.Random.integer(0, 1),
          id: 15,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '综合示例-新增',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page',
            permission: ['edit', 'add', 'delete']
          }
        },
        {
          path: 'example-edit',
          component: 'views/Example/Page/ExampleEdit',
          name: 'ExampleEdit',
          status: Mock.Random.integer(0, 1),
          id: 16,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '综合示例-编辑',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page',
            permission: ['edit', 'add', 'delete']
          }
        },
        {
          path: 'example-detail',
          component: 'views/Example/Page/ExampleDetail',
          name: 'ExampleDetail',
          status: Mock.Random.integer(0, 1),
          id: 17,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '综合示例-详情',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page',
            permission: ['edit', 'add', 'delete']
          }
        }
      ]
    }
  ],
  [
    {
      path: '/dashboard',
      component: '#',
      redirect: '/dashboard/analysis',
      name: 'Dashboard',
      status: Mock.Random.integer(0, 1),
      id: 1,
      meta: {
        title: '首页',
        icon: 'vi-ant-design:dashboard-filled',
        alwaysShow: true
      },
      children: [
        {
          path: 'analysis',
          component: 'views/Dashboard/Analysis',
          name: 'Analysis',
          status: Mock.Random.integer(0, 1),
          id: 2,
          meta: {
            title: '分析页',
            noCache: true
          }
        },
        {
          path: 'workplace',
          component: 'views/Dashboard/Workplace',
          name: 'Workplace',
          status: Mock.Random.integer(0, 1),
          id: 3,
          meta: {
            title: '工作台',
            noCache: true
          }
        }
      ]
    }
  ],
  [
    {
      path: '/external-link',
      component: '#',
      meta: {
        title: '文档',
        icon: 'vi-clarity:document-solid'
      },
      name: 'ExternalLink',
      status: Mock.Random.integer(0, 1),
      id: 4,
      children: [
        {
          path: 'https://element-plus-admin-doc.cn/',
          name: 'DocumentLink',
          status: Mock.Random.integer(0, 1),
          id: 5,
          meta: {
            title: '文档'
          }
        }
      ]
    },
    {
      path: '/level',
      component: '#',
      redirect: '/level/menu1/menu1-1/menu1-1-1',
      name: 'Level',
      status: Mock.Random.integer(0, 1),
      id: 6,
      meta: {
        title: '菜单',
        icon: 'vi-carbon:skill-level-advanced'
      },
      children: [
        {
          path: 'menu1',
          name: 'Menu1',
          component: '##',
          status: Mock.Random.integer(0, 1),
          id: 7,
          redirect: '/level/menu1/menu1-1/menu1-1-1',
          meta: {
            title: '菜单1'
          },
          children: [
            {
              path: 'menu1-1',
              name: 'Menu11',
              component: '##',
              status: Mock.Random.integer(0, 1),
              id: 8,
              redirect: '/level/menu1/menu1-1/menu1-1-1',
              meta: {
                title: '菜单1-1',
                alwaysShow: true
              },
              children: [
                {
                  path: 'menu1-1-1',
                  name: 'Menu111',
                  component: 'views/Level/Menu111',
                  status: Mock.Random.integer(0, 1),
                  id: 9,
                  permission: ['edit', 'add', 'delete'],
                  meta: {
                    title: '菜单1-1-1',
                    permission: ['edit', 'add', 'delete']
                  }
                }
              ]
            },
            {
              path: 'menu1-2',
              name: 'Menu12',
              component: 'views/Level/Menu12',
              status: Mock.Random.integer(0, 1),
              id: 10,
              permission: ['edit', 'add', 'delete'],
              meta: {
                title: '菜单1-2',
                permission: ['edit', 'add', 'delete']
              }
            }
          ]
        },
        {
          path: 'menu2',
          name: 'Menu2Demo',
          component: 'views/Level/Menu2',
          status: Mock.Random.integer(0, 1),
          id: 11,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '菜单2',
            permission: ['edit', 'add', 'delete']
          }
        }
      ]
    }
  ],
  [
    {
      path: '/example',
      component: '#',
      redirect: '/example/example-dialog',
      name: 'Example',
      status: Mock.Random.integer(0, 1),
      id: 12,
      meta: {
        title: '综合示例',
        icon: 'vi-ep:management',
        alwaysShow: true
      },
      children: [
        {
          path: 'example-detail',
          component: 'views/Example/Page/ExampleDetail',
          name: 'ExampleDetail',
          status: Mock.Random.integer(0, 1),
          id: 17,
          permission: ['edit', 'add', 'delete'],
          meta: {
            title: '综合示例-详情',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page',
            permission: ['edit', 'add', 'delete']
          }
        }
      ]
    }
  ]
]

/** 动态生成角色列表数据 */
for (let i = 0; i < 4; i++) {
  List.push(
    Mock.mock({
      id: toAnyString(), // 唯一标识符
      roleName: roleNames[i], // 角色名称
      role: '@first', // 随机生成角色
      status: Mock.Random.integer(0, 1), // 随机启用状态
      createTime: '@datetime', // 随机生成创建时间
      remark: '@cword(10, 15)', // 随机生成备注信息
      menu: menus[i] // 角色权限菜单
    })
  )
}

/**
 * 导出模拟接口集合
 */
export default [
  /**
   * 获取管理员路由列表接口
   * @returns {object} 包含路由列表的数据
   */
  {
    url: '/mock/role/list', // 接口 URL
    method: 'get', // 请求方法
    timeout, // 请求超时时间
    response: () => {
      return {
        code: SUCCESS_CODE, // 成功状态码
        data: adminList // 管理员列表数据
      }
    }
  },
  /**
   * 获取角色权限表格接口
   * @returns {object} 包含角色列表和总记录数
   */
  {
    url: '/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List, // 角色列表数据
          total: 4 // 总记录数
        }
      }
    }
  },
  /**
   * 获取测试路由列表接口
   * @returns {object} 包含测试路由路径数组
   */
  {
    url: '/mock/role/list2',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: testList // 测试路径列表
      }
    }
  },
  {
    url: '/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List,
          total: 4
        }
      }
    }
  }
]
