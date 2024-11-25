/**
 * @file Plop 生成器配置文件
 * @description 用于通过 Plop.js 快速生成 Vue 视图文件的模板
 * @example 使用此文件，运行 `plop` 命令后根据提示输入路径和模块名称生成视图文件
 * @version 1.0.0
 * @date 2024-11-19
 * @module PromptViewGenerator
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 将字符串的首字母转换为大写
 * @param {string} str 输入字符串
 * @returns {string} 首字母大写的字符串
 */
const toUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

module.exports = {
  /**
   * 描述信息，用于提示生成 Vue 视图的内容
   */
  description: 'Create vue view', // 描述：创建 Vue 视图

  /**
   * 用户输入提示配置
   */
  prompts: [
    {
      type: 'input', // 输入类型为文本框
      name: 'path', // 输入的路径名称
      message: '请输入路径（Please enter a path）', // 提示信息
      default: 'views' // 默认值为 'views'
    },
    {
      type: 'input', // 输入类型为文本框
      name: 'name', // 输入的模块名称
      message: '请输入模块名称（Please enter module name）' // 提示信息
    }
  ],

  /**
   * 配置生成文件的操作
   * @param {Object} data 用户输入的数据
   * @returns {Array} 操作数组，包含文件生成配置
   */
  actions: (data) => {
    const { name, path } = data // 从用户输入中获取模块名称和路径
    const upperFirstName = toUpperCase(name) // 将模块名称的首字母转换为大写

    const actions = [] // 定义操作数组

    if (name) {
      // 添加视图文件
      actions.push({
        type: 'add', // 添加文件类型
        path: `./src/${path}/${upperFirstName}.vue`, // 文件路径
        templateFile: './plop/view/view.hbs', // 模板文件路径
        data: {
          name, // 模块名称
          upperFirstName // 首字母大写的模块名称
        }
      })
    }

    return actions // 返回生成的操作数组
  }
}
