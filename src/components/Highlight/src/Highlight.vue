<!-- 使用 TSX 语法定义 Vue 组件 -->
<script lang="tsx">
/**
 * @file Highlight.vue
 * @description 该文件定义了 Highlight 组件
 * @example
 * <Highlight :keys="['关键词1', '关键词2']" color="red">要高亮的文本</Highlight>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module Highlight
 */

// 从 Vue 导入所需的函数和类型
import type { PropType } from 'vue'
import { defineComponent, computed, h, unref } from 'vue'
// 导入自定义的 prop 类型
import { propTypes } from '@/utils/propTypes'

// 定义并导出 Highlight 组件
export default defineComponent({
	// 组件名称
	name: 'Highlight',

	// 组件的 props
	props: {
		// 定义 tag 属性，默认值为 'span'
		tag: propTypes.string.def('span'),
		// 定义 keys 属性，类型为字符串数组，默认值为空数组
		keys: {
			type: Array as PropType<string[]>,
			default: () => []
		},
		// 定义 color 属性，默认值为 CSS 变量
		color: propTypes.string.def('var(--el-color-primary)')
	},

	// 组件事件的声明
	emits: ['click'],

	/**
	 * 组件的 setup 函数
	 * @param props - 组件的属性
	 * @param context - 组件的上下文，包括 emit 和 slots
	 */
	setup(props, { emit, slots }) {
		/**
		 * 计算属性，生成高亮的节点
		 */
		const keyNodes = computed(() => {
			return props.keys.map((key) => {
				return h(
					'span',
					{
						// 点击事件，发出 click 事件
						onClick: () => {
							emit('click', key)
						},
						// 节点的样式
						style: {
							color: props.color,
							cursor: 'pointer'
						}
					},
					key // 显示的内容为key
				)
			})
		})

		/**
		 * 解析文本，将关键字替换为占位符
		 * @param text - 需要解析的文本
		 * @returns 替换后的文本数组
		 */
		const parseText = (text: string) => {
			// 遍历 keys 数组，将每个关键字用占位符替换
			props.keys.forEach((key, index) => {
				const regexp = new RegExp(key, 'g') // 创建正则表达式
				text = text.replace(regexp, `{{${index}}}`) // 替换关键字
			})
			return text.split(/{{|}}/) // 根据占位符拆分文本
		}

		/**
		 * 渲染文本
		 * @returns 渲染后的 VNode
		 */
		const renderText = () => {
			if (!slots?.default) return null // 如果没有默认插槽，返回 null
			const node = slots?.default()[0].children // 获取插槽内容

			if (!node) {
				return slots?.default()[0] // 如果没有内容，返回默认节点
			}

			const textArray = parseText(node as string) // 解析文本
			const regexp = /^[0-9]*$/ // 正则表达式，用于匹配数字占位符
			// 遍历文本数组，生成渲染节点
			const nodes = textArray.map((t) => {
				if (regexp.test(t)) {
					// return unref(keyNodes)[t] || t // 如果是占位符，返回对应的节点
					const index = Number(t) // 将 t 转换为数字
					return unref(keyNodes)[index] || t
				}
				return t // 如果不是，直接返回文本
			})
			return h(props.tag, nodes) // 返回指定标签的节点
		}

		// 返回 renderText 的结果
		return () => renderText()
	}
})
</script>
