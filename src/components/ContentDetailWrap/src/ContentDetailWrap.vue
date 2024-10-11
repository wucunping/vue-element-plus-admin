<script setup lang="ts">
/**
 * @file ContentDetailWrap.vue
 * @description 内容详细包装组件，展示详细信息及其头部插槽
 * @example
 * <ContentDetailWrap title="标题" message="消息内容">
 *   <template #header>
 *     <h2>自定义标题</h2>
 *   </template>
 *   <p>具体内容在这里展示。</p>
 * </ContentDetailWrap>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ContentDetailWrap
 */

// 导入 ElCard 组件
import { ElCard } from 'element-plus'
// 导入 propTypes 工具
import { propTypes } from '@/utils/propTypes'
// 导入设计相关的钩子
import { useDesign } from '@/hooks/web/useDesign'

// 使用设计钩子获取样式前缀函数
const { getPrefixCls } = useDesign()

// 根据组件名生成样式前缀
const prefixCls = getPrefixCls('content-detail-wrap')

// 定义 props
defineProps({
	/**
	 * @property {string} title - 组件的标题
	 * @default ''
	 */
	title: propTypes.string.def(''),
	/**
	 * @property {string} message - 组件的消息内容
	 * @default ''
	 */
	message: propTypes.string.def('')
})
</script>

<template>
	<div :class="[`${prefixCls}-container`, 'relative']">
		<ElCard :class="[`${prefixCls}-body`, 'mb-20px']" shadow="never">
			<div class="mb-20px pb-20px" style="border-bottom: 1px solid var(--el-border-color)">
				<!-- 插槽用于自定义头部内容 -->
				<slot name="header"></slot>
			</div>
			<!-- 默认插槽用于展示其他内容 -->
			<slot></slot>
		</ElCard>
	</div>
</template>
