/**
 * @file index.ts
 * @description 全局组件注册的设置
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-11
 * @module setupGlobCom
 */

import type { App } from 'vue' // 导入App类型用于定义Vue应用
import { Icon } from './Icon' // 导入Icon组件
import { Permission } from './Permission' // 导入Permission组件
import { BaseButton } from './Button' // 导入BaseButton组件

/**
 * 设置全局组件
 * @param {App<Element>} app - Vue应用实例
 * @returns {void} 不返回任何内容
 */
export const setupGlobCom = (app: App<Element>): void => {
	app.component('Icon', Icon) // 注册Icon组件
	app.component('Permission', Permission) // 注册Permission组件
	app.component('BaseButton', BaseButton) // 注册BaseButton组件
}
