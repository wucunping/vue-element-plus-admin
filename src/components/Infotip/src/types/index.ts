/**
 * @file 信息提示组件类型定义
 * @description 定义用于信息提示组件的数据结构
 * @module /src/components/Infotip/src/types/index.ts
 * @version 1.0.0
 * @date 2024-11-22
 * @author [吴尘](https://github.com/wucunping)
 */

/** 信息提示的类型定义 */
export interface InfoTipSchema {
  /** 提示标签 */
  label: string
  /** 提示内容的键数组 */
  keys?: string[]
}
