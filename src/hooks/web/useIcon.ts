/**
 * @file src/hooks/web/useIcon.ts
 * @description 定义一个名为useIcon的自定义钩子函数，用于创建Icon组件的VNode实例。
 * @example
 * 导入useIcon钩子并使用返回的VNode
 * import { useIcon } from './useIcon'
 * const iconVNode = useIcon({ type: 'heart' })
 *
 * @version 1.0.0
 * @author [Your Name]
 * @date 2023-09-13
 */

// 导入Vue的h函数，用于创建虚拟DOM节点
import { h } from 'vue'
// 导入Vue的VNode类型，表示一个虚拟节点
import type { VNode } from 'vue'
// 从'@/components/Icon'中导入Icon组件和IconTypes类型
import { Icon, IconTypes } from '@/components/Icon'

/**
 * 使用Icon组件
 *
 * @param props Icon组件的属性
 * @returns Icon组件的虚拟DOM节点
 */
export const useIcon = (props: IconTypes): VNode => {
	// 使用h函数创建一个Icon组件的虚拟DOM节点，并将props作为该节点的属性
	return h(Icon, props)
}
