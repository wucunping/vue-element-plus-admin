<script lang="tsx">
/**
 * @file TableActions.vue
 * @description 表格操作组件
 * @example <TableActions :columns="columns" @refresh="refreshData" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module TableActions
 */

import type { PropType } from 'vue' // 导入 Vue 的类型定义
import { defineComponent, unref, computed, ref } from 'vue' // 导入 Vue 相关函数
import type { ComponentSize } from 'element-plus' // 导入 Element Plus 组件的尺寸类型
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus' // 导入 Element Plus 下拉菜单组件
import { Icon } from '@/components/Icon' // 导入自定义图标组件
import { useI18n } from '@/hooks/web/useI18n' // 导入国际化 Hook
import { useAppStore } from '@/store/modules/app' // 导入应用状态管理
import type { TableColumn } from '../types' // 导入表格列的类型定义
import ColumnSetting from './ColumnSetting.vue' // 导入列设置组件

export default defineComponent({
	// 定义一个 Vue 组件
	name: 'TableActions', // 组件名称
	components: {
		// 注册子组件
		ColumnSetting
	},
	props: {
		// 定义组件的属性
		columns: {
			// 表格列的数据
			type: Array as PropType<TableColumn[]>, // 类型为 TableColumn 数组
			default: () => [] // 默认值为空数组
		}
	},
	emits: ['refresh', 'changSize', 'confirm'], // 定义组件发出的事件
	setup(props, { emit }) {
		// 组件的 setup 函数
		const appStore = useAppStore() // 获取应用状态管理的实例
		const { t } = useI18n() // 获取国际化函数
		const sizeMap = computed(() => appStore.sizeMap) // 计算属性，读取尺寸映射
		const showSetting = ref(false) // 定义响应式变量，控制列设置窗口的显示

		/**
		 * 刷新表格数据
		 */
		const refresh = () => {
			emit('refresh') // 发出刷新事件
		}

		/**
		 * 改变表格尺寸
		 * @param size - 新的尺寸
		 */
		const changSize = (size: ComponentSize) => {
			emit('changSize', size) // 发出改变尺寸事件
		}

		/**
		 * 确认列设置
		 * @param columns - 修改后的列数据
		 */
		const confirm = (columns: TableColumn[]) => {
			emit('confirm', columns) // 发出确认事件
		}

		/**
		 * 显示列设置窗
		 */
		const showColumnSetting = () => {
			showSetting.value = true // 将响应式变量设置为 true，显示列设置
		}

		return () => (
			// 渲染函数
			<>
				<div class="text-right h-28px flex items-center justify-end">
					{' '}
					{/* 操作按钮容器 */}
					<div title="刷新" class="w-30px h-20px flex items-center justify-end" onClick={refresh}>
						{' '}
						{/* 刷新按钮 */}
						<Icon
							icon="vi-ant-design:sync-outlined" // 图标
							class="cursor-pointer" // 鼠标指针样式
							hover-color="var(--el-color-primary)" // 鼠标悬停颜色
						/>
					</div>
					<ElDropdown trigger="click" onCommand={changSize}>
						{' '}
						{/* 下拉菜单 */}
						{{
							default: () => {
								// 默认显示内容
								return (
									<div title="尺寸" class="w-30px h-20px flex items-center justify-end">
										{' '}
										{/* 尺寸选择按钮 */}
										<Icon
											icon="vi-ant-design:column-height-outlined" // 尺寸图标
											class="cursor-pointer" // 鼠标指针样式
											hover-color="var(--el-color-primary)" // 鼠标悬停颜色
										/>
									</div>
								)
							},
							dropdown: () => {
								// 下拉菜单内容
								return (
									<ElDropdownMenu>
										{' '}
										{/* 下拉菜单主体 */}
										{{
											default: () => {
												// 下拉项
												return unref(sizeMap).map((v) => {
													// 遍历尺寸映射
													return (
														<ElDropdownItem key={v} command={v}>
															{' '}
															{/* 下拉项 */}
															{t(`size.${v}`)} {/* 显示国际化尺寸名称 */}
														</ElDropdownItem>
													)
												})
											}
										}}
									</ElDropdownMenu>
								)
							}
						}}
					</ElDropdown>
					<div
						title="列设置" // 列设置按钮提示
						class="w-30px h-20px flex items-center justify-end" // 列设置按钮样式
						onClick={showColumnSetting} // 点击事件
					>
						<Icon
							icon="vi-ant-design:setting-outlined" // 列设置图标
							class="cursor-pointer" // 鼠标指针样式
							hover-color="var(--el-color-primary)" // 鼠标悬停颜色
						/>
					</div>
				</div>
				<ColumnSetting v-model={showSetting.value} columns={props.columns} onConfirm={confirm} />{' '}
				{/* 列设置组件 */}
			</>
		)
	}
})
</script>
