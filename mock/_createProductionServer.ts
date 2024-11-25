/**
 * @file mockServer.ts
 * @description 用于生产环境中加载并启动 Mock 服务。
 * @example
 * import { setupProdMockServer } from './mockServer'
 * setupProdMockServer()
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module mockServer
 */

// 导入生产环境下的 Mock 服务创建函数
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

/**
 * 动态导入所有 mock 文件
 */
const modules = import.meta.glob('./**/*.mock.ts', {
  import: 'default',
  eager: true
})

/**
 * Mock 模块集合
 */
const mockModules: any[] = []

/**
 * 遍历加载的模块并筛选有效的 Mock 模块
 */
Object.keys(modules).forEach(async (key) => {
  if (key.includes('_')) {
    return // 忽略文件名包含下划线的模块
  }
  mockModules.push(...(modules[key] as any))
})

/**
 * 启动生产环境 Mock 服务
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
