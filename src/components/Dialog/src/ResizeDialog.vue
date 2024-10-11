<script lang="tsx" setup>
/**
 * @file ResizeDialog.vue
 * @description 可调整大小的对话框组件
 * @example <ResizeDialog v-model="dialogVisible" title="标题"></ResizeDialog>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ResizeDialog
 */

// 引入propTypes工具用于属性类型验证
import { propTypes } from '@/utils/propTypes'

// 从Vue中引入所需的功能
import { computed, getCurrentInstance, onMounted, unref, useAttrs, useSlots } from 'vue'

// 引入Dialog组件
import Dialog from './Dialog.vue'

// 引入自定义的useResize钩子
import { useResize } from '../hooks/useResize'

/** 定义组件的props */
const props = defineProps({
	/** 控制对话框的显示与隐藏 */
	modelValue: propTypes.bool.def(false),
	/** 对话框的标题 */
	title: propTypes.string.def('Dialog'),
	/** 是否全屏显示 */
	fullscreen: propTypes.bool.def(true),
	/** 初始宽度为屏幕宽度的一半 */
	initWidth: propTypes.number.def(window.innerWidth / 2),
	/** 初始高度为200px */
	initHeight: propTypes.number.def(200),
	/** 最小宽度为屏幕宽度的一半 */
	minResizeWidth: propTypes.number.def(window.innerWidth / 2),
	/** 最小高度为200px */
	minResizeHeight: propTypes.number.def(200)
})

/** 使用useResize钩子获取最大高度、最小宽度和拖动设置的方法 */
const { maxHeight, minWidth, setupDrag } = useResize({
	/** 最小高度 */
	minHeightPx: props.minResizeHeight,
	/** 最小宽度 */
	minWidthPx: props.minResizeWidth,
	/** 初始高度 */
	initHeight: props.initHeight,
	/** 初始宽度 */
	initWidth: props.initWidth
})

/** 定义一个用于拖动调整大小的指令对象 */
const vResize = {
	mounted(el) {
		// 当元素挂载时调用
		// 创建一个MutationObserver观察DOM变化
		const observer = new MutationObserver(() => {
			const elDialog = el.querySelector('.el-dialog') // 查找.dialog元素

			if (elDialog) {
				// 在确认 `elDialog` 已渲染后进行处理
				setupDrag(elDialog, el) // 设置拖动调整大小
				// observer.disconnect() // 一旦获取到元素，停止观察
			}
		})
		// 开始观察子节点的变化
		observer.observe(el, { childList: true, subtree: true }) // 观察子节点和子树
	}
}

/** 获取组件的属性 */
const attrs = useAttrs()

/** 获取插槽内容 */
const slots = useSlots()

/**
 * 计算绑定的属性值，排除特定属性
 */
const getBindValue = computed(() => {
	/** 要排除的属性 */
	const delArr: string[] = ['maxHeight', 'width']
	/** 合并属性对象 */
	const obj = Object.assign({}, { ...unref(attrs), ...props })
	for (const key in obj) {
		if (delArr.indexOf(key) !== -1) {
			/** 删除要排除的属性 */
			delete obj[key]
		}
	}
	/** 返回处理后的对象 */
	return obj
})

// 获取当前组件实例
const instance = getCurrentInstance()

/**
 * 初始化指令，确保指令已注册
 */
const initDirective = () => {
	const directives = instance?.appContext?.app._context?.directives

	// 检查指令是否已经注册
	if (!directives || !directives['resize']) {
		// 如果未注册
		instance?.appContext?.app.directive('resize', vResize) // 注册resize指令
	}
}

// 在组件挂载后初始化指令
onMounted(() => {
	initDirective() // 调用初始化指令的方法
})
</script>
<template>
	<div v-resize>
		<!-- 使用自定义的v-resize指令 -->
		<Dialog v-bind="getBindValue" :maxHeight="maxHeight" :width="minWidth">
			<slot></slot>
			<!-- 默认插槽 -->
			<template v-if="slots.footer" #footer>
				<!-- 如果有footer插槽 -->
				<slot name="footer"></slot>
				<!-- 渲染footer插槽 -->
			</template>
		</Dialog>
	</div>
</template>
