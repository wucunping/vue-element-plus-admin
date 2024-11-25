<script setup lang="ts">
/**
 * @file Dialog.vue
 * @description 自定义弹窗组件，支持全屏切换和动态高度调整，适配多种场景
 * @example
 * <Dialog v-model="isDialogVisible" :fullscreen="true" maxHeight="600px">
 *   <template #title>
 *     自定义弹窗标题
 *   </template>
 *   <template #footer>
 *     <button @click="isDialogVisible = false">关闭</button>
 *   </template>
 * </Dialog>
 * @version 1.0.0
 * @date 2024-11-21
 * @module Dialog
 * @requires '@/utils/propTypes', '@/utils/is'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Element Plus 弹窗和滚动条组件
import { ElDialog, ElScrollbar } from 'element-plus'
// 引入属性类型工具
import { propTypes } from '@/utils/propTypes'
// 引入 Vue 的组合式 API
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick } from 'vue'
// 引入类型检查工具
import { isNumber } from '@/utils/is'

/** 插槽内容 */
const slots = useSlots()

/** 定义组件 Props */
const props = defineProps({
  /** 控制弹窗显示的绑定值 */
  modelValue: propTypes.bool.def(false),
  /** 弹窗标题 */
  title: propTypes.string.def('Dialog'),
  /** 是否允许全屏切换 */
  fullscreen: propTypes.bool.def(true),
  /** 弹窗最大高度 */
  maxHeight: propTypes.oneOfType([String, Number]).def('400px')
})

/** 筛选绑定属性 */
const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight'] // 排除的属性
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

/** 是否全屏状态 */
const isFullscreen = ref(false)

/** 切换全屏 */
const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen)
}

/** 弹窗内容高度 */
const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

/** 监听全屏状态变化并调整弹窗高度 */
watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight // 获取窗口高度
      dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`
    } else {
      dialogHeight.value = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight
    }
  },
  { immediate: true }
)

/** 监听最大高度变化 */
watch(
  () => props.maxHeight,
  (val) => {
    dialogHeight.value = isNumber(val) ? `${val}px` : val
  }
)

/** 动态样式 */
const dialogStyle = computed(() => ({
  height: unref(dialogHeight) // 弹窗高度
}))
</script>

<template>
  <!-- 自定义弹窗 ElDialog
   - v-bind：绑定过滤后的属性
   - :fullscreen：是否全屏
   - destroy-on-close：关闭时销毁
   - lock-scroll：禁用页面滚动
   - draggable：支持拖拽
   - top：顶部间距
   - close-on-click-modal：禁止点击遮罩关闭
   - show-close：隐藏默认关闭按钮
   - :style：弹窗高度
  -->
  <ElDialog
    v-bind="getBindValue"
    :fullscreen="isFullscreen"
    destroy-on-close
    lock-scroll
    draggable
    top="0"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <!-- 弹窗头部 -->
    <template #header="{ close }">
      <div class="flex justify-between items-center h-54px pl-15px pr-15px relative">
        <!-- 标题插槽 -->
        <slot name="title">
          {{ title }}
        </slot>
        <div
          class="h-54px flex justify-between items-center absolute top-[50%] right-15px translate-y-[-50%]"
        >
          <!-- 全屏切换按钮 -->
          <Icon
            v-if="fullscreen"
            class="cursor-pointer is-hover !h-54px mr-10px"
            :icon="
              isFullscreen ? 'vi-radix-icons:exit-full-screen' : 'vi-radix-icons:enter-full-screen'
            "
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            @click="toggleFull"
          />
          <!-- 关闭按钮 -->
          <Icon
            class="cursor-pointer is-hover !h-54px"
            icon="vi-ep:close"
            hover-color="var(--el-color-primary)"
            color="var(--el-color-info)"
            @click="close"
          />
        </div>
      </div>
    </template>

    <!-- 弹窗内容 -->
    <ElScrollbar :style="dialogStyle">
      <slot></slot>
      <!-- 默认插槽 -->
    </ElScrollbar>

    <!-- 弹窗底部 -->
    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="less">
/** Dialog 组件样式 */
.@{elNamespace}-overlay-dialog {
  display: flex; /* 弹窗内容居中显示 */
  justify-content: center;
  align-items: center;
}

.@{elNamespace}-dialog {
  margin: 0 !important; /* 移除默认边距 */

  &__header {
    height: 54px; /* 头部高度 */
    padding: 0; /* 重置内边距 */
    margin-right: 0 !important;
    border-bottom: 1px solid var(--el-border-color); /* 底部分隔线 */
  }

  &__body {
    padding: 15px !important; /* 内边距调整 */
  }

  &__footer {
    border-top: 1px solid var(--el-border-color); /* 顶部分隔线 */
  }

  &__headerbtn {
    top: 0; /* 头部按钮位置调整 */
  }
}
</style>
