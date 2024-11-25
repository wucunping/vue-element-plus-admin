<script lang="tsx">
/**
 * @file Highlight.vue
 * @description 高亮组件，用于根据关键字对文本内容进行高亮显示。
 * @version 1.0.0
 * @date 2024-11-22
 * @module Highlight
 * @author
 * [吴尘](https://github.com/wucunping)
 */

import { defineComponent, PropType, computed, h, unref } from 'vue' // 引入Vue的核心函数和类型定义
import { propTypes } from '@/utils/propTypes' // 引入类型工具函数

export default defineComponent({
  name: 'Highlight', // 组件名称
  props: {
    /**
     * @property {string} tag - 渲染文本的HTML标签
     * @default 'span'
     */
    tag: propTypes.string.def('span'),

    /**
     * @property {string[]} keys - 需要高亮的关键字数组
     * @default []
     */
    keys: {
      type: Array as PropType<string[]>,
      default: () => [] // 默认值为空数组
    },

    /**
     * @property {string} color - 高亮颜色
     * @default 'var(--el-color-primary)'
     */
    color: propTypes.string.def('var(--el-color-primary)')
  },
  emits: [
    /**
     * @event click - 点击关键字触发的事件
     * @param {string} key - 点击的关键字
     */
    'click'
  ],
  setup(props, { emit, slots }) {
    /**
     * @computed {VNode[]} keyNodes - 根据关键字生成对应的高亮节点
     */
    const keyNodes = computed(() => {
      return props.keys.map((key) =>
        h(
          'span', // 使用 <span> 标签包裹每个关键字
          {
            onClick: () => {
              emit('click', key) // 触发click事件并传递关键字
            },
            style: {
              color: props.color, // 设置高亮颜色
              cursor: 'pointer' // 鼠标指针样式
            }
          },
          key // 渲染关键字内容
        )
      )
    })

    /**
     * @function parseText - 解析文本内容，将关键字替换为占位符
     * @param {string} text - 输入文本
     * @returns {string[]} - 被占位符分隔的文本数组
     */
    const parseText = (text: string) => {
      props.keys.forEach((key, index) => {
        const regexp = new RegExp(key, 'g') // 创建全局匹配的正则表达式
        text = text.replace(regexp, `{{${index}}}`) // 替换关键字为占位符
      })
      return text.split(/{{|}}/) // 按占位符分割文本
    }

    /**
     * @function renderText - 渲染高亮后的文本内容
     * @returns {VNode|null} - 高亮后的文本节点
     */
    const renderText = () => {
      if (!slots?.default) return null // 如果没有默认插槽，返回null
      const node = slots?.default()[0].children // 获取插槽中的子节点

      if (!node) {
        return slots?.default()[0] // 如果没有子节点，直接返回插槽内容
      }

      const textArray = parseText(node as string) // 解析文本内容
      const regexp = /^[0-9]*$/ // 匹配数字的正则表达式
      const nodes = textArray.map((t) => {
        if (regexp.test(t)) {
          return unref(keyNodes)[t] || t // 替换占位符为高亮节点
        }
        return t // 返回非占位符的普通文本
      })
      return h(props.tag, nodes) // 使用指定标签包裹高亮文本内容
    }

    return () => renderText() // 返回渲染函数
  }
})
</script>
