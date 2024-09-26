/**
 * @file useCrudSchemas.ts
 * @description 该文件包含一个名为`useCrudSchemas`的Vue自定义钩子函数，用于处理CRUD（增删改查）界面的schema生成逻辑。
 *              这个钩子函数接受一个CrudSchema数组作为参数，并返回一个包含搜索、表格、表单和详情描述的schema的对象。
 *              注意：此钩子函数已被标记为不推荐使用，感觉过于繁琐，不是很灵活，可能会在某个版本中删除。
 *
 * @example 使用示例：
 * 创建一个包含搜索、表格、表单和详情描述的schema的对象：
 * `useCrudSchemas(crudSchemaArray)`
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入 Vue 的 reactive 方法用于创建响应式对象
import { reactive } from 'vue'

// 引入 utils/tree 模块中的 eachTree、treeMap 和 filter 方法
import { eachTree, treeMap, filter } from '@/utils/tree'

// 引入 components/Form 模块中的 FormSchema 类型
import { FormSchema } from '@/components/Form'

// 引入 components/Table 模块中的 TableColumn 类型
import { TableColumn } from '@/components/Table'

// 引入 components/Descriptions 模块中的 DescriptionsSchema 类型
import { DescriptionsSchema } from '@/components/Descriptions'

/**
 * 定义 CrudSchema 类型，它是 TableColumn 的一个子集，并增加了 search、table、form 和 detail 属性
 */
export type CrudSchema = Omit<TableColumn, 'children'> & {
	search?: CrudSearchParams
	table?: CrudTableParams
	form?: CrudFormParams
	detail?: CrudDescriptionsParams
	children?: CrudSchema[]
}

/**
 * 定义 CrudSearchParams 类型，继承自 FormSchema 并去除了 field 属性
 */
interface CrudSearchParams extends Omit<FormSchema, 'field'> {
	// 是否隐藏在查询项
	hidden?: boolean
}

/**
 * 定义 CrudTableParams 类型，继承自 TableColumn 并去除了 field 属性
 */
interface CrudTableParams extends Omit<TableColumn, 'field'> {
	// 是否隐藏表头
	hidden?: boolean
}

/**
 * 定义 CrudFormParams 类型，继承自 FormSchema 并去除了 field 属性
 */
interface CrudFormParams extends Omit<FormSchema, 'field'> {
	// 是否隐藏表单项
	hidden?: boolean
}

/**
 * 定义 CrudDescriptionsParams 类型，继承自 DescriptionsSchema 并去除了 field 属性
 */
interface CrudDescriptionsParams extends Omit<DescriptionsSchema, 'field'> {
	// 是否隐藏表单项
	hidden?: boolean
}

/**
 * 定义 AllSchemas 类型，包含 searchSchema、tableColumns、formSchema 和 detailSchema 属性
 */
interface AllSchemas {
	searchSchema: FormSchema[]
	tableColumns: TableColumn[]
	formSchema: FormSchema[]
	detailSchema: DescriptionsSchema[]
}

/**
 * @function useCrudSchemas
 * @description 用于处理CRUD（增删改查）界面的schema生成逻辑。
 * @param {CrudSchema[]} crudSchema - 参数是一个CrudSchema数组，包含搜索、表格、表单和详情描述的schema。
 * @return {AllSchemas} 包含搜索、表格、表单和详情描述的schema的对象。
 * @deprecated 不推荐使用，感觉过于繁琐，不是很灵活，可能会在某个版本中删除。
 */
export const useCrudSchemas = (
	crudSchema: CrudSchema[]
): {
	allSchemas: AllSchemas
} => {
	// 创建一个响应式对象，包含 searchSchema、tableColumns、formSchema 和 detailSchema 属性
	const allSchemas = reactive<AllSchemas>({
		searchSchema: [],
		tableColumns: [],
		formSchema: [],
		detailSchema: []
	})

	// 过滤 CrudSchema 中的搜索结构，并赋值给 allSchemas.searchSchema
	const searchSchema = filterSearchSchema(crudSchema)
	// @ts-ignore
	allSchemas.searchSchema = searchSchema || []

	// 过滤 CrudSchema 中的表格结构，并赋值给 allSchemas.tableColumns
	const tableColumns = filterTableSchema(crudSchema)
	allSchemas.tableColumns = tableColumns || []

	// 过滤 CrudSchema 中的表单结构，并赋值给 allSchemas.formSchema
	const formSchema = filterFormSchema(crudSchema)
	allSchemas.formSchema = formSchema

	// 过滤 CrudSchema 中的描述结构，并赋值给 allSchemas.detailSchema
	const detailSchema = filterDescriptionsSchema(crudSchema)
	allSchemas.detailSchema = detailSchema

	// 返回包含所有结构的对象
	return {
		allSchemas
	}
}

