/**
 * @file useIcon.ts
 * @description 用于创建图标的组合函数
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module Icon
 */

import { h } from 'vue' // 从vue库中导入h函数，用于创建虚拟节点
import type { VNode } from 'vue' // 从vue库中导入VNode类型，用于类型声明
import { Icon, IconTypes } from '@/components/Icon' // 从Icon组件中导入Icon和IconTypes类型

/**
 * 创建图标的组合函数
 *
 * @param {IconTypes} props - 图标的属性
 * @returns {VNode} 返回一个虚拟节点，表示图标组件
 */
export const useIcon = (props: IconTypes): VNode => {
  return h(Icon, props) // 使用h函数创建Icon组件，并传入属性
}
