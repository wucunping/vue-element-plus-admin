<script setup lang="ts">
/**
 * @file LockDialog.vue
 * @description 锁定对话框组件，用于用户锁定应用程序
 * @example <LockDialog :modelValue="isLockVisible" @update:modelValue="isLockVisible = $event" />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module LockDialog
 */

/** 导入国际化钩子 */
import { useI18n } from '@/hooks/web/useI18n'
/** 导入响应式引用 */
import { ref } from 'vue'
/** 导入对话框组件 */
import { Dialog } from '@/components/Dialog'
/** 导入表单组件 */
import { Form } from '@/components/Form'
/** 导入表单钩子 */
import { useForm } from '@/hooks/web/useForm'
/** 导入响应式、计算属性 */
import { reactive, computed } from 'vue'
/** 导入验证器钩子 */
import { useValidator } from '@/hooks/web/useValidator'
/** 导入表单架构类型 */
import type { FormSchema } from '@/components/Form'
/** 导入设计钩子 */
import { useDesign } from '@/hooks/web/useDesign'
/** 导入锁定状态的状态管理 */
import { useLockStore } from '@/store/modules/lock'

/** 获取设计前缀的函数 */
const { getPrefixCls } = useDesign()
/** 定义用于样式的前缀类 */
const prefixCls = getPrefixCls('lock-dialog')

/** 获取必填验证的函数 */
const { required } = useValidator()

/** 获取国际化翻译函数 */
const { t } = useI18n()

/** 获取锁定状态管理的实例 */
const lockStore = useLockStore()

/** 定义组件的props */
const props = defineProps({
	modelValue: {
		type: Boolean
	}
})

/** 事件发射函数 */
const emit = defineEmits(['update:modelValue'])

/** 计算属性：对话框可见性 */
const dialogVisible = computed({
	get: () => props.modelValue, // 当获取时，返回modelValue的值
	set: (val) => {
		// 当设置时，发射更新事件
		console.log('set: ', val)
		emit('update:modelValue', val)
	}
})

/** 定义对话框标题 */
const dialogTitle = ref(t('lock.lockScreen'))

/** 定义表单验证规则 */
const rules = reactive({
	password: [required()] // 密码字段为必填
})

/** 定义表单架构 */
const schema: FormSchema[] = reactive([
	{
		label: t('lock.lockPassword'), // 表单标签
		field: 'password', // 表单字段名称
		component: 'Input', // 使用的组件
		componentProps: {
			// 组件的属性
			type: 'password', // 输入类型为密码
			showPassword: true // 显示密码按钮
		}
	}
])

/** 使用表单钩子获取表单注册和方法 */
const { formRegister, formMethods } = useForm()

/** 解构获取表单数据和暴露接口 */
const { getFormData, getElFormExpose } = formMethods

/** 处理锁定操作的异步方法 */
const handleLock = async () => {
	const formExpose = await getElFormExpose() // 获取表单的暴露接口
	formExpose?.validate(async (valid) => {
		// 验证表单
		if (valid) {
			// 如果验证通过
			dialogVisible.value = false // 关闭对话框
			const formData = await getFormData() // 获取表单数据
			lockStore.setLockInfo({
				// 更新锁定状态
				isLock: true,
				...formData // 添加表单数据
			})
		}
	})
}

/*
<template>
	<Dialog
		v-model="dialogVisible"  // 控制对话框的可见性
		width="500px"  // 设置对话框的宽度
		max-height="170px"  // 设置对话框的最大高度
		:class="prefixCls"  // 添加样式类
		:title="dialogTitle"  // 设置对话框标题
	>
		<div class="flex flex-col items-center">  // 对齐方式为垂直居中
			<img src="@/assets/imgs/avatar.jpg" alt="" class="w-70px h-70px rounded-[50%]" />  // 用户头像
			<span class="text-14px my-10px text-[var(--top-header-text-color)]">Archer</span>  // 用户名
		</div>
		<Form :is-col="false" :schema="schema" :rules="rules" @register="formRegister" />  // 表单组件
		<template #footer>
			<BaseButton type="primary" @click="handleLock">{{ t('lock.lock') }}</BaseButton>  // 锁定按钮
		</template>
	</Dialog>
</template>
*/
</script>

<template>
	<Dialog
		v-model="dialogVisible"
		width="500px"
		max-height="170px"
		:class="prefixCls"
		:title="dialogTitle"
	>
		<div class="flex flex-col items-center">
			<img src="@/assets/imgs/avatar.jpg" alt="" class="w-70px h-70px rounded-[50%]" />
			<span class="text-14px my-10px text-[var(--top-header-text-color)]">Archer</span>
		</div>
		<Form :is-col="false" :schema="schema" :rules="rules" @register="formRegister" />
		<template #footer>
			<BaseButton type="primary" @click="handleLock">{{ t('lock.lock') }}</BaseButton>
		</template>
	</Dialog>
</template>

<style lang="less" scoped>
:global(.v-lock-dialog) {
	// 全局样式
	@media (width <= 767px) {
		// 媒体查询：当宽度小于等于767px
		max-width: calc(100vw - 16px); // 最大宽度设置为视口宽度减去16px
	}
}
</style>
