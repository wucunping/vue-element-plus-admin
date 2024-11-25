<script setup lang="ts">
/**
 * @file /src/components/Logo/src/Logo.vue
 * @description Logo 组件，用于显示应用程序的 Logo 和标题
 * @example 使用方式：<Logo />
 * @version 1.0.0
 * @date 2024-11-22
 * @module LogoComponentModule
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 Vue 中引入响应式工具和生命周期钩子
import { ref, watch, computed, onMounted, unref } from 'vue'

// 引入应用程序的状态管理模块
import { useAppStore } from '@/store/modules/app'

// 引入自定义样式 Hook
import { useDesign } from '@/hooks/web/useDesign'

// 获取样式前缀函数
const { getPrefixCls } = useDesign()

// 定义样式前缀
const prefixCls = getPrefixCls('logo')

// 获取应用状态管理对象
const appStore = useAppStore()

// 定义显示状态
const show = ref(true)

// 计算属性：获取应用标题
const title = computed(() => appStore.getTitle)

// 计算属性：获取布局类型
const layout = computed(() => appStore.getLayout)

// 计算属性：获取菜单折叠状态
const collapse = computed(() => appStore.getCollapse)

// 生命周期钩子：组件挂载时执行
onMounted(() => {
  if (unref(collapse)) show.value = false // 如果菜单是折叠状态，则隐藏标题
})

// 监听折叠菜单状态的变化
watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true // 特定布局下始终显示标题
      return
    }
    show.value = !collapse // 其他布局根据折叠状态控制标题显示
  }
)

// 监听布局类型的变化
watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true // 在顶部布局或剪裁菜单布局下显示标题
    } else {
      if (unref(collapse)) {
        show.value = false // 折叠菜单时隐藏标题
      } else {
        show.value = true // 展开菜单时显示标题
      }
    }
  }
)
</script>

<template>
  <!-- 容器 -->
  <div>
    <!-- 路由链接
     - prefixCls: 样式前缀
     - layout  根据布局动态添加样式
     - Logo 样式
     - to="/" 跳转到首页
      -->
    <router-link
      :class="[
        prefixCls,
        layout !== 'classic' ? `${prefixCls}__Top` : '',
        'flex !h-[var(--logo-height)] items-center cursor-pointer pl-8px relative decoration-none overflow-hidden'
      ]"
      to="/"
    >
      <!-- Logo 图片
      - src: 图片路径
      - class: 设置图片的宽高
      -->
      <img
        src="@/assets/imgs/logo.png"
        class="w-[calc(var(--logo-height)-10px)] h-[calc(var(--logo-height)-10px)]"
      />
      <!-- 标题
      - v-if: 根据显示状态动态显示标题
      - class: 根据布局动态设置标题颜色 标题的基本样式
      -   text-[var(--logo-title-text-color)]: 经典布局下的标题颜色
      -   text-[var(--top-header-text-color)]: 顶部布局或剪裁菜单布局下的标题颜色
      -->
      <div
        v-if="show"
        :class="[
          'ml-10px text-16px font-700',
          {
            'text-[var(--logo-title-text-color)]': layout === 'classic',
            'text-[var(--top-header-text-color)]':
              layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
          }
        ]"
      >
        {{ title }}
        <!-- 显示应用标题 -->
      </div>
    </router-link>
  </div>
</template>
