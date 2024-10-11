<script setup lang="ts">
/**
 * @file ActionButton.vue
 * @description 这是一个可重用的操作按钮组件，提供搜索、重置和展开功能。
 * @example <ActionButton :showSearch="true" :showReset="true" :showExpand="false" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ButtonActions
 */

// 导入图标使用的自定义 hook
import { useIcon } from '@/hooks/web/useIcon'

// 导入属性类型工具
import { propTypes } from '@/utils/propTypes'

// 导入国际化处理的 hook
import { useI18n } from '@/hooks/web/useI18n'

// 定义组件的事件
const emit = defineEmits(['search', 'reset', 'expand'])

// 使用国际化 hook
const { t } = useI18n()

/** 定义组件的 props 属性 */
defineProps({
	/** 是否显示搜索按钮，默认为 true */
	showSearch: propTypes.bool.def(true),
	/** 是否显示重置按钮，默认为 true */
	showReset: propTypes.bool.def(true),
	/** 是否显示展开按钮，默认为 false */
	showExpand: propTypes.bool.def(false),
	/** 控制展开按钮的状态，默认为 true */
	visible: propTypes.bool.def(true),
	/** 搜索按钮的加载状态，默认为 false */
	searchLoading: propTypes.bool.def(false),
	/** 重置按钮的加载状态，默认为 false */
	resetLoading: propTypes.bool.def(false)
})

/**
 * 触发搜索事件
 */
const onSearch = () => {
	emit('search') // 触发 search 事件
}

/**
 * 触发重置事件
 */
const onReset = () => {
	emit('reset') // 触发 reset 事件
}

/**
 * 触发展开/收起事件
 */
const onExpand = () => {
	emit('expand') // 触发 expand 事件
}
/*

<template>
    <BaseButton
        v-if="showSearch" // 条件渲染，如果 showSearch 为 true 则显示搜索按钮
        type="primary" // 设置按钮类型为主要按钮
        :loading="searchLoading" // 设置搜索按钮的加载状态
        :icon="useIcon({ icon: 'vi-ep:search' })" // 设置搜索按钮的图标
        @click="onSearch" // 点击事件，调用 onSearch 方法
    >
        {{ t('common.query') }} // 国际化文字，显示查询文本
    </BaseButton>
    <BaseButton
        v-if="showReset" // 条件渲染，如果 showReset 为 true 则显示重置按钮
        :loading="resetLoading" // 设置重置按钮的加载状态
        plain // 设置按钮为朴素样式
        :icon="useIcon({ icon: 'vi-ep:refresh-right' })" // 设置重置按钮的图标
        @click="onReset" // 点击事件，调用 onReset 方法
    >
        {{ t('common.reset') }} // 国际化文字，显示重置文本
    </BaseButton>
    <BaseButton
        v-if="showExpand" // 条件渲染，如果 showExpand 为 true 则显示展开按钮
        :icon="useIcon({ icon: visible ? 'vi-ep:arrow-up' : 'vi-ep:arrow-down' })" // 根据 visible 状态设置图标
        text // 设置按钮为文本样式
        @click="onExpand" // 点击事件，调用 onExpand 方法
    >
        {{ t(visible ? 'common.shrink' : 'common.expand') }} // 根据 visible 状态国际化文本，显示展开或收起
    </BaseButton>
</template>
*/
</script>

<template>
	<BaseButton
		v-if="showSearch"
		type="primary"
		:loading="searchLoading"
		:icon="useIcon({ icon: 'vi-ep:search' })"
		@click="onSearch"
	>
		{{ t('common.query') }}
	</BaseButton>
	<BaseButton
		v-if="showReset"
		:loading="resetLoading"
		plain
		:icon="useIcon({ icon: 'vi-ep:refresh-right' })"
		@click="onReset"
	>
		{{ t('common.reset') }}
	</BaseButton>
	<BaseButton
		v-if="showExpand"
		:icon="useIcon({ icon: visible ? 'vi-ep:arrow-up' : 'vi-ep:arrow-down' })"
		text
		@click="onExpand"
	>
		{{ t(visible ? 'common.shrink' : 'common.expand') }}
	</BaseButton>
</template>
