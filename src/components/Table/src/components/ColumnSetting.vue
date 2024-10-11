<script setup lang="ts">
/**
 * @file ColumnSetting.vue
 * @description 列设置组件，用于显示和调整表格列的可见性、固定状态及排序
 * @example <ColumnSetting :columns="columns" @confirm="handleConfirm" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module 列设置
 */

import {
	ElDrawer, // 导入 Element Plus 弹出抽屉组件
	ElCheckbox, // 导入 Element Plus 复选框组件
	ElCheckboxGroup, // 导入 Element Plus 复选框组组件
	ElText, // 导入 Element Plus 文字组件
	ElRadioButton, // 导入 Element Plus 单选按钮组件
	ElRadioGroup // 导入 Element Plus 单选按钮组组件
} from 'element-plus'

import type { TableColumn } from '../types' // 导入表格列类型
import type { PropType } from 'vue' // 导入 Vue 的 Prop 类型
import { ref, watch, unref } from 'vue' // 导入 Vue 的响应式引用、侦听和解引用方法
import { cloneDeep } from 'lodash-es' // 导入 lodash 的深拷贝方法
import { DEFAULT_FILTER_COLUMN } from '@/constants' // 导入默认过滤列常量
import { VueDraggable } from 'vue-draggable-plus' // 导入可拖拽组件

const modelValue = defineModel<boolean>() // 定义双向绑定模型变量

const props = defineProps({
	columns: {
		type: Array as PropType<TableColumn[]>, // 定义属性类型为 TableColumn 数组
		default: () => [] // 默认值为空数组
	}
})

const emit = defineEmits(['confirm']) // 定义组件发出的事件

const oldColumns = ref<TableColumn[]>() // 存储旧列的引用

const settingColumns = ref<TableColumn[]>() // 存储当前设置的列

// 存储不要的列
const hiddenColumns = ref<TableColumn[]>([]) // 存储隐藏列的引用

const defaultCheckColumns = ref<string[]>([]) // 存储默认选择的列
const checkColumns = ref<string[]>([]) // 存储当前选中的列

const checkAll = ref(false) // 存储全选状态
const isIndeterminate = ref(true) // 存储不确定状态

/**
 * 处理全选复选框改变事件
 * @param val 要设置的全选框状态
 */
const handleCheckAllChange = (val: boolean) => {
	checkColumns.value = val ? unref(defaultCheckColumns) : [] // 根据全选状态设置选中的列
	isIndeterminate.value = false // 设置不确定状态为 false
}

/**
 * 处理选中列变化事件
 * @param value 当前选中列的数组
 */
const handleCheckedColumnsChange = (value: string[]) => {
	const checkedCount = value.length // 获取选中列的数量
	checkAll.value = checkedCount === unref(defaultCheckColumns)?.length // 设置全选状态
	isIndeterminate.value = checkedCount > 0 && checkedCount < unref(defaultCheckColumns)?.length // 设置不确定状态
}

/**
 * 确认按钮点击事件
 */
const confirm = () => {
	const newColumns = cloneDeep(unref(settingColumns))?.map((item) => {
		const fixed = unref(settingColumns)?.find((col) => col.field === item.field)?.fixed // 查找当前列的固定状态
		item.hidden = !unref(checkColumns)?.includes(item.field) // 设置列的隐藏状态
		item.fixed = fixed ? fixed : undefined // 处理固定状态
		return item // 返回处理过的列
	})
	emit('confirm', [...unref(hiddenColumns), ...(newColumns || [])]) // 发出确认事件，并传递新的列数据
	modelValue.value = false // 关闭抽屉
}

/**
 * 还原按钮点击事件
 */
const restore = () => {
	initColumns([...unref(hiddenColumns), ...(unref(oldColumns) || [])], true) // 调用初始化函数恢复列
}

/**
 * 初始化列设置
 * @param columns 初始化的列数据
 * @param isReStore 是否为还原操作
 */
const initColumns = (columns: TableColumn[], isReStore = false) => {
	const newColumns = columns?.filter((item) => {
		if (!isReStore) {
			item.fixed = item.fixed !== void 0 ? item.fixed : undefined // 如果不是还原，则设置固定状态
		}
		return (item.type && !DEFAULT_FILTER_COLUMN.includes(item.type)) || !item.type // 过滤不需要的列
	})

	if (!unref(oldColumns)?.length) {
		oldColumns.value = cloneDeep(newColumns) // 存储旧列
	}
	settingColumns.value = cloneDeep(newColumns) // 更新当前设置的列

	hiddenColumns.value = cloneDeep(
		columns?.filter((item) => item.type && DEFAULT_FILTER_COLUMN.includes(item.type)) // 筛选隐藏列
	)

	defaultCheckColumns.value = unref(settingColumns)?.map((item) => item.field) || [] // 获取默认选中的列
	checkColumns.value =
		unref(settingColumns)
			?.filter((item) => !item.hidden)
			?.map((item) => item.field) || [] // 获取当前选中的列

	if (unref(checkColumns)?.length === unref(defaultCheckColumns)?.length) {
		checkAll.value = true // 如果选中列数量与默认相同，则全选状态为 true
		isIndeterminate.value = false // 设置不确定状态为 false
	}
}

