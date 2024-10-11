/**
 * @file index.ts
 * @description 该文件是 ConfigGlobal 组件的入口文件，导出相关的组件和类型
 * @example
 * import { ConfigGlobal } from './index';
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module config-global
 */

import ConfigGlobal from './src/ConfigGlobal.vue' // 导入 ConfigGlobal Vue 组件

export type { ConfigGlobalTypes } from './src/types' // 导出 ConfigGlobalTypes 类型

export { ConfigGlobal } // 导出 ConfigGlobal 组件
