<script setup lang="ts">
/**
 * @file Editor.vue
 * @description 富文本编辑器组件，基于 @wangeditor/editor-for-vue
 * @example
 * <Editor v-model="content" :height="400" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module Editor
 * @requires @wangeditor/editor, vue, element-plus
 * @author [吴尘](https://github.com/wucunping)
 * 改过原代码，可能会有问题。
 */

// Vue 组合式 API
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef } from 'vue'
// WangEditor 组件及类型
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor, IEditorConfig, i18nChangeLanguage } from '@wangeditor/editor'
// 工具函数
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
// Element Plus 提示消息
import { ElMessage } from 'element-plus'
// 多语言模块
import { useLocaleStore } from '@/store/modules/locale'

/** 获取当前语言设置 */
const localeStore = useLocaleStore()
const currentLocale = computed(() => localeStore.getCurrentLocale)
/** 根据当前语言设置 WangEditor 的语言 */
i18nChangeLanguage(unref(currentLocale).lang)

/** 定义组件属性 */
const props = defineProps({
  /** 编辑器 ID */
  editorId: propTypes.string.def('wangeEditor-1'),
  /** 编辑器高度 */
  height: propTypes.oneOfType([Number, String]).def('500px'),
  /** 编辑器配置 */
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined
  },
  /** v-model 绑定的内容 */
  modelValue: propTypes.string.def('')
})

/** 定义组件事件 */
const emit = defineEmits(['change', 'update:modelValue'])

/** 编辑器实例 */
const editorRef = shallowRef<IDomEditor>()

/** 富文本内容 */
const valueHtml = ref('')

/** 同步 props.modelValue 的变化到 valueHtml */
watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  }
)

/** 监听 valueHtml 的变化，触发 v-model 的 update */
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

/** WangEditor 创建完成的回调 */
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
  valueHtml.value = props.modelValue
}

/** 计算编辑器的配置 */
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: true
    },
    props.editorConfig || {}
  )
})

/** 计算编辑器样式 */
const editorStyle = computed(() => {
  const width = '100%'
  const height = isNumber(props.height) ? `${props.height}px` : props.height

  return {
    width,
    height
  }
})

/** WangEditor 内容变化的回调 */
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

/** 组件销毁时，销毁编辑器实例 */
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)
  editor?.destroy()
})

/** 获取编辑器实例的引用 */
const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

/** 公开方法 */
defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--el-border-color)] z-10">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :editorId="editorId"
      class="border-0 b-b-1 border-solid border-[var(--el-border-color)]"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
