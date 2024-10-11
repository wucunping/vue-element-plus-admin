<script lang="ts" setup>
/**
 * @file Waterfall.vue
 * @description 实现一个瀑布流布局组件，支持 flex 和 javascript 布局方式，能够根据输入的数据动态渲染不同的图片。
 * @example
 * <Waterfall
 *   :data="imageData"
 *   :width="200"
 *   :gap="20"
 *   :cols="3"
 *   :loading="isLoading"
 *   @loadMore="fetchMoreData"
 * />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module Waterfall
 */

/** 导入用于属性验证的工具 */
import { propTypes } from '@/utils/propTypes'

/** 导入设计相关的hooks */
import { useDesign } from '@/hooks/web/useDesign'

/** 导入vue的响应式函数和生命周期钩子 */
import { ref, nextTick, unref, onMounted, watch } from 'vue'

/** 导入vueuse的事件监听和交叉观察钩子 */
import { useEventListener, useIntersectionObserver } from '@vueuse/core'

/** 导入lodash的防抖函数 */
import { debounce } from 'lodash-es'

/** 获取前缀生成函数 */
const { getPrefixCls } = useDesign()

/** 定义组件的前缀类名 */
const prefixCls = getPrefixCls('waterfall')

/** 定义组件触发的事件 */
const emit = defineEmits(['loadMore'])

/** 定义组件的属性 */
const prop = defineProps({
	/** 数据数组 */
	data: propTypes.arrayOf(propTypes.any),

	/** 是否重置 */
	reset: propTypes.bool.def(true),

	/** 宽度 */
	width: propTypes.number.def(200),

	/** 间距 */
	gap: propTypes.number.def(20),

	/** 图片属性映射 */
	props: propTypes.objectOf(propTypes.string).def({
		src: 'src',
		height: 'height'
	}),

	/** 列数 */
	cols: propTypes.number.def(undefined),

	/** 加载中文本 */
	loadingText: propTypes.string.def('加载中...'),

	/** 加载状态 */
	loading: propTypes.bool.def(false),

	/** 是否已结束 */
	end: propTypes.bool.def(false),

	/** 结束中文本 */
	endText: propTypes.string.def('没有更多了'),

	/** 是否自动居中 */
	autoCenter: propTypes.bool.def(true),

	/** 布局方式 */
	layout: propTypes.oneOf(['javascript', 'flex']).def('flex')
})

/** 包裹元素的引用 */
const wrapEl = ref<HTMLDivElement>()

/** 存放每列高度的数组 */
const heights = ref<number[]>([])

/** 包裹元素的高度 */
const wrapHeight = ref(0)

/** 包裹元素的宽度 */
const wrapWidth = ref(0)

/** 加载更多元素的引用 */
const loadMore = ref<HTMLDivElement>()

/** 内部列数，计算页面宽度与图片宽度的比值 */
const innerCols = ref(0)

/** 过滤后的数据数组 */
const filterData = ref<any[]>([])

/**
 * 过滤瀑布流布局的数据
 */
const filterWaterfall = async () => {
	filterData.value = [] // 清空过滤的数据

	const { props, width, gap } = prop // 解构属性
	const data = prop.data as any[] // 获取传入的数据

	await nextTick() // 等待下一个DOM更新

	const container = unref(wrapEl) as HTMLElement // 获取包裹元素
	if (!container) return // 如果没有包裹元素则返回

	// 计算列数
	innerCols.value = prop.cols ?? Math.floor(container.clientWidth / (width + gap))

	const length = data.length // 数据的长度
	for (let i = 0; i < length; i++) {
		if (i < unref(innerCols)) {
			// 如果当前索引小于列数
			heights.value[i] = data[i][props.height as string] // 设置高度
			filterData.value.push({
				// 添加过滤后的数据
				...data[i],
				top: 0, // 设置顶部位置
				left: i * (width + gap) // 设置左侧位置
			})
		} else {
			// 找出最矮的那一列和索引
			let minHeight = heights.value[0] // 假设第一个为最小高度
			let index = 0 // 记录索引

			// 找出最小高度
			for (let j = 1; j < unref(innerCols); j++) {
				if (unref(heights)[j] < minHeight) {
					minHeight = unref(heights)[j] // 更新最小高度
					index = j // 更新索引
				}
			}

			// 更新最矮高度
			heights.value[index] += data[i][props.height as string] + gap // 更新高度
			filterData.value.push({
				// 添加过滤后的数据
				...data[i],
				top: minHeight + gap, // 设置顶部位置
				left: index * (width + gap) // 设置左侧位置
			})
		}
	}
	// 更新包裹元素的高度和宽度
	wrapHeight.value = Math.max(...unref(heights))
	wrapWidth.value = unref(innerCols) * (width + gap) - gap
}

