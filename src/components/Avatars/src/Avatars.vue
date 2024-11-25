<script setup lang="ts">
/**
 * @file Avatars.vue
 * @description 头像组件，用于展示用户头像列表，支持工具提示显示用户名
 * @example 在Vue组件中引入并使用<Avatars :data="userList" :max="5" />
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-21
 * @module /src/components/Avatars/src/Avatars.vue
 */

// 导入Element Plus组件和Vue的PropType、computed
import { ComponentSize, ElAvatar, ElTooltip } from 'element-plus'
import { PropType, computed } from 'vue'
// 导入AvatarItem类型定义
import { AvatarItem } from './types'
// 导入useDesign钩子，并获取getPrefixCls函数
import { useDesign } from '@/hooks/web/useDesign'

/** 获取组件的前缀类名 */
const { getPrefixCls } = useDesign()

/** 获取组件的前缀类名 */
const prefixCls = getPrefixCls('avatars')

/** 定义组件的props */
const props = defineProps({
  size: {
    type: [String, Number] as PropType<ComponentSize | number>,
    default: ''
  },
  max: {
    type: Number,
    default: 5
  },
  data: {
    type: Array as PropType<AvatarItem[]>,
    default: () => []
  },
  showTooltip: {
    type: Boolean,
    default: true
  }
})

/** 计算属性，用于筛选出不超过最大数量的头像数据 */
const filterData = computed(() => props.data.slice(0, props.max))
</script>

<template>
  <!-- 容器div，使用prefixCls类名，并设置为flex布局，子项居中 -->
  <div :class="prefixCls" class="flex items-center">
    <!-- 循环渲染头像列表 -->
    <template v-for="item in filterData" :key="item.url">
      <!-- 如果showTooltip为true且item有名称，则使用ElTooltip组件包裹ElAvatar，并显示名称 -->
      <template v-if="showTooltip && item.name">
        <ElTooltip :content="item.name" placement="top">
          <ElAvatar
            :size="size"
            :src="item.url"
            class="relative"
            :style="{ zIndex: filterData.indexOf(item) }"
          />
        </ElTooltip>
      </template>
      <!-- 如果不需要tooltip或者item没有名称，直接渲染ElAvatar -->
      <template v-else>
        <ElAvatar
          :size="size"
          :src="item.url"
          class="relative"
          :style="{ zIndex: filterData.indexOf(item) }"
        />
      </template>
    </template>

    <!-- 如果头像数量超过max，则渲染一个额外的ElAvatar显示剩余数量 -->
    <ElAvatar v-if="data.length > max" :style="{ zIndex: data.length }">
      <span>+{{ data.length - max }}</span>
    </ElAvatar>
  </div>
</template>

<style scoped lang="less">
/** 定义前缀类名变量 */
@prefix-cls: ~'@{adminNamespace}-avatars';

/** 设置头像组件的样式 */
.@{prefix-cls} {
  /** 设置连续头像之间的间距 */
  .@{elNamespace}-avatar + .@{elNamespace}-avatar {
    margin-left: -15px;
  }
}
</style>
