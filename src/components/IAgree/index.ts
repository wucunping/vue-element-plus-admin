/**
 * @file index.ts
 * @description 导出 IAgree 组件及其类型定义，用于声明和使用复选框与高亮文本组件
 * @version 1.0.0
 * @date 2024-11-22
 * @module IAgreeModule
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 IAgree 组件
import IAgree from './src/IAgree.vue'

// 导出类型定义，用于链接项和组件属性的声明
export type { LinkItem, IAgreeProps } from './src/types'

// 导出 IAgree 组件
export { IAgree }
