/**
 * @file useTable.ts
 * @description 该文件定义了一个自定义钩子 useTable，用于处理表格数据的获取、操作和状态管理。它提供了一系列方法来管理和更新表格组件的属性、列数据，并实施删除操作。
 * @example
 * const { tableRegister, tableMethods, tableState } = useTable({
 *   fetchDataApi: async () => {
 *     // API请求逻辑
 *     return {
 *       list: [...], // 表格数据
 *       total: 100 // 数据总数
 *     }
 *   },
 *   fetchDelApi: async () => {
 *     // 删除操作的API请求逻辑
 *     return true;
 *   },
 *   immediate: true // 初始化时立即请求数据
 * });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module TableComponent
 */

import { useI18n } from '@/hooks/web/useI18n' // 引入国际化钩子
import { Table, TableExpose, TableProps, TableSetProps, TableColumn } from '@/components/Table' // 引入表格相关组件及类型
import { ElTable, ElMessageBox, ElMessage } from 'element-plus' // 引入Element Plus中的表格组件和消息框组件
import { ref, watch, unref, nextTick, onMounted } from 'vue' // 引入Vue的响应式API和生命周期钩子

const { t } = useI18n() // 获取国际化函数

/**
 * 定义用于表格配置的接口
 */
interface UseTableConfig {
	/**
	 * 是否初始化的时候请求一次
	 */
	immediate?: boolean // 是否立即请求数据
	fetchDataApi: () => Promise<{
		list: any[] // 表格数据列表
		total?: number // 数据总数
	}>
	fetchDelApi?: () => Promise<boolean> // 删除数据的API
}

/**
 * 导出表格钩子的自定义 Hook
 */
export const useTable = (config: UseTableConfig) => {
	// 创建useTable函数，接收配置
	const { immediate = true } = config // 解构配置，默认立即请求数据

	const loading = ref(false) // 加载状态
	const currentPage = ref(1) // 当前页码
	const pageSize = ref(10) // 每页显示的条数
	const total = ref(0) // 数据总数
	const dataList = ref<any[]>([]) // 存储表格数据列表

	// 监听当前页码的变化，如果变化则调用获取数据的方法
	watch(
		() => currentPage.value,
		() => {
			methods.getList() // 调用获取列表的方法
		}
	)

	// 监听每页显示条数的变化
	watch(
		() => pageSize.value,
		() => {
			// 当前页不为1时，修改页数后会导致多次调用getList方法
			if (unref(currentPage) === 1) {
				// 如果当前页是第一页
				methods.getList() // 直接调用获取列表的方法
			} else {
				currentPage.value = 1 // 置为第一页
				methods.getList() // 调用获取列表的方法
			}
		}
	)

	// 组件挂载后，如果immediate为true则立即获取数据
	onMounted(() => {
		if (immediate) {
			methods.getList() // 调用获取列表的方法
		}
	})

	// Table实例的引用
	const tableRef = ref<typeof Table & TableExpose>()

	// ElTable实例的引用
	const elTableRef = ref<ComponentRef<typeof ElTable>>()

	/**
	 * 注册表格和ElTable实例
	 * @param ref 表格的引用
	 * @param elRef ElTable的引用
	 */
	const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
		tableRef.value = ref // 保存表格的引用
		elTableRef.value = unref(elRef) // 保存ElTable的引用
	}

	/**
	 * 获取表格的实例
	 * @returns 表格实例
	 */
	const getTable = async () => {
		await nextTick() // 等待下一个DOM更新
		const table = unref(tableRef) // 获取表格的实例
		if (!table) {
			console.error('The table is not registered. Please use the register method to register') // 如果实例不存在，输出错误信息
		}
		return table // 返回表格实例
	}

	const methods = {
		/**
		 * 获取表单数据
		 */
		getList: async () => {
			loading.value = true // 设置加载状态为true
			try {
				const res = await config?.fetchDataApi() // 调用配置中的获取数据API
				console.log('fetchDataApi res', res) // 输出获取的响应数据
				if (res) {
					dataList.value = res.list // 保存数据列表
					total.value = res.total || 0 // 保存数据总数
				}
			} catch (err) {
				console.log('fetchDataApi error') // 输出错误信息
			} finally {
				loading.value = false // 设置加载状态为false
			}
		},

		/**
		 * @description 设置table组件的props
		 * @param props table组件的props
		 */
		setProps: async (props: TableProps = {}) => {
			const table = await getTable() // 获取表格实例
			table?.setProps(props) // 设置表格的props
		},

		/**
		 * @description 设置column
		 * @param columnProps 需要设置的列
		 */
		setColumn: async (columnProps: TableSetProps[]) => {
			const table = await getTable() // 获取表格实例
			table?.setColumn(columnProps) // 设置表格的列
		},

		/**
		 * @description 新增column
		 * @param tableColumn 需要新增数据
		 * @param index 在哪里新增
		 */
		addColumn: async (tableColumn: TableColumn, index?: number) => {
			const table = await getTable() // 获取表格实例
			table?.addColumn(tableColumn, index) // 在指定位置新增列
		},

		/**
		 * @description 删除column
		 * @param field 删除哪个数据
		 */
		delColumn: async (field: string) => {
			const table = await getTable() // 获取表格实例
			table?.delColumn(field) // 删除指定的列
		},

		/**
		 * @description 获取ElTable组件的实例
		 * @returns ElTable instance
		 */
		getElTableExpose: async () => {
			await getTable() // 获取表格实例
			return unref(elTableRef) // 返回ElTable的实例
		},

		refresh: () => {
			methods.getList() // 刷新获取列表
		},

		// sortableChange: (e: any) => {
		//   console.log('sortableChange', e)
		//   const { oldIndex, newIndex } = e
		//   dataList.value.splice(newIndex, 0, dataList.value.splice(oldIndex, 1)[0])
		//   // to do something
		// }
		// 删除数据
		delList: async (idsLength: number) => {
			const { fetchDelApi } = config // 获取配置中的删除API
			if (!fetchDelApi) {
				// 如果删除API未定义
				console.warn('fetchDelApi is undefined') // 警告信息
				return // 退出函数
			}
			// 显示确认删除的对话框
			ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
				confirmButtonText: t('common.delOk'), // 确认按钮文本
				cancelButtonText: t('common.delCancel'), // 取消按钮文本
				type: 'warning' // 警告类型
			}).then(async () => {
				const res = await fetchDelApi() // 调用删除API
				if (res) {
					ElMessage.success(t('common.delSuccess')) // 删除成功的提示信息

					// 计算出临界点
					const current =
						unref(total) % unref(pageSize) === idsLength || unref(pageSize) === 1
							? unref(currentPage) > 1
								? unref(currentPage) - 1 // 如果在多页中删除，当前页减1
								: unref(currentPage) // 否则保持当前页
							: unref(currentPage) // 否则保持当前页

					currentPage.value = current // 更新当前页
					methods.getList() // 重新获取列表
				}
			})
		}
	}

	return {
		tableRegister: register, // 注册方法
		tableMethods: methods, // 表格方法
		tableState: {
			// 表格状态
			currentPage, // 当前页
			pageSize, // 每页大小
			total, // 数据总量
			dataList, // 数据列表
			loading // 加载状态
		}
	}
}
