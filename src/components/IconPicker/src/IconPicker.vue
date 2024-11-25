<script setup lang="ts">
/**
 * @file IconPicker.vue
 * @description 图标选择器组件，支持搜索、分页、筛选和选择图标。
 * @example 使用方式：
 * <IconPicker v-model="selectedIcon" />
 * @version 1.0.0
 * @date 2024-11-19
 * @module src/components/IconPicker/src
 * @author [吴尘](https://github.com/wucunping)
 */

// 导入不同图标库的数据
import epIcons from './data/icons.ep' // Element Plus 图标库
import antIcons from './data/icons.ant-design' // Ant Design 图标库
import tIcons from './data/icons.tdesign' // TDesign 图标库

// 导入工具函数和组件
import { useDesign } from '@/hooks/web/useDesign' // 获取全局样式前缀的工具函数
import { ElInput, ElPopover, ElScrollbar, ElTabs, ElTabPane, ElPagination } from 'element-plus' // Element Plus 组件
import { useAppStore } from '@/store/modules/app' // Vuex 状态管理模块
import { computed, CSSProperties, ref, unref, watch } from 'vue' // Vue 的响应式和计算属性工具
import { nextTick } from 'vue' // Vue 的 DOM 更新工具

/**
 * 初始化图标选择器的状态
 * @param icon 可选，当前选择的图标
 */
const init = async (icon?: string) => {
  if (!icon) return
  const iconInfo = icon.split(':') // 拆分图标前缀和名称
  iconName.value = iconInfo[0] // 设置当前图标的前缀
  const wrapIndex = icons.findIndex((item) => item.prefix === iconInfo[0]) // 获取图标前缀在图标库中的索引
  // 查询当前图标的索引
  const index = filterItemIcons(icons[wrapIndex].icons).findIndex((item) => item === icon)
  // 计算当前图标所在页码
  await nextTick()
  currentPage.value = Math.ceil((index + 1) / unref(pageSize))
}

/** 绑定的 v-model 值 */
const modelValue = defineModel<string>()

/** 全局应用状态 */
const appStore = useAppStore()

/** 当前的全局组件尺寸 */
const size = computed(() => appStore.getCurrentSize)

/** 根据全局组件尺寸动态计算图标大小 */
const iconSize = computed(() => {
  return unref(size) === 'small'
    ? 'var(--el-component-size-small)' // 小尺寸
    : unref(size) === 'large'
      ? 'var(--el-component-size-large)' // 大尺寸
      : 'var(--el-component-size)' // 默认尺寸
})

/** 图标包裹样式 */
const iconWrapStyle = computed((): CSSProperties => {
  return {
    width: unref(iconSize),
    height: unref(iconSize),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset',
    position: 'relative',
    left: '-1px',
    cursor: 'pointer'
  }
})

/** 获取全局样式前缀 */
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('icon-picker') // 组件的样式前缀

/** 图标库数组 */
const icons = [epIcons, antIcons, tIcons]

/** 当前选择的图标库前缀 */
const iconName = ref(icons[0].prefix)

/** 当前选择的图标库索引 */
const currentIconNameIndex = computed(() => {
  return icons.findIndex((item) => item.prefix === unref(iconName))
})

/**
 * 切换图标库时重置当前页码为第一页
 */
const tabChange = () => {
  currentPage.value = 1
}

/** 每页显示的图标数量 */
const pageSize = ref(49)

/** 当前页码 */
const currentPage = ref(1)

/**
 * 根据当前页码和每页数量过滤图标列表
 * @param icons 图标数组
 * @returns 当前页的图标数组
 */
const filterIcons = (icons: string[]) => {
  const start = (unref(currentPage) - 1) * unref(pageSize) // 当前页的起始索引
  const end = unref(currentPage) * unref(pageSize) // 当前页的结束索引
  return icons.slice(start, end) // 返回当前页的图标
}

/**
 * 监听 `modelValue` 值的变化，并初始化图标选择器的状态
 * @param val 当前的 `modelValue` 值
 */
watch(
  () => modelValue.value,
  async (val) => {
    await nextTick() // 等待 DOM 更新完成
    val && init(val) // 如果 `modelValue` 有值，则进行初始化
  },
  {
    immediate: true // 立即执行一次监听函数
  }
)

/**
 * 弹出图标选择器时初始化状态
 */
const popoverShow = () => {
  init(unref(modelValue))
}

/**
 * 处理图标选择事件
 * @param icon 选择的图标
 */
const iconSelect = (icon: string) => {
  // 如果选择的图标与当前值相同，则清空选择
  if (icon === unref(modelValue)) {
    modelValue.value = ''
    return
  }
  // 设置选中的图标
  modelValue.value = icon
}

