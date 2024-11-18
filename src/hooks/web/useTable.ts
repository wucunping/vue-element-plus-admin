/**
 * @file useTable.ts
 * @description 此文件用于定义表格的逻辑和功能，包括数据请求、状态管理等。
 * @example
 * const { tableRegister, tableMethods, tableState } = useTable({
 *   immediate: true,
 *   fetchDataApi: async () => {
 *     // 获取数据的 API 调用
 *     return { list: [], total: 0 }
 *   },
 *   fetchDelApi: async () => {
 *     // 删除数据的 API 调用
 *     return true
 *   }
 * });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module useTable
 */

import { useI18n } from '@/hooks/web/useI18n' // 引入国际化处理的钩子
import { Table, TableExpose, TableProps, TableSetProps, TableColumn } from '@/components/Table' // 引入表格组件和相关类型
import { ElTable, ElMessageBox, ElMessage } from 'element-plus' // 引入 Element Plus 的表格和消息组件
import { ref, watch, unref, nextTick, onMounted } from 'vue' // 引入 Vue 的组合 API 函数

const { t } = useI18n() // 使用国际化钩子获取翻译函数

/**
 * 定义配置接口
 * @interface UseTableConfig
 */
interface UseTableConfig {
  /**
   * 是否初始化的时候请求一次
   */
  immediate?: boolean // 是否立即请求数据
  /** 获取数据的 API */
  fetchDataApi: () => Promise<{
    /** 数据列表 */
    list: any[]
    /** 总数量 */
    total?: number
  }>
  /** 删除数据的 API */
  fetchDelApi?: () => Promise<boolean>
}

/**
 * 使用表格的组合式函数
 * @param config 配置对象
 * @returns 返回表格的注册方法、方法和状态
 */
export const useTable = (config: UseTableConfig) => {
  const { immediate = true } = config // 解构配置，默认立即请求数据为 true

  const loading = ref(false) // 加载状态
  const currentPage = ref(1) // 当前页码
  const pageSize = ref(10) // 每页显示的条目数
  const total = ref(0) // 数据总量
  const dataList = ref<any[]>([]) // 存放数据列表

  // 监听当前页码变化
  watch(
    () => currentPage.value,
    () => {
      methods.getList() // 获取数据
    }
  )

  // 监听每页条目数变化
  watch(
    () => pageSize.value,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用getList方法
      if (unref(currentPage) === 1) {
        methods.getList()
      } else {
        currentPage.value = 1 // 页码重置为 1
        methods.getList()
      }
    }
  )

  // 在组件挂载后调用请求数据
  onMounted(() => {
    if (immediate) {
      methods.getList()
    }
  })

  // Table实例
  const tableRef = ref<typeof Table & TableExpose>()

  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>()

  /**
   * 注册表格实例
   * @param ref 表格组件的引用
   * @param elRef ElTable 组件的引用
   */
  const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref // 保存表格引用
    elTableRef.value = unref(elRef) // 保存 ElTable 引用
  }

  /**
   * 获取表格实例
   * @returns 表格实例
   */
  const getTable = async () => {
    await nextTick() // 等待下一个渲染周期
    const table = unref(tableRef) // 获取表格实例
    if (!table) {
      console.error('The table is not registered. Please use the register method to register') // 错误提示
    }
    return table
  }

  // 定义方法集合
  const methods = {
    /**
     * 获取表单数据
     */
    getList: async () => {
      loading.value = true // 设置加载状态为 true
      try {
        const res = await config?.fetchDataApi() // 请求数据
        console.log('fetchDataApi res', res) // 打印结果
        if (res) {
          dataList.value = res.list // 保存数据列表
          total.value = res.total || 0 // 保存总条数
        }
      } catch (err) {
        console.log('fetchDataApi error') // 错误提示
      } finally {
        loading.value = false // 设置加载状态为 false
      }
    },

    /**
     * @description 设置table组件的props
     * @param props table组件的props
     */
    setProps: async (props: TableProps = {}) => {
      const table = await getTable() // 获取表格实例
      table?.setProps(props) // 设置表格的 props
    },

    /**
     * @description 设置设置列
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: TableSetProps[]) => {
      const table = await getTable() // 获取表格实例
      table?.setColumn(columnProps) // 设置表格的列
    },

    /**
     * @description 新增列
     * @param tableColumn 需要新增数据
     * @param index 在哪里新增
     */
    addColumn: async (tableColumn: TableColumn, index?: number) => {
      const table = await getTable() // 获取表格实例
      table?.addColumn(tableColumn, index) // 新增列
    },

    /**
     * @description 删除列
     * @param field 删除哪个数据
     */
    delColumn: async (field: string) => {
      const table = await getTable() // 获取表格实例
      table?.delColumn(field) // 删除列
    },

    /**
     * @description 获取ElTable组件的实例
     * @returns ElTable 实例
     */
    getElTableExpose: async () => {
      await getTable() // 获取表格实例
      return unref(elTableRef) // 返回 ElTable 引用
    },

    /**
     * 刷新表格数据
     */
    refresh: () => {
      methods.getList() // 重新获取数据
    },

    /**
     * 删除数据
     * @param idsLength 要删除的 ID 数量
     */
    delList: async (idsLength: number) => {
      const { fetchDelApi } = config // 获取删除 API
      if (!fetchDelApi) {
        console.warn('fetchDelApi is undefined') // 警告提示
        return
      }
      // 确认删除对话框
      ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
        confirmButtonText: t('common.delOk'), // 确认按钮文本
        cancelButtonText: t('common.delCancel'), // 取消按钮文本
        type: 'warning' // 警告类型
      }).then(async () => {
        const res = await fetchDelApi() // 调用删除 API
        if (res) {
          ElMessage.success(t('common.delSuccess')) // 删除成功提示

          // 计算出临界点
          const current =
            unref(total) % unref(pageSize) === idsLength || unref(pageSize) === 1
              ? unref(currentPage) > 1
                ? unref(currentPage) - 1
                : unref(currentPage)
              : unref(currentPage)

          currentPage.value = current // 更新当前页码
          methods.getList() // 重新获取数据
        }
      })
    }
  }

  return {
    /** 返回表格注册方法 */
    tableRegister: register,
    /** 返回表格方法集合 */
    tableMethods: methods,
    /** 返回表格状态 */
    tableState: {
      currentPage,
      pageSize,
      total,
      dataList,
      loading
    }
  }
}
