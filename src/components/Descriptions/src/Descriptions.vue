<script lang="tsx">
/**
 * @file Descriptions.vue
 * @description 描述组件，显示字段信息与相关标签
 * @example
 * <Descriptions :schema="schemaData" :data="dataSource" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Descriptions
 */

/** 导入 Element Plus 组件 */
import { ElCollapseTransition, ElTooltip, ElRow, ElCol } from 'element-plus'
/** 导入自定义设计钩子 */
import { useDesign } from '@/hooks/web/useDesign'
/** 导入属性类型工具 */
import { propTypes } from '@/utils/propTypes'
/** 导入 Vue 类型 */
import type { PropType } from 'vue'
/** 导入 Vue 相关 API */
import { ref, unref, computed, defineComponent } from 'vue'
/** 导入应用状态管理 */
import { useAppStore } from '@/store/modules/app'
/** 导入描述模式接口 */
import type { DescriptionsSchema } from './types'
/** 导入图标组件 */
import { Icon } from '@/components/Icon'
/** 导入 Lodash 的 get 方法 */
import { get } from 'lodash-es'

/** 初始化应用状态管理 */
const appStore = useAppStore()

/** 计算属性，用于判断是否为移动端 */
const mobile = computed(() => appStore.getMobile)

/** 获取组件前缀 */
const { getPrefixCls } = useDesign()

/** 定义组件前缀类名 */
const prefixCls = getPrefixCls('descriptions')

/** 默认数据值 */
const defaultData = '-'

