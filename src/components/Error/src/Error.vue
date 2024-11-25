<script setup lang="ts">
/**
 * @file Error.vue
 * @description 用于展示 404、500 和 403 三种错误页面的组件
 * @example
 * <Error type="404" @errorClick="handleErrorClick" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module Error
 * @requires '@/assets/svgs/404.svg', '@/assets/svgs/500.svg', '@/assets/svgs/403.svg', '@/utils/propTypes', '@/hooks/web/useI18n'
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入 404 错误页的图片
import pageError from '@/assets/svgs/404.svg'
// 引入 500 错误页的图片
import networkError from '@/assets/svgs/500.svg'
// 引入 403 错误页的图片
import noPermission from '@/assets/svgs/403.svg'
// 引入类型校验工具
import { propTypes } from '@/utils/propTypes'
// 引入国际化 i18n
import { useI18n } from '@/hooks/web/useI18n'

/** 定义错误类型对应的图片、消息和按钮文本的映射接口 */
interface ErrorMap {
  /** 错误类型对应的图片 URL */
  url: string
  /** 错误类型对应的提示信息 */
  message: string
  /** 错误类型对应的按钮文本 */
  buttonText: string
}

const { t } = useI18n()

/** 错误类型的配置映射 */
const errorMap: {
  [key: string]: ErrorMap
} = {
  '404': {
    url: pageError, // 404 错误对应的图片
    message: t('error.pageError'), // 404 错误对应的消息
    buttonText: t('error.returnToHome') // 404 错误对应的按钮文本
  },
  '500': {
    url: networkError, // 500 错误对应的图片
    message: t('error.networkError'), // 500 错误对应的消息
    buttonText: t('error.returnToHome') // 500 错误对应的按钮文本
  },
  '403': {
    url: noPermission, // 403 错误对应的图片
    message: t('error.noPermission'), // 403 错误对应的消息
    buttonText: t('error.returnToHome') // 403 错误对应的按钮文本
  }
}

/** 定义组件的 props 属性 */
const props = defineProps({
  /** 错误类型，可选值为 '404' | '500' | '403'，默认值为 '404' */
  type: propTypes.string.validate((v: string) => ['404', '500', '403'].includes(v)).def('404')
})

/** 定义组件的 emits 事件 */
const emit = defineEmits(['errorClick'])

/**
 * 错误按钮点击事件
 * @description 点击按钮时触发 `errorClick` 事件，并传递当前的错误类型
 */
const btnClick = () => {
  emit('errorClick', props.type)
}
</script>

<template>
  <!-- 错误页面的容器 -->
  <div class="flex justify-center">
    <!-- 错误页面内容 -->
    <div class="text-center">
      <!-- 错误页面的图片 -->
      <img width="350" :src="errorMap[type].url" alt="" />
      <!-- 错误页面的提示消息 -->
      <div class="text-14px text-[var(--el-color-info)]">{{ errorMap[type].message }}</div>
      <!-- 错误页面的按钮 -->
      <div class="mt-20px">
        <BaseButton type="primary" @click="btnClick">{{ errorMap[type].buttonText }}</BaseButton>
      </div>
    </div>
  </div>
</template>
