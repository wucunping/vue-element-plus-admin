<script lang="tsx">
/**
 * @file Table.vue
 * @description 表格组件，提供分页、工具栏、自定义内容渲染等功能
 * @example
 * <Table
 *   :columns="columns"
 *   :data="data"
 *   :pagination="pagination"
 *   :loading="loading"
 * />
 * @version 1.0.0
 * @date 2024-11-22
 * @module src/components/Table/src/Table.vue
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 element-plus 导入表格组件、分页组件以及相关类型和功能模块
import {
  ElTable, // 表格组件
  ElTableColumn, // 表格列组件
  ElPagination, // 分页组件
  ComponentSize, // 组件尺寸类型
  ElTooltipProps, // Tooltip 属性类型
  ElImage, // 图片组件
  ElEmpty, // 空状态组件
  ElCard // 卡片组件
} from 'element-plus'

// 从 vue 导入核心函数和类型
import { defineComponent, PropType, ref, computed, unref, watch, onMounted } from 'vue'
// 导入自定义的 propTypes 工具，用于定义组件的属性类型
import { propTypes } from '@/utils/propTypes'
// 导入辅助函数，用于处理表格索引
import { setIndex } from './helper'
// 导入表格相关的类型定义
import type { TableProps, TableColumn, Pagination, TableSetProps } from './types'
// 从 lodash-es 导入 set 和 get 函数，用于操作对象的属性
import { set, get } from 'lodash-es'
// 导入 Vue 的 CSSProperties 类型，用于定义 CSS 样式
import { CSSProperties } from 'vue'
// 导入获取插槽的工具函数
import { getSlot } from '@/utils/tsxHelper'
// 导入表格操作组件
import TableActions from './components/TableActions.vue'
// 导入视频播放器组件的创建函数
import { createVideoViewer } from '@/components/VideoPlayer'
// 导入图标组件
import { Icon } from '@/components/Icon'
// 导入基础按钮组件
import { BaseButton } from '@/components/Button'

// 导出默认组件定义
export default defineComponent({
  // 设置组件名称为 Table
  name: 'Table',
  // 定义组件的属性
  props: {
    // 每页显示的条数，默认为 10
    pageSize: propTypes.number.def(10),
    // 当前页码，默认为 1
    currentPage: propTypes.number.def(1),
    // 是否展示表格的工具栏，默认为 false
    showAction: propTypes.bool.def(false),
    // 是否隐藏超出部分内容，默认为 true；优先级低于 schema 中的 showOverflowTooltip
    showOverflowTooltip: propTypes.bool.def(true),
    // 表格的列配置，默认为空数组
    columns: {
      type: Array as PropType<TableColumn[]>, // 指定属性类型为数组
      default: () => [] // 默认值为空数组
    },
    // 是否展示分页功能，默认为 undefined
    pagination: {
      type: Object as PropType<Pagination>, // 指定属性类型为对象
      default: (): Pagination | undefined => undefined // 默认值为 undefined
    },
    // 是否在数据更新后保留选中项，仅对 type=selection 的列有效，默认为 false
    reserveSelection: propTypes.bool.def(false),
    // 表格是否处于加载状态，默认为 false
    loading: propTypes.bool.def(false),
    // 是否启用叠加索引，默认为 false
    reserveIndex: propTypes.bool.def(false),
    // 表格内容的对齐方式，默认为 'left'
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v)) // 校验是否为有效的对齐方式
      .def('left'),
    // 表头内容的对齐方式，默认为 'left'
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v)) // 校验是否为有效的对齐方式
      .def('left'),
    // 表格的数据源，默认为空数组
    data: {
      type: Array as PropType<Recordable[]>, // 指定属性类型为数组
      default: () => [] // 默认值为空数组
    },
    // 图片自动预览的字段数组，默认为空数组
    imagePreview: {
      type: Array as PropType<string[]>, // 指定属性类型为字符串数组
      default: () => [] // 默认值为空数组
    },
    // 视频自动预览的字段数组，默认为空数组
    videoPreview: {
      type: Array as PropType<string[]>, // 指定属性类型为字符串数组
      default: () => [] // 默认值为空数组
    },
    // 表格的固定高度，可以是数字或字符串
    height: propTypes.oneOfType([Number, String]),
    // 表格的最大高度，可以是数字或字符串
    maxHeight: propTypes.oneOfType([Number, String]),
    // 是否显示斑马条纹，默认为 false
    stripe: propTypes.bool.def(false),
    // 是否显示边框，默认为 true
    border: propTypes.bool.def(true),
    // 表格的尺寸，可选值为 'default', 'small', 'large'
    size: {
      type: String as PropType<ComponentSize>, // 指定属性类型为字符串
      validator: (v: ComponentSize) => ['default', 'small', 'large'].includes(v) // 校验是否为有效的尺寸
    },
    // 是否自适应宽度，默认为 true
    fit: propTypes.bool.def(true),
    // 是否显示表头，默认为 true
    showHeader: propTypes.bool.def(true),
    // 是否高亮当前行，默认为 false
    highlightCurrentRow: propTypes.bool.def(false),
    // 当前行的键值，类型为数字或字符串
    currentRowKey: propTypes.oneOfType([Number, String]),
    // 行类名的自定义回调函数，类型为 (row, rowIndex) => string | string
    rowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: '' // 默认值为空字符串
    },
    // 行样式的自定义回调函数，类型为 (row, rowIndex) => Recordable | CSSProperties
    rowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: undefined // 默认值为 undefined
    },
    // 单元格类名的自定义回调函数，类型为 (row, column, rowIndex) => string | string
    cellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: '' // 默认值为空字符串
    },
    // 单元格样式的自定义回调函数，类型为 (row, column, rowIndex) => Recordable | CSSProperties
    cellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: undefined // 默认值为 undefined
    },
    // 表头行类名的自定义回调函数，类型为 (row, rowIndex) => string | string
    headerRowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: '' // 默认值为空字符串
    },
    // 表头行样式的自定义回调函数，类型为 (row, rowIndex) => Recordable | CSSProperties
    headerRowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: undefined // 默认值为 undefined
    },
    // 表头单元格类名的自定义回调函数，类型为 (row, column, rowIndex) => string | string
    headerCellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: '' // 默认值为空字符串
    },
    // 表头单元格样式的自定义回调函数，类型为 (row, column, rowIndex) => Recordable | CSSProperties
    headerCellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: undefined // 默认值为 undefined
    },
    // 表格行的唯一标识键，默认为 'id'
    rowKey: propTypes.string.def('id'),
    // 当表格为空时显示的提示文本，默认为 'No Data'
    emptyText: propTypes.string.def('No Data'),
    // 是否默认展开所有行，默认为 false
    defaultExpandAll: propTypes.bool.def(false),
    // 默认展开的行键数组，默认为 undefined
    expandRowKeys: {
      type: Array as PropType<string[]>, // 指定属性类型为字符串数组
      default: undefined // 默认值为 undefined
    },
    // 默认排序配置，包含字段和排序顺序
    defaultSort: {
      type: Object as PropType<{ prop: string; order: string }>, // 指定属性类型为对象
      default: () => ({}) // 默认值为空对象
    },
    // Tooltip 的显示效果，可选值为 'dark' 或 'light'，默认为 'dark'
    tooltipEffect: {
      type: String as PropType<'dark' | 'light'>,
      default: 'dark' // 默认值为 'dark'
    },
    // Tooltip 的配置选项，包含效果、偏移量等
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
      >,
      default: () => ({
        enterable: true, // 鼠标是否可以进入 Tooltip
        placement: 'top', // Tooltip 的显示位置
        showArrow: true, // 是否显示箭头
        hideAfter: 200, // 多久后隐藏 Tooltip
        popperOptions: { strategy: 'fixed' } // Popper.js 的配置
      })
    },
    // 是否显示汇总行，默认为 false
    showSummary: propTypes.bool.def(false),
    // 汇总行的显示文本，默认为 'Sum'
    sumText: propTypes.string.def('Sum'),
    // 自定义汇总计算方法，参数为列和数据，返回汇总结果数组
    summaryMethod: {
      type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>,
      default: undefined // 默认值为 undefined
    },
    // 合并单元格的自定义方法，返回数组用于设置单元格合并
    spanMethod: {
      type: Function as PropType<
        (param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[]
      >,
      default: undefined // 默认值为 undefined
    },
    // 勾选状态为不确定时是否自动选择，默认为 true
    selectOnIndeterminate: propTypes.bool.def(true),
    // 树形数据的缩进距离，默认为 16
    indent: propTypes.number.def(16),
    // 是否懒加载子节点数据，默认为 false
    lazy: propTypes.bool.def(false),
    // 自定义加载子节点数据的方法
    load: {
      type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>,
      default: undefined // 默认值为 undefined
    },
    // 树形表格的字段属性配置
    treeProps: {
      type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>,
      default: () => ({ hasChildren: 'hasChildren', children: 'children', label: 'label' }) // 默认值为对象
    },
    // 表格布局方式，可选值为 'auto' 或 'fixed'，默认为 'fixed'
    tableLayout: {
      type: String as PropType<'auto' | 'fixed'>,
      default: 'fixed' // 默认值为 'fixed'
    },
    // 是否始终显示滚动条，默认为 false
    scrollbarAlwaysOn: propTypes.bool.def(false),
    // 是否开启灵活模式，默认为 false
    flexible: propTypes.bool.def(false),
    // 是否自定义内容，默认为 false
    customContent: propTypes.bool.def(false),
    // 卡片主体样式配置，默认为空对象
    cardBodyStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}) // 默认值为空对象
    },
    // 卡片主体的类名，默认为空字符串
    cardBodyClass: {
      type: String as PropType<string>,
      default: '' // 默认值为空字符串
    },
    // 卡片外层样式配置，默认为空对象
    cardWrapStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}) // 默认值为空对象
    },
    // 卡片外层的类名，默认为空字符串
    cardWrapClass: {
      type: String as PropType<string>,
      default: '' // 默认值为空字符串
    }
  },
  // 定义组件的事件
  emits: ['update:pageSize', 'update:currentPage', 'register', 'refresh'],

  // 定义 setup 函数，用于初始化组件逻辑
  setup(props, { attrs, emit, slots, expose }) {
    // 定义一个 ref，保存表格的引用
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    /**
     * @function 注册表格的引用到父组件
     * @description 在组件挂载时，触发 register 事件，将表格的引用传递给父组件
     */
    onMounted(() => {
      const tableRef = unref(elTableRef) // 解包表格引用
      emit('register', tableRef?.$parent, elTableRef) // 触发 register 事件
    })

    // 定义分页大小的响应式变量
    const pageSizeRef = ref(props.pageSize)

    // 定义当前页码的响应式变量
    const currentPageRef = ref(props.currentPage)

    // 定义外部传入的属性对象
    const outsideProps = ref<TableProps>({})

    // 定义合并后的属性对象
    const mergeProps = ref<TableProps>({})

    /**
     * @function 获取组件的完整属性
     * @description 合并 props 和 mergeProps，并返回最终的属性对象
     * @returns {TableProps} 完整的属性对象
     */
    const getProps = computed(() => {
      const propsObj = { ...props } // 克隆 props 对象
      Object.assign(propsObj, unref(mergeProps)) // 合并 mergeProps
      return propsObj // 返回合并后的对象
    })

    /**
     * @function 设置组件的属性
     * @description 合并新的属性到 mergeProps 和 outsideProps
     * @param {TableProps} props 要设置的新属性
     */
    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props) // 更新 mergeProps
      outsideProps.value = { ...props } as any // 更新 outsideProps
    }

    /**
     * @function 设置表格列的属性
     * @description 根据列的字段更新属性，支持递归处理子列
     * @param {TableSetProps[]} columnProps 要设置的列属性数组
     * @param {TableColumn[]} [columnsChildren] 可选的子列数组
     */
    const setColumn = (columnProps: TableSetProps[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps) // 获取当前的列配置
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value) // 更新匹配字段的属性
          } else if (v.children?.length) {
            setColumn(columnProps, v.children) // 递归处理子列
          }
        }
      }
    }

    /**
     * @function 添加列到表格
     * @description 在指定位置插入一列，如果未指定位置则追加到末尾
     * @param {TableColumn} column 要添加的列
     * @param {number} [index] 插入列的位置
     */
    const addColumn = (column: TableColumn, index?: number) => {
      const { columns } = unref(getProps) // 获取当前的列配置
      if (index !== void 0) {
        columns.splice(index, 0, column) // 在指定位置插入
      } else {
        columns.push(column) // 追加到末尾
      }
    }

    /**
     * @function 删除指定字段的列
     * @description 根据字段名找到对应的列并删除
     * @param {string} field 要删除的列的字段名
     */
    const delColumn = (field: string) => {
      const { columns } = unref(getProps) // 获取当前的列配置
      const index = columns.findIndex((item) => item.field === field) // 查找字段对应的列索引
      if (index > -1) {
        columns.splice(index, 1) // 删除对应的列
      }
    }

    /**
     * @function 刷新表格
     * @description 触发 refresh 事件
     */
    const refresh = () => {
      emit('refresh') // 触发 refresh 事件
    }

    /**
     * @function 更改表格大小
     * @description 更新表格的尺寸属性
     * @param {ComponentSize} size 表格的新尺寸
     */
    const changSize = (size: ComponentSize) => {
      setProps({ size }) // 设置新的尺寸属性
    }

    /**
     * @function 确认设置列配置
     * @description 更新表格的列配置
     * @param {TableColumn[]} columns 新的列配置数组
     */
    const confirmSetColumn = (columns: TableColumn[]) => {
      setProps({ columns }) // 设置新的列配置
    }

    /**
     * @function 暴露方法和变量
     * @description 将方法和引用暴露给外部使用
     */
    expose({
      setProps, // 设置表格属性的方法
      setColumn, // 设置列属性的方法
      delColumn, // 删除列的方法
      addColumn, // 添加列的方法
      elTableRef // 表格的引用
    })

    /**
     * @function 计算分页配置
     * @description 根据默认配置和用户配置合并生成最终的分页配置
     * @returns {Object} 合并后的分页配置对象
     */
    const pagination = computed(() => {
      return Object.assign(
        {
          small: false, // 是否为小型分页
          background: false, // 是否有背景
          pagerCount: 7, // 页码按钮的数量
          layout: 'sizes, prev, pager, next, jumper, ->, total', // 分页布局
          pageSizes: [10, 20, 30, 40, 50, 100], // 可选的分页大小
          disabled: false, // 是否禁用分页
          hideOnSinglePage: false, // 是否在单页时隐藏分页
          total: 10 // 总条目数
        },
        unref(getProps).pagination // 用户配置的分页属性
      )
    })

    /**
     * @function 监听分页大小变化
     * @description 更新 pageSizeRef 的值
     * @param {number} val 新的分页大小
     */
    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val // 更新分页大小
      }
    )

    /**
     * @function 监听当前页码变化
     * @description 更新 currentPageRef 的值
     * @param {number} val 新的页码
     */
    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val // 更新当前页码
      }
    )

    /**
     * @function 监听分页大小引用变化
     * @description 同步更新分页大小到父组件
     * @param {number} val 新的分页大小
     */
    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val) // 触发更新分页大小的事件
      }
    )

    /**
     * @function 监听当前页码引用变化
     * @description 同步更新当前页码到父组件
     * @param {number} val 新的页码
     */
    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val) // 触发更新当前页码的事件
      }
    )

    /**
     * @function 获取绑定值
     * @description 将属性和绑定值组合生成新的对象，过滤掉无效属性
     * @returns {Recordable} 绑定的值对象
     */
    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...unref(getProps) } // 合并 attrs 和 props
      delete bindValue.columns // 移除列配置
      delete bindValue.data // 移除数据配置
      delete bindValue.align // 移除对齐配置
      return bindValue // 返回过滤后的绑定值
    })

    /**
     * @function 渲染树形表格的列
     * @description 遍历树形结构的列配置，生成对应的表格列组件
     * @param {TableColumn[]} columnsChildren 树形列配置
     * @returns {JSX.Element[]} 渲染的表格列组件数组
     */
    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip, imagePreview, videoPreview } =
        unref(getProps) // 获取属性配置
      return columnsChildren.map((v) => {
        if (v.hidden) return null // 如果列被隐藏，返回 null
        const props = { ...v } as any // 克隆列配置
        if (props.children) delete props.children // 删除子列配置以避免重复渲染

        const children = v.children // 获取子列配置

        const slots = {
          default: (...args: any[]) => {
            const data = args[0] // 获取当前单元格的数据
            let isPreview = false
            isPreview =
              imagePreview.some((item) => (item as string) === v.field) || // 判断是否为图片预览字段
              videoPreview.some((item) => (item as string) === v.field) // 判断是否为视频预览字段

            return children && children.length
              ? renderTreeTableColumn(children) // 如果存在子列，递归渲染子列
              : props?.slots?.default
                ? props.slots.default(...args) // 如果有默认插槽，渲染插槽内容
                : v?.formatter
                  ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index) // 如果存在格式化函数，调用格式化逻辑
                  : isPreview
                    ? renderPreview(get(data.row, v.field), v.field) // 如果需要预览，渲染预览内容
                    : get(data.row, v.field) // 否则直接返回字段值
          }
        }
        if (props?.slots?.header) {
          slots['header'] = (...args: any[]) => props.slots.header(...args) // 渲染表头插槽
        }

        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip} // 是否显示超出内容的 Tooltip
            align={align} // 内容对齐方式
            headerAlign={headerAlign} // 表头对齐方式
            {...props} // 传入列的其他属性
            prop={v.field} // 设置列的字段名
          >
            {slots} {/* 渲染插槽 */}
          </ElTableColumn>
        )
      })
    }

    /**
     * @function 渲染预览内容
     * @description 根据字段类型生成图片或视频的预览组件
     * @param {string} url 图片或视频的 URL
     * @param {string} field 字段名
     * @returns {JSX.Element} 渲染的预览组件
     */
    const renderPreview = (url: string, field: string) => {
      const { imagePreview, videoPreview } = unref(getProps) // 获取图片和视频预览字段
      return (
        <div class="flex items-center">
          {imagePreview.includes(field) ? ( // 如果是图片预览字段
            <ElImage
              src={url} // 图片的地址
              fit="cover" // 图片填充方式
              class="w-[100%]" // 图片样式
              lazy // 开启懒加载
              preview-src-list={[url]} // 图片预览列表
              preview-teleported // 启用预览功能
            />
          ) : videoPreview.includes(field) ? ( // 如果是视频预览字段
            <BaseButton
              type="primary" // 按钮类型
              icon={<Icon icon="vi-ep:video-play" />} // 视频播放图标
              onClick={() => {
                createVideoViewer({
                  url // 创建视频预览
                })
              }}
            >
              预览
            </BaseButton>
          ) : null}
        </div>
      )
    }

    /**
     * @function 渲染表格列
     * @description 遍历列配置，生成对应的表格列组件
     * @param {TableColumn[]} [columnsChildren] 可选的子列配置
     * @returns {JSX.Element[]} 渲染的表格列组件数组
     */
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
      } = unref(getProps) // 获取所有列的属性配置

      return (columnsChildren || columns).map((v) => {
        if (v.hidden) return null // 如果列被隐藏，返回 null
        if (v.type === 'index') {
          // 如果是索引列
          return (
            <ElTableColumn
              type="index" // 列类型为索引
              index={
                v.index ? v.index : (index) => setIndex(reserveIndex, index, pageSize, currentPage) // 计算索引
              }
              align={v.align || align} // 内容对齐方式
              headerAlign={v.headerAlign || headerAlign} // 表头对齐方式
              label={v.label} // 列的标签
              fixed={v.fixed} // 是否固定列
              width="65px" // 列的宽度
            ></ElTableColumn>
          )
        } else if (v.type === 'selection') {
          // 如果是多选列
          return (
            <ElTableColumn
              type="selection" // 列类型为多选
              reserveSelection={reserveSelection} // 是否保留选中状态
              align={align} // 内容对齐方式
              headerAlign={headerAlign} // 表头对齐方式
              selectable={v.selectable} // 是否可选
              width="50" // 列的宽度
            ></ElTableColumn>
          )
        } else {
          // 如果是普通列
          const props = { ...v } as any // 克隆列配置
          if (props.children) delete props.children // 删除子列配置

          const children = v.children // 获取子列配置

          const slots = {
            default: (...args: any[]) => {
              const data = args[0] // 获取单元格数据

              let isPreview = false
              isPreview =
                imagePreview.some((item) => (item as string) === v.field) || // 判断是否为图片预览字段
                videoPreview.some((item) => (item as string) === v.field) // 判断是否为视频预览字段

              return children && children.length
                ? renderTreeTableColumn(children) // 如果有子列，递归渲染子列
                : props?.slots?.default
                  ? props.slots.default(...args) // 渲染默认插槽
                  : v?.formatter
                    ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index) // 渲染格式化内容
                    : isPreview
                      ? renderPreview(get(data.row, v.field), v.field) // 渲染预览内容
                      : get(data.row, v.field) // 返回字段值
            }
          }
          if (props?.slots?.header) {
            slots['header'] = (...args: any[]) => props.slots.header(...args) // 渲染表头插槽
          }
          return (
            <ElTableColumn
              showOverflowTooltip={showOverflowTooltip} // 是否显示超出内容的 Tooltip
              align={align} // 内容对齐方式
              headerAlign={headerAlign} // 表头对齐方式
              {...props} // 传入列的其他属性
              prop={v.field} // 设置列的字段名
            >
              {slots} {/* 渲染插槽 */}
            </ElTableColumn>
          )
        }
      })
    }

    /**
     * @function 渲染表格组件
     * @description 根据属性和插槽动态渲染表格、分页和卡片内容
     * @returns {JSX.Element} 表格组件的渲染结果
     */
    return () => {
      // 定义表格插槽
      const tableSlots = {}

      // 如果存在空数据插槽，则赋值给 tableSlots['empty']
      if (getSlot(slots, 'empty')) {
        tableSlots['empty'] = (...args: any[]) => getSlot(slots, 'empty', args)
      }

      // 如果存在追加内容插槽，则赋值给 tableSlots['append']
      if (getSlot(slots, 'append')) {
        tableSlots['append'] = (...args: any[]) => getSlot(slots, 'append', args)
      }

      // 返回表格的完整渲染内容
      return (
        <div v-loading={unref(getProps).loading}>
          {/* 如果启用了自定义内容 */}
          {unref(getProps).customContent ? (
            <div class="flex flex-wrap">
              {/* 如果有数据则渲染卡片 */}
              {unref(getProps)?.data?.length ? (
                unref(getProps)?.data.map((item) => {
                  // 定义卡片的插槽
                  const cardSlots = {
                    default: () => {
                      return getSlot(slots, 'content', item) // 渲染内容插槽
                    }
                  }
                  if (getSlot(slots, 'content-header')) {
                    cardSlots['header'] = () => {
                      return getSlot(slots, 'content-header', item) // 渲染内容头部插槽
                    }
                  }
                  if (getSlot(slots, 'content-footer')) {
                    cardSlots['footer'] = () => {
                      return getSlot(slots, 'content-footer', item) // 渲染内容底部插槽
                    }
                  }
                  // 渲染卡片组件
                  return (
                    <ElCard
                      shadow="hover" // 卡片的阴影效果
                      class={unref(getProps).cardWrapClass} // 卡片的自定义类名
                      style={unref(getProps).cardWrapStyle} // 卡片的自定义样式
                      bodyClass={unref(getProps).cardBodyClass} // 卡片主体的自定义类名
                      bodyStyle={unref(getProps).cardBodyStyle} // 卡片主体的自定义样式
                    >
                      {cardSlots} {/* 渲染卡片插槽 */}
                    </ElCard>
                  )
                })
              ) : (
                // 如果没有数据则显示空状态
                <div class="flex flex-1 justify-center">
                  <ElEmpty description="暂无数据" />
                </div>
              )}
            </div>
          ) : (
            <>
              {/* 如果启用了工具栏并未启用自定义内容 */}
              {unref(getProps).showAction && !unref(getProps).customContent ? (
                <TableActions
                  columns={unref(getProps).columns} // 传递表格列配置
                  onChangSize={changSize} // 绑定更改大小事件
                  onRefresh={refresh} // 绑定刷新事件
                  onConfirm={confirmSetColumn} // 绑定确认列配置事件
                />
              ) : null}
              {/* 渲染表格组件 */}
              <ElTable ref={elTableRef} data={unref(getProps).data} {...unref(getBindValue)}>
                {{
                  default: () => renderTableColumn(), // 默认插槽渲染表格列
                  ...tableSlots // 追加插槽内容
                }}
              </ElTable>
            </>
          )}
          {/* 如果启用了分页，则渲染分页组件 */}
          {unref(getProps).pagination ? (
            <ElPagination
              v-model:pageSize={pageSizeRef.value} // 双向绑定分页大小
              v-model:currentPage={currentPageRef.value} // 双向绑定当前页码
              class="mt-10px" // 分页组件的自定义样式
              {...unref(pagination)} // 传递分页属性
            ></ElPagination>
          ) : undefined}
        </div>
      )
    }
  }
})
</script>
