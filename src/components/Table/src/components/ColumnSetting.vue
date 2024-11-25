<script setup lang="ts">
/**
 * @file ColumnSetting.vue
 * @description 表格列设置组件，支持列的显示/隐藏、排序、固定等设置功能
 * @example
 * <ColumnSetting :columns="columns" v-model="isDrawerVisible" @confirm="onConfirm" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module components/Table/ColumnSetting
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入Element Plus组件
import {
  ElDrawer, // 抽屉组件
  ElCheckbox, // 多选框组件
  ElCheckboxGroup, // 多选框组组件
  ElText, // 文本组件
  ElRadioButton, // 单选按钮组件
  ElRadioGroup // 单选组组件
} from 'element-plus'

// 引入表格列的类型定义
import { TableColumn } from '../types'

// 引入Vue的核心功能
import { PropType, ref, watch, unref } from 'vue'

// 引入深拷贝方法
import { cloneDeep } from 'lodash-es'

// 引入默认过滤的列常量
import { DEFAULT_FILTER_COLUMN } from '@/constants'

// 引入拖拽功能组件
import { VueDraggable } from 'vue-draggable-plus'

// 定义 `modelValue` 作为双向绑定的值，控制抽屉的显示/隐藏
const modelValue = defineModel<boolean>()

// 定义组件接收的属性
const props = defineProps({
  columns: {
    type: Array as PropType<TableColumn[]>, // 接收一个表格列的数组
    default: () => [] // 默认值为空数组
  }
})

// 定义组件发出的事件
const emit = defineEmits(['confirm'])

// 存储初始列数据
const oldColumns = ref<TableColumn[]>()

// 当前可配置的列数据
const settingColumns = ref<TableColumn[]>()

// 存储被隐藏的列
const hiddenColumns = ref<TableColumn[]>([])

// 默认选中的列字段集合
const defaultCheckColumns = ref<string[]>([])

// 当前选中的列字段集合
const checkColumns = ref<string[]>([])

// 全选状态
const checkAll = ref(false)

// 半选状态
const isIndeterminate = ref(true)

// 处理全选状态改变的逻辑
const handleCheckAllChange = (val: boolean) => {
  checkColumns.value = val ? unref(defaultCheckColumns) : [] // 全选或清空选中
  isIndeterminate.value = false // 设置为非半选状态
}

// 处理选中列的变化逻辑
const handleCheckedColumnsChange = (value: string[]) => {
  const checkedCount = value.length // 当前选中的列数
  checkAll.value = checkedCount === unref(defaultCheckColumns)?.length // 判断是否全选
  isIndeterminate.value = checkedCount > 0 && checkedCount < unref(defaultCheckColumns)?.length // 判断是否半选
}

// 确定按钮点击逻辑
const confirm = () => {
  const newColumns = cloneDeep(unref(settingColumns))?.map((item) => {
    const fixed = unref(settingColumns)?.find((col) => col.field === item.field)?.fixed // 获取列的固定状态
    item.hidden = !unref(checkColumns)?.includes(item.field) // 判断列是否隐藏
    item.fixed = fixed ? fixed : undefined // 设置列的固定状态
    return item
  })
  emit('confirm', [...unref(hiddenColumns), ...(newColumns || [])]) // 发出`confirm`事件
  modelValue.value = false // 关闭抽屉
}

// 还原按钮点击逻辑
const restore = () => {
  initColumns([...unref(hiddenColumns), ...(unref(oldColumns) || [])], true) // 重置列数据
}

// 初始化列数据
const initColumns = (columns: TableColumn[], isReStore = false) => {
  const newColumns = columns?.filter((item) => {
    if (!isReStore) {
      item.fixed = item.fixed !== void 0 ? item.fixed : undefined // 处理固定状态
    }
    return (item.type && !DEFAULT_FILTER_COLUMN.includes(item.type)) || !item.type // 过滤不需要的列
  })
  if (!unref(oldColumns)?.length) {
    oldColumns.value = cloneDeep(newColumns) // 存储初始列数据
  }
  settingColumns.value = cloneDeep(newColumns) // 设置可配置列数据

  hiddenColumns.value = cloneDeep(
    columns?.filter((item) => item.type && DEFAULT_FILTER_COLUMN.includes(item.type)) // 设置隐藏列
  )

  defaultCheckColumns.value = unref(settingColumns)?.map((item) => item.field) || [] // 默认选中的列字段
  checkColumns.value =
    unref(settingColumns)
      ?.filter((item) => !item.hidden) // 获取未隐藏的列
      ?.map((item) => item.field) || [] // 获取其字段名

  if (unref(checkColumns)?.length === unref(defaultCheckColumns)?.length) {
    checkAll.value = true // 设置为全选
    isIndeterminate.value = false // 设置为非半选
  }
}

// 监听 `props.columns` 的变化，重新初始化列数据
watch(
  () => props.columns,
  (columns) => {
    initColumns(columns) // 初始化列数据
  },
  {
    immediate: true, // 立即执行
    deep: true // 深度监听
  }
)
</script>

<template>
  <!-- 抽屉组件，用于列设置 -->
  <ElDrawer v-model="modelValue" title="列设置" size="350px">
    <div>
      <!-- 全选和固定/排序设置 -->
      <div class="flex items-center justify-between">
        <!-- 左侧：全选复选框和已选数量 -->
        <div class="flex items-center justify-between">
          <!-- 全选复选框 -->
          <ElCheckbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          />
          <!-- 已选列数量 -->
          <ElText class="ml-8px!">{{ checkColumns.length }} / {{ settingColumns?.length }}</ElText>
        </div>
        <!-- 右侧：固定/排序文字 -->
        <ElText>固定 / 排序</ElText>
      </div>

      <!-- 可配置列部分 -->
      <div v-if="settingColumns?.length">
        <!-- 拖拽组件 -->
        <VueDraggable
          v-model="settingColumns"
          target=".el-checkbox-group"
          handle=".handle"
          :animation="150"
        >
          <!-- 复选框组，用于列选择 -->
          <ElCheckboxGroup
            ref="draggableWrap"
            v-model="checkColumns"
            @change="handleCheckedColumnsChange"
          >
            <!-- 遍历可配置列，生成每一项 -->
            <div
              v-for="item in settingColumns"
              :key="item.field"
              class="flex items-center justify-between mt-12px"
            >
              <!-- 列复选框 -->
              <ElCheckbox :label="item.field">
                {{ item.label }}
              </ElCheckbox>
              <!-- 列的固定位置和拖拽排序 -->
              <div class="flex items-center">
                <!-- 单选组：设置列的固定位置 -->
                <ElRadioGroup size="small" v-model="item.fixed">
                  <!-- 固定到左侧 -->
                  <ElRadioButton label="left">
                    <Icon icon="vi-ep:arrow-left" />
                  </ElRadioButton>
                  <!-- 不固定 -->
                  <ElRadioButton :label="undefined">
                    <Icon icon="vi-ep:close" />
                  </ElRadioButton>
                  <!-- 固定到右侧 -->
                  <ElRadioButton label="right">
                    <Icon icon="vi-ep:arrow-right" />
                  </ElRadioButton>
                </ElRadioGroup>

                <!-- 拖拽排序的图标 -->
                <div class="ml-12px cursor-move handle">
                  <Icon icon="vi-ep:rank" />
                </div>
              </div>
            </div>
          </ElCheckboxGroup>
        </VueDraggable>
      </div>
    </div>

    <!-- 抽屉底部操作按钮 -->
    <template #footer>
      <div>
        <!-- 还原按钮 -->
        <BaseButton @click="restore">还原</BaseButton>
        <!-- 确定按钮 -->
        <BaseButton type="primary" @click="confirm">确定</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
