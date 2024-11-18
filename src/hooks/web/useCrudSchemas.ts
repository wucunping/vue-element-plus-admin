/**
 * @file useCrudSchemas.ts
 * @description CRUD 模式的 schema 处理模块
 * @example
 * const { allSchemas } = useCrudSchemas(crudSchemaArray);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module CRUD
 */

import { reactive } from 'vue' // 导入 Vue 的 reactive 函数
import { eachTree, treeMap, filter } from '@/utils/tree' // 导入树形结构处理工具函数
import { FormSchema } from '@/components/Form' // 导入表单 schema 类型
import { TableColumn } from '@/components/Table' // 导入表格列类型
import { DescriptionsSchema } from '@/components/Descriptions' // 导入描述 schema 类型

/** 定义 CrudSchema 类型，包含表格列的所有属性，去除 children 属性 */
export type CrudSchema = Omit<TableColumn, 'children'> & {
  /** 可选搜索参数 */
  search?: CrudSearchParams
  /** 可选表格参数 */
  table?: CrudTableParams
  /** 可选表单参数 */
  form?: CrudFormParams
  /** 可选详情参数 */
  detail?: CrudDescriptionsParams
  /** 可选子结构 */
  children?: CrudSchema[]
}

/** 定义 CRUD 搜索参数类型，继承自 FormSchema，去除 field 属性 */
interface CrudSearchParams extends Omit<FormSchema, 'field'> {
  /** 是否隐藏在查询项 */
  hidden?: boolean
}

/** 定义 CRUD 表格参数类型，继承自 TableColumn，去除 field 属性 */
interface CrudTableParams extends Omit<TableColumn, 'field'> {
  /** 是否隐藏表头 */
  hidden?: boolean
}

/** 定义 CRUD 表单参数类型，继承自 FormSchema，去除 field 属性 */
interface CrudFormParams extends Omit<FormSchema, 'field'> {
  /** 是否隐藏表单项 */
  hidden?: boolean
}

/** 定义 CRUD 描述参数类型，继承自 DescriptionsSchema，去除 field 属性 */
interface CrudDescriptionsParams extends Omit<DescriptionsSchema, 'field'> {
  /** 是否隐藏表单项 */
  hidden?: boolean
}

/** 定义所有 schema 的接口类型 */
interface AllSchemas {
  /** 搜索 schema 数组 */
  searchSchema: FormSchema[]
  /** 表格列数组 */
  tableColumns: TableColumn[]
  /** 表单 schema 数组 */
  formSchema: FormSchema[]
  /** 详情 schema 数组 */
  detailSchema: DescriptionsSchema[]
}

/**
 * @deprecated 不推荐使用，感觉过于繁琐，不是很灵活，可能会在某个版本中删除
 * 使用 CRUD schema，返回所有 schema 的组合
 * @param crudSchema CRUD schema 数组
 * @returns 包含所有 schema 的对象
 */
export const useCrudSchemas = (
  crudSchema: CrudSchema[]
): {
  allSchemas: AllSchemas // 返回的所有 schema
} => {
  /** 所有结构数据的响应式对象 */
  const allSchemas = reactive<AllSchemas>({
    searchSchema: [], // 初始化搜索 schema
    tableColumns: [], // 初始化表格列
    formSchema: [], // 初始化表单 schema
    detailSchema: [] // 初始化详情 schema
  })

  /** 过滤搜索 schema */
  const searchSchema = filterSearchSchema(crudSchema)
  // @ts-ignore
  allSchemas.searchSchema = searchSchema || [] // 设置搜索 schema

  /** 过滤表格列 */
  const tableColumns = filterTableSchema(crudSchema)
  allSchemas.tableColumns = tableColumns || [] // 设置表格列

  /** 过滤表单 schema */
  const formSchema = filterFormSchema(crudSchema)
  allSchemas.formSchema = formSchema // 设置表单 schema

  /** 过滤详情 schema */
  const detailSchema = filterDescriptionsSchema(crudSchema)
  allSchemas.detailSchema = detailSchema // 设置详情 schema

  return {
    allSchemas // 返回所有 schema
  }
}

/** 过滤 Search 结构 */
const filterSearchSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
  /** 初始化搜索 schema 数组 */
  const searchSchema: FormSchema[] = []
  /** 获取 crudSchema 长度 */
  const length = crudSchema.length

  for (let i = 0; i < length; i++) {
    /** 获取当前 schema 项 */
    const schemaItem = crudSchema[i]
    if (schemaItem.search?.hidden === true) {
      continue // 如果隐藏则跳过
    }
    /** 构造搜索 schema 项 */
    const searchSchemaItem = {
      component: schemaItem?.search?.component || 'Input', // 获取组件类型，默认为 Input
      ...schemaItem.search, // 展开搜索项其他属性
      field: schemaItem.field, // 获取字段
      label: schemaItem.search?.label || schemaItem.label // 获取标签
    }

    searchSchema.push(searchSchemaItem) // 添加到搜索 schema 数组
  }

  return searchSchema // 返回过滤后的搜索 schema
}

/** 过滤 table 结构 */
const filterTableSchema = (crudSchema: CrudSchema[]): TableColumn[] => {
  /** 转换 schema 项为表格列 */
  const tableColumns = treeMap<CrudSchema>(crudSchema, {
    conversion: (schema: CrudSchema) => {
      if (!schema?.table?.hidden) {
        return {
          ...schema, // 展开当前 schema
          ...schema.table // 展开表格项属性
        }
      }
    }
  })

  // 第一次过滤会有 undefined 所以需要二次过滤
  return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
    if (data.children === void 0) {
      delete data.children // 删除 undefined 的 children 属性
    }
    return !!data.field // 返回是否存在字段
  })
}

/** 过滤 form 结构 */
const filterFormSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
  /** 初始化表单 schema 数组 */
  const formSchema: FormSchema[] = []
  /** 获取 crudSchema 长度 */
  const length = crudSchema.length

  for (let i = 0; i < length; i++) {
    const formItem = crudSchema[i] // 获取当前表单项
    // 构造表单 schema 项
    const formSchemaItem = {
      component: formItem?.form?.component || 'Input', // 获取组件类型，默认为 Input
      ...formItem.form, // 展开表单项其他属性
      field: formItem.field, // 获取字段
      label: formItem.form?.label || formItem.label // 获取标签
    }

    formSchema.push(formSchemaItem) // 添加到表单 schema 数组
  }

  return formSchema // 返回过滤后的表单 schema
}

/** 过滤 descriptions 结构 */
const filterDescriptionsSchema = (crudSchema: CrudSchema[]): DescriptionsSchema[] => {
  /** 初始化描述 schema 数组 */
  const descriptionsSchema: FormSchema[] = []

  eachTree(crudSchema, (schemaItem: CrudSchema) => {
    // 判断是否隐藏
    if (!schemaItem?.detail?.hidden) {
      const descriptionsSchemaItem = {
        ...schemaItem.detail, // 展开详情项属性
        field: schemaItem.field, // 获取字段
        label: schemaItem.detail?.label || schemaItem.label // 获取标签
      }

      // 删除不必要的字段
      delete descriptionsSchemaItem.hidden // 删除 hidden 属性

      descriptionsSchema.push(descriptionsSchemaItem) // 添加到描述 schema 数组
    }
  })

  return descriptionsSchema // 返回过滤后的描述 schema
}
