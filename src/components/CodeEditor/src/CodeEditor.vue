<script setup lang="tsx">
/**
 * @file CodeEditor 组件
 * @description 基于 Monaco Editor 和 Element Plus 的代码编辑器组件，支持动态语言和主题切换
 * @example
 * <CodeEditor v-model="code" :languageSelector="true" :themeSelector="true" />
 * @version 1.0.0
 * @date 2024-11-21
 * @module CodeEditorComponent
 * @requires '@/hooks/web/useMonacoEditor'
 * @requires '@/components/CodeEditor/src/config/config'
 * @requires element-plus
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入自定义 Hook，用于操作 Monaco Editor
import { useMonacoEditor } from '@/hooks/web/useMonacoEditor'

// 引入 Vue 和 Element Plus 相关模块
import { onMounted, computed, watch, ref } from 'vue'
import { ElSelect, ElOption, ElFormItem, ElForm } from 'element-plus'

// 引入语言和主题的配置选项
import { languageOptions, themeOptions } from './config/config'

/**
 * 组件 Props 定义和默认值设置
 */
const props = withDefaults(
  defineProps<{
    width?: string | number // 编辑器宽度
    height?: string | number // 编辑器高度
    languageSelector?: boolean // 是否显示语言选择器
    language?: string // 当前语言
    themeSelector?: boolean // 是否显示主题选择器
    theme?: string // 当前主题
    editorOption?: Object // 编辑器选项
    modelValue: string // 双向绑定的代码内容
  }>(),
  {
    width: '100%',
    height: '100%',
    languageSelector: true,
    language: 'javascript',
    themeSelector: true,
    theme: 'vs-dark',
    editorOption: () => ({}),
    modelValue: ''
  }
)

/**
 * 组件 Emits 定义
 */
const emits = defineEmits<{
  (e: 'blur'): void // 编辑器失去焦点事件
  (e: 'update:modelValue', val: string): void // 双向绑定更新事件
}>()

/**
 * 动态计算编辑器样式
 */
const monacoEditorStyle = computed(() => {
  return {
    width: typeof props.width === 'string' ? props.width : props.width + 'px',
    height: typeof props.height === 'string' ? props.height : props.height + 'px'
  }
})

/**
 * 使用自定义 Hook，获取编辑器相关方法
 */
const {
  monacoEditorRef, // 编辑器 DOM 引用
  createEditor, // 创建编辑器实例
  updateVal, // 更新编辑器内容
  updateOptions, // 更新编辑器选项
  getEditor, // 获取编辑器实例
  changeLanguage, // 切换语言
  changeTheme // 切换主题
} = useMonacoEditor(props.language)

/**
 * 组件挂载时，初始化 Monaco Editor
 */
onMounted(() => {
  const monacoEditor = createEditor(props.editorOption)
  updateMonacoVal(props.modelValue)
  monacoEditor?.onDidChangeModelContent(() => {
    emits('update:modelValue', monacoEditor!.getValue()) // 监听内容变化，触发双向绑定更新
  })
  monacoEditor?.onDidBlurEditorText(() => {
    emits('blur') // 监听编辑器失去焦点事件
  })
})

/**
 * 监听 Props 变化并更新编辑器内容
 */
watch(
  () => props.modelValue,
  () => {
    updateMonacoVal(props.modelValue)
  }
)

/**
 * 语言选择逻辑
 */
const localLanguage = ref(props.language)
watch(localLanguage, (newLanguage) => {
  changeLanguage(newLanguage)
})

/**
 * 主题选择逻辑
 */
const localTheme = ref(props.theme)
watch(localTheme, (newTheme) => {
  changeTheme(newTheme)
})

/**
 * 更新编辑器内容
 * @param {string} val 编辑器的新值
 */
function updateMonacoVal(val: string) {
  if (val !== getEditor()?.getValue()) {
    updateVal(val)
  }
}

/**
 * 暴露方法
 * @method updateOptions 更新编辑器选项
 */
defineExpose({ updateOptions })
</script>

<template>
  <!-- 配置表单，用于动态选择语言和主题 -->
  <ElForm :inline="true">
    <!-- 语言选择器 -->
    <ElFormItem v-if="languageSelector" label="language" class="w-30% mb-5px!">
      <ElSelect
        v-model="localLanguage"
        placeholder="Please select language"
        size="small"
        filterable
      >
        <!-- 遍历语言选项 -->
        <ElOption
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
    </ElFormItem>
    <!-- 主题选择器 -->
    <ElFormItem v-if="themeSelector" label="theme" class="w-30% mb-5px!">
      <ElSelect v-model="localTheme" placeholder="Please select theme" size="small" filterable>
        <!-- 遍历主题选项 -->
        <ElOption
          v-for="item in themeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
    </ElFormItem>
  </ElForm>
  <!-- Monaco 编辑器容器 -->
  <div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
</template>
