/**
 * @file index.ts
 * @description InfoTipSchema接口定义
 * @example
 * const tip: InfoTipSchema = { label: '提示', keys: ['键1', '键2'] };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module InfoTipModule
 */

/** 定义一个接口，表示提示信息的结构 */
export interface InfoTipSchema {
	/** 提示标签 */
	label: string
	/** 可选的键数组 */
	keys?: string[]
}