/**
 * 过滤弹性布局的数据
 */
const flexWaterfall = async () => {
	const { width, gap } = prop // 解构属性
	const data = prop.data as any[] // 获取传入的数据

	await nextTick() // 等待下一个DOM更新

	const container = unref(wrapEl) as HTMLElement // 获取包裹元素
	if (!container) return // 如果没有包裹元素则返回

	// 计算列数
	innerCols.value = prop.cols ?? Math.floor(container.clientWidth / (width + gap))

	const length = data.length // 数据的长度
	// 根据列数，创建数组
	const arr = new Array(unref(innerCols)).fill([])
	// 循环数据，依次插入到arr中
	for (let i = 0; i < length; i++) {
		const index = i % unref(innerCols) // 计算当前元素的索引
		arr[index] = [...arr[index], data[i]] // 添加数据
	}
	filterData.value = arr // 更新过滤后的数据
}

/**
 * 初始化布局
 */
const initLayout = () => {
	const { layout } = prop // 解构布局属性
	if (layout === 'javascript') {
		filterWaterfall() // 使用javascript布局
	} else if (layout === 'flex') {
		flexWaterfall() // 使用flex布局
	}
}

// 监听数据和列数的变化
watch(
	() => [prop.data, prop.cols],
	() => {
		initLayout() // 初始化布局
	},
	{
		immediate: true // 立即执行
	}
)

// 组件挂载后执行的逻辑
onMounted(() => {
	if (unref(prop.reset)) {
		// 如果需要重置
		useEventListener(window, 'resize', debounce(initLayout, 300)) // 监听窗口大小变化
	}
	useIntersectionObserver(
		// 监视加载更多元素
		unref(loadMore),
		([{ isIntersecting }]) => {
			if (isIntersecting && !prop.loading && !prop.end) {
				// 如果加载元素进入视口且没有在加载和没有更多数据
				emit('loadMore') // 触发加载更多事件
			}
		},
		{
			threshold: 0.1 // 触发阈值
		}
	)
})