/**
 * 根据 crudSchema 过滤出 searchSchema 数组
 *
 * @param crudSchema crud 模式的数组
 * @returns 返回过滤后的 searchSchema 数组
 */
const filterSearchSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
	const searchSchema: FormSchema[] = []
	const length = crudSchema.length

	for (let i = 0; i < length; i++) {
		const schemaItem = crudSchema[i]
		// 如果 schemaItem 的 search 属性存在且 hidden 属性为 true，则跳过此次循环
		if (schemaItem.search?.hidden === true) {
			continue
		}
		// 创建一个新的对象 searchSchemaItem，并判断是否隐藏
		const searchSchemaItem = {
			component: schemaItem?.search?.component || 'Input',
			...schemaItem.search,
			field: schemaItem.field,
			label: schemaItem.search?.label || schemaItem.label
		}

		// 将 searchSchemaItem 添加到 searchSchema 数组中
		searchSchema.push(searchSchemaItem)
	}

	// 返回过滤后的 searchSchema 数组
	return searchSchema
}

/**
 * 根据 CRUD 架构过滤表格列
 *
 * @param crudSchema CRUD 架构数组
 * @returns 表格列数组
 */
const filterTableSchema = (crudSchema: CrudSchema[]): TableColumn[] => {
	const tableColumns = treeMap<CrudSchema>(crudSchema, {
		conversion: (schema: CrudSchema) => {
			// 如果 schema 的 table 属性存在且 hidden 属性为 false，则返回包含 schema 和 schema.table 的对象
			if (!schema?.table?.hidden) {
				return {
					...schema,
					...schema.table
				}
			}
		}
	})

	// 第一次过滤可能会得到 undefined，所以需要进行二次过滤
	return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
		// 如果 data 的 children 属性不存在，则删除其 children 属性
		if (data.children === void 0) {
			delete data.children
		}
		// 如果 data 的 field 属性存在，则返回 true
		return !!data.field
	})
}

/**
 * 将 CrudSchema 数组转换为 FormSchema 数组
 *
 * @param crudSchema CrudSchema 数组
 * @returns FormSchema 数组
 */
const filterFormSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
	const formSchema: FormSchema[] = []
	const length = crudSchema.length

	for (let i = 0; i < length; i++) {
		const formItem = crudSchema[i]
		// 创建一个新的对象 formSchemaItem，并判断是否隐藏
		const formSchemaItem = {
			component: formItem?.form?.component || 'Input',
			...formItem.form,
			field: formItem.field,
			label: formItem.form?.label || formItem.label
		}

		// 将 formSchemaItem 添加到 formSchema 数组中
		formSchema.push(formSchemaItem)
	}

	// 返回过滤后的 formSchema 数组
	return formSchema
}

/**
 * 根据 CRUD 架构过滤出描述架构
 *
 * @param crudSchema CRUD 架构数组
 * @returns 过滤后的描述架构数组
 */
const filterDescriptionsSchema = (crudSchema: CrudSchema[]): DescriptionsSchema[] => {
	const descriptionsSchema: FormSchema[] = []

	eachTree(crudSchema, (schemaItem: CrudSchema) => {
		// 如果 schemaItem 的 detail 属性存在且 hidden 属性为 false，则创建一个新的对象并添加到 descriptionsSchema 数组中
		if (!schemaItem?.detail?.hidden) {
			const descriptionsSchemaItem = {
				...schemaItem.detail,
				field: schemaItem.field,
				label: schemaItem.detail?.label || schemaItem.label
			}

			// 删除 descriptionsSchemaItem 的 hidden 属性
			delete descriptionsSchemaItem.hidden

			descriptionsSchema.push(descriptionsSchemaItem)
		}
	})

	// 返回过滤后的 descriptionsSchema 数组
	return descriptionsSchema
}
