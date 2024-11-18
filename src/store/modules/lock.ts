/**
 * @file lock.ts
 * @description 锁屏状态管理模块，提供锁屏信息的设置、重置及解锁功能。
 * @example
 *  // 设置锁屏信息
 *  const lockStore = useLockStore();
 *  lockStore.setLockInfo({ isLock: true, password: '123456' });
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module Pinia Store
 */

import { defineStore } from 'pinia' // 从 pinia 中导入 defineStore 函数
import { store } from '../index' // 导入共享 Store 实例

/**
 * 锁屏信息接口
 */
interface lockInfo {
  /** 是否锁定屏幕 */
  isLock?: boolean
  /**锁屏密码 */
  password?: string
}

/**
 * 锁屏状态
 */
interface LockState {
  /**锁屏信息 */
  lockInfo: lockInfo
}

/**
 * 定义锁屏状态管理
 */
export const useLockStore = defineStore('lock', {
  state: (): LockState => {
    return {
      lockInfo: {
        // 初始化锁屏信息，默认为空对象
        // isLock: false, // 是否锁定屏幕
        // password: '' // 锁屏密码
      }
    }
  },
  getters: {
    /**
     * 获取锁屏信息
     * @returns {lockInfo} 锁屏信息
     */
    getLockInfo(): lockInfo {
      return this.lockInfo
    }
  },
  actions: {
    /**
     * 设置锁屏信息
     * @param {lockInfo} lockInfo 锁屏信息对象
     */
    setLockInfo(lockInfo: lockInfo) {
      this.lockInfo = lockInfo
    },
    /**
     * 重置锁屏信息
     */
    resetLockInfo() {
      this.lockInfo = {}
    },
    /**
     * 解锁功能
     * @param {string} password 输入的解锁密码
     * @returns {boolean} 是否成功解锁
     */
    unLock(password: string) {
      if (this.lockInfo?.password === password) {
        this.resetLockInfo()
        return true
      } else {
        return false
      }
    }
  },
  persist: true
})

/**
 * 导出不使用 store 实例的锁屏状态 Store
 * @returns {ReturnType<typeof useLockStore>} 返回锁屏状态 Store 实例
 */
export const useLockStoreWithOut = () => {
  return useLockStore(store)
}
