/**
 * @file components.d.ts
 * @description Vue全局组件声明文件
 * @example
 * // 用法示例
 * // 组件可以通过 `<Icon />`，`<Permission />` 和 `<BaseButton />` 使用
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-15
 * @module components
 */

/**
 * 声明一个 Vue 模块，以扩展 Vue 的全局类型。
 */
declare module 'vue' {
  /* 扩展Vue的全局组件类型 */
  export interface GlobalComponents {
    /**
     * Icon 组件，类型来源于 '../src/components/Icon/index' 文件中的 Icon 组件。
     * 这允许我们在全局范围内使用 Icon 组件，而无需在每个文件中单独导入。
     * @returns {typeof import('../src/components/Icon/index')['Icon']} Icon 组件类型
     */
    Icon: (typeof import('../src/components/Icon/index'))['Icon']
    /**
     * Permission 组件
     * @returns {typeof import('../src/components/Permission/index')['Permission']} Permission 组件类型
     */
    Permission: (typeof import('../src/components/Permission/index'))['Permission']
    /**
     * BaseButton 组件
     * @returns {typeof import('../src/components/Button/index')['BaseButton']} BaseButton 组件类型
     */
    BaseButton: (typeof import('../src/components/Button/index'))['BaseButton']
  }
}

export {} // 导出空对象，以确保文件被视为模块
