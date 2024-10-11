<script lang="ts" setup>
/**
 * @file LockPage.vue
 * @description 锁屏页面组件，提供解锁和返回登录功能
 * @example <LockPage />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module LockPage
 */

// 引入 Vue 的 ref 方法
import { ref } from 'vue'

// 引入 Element Plus 中的 ElInput 组件
import { ElInput } from 'element-plus'

// 引入路由重置方法
import { resetRouter } from '@/router'

// 引入 Vue Router 中的 useRouter
import { useRouter } from 'vue-router'

// 引入存储操作的 Hook
import { useStorage } from '@/hooks/web/useStorage'

// 引入锁屏状态管理
import { useLockStore } from '@/store/modules/lock'

// 引入国际化方法
import { useI18n } from '@/hooks/web/useI18n'

// 引入当前时间的 Hook
import { useNow } from '@/hooks/web/useNow'

// 引入设计相关的设置
import { useDesign } from '@/hooks/web/useDesign'

// 引入图标组件
import { Icon } from '@/components/Icon'

// 引入注销登录的 API
import { loginOutApi } from '@/api/login'

// 引入标签视图状态管理
import { useTagsViewStore } from '@/store/modules/tagsView'

// 初始化标签视图状态
const tagsViewStore = useTagsViewStore()

// 从本地存储中获取清除方法
const { clear } = useStorage()

// 获取路由替换方法
const { replace } = useRouter()

// 定义密码状态
const password = ref('')

// 定义加载状态
const loading = ref(false)

// 定义错误信息状态
const errMsg = ref(false)

// 定义日期显示状态
const showDate = ref(true)

// 获取设计前缀类名的方法
const { getPrefixCls } = useDesign()

// 获取锁屏页面前缀类名
const prefixCls = getPrefixCls('lock-page')

// 初始化锁屏状态管理
const lockStore = useLockStore()

// 获取当前时间信息
const { hour, month, minute, meridiem, year, day, week } = useNow(true)

// 获取国际化方法
const { t } = useI18n()

/**
 * 解锁函数
 * @async
 * @function unLock
 * @returns {Promise<void>}
 */
async function unLock() {
	// 如果密码为空，则返回
	if (!password.value) {
		return
	}
	// 获取当前输入的密码
	const pwd = password.value
	try {
		// 设置加载状态为 true
		loading.value = true
		// 调用锁屏状态管理中的解锁方法
		const res = await lockStore.unLock(pwd)
		// 设置错误信息状态
		errMsg.value = !res
	} finally {
		// 设置加载状态为 false
		loading.value = false
	}
}

/**
 * 返回登录函数
 * @async
 * @function goLogin
 * @returns {Promise<void>}
 */
async function goLogin() {
	// 调用注销登录 API
	const res = await loginOutApi().catch(() => {})
	if (res) {
		// 清除本地存储
		clear()
		// 删除所有标签视图
		tagsViewStore.delAllViews()
		// 重置静态路由表
		resetRouter()
		// 重置锁屏信息
		lockStore.resetLockInfo()
		// 跳转到登录页面
		replace('/login')
	}
}

/**
 * 显示表单处理函数
 * @function handleShowForm
 * @param {boolean} show - 是否显示表单
 */
function handleShowForm(show = false) {
	// 设置日期显示状态
	showDate.value = show
}

