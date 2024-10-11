/**
 * @file index.ts
 * @description 该文件定义了全局配置接口及其相关类型
 * @example
 * const config: ConfigGlobalTypes = { size: 'medium' };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module global-config
 */

import type { ComponentSize } from 'element-plus' // 导入 Element Plus 组件的大小类型

/**
 * 定义全局配置类型接口
 */
export interface ConfigGlobalTypes {
	/**
	 * 组件的大小类型，可选
	 */
	size?: ComponentSize // 可选的组件大小属性
}