/** 搜索框的输入值 */
const search = ref('')

/**
 * 根据搜索关键字过滤图标
 * @param icons 图标数组
 * @returns 过滤后的图标数组
 */
const filterItemIcons = (icons: string[]) => {
  return icons.filter((item) => item.includes(unref(search))) // 根据输入内容筛选
}

/**
 * 清空搜索框时重新初始化状态
 */
const inputClear = () => {
  init(unref(modelValue))
}
</script>

<template>
  <!-- 图标选择器的外层容器 -->
  <div :class="prefixCls" class="flex justify-center items-center box">
    <!-- 输入框组件，用于显示当前选择的图标 -->
    <ElInput disabled v-model="modelValue" clearable />

    <!-- 弹出层组件，用于展示图标选择器
     - placement  弹出层位置
     - trigger    触发弹出层的方式
     - width      弹出层宽度
     - popper-style  自定义弹出层样式
     - @show      弹出层显示时触发的事件
    -->
    <ElPopover
      placement="bottom"
      trigger="click"
      :width="450"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; height: 380px;"
      @show="popoverShow"
    >
      <!-- 弹出层的触发器 -->
      <template #reference>
        <!-- 用于展示当前选中图标的容器 -->
        <div :style="iconWrapStyle">
          <!-- 如果有选中的图标，则展示 -->
          <Icon v-if="modelValue" :icon="modelValue" />
        </div>
      </template>

      <!-- 滚动条容器，用于图标列表的滚动展示 -->
      <ElScrollbar class="h-[calc(100%-50px)]!">
        <!-- 搜索输入框，用于筛选图标 
         - v-model  绑定搜索输入值
         - clearable  可清空输入
         - placeholder  输入框占位提示
         - @clear  清空输入时触发的事件
        -->
        <ElInput
          v-model="search"
          class="mb-20px"
          clearable
          placeholder="搜索图标"
          @clear="inputClear"
        />

        <!-- 标签页组件，用于切换图标分类 -->
        <ElTabs tab-position="left" v-model="iconName" @tab-change="tabChange">
          <!-- 动态生成每个分类的标签页 -->
          <ElTabPane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix">
            <!-- 图标网格容器 -->
            <div class="flex flex-wrap box-border">
              <!-- 动态生成分类中的图标 
               - v-for  遍历图标数组,筛选后的图标列表
               - :key  给图标设置唯一标识
               - :style  设置图标样式
               - :class  设置图标样式类 鼠标悬停效果
               - @click  点击图标选择事件
              -->
              <div
                v-for="icon in filterIcons(filterItemIcons(item.icons))"
                :key="icon"
                :style="{
                  width: iconSize,
                  height: iconSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: `1px solid ${
                    icon === modelValue ? 'var(--el-color-primary)' : 'var(--el-border-color)'
                  }`,
                  boxSizing: 'border-box',
                  margin: '2px',
                  transition: 'all 0.3s'
                }"
                class="hover:border-color-[var(--el-color-primary)]!"
                @click="iconSelect(icon)"
              >
                <!-- 图标组件 
                - :icon  图标名称,选中时改变颜色
                - :color  图标颜色
                -->
                <Icon
                  :icon="icon"
                  :color="icon === modelValue ? 'var(--el-color-primary)' : 'inherit'"
                />
              </div>
            </div>
          </ElTabPane>
        </ElTabs>
      </ElScrollbar>

      <!-- 分页组件 -->
      <div
        class="h-50px absolute bottom-0 left-0 flex items-center pl-[var(--el-popover-padding)] pr-[var(--el-popover-padding)]"
      >
        <!-- 页码组件 
        - v-model:current-page  绑定当前页码
        - v-model:page-size  绑定每页图标数量
        - :pager-count  显示的页码按钮数
        - small  小型分页样式
        - :page-sizes  可选的每页数量
        - layout  分页布局
        - :total  总图标数量
        -->
        <ElPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :pager-count="5"
          small
          :page-sizes="[100, 200, 300, 400]"
          layout="total, prev, pager, next, jumper"
          :total="filterItemIcons(icons[currentIconNameIndex].icons).length"
        />
      </div>
    </ElPopover>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-icon-picker'; // 定义图标选择器的样式前缀，基于命名空间

.@{prefix-cls} {
  // 定义图标选择器的样式规则
  :deep(.@{elNamespace}-input__wrapper) {
    // 通过 `:deep` 作用于 `Element Plus` 中的输入框包装器，确保 scoped 样式可以应用到子组件
    border-top-right-radius: 0; // 去除输入框右上角的圆角
    border-bottom-right-radius: 0; // 去除输入框右下角的圆角
  }
}
</style>