/*
<template>
	<!-- 根 div 元素，使用响应式设计类 -->
	<div
		:class="prefixCls"  <!-- 绑定前缀类 -->
		class="fixed inset-0 flex h-screen w-screen bg-black items-center justify-center"  <!-- 固定定位，实现全屏布局 -->
	>
		<!-- 解锁按钮区域 -->
		<div
			:class="`${prefixCls}__unlock`"  <!-- 动态绑定解锁按钮的类名 -->
			class="absolute top-0 left-1/2 flex pt-5 h-16 items-center justify-center sm:text-md xl:text-xl text-white flex-col cursor-pointer transform translate-x-1/2"  <!-- 配置解锁按钮的样式 -->
			@click="handleShowForm(false)"  <!-- 点击按钮时调用 handleShowForm 函数并传入 false -->
			v-show="showDate"  <!-- 当 showDate 为 true 时显示该元素 -->
		>
			<Icon icon="vi-ep:lock" />  <!-- 解锁图标 -->
			<span>{{ t('lock.unlock') }}</span>  <!-- 解锁文字 -->
		</div>

		<!-- 中间的时钟区域 -->
		<div class="flex w-screen h-screen justify-center items-center">
			<!-- 时钟小时部分 -->
			<div :class="`${prefixCls}__hour`" class="relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5">
				<span>{{ hour }}</span>  <!-- 显示小时 -->
				<span class="meridiem absolute left-5 top-5 text-md xl:text-xl" v-show="showDate">
					{{ meridiem }}  <!-- 显示上午/下午标记 -->
				</span>
			</div>
			<!-- 时钟分钟部分 -->
			<div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
				<span> {{ minute }}</span>  <!-- 显示分钟 -->
			</div>
		</div>
		<!-- 过渡效果容器 -->
		<transition name="fade-slide">
			<!-- 解锁输入区域 -->
			<div :class="`${prefixCls}-entry`" v-show="!showDate">  <!-- 当 showDate 为 false 时显示该元素 -->
				<div :class="`${prefixCls}-entry-content`">
					<div class="flex flex-col items-center">
						<img src="@/assets/imgs/avatar.jpg" alt="" class="w-70px h-70px rounded-[50%]" />  <!-- 用户头像 -->
						<span class="text-14px my-10px text-[var(--logo-title-text-color)]">Archer</span>  <!-- 用户名 -->
					</div>
					<!-- 密码输入框 -->
					<ElInput
						type="password"
						:placeholder="t('lock.placeholder')"  <!-- 使用国际化文本作为占位符 -->
						class="enter-x"
						v-model="password"  <!-- 双向绑定密码输入 -->
					/>
					<!-- 错误信息 -->
					<span :class="`text-14px ${prefixCls}-entry__err-msg enter-x`" v-if="errMsg">
						{{ t('lock.message') }}  <!-- 显示错误信息 -->
					</span>
					<!-- 按钮区域 -->
					<div :class="`${prefixCls}-entry__footer enter-x`">
						<BaseButton
							type="primary"
							size="small"
							class="mt-2 mr-2 enter-x"
							link
							:disabled="loading"  <!-- 当 loading 为 true 时禁用按钮 -->
							@click="handleShowForm(true)"  <!-- 点击返回按钮时调用 handleShowForm 函数，传入 true -->
						>
							{{ t('common.back') }}  <!-- 返回文字 -->
						</BaseButton>
						<BaseButton
							type="primary"
							size="small"
							class="mt-2 mr-2 enter-x"
							link
							:disabled="loading"  <!-- 当 loading 为 true 时禁用按钮 -->
							@click="goLogin"  <!-- 点击时调用 goLogin 函数 -->
						>
							{{ t('lock.backToLogin') }}  <!-- 返回登录文字 -->
						</BaseButton>
						<BaseButton
							type="primary"
							class="mt-2"
							size="small"
							link
							@click="unLock()"  <!-- 点击时调用 unLock 函数 -->
							:disabled="loading"  <!-- 当 loading 为 true 时禁用按钮 -->
						>
							{{ t('lock.entrySystem') }}  <!-- 进入系统文字 -->
						</BaseButton>
					</div>
				</div>
			</div>
		</transition>

		<!-- 日期和时间显示区域 -->
		<div class="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
			<div class="text-5xl mb-4 enter-x" v-show="!showDate">  <!-- 当 showDate 为 false 时显示时间 -->
				{{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>  <!-- 显示当前时间和上午/下午标记 -->
			</div>
			<div class="text-2xl">{{ year }}/{{ month }}/{{ day }} {{ week }}</div>  <!-- 显示当前日期和星期 -->
		</div>
	</div>
</template>
*/
</script>