/** 导出描述组件 */
export default defineComponent({
	/** 组件名称 */
	name: 'Descriptions',
	props: {
		/** 组件标题 */
		title: propTypes.string.def(''),
		/** 组件消息 */
		message: propTypes.string.def(''),
		/** 是否可折叠 */
		collapse: propTypes.bool.def(true),
		/** 是否显示边框 */
		border: propTypes.bool.def(true),
		/** 列的数量 */
		column: propTypes.number.def(2),
		/** 尺寸类型 */
		size: propTypes.oneOf(['large', 'default', 'small']).def('default'),
		/** 方向类型 */
		direction: propTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
		/** 额外信息 */
		extra: propTypes.string.def(''),
		/** 描述模式数据 */
		schema: {
			/** schema 的数据类型 */
			type: Array as PropType<DescriptionsSchema[]>,
			/** 默认值 */
			default: () => []
		},
		/** 数据对象 */
		data: {
			/** 数据的类型 */
			type: Object as PropType<any>,
			/** 默认值 */
			default: () => ({})
		}
	},
	/** 组件的 setup 方法 */
	setup(props, { attrs }) {
		/** 绑定属性的计算属性 */
		const getBindValue = computed((): any => {
			/** 删除的属性数组 */
			const delArr: string[] = ['title', 'message', 'collapse', 'schema', 'data', 'class']
			/** 合并 attrs 和 props */
			const obj = { ...attrs, ...props }
			/** 删除不需要的属性 */
			for (const key in obj) {
				if (delArr.indexOf(key) !== -1) {
					delete obj[key]
				}
			}
			/** 判断是否为移动端，如果是则设置为垂直方向 */
			if (unref(mobile)) {
				obj.direction = 'vertical'
			}
			/** 返回处理后的对象 */
			return obj
		})

		/** 获取绑定项的值 */
		const getBindItemValue = (item: DescriptionsSchema) => {
			/** 删除的字段数组 */
			const delArr: string[] = ['field']
			/** 创建 item 的副本 */
			const obj = { ...item }
			/** 删除不需要的字段 */
			for (const key in obj) {
				if (delArr.indexOf(key) !== -1) {
					delete obj[key]
				}
			}
			/** 返回label的类名和item的其他属性 */
			return {
				labelClassName: `${prefixCls}-label`,
				...obj
			}
		}

		/** 折叠状态的响应式引用 */
		const show = ref(true)

		/** 切换折叠状态的方法 */
		const toggleClick = () => {
			/** 如果可折叠，切换折叠状态 */
			if (props.collapse) {
				show.value = !unref(show)
			}
		}

		/** 渲染组件 */
		return () => {
			return (
				<div
					class={[
						prefixCls,
						'bg-[var(--el-color-white)] dark:bg-[var(--el-bg-color)] dark:border-[var(--el-border-color)] dark:border-1px'
					]}
				>
					{props.title ? (
						<div
							class={[
								`${prefixCls}-header`,
								'relative h-50px flex justify-between items-center layout-border__bottom px-10px cursor-pointer'
							]}
							/** 点击事件，切换折叠状态 */
							onClick={toggleClick}
						>
							<div class={[`${prefixCls}-header__title`, 'relative font-18px font-bold ml-10px']}>
								<div class="flex items-center">
									{props.title}
									{props.message ? (
										<ElTooltip content={props.message} placement="right">
											<Icon icon="vi-bi:question-circle-fill" class="ml-5px" size={14} />
										</ElTooltip>
									) : null}
								</div>
							</div>
							{/* 根据是否可折叠显示图标 */}
							{props.collapse ? (
								<Icon icon={show.value ? 'vi-ep:arrow-down' : 'vi-ep:arrow-up'} />
							) : null}
						</div>
					) : null}

					<ElCollapseTransition>
						{/* 控制折叠内容的显示 */}
						<div v-show={unref(show)} class={[`${prefixCls}-content`, 'p-20px']}>
							<ElRow
								gutter={0}
								{...unref(getBindValue)}
								class="outline-1px outline-[var(--el-border-color-lighter)] outline-solid"
							>
								{/* 遍历 schema 中的项 */}
								{props.schema.map((item) => {
									return (
										<ElCol
											key={item.field}
											span={item.span || 24 / props.column}
											class="flex items-stretch"
										>
											{props.direction === 'horizontal' ? (
												<div class="flex items-stretch bg-[var(--el-fill-color-light)] outline-1px outline-[var(--el-border-color-lighter)] outline-solid flex-1">
													<div
														{...getBindItemValue(item)}
														class="w-120px text-left px-8px py-11px font-700 color-[var(--el-text-color-regular)] border-r-1px border-r-[var(--el-border-color-lighter)] border-r-solid "
													>
														{/* 显示标签 */}
														{item.label}
													</div>
													<div class="flex-1 px-8px py-11px bg-[var(--el-bg-color)] color-[var(--el-text-color-primary)] text-size-14px">
														{/* 根据有无默认插槽显示内容 */}
														{item.slots?.default
															? item.slots?.default(props.data)
															: (get(props.data, item.field) ?? defaultData)}
													</div>
												</div>
											) : (
												<div class="bg-[var(--el-fill-color-light)] outline-1px outline-[var(--el-border-color-lighter)] outline-solid flex-1">
													<div
														{...getBindItemValue(item)}
														class="text-left px-8px py-11px font-700 color-[var(--el-text-color-regular)] border-b-1px border-b-[var(--el-border-color-lighter)] border-b-solid"
													>
														{/* 显示标签 */}
														{item.label}
													</div>
													<div class="flex-1 px-8px py-11px bg-[var(--el-bg-color)] color-[var(--el-text-color-primary)] text-size-14px">
														{/* 根据有无默认插槽显示内容 */}
														{item.slots?.default
															? item.slots?.default(props.data)
															: (get(props.data, item.field) ?? defaultData)}
													</div>
												</div>
											)}
										</ElCol>
									)
								})}
							</ElRow>
						</div>
					</ElCollapseTransition>
				</div>
			)
		}
	}
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-descriptions'; // 定义前缀类，使用 adminNamespace 动态生成描述组件的前缀

:deep(.@{elNamespace}-descriptions__header) {
	// 深度选择描述组件的头部
	display: none !important; // 隐藏描述头部
}

.@{prefix-cls}-header {
	// 定义描述头部样式
	&__title {
		// 定义标题样式
		&::after {
			// 在标题后添加伪元素
			position: absolute; // 设置为绝对定位
			top: 3px; // 距上边距 3 像素
			left: -10px; // 距左边距 -10 像素
			width: 4px; // 宽度 4 像素
			height: 70%; // 高度 70%
			background: var(--el-color-primary); // 背景色为主要颜色
			content: ''; // 伪元素内容为空
		}
	}
}

:deep(.@{prefix-cls}-label) {
	// 深度选择描述组件的标签
	width: 150px !important; // 设置标签宽度为 150 像素，且使用重要性
}

// .@{prefix-cls}-content {  // 注释掉的内容区域样式
//   :deep(.@{elNamespace}-descriptions__cell) {  // 深度选择描述单元格
//     width: 0;  // 设置单元格宽度为 0，注释掉的代码
//   }
// }
</style>
