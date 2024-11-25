/**
 * @file Helper function for setting table row index.
 * @description 提供一个辅助函数，用于根据当前分页信息设置表格的行号。
 * @module TableHelper
 * @example
 * const index = setIndex(true, 2, 10, 3); // 返回全局索引
 * @version 1.0.0
 * @date 2024-11-22
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 根据设置计算表格的行号
 *
 * @param reserveIndex - 是否保留原始行号
 * @param index - 当前行的索引，从 0 开始
 * @param size - 每页显示的行数
 * @param current - 当前页码
 * @returns 计算后的行号
 */
export const setIndex = (reserveIndex: boolean, index: number, size: number, current: number) => {
  // 计算当前行的索引加 1，转换为 1 开始的行号
  const newIndex = index + 1

  if (reserveIndex) {
    // 如果保留原始行号，则根据页码和页大小计算全局行号
    return size * (current - 1) + newIndex
  } else {
    // 如果不保留，则直接返回当前页的行号
    return newIndex
  }
}
