/**
 * @file Backtop 组件入口文件
 * @description 该文件用于引入和导出 Backtop 组件，便于其他模块使用。
 * @example
 * import { Backtop } from '路径/到/该文件';
 *
 * // 在 Vue 组件中使用 Backtop
 * export default {
 *   components: {
 *     Backtop
 *   }
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module Backtop
 */

// 引入Backtop组件
import Backtop from './src/Backtop.vue' // 从src目录引入Backtop.vue文件

// 导出Backtop组件
export { Backtop } // 将Backtop组件导出，以便其他模块使用
