/**
 * @file 导出 ImageCropping 组件的入口文件
 * @description 统一导出 ImageCropping 组件，用于在其他模块中引入和使用。
 * @example
 * import { ImageCropping } from '@/components/ImageCropping'
 *
 * <template>
 *   <ImageCropping
 *     :imageUrl="imageSrc"
 *     :cropBoxWidth="200"
 *     :cropBoxHeight="200"
 *     :boxWidth="400"
 *     :boxHeight="300"
 *     :showResult="true"
 *     :showActions="true"
 *   />
 * </template>
 *
 * @version 1.0.0
 * @date 2024-11-22
 * @module /src/components/ImageCropping/index.ts
 * @author [吴尘](https://github.com/wucunping)
 */

import ImageCropping from './src/ImageCropping.vue' // 引入 ImageCropping.vue 文件

export { ImageCropping } // 导出 ImageCropping 组件
