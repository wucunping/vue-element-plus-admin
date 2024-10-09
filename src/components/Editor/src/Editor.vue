<script setup lang="ts">
/**
 * @file Editor.vue
 * @description 这是一个基于 Vue 3 和 WangEditor 的富文本编辑器组件，支持基本的编辑功能和配置。
 * @example <Editor editorId="myEditor" height="600px" v-model="editorContent" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-08
 * @module Editor
 */

//从 Vue 中导入所需的函数和类型
import type { PropType } from 'vue'
import { onBeforeUnmount, computed, unref, nextTick, ref, watch, shallowRef } from 'vue'

//从 wangeditor 的 Vue 组件库中导入编辑器和工具栏
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

//从 wangeditor 中导入必要的类型和语言切换函数
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor'
import { i18nChangeLanguage } from '@wangeditor/editor'

// 导入属性类型工具
import { propTypes } from '@/utils/propTypes'

// 导入判断是否为数字的工具
import { isNumber } from '@/utils/is'

// 导入 Element Plus 提供的消息提示组件
import { ElMessage } from 'element-plus'

// 导入 localeStore 模块
import { useLocaleStore } from '@/store/modules/locale'

/**
 * 获取语言存储
 */
const localeStore = useLocaleStore()

/**
 * 定义当前语言的计算属性
 */
const currentLocale = computed(() => localeStore.getCurrentLocale)

// 切换语言
i18nChangeLanguage(unref(currentLocale).lang)

/**
 * 定义组件的 props 属性
 */
const props = defineProps({
	editorId: propTypes.string.def('wangeEditor-1'), // 编辑器 ID，默认值为 'wangeEditor-1'
	height: propTypes.oneOfType([Number, String]).def('500px'), // 编辑器高度，支持数字和字符串类型，默认值为 '500px'
	editorConfig: {
		// 编辑器配置
		type: Object as PropType<IEditorConfig>,
		default: () => undefined // 默认值为 undefined
	},
	modelValue: propTypes.string.def('') // 双向绑定的值，默认值为空字符串
})

/**
 * 定义组件的事件
 */
const emit = defineEmits(['change', 'update:modelValue'])

/**
 * 定义编辑器实例，使用 shallowRef 包裹
 */
const editorRef = shallowRef<IDomEditor>()

/**
 * 定义 HTML 内容的 ref 引用
 */
const valueHtml = ref('')

watch(
	() => props.modelValue, // 监视 modelValue 的变化
	(val: string) => {
		// 当 modelValue 改变时执行
		if (val === unref(valueHtml)) return // 如果两个值相等则返回
		valueHtml.value = val // 更新 valueHtml 的值
	}
)

// 监听 valueHtml 的变化
watch(
	() => valueHtml.value,
	(val: string) => {
		// 当 valueHtml 改变时执行
		emit('update:modelValue', val) // 触发更新事件
	}
)

/**
 * 处理编辑器创建后的回调
 * @param editor 编辑器实例
 */
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor // 将编辑器实例赋值给 editorRef
	valueHtml.value = props.modelValue // 初始化 HTML 内容
}

/**
 * 定义编辑器的配置
 */
const editorConfig = computed((): IEditorConfig => {
	return Object.assign(
		{
			readOnly: false, // 是否只读
			customAlert: (s: string, t: string) => {
				// 自定义提示方法
				switch (t) {
					case 'success':
						ElMessage.success(s) // 成功提示
						break
					case 'info':
						ElMessage.info(s) // 信息提示
						break
					case 'warning':
						ElMessage.warning(s) // 警告提示
						break
					case 'error':
						ElMessage.error(s) // 错误提示
						break
					default:
						ElMessage.info(s) // 默认信息提示
						break
				}
			},
			autoFocus: false, // 是否自动聚焦
			scroll: true, // 是否允许滚动
			uploadImgShowBase64: true // 上传图片时是否显示 base64
		},
		props.editorConfig || {} // 合并用户自定义的配置
	)
})

/**
 * 计算编辑器的样式
 */
const editorStyle = computed(() => {
	return {
		height: isNumber(props.height) ? `${props.height}px` : props.height // 确定高度样式
	}
})

/**
 * 处理编辑器内容变化的回调
 * @param editor 编辑器实例
 */
const handleChange = (editor: IDomEditor) => {
	emit('change', editor) // 触发 change 事件
}

// 组件销毁前的清理操作
onBeforeUnmount(() => {
	const editor = unref(editorRef.value) // 获取编辑器实例

	// 销毁编辑器并移除其引用
	editor?.destroy()
})

/**
 * 获取编辑器引用
 * @returns 编辑器实例
 */
const getEditorRef = async (): Promise<IDomEditor> => {
	await nextTick() // 等待下一个 DOM 更新周期
	return unref(editorRef.value) as IDomEditor // 返回编辑器实例
}

/**
 * 暴露组件的方法
 */
defineExpose({
	getEditorRef
})

/*
<template>
  <div class="border-1 border-solid border-[var(--el-border-color)] z-10">
    <!-- 工具栏组件 -->
    <Toolbar
      :editor="editorRef" // 绑定编辑器引用
      :editorId="editorId" // 传递编辑器 ID
      class="border-0 b-b-1 border-solid border-[var(--el-border-color)]" // 工具栏样式
    />
    <!-- 编辑器组件 -->
    <Editor
      v-model="valueHtml" // 双向绑定编辑器内容
      :editorId="editorId" // 传递编辑器 ID
      :defaultConfig="editorConfig" // 传递编辑器配置
      :style="editorStyle" // 传递编辑器样式
      @on-change="handleChange" // 监听编辑器内容变化
      @on-created="handleCreated" // 监听编辑器创建
    />
  </div>
</template>
*/
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

<!-- 引入 wangeditor 的样式 -->
<style src="@wangeditor/editor/dist/css/style.css"></style>
