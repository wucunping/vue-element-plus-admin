/**
 * @file env.d.ts
 * @description Vite项目的环境变量和Vue组件声明文件
 * @example
 * // 用法示例
 * const myComponent = defineComponent({...});
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-15
 * @module environment
 */

/// <reference types="vite/client" />// 引入Vite客户端的类型声明

/**
 * 声明一个模块，该模块匹配所有以 '.vue' 结尾的文件。
 * 这允许 TypeScript 正确处理 Vue 单文件组件的导入。
 */
declare module '*.vue' {
  /**
   * Vue单文件组件的类型声明
   * @returns {DefineComponent<{}, {}, any>} 定义组件的类型
   */
  import { DefineComponent } from 'vue' // 导入Vue的定义组件类型

  const component: DefineComponent<{}, {}, any> // 定义组件常量，类型为DefineComponent
  export default component // 导出组件
}

/**
 * 声明全局的 'ImportMeta' 接口，以便在此文件中扩展它。
 * 'ImportMeta' 接口通常用于描述 ECMAScript 模块导入语句的 'import.meta' 对象的类型。
 */
declare global {
  /** 扩展全局ImportMeta接口 */
  interface ImportMeta {
    /** 环境变量 */
    readonly env: ImportMetaEnv // 声明只读env属性，类型为ImportMetaEnv
  }
}
