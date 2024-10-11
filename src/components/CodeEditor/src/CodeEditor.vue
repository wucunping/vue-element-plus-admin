<script setup lang="tsx">
/**
 * @file CodeEditor.vue
 * @description 该文件实现了一个基于 Monaco Editor 的代码编辑器组件，支持多种编程语言和主题选择。
 * @example
 * <CodeEditor
 *   :width="'800px'"
 *   :height="'600px'"
 *   :language="'javascript'"
 *   :theme="'vs-dark'"
 *   v-model="code"
 * />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module CodeEditorComponent
 */

// 从自定义 Hook 导入 Monaco 编辑器的功能
import { useMonacoEditor } from '@/hooks/web/useMonacoEditor'
// 导入 Vue 相关的函数用于组件逻辑
import { onMounted, computed, watch, ref } from 'vue'
// 导入 Element Plus 组件
import { ElSelect, ElOption, ElFormItem, ElForm } from 'element-plus'
// 导入语言和主题的配置选项
import { languageOptions, themeOptions } from './config/config'

// 定义组件的 props
const props = withDefaults(
	defineProps<{
		width?: string | number // 编辑器宽度
		height?: string | number // 编辑器高度
		languageSelector?: boolean // 是否显示语言选择器
		language?: string // 默认语言
		themeSelector?: boolean // 是否显示主题选择器
		theme?: string // 默认主题
		editorOption?: object // 编辑器选项
		modelValue: string // 绑定的值
	}>(),
	{
		// 默认值设置
		width: '100%', // 默认宽度为100%
		height: '100%', // 默认高度为100%
		languageSelector: true, // 显示语言选择器
		language: 'javascript', // 默认语言为 JavaScript
		themeSelector: true, // 显示主题选择器
		theme: 'vs-dark', // 默认主题为暗色主题
		editorOption: () => ({}), // 默认编辑器选项
		modelValue: '' // 默认绑定值为空
	}
)

// 定义组件的事件
const emits = defineEmits<{
	(e: 'blur'): void // 当编辑器失去焦点时触发
	(e: 'update:modelValue', val: string): void // 更新绑定值的事件
}>()

// 计算编辑器的样式
const monacoEditorStyle = computed(() => {
	return {
		width: typeof props.width === 'string' ? props.width : props.width + 'px', // 计算宽度
		height: typeof props.height === 'string' ? props.height : props.height + 'px' // 计算高度
	}
})

// 使用自定义 Hook 创建 Monaco 编辑器
const {
	monacoEditorRef, // 编辑器的引用
	createEditor, // 创建编辑器的函数
	updateVal, // 更新编辑器内容的函数
	updateOptions, // 更新编辑器选项的函数
	getEditor, // 获取编辑器实例的函数
	changeLanguage, // 改变语言的函数
	changeTheme // 改变主题的函数
} = useMonacoEditor(props.language)

// 组件挂载后执行的逻辑
onMounted(() => {
	const monacoEditor = createEditor(props.editorOption) // 创建编辑器实例
	updateMonacoVal(props.modelValue) // 初始化编辑器内容
	// 监听内容变化事件
	monacoEditor?.onDidChangeModelContent(() => {
		emits('update:modelValue', monacoEditor!.getValue()) // 触发更新事件
	})
	// 监听失去焦点事件
	monacoEditor?.onDidBlurEditorText(() => {
		emits('blur') // 触发失去焦点事件
	})
})

// 监听 modelValue 变化
watch(
	() => props.modelValue,
	() => {
		updateMonacoVal(props.modelValue) // 更新编辑器内容
	}
)

// 本地语言状态
const localLanguage = ref(props.language)

// 监听语言变化
watch(localLanguage, (newLanguage) => {
	changeLanguage(newLanguage) // 改变编辑器语言
})

// 本地主题状态
const localTheme = ref(props.theme)

// 监听主题变化
watch(localTheme, (newTheme) => {
	changeTheme(newTheme) // 改变编辑器主题
})

/**
 * 更新编辑器的内容
 * @param val - 要更新的字符串值
 */
function updateMonacoVal(val: string) {
	if (val !== getEditor()?.getValue()) {
		// 检查新值是否与当前值不同
		updateVal(val) // 更新编辑器内容
	}
}

// 暴露更新选项的函数
defineExpose({ updateOptions })

/*
 <template>
  <!-- 使用 Element Plus 的表单组件 -->
  <ElForm :inline="true">
    <!-- 语言选择器 -->
    <ElFormItem v-if="languageSelector" label="language" class="w-30% mb-5px!">
      <ElSelect
        v-model="localLanguage" // 双向绑定选择的语言
        placeholder="Please select language" // 占位文本
        size="small" // 小尺寸
        filterable // 可过滤
      >
        <!-- 遍历语言选项 -->
        <ElOption
          v-for="item in languageOptions" // 循环语言选项
          :key="item.value" // 唯一键
          :label="item.label" // 选项标签
          :value="item.value" // 选项值
        />
      </ElSelect>
    </ElFormItem>
    <!-- 主题选择器 -->
    <ElFormItem v-if="themeSelector" label="theme" class="w-30% mb-5px!">
      <ElSelect v-model="localTheme" placeholder="Please select language" size="small" filterable>
        <!-- 遍历主题选项 -->
        <ElOption
          v-for="item in themeOptions" // 循环主题选项
          :key="item.value" // 唯一键
          :label="item.label" // 选项标签
          :value="item.value" // 选项值
        />
      </ElSelect>
    </ElFormItem>
  </ElForm>
  <!-- 编辑器的容器 -->
  <div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
</template> 
  */
</script>
<template>
	<ElForm :inline="true">
		<ElFormItem v-if="languageSelector" label="language" class="w-30% mb-5px!">
			<ElSelect
				v-model="localLanguage"
				placeholder="Please select language"
				size="small"
				filterable
			>
				<ElOption
					v-for="item in languageOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</ElSelect>
		</ElFormItem>
		<ElFormItem v-if="themeSelector" label="theme" class="w-30% mb-5px!">
			<ElSelect v-model="localTheme" placeholder="Please select language" size="small" filterable>
				<ElOption
					v-for="item in themeOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</ElSelect>
		</ElFormItem>
	</ElForm>
	<div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
</template>