watch(
	() => props.columns, // 监听传入的列数据
	(columns) => {
		initColumns(columns) // 当列数据变更时初始化列
	},
	{
		immediate: true, // 立即执行
		deep: true // 深度监听
	}
)

/*
<template>
	<ElDrawer v-model="modelValue" title="列设置" size="350px"> <!-- 弹出抽屉 -->
		<div>
			<div class="flex items-center justify-between">
				<div class="flex items-center justify-between">
					<ElCheckbox
						v-model="checkAll" <!-- 绑定全选状态 -->
						:indeterminate="isIndeterminate" <!-- 设置不确定状态 -->
						@change="handleCheckAllChange" <!-- 处理全选框变化 -->
					/>
					<ElText class="ml-8px!">{{ checkColumns.length }} / {{ settingColumns?.length }}</ElText> <!-- 显示选中列数量 -->
				</div>
				<ElText>固定 / 排序</ElText> <!-- 固定和排序文字 -->
			</div>
			<div v-if="settingColumns?.length"> <!-- 如果存在设置的列 -->
				<VueDraggable
					v-model="settingColumns" <!-- 绑定可拖拽的列 -->
					target=".el-checkbox-group" <!-- 指定拖拽目标 -->
					handle=".handle" <!-- 指定拖拽手柄 -->
					:animation="150" <!-- 设置动画时间 -->
				>
					<ElCheckboxGroup
						ref="draggableWrap" <!-- 引用拖拽包裹 -->
						v-model="checkColumns" <!-- 绑定选中列 -->
						@change="handleCheckedColumnsChange" <!-- 处理选中列变化 -->
					>
						<div
							v-for="item in settingColumns" <!-- 遍历设置的列 -->
							:key="item.field" <!-- 设置唯一键 -->
							class="flex items-center justify-between mt-12px" <!-- 设置样式 -->
						>
							<ElCheckbox :label="item.field"> <!-- 创建复选框 -->
								{{ item.label }} <!-- 显示列标签 -->
							</ElCheckbox>
							<div class="flex items-center"> <!-- 包裹固定和拖拽手柄 -->
								<ElRadioGroup size="small" v-model="item.fixed"> <!-- 创建单选按钮组 -->
									<ElRadioButton label="left"> <!-- 左固定按钮 -->
										<Icon icon="vi-ep:arrow-left" /> <!-- 左箭头图标 -->
									</ElRadioButton>
									<ElRadioButton :label="undefined"> <!-- 不固定按钮 -->
										<Icon icon="vi-ep:close" /> <!-- 关闭图标 -->
									</ElRadioButton>
									<ElRadioButton label="right"> <!-- 右固定按钮 -->
										<Icon icon="vi-ep:arrow-right" /> <!-- 右箭头图标 -->
									</ElRadioButton>
								</ElRadioGroup>

								<div class="ml-12px cursor-move handle"><Icon icon="vi-ep:rank" /></div> <!-- 拖拽手柄 -->
							</div>
						</div>
					</ElCheckboxGroup>
				</VueDraggable>
			</div>
		</div>
		<template #footer>
			<div>
				<BaseButton @click="restore">还原</BaseButton> <!-- 还原按钮 -->
				<BaseButton type="primary" @click="confirm">确定</BaseButton> <!-- 确定按钮 -->
			</div>
		</template>
	</ElDrawer>
</template>
*/
</script>

<template>
	<ElDrawer v-model="modelValue" title="列设置" size="350px">
		<div>
			<div class="flex items-center justify-between">
				<div class="flex items-center justify-between">
					<ElCheckbox
						v-model="checkAll"
						:indeterminate="isIndeterminate"
						@change="handleCheckAllChange"
					/>
					<ElText class="ml-8px!">{{ checkColumns.length }} / {{ settingColumns?.length }}</ElText>
				</div>
				<ElText>固定 / 排序</ElText>
			</div>
			<div v-if="settingColumns?.length">
				<VueDraggable
					v-model="settingColumns"
					target=".el-checkbox-group"
					handle=".handle"
					:animation="150"
				>
					<ElCheckboxGroup
						ref="draggableWrap"
						v-model="checkColumns"
						@change="handleCheckedColumnsChange"
					>
						<div
							v-for="item in settingColumns"
							:key="item.field"
							class="flex items-center justify-between mt-12px"
						>
							<ElCheckbox :label="item.field">
								{{ item.label }}
							</ElCheckbox>
							<div class="flex items-center">
								<ElRadioGroup size="small" v-model="item.fixed">
									<ElRadioButton label="left">
										<Icon icon="vi-ep:arrow-left" />
									</ElRadioButton>
									<ElRadioButton :label="undefined">
										<Icon icon="vi-ep:close" />
									</ElRadioButton>
									<ElRadioButton label="right">
										<Icon icon="vi-ep:arrow-right" />
									</ElRadioButton>
								</ElRadioGroup>

								<div class="ml-12px cursor-move handle"><Icon icon="vi-ep:rank" /></div>
							</div>
						</div>
					</ElCheckboxGroup>
				</VueDraggable>
			</div>
		</div>
		<template #footer>
			<div>
				<BaseButton @click="restore">还原</BaseButton>
				<BaseButton type="primary" @click="confirm">确定</BaseButton>
			</div>
		</template>
	</ElDrawer>
</template>