/*
<template>
	<!-- 创建一个包含水流的主要容器 -->
	<div
		:class="[
			prefixCls,  // 水流组件的前缀类名
			'flex', // 使用flexbox布局
			'items-center', // 垂直居中对齐
			{
				'justify-center': autoCenter // 如果自动居中属性为真，则居中对齐
			}
		]"
		ref="wrapEl"  // 包裹元素的引用
		:style="{
			height: `${layout === 'javascript' ? wrapHeight + 40 : 'auto'}px` // 根据布局类型设置高度
		}"
	>
		<template v-if="layout === 'javascript'"> <!-- 当布局为javascript时 -->
			<!-- 创建一个相对定位的容器 -->
			<div class="relative" :style="{ width: `${wrapWidth}px`, height: `${wrapHeight + 40}px` }">
				<!-- 循环遍历过滤后的数据 -->
				<div
					v-for="(item, $index) in filterData"
					:class="[
						`${prefixCls}-item__${$index}`, // 设置每个项目的类名
						{
							absolute: layout === 'javascript' // 如果布局为javascript，则添加绝对定位类
						}
					]"
					:key="`water-${$index}`" // 为每个项目设置唯一的key
					:style="{
						width: `${width}px`, // 设置项目的宽度
						height: `${item[props.height as string]}px`, // 设置项目的高度
						top: `${item.top}px`, // 设置项目的顶部位置
						left: `${item.left}px` // 设置项目的左侧位置
					}"
				>
					<img :src="item[props.src as string]" class="w-full h-full block" alt="" srcset="" /> <!-- 显示图片 -->
				</div>
				<!-- 加载更多元素 -->
				<div
					ref="loadMore" // 加载更多元素的引用
					class="h-40px flex justify-center absolute w-full" // 设置样式
					:style="{
						top: `${wrapHeight + gap}px` // 设置加载更多元素的顶部位置
					}"
				>
					{{ end ? endText : loadingText }} <!-- 根据状态显示不同的文本 -->
				</div>
			</div>
		</template>
		<template v-else-if="layout === 'flex'"> <!-- 当布局为flex时 -->
			<!-- 创建一个相对定位的容器 -->
			<div
				class="relative flex pb-40px" // 设置样式
				:style="{
					width: cols ? '100%' : 'auto' // 根据是否设置列数来决定宽度
				}"
			>
				<!-- 循环遍历过滤后的数据 -->
				<div
					v-for="(item, $index) in filterData"
					:key="`waterWrap-${$index}`" // 为每个包装元素设置唯一的key
					class="flex-1" // 使用flex-grow属性使项目平分空间
					:style="{
						marginRight: $index === filterData.length - 1 ? '0' : `${gap}px` // 设置间距
					}"
				>
					<!-- 循环遍历子元素 -->
					<div
						v-for="(child, i) in item"
						:key="`waterWrap-${$index}-${i}`" // 为每个子元素设置唯一的key
						:style="{
							marginBottom: `${gap}px`, // 设置下方间距
							width: cols ? '100%' : `${width}px`, // 根据是否设置列数来决定子元素的宽度
							height: cols ? 'auto' : `${child[props.height as string]}px` // 根据是否设置列数来决定子元素的高度
						}"
					>
						<img :src="child[props.src as string]" class="w-full h-full block" alt="" srcset="" /> <!-- 显示子图片 -->
					</div>
				</div>
				<!-- 加载更多元素 -->
				<div
					ref="loadMore" // 加载更多元素的引用
					class="h-40px flex justify-center absolute w-full items-center" // 设置样式
					:style="{
						bottom: 0 // 设置加载更多元素的底部位置
					}"
				>
					{{ end ? endText : loadingText }} <!-- 根据状态显示不同的文本 -->
				</div>
			</div>
		</template>
	</div>
</template>
*/
</script>

<template>
	<div
		:class="[
			prefixCls,
			'flex',
			'items-center',
			{
				'justify-center': autoCenter
			}
		]"
		ref="wrapEl"
		:style="{
			height: `${layout === 'javascript' ? wrapHeight + 40 : 'auto'}px`
		}"
	>
		<template v-if="layout === 'javascript'">
			<div class="relative" :style="{ width: `${wrapWidth}px`, height: `${wrapHeight + 40}px` }">
				<div
					v-for="(item, $index) in filterData"
					:class="[
						`${prefixCls}-item__${$index}`,
						{
							absolute: layout === 'javascript'
						}
					]"
					:key="`water-${$index}`"
					:style="{
						width: `${width}px`,
						height: `${item[props.height as string]}px`,
						top: `${item.top}px`,
						left: `${item.left}px`
					}"
				>
					<img :src="item[props.src as string]" class="w-full h-full block" alt="" srcset="" />
				</div>
				<div
					ref="loadMore"
					class="h-40px flex justify-center absolute w-full"
					:style="{
						top: `${wrapHeight + gap}px`
					}"
				>
					{{ end ? endText : loadingText }}
				</div>
			</div>
		</template>
		<template v-else-if="layout === 'flex'">
			<div
				class="relative flex pb-40px"
				:style="{
					width: cols ? '100%' : 'auto'
				}"
			>
				<div
					v-for="(item, $index) in filterData"
					:key="`waterWrap-${$index}`"
					class="flex-1"
					:style="{
						marginRight: $index === filterData.length - 1 ? '0' : `${gap}px`
					}"
				>
					<div
						v-for="(child, i) in item"
						:key="`waterWrap-${$index}-${i}`"
						:style="{
							marginBottom: `${gap}px`,
							width: cols ? '100%' : `${width}px`,
							height: cols ? 'auto' : `${child[props.height as string]}px`
						}"
					>
						<img :src="child[props.src as string]" class="w-full h-full block" alt="" srcset="" />
					</div>
				</div>
				<div
					ref="loadMore"
					class="h-40px flex justify-center absolute w-full items-center"
					:style="{
						bottom: 0
					}"
				>
					{{ end ? endText : loadingText }}
				</div>
			</div>
		</template>
	</div>
</template>
