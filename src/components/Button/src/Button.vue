<script setup lang="ts">
/**
 * @file Button.vue
 * @description 自定义按钮组件
 * @example
 * <BaseButton
 *    type="primary"
 *    @click="handleClick"
 * >
 *    Click Me
 * </BaseButton>
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module Button
 */

// 导入使用设计的钩子
import { useDesign } from '@/hooks/web/useDesign'

// 导入 Element Plus 中的按钮组件及类型
import { ElButton } from 'element-plus'
import type { ComponentSize, ButtonType } from 'element-plus'

// 从 Vue 导入所需的类型和函数
import { computed, unref } from 'vue'
import type { PropType, Component } from 'vue'

// 导入应用状态管理
import { useAppStore } from '@/store/modules/app'

/** 创建应用状态存储实例 */
const appStore = useAppStore()

/** 计算属性，获取主题 */
const getTheme = computed(() => appStore.getTheme)

/** 获取前缀类的方法 */
const { getPrefixCls } = useDesign()

/** 计算前缀类 */
const prefixCls = getPrefixCls('button')

/** 定义组件的属性 */
const props = defineProps({
	/** 按钮尺寸 */
	size: {
		type: String as PropType<ComponentSize>,
		default: undefined
	},
	/** 按钮类型 */
	type: {
		type: String as PropType<ButtonType>,
		default: 'default'
	},
	/** 是否禁用 */
	disabled: {
		type: Boolean,
		default: false
	},
	/** 是否为朴素按钮 */
	plain: {
		type: Boolean,
		default: false
	},
	/** 是否为文本按钮 */
	text: {
		type: Boolean,
		default: false
	},
	/** 是否为背景按钮 */
	bg: {
		type: Boolean,
		default: false
	},
	/** 是否为链接按钮 */
	link: {
		type: Boolean,
		default: false
	},
	/** 是否为圆形按钮 */
	round: {
		type: Boolean,
		default: false
	},
	/** 是否为圆形按钮 */
	circle: {
		type: Boolean,
		default: false
	},
	/** 是否为加载状态 */
	loading: {
		type: Boolean,
		default: false
	},
	/** 加载图标 */
	loadingIcon: {
		type: [String, Object] as PropType<string | Component>,
		default: undefined
	},
	/** 按钮图标 */
	icon: {
		type: [String, Object] as PropType<string | Component>,
		default: undefined
	},
	/** 是否自动获得焦点 */
	autofocus: {
		type: Boolean,
		default: false
	},
	/** 原生按钮类型 */
	nativeType: {
		type: String as PropType<'button' | 'submit' | 'reset'>,
		default: 'button'
	},
	/** 是否自动插入空格 */
	autoInsertSpace: {
		type: Boolean,
		default: false
	},
	/** 按钮颜色 */
	color: {
		type: String,
		default: ''
	},
	/** 是否加深颜色 */
	darker: {
		type: Boolean,
		default: false
	},
	/** 使用的标签 */
	tag: {
		type: [String, Object] as PropType<string | Component>,
		default: 'button'
	}
})

/** 定义事件 */
const emits = defineEmits(['click'])

/** 计算按钮颜色 */
const color = computed(() => {
	const { type, link } = props // 获取类型和链接
	if (type === 'primary' && !link) {
		return unref(getTheme).elColorPrimary // 返回主要颜色
	}
	return '' // 默认为空
})

/** 计算按钮样式 */
const style = computed(() => {
	const { type, link } = props // 获取类型和链接
	if (type === 'primary' && !link) {
		return '--el-button-text-color: #fff; --el-button-hover-text-color: #fff' // 返回按钮样式
	}
	return '' // 默认为空
})

/*
<template>
  <ElButton
    :class="`${prefixCls} color-#fff`" // 设置按钮的类
    v-bind="{ ...props }" // 绑定属性
    :color="color" // 绑定颜色
    :style="style" // 绑定样式
    @click="() => emits('click')" // 触发点击事件
  >
    <slot></slot> // 默认插槽
    <slot name="icon"></slot> // 图标插槽
    <slot name="loading"></slot> // 加载插槽
  </ElButton>
</template>
 */
</script>

<template>
	<ElButton
		:class="`${prefixCls} color-#fff`"
		v-bind="{ ...props }"
		:color="color"
		:style="style"
		@click="() => emits('click')"
	>
		<slot></slot>
		<slot name="icon"></slot>
		<slot name="loading"></slot>
	</ElButton>
</template>
