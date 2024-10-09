<script setup lang="ts">
/**
 * @file InputPassword.vue
 * @description 这是一个密码输入框组件，具有密码强度显示功能。
 *              组件使用了 zxcvbn 库来评估密码强度，并根据强度变化显示不同的样式。
 * @example
 * <InputPassword v-model="password" :strength="true" />
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module InputPassword
 */

// 引入 Vue 相关的函数和类型
import { ref, unref, computed, watch } from 'vue'
// 引入 Element Plus 的输入框组件
import { ElInput } from 'element-plus'
// 引入自定义的属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入全局配置的自定义 Hook
import { useConfigGlobal } from '@/hooks/web/useConfigGlobal'
// 引入 zxcvbn 密码强度检测库
import { zxcvbn } from '@zxcvbn-ts/core'
// 引入 zxcvbn 结果类型
import type { ZxcvbnResult } from '@zxcvbn-ts/core'
// 引入设计相关的自定义 Hook
import { useDesign } from '@/hooks/web/useDesign'

// 使用 design hook 获取前缀类名
const { getPrefixCls } = useDesign()

// 定义输入框的前缀类名
const prefixCls = getPrefixCls('input-password')

// 定义组件的 props
const props = defineProps({
	// 是否显示密码强度
	strength: propTypes.bool.def(false),
	// 绑定的密码值
	modelValue: propTypes.string.def('')
})

// 监听 modelValue 的变化
watch(
	() => props.modelValue,
	(val: string) => {
		// 如果新值与当前值相同，则不执行任何操作
		if (val === unref(valueRef)) return
		// 更新输入框的值
		valueRef.value = val
	}
)

// 使用全局配置
const { configGlobal } = useConfigGlobal()

// 定义自定义事件
const emit = defineEmits(['update:modelValue'])

// 设置 input 的 type 属性，初始为 'password'
const textType = ref<'password' | 'text'>('password')

// 输入框的值，初始为 modelValue 的值
const valueRef = ref(props.modelValue)

// 监听 valueRef 的变化
watch(
	() => valueRef.value,
	(val: string) => {
		// 触发更新事件，将新值传递出去
		emit('update:modelValue', val)
	}
)

// 计算属性：获取密码强度
const getPasswordStrength = computed(() => {
	// 获取输入框的值
	const value = unref(valueRef)
	// 使用 zxcvbn 计算密码强度
	const zxcvbnRef = zxcvbn(unref(valueRef)) as ZxcvbnResult
	// 如果有输入值，返回强度分数；否则返回 -1
	return value ? zxcvbnRef.score : -1
})
</script>

<template>
	<!-- 输入框的外层 div，使用 prefixCls 作为类名 -->
	<div :class="[prefixCls, `${prefixCls}--${configGlobal?.size}`]">
		<!-- Element Plus 输入框，绑定 valueRef，显示密码，设置 type -->
		<ElInput v-bind="$attrs" v-model="valueRef" showPassword :type="textType" />
		<!-- 如果 strength 为 true，则显示密码强度条 -->
		<div
			v-if="strength"
			:class="`${prefixCls}__bar`"
			class="relative h-6px mt-10px mb-6px mr-auto ml-auto"
		>
			<!-- 填充的强度条，动态设置 data-score -->
			<div :class="`${prefixCls}__bar--fill`" :data-score="getPasswordStrength"></div>
		</div>
	</div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-input-password';

// 基础样式
.@{prefix-cls} {
	:deep(.@{elNamespace}-input__clear) {
		// 清除按钮左边的边距
		margin-left: 5px;
	}

	// 密码强度条的样式
	&__bar {
		background-color: var(--el-text-color-disabled); // 默认背景颜色
		border-radius: var(--el-border-radius-base); // 圆角

		// 强度条的伪元素
		&::before,
		&::after {
			position: absolute;
			z-index: 10;
			display: block;
			width: 20%; // 伪元素宽度
			height: inherit; // 继承高度
			background-color: transparent; // 背景透明
			border-color: var(--el-color-white); // 边框颜色
			border-style: solid; // 边框样式
			border-width: 0 5px; // 边框宽度
			content: ''; // 内容为空
		}

		&::before {
			left: 20%; // 伪元素定位
		}

		&::after {
			right: 20%; // 伪元素定位
		}

		// 填充强度条的样式
		&--fill {
			position: absolute;
			width: 0; // 初始宽度为 0
			height: inherit; // 继承高度
			background-color: transparent; // 背景透明
			border-radius: inherit; // 继承圆角
			transition:
				// 过渡动画
				width 0.5s ease-in-out,
				background 0.25s;

			// 根据密码强度动态设置样式
			&[data-score='0'] {
				width: 20%;
				background-color: var(--el-color-danger);
			}

			&[data-score='1'] {
				width: 40%;
				background-color: var(--el-color-danger);
			}

			&[data-score='2'] {
				width: 60%;
				background-color: var(--el-color-warning);
			}

			&[data-score='3'] {
				width: 80%;
				background-color: var(--el-color-success);
			}

			&[data-score='4'] {
				width: 100%;
				background-color: var(--el-color-success);
			}
		}
	}

	// 小型输入框的强度条
	&--mini > &__bar {
		border-radius: var(--el-border-radius-small);
	}
}
</style>
