<script lang="tsx">
/**
 * @file Form.vue
 * @description 表单组件，支持动态渲染和自定义配置。集成了多种表单元素，并支持栅格布局。
 * @example
 * <Form
 *   :schema="formSchema"
 *   :model="formData"
 *   :rules="validationRules"
 *   @register="handleRegister"
 * >
 *   <template #default>
 *     <CustomComponent />
 *   </template>
 * </Form>
 * @version 1.0.0
 * @author Your Name
 * @date 2023-10-02
 * @module Form
 */

// 导入 PropType 类型
import type { PropType } from 'vue'
// 从 vue 中导入所需的函数
import { defineComponent, ref, computed, unref, watch, onMounted } from 'vue'

// 导入 Element Plus 中的表单相关类型
import type { FormRules, ComponentSize, FormItemProp } from 'element-plus'
// 导入 Element Plus 中的表单组件
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'

// 导入帮助函数和组件映射
import { componentMap } from './helper/componentMap'
// 导入属性类型
import { propTypes } from '@/utils/propTypes'
// 导入获取插槽的帮助函数
import { getSlot } from '@/utils/tsxHelper'
// 导入设置表单相关属性的帮助函数
import {
	setTextPlaceholder,
	setGridProp,
	setComponentProps,
	setItemComponentSlots,
	initModel
} from './helper'
// 导入渲染选择框的组合
import { useRenderSelect } from './components/useRenderSelect'
// 导入渲染单选框的组合
import { useRenderRadio } from './components/useRenderRadio'
// 导入渲染复选框的组合
import { useRenderCheckbox } from './components/useRenderCheckbox'
// 导入设计相关的钩子
import { useDesign } from '@/hooks/web/useDesign'
// 导入查找索引的工具函数
import { findIndex } from '@/utils'
// 导入 lodash 的 get 和 set 方法
import { get, set } from 'lodash-es'
// 导入表单属性类型
import type { FormProps } from './types'
// 导入表单相关的类型
import type {
	FormSchema,
	FormSetProps,
	SelectComponentProps,
	RadioGroupComponentProps,
	CheckboxGroupComponentProps
} from './types'
// 导入组件名称枚举
import { ComponentNameEnum } from './types'

// 从 useRenderSelect 中解构出渲染选择框的选项函数
const { renderSelectOptions } = useRenderSelect()
// 从 useRenderRadio 中解构出渲染单选框的选项函数
const { renderRadioOptions } = useRenderRadio()
// 从 useRenderCheckbox 中解构出渲染复选框的选项函数
const { renderCheckboxOptions } = useRenderCheckbox()

// 从 useDesign 中解构出获取前缀类名的函数
const { getPrefixCls } = useDesign()

// 定义前缀类名
const prefixCls = getPrefixCls('form')

