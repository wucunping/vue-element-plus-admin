<script setup lang="tsx">
/**
 * @file Search.vue
 * @description 搜索组件，封装了表单的基本功能，包括搜索、重置和动态调整表单项。
 * @example <Search :schema="schema" @search="handleSearch" @reset="handleReset" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Search
 */

import type { FormSchema, FormSetProps } from '@/components/Form' // 表单结构的类型
import { Form } from '@/components/Form' // 表单组件
import type { PropType } from 'vue' // PropType类型
import { computed, unref, ref, watch, onMounted } from 'vue' // Vue的响应式API
import { propTypes } from '@/utils/propTypes' // 属性类型验证工具
import { useForm } from '@/hooks/web/useForm' // 自定义表单hooks
import { findIndex } from '@/utils' // 查找工具函数
import { cloneDeep, set } from 'lodash-es' // 深拷贝和设置工具函数
import { initModel } from '@/components/Form/src/helper' // 表单模型初始化函数
import ActionButton from './components/ActionButton.vue' // 操作按钮组件
import type { SearchProps } from './types' // 搜索组件的Props类型定义
import type { FormItemProp } from 'element-plus' // Element Plus表单项属性类型
import { isObject, isEmptyVal } from '@/utils/is' // 对象判断工具函数

/** 定义组件Props */
const props = defineProps({
	/** 生成Form的布局结构数组 */
	schema: {
		type: Array as PropType<FormSchema[]>, // Props类型为FormSchema数组
		default: () => [] // 默认值为空数组
	},
	/** 是否需要栅格布局 */
	isCol: propTypes.bool.def(false), // 默认为false
	/** 表单label宽度 */
	labelWidth: propTypes.oneOfType([String, Number]).def('auto'), // 默认为'auto'
	/** 操作按钮风格位置 */
	layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'), // 默认值为'inline'
	/** 底部按钮的对齐方式 */
	buttonPosition: propTypes.string
		.validate((v: string) => ['left', 'center', 'right'].includes(v)) // 校验按钮位置
		.def('center'), // 默认值为'center'
	/** 是否显示搜索按钮，默认true */
	showSearch: propTypes.bool.def(true),
	/** 是否显示重置按钮，默认true */
	showReset: propTypes.bool.def(true),
	/** 是否显示伸缩 */
	showExpand: propTypes.bool.def(false), // 默认不显示
	/** 伸缩的界限字段 */
	expandField: propTypes.string.def(''), // 默认值为空字符串
	/** 是否采用行内模式，默认true */
	inline: propTypes.bool.def(true),
	/** 是否去除空值项 */
	removeNoValueItem: propTypes.bool.def(true), // 默认去除空值项
	/** 表单的模型数据类型 */
	model: {
		type: Object as PropType<Recordable>, // 表单的模型数据类型
		default: () => ({}) // 默认值为空对象
	},
	/** 搜索加载状态，默认false */
	searchLoading: propTypes.bool.def(false),
	/** 重置加载状态，默认false */
	resetLoading: propTypes.bool.def(false)
})

/** 定义组件发出的事件 */
const emit = defineEmits(['search', 'reset', 'register', 'validate'])

/** 控制搜索框是否可见的响应式变量 */
const visible = ref(true)

/** 表单数据 */
const formModel = ref<Recordable>(props.model) // 使用props.model初始化表单数据

