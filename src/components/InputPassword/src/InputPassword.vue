<script setup lang="ts">
/**
 * @file /src/components/InputPassword/src/InputPassword.vue
 * @description 一个带密码强度提示的输入框组件
 * @example 使用方式：<InputPassword v-model="password" :strength="true" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module InputPassword
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 Vue 的响应式工具
import { ref, unref, computed, watch } from 'vue' // Vue 的核心工具
// 引入 Element Plus 的输入框组件
import { ElInput } from 'element-plus' // Element Plus 的 ElInput 组件
// 引入 propTypes 工具，用于定义组件的属性类型
import { propTypes } from '@/utils/propTypes' // propTypes 工具
// 引入全局配置 hook
import { useConfigGlobal } from '@/hooks/web/useConfigGlobal' // 获取全局配置的自定义 hook
// 引入密码强度计算工具
import { zxcvbn } from '@zxcvbn-ts/core' // 密码强度库
import type { ZxcvbnResult } from '@zxcvbn-ts/core' // 密码强度的类型定义
// 引入组件设计工具
import { useDesign } from '@/hooks/web/useDesign' // 用于获取样式前缀的自定义 hook

// 获取组件样式前缀函数
const { getPrefixCls } = useDesign()

// 定义组件样式的前缀
const prefixCls = getPrefixCls('input-password')

// 定义组件的属性
const props = defineProps({
  /** 是否显示密码强度 */
  strength: propTypes.bool.def(false),
  /** 绑定的输入值 */
  modelValue: propTypes.string.def('')
})

// 监听 modelValue 属性的变化
watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueRef)) return // 如果值没有改变则返回
    valueRef.value = val // 更新 valueRef 的值
  }
)

// 获取全局配置
const { configGlobal } = useConfigGlobal()

// 定义事件的触发器
const emit = defineEmits(['update:modelValue'])

// 设置输入框类型为 password 或 text
const textType = ref<'password' | 'text'>('password')

// 定义输入框的绑定值
const valueRef = ref(props.modelValue)

// 监听输入框值的变化
watch(
  () => valueRef.value,
  (val: string) => {
    emit('update:modelValue', val) // 触发父组件更新事件
  }
)

// 计算密码强度
const getPasswordStrength = computed(() => {
  const value = unref(valueRef) // 获取输入框的值
  const zxcvbnRef = zxcvbn(unref(valueRef)) as ZxcvbnResult // 计算密码强度
  return value ? zxcvbnRef.score : -1 // 如果有值返回强度分数，否则返回 -1
})
</script>

<template>
  <!-- 组件容器 -->
  <div :class="[prefixCls, `${prefixCls}--${configGlobal?.size}`]">
    <!-- 输入框 -->
    <ElInput v-bind="$attrs" v-model="valueRef" showPassword :type="textType" />
    <!-- 密码强度条 -->
    <div
      v-if="strength"
      :class="`${prefixCls}__bar`"
      class="relative h-6px mt-10px mb-6px mr-auto ml-auto"
    >
      <!-- 密码强度填充条 -->
      <div :class="`${prefixCls}__bar--fill`" :data-score="getPasswordStrength"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
/**
 * @description 定义组件样式
 */

// 组件的样式前缀变量
@prefix-cls: ~'@{adminNamespace}-input-password';

// 组件的基础样式
.@{prefix-cls} {
  :deep(.@{elNamespace}-input__clear) {
    margin-left: 5px; // 输入框清除按钮的边距
  }

  &__bar {
    background-color: var(--el-text-color-disabled); // 密码强度条背景色
    border-radius: var(--el-border-radius-base); // 边框圆角

    &::before,
    &::after {
      position: absolute;
      z-index: 10;
      display: block;
      width: 20%;
      height: inherit;
      background-color: transparent;
      border-color: var(--el-color-white);
      border-style: solid;
      border-width: 0 5px;
      content: '';
    }

    &::before {
      left: 20%; // 前置样式位置
    }

    &::after {
      right: 20%; // 后置样式位置
    }

    &--fill {
      position: absolute;
      width: 0;
      height: inherit;
      background-color: transparent;
      border-radius: inherit;
      transition:
        width 0.5s ease-in-out,
        background 0.25s; // 动画效果

      &[data-score='0'] {
        width: 20%;
        background-color: var(--el-color-danger); // 弱密码背景色
      }

      &[data-score='1'] {
        width: 40%;
        background-color: var(--el-color-danger); // 较弱密码背景色
      }

      &[data-score='2'] {
        width: 60%;
        background-color: var(--el-color-warning); // 中等密码背景色
      }

      &[data-score='3'] {
        width: 80%;
        background-color: var(--el-color-success); // 强密码背景色
      }

      &[data-score='4'] {
        width: 100%;
        background-color: var(--el-color-success); // 非常强密码背景色
      }
    }
  }

  &--mini > &__bar {
    border-radius: var(--el-border-radius-small); // 小尺寸样式
  }
}
</style>
