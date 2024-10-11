<script lang="tsx">
/**
 * @file Table.vue
 * @description 表格组件，提供分页、排序、工具栏及自定义内容功能
 * @example
 * <Table :data="tableData" :columns="tableColumns" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Table
 */

// 导入 Element Plus 组件需要的类型
import type { ComponentSize, ElTooltipProps } from 'element-plus'

// 导入 Element Plus 提供的组件
import { ElTable, ElTableColumn, ElPagination, ElImage, ElEmpty, ElCard } from 'element-plus'

// 导入 Vue 的类型
import type { PropType } from 'vue'

// 导入 Vue API
import { defineComponent, ref, computed, unref, watch, onMounted } from 'vue'

// 导入自定义的类型检查工具
import { propTypes } from '@/utils/propTypes'

// 导入辅助函数
import { setIndex } from './helper'

// 导入表格组件相关的类型
import type { TableProps, TableColumn, Pagination, TableSetProps } from './types'

// 导入 lodash 的 set 和 get 函数
import { set, get } from 'lodash-es'

// 导入 CSS 样式相关的类型
import type { CSSProperties } from 'vue'

// 导入自定义的插槽处理工具
import { getSlot } from '@/utils/tsxHelper'

// 导入工具栏组件
import TableActions from './components/TableActions.vue'

// 导入视频播放器组件的创建函数
import { createVideoViewer } from '@/components/VideoPlayer'

// 导入图标组件
import { Icon } from '@/components/Icon'

// 导入基础按钮组件
import { BaseButton } from '@/components/Button'

