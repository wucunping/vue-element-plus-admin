/**
 * @file index.ts
 * @description 定义了头像组件的类型
 * @example 导入并使用头像组件的类型
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-21
 * @module /src/components/Avatars/src/types/index.ts
 */

/** 定义头像组件的类型 */
export interface AvatarItem {
  /** 头像图片的URL地址 */
  url: string
  /** 头像名称，为可选属性 */
  name?: string
}
