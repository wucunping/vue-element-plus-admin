<script setup lang="ts">
/**
 * @file ContentWrap.vue
 * @description 内容包装组件，提供标题和消息提示
 * @example
 * <ContentWrap title="标题" message="提示信息">
 *   <template #header>
 *     自定义头部内容
 *   </template>
 *   <div>
 *     主体内容
 *   </div>
 * </ContentWrap>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ContentWrapComponent
 */

// 导入 Element Plus 组件
import { ElCard, ElTooltip } from 'element-plus'
// 导入属性验证工具
import { propTypes } from '@/utils/propTypes'
// 导入设计样式钩子
import { useDesign } from '@/hooks/web/useDesign'

// 获取设计前缀类的方法
const { getPrefixCls } = useDesign()

// 定义前缀类
const prefixCls = getPrefixCls('content-wrap')

// 定义组件的 props
defineProps({
	/** 标题字符串，默认为空 */
	title: propTypes.string.def(''),
	/** 消息字符串，默认为空 */
	message: propTypes.string.def('')
})
</script>

<template>
	<!-- 使用 ElCard 组件作为内容容器 -->
	<ElCard :class="[prefixCls]" shadow="never">
		<!-- 判断是否存在标题 -->
		<template v-if="title" #header>
			<div class="flex items-center">
				<!-- 显示标题 -->
				<span class="text-16px font-700">{{ title }}</span>
				<!-- 如果存在消息，则使用 ElTooltip 显示提示 -->
				<ElTooltip v-if="message" effect="dark" placement="right">
					<template #content>
						<!-- 显示消息内容 -->
						<div class="max-w-200px">{{ message }}</div>
					</template>
					<!-- 询问图标 -->
					<Icon class="ml-5px" icon="vi-bi:question-circle-fill" :size="14" />
				</ElTooltip>
				<div class="flex pl-20px flex-grow">
					<!-- 自定义头部插槽 -->
					<slot name="header"></slot>
				</div>
			</div>
		</template>
		<div>
			<!-- 主体内容插槽 -->
			<slot></slot>
		</div>
	</ElCard>
</template>