// 定义一个功能性组件
export default defineComponent({
	name: 'Table', // 组件名称
	props: {
		pageSize: propTypes.number.def(10), // 表示每页显示的条目数，默认为 10
		currentPage: propTypes.number.def(1), // 当前页码，默认为 1
		// 是否展示表格的工具栏
		showAction: propTypes.bool.def(false),
		// 是否所有的超出隐藏，优先级低于 schema 中的 showOverflowTooltip
		showOverflowTooltip: propTypes.bool.def(true),
		// 表头配置
		columns: {
			type: Array as PropType<TableColumn[]>, // 列的类型
			default: () => [] // 默认值为空数组
		},
		// 是否展示分页
		pagination: {
			type: Object as PropType<Pagination>, // 分页的类型
			default: (): Pagination | undefined => undefined // 默认值为未定义
		},
		// 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
		reserveSelection: propTypes.bool.def(false), // 默认不保留选择
		// 加载状态
		loading: propTypes.bool.def(false), // 默认不加载
		// 是否叠加索引
		reserveIndex: propTypes.bool.def(false), // 默认不叠加索引
		// 对齐方式
		align: propTypes.string
			.validate((v: string) => ['left', 'center', 'right'].includes(v)) // 验证对齐方式
			.def('left'), // 默认左对齐
		// 表头对齐方式
		headerAlign: propTypes.string
			.validate((v: string) => ['left', 'center', 'right'].includes(v)) // 验证表头对齐方式
			.def('left'), // 默认左对齐
		data: {
			type: Array as PropType<Recordable[]>, // 数据类型
			default: () => [] // 默认值为空数组
		},
		// 图片自动预览字段数组
		imagePreview: {
			type: Array as PropType<string[]>, // 图片预览字段类型
			default: () => [] // 默认值为空数组
		},
		// 视频自动预览字段数组
		videoPreview: {
			type: Array as PropType<string[]>, // 视频预览字段类型
			default: () => [] // 默认值为空数组
		},
		height: propTypes.oneOfType([Number, String]), // 表格高度
		maxHeight: propTypes.oneOfType([Number, String]), // 表格最大高度
		stripe: propTypes.bool.def(false), // 是否为斑马纹表格，默认不使用
		border: propTypes.bool.def(true), // 是否有边框，默认有
		size: {
			type: String as PropType<ComponentSize>, // 表格大小
			validator: (v: ComponentSize) => ['default', 'small', 'large'].includes(v) // 验证大小
		},
		fit: propTypes.bool.def(true), // 是否自适应宽度，默认自适应
		showHeader: propTypes.bool.def(true), // 是否展示表头，默认展示
		highlightCurrentRow: propTypes.bool.def(false), // 是否高亮当前行，默认不高亮
		currentRowKey: propTypes.oneOfType([Number, String]), // 当前行的 key
		// row-class-name, 类型为 (row: Recordable, rowIndex: number) => string | string
		rowClassName: {
			type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>, // 行类名类型
			default: '' // 默认空
		},
		rowStyle: {
			type: [Function, Object] as PropType<
				(row: Recordable, rowIndex: number) => Recordable | CSSProperties // 行样式类型
			>,
			default: undefined // 默认未定义
		},
		cellClassName: {
			type: [Function, String] as PropType<
				(row: Recordable, column: any, rowIndex: number) => string | string // 单元格类名类型
			>,
			default: '' // 默认空
		},
		cellStyle: {
			type: [Function, Object] as PropType<
				(row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties // 单元格样式类型
			>,
			default: undefined // 默认未定义
		},
		headerRowClassName: {
			type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>, // 表头行类名类型
			default: '' // 默认空
		},
		headerRowStyle: {
			type: [Function, Object] as PropType<
				(row: Recordable, rowIndex: number) => Recordable | CSSProperties // 表头行样式类型
			>,
			default: undefined // 默认未定义
		},
		headerCellClassName: {
			type: [Function, String] as PropType<
				(row: Recordable, column: any, rowIndex: number) => string | string // 表头单元格类名类型
			>,
			default: '' // 默认空
		},
		headerCellStyle: {
			type: [Function, Object] as PropType<
				(row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties // 表头单元格样式类型
			>,
			default: undefined // 默认未定义
		},
		rowKey: propTypes.string.def('id'), // 行的唯一标识，默认为 'id'
		emptyText: propTypes.string.def('No Data'), // 空状态文本，默认为 'No Data'
		defaultExpandAll: propTypes.bool.def(false), // 默认是否展开所有行，默认为不展开
		expandRowKeys: {
			type: Array as PropType<string[]>, // 展开行的 keys
			default: undefined // 默认未定义
		},
		defaultSort: {
			type: Object as PropType<{ prop: string; order: string }>, // 默认排序配置
			default: () => ({}) // 默认值为空对象
		},
		tooltipEffect: {
			type: String as PropType<'dark' | 'light'>, // 工具提示的效果类型
			default: 'dark' // 默认效果为 'dark'
		},
		tooltipOptions: {
			type: Object as PropType<
				Pick<
					ElTooltipProps,
					| 'effect'
					| 'enterable'
					| 'hideAfter'
					| 'offset'
					| 'placement'
					| 'popperClass'
					| 'popperOptions'
					| 'showAfter'
					| 'showArrow'
				>
			>, // 工具提示选项类型
			default: () => ({
				enterable: true, // 可进入
				placement: 'top', // 放置在顶部
				showArrow: true, // 显示箭头
				hideAfter: 200, // 200ms 后隐藏
				popperOptions: { strategy: 'fixed' } // popper 配置
			})
		},
		showSummary: propTypes.bool.def(false), // 是否显示汇总行，默认不显示
		sumText: propTypes.string.def('Sum'), // 汇总行文本，默认为 'Sum'
		summaryMethod: {
			type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>, // 汇总方法
			default: undefined // 默认未定义
		},
		spanMethod: {
			type: Function as PropType<
				(param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[] // 跨列方法
			>,
			default: undefined // 默认未定义
		},
		selectOnIndeterminate: propTypes.bool.def(true), // 在不确定状态下是否选择，默认选择
		indent: propTypes.number.def(16), // 缩进值，默认 16
		lazy: propTypes.bool.def(false), // 是否延迟加载，默认不延迟
		load: {
			// type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>, // 加载方法
			type: Function as PropType<
				(row: Recordable, treeNode: any, resolve: (value?: any) => void) => void
			>, // 加载方法
			default: undefined // 默认未定义
		},
		treeProps: {
			type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>, // 树形表格的结构定义
			default: () => ({
				hasChildren: 'hasChildren', // 树节点是否有子节点的字段
				children: 'children', // 子节点字段
				label: 'label' // 标签字段
			})
		},
		tableLayout: {
			type: String as PropType<'auto' | 'fixed'>, // 表格布局方式
			default: 'fixed' // 默认使用固定布局
		},
		scrollbarAlwaysOn: propTypes.bool.def(false), // 滚动条是否始终显示，默认不显示
		flexible: propTypes.bool.def(false), // 表格是否灵活布局，默认不灵活
		// 自定义内容
		customContent: propTypes.bool.def(false), // 是否自定义内容，默认不自定义
		cardBodyStyle: {
			type: Object as PropType<CSSProperties>, // 卡片主体样式
			default: () => ({}) // 默认值为空对象
		},
		cardBodyClass: {
			type: String as PropType<string>, // 卡片主体类名
			default: '' // 默认空
		},
		cardWrapStyle: {
			type: Object as PropType<CSSProperties>, // 卡片包裹样式
			default: () => ({}) // 默认值为空对象
		},
		cardWrapClass: {
			type: String as PropType<string>, // 卡片包裹类名
			default: '' // 默认空
		}
	},
	emits: ['update:pageSize', 'update:currentPage', 'register', 'refresh'], // 组件发出的事件
	setup(props, { attrs, emit, slots, expose }) {
		const elTableRef = ref<ComponentRef<typeof ElTable>>() // 表格组件的引用

		// 注册
		onMounted(() => {
			const tableRef = unref(elTableRef) // 获取表格引用
			emit('register', tableRef?.$parent, elTableRef) // 发出注册事件
		})

		const pageSizeRef = ref(props.pageSize) // 当前页面大小的引用

		const currentPageRef = ref(props.currentPage) // 当前页面的引用

		// useTable 传入的 props
		const outsideProps = ref<TableProps>({}) // 外部传入的 props

		const mergeProps = ref<TableProps>({}) // 合并后的 props

		// 获取合并后的 props
		const getProps = computed(() => {
			const propsObj = { ...props } // 拷贝 props
			Object.assign(propsObj, unref(mergeProps)) // 合并外部 props
			return propsObj // 返回合并后的 props
		})

		// 设置合并 props
		const setProps = (props: TableProps = {}) => {
			mergeProps.value = Object.assign(unref(mergeProps), props) // 合并 props
			outsideProps.value = { ...props } as any // 更新外部传入的 props
		}

		// 设置列属性
		const setColumn = (columnProps: TableSetProps[], columnsChildren?: TableColumn[]) => {
			const { columns } = unref(getProps) // 获取当前的列信息
			for (const v of columnsChildren || columns) {
				// 遍历列
				for (const item of columnProps) {
					// 遍历列属性
					if (v.field === item.field) {
						set(v, item.path, item.value) // 设置列的属性值
					} else if (v.children?.length) {
						setColumn(columnProps, v.children) // 递归读取子列
					}
				}
			}
		}

		// 添加列
		const addColumn = (column: TableColumn, index?: number) => {
			const { columns } = unref(getProps) // 获取当前的列信息
			if (index !== void 0) {
				columns.splice(index, 0, column) // 在指定位置添加列
			} else {
				columns.push(column) // 添加列到末尾
			}
		}

		// 删除列
		const delColumn = (field: string) => {
			const { columns } = unref(getProps) // 获取当前的列信息
			const index = columns.findIndex((item) => item.field === field) // 查找要删除的列索引
			if (index > -1) {
				columns.splice(index, 1) // 删除列
			}
		}

		// 刷新
		const refresh = () => {
			emit('refresh') // 发出刷新事件
		}

		// 改变大小
		const changSize = (size: ComponentSize) => {
			setProps({ size }) // 设置表格大小
		}

		// 确认设置列
		const confirmSetColumn = (columns: TableColumn[]) => {
			setProps({ columns }) // 设置列属性
		}

		expose({
			setProps,
			setColumn,
			delColumn,
			addColumn,
			elTableRef // 暴露表格引用
		})

		// 计算分页属性
		const pagination = computed(() => {
			return Object.assign(
				{
					small: false, // 小型分页设置
					background: false, // 背景设置
					pagerCount: 7, // 分页器数量
					layout: 'sizes, prev, pager, next, jumper, ->, total', // 分页布局
					pageSizes: [10, 20, 30, 40, 50, 100], // 可选页大小
					disabled: false, // 是否禁用分页
					hideOnSinglePage: false, // 单页是否隐藏
					total: 10 // 总条目数
				},
				unref(getProps).pagination // 合并外部分页配置
			)
		})

		// 监听 pageSize 的变化
		watch(
			() => unref(getProps).pageSize,
			(val: number) => {
				pageSizeRef.value = val // 更新 pageSize 引用
			}
		)

		// 监听 currentPage 的变化
		watch(
			() => unref(getProps).currentPage,
			(val: number) => {
				currentPageRef.value = val // 更新 currentPage 引用
			}
		)

		// 监听 pageSizeRef 的变化
		watch(
			() => pageSizeRef.value,
			(val: number) => {
				emit('update:pageSize', val) // 发出 pageSize 更新事件
			}
		)

		// 监听 currentPageRef 的变化
		watch(
			() => currentPageRef.value,
			(val: number) => {
				emit('update:currentPage', val) // 发出 currentPage 更新事件
			}
		)

		// 绑定值
		const getBindValue = computed(() => {
			const bindValue: Recordable = { ...attrs, ...unref(getProps) } // 绑定自身属性和 props
			delete bindValue.columns // 删除列属性
			delete bindValue.data // 删除数据属性
			delete bindValue.align // 删除对齐属性
			return bindValue // 返回绑定值
		})

		// 渲染树形表格的列
		const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
			const { align, headerAlign, showOverflowTooltip, imagePreview, videoPreview } =
				unref(getProps) // 解构获取表格的对齐方式及其他属性
			return columnsChildren.map((v) => {
				// 遍历每一列
				if (v.hidden) return null // 如果列隐藏则返回 null
				const props = { ...v } as any // 复制列属性
				if (props.children) delete props.children // 删除节点属性

				const children = v.children // 获取子列

				const slots = {
					default: (...args: any[]) => {
						// 默认插槽
						const data = args[0] // 拿到数据
						let isPreview = false // 是否预览
						isPreview =
							imagePreview.some((item) => (item as string) === v.field) || // 判断是否为图片预览
							videoPreview.some((item) => (item as string) === v.field) // 判断是否为视频预览

						return children && children.length // 渲染子列
							? renderTreeTableColumn(children) // 如果有子节点则递归
							: props?.slots?.default
								? props.slots.default(...args) // 如果有默认插槽则渲染
								: v?.formatter
									? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index) // 使用自定义格式化函数
									: isPreview
										? renderPreview(get(data.row, v.field), v.field) // 预览渲染
										: get(data.row, v.field) // 获取字段值
					}
				}
				if (props?.slots?.header) {
					// 自定义表头插槽
					slots['header'] = (...args: any[]) => props.slots.header(...args)
				}

				return (
					<ElTableColumn
						showOverflowTooltip={showOverflowTooltip} // 是否显示溢出提示
						align={align} // 对齐方式
						headerAlign={headerAlign} // 表头对齐方式
						{...props} // 列属性
						prop={v.field} // 列字段
					>
						{slots} // 渲染插槽
					</ElTableColumn>
				)
			})
		}

		// 渲染预览
		const renderPreview = (url: string, field: string) => {
			const { imagePreview, videoPreview } = unref(getProps) // 获取预览的字段
			return (
				<div class="flex items-center">
					{' '}
					// 使用 flex 布局
					{imagePreview.includes(field) ? ( // 判断是否为图片预览
						<ElImage
							src={url} // 图片源
							fit="cover" // 填充方式
							class="w-[100%]" // 100% 宽度
							lazy // 启用延迟加载
							preview-src-list={[url]} // 预览源列表
							preview-teleported // 预览迁移
						/>
					) : videoPreview.includes(field) ? ( // 判断是否为视频预览
						<BaseButton
							type="primary" // 按钮类型
							icon={<Icon icon="vi-ep:video-play" />} // 按钮图标
							onClick={() => {
								createVideoViewer({
									// 创建视频查看器
									url // 视频源
								})
							}}
						>
							预览 // 按钮文本
						</BaseButton>
					) : null}{' '}
					// 如果既不是图片也不是视频则返回 null
				</div>
			)
		}

		// 渲染表格列
		const renderTableColumn = (columnsChildren?: TableColumn[]) => {
			const {
				columns,
				reserveIndex,
				pageSize,
				currentPage,
				align,
				headerAlign,
				showOverflowTooltip,
				reserveSelection,
				imagePreview,
				videoPreview
			} = unref(getProps) // 获取表格属性

			return (columnsChildren || columns).map((v) => {
				// 遍历列
				if (v.hidden) return null // 如果列隐藏则返回 null
				if (v.type === 'index') {
					// 如果列类型为索引
					return (
						<ElTableColumn
							type="index" // 索引列
							index={
								v.index ? v.index : (index) => setIndex(reserveIndex, index, pageSize, currentPage) // 索引定义
							}
							align={v.align || align} // 对齐方式
							headerAlign={v.headerAlign || headerAlign} // 表头对齐方式
							label={v.label} // 表头标签
							fixed={v.fixed} // 是否固定列
							width="65px" // 列宽
						></ElTableColumn>
					)
				} else if (v.type === 'selection') {
					// 如果列类型为选择
					return (
						<ElTableColumn
							type="selection" // 选择列
							reserveSelection={reserveSelection} // 是否保留选择
							align={align} // 对齐方式
							headerAlign={headerAlign} // 表头对齐方式
							selectable={v.selectable} // 可选择性
							width="50" // 列宽
						></ElTableColumn>
					)
				} else {
					const props = { ...v } as any // 拷贝列属性
					if (props.children) delete props.children // 删除子节点属性

					const children = v.children // 获取子节点

					const slots = {
						default: (...args: any[]) => {
							// 默认插槽
							const data = args[0] // 拿到数据

							let isPreview = false // 是否预览
							isPreview =
								imagePreview.some((item) => (item as string) === v.field) ||
								videoPreview.some((item) => (item as string) === v.field)

							return children && children.length // 渲染子节点
								? renderTreeTableColumn(children) // 如果有子节点则递归
								: props?.slots?.default
									? props.slots.default(...args) // 如果有默认插槽则渲染
									: v?.formatter
										? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index) // 使用自定义格式化函数
										: isPreview
											? renderPreview(get(data.row, v.field), v.field) // 预览渲染
											: get(data.row, v.field) // 获取字段值
						}
					}
					if (props?.slots?.header) {
						// 自定义表头插槽
						slots['header'] = (...args: any[]) => props.slots.header(...args)
					}
					return (
						<ElTableColumn
							showOverflowTooltip={showOverflowTooltip} // 是否显示溢出提示
							align={align} // 对齐方式
							headerAlign={headerAlign} // 表头对齐方式
							{...props} // 列属性
							prop={v.field} // 列字段
						>
							{slots} // 渲染插槽
						</ElTableColumn>
					)
				}
			})
		}

		// 渲染函数
		return () => {
			const tableSlots = {} // 存储表格插槽
			if (getSlot(slots, 'empty')) {
				// 如果有 empty 插槽
				tableSlots['empty'] = (...args: any[]) => getSlot(slots, 'empty', args) // 渲染 empty 插槽
			}
			if (getSlot(slots, 'append')) {
				// 如果有 append 插槽
				tableSlots['append'] = (...args: any[]) => getSlot(slots, 'append', args) // 渲染 append 插槽
			}

			return (
				<div v-loading={unref(getProps).loading}>
					{' '}
					// 加载效果
					{unref(getProps).customContent ? ( // 自定义内容判断
						<div class="flex flex-wrap">
							{' '}
							// 使用 flex 布局
							{unref(getProps)?.data?.length ? ( // 判断数据是否存在
								unref(getProps)?.data.map((item) => {
									// 遍历数据项
									const cardSlots = {
										default: () => {
											return getSlot(slots, 'content', item) // 渲染内容插槽
										}
									}
									if (getSlot(slots, 'content-header')) {
										// 如果有内容头插槽
										cardSlots['header'] = () => {
											return getSlot(slots, 'content-header', item) // 渲染内容头插槽
										}
									}
									if (getSlot(slots, 'content-footer')) {
										// 如果有内容脚插槽
										cardSlots['footer'] = () => {
											return getSlot(slots, 'content-footer', item) // 渲染内容脚插槽
										}
									}
									return (
										<ElCard
											shadow="hover" // 遮罩效果
											class={unref(getProps).cardWrapClass} // 外包裹类名
											style={unref(getProps).cardWrapStyle} // 外包裹样式
											bodyClass={unref(getProps).cardBodyClass} // 主体类名
											bodyStyle={unref(getProps).cardBodyStyle} // 主体样式
										>
											{cardSlots} // 渲染插槽
										</ElCard>
									)
								})
							) : (
								<div class="flex flex-1 justify-center">
									{' '}
									// 没有数据时的展示
									<ElEmpty description="暂无数据" /> // 空状态
								</div>
							)}
						</div>
					) : (
						<>
							{unref(getProps).showAction && !unref(getProps).customContent ? ( // 判断是否显示工具栏
								<TableActions
									columns={unref(getProps).columns} // 传入列配置
									onChangSize={changSize} // 变更大小事件
									onRefresh={refresh} // 刷新事件
									onConfirm={confirmSetColumn} // 确认列设置事件
								/>
							) : null}
							<ElTable ref={elTableRef} data={unref(getProps).data} {...unref(getBindValue)}>
								{' '}
								// 表格展示
								{{
									default: () => renderTableColumn(), // 渲染表格列
									...tableSlots // 渲染额外插槽
								}}
							</ElTable>
						</>
					)}
					{unref(getProps).pagination ? ( // 判断是否显示分页
						<ElPagination
							v-model:pageSize={pageSizeRef.value} // 页面大小绑定
							v-model:currentPage={currentPageRef.value} // 当前页绑定
							class="mt-10px" // 添加样式
							{...unref(pagination)} // 传入分页配置
						></ElPagination>
					) : undefined}{' '}
					// 如果没有分页则返回 undefined
				</div>
			)
		}
	}
})
</script>
