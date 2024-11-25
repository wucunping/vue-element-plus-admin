/**
 * @file index.ts
 * @description CountTo 组件入口文件，用于导出 CountTo 组件，支持动画的数字动态计数
 * @module CountTo
 * @example
 * import { CountTo } from '@/components/CountTo'
 *
 * <CountTo :startVal="0" :endVal="100" :duration="3000" />
 *
 * @version 1.0.0
 * @date 2024-11-21
 * @requires ./src/CountTo.vue
 * @export { CountTo }
 * @author [吴尘](https://github.com/wucunping)
 */

//引入 CountTo 组件
import CountTo from './src/CountTo.vue'

//导出 CountTo 组件
export { CountTo }
