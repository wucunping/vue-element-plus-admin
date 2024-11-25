/**
 * @file index.ts
 * @description 头像组件的主索引文件，用于导出头像组件及其类型
 * @example 导入头像组件并在项目中使用
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-21
 * @module /src/components/Avatars/index.ts
 */

// 导入头像组件
import Avatars from './src/Avatars.vue'

// 从类型定义文件中导出AvatarItem类型
export type { AvatarItem } from './src/types'

// 导出头像组件，使其可以在其他文件中使用
export { Avatars }
