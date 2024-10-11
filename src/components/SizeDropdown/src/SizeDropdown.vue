<script setup lang="ts">
/**
 * @file SizeDropdown.vue
 * @description 尺寸下拉选择组件
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module SizeDropdown
 */

import { computed } from 'vue' // 导入 Vue 的 computed API，用于创建计算属性
import type { ComponentSize } from 'element-plus'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus' // 导入 Element Plus 的下拉菜单组件和组件尺寸类型
import { useAppStore } from '@/store/modules/app' // 导入 app 模块的状态管理
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化解决方案的Hook
import { propTypes } from '@/utils/propTypes' // 导入类型校验工具
import { useDesign } from '@/hooks/web/useDesign' // 导入设计样式的Hook

const { getPrefixCls } = useDesign() // 获取前缀类名的方法

const prefixCls = getPrefixCls('size-dropdown') // 生成组件类名前缀

// 定义组件的 props
defineProps({
	color: propTypes.string.def('') // color 属性，默认值为空字符串
})

// 调用国际化方法
const { t } = useI18n()

const appStore = useAppStore() // 获取应用状态管理实例

const sizeMap = computed(() => appStore.sizeMap) // 计算属性，获取可用尺寸映射

/**
 * 设置当前尺寸
 * @param {ComponentSize} size - 需要设置的尺寸
 */
const setCurrentSize = (size: ComponentSize) => {
	appStore.setCurrentSize(size) // 调用状态管理的方法设置当前尺寸
}
</script>

<template>
	<ElDropdown :class="prefixCls" trigger="click" @command="setCurrentSize">
		<!-- 创建下拉菜单触发器 -->
		<Icon :size="18" icon="vi-mdi:format-size" :color="color" class="cursor-pointer" />
		<!-- 尺寸图标 -->
		<template #dropdown>
			<!-- 定义下拉菜单内容 -->
			<ElDropdownMenu>
				<!-- 下拉菜单容器 -->
				<!-- 遍历 sizeMap 渲染每个尺寸选项 -->
				<ElDropdownItem v-for="item in sizeMap" :key="item" :command="item">
					{{ t(`size.${item}`) }}
					<!-- 国际化尺寸名称 -->
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>
</template>
