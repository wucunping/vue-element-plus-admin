/**
 * @file index.ts
 * @description ConfigGlobal 类型定义文件，定义全局配置相关的类型
 * @example
 * import type { ConfigGlobalTypes } from '@/components/ConfigGlobal/src/types'
 * @version 1.0.0
 * @date 2024-11-21
 * @module ConfigGlobalTypes
 * @requires 'element-plus' 提供的组件大小类型
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Element Plus 的组件大小类型
import { ComponentSize } from 'element-plus'

/** 定义全局配置类型 */
export interface ConfigGlobalTypes {
  /** 可选的组件大小 */
  size?: ComponentSize
}
