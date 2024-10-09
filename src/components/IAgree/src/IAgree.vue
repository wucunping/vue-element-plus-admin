<script lang="ts" setup>
/**
 * @file IAgree.vue
 * @description 该组件用于显示可高亮文本和复选框，支持链接和点击事件的响应。
 * @example
 * <IAgree
 *   text="这是一个示例文本"
 *   :link="[{ text: '示例链接', url: 'https://example.com' }]"
 * />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module IAgree
 */

/** 引入 Element Plus 的 ElCheckbox 组件 */
import { ElCheckbox } from 'element-plus'

/** 引入自定义的 Highlight 组件 */
import { Highlight } from '@/components/Highlight'

/** 导入 Vue 中的 PropType 类型 */
import type { PropType } from 'vue'

/** 导入 Vue 中的 computed 方法 */
import { computed } from 'vue'

/** 导入定义类型 LinkItem */
import type { LinkItem } from './types'

/** 定义组件的 props */
const props = defineProps({
	/** 文本内容，类型为字符串，默认值为空字符串 */
	text: {
		type: String,
		default: ''
	},
	/** 链接项，类型为数组，默认为 undefined */
	link: {
		type: Array as PropType<LinkItem[]>,
		default: undefined
	}
})

/** 定义模型值，类型为布尔值 */
const modelValue = defineModel<boolean>()

/** 计算高亮关键词数组 */
const highlightKeys = computed(() => {
	/** 返回链接项中的文本数组，如果没有则返回空数组 */
	return props.link?.map((item) => item.text) || []
})

/**
 * 点击高亮关键词时的处理函数
 * @param key - 点击的关键词
 */
const keyClick = (key: string) => {
	/** 查找与点击的关键词相匹配的链接项 */
	const linkItem = props.link?.find((item) => item.text === key)

	/** 如果链接项有 URL，则在新窗口打开该链接 */
	if (linkItem?.url) {
		window.open(linkItem.url)
		return
	}

	/** 如果链接项有点击事件，则执行该事件 */
	if (linkItem?.onClick) {
		linkItem.onClick()
	}
}
</script>

<template>
	<div class="flex items-center">
		<!-- Element Plus 的复选框组件，绑定模型值 -->
		<ElCheckbox v-model="modelValue" class="mr-0px!" />

		<!--  自定义的高亮组件，传入高亮关键词并绑定点击事件 -->
		<Highlight class="ml-10px" :keys="highlightKeys" @click="keyClick">{{ text }}</Highlight>
	</div>
</template>