<template>
	<div
		:class="prefixCls"
		class="fixed inset-0 flex h-screen w-screen bg-black items-center justify-center"
	>
		<div
			:class="`${prefixCls}__unlock`"
			class="absolute top-0 left-1/2 flex pt-5 h-16 items-center justify-center sm:text-md xl:text-xl text-white flex-col cursor-pointer transform translate-x-1/2"
			@click="handleShowForm(false)"
			v-show="showDate"
		>
			<Icon icon="vi-ep:lock" />
			<span>{{ t('lock.unlock') }}</span>
		</div>

		<div class="flex w-screen h-screen justify-center items-center">
			<div :class="`${prefixCls}__hour`" class="relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5">
				<span>{{ hour }}</span>
				<span class="meridiem absolute left-5 top-5 text-md xl:text-xl" v-show="showDate">
					{{ meridiem }}
				</span>
			</div>
			<div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
				<span> {{ minute }}</span>
			</div>
		</div>
		<transition name="fade-slide">
			<div :class="`${prefixCls}-entry`" v-show="!showDate">
				<div :class="`${prefixCls}-entry-content`">
					<div class="flex flex-col items-center">
						<img src="@/assets/imgs/avatar.jpg" alt="" class="w-70px h-70px rounded-[50%]" />
						<span class="text-14px my-10px text-[var(--logo-title-text-color)]">Archer</span>
					</div>
					<ElInput
						type="password"
						:placeholder="t('lock.placeholder')"
						class="enter-x"
						v-model="password"
					/>
					<span :class="`text-14px ${prefixCls}-entry__err-msg enter-x`" v-if="errMsg">
						{{ t('lock.message') }}
					</span>
					<div :class="`${prefixCls}-entry__footer enter-x`">
						<BaseButton
							type="primary"
							size="small"
							class="mt-2 mr-2 enter-x"
							link
							:disabled="loading"
							@click="handleShowForm(true)"
						>
							{{ t('common.back') }}
						</BaseButton>
						<BaseButton
							type="primary"
							size="small"
							class="mt-2 mr-2 enter-x"
							link
							:disabled="loading"
							@click="goLogin"
						>
							{{ t('lock.backToLogin') }}
						</BaseButton>
						<BaseButton
							type="primary"
							class="mt-2"
							size="small"
							link
							@click="unLock()"
							:disabled="loading"
						>
							{{ t('lock.entrySystem') }}
						</BaseButton>
					</div>
				</div>
			</div>
		</transition>

		<div class="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
			<div class="text-5xl mb-4 enter-x" v-show="!showDate">
				{{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>
			</div>
			<div class="text-2xl">{{ year }}/{{ month }}/{{ day }} {{ week }}</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-lock-page'; // 定义锁屏页面前缀类

// Small screen / tablet
@screen-sm: 576px; // 小屏幕 / 平板的最大宽度

// Medium screen / desktop
@screen-md: 768px; // 中等屏幕 / 台式机的最大宽度

// Large screen / wide desktop
@screen-lg: 992px; // 大屏幕 / 宽幅台式机的最大宽度

// Extra large screen / full hd
@screen-xl: 1200px; // 超大屏幕 / 全高清的最大宽度

// Extra extra large screen / large desktop
@screen-2xl: 1600px; // 超超大屏幕 / 大台式机的最大宽度

@error-color: #ed6f6f; // 定义错误颜色

.@{prefix-cls} {
	// 使用前缀类进行样式定义
	z-index: 3000; // 设置 z-index 为 3000，使元素位于上层

	&__unlock {
		// 锁屏页面解锁按钮的样式
		transform: translate(-50%, 0); // 设置解锁按钮位置
	}

	&__hour,
	&__minute {
		// 小时和分钟的样式
		display: flex; // 使用弹性布局
		font-weight: 700; // 设置字体加粗
		color: #bababa; // 设置字体颜色
		background-color: #141313; // 设置背景颜色
		border-radius: 30px; // 设置圆角
		justify-content: center; // 水平居中内容
		align-items: center; // 垂直居中内容

		@media screen and (max-width: @screen-md) {
			// 中等屏幕以下的样式
			span:not(.meridiem) {
				// 选择不含 meridiem 的 span
				font-size: 160px; // 设置字体大小
			}
		}

		@media screen and (min-width: @screen-md) {
			// 中等屏幕及以上的样式
			span:not(.meridiem) {
				// 选择不含 meridiem 的 span
				font-size: 160px; // 设置字体大小
			}
		}

		@media screen and (max-width: @screen-sm) {
			// 小屏幕的样式
			span:not(.meridiem) {
				// 选择不含 meridiem 的 span
				font-size: 90px; // 设置字体大小
			}
		}

		@media screen and (min-width: @screen-lg) {
			// 大屏幕及以上的样式
			span:not(.meridiem) {
				// 选择不含 meridiem 的 span
				font-size: 220px; // 设置字体大小
			}
		}

		@media screen and (min-width: @screen-xl) {
			// 超大屏幕及以上的样式
			span:not(.meridiem) {
				// 选择不含 meridiem 的 span
				font-size: 260px; // 设置字体大小
			}
		}

		@media screen and (min-width: @screen-2xl) {
			// 超超大屏幕及以上的样式
			span:not(.meridiem) {
				// 选择不含 meridiem 的 span
				font-size: 320px; // 设置字体大小
			}
		}
	}

	&-entry {
		// 锁屏页面输入框的样式
		position: absolute; // 绝对定位
		top: 0; // 顶部位置
		left: 0; // 左侧位置
		display: flex; // 使用弹性布局
		width: 100%; // 100% 宽度
		height: 100%; // 100% 高度
		background-color: rgb(0 0 0 / 50%); // 半透明黑色背景
		backdrop-filter: blur(8px); // 背景模糊效果
		justify-content: center; // 水平居中内容
		align-items: center; // 垂直居中内容

		&-content {
			// 内容区域的样式
			width: 260px; // 内容区域的宽度
		}

		&__header {
			// 头部样式
			text-align: center; // 文本居中

			&-img {
				// 头部图片的样式
				width: 70px; // 图片宽度
				margin: 0 auto; // 自动水平外边距
				border-radius: 50%; // 圆形边框
			}

			&-name {
				// 头部名称的样式
				margin-top: 5px; // 顶部外边距
				font-weight: 500; // 字体加粗
				color: #bababa; // 字体颜色
			}
		}

		&__err-msg {
			// 错误信息的样式
			display: inline-block; // 行内块元素
			margin-top: 10px; // 顶部外边距
			color: @error-color; // 错误颜色
		}

		&__footer {
			// 页脚的样式
			display: flex; // 使用弹性布局
			justify-content: space-between; // 两端对齐
		}
	}
}
</style>
