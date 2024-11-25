/**
 * @file Plop 生成器配置文件
 * @description 用于通过 Plop.js 快速生成 Vue 组件的模板文件和相关索引文件
 * @example 使用此文件，运行 `plop` 命令后根据提示输入组件名称生成对应的文件
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 * @module PromptGenerator
 */

/**
 * 将字符串的首字母转换为大写
 * @param {string} str 输入字符串
 * @returns {string} 首字母大写的字符串
 */
const toUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

module.exports = {
  /**
   * 描述信息，用于提示生成的内容
   */
  description: 'Create vue component', // 创建 Vue 组件的描述

  /**
   * 用户输入提示配置
   */
  prompts: [
    {
      type: 'input', // 提示类型为输入框
      name: 'name', // 输入的组件名称
      message: '请输入组件名称（Please enter the component name）' // 提示信息
    }
  ],

  /**
   * 配置生成文件的操作
   * @param {Object} data 用户输入的数据
   * @returns {Array} 操作数组，包含文件生成配置
   */
  actions: (data) => {
    const { name } = data // 从用户输入中获取组件名称
    const upperFirstName = toUpperCase(name) // 将组件名称首字母大写

    const actions = [] // 定义操作数组

    if (name) {
      // 添加组件的主文件
      actions.push({
        type: 'add', // 添加文件类型
        path: `./src/components/${upperFirstName}/src/${upperFirstName}.vue`, // 组件路径
        templateFile: './plop/component/component.hbs', // 组件模板文件
        data: {
          name, // 传递组件名称数据到模板
          upperFirstName // 传递首字母大写名称数据到模板
        }
      })

      // 添加组件的索引文件
      actions.push({
        type: 'add', // 添加文件类型
        path: `./src/components/${upperFirstName}/index.ts`, // 索引文件路径
        templateFile: './plop/component/index.hbs', // 索引模板文件
        data: {
          upperFirstName // 传递首字母大写名称数据到模板
        }
      })
    }

    return actions // 返回生成的操作数组
  }
}
