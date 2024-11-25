/**
 * @file Plop 配置文件
 * @description 配置 Plop.js 的生成器，用于快速生成视图和组件
 * @example 运行 `plop` 命令后，选择生成视图或组件并根据提示完成生成
 * @version 1.0.0
 * @date 2024-11-19
 * @module PlopfileConfig
 * @requires plop/view/prompt.cjs
 * @requires plop/component/prompt.cjs
 * @author [吴尘](https://github.com/wucunping)
 */

// 引入视图生成器配置
const viewGenerator = require('./plop/view/prompt.cjs')

// 引入组件生成器配置
const componentGenerator = require('./plop/component/prompt.cjs')

/**
 * 配置 Plop 生成器
 * @param {Object} plop Plop.js 提供的 API 对象
 */
module.exports = function (plop) {
  // 设置视图生成器
  plop.setGenerator('view', viewGenerator)

  // 设置组件生成器
  plop.setGenerator('component', componentGenerator)
}
