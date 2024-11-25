<script setup lang="ts">
/**
 * @file LayoutRadioPicker.vue
 * @description 用于切换布局的单选按钮组件，支持经典布局、顶部布局等多种模式。
 * @example 使用 <LayoutRadioPicker /> 组件实现布局选择功能。
 * @version 1.0.0
 * @date 2024-11-22
 * @module components/Setting/src/components/LayoutRadioPicker.vue
 * @author [吴尘](https://github.com/wucunping)
 */

/** 导入应用状态管理模块 */
import { useAppStore } from '@/store/modules/app'
/** 导入 Vue 的计算属性模块 */
import { computed } from 'vue'
/** 导入自定义设计相关模块 */
import { useDesign } from '@/hooks/web/useDesign'

/** 获取布局单选组件的样式前缀 */
const { getPrefixCls } = useDesign()
/** 定义组件的样式前缀 */
const prefixCls = getPrefixCls('layout-radio-picker')

/** 获取全局应用状态 */
const appStore = useAppStore()

/** 当前布局模式 */
const layout = computed(() => appStore.getLayout)
</script>

<template>
  <!-- 布局选择器容器 -->
  <div :class="prefixCls" class="flex flex-wrap space-x-14px">
    <!-- 经典布局按钮 -->
    <!-- 样式包含：经典布局、宽56px、高48px、灰色背景、激活状态样式 -->
    <!-- 点击事件：切换为经典布局 -->
    <div
      :class="[
        `${prefixCls}__classic`,
        'relative w-56px h-48px cursor-pointer bg-gray-300',
        {
          'is-acitve': layout === 'classic'
        }
      ]"
      @click="appStore.setLayout('classic')"
    ></div>

    <!-- 顶部-左侧布局按钮 -->
    <!-- 样式包含：顶部-左侧布局、宽56px、高48px、灰色背景、激活状态样式 -->
    <!-- 点击事件：切换为顶部-左侧布局 -->
    <div
      :class="[
        `${prefixCls}__top-left`,
        'relative w-56px h-48px cursor-pointer bg-gray-300',
        {
          'is-acitve': layout === 'topLeft'
        }
      ]"
      @click="appStore.setLayout('topLeft')"
    ></div>

    <!-- 顶部布局按钮 -->
    <!-- 样式包含：顶部布局、宽56px、高48px、灰色背景、激活状态样式 -->
    <!-- 点击事件：切换为顶部布局 -->
    <div
      :class="[
        `${prefixCls}__top`,
        'relative w-56px h-48px cursor-pointer bg-gray-300',
        {
          'is-acitve': layout === 'top'
        }
      ]"
      @click="appStore.setLayout('top')"
    ></div>

    <!-- 切换菜单布局按钮 -->
    <!-- 样式包含：切换菜单布局、宽56px、高48px、灰色背景、激活状态样式 -->
    <!-- 点击事件：切换为切换菜单布局 -->
    <div
      :class="[
        `${prefixCls}__cut-menu`,
        'relative w-56px h-48px cursor-pointer bg-gray-300',
        {
          'is-acitve': layout === 'cutMenu'
        }
      ]"
      @click="appStore.setLayout('cutMenu')"
    >
      <!-- 嵌套的灰色分隔栏 -->
      <!-- 分隔栏宽度占33%，背景为浅灰色 -->
      <div class="absolute h-full w-[33%] top-0 left-[10%] bg-gray-200"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
/** 布局单选组件样式前缀 */
@prefix-cls: ~'@{adminNamespace}-layout-radio-picker';

/** 主样式容器 */
.@{prefix-cls} {
  /** 经典布局按钮样式 */
  &__classic {
    border: 2px solid #e5e7eb; // 边框样式
    border-radius: 4px; // 圆角样式

    /** 布局内部的左侧深色区域 */
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 33%;
      height: 100%;
      background-color: #273352;
      border-radius: 4px 0 0 4px;
      content: '';
    }

    /** 布局内部的顶部浅色区域 */
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background-color: #fff;
      border-radius: 4px 4px 0 0;
      content: '';
    }
  }

  /** 顶部-左侧布局按钮样式 */
  &__top-left {
    border: 2px solid #e5e7eb; // 边框样式
    border-radius: 4px; // 圆角样式

    /** 顶部深色区域 */
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }

    /** 左侧浅色区域 */
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      content: '';
    }
  }

  /** 顶部布局按钮样式 */
  &__top {
    border: 2px solid #e5e7eb; // 边框样式
    border-radius: 4px; // 圆角样式

    /** 顶部深色区域 */
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }
  }

  /** 切换菜单布局按钮样式 */
  &__cut-menu {
    border: 2px solid #e5e7eb; // 边框样式
    border-radius: 4px; // 圆角样式

    /** 顶部深色区域 */
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }

    /** 左侧浅色区域 */
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 10%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      content: '';
    }
  }

  /** 激活状态样式 */
  .is-acitve {
    border-color: var(--el-color-primary); // 激活状态边框颜色
  }
}
</style>
