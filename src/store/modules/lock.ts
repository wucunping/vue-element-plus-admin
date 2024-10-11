/**
 * @file lock.ts
 * @description Pinia状态管理商店，用于管理锁屏信息
 * @example
 * const lockStore = useLockStore();
 * lockStore.setLockInfo({ isLock: true, password: '1234' });
 * @version 1.0
 * @author Fitten Tech
 * @date 2023-10-05
 * @module lock
 */

import { defineStore } from 'pinia' // 从pinia库中导入defineStore函数
import { store } from '../index' // 导入应用的主store

/**
 * @interface lockInfo
 * @description 锁信息接口
 */
interface lockInfo {
	isLock?: boolean // 是否锁定屏幕
	password?: string // 锁屏密码
}

/**
 * @interface LockState
 * @description 状态接口，包括锁信息
 */
interface LockState {
	lockInfo: lockInfo // 锁信息
}

/**
 * @function useLockStore
 * @description 定义锁商店
 * @returns LockState 返回锁状态
 */
export const useLockStore = defineStore('lock', {
	state: (): LockState => {
		// 状态函数
		return {
			lockInfo: {
				// 初始化锁信息
				// isLock: false, // 是否锁定屏幕
				// password: '' // 锁屏密码
			}
		}
	},
	getters: {
		/**
		 * @function getLockInfo
		 * @description 获取锁信息
		 * @returns lockInfo 返回锁信息
		 */
		getLockInfo(): lockInfo {
			return this.lockInfo // 返回锁信息
		}
	},
	actions: {
		/**
		 * @function setLockInfo
		 * @description 设置锁信息
		 * @param {lockInfo} lockInfo 锁信息对象
		 */
		setLockInfo(lockInfo: lockInfo) {
			this.lockInfo = lockInfo // 更新锁信息
		},
		/**
		 * @function resetLockInfo
		 * @description 重置锁信息
		 */
		resetLockInfo() {
			this.lockInfo = {} // 清空锁信息
		},
		/**
		 * @function unLock
		 * @description 解锁方法
		 * @param {string} password 输入的密码
		 * @returns {boolean} 返回解锁是否成功
		 */
		unLock(password: string) {
			if (this.lockInfo?.password === password) {
				// 验证密码
				this.resetLockInfo() // 重置锁信息
				return true // 解锁成功
			} else {
				return false // 解锁失败
			}
		}
	},
	persist: true // 持久化状态
})

/**
 * @function useLockStoreWithOut
 * @description 创建一个没有依赖于组件的锁商店实例
 * @returns {LockState} 返回锁商店实例
 */
export const useLockStoreWithOut = () => {
	return useLockStore(store) // 返回锁商店实例
}