/** 根据props计算出的新schema */
const newSchema = computed(() => {
	const propsComputed = unref(getProps) // 获取计算后的Props
	let schema: FormSchema[] = cloneDeep(propsComputed.schema) // 深拷贝schema
	if (propsComputed.showExpand && propsComputed.expandField && !unref(visible)) {
		// 判断是否需要显示扩展字段
		const index = findIndex(schema, (v: FormSchema) => v.field === propsComputed.expandField) // 获取扩展字段的索引
		schema.map((v, i) => {
			if (i >= index) {
				v.hidden = true // 隐藏扩展字段后的所有字段
			} else {
				v.hidden = false // 显示扩展字段之前的字段
			}
			return v
		})
	}
	// 如果布局为行内，则添加操作按钮到schema中
	if (propsComputed.layout === 'inline') {
		schema = schema.concat([
			{
				field: 'action', // 操作字段
				formItemProps: {
					labelWidth: '0px', // 标签宽度为0
					slots: {
						default: () => {
							// 默认插槽
							return (
								<div>
									<ActionButton // 操作按钮组件
										showSearch={propsComputed.showSearch} // 显示搜索按钮
										showReset={propsComputed.showReset} // 显示重置按钮
										showExpand={propsComputed.showExpand} // 显示扩展按钮
										searchLoading={propsComputed.searchLoading} // 搜索加载状态
										resetLoading={propsComputed.resetLoading} // 重置加载状态
										visible={visible.value} // 控制按钮可见性
										onExpand={setVisible} // 点击扩展按钮的事件
										onReset={reset} // 点击重置按钮的事件
										onSearch={search} // 点击搜索按钮的事件
									/>
								</div>
							)
						},
						label: () => {
							// 标签插槽
							return <span>&nbsp;</span> // 返回空白标签
						}
					}
				}
			}
		])
	}
	return schema // 返回计算后的schema
})

/** 使用自定义表单hooks */
const { formRegister, formMethods } = useForm() // 注册表单和表单方法
/** 获取表单实例相关的方法 */
const { getElFormExpose, getFormData, getFormExpose } = formMethods

/** 外部传入的props */
const outsideProps = ref<SearchProps>({}) // 外部props的响应式变量

/** 合并props的响应式变量 */
const mergeProps = ref<SearchProps>({})

/** 获取合并后的props */
const getProps = computed(() => {
	const propsObj = { ...props } // 浅克隆内置props
	Object.assign(propsObj, unref(mergeProps)) // 合并外部传入的props
	return propsObj // 返回合并后的props对象
})

/** 设置合并后的props */
const setProps = (props: SearchProps = {}) => {
	mergeProps.value = Object.assign(unref(mergeProps), props) // 合并传入的props
	// @ts-ignore
	outsideProps.value = props // 设置外部props
}

/** 表单schema的响应式变量 */
const schemaRef = ref<FormSchema[]>([])

/** 监听schema的变化，重新生成formModel */
watch(
	() => unref(newSchema), // 监听newSchema的变化
	async (schema = []) => {
		// 当schema变化时执行
		formModel.value = initModel(schema, unref(formModel)) // 初始化表单模型
		schemaRef.value = schema // 更新schemaRef
	},
	{
		immediate: true, // 立即执行
		deep: true // 深度监听
	}
)

/** 过滤表单数据，去除空值项 */
const filterModel = async () => {
	const model = await getFormData() // 获取表单数据
	if (unref(getProps).removeNoValueItem) {
		// 判断是否去除空值项
		// 使用reduce过滤空值，并返回一个新对象
		return Object.keys(model).reduce((prev, next) => {
			const value = model[next] // 获取当前字段的值
			if (!isEmptyVal(value)) {
				// 判断值是否为空
				if (isObject(value)) {
					// 如果值是对象
					if (Object.keys(value).length > 0) {
						// 判断对象是否有属性
						prev[next] = value // 如果有属性，则保留
					}
				} else {
					prev[next] = value // 否则直接保留
				}
			}
			return prev // 返回过滤后的对象
		}, {})
	}
	return model // 返回原始模型
}

/** 搜索操作 */
const search = async () => {
	const elFormExpose = await getElFormExpose() // 获取表单实例
	await elFormExpose?.validate(async (isValid) => {
		/** 验证表单 */
		if (isValid) {
			/** 如果验证通过 */
			const model = await filterModel() // 过滤表单数据
			emit('search', model) // 触发search事件
		}
	})
}

/** 重置操作 */
const reset = async () => {
	const elFormExpose = await getElFormExpose() // 获取表单实例
	elFormExpose?.resetFields() // 重置表单字段
	const model = await filterModel() // 过滤表单数据
	emit('reset', model) // 触发reset事件
}

/** 计算底部按钮样式 */
const bottomButtonStyle = computed(() => {
	return {
		textAlign: unref(getProps).buttonPosition as unknown as 'left' | 'center' | 'right' // 设置按钮文本对齐方式
	}
})

/** 切换可见性 */
const setVisible = async () => {
	visible.value = !unref(visible) // 切换visible的值
}

