/**
 * @file Icon 生成脚本
 * @description 此脚本用于从 Iconify JSON 数据中生成 IconPicker 组件需要的图标数据文件
 * @example 运行脚本后，选择需要生成的图标集，生成的图标数据会保存到指定目录中
 * @version 1.0.0
 * @date 2024-11-19
 * @module IconGeneratorScript
 * @author [吴尘](https://github.com/wucunping)
 */

import path from 'path' // Node.js 路径模块
import fs from 'fs-extra' // 文件操作模块，支持 Promise API
import inquirer from 'inquirer' // 命令行交互工具
import chalk from 'chalk' // 命令行输出美化工具
import pkg from '../package.json' // 项目包信息
import { ICON_PREFIX } from '../src/constants' // 图标前缀常量

/**
 * Icon 数据接口
 * @interface Icon
 * @property {string} name 图标集名称
 * @property {string} prefix 图标前缀
 * @property {string[]} icons 图标列表
 */
interface Icon {
  name: string
  prefix: string
  icons: string[]
}

/**
 * 生成 Icon 数据文件
 */
async function generateIcon() {
  // 获取 Iconify 的 JSON 数据存储目录
  const dir = path.resolve(process.cwd(), 'node_modules/@iconify/json')

  // 读取 collections.json 文件，包含所有图标集的元数据
  const raw = await fs.readJSON(path.join(dir, 'collections.json'))

  // 将图标集数据转换为数组，并附加 id 字段
  const collections = Object.entries(raw).map(([id, v]) => ({
    ...(v as any),
    id
  }))

  // 将图标集数据映射为命令行交互的选择项
  const choices = collections.map((item) => ({ key: item.id, value: item.id, name: item.name }))

  // 使用 inquirer 进行命令行交互
  inquirer
    .prompt([
      {
        type: 'list', // 问题类型为列表选择
        name: 'iconSet', // 返回的答案字段名
        choices: choices, // 可选项
        message: 'Select the icon set that needs to be generated?' // 提示信息
      }
    ])
    .then(async (answers) => {
      const { iconSet } = answers // 获取用户选择的图标集
      const outputDir = path.resolve(process.cwd(), 'src/components/IconPicker/src/data') // 输出目录
      fs.ensureDir(outputDir) // 确保输出目录存在

      // 筛选用户选择的图标集
      const genCollections = collections.filter((item) => [iconSet].includes(item.id))

      const prefixSet: string[] = [] // 存储生成的图标前缀
      for (const info of genCollections) {
        // 读取图标集的详细数据
        const data = await fs.readJSON(path.join(dir, 'json', `${info.id}.json`))
        if (data) {
          const { prefix } = data // 图标前缀
          const prefixName = `${ICON_PREFIX}${prefix}` // 生成带项目前缀的图标前缀
          const icons = Object.keys(data.icons).map((item) => `${prefixName}:${item}`) // 图标列表

          // 将图标集数据写入文件
          await fs.writeFileSync(
            path.join('src/components/IconPicker/src/data', `icons.${prefix}.ts`),
            `export default ${JSON.stringify({ name: info.name, prefix: prefixName, icons })}`
          )
          prefixSet.push(prefix) // 将前缀存入数组
        }
      }

      // 输出生成成功的信息
      console.log(
        `✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - Icon generated successfully:' + `[${prefixSet}]`
      )
    })
}

// 调用生成函数
generateIcon()
