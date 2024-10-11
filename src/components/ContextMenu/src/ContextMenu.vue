<script setup lang="ts">
/**
 * @file ContextMenu.vue
 * @description 上下文菜单组件的实现
 * @example
 * <ContextMenu :schema="menuItems" @visibleChange="handleVisibleChange" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module ContextMenu
 */

/** 导入 Element Plus 的下拉菜单相关组件 */
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'

/** 导入 Vue 的 PropType 类型 */
import type { PropType } from 'vue'

/** 导入 Vue 的响应式 API */
import { ref } from 'vue'

/** 导入国际化的钩子 */
import { useI18n } from '@/hooks/web/useI18n'

/** 导入设计相关的钩子 */
import { useDesign } from '@/hooks/web/useDesign'

/** 导入 Vue Router 中的路由类型 */
import type { RouteLocationNormalizedLoaded } from 'vue-router'

/** 导入上下文菜单模式的类型定义 */
import type { ContextMenuSchema } from './types'

/** 获取设计前缀的函数 */
const { getPrefixCls } = useDesign()

/** 定义上下文菜单的前缀类名 */
const prefixCls = getPrefixCls('context-menu')

/** 国际化函数 */
const { t } = useI18n()

/** 定义自定义事件的发射函数 */
const emit = defineEmits(['visibleChange'])

/** 定义组件的 props */
const props = defineProps({
	/** 上下文菜单项的 schema */
	schema: {
		type: Array as PropType<ContextMenuSchema[]>, // 定义 schema 的类型为 ContextMenuSchema 数组
		default: () => [] // 默认值为空数组
	},
	/** 菜单的触发方式 */
	trigger: {
		type: String as PropType<'click' | 'hover' | 'focus' | 'contextmenu'>, // 定义触发方式的类型
		default: 'contextmenu' // 默认触发方式为右键菜单
	},
	/** 当前选中的路由项 */
	tagItem: {
		type: Object as PropType<RouteLocationNormalizedLoaded>, // 定义 tagItem 的类型
		default: () => ({}) // 默认值为空对象
	}
})

/** 执行菜单项的命令 */
const command = (item: ContextMenuSchema) => {
	/** 如果菜单项定义了 command，则调用它 */
	// item.command && item.command(item)
	if (item.command) item.command(item)
}

/** 处理可见性变化事件 */
const visibleChange = (visible: boolean) => {
	/** 触发自定义事件 visibleChange，并传递当前可见性状态和 tagItem */
	emit('visibleChange', visible, props.tagItem)
}

/** 定义溢出接口，暴露给父组件使用 */
const elDropdownMenuRef = ref<ComponentRef<typeof ElDropdown>>() // 创建对下拉菜单组件的引用

/** 定义暴露的接口 */
defineExpose({
	elDropdownMenuRef, // 暴露的下拉菜单引用
	tagItem: props.tagItem // 暴露当前选中的路由项
})

/*
<template>
	<ElDropdown
		// 引用下拉菜单组件 
		ref="elDropdownMenuRef"
		:class="prefixCls"  // 使用定义的前缀类名
		:trigger="trigger"  // 触发方式
		placement="bottom-start"  // 下拉菜单显示位置
		@command="command"  // 处理菜单项的命令
		@visible-change="visibleChange"  // 处理可见性变化事件
		popper-class="v-context-menu-popper"  // 下拉菜单的类名
	>
		<slot></slot>  // 插槽，用于插入自定义内容
		<template #dropdown>
			<ElDropdownMenu>
				<ElDropdownItem
					v-for="(item, index) in schema"  // 遍历菜单项
					:key="`dropdown${index}`"  // 每个菜单项的唯一键
					:divided="item.divided"  // 设置菜单项的分隔状态
					:disabled="item.disabled"  // 设置菜单项的禁用状态
					:command="item"  // 将当前项传递给命令处理
				>
					<Icon :icon="item.icon" /> {{ t(item.label) }}  // 显示图标和标签，支持国际化
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>
</template>
*/
</script>

<template>
	<ElDropdown
		ref="elDropdownMenuRef"
		:class="prefixCls"
		:trigger="trigger"
		placement="bottom-start"
		@command="command"
		@visible-change="visibleChange"
		popper-class="v-context-menu-popper"
	>
		<slot></slot>
		<template #dropdown>
			<ElDropdownMenu>
				<ElDropdownItem
					v-for="(item, index) in schema"
					:key="`dropdown${index}`"
					:divided="item.divided"
					:disabled="item.disabled"
					:command="item"
				>
					<Icon :icon="item.icon" /> {{ t(item.label) }}
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>
</template>