// 导出组件
export default defineComponent({
	/** 组件名称 */
	name: 'Form',
	// 组件的属性定义
	props: {
		// 生成Form的布局结构数组
		schema: {
			type: Array as PropType<FormSchema[]>, // 属性类型
			default: () => [] // 默认值
		},
		// 是否需要栅格布局
		isCol: propTypes.bool.def(true),
		// 表单数据对象
		model: {
			type: Object as PropType<any>, // 属性类型
			default: () => ({}) // 默认值
		},
		// 是否自动设置placeholder
		autoSetPlaceholder: propTypes.bool.def(true),
		// 是否自定义内容
		isCustom: propTypes.bool.def(false),
		// 表单label宽度
		labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
		// 表单验证规则
		rules: {
			type: Object as PropType<FormRules>, // 属性类型
			default: () => ({}) // 默认值
		},
		// label 位置
		labelPosition: propTypes.oneOf(['left', 'right', 'top']).def('right'),
		// label 后缀
		labelSuffix: propTypes.string.def(''),
		// 是否隐藏必填星号
		hideRequiredAsterisk: propTypes.bool.def(false),
		// 必填星号位置
		requireAsteriskPosition: propTypes.oneOf(['left', 'right']).def('left'),
		// 是否显示消息提示
		showMessage: propTypes.bool.def(true),
		// 是否内联消息
		inlineMessage: propTypes.bool.def(false),
		// 是否显示状态图标
		statusIcon: propTypes.bool.def(false),
		// 是否在规则改变时验证
		validateOnRuleChange: propTypes.bool.def(true),
		// 组件大小
		size: {
			type: String as PropType<ComponentSize>, // 属性类型
			default: undefined // 默认值
		},
		// 是否禁用
		disabled: propTypes.bool.def(false),
		// 是否滚动到错误
		scrollToError: propTypes.bool.def(false),
		// 滚动到错误偏移
		scrollToErrorOffset: propTypes.oneOfType([Boolean, Object]).def(undefined)
		// onValidate: {
		//   type: Function as PropType<(prop: FormItemProp, isValid: boolean, message: string) => void>,
		//   default: () => {}
		// }
	},
	// 组件触发的事件
	emits: ['register'],
	// 组件的 setup 函数
	setup(props, { slots, expose, emit }) {
		// element form 实例的引用
		const elFormRef = ref<ComponentRef<typeof ElForm>>()

		// 存储合并后的表单属性
		const mergeProps = ref<FormProps>({})

		// 计算属性：获取合并后的属性
		const getProps = computed(() => {
			const propsObj = { ...props } // 拷贝 props 对象
			Object.assign(propsObj, unref(mergeProps)) // 合并
			return propsObj // 返回合并后的对象
		})

		// 存储表单组件实例
		const formComponents = ref({})

		// 存储 form-item 实例
		const formItemComponents = ref({})

		// 表单数据
		const formModel = ref<Recordable>(props.model)

		// 组件挂载后执行
		onMounted(() => {
			emit('register', unref(elFormRef)?.$parent, unref(elFormRef)) // 注册表单实例
		})

		/**
		 * @description: 设置表单值
		 * @param data - 表单数据
		 */
		const setValues = (data: Recordable = {}) => {
			formModel.value = Object.assign(unref(formModel), data) // 更新表单数据
		}

		/**
		 * @description: 设置组件属性
		 * @param props - 其他属性
		 */
		const setProps = (props: FormProps = {}) => {
			mergeProps.value = Object.assign(unref(mergeProps), props) // 更新合并属性
		}

		/**
		 * @description: 删除表单结构中的字段
		 * @param field - 字段名
		 */
		const delSchema = (field: string) => {
			const { schema } = unref(getProps) // 解构获取 schema
			const index = findIndex(schema, (v: FormSchema) => v.field === field) // 查找字段索引
			if (index > -1) {
				schema.splice(index, 1) // 删除字段
			}
		}

		/**
		 * @description: 添加表单结构
		 * @param formSchema - 表单结构
		 * @param index - 插入位置
		 */
		const addSchema = (formSchema: FormSchema, index?: number) => {
			const { schema } = unref(getProps) // 解构获取 schema
			if (index !== void 0) {
				schema.splice(index, 0, formSchema) // 在指定位置添加
				return
			}
			schema.push(formSchema) // 末尾添加
		}

		/**
		 * @description: 设置表单结构
		 * @param schemaProps - 要设置的结构属性
		 */
		const setSchema = (schemaProps: FormSetProps[]) => {
			const { schema } = unref(getProps) // 解构获取 schema
			for (const v of schema) {
				for (const item of schemaProps) {
					if (v.field === item.field) {
						set(v, item.path, item.value) // 设置值
					}
				}
			}
		}

		/**
		 * @description: 获取选项
		 * @param fn - 异步函数
		 * @param item - 表单结构项
		 */
		// const getOptions = async (fn: Function, item: FormSchema) => {
		const getOptions = async (fn: () => Promise<any>, item: FormSchema) => {
			const options = await fn() // 调用选项函数
			// 更新选项到表单结构
			setSchema([
				{
					field: item.field,
					path:
						item.component === ComponentNameEnum.TREE_SELECT ||
						item.component === ComponentNameEnum.TRANSFER
							? 'componentProps.data'
							: 'componentProps.options',
					value: options
				}
			])
		}

		/**
		 * @description: 获取表单组件实例
		 * @param filed - 表单字段
		 */
		const getComponentExpose = (filed: string) => {
			return unref(formComponents)[filed] // 返回组件实例
		}

		/**
		 * @description: 获取 formItem 实例
		 * @param filed - 表单字段
		 */
		const getFormItemExpose = (filed: string) => {
			return unref(formItemComponents)[filed] // 返回表单项实例
		}

		/**
		 * @description: 设置组件引用映射
		 * @param ref - 组件引用
		 * @param filed - 字段名
		 */
		const setComponentRefMap = (ref: any, filed: string) => {
			formComponents.value[filed] = ref // 存储组件引用
		}

		/**
		 * @description: 设置表单项引用映射
		 * @param ref - 表单项引用
		 * @param filed - 字段名
		 */
		const setFormItemRefMap = (ref: any, filed: string) => {
			formItemComponents.value[filed] = ref // 存储表单项引用
		}

		// 暴露给外部的公共方法
		expose({
			setValues,
			formModel,
			setProps,
			delSchema,
			addSchema,
			setSchema,
			getComponentExpose,
			getFormItemExpose
		})

		// 监听表单结构化数组，重新生成 formModel
		watch(
			() => unref(getProps).schema, // 观察 schema
			(schema = []) => {
				formModel.value = initModel(schema, unref(formModel)) // 初始化表单数据
			},
			{
				immediate: true, // 立即执行
				deep: true // 深度监听
			}
		)

		// 渲染包裹标签，是否使用栅格布局
		const renderWrap = () => {
			const { isCol } = unref(getProps) // 解构获取是否使用栅格布局
			const content = isCol ? (
				<ElRow gutter={20}>{renderFormItemWrap()}</ElRow> // 栅格布局
			) : (
				renderFormItemWrap() // 普通布局
			)
			return content // 返回内容
		}

		// 渲染表单项包裹
		const renderFormItemWrap = () => {
			// hidden属性表示隐藏，不做渲染
			const { schema = [], isCol } = unref(getProps) // 解构获取 schema 和 isCol
			return schema
				.filter((v) => !v.remove) // 过滤掉移除的字段
				.map((item) => {
					// 如果是 Divider 组件，需要自己占用一行
					const isDivider = item.component === 'Divider' // 判断是否为 Divider 组件
					const Com = componentMap['Divider'] as ReturnType<typeof defineComponent> // 获取 Divider 组件
					return isDivider ? (
						<Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com> // 渲染 Divider
					) : isCol ? (
						// 如果需要栅格，需要包裹 ElCol
						<ElCol {...setGridProp(item.colProps)}>{renderFormItem(item)}</ElCol> // 渲染栅格
					) : (
						renderFormItem(item) // 普通渲染
					)
				})
		}

		// 渲染表单项
		const renderFormItem = (item: FormSchema) => {
			// 如果有optionApi，优先使用optionApi, 并且options不存在或者为空数组
			if (
				item.optionApi &&
				(!item.componentProps?.options || !item.componentProps?.options.length)
			) {
				// 内部自动调用接口，不影响其它渲染
				getOptions(item.optionApi, item) // 获取选项
			}
			// 定义表单项插槽
			const formItemSlots: Recordable = {
				default: () => {
					if (item?.formItemProps?.slots?.default) {
						return item?.formItemProps?.slots?.default(formModel.value) // 使用自定义插槽
					} else {
						const Com = componentMap[item.component as string] as ReturnType<typeof defineComponent> // 获取组件

						const { autoSetPlaceholder } = unref(getProps) // 解构获取自动设置 placeholder 的属性

						// 获取组件插槽
						const componentSlots = (item?.componentProps as any)?.slots || {}
						const slotsMap: Recordable = {
							...setItemComponentSlots(componentSlots) // 设置插槽
						}
						// 如果是select组件，并且没有自定义模板，自动渲染options
						if (item.component === ComponentNameEnum.SELECT) {
							slotsMap.default = !componentSlots.default
								? () => renderSelectOptions(item) // 渲染选择框选项
								: () => {
										return componentSlots.default(
											unref((item?.componentProps as SelectComponentProps)?.options)
										)
									}
						}

						// 虚拟列表
						if (item.component === ComponentNameEnum.SELECT_V2 && componentSlots.default) {
							slotsMap.default = ({ item }) => {
								return componentSlots.default(item) // 渲染虚拟列表
							}
						}

						// 单选框组和按钮样式
						if (
							item.component === ComponentNameEnum.RADIO_GROUP ||
							item.component === ComponentNameEnum.RADIO_BUTTON
						) {
							slotsMap.default = !componentSlots.default
								? () => renderRadioOptions(item) // 渲染单选框选项
								: () => {
										return componentSlots.default(
											unref((item?.componentProps as CheckboxGroupComponentProps)?.options)
										)
									}
						}

						// 多选框组和按钮样式
						if (
							item.component === ComponentNameEnum.CHECKBOX_GROUP ||
							item.component === ComponentNameEnum.CHECKBOX_BUTTON
						) {
							slotsMap.default = !componentSlots.default
								? () => renderCheckboxOptions(item) // 渲染复选框选项
								: () => {
										return componentSlots.default(
											unref((item?.componentProps as RadioGroupComponentProps)?.options)
										)
									}
						}

						// 定义组件
						const Comp = () => {
							// 如果field是多层路径，需要转换成对象
							const itemVal = computed({
								get: () => {
									return get(formModel.value, item.field) // 获取表单值
								},
								set: (val) => {
									set(formModel.value, item.field, val) // 设置表单值
								}
							})

							// 根据组件类型渲染不同的组件
							return item.component === ComponentNameEnum.UPLOAD ? (
								<Com
									vModel:file-list={itemVal.value} // 双向绑定
									ref={(el: any) => setComponentRefMap(el, item.field)} // 设置组件引用
									{...(autoSetPlaceholder && setTextPlaceholder(item))} // 设置 placeholder
									{...setComponentProps(item)} // 设置组件属性
									style={
										item.componentProps?.style || {
											width: '100%' // 设置默认宽度
										}
									}
								>
									{{ ...slotsMap }} // 渲染插槽
								</Com>
							) : (
								<Com
									vModel={itemVal.value} // 双向绑定
									ref={(el: any) => setComponentRefMap(el, item.field)} // 设置组件引用
									{...(autoSetPlaceholder && setTextPlaceholder(item))} // 设置 placeholder
									{...setComponentProps(item)} // 设置组件属性
									style={
										item.componentProps?.style || {
											width: '100%' // 设置默认宽度
										}
									}
								>
									{{ ...slotsMap }} // 渲染插槽
								</Com>
							)
						}

						return <>{Comp()}</> // 渲染组件
					}
				}
			}
			// 如果有 label 插槽，渲染自定义的 label
			if (item?.formItemProps?.slots?.label) {
				formItemSlots.label = (...args: any[]) => {
					return (item?.formItemProps?.slots as any)?.label(...args) // 渲染 label 插槽
				}
			}
			// 如果有 error 插槽，渲染自定义的 error
			if (item?.formItemProps?.slots?.error) {
				formItemSlots.error = (...args: any[]) => {
					return (item?.formItemProps?.slots as any)?.error(...args) // 渲染 error 插槽
				}
			}
			return (
				<ElFormItem
					v-show={!item.hidden} // 根据 hidden 属性决定是否渲染
					ref={(el: any) => setFormItemRefMap(el, item.field)} // 设置表单项引用
					{...(item.formItemProps || {})} // 设置表单项属性
					prop={item.field} // 表单项字段
					label={item.label || ''} // 表单项标签
				>
					{formItemSlots} // 渲染插槽
				</ElFormItem>
			)
		}

		// 过滤传入 Form 组件的属性
		const getFormBindValue = () => {
			// 避免在标签上出现多余的属性
			const delKeys = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model'] // 要删除的属性键
			const props = { ...unref(getProps) } // 拷贝组件属性
			for (const key in props) {
				if (delKeys.indexOf(key) !== -1) {
					delete props[key] // 删除多余的属性
				}
			}
			return props as FormProps // 返回过滤后的属性
		}

		// 返回渲染内容
		return () => (
			<ElForm
				ref={elFormRef} // 绑定表单引用
				{...getFormBindValue()} // 绑定过滤后的属性
				model={unref(getProps).isCustom ? unref(getProps).model : formModel} // 绑定模型
				class={prefixCls} // 设置类名
				// @ts-ignore
				onSubmit={(e: Event) => {
					e.preventDefault() // 阻止默认提交
				}}
			>
				{{
					// 如果需要自定义，就什么都不渲染，而是提供默认插槽
					default: () => {
						const { isCustom } = unref(getProps) // 解构获取是否自定义
						return isCustom ? getSlot(slots, 'default') : renderWrap() // 根据 isCustom 渲染内容
					}
				}}
			</ElForm>
		)
	}
})
</script>

<style lang="less" scoped>
.@{elNamespace}-form.@{adminNamespace}-form .@{elNamespace}-row {
	margin-right: 0 !important; // 行右边距强制为0
	margin-left: 0 !important; // 行左边距强制为0
}

.@{elNamespace}-form--inline {
	:deep(.el-form-item__content) {
		& > :first-child {
			min-width: 229.5px; // 内联样式首个子元素的最小宽度
		}
	}
	.@{elNamespace}-input-number {
		// 229.5px是兼容el-input-number的最小宽度,
		min-width: 229.5px; // 设置最小宽度
	}
}
</style>