/** 设置schema */
const setSchema = (schemaProps: FormSetProps[]) => {
	const { schema } = unref(getProps) // 获取props中的schema
	for (const v of schema) {
		/** 遍历schema */
		for (const item of schemaProps) {
			/** 遍历传入的schemaProps */
			if (v.field === item.field) {
				/** 判断字段是否匹配 */
				set(v, item.path, item.value) // 设置对应字段的值
			}
		}
	}
}

/** 对表单赋值 */
const setValues = async (data: Recordable = {}) => {
	formModel.value = Object.assign(props.model, unref(formModel), data) // 合并传入的数据
	const formExpose = await getFormExpose() // 获取表单实例
	formExpose?.setValues(data) // 设置表单值
}

/** 删除schema中的字段 */
const delSchema = (field: string) => {
	const { schema } = unref(getProps) // 获取props中的schema

	const index = findIndex(schema, (v: FormSchema) => v.field === field) // 查找需要删除的字段索引
	if (index > -1) {
		/** 如果存在 */
		schema.splice(index, 1) // 删除该字段
	}
}

/** 向schema中添加字段 */
const addSchema = (formSchema: FormSchema, index?: number) => {
	const { schema } = unref(getProps) // 获取props中的schema
	if (index !== void 0) {
		/** 如果指定插入索引 */
		schema.splice(index, 0, formSchema) // 在指定位置插入
		return
	}
	schema.push(formSchema) // 否则直接推入
}

/** 默认暴露的函数集合 */
const defaultExpose = {
	getElFormExpose, // 获取表单实例
	setProps, // 设置合并后的props
	setSchema, // 设置schema
	setValues, // 设置值
	delSchema, // 删除schema字段
	addSchema, // 添加schema字段
	getFormData // 获取表单数据
}

/** 组件挂载时执行 */
onMounted(() => {
	emit('register', defaultExpose) // 注册defaultExpose
})

/** 定义暴露的接口 */
defineExpose(defaultExpose)

/** 表单验证回调 */
const onFormValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
	emit('validate', prop, isValid, message) // 触发validate事件，传递验证信息
}

/*
<template>
	<Form
		:model="formModel" // 绑定表单数据
		:is-custom="false" // 不使用自定义样式
		:label-width="getProps.labelWidth" // 标签宽度
		hide-required-asterisk // 隐藏必填星号
		:inline="getProps.inline" // 是否行内显示
		:is-col="getProps.isCol" // 是否使用栅格布局
		:schema="schemaRef" // 绑定schema
		@register="formRegister" // 注册表单事件
		@validate="onFormValidate" // 注册验证事件
	/>

	<template v-if="layout === 'bottom'"> 
		<div :style="bottomButtonStyle"> <!-- 底部按钮样式 -->
			<ActionButton
				:show-reset="getProps.showReset" // 显示重置按钮
				:show-search="getProps.showSearch" // 显示搜索按钮
				:show-expand="getProps.showExpand" // 显示扩展按钮
				:search-loading="getProps.searchLoading" // 搜索加载状态
				:reset-loading="getProps.resetLoading" // 重置加载状态
				:visible="visible" // 控制按钮可见性
				@expand="setVisible" // 处理扩展按钮点击事件
				@reset="reset" // 处理重置按钮点击事件
				@search="search" // 处理搜索按钮点击事件
			/>
		</div>
	</template>
</template>
*/
</script>

<template>
	<Form
		:model="formModel"
		:is-custom="false"
		:label-width="getProps.labelWidth"
		hide-required-asterisk
		:inline="getProps.inline"
		:is-col="getProps.isCol"
		:schema="schemaRef"
		@register="formRegister"
		@validate="onFormValidate"
	/>

	<template v-if="layout === 'bottom'">
		<div :style="bottomButtonStyle">
			<ActionButton
				:show-reset="getProps.showReset"
				:show-search="getProps.showSearch"
				:show-expand="getProps.showExpand"
				:search-loading="getProps.searchLoading"
				:reset-loading="getProps.resetLoading"
				:visible="visible"
				@expand="setVisible"
				@reset="reset"
				@search="search"
			/>
		</div>
	</template>
</template>
