<script setup lang="ts">
/**
 * @file UserInfo.vue
 * @description 用户信息组件，包含用户头像、下拉菜单、锁屏和登出功能。
 *              该组件用TypeScript编写，使用Vue 3的Composition API。
 * @example <UserInfo />
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module UserInformation
 */

// 导入下拉组件相关
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
// 导入国际化/hooks
import { useI18n } from '@/hooks/web/useI18n'
// 导入设计相关的hooks
import { useDesign } from '@/hooks/web/useDesign'
// 导入锁屏对话框组件
import LockDialog from './components/LockDialog.vue'
// 导入Vue的响应式API
import { ref, computed } from 'vue'
// 导入锁定页面组件
import LockPage from './components/LockPage.vue'
// 导入锁定状态的store
import { useLockStore } from '@/store/modules/lock'
// 导入用户store
import { useUserStore } from '@/store/modules/user'
// 导入路由管理
import { useRouter } from 'vue-router'

// 获取路由的push方法
const { push } = useRouter()

// 实例化用户store
const userStore = useUserStore()

// 实例化锁定store
const lockStore = useLockStore()

// 计算锁定状态的响应式变量
const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

// 获取设计前缀类的方法
const { getPrefixCls } = useDesign()

// 获取用户信息的前缀类
const prefixCls = getPrefixCls('user-info')

// 获取国际化文本的方法
const { t } = useI18n()

/**
 * 退出登录的方法
 * @function loginOut
 */
const loginOut = () => {
	// 调用用户store中的退出确认方法
	userStore.logoutConfirm()
}

// 控制对话框可见性的响应式变量
const dialogVisible = ref<boolean>(false)

/**
 * 锁定屏幕的方法
 * @function lockScreen
 */
const lockScreen = () => {
	// 将对话框可见性设置为true
	dialogVisible.value = true
}

/**
 * 打开文档的方法
 * @function toDocument
 */
const toDocument = () => {
	// 在新标签页打开文档链接
	window.open('https://element-plus-admin-doc.cn/')
}

/**
 * 跳转到指定路径的方法
 * @function toPage
 * @param {string} path - 目标路径
 */
const toPage = (path: string) => {
	// 使用路由的push方法跳转到目标路径
	push(path)
}

/*
<template>
	<ElDropdown class="custom-hover" :class="prefixCls" trigger="click"> <!-- 定义一个下拉菜单组件 -->
		<div class="flex items-center"> <!-- 创建一个外部容器，使用 flex 布局 -->
			<img
				src="@/assets/imgs/avatar.jpg" <!-- 用户头像图片的路径 -->
				alt="" <!-- 图片的替代文本，当前为空 -->
				class="w-[calc(var(--logo-height)-25px)] rounded-[50%]" <!-- 设置宽度和圆角样式 -->
			/>
			<span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{ <!-- 显示用户名，响应式隐藏小屏幕下的元素 -->
				userStore.getUserInfo?.username <!-- 获取用户信息中的用户名 -->
			}}</span>
		</div>
		<template #dropdown> <!-- 定义下拉菜单的内容 -->
			<ElDropdownMenu> <!-- 下拉菜单组件 -->
				<ElDropdownItem> <!-- 下拉菜单项 -->
					<div @click="toPage('/personal/personal-center')"> <!-- 点击跳转到个人中心页面 -->
						{{ t('router.personalCenter') }} <!-- 显示个人中心的文本 -->
					</div>
				</ElDropdownItem>
				<ElDropdownItem> <!-- 下拉菜单项 -->
					<div @click="toDocument">{{ t('common.document') }}</div> <!-- 点击显示文档 -->
				</ElDropdownItem>
				<ElDropdownItem divided> <!-- 下拉菜单项，带有分隔线 -->
					<div @click="lockScreen">{{ t('lock.lockScreen') }}</div> <!-- 点击锁屏 -->
				</ElDropdownItem>
				<ElDropdownItem> <!-- 下拉菜单项 -->
					<div @click="loginOut">{{ t('common.loginOut') }}</div> <!-- 点击登出 -->
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>

	<LockDialog v-if="dialogVisible" v-model="dialogVisible" /> <!-- 条件渲染锁定对话框 -->
	<teleport to="body"> <!-- 将锁定页面传送到 body 元素下 -->
		<transition name="fade-bottom" mode="out-in"> <!-- 定义过渡效果 -->
			<LockPage v-if="getIsLock" /> <!-- 条件渲染锁定页面 -->
		</transition>
	</teleport>
</template>
*/
</script>

<template>
	<ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
		<div class="flex items-center">
			<img
				src="@/assets/imgs/avatar.jpg"
				alt=""
				class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
			/>
			<span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
				userStore.getUserInfo?.username
			}}</span>
		</div>
		<template #dropdown>
			<ElDropdownMenu>
				<ElDropdownItem>
					<div @click="toPage('/personal/personal-center')">
						{{ t('router.personalCenter') }}
					</div>
				</ElDropdownItem>
				<ElDropdownItem>
					<div @click="toDocument">{{ t('common.document') }}</div>
				</ElDropdownItem>
				<ElDropdownItem divided>
					<div @click="lockScreen">{{ t('lock.lockScreen') }}</div>
				</ElDropdownItem>
				<ElDropdownItem>
					<div @click="loginOut">{{ t('common.loginOut') }}</div>
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>

	<LockDialog v-if="dialogVisible" v-model="dialogVisible" />
	<teleport to="body">
		<transition name="fade-bottom" mode="out-in">
			<LockPage v-if="getIsLock" />
		</transition>
	</teleport>
</template>

<style scoped lang="less">
/* 定义进入和离开动画的持续时间和类型 */
.fade-bottom-enter-active,
.fade-bottom-leave-active {
	transition: /* 过渡效果 */
		opacity 0.25s,
		/* 透明度的过渡持续时间为0.25秒 */ transform 0.3s; /* 变换效果的过渡持续时间为0.3秒 */
}

/* 进入动画的初始状态 */
.fade-bottom-enter-from {
	opacity: 0; /* 初始透明度为0 */
	transform: translateY(-10%); /* 初始位置向上移动10% */
}

/* 离开动画的结束状态 */
.fade-bottom-leave-to {
	opacity: 0; /* 离开时透明度为0 */
	transform: translateY(10%); /* 离开时位置向下移动10% */
}
</style>
