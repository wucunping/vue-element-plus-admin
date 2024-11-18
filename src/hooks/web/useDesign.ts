/**
 * @file useDesign.ts
 * @description 提供样式变量和类名前缀的工具函数
 * @example
 * const { variables, getPrefixCls } = useDesign();
 * const className = getPrefixCls('button');
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module DesignUtils
 */

import variables from '@/styles/variables.module.less' // 导入样式变量

/** 定义 useDesign 函数 */
export const useDesign = () => {
  /** 获取 LESS 变量 */
  const lessVariables = variables

  /**
   * 获取类名前缀
   * @param scope 类名
   * @returns 返回空间名-类名
   */
  const getPrefixCls = (scope: string) => {
    return `${lessVariables.namespace}-${scope}` // 返回命名空间和类名的组合
  }

  // 返回样式变量和获取类名前缀的函数
  return {
    variables: lessVariables,
    getPrefixCls
  }
}
