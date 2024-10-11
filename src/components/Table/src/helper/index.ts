/**
 * @file index.ts
 * @description 设置索引的函数，根据传入参数计算新的索引值
 * @example
 * const index = setIndex(true, 5, 10, 2); // 返回 21
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module IndexManagement
 */

// 导出 setIndex 函数
export const setIndex = (
	/** 是否保留索引的布尔值 */
	reserveIndex: boolean,
	/** 当前索引值 */
	index: number,
	/** 数据的总大小 */
	size: number,
	/** 当前预设的索引 */
	current: number
) => {
	// 新的索引值，向上加1
	const newIndex = index + 1

	// 检查是否保留索引
	if (reserveIndex) {
		// 如果保留索引，按公式计算新的索引值
		return size * (current - 1) + newIndex
	} else {
		// 如果不保留索引，直接返回新的索引值
		return newIndex
	}
}
