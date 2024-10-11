<script setup lang="ts">
/**
 * @file Error.vue
 * @description 这是一个用于展示错误页面的组件，例如404、500、403错误。
 * @example <Error type="404" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Error
 */

// 导入错误图标
import pageError from '@/assets/svgs/404.svg' // 404错误图标
import networkError from '@/assets/svgs/500.svg' // 500错误图标
import noPermission from '@/assets/svgs/403.svg' // 403错误图标
import { propTypes } from '@/utils/propTypes' // 导入属性类型验证工具
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化hooks

// 定义错误信息映射接口
interface ErrorMap {
	url: string // 错误图标的URL
	message: string // 错误信息文本
	buttonText: string // 按钮文本
}

// 获取国际化函数
const { t } = useI18n()

// 定义错误信息映射
const errorMap: {
	[key: string]: ErrorMap // 错误类型到错误信息的映射
} = {
	'404': {
		// 404错误
		url: pageError, // 显示的图标
		message: t('error.pageError'), // 错误信息
		buttonText: t('error.returnToHome') // 返回首页按钮文本
	},
	'500': {
		// 500错误
		url: networkError, // 显示的图标
		message: t('error.networkError'), // 错误信息
		buttonText: t('error.returnToHome') // 返回首页按钮文本
	},
	'403': {
		// 403错误
		url: noPermission, // 显示的图标
		message: t('error.noPermission'), // 错误信息
		buttonText: t('error.returnToHome') // 返回首页按钮文本
	}
}

// 定义组件属性
const props = defineProps({
	type: propTypes.string.validate((v: string) => ['404', '500', '403'].includes(v)).def('404') // 验证type属性是否为预定义的错误类型
})

// 定义组件发出的事件
const emit = defineEmits(['errorClick']) // 定义errorClick事件

/**
 * 按钮点击处理函数
 * @function btnClick
 * @returns {void}
 */
const btnClick = () => {
	emit('errorClick', props.type) // 触发errorClick事件并传递当前错误类型
}
</script>

<template>
	<div class="flex justify-center">
		<!-- 使用flex居中容器 -->
		<div class="text-center">
			<!-- 文本居中 -->
			<img width="350" :src="errorMap[type].url" alt="" />
			<!-- 显示错误图标 -->
			<div class="text-14px text-[var(--el-color-info)]">{{ errorMap[type].message }}</div>
			<!-- 显示错误信息 -->
			<div class="mt-20px">
				<!-- 上边距 -->
				<BaseButton type="primary" @click="btnClick">{{ errorMap[type].buttonText }}</BaseButton>
				<!-- 显示按钮并绑定点击事件 -->
			</div>
		</div>
	</div>
</template>
