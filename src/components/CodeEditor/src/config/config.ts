/**
 * @file CodeEditor 配置文件
 * @description 包含代码编辑器支持的语言和主题选项配置
 * @example
 * import { languageOptions, themeOptions } from '@/components/CodeEditor/src/config/config'
 * @version 1.0.0
 * @date 2024-11-21
 * @module CodeEditorConfig
 * @requires none
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 语言选项列表
 * @description 配置代码编辑器支持的所有语言
 * @property {string} label - 显示的语言名称
 * @property {string} value - 对应的语言标识符
 */
export const languageOptions = [
  { label: 'plaintext', value: 'plaintext' }, // 纯文本
  { label: 'abap', value: 'abap' }, // ABAP
  { label: 'apex', value: 'apex' }, // Apex
  { label: 'azcli', value: 'azcli' }, // Azure CLI
  { label: 'bat', value: 'bat' }, // 批处理文件
  { label: 'bicep', value: 'bicep' }, // Bicep
  { label: 'cameligo', value: 'cameligo' }, // CameLIGO
  { label: 'clojure', value: 'clojure' }, // Clojure
  { label: 'coffeescript', value: 'coffeescript' }, // CoffeeScript
  { label: 'c', value: 'c' }, // C语言
  { label: 'cpp', value: 'cpp' }, // C++
  { label: 'csharp', value: 'csharp' }, // C#
  { label: 'csp', value: 'csp' }, // CSP
  { label: 'css', value: 'css' }, // CSS
  { label: 'cypher', value: 'cypher' }, // Cypher 查询语言
  { label: 'dart', value: 'dart' }, // Dart
  { label: 'dockerfile', value: 'dockerfile' }, // Dockerfile
  { label: 'ecl', value: 'ecl' }, // ECL
  { label: 'elixir', value: 'elixir' }, // Elixir
  { label: 'flow9', value: 'flow9' }, // Flow9
  { label: 'fsharp', value: 'fsharp' }, // F#
  { label: 'freemarker2', value: 'freemarker2' }, // Freemarker2
  {
    label: 'freemarker2.tag-angle.interpolation-dollar',
    value: 'freemarker2.tag-angle.interpolation-dollar'
  }, // Freemarker2 使用角标签和美元符号
  {
    label: 'freemarker2.tag-bracket.interpolation-dollar',
    value: 'freemarker2.tag-bracket.interpolation-dollar'
  }, // Freemarker2 使用括号标签和美元符号
  {
    label: 'freemarker2.tag-angle.interpolation-bracket',
    value: 'freemarker2.tag-angle.interpolation-bracket'
  }, // Freemarker2 使用角标签和括号插值
  {
    label: 'freemarker2.tag-bracket.interpolation-bracket',
    value: 'freemarker2.tag-bracket.interpolation-bracket'
  }, // Freemarker2 使用括号标签和括号插值
  {
    label: 'freemarker2.tag-auto.interpolation-dollar',
    value: 'freemarker2.tag-auto.interpolation-dollar'
  }, // Freemarker2 自动标签和美元符号
  {
    label: 'freemarker2.tag-auto.interpolation-bracket',
    value: 'freemarker2.tag-auto.interpolation-bracket'
  }, // Freemarker2 自动标签和括号插值
  { label: 'go', value: 'go' }, // Go 语言
  { label: 'graphql', value: 'graphql' }, // GraphQL
  { label: 'handlebars', value: 'handlebars' }, // Handlebars
  { label: 'hcl', value: 'hcl' }, // HCL
  { label: 'html', value: 'html' }, // HTML
  { label: 'ini', value: 'ini' }, // INI 配置文件
  { label: 'java', value: 'java' }, // Java
  { label: 'javascript', value: 'javascript' }, // JavaScript
  { label: 'julia', value: 'julia' }, // Julia
  { label: 'kotlin', value: 'kotlin' }, // Kotlin
  { label: 'less', value: 'less' }, // LESS
  { label: 'lexon', value: 'lexon' }, // Lexon
  { label: 'lua', value: 'lua' }, // Lua
  { label: 'liquid', value: 'liquid' }, // Liquid 模板
  { label: 'm3', value: 'm3' }, // M3 语言
  { label: 'markdown', value: 'markdown' }, // Markdown
  { label: 'mdx', value: 'mdx' }, // MDX
  { label: 'mips', value: 'mips' }, // MIPS 汇编
  { label: 'msdax', value: 'msdax' }, // MSDAX
  { label: 'mysql', value: 'mysql' }, // MySQL
  { label: 'objective-c', value: 'objective-c' }, // Objective-C
  { label: 'pascal', value: 'pascal' }, // Pascal
  { label: 'pascaligo', value: 'pascaligo' }, // Pascaligo
  { label: 'perl', value: 'perl' }, // Perl
  { label: 'pgsql', value: 'pgsql' }, // PostgreSQL
  { label: 'php', value: 'php' }, // PHP
  { label: 'pla', value: 'pla' }, // PLA
  { label: 'postiats', value: 'postiats' }, // Postiats
  { label: 'powerquery', value: 'powerquery' }, // PowerQuery
  { label: 'powershell', value: 'powershell' }, // PowerShell
  { label: 'proto', value: 'proto' }, // Proto
  { label: 'pug', value: 'pug' }, // Pug
  { label: 'python', value: 'python' }, // Python
  { label: 'qsharp', value: 'qsharp' }, // Q#
  { label: 'r', value: 'r' }, // R语言
  { label: 'razor', value: 'razor' }, // Razor
  { label: 'redis', value: 'redis' }, // Redis
  { label: 'redshift', value: 'redshift' }, // Redshift
  { label: 'restructuredtext', value: 'restructuredtext' }, // RestructuredText
  { label: 'ruby', value: 'ruby' }, // Ruby
  { label: 'rust', value: 'rust' }, // Rust
  { label: 'sb', value: 'sb' }, // SB
  { label: 'scala', value: 'scala' }, // Scala
  { label: 'scheme', value: 'scheme' }, // Scheme
  { label: 'scss', value: 'scss' }, // SCSS
  { label: 'shell', value: 'shell' }, // Shell
  { label: 'sol', value: 'sol' }, // Solidity
  { label: 'aes', value: 'aes' }, // AES
  { label: 'sparql', value: 'sparql' }, // SPARQL
  { label: 'sql', value: 'sql' }, // SQL
  { label: 'st', value: 'st' }, // ST
  { label: 'swift', value: 'swift' }, // Swift
  { label: 'systemverilog', value: 'systemverilog' }, // SystemVerilog
  { label: 'verilog', value: 'verilog' }, // Verilog
  { label: 'tcl', value: 'tcl' }, // TCL
  { label: 'twig', value: 'twig' }, // Twig
  { label: 'typescript', value: 'typescript' }, // TypeScript
  { label: 'vb', value: 'vb' }, // Visual Basic
  { label: 'wgsl', value: 'wgsl' }, // WGSL
  { label: 'xml', value: 'xml' }, // XML
  { label: 'yaml', value: 'yaml' }, // YAML
  { label: 'json', value: 'json' } // JSON
]

/**
 * 主题选项列表
 * @description 配置代码编辑器支持的所有主题
 * @property {string} label - 显示的主题名称
 * @property {string} value - 对应的主题标识符
 */
export const themeOptions = [
  { label: 'vs', value: 'vs' }, // Visual Studio 主题
  { label: 'vs-dark', value: 'vs-dark' }, // Visual Studio 暗黑主题
  { label: 'hc-black', value: 'hc-black' }, // 高对比黑色主题
  { label: 'hc-light', value: 'hc-light' } // 高对比浅色主题
]
