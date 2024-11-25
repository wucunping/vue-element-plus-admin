<script lang="tsx">
/**
 * @file Descriptions.vue
 * @description 用于展示描述性内容的通用组件
 * @example
 * <Descriptions :title="'标题'" :message="'消息'" :schema="schema" :data="data" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module Descriptions
 * @requires '@/hooks/web/useDesign', '@/utils/propTypes', 'element-plus', '@/store/modules/app', './types'
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入 Element Plus 的折叠过渡动画组件
import { ElCollapseTransition, ElTooltip, ElRow, ElCol } from 'element-plus'
// 导入自定义设计相关的 hooks
import { useDesign } from '@/hooks/web/useDesign'
// 导入常用的类型工具
import { propTypes } from '@/utils/propTypes'
// 导入 Vue 的核心 API
import { ref, unref, PropType, computed, defineComponent } from 'vue'
// 导入应用状态管理的 store 模块
import { useAppStore } from '@/store/modules/app'
// 导入描述表单相关的类型定义
import { DescriptionsSchema } from './types'
// 导入自定义图标组件
import { Icon } from '@/components/Icon'
// 导入 Lodash 的按需加载模块，用于深度获取对象属性
import { get } from 'lodash-es'

/** 应用状态管理实例 */
const appStore = useAppStore()

/** 是否为移动端设备 */
const mobile = computed(() => appStore.getMobile)

/** 获取样式前缀 */
const { getPrefixCls } = useDesign()

/** 样式前缀 */
const prefixCls = getPrefixCls('descriptions')

/** 默认数据占位符 */
const defaultData = '-'

export default defineComponent({
  name: 'Descriptions',
  props: {
    /** 标题 */
    title: propTypes.string.def(''),
    /** 消息提示 */
    message: propTypes.string.def(''),
    /** 是否可折叠 */
    collapse: propTypes.bool.def(true),
    /** 是否显示边框 */
    border: propTypes.bool.def(true),
    /** 列数 */
    column: propTypes.number.def(2),
    /** 大小 */
    size: propTypes.oneOf(['large', 'default', 'small']).def('default'),
    /** 布局方向 */
    direction: propTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    /** 额外内容 */
    extra: propTypes.string.def(''),
    /** 字段配置 */
    schema: {
      type: Array as PropType<DescriptionsSchema[]>,
      default: () => []
    },
    /** 数据 */
    data: {
      type: Object as PropType<any>,
      default: () => ({})
    }
  },
  setup(props, { attrs }) {
    /** 获取绑定值 */
    const getBindValue = computed((): any => {
      const delArr: string[] = ['title', 'message', 'collapse', 'schema', 'data', 'class']
      const obj = { ...attrs, ...props }
      for (const key in obj) {
        if (delArr.indexOf(key) !== -1) {
          delete obj[key]
        }
      }
      if (unref(mobile)) {
        obj.direction = 'vertical'
      }
      return obj
    })

    /** 获取绑定项值 */
    const getBindItemValue = (item: DescriptionsSchema) => {
      const delArr: string[] = ['field']
      const obj = { ...item }
      for (const key in obj) {
        if (delArr.indexOf(key) !== -1) {
          delete obj[key]
        }
      }
      return {
        labelClassName: `${prefixCls}-label`,
        ...obj
      }
    }

    /** 折叠状态 */
    const show = ref(true)

    /** 切换折叠状态 */
    const toggleClick = () => {
      if (props.collapse) {
        show.value = !unref(show)
      }
    }

    return () => {
      return (
        /** 组件的主容器 */
        <div
          class={[
            prefixCls,
            'bg-[var(--el-color-white)] dark:bg-[var(--el-bg-color)] dark:border-[var(--el-border-color)] dark:border-1px'
          ]}
        >
          {/* 标题部分 */}
          {props.title ? (
            <div
              class={[
                `${prefixCls}-header`,
                'relative h-50px flex justify-between items-center layout-border__bottom px-10px cursor-pointer'
              ]}
              onClick={toggleClick}
            >
              <div class={[`${prefixCls}-header__title`, 'relative font-18px font-bold ml-10px']}>
                <div class="flex items-center">
                  {/* 显示标题 */}
                  {props.title}
                  {/* 如果有消息，则显示提示图标 */}
                  {props.message ? (
                    <ElTooltip content={props.message} placement="right">
                      <Icon icon="vi-bi:question-circle-fill" class="ml-5px" size={14} />
                    </ElTooltip>
                  ) : null}
                </div>
              </div>
              {/* 折叠图标 */}
              {props.collapse ? (
                <Icon icon={show.value ? 'vi-ep:arrow-down' : 'vi-ep:arrow-up'} />
              ) : null}
            </div>
          ) : null}

          {/* 内容部分 */}
          <ElCollapseTransition>
            <div v-show={unref(show)} class={[`${prefixCls}-content`, 'p-20px']}>
              <ElRow
                gutter={0}
                {...unref(getBindValue)}
                class="outline-1px outline-[var(--el-border-color-lighter)] outline-solid"
              >
                {props.schema.map((item) => {
                  return (
                    <ElCol
                      key={item.field}
                      span={item.span || 24 / props.column}
                      class="flex items-stretch"
                    >
                      {/* 水平布局 */}
                      {props.direction === 'horizontal' ? (
                        <div class="flex items-stretch bg-[var(--el-fill-color-light)] outline-1px outline-[var(--el-border-color-lighter)] outline-solid flex-1">
                          <div
                            {...getBindItemValue(item)}
                            class="w-120px text-left px-8px py-11px font-700 color-[var(--el-text-color-regular)] border-r-1px border-r-[var(--el-border-color-lighter)] border-r-solid "
                          >
                            {item.label}
                          </div>
                          <div class="flex-1 px-8px py-11px bg-[var(--el-bg-color)] color-[var(--el-text-color-primary)] text-size-14px">
                            {item.slots?.default
                              ? item.slots?.default(props.data)
                              : (get(props.data, item.field) ?? defaultData)}
                          </div>
                        </div>
                      ) : (
                        /* 垂直布局 */
                        <div class="bg-[var(--el-fill-color-light)] outline-1px outline-[var(--el-border-color-lighter)] outline-solid flex-1">
                          <div
                            {...getBindItemValue(item)}
                            class="text-left px-8px py-11px font-700 color-[var(--el-text-color-regular)] border-b-1px border-b-[var(--el-border-color-lighter)] border-b-solid"
                          >
                            {item.label}
                          </div>
                          <div class="flex-1 px-8px py-11px bg-[var(--el-bg-color)] color-[var(--el-text-color-primary)] text-size-14px">
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
/** Descriptions 组件的样式 */

/** 设置样式前缀 */
@prefix-cls: ~'@{adminNamespace}-descriptions';

/** 隐藏 Element Plus 默认的 header 样式 */
:deep(.@{elNamespace}-descriptions__header) {
  display: none !important; /** 强制隐藏 header */
}

/** Header 样式 */
.@{prefix-cls}-header {
  &__title {
    &::after {
      /** Header 标题左侧的装饰条样式 */
      position: absolute; /** 设置为绝对定位 */
      top: 3px; /** 距离顶部偏移量 */
      left: -10px; /** 距离左侧偏移量 */
      width: 4px; /** 装饰条宽度 */
      height: 70%; /** 装饰条高度 */
      background: var(--el-color-primary); /** 使用主题的主色调 */
      content: ''; /** 内容为空 */
    }
  }
}

/** Label 样式 */
:deep(.@{prefix-cls}-label) {
  /** 强制设置 label 宽度 */
  width: 150px !important;
}
</style>
