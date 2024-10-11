/**
 * @file config.ts
 * @description 该文件包含语言选项和主题选项的配置信息，供代码编辑器使用。
 *              语言选项数组定义了支持的编程语言及其对应的值，
 *              主题选项数组定义了可选的主题配置。
 * @example
 * // 引入语言和主题选项
 * import { languageOptions, themeOptions } from './config';
 *
 * // 使用语言选项
 * console.log(languageOptions);
 *
 * // 使用主题选项
 * console.log(themeOptions);
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module Configuration
 */

/**
 * 语言选项配置
 */
export const languageOptions = [
	/** 文本文件 */
	{ label: 'plaintext', value: 'plaintext' },
	/** ABAP编程语言 */
	{ label: 'abap', value: 'abap' },
	/** Apex编程语言 */
	{ label: 'apex', value: 'apex' },
	/** Azure CLI脚本 */
	{ label: 'azcli', value: 'azcli' },
	/** 批处理文件 */
	{ label: 'bat', value: 'bat' },
	/** Bicep语言 */
	{ label: 'bicep', value: 'bicep' },
	/** Cameligo语言 */
	{ label: 'cameligo', value: 'cameligo' },
	/** Clojure编程语言 */
	{ label: 'clojure', value: 'clojure' },
	/** CoffeeScript语言 */
	{ label: 'coffeescript', value: 'coffeescript' },
	/** C编程语言 */
	{ label: 'c', value: 'c' },
	/** C++编程语言 */
	{ label: 'cpp', value: 'cpp' },
	/** C#编程语言 */
	{ label: 'csharp', value: 'csharp' },
	/** CSP语言 */
	{ label: 'csp', value: 'csp' },
	/** CSS样式表 */
	{ label: 'css', value: 'css' },
	/** Cypher查询语言 */
	{ label: 'cypher', value: 'cypher' },
	/** Dart编程语言 */
	{ label: 'dart', value: 'dart' },
	/** Dockerfile配置 */
	{ label: 'dockerfile', value: 'dockerfile' },
	/** ECL语言 */
	{ label: 'ecl', value: 'ecl' },
	/** Elixir编程语言 */
	{ label: 'elixir', value: 'elixir' },
	/** Flow9语言 */
	{ label: 'flow9', value: 'flow9' },
	/** F#编程语言 */
	{ label: 'fsharp', value: 'fsharp' },
	/** Freemarker 2模板语言 */
	{ label: 'freemarker2', value: 'freemarker2' },

	// 标签用于美元插值的角标签
	{
		/** 标签名称 */
		label: 'freemarker2.tag-angle.interpolation-dollar',
		/** 标签值 */
		value: 'freemarker2.tag-angle.interpolation-dollar'
	},
	// 标签用于美元插值的括号标签
	{
		/** 标签名称 */
		label: 'freemarker2.tag-bracket.interpolation-dollar',
		/** 标签值 */
		value: 'freemarker2.tag-bracket.interpolation-dollar'
	},
	// 标签用于括号插值的角标签
	{
		/** 标签名称 */
		label: 'freemarker2.tag-angle.interpolation-bracket',
		/** 标签值 */
		value: 'freemarker2.tag-angle.interpolation-bracket'
	},
	// 标签用于括号插值的括号标签
	{
		/** 标签名称 */
		label: 'freemarker2.tag-bracket.interpolation-bracket',
		/** 标签值 */
		value: 'freemarker2.tag-bracket.interpolation-bracket'
	},
	// 标签用于美元插值的自动标签
	{
		/** 标签名称 */
		label: 'freemarker2.tag-auto.interpolation-dollar',
		/** 标签值 */
		value: 'freemarker2.tag-auto.interpolation-dollar'
	},
	// 标签用于括号插值的自动标签
	{
		/** 标签名称 */
		label: 'freemarker2.tag-auto.interpolation-bracket',
		/** 标签值 */
		value: 'freemarker2.tag-auto.interpolation-bracket'
	},

	// 定义编程语言的标签和对应值
	{ label: 'go', value: 'go' }, // Go 语言
	{ label: 'graphql', value: 'graphql' }, // GraphQL
	{ label: 'handlebars', value: 'handlebars' }, // Handlebars 模板
	{ label: 'hcl', value: 'hcl' }, // HCL 语言
	{ label: 'html', value: 'html' }, // HTML
	{ label: 'ini', value: 'ini' }, // INI 文件
	{ label: 'java', value: 'java' }, // Java 语言
	{ label: 'javascript', value: 'javascript' }, // JavaScript 语言
	{ label: 'julia', value: 'julia' }, // Julia 语言
	{ label: 'kotlin', value: 'kotlin' }, // Kotlin 语言
	{ label: 'less', value: 'less' }, // LESS
	{ label: 'lexon', value: 'lexon' }, // Lexon 语言
	{ label: 'lua', value: 'lua' }, // Lua 语言
	{ label: 'liquid', value: 'liquid' }, // Liquid 模板语言
	{ label: 'm3', value: 'm3' }, // M3 语言
	{ label: 'markdown', value: 'markdown' }, // Markdown
	{ label: 'mdx', value: 'mdx' }, // MDX
	{ label: 'mips', value: 'mips' }, // MIPS 汇编语言
	{ label: 'msdax', value: 'msdax' }, // MSDAX
	{ label: 'mysql', value: 'mysql' }, // MySQL 数据库查询语言
	{ label: 'objective-c', value: 'objective-c' }, // Objective-C
	{ label: 'pascal', value: 'pascal' }, // Pascal 语言
	{ label: 'pascaligo', value: 'pascaligo' }, // Pascaligo 语言
	{ label: 'perl', value: 'perl' }, // Perl 语言
	{ label: 'pgsql', value: 'pgsql' }, // PostgreSQL
	{ label: 'php', value: 'php' }, // PHP 语言
	{ label: 'pla', value: 'pla' }, // PLA 语言
	{ label: 'postiats', value: 'postiats' }, // Postiats 语言
	{ label: 'powerquery', value: 'powerquery' }, // Power Query 语言
	{ label: 'powershell', value: 'powershell' }, // PowerShell
	{ label: 'proto', value: 'proto' }, // Protocol Buffers
	{ label: 'pug', value: 'pug' }, // Pug 模板语言
	{ label: 'python', value: 'python' }, // Python 语言
	{ label: 'qsharp', value: 'qsharp' }, // Q# 语言
	{ label: 'r', value: 'r' }, // R 语言
	{ label: 'razor', value: 'razor' }, // Razor 语法
	{ label: 'redis', value: 'redis' }, // Redis
	{ label: 'redshift', value: 'redshift' }, // Redshift 查询语言
	{ label: 'restructuredtext', value: 'restructuredtext' }, // reStructuredText
	{ label: 'ruby', value: 'ruby' }, // Ruby 语言
	{ label: 'rust', value: 'rust' }, // Rust 语言
	{ label: 'sb', value: 'sb' }, // SB 语言
	{ label: 'scala', value: 'scala' }, // Scala 语言
	{ label: 'scheme', value: 'scheme' }, // Scheme 语言
	{ label: 'scss', value: 'scss' }, // SCSS
	{ label: 'shell', value: 'shell' }, // Shell 脚本
	{ label: 'sol', value: 'sol' }, // Solidity 语言
	{ label: 'aes', value: 'aes' }, // AES 加密算法
	{ label: 'sparql', value: 'sparql' }, // SPARQL 查询语言
	{ label: 'sql', value: 'sql' }, // SQL 语言
	{ label: 'st', value: 'st' }, // ST 语言
	{ label: 'swift', value: 'swift' }, // Swift 语言
	{ label: 'systemverilog', value: 'systemverilog' }, // SystemVerilog 语言
	{ label: 'verilog', value: 'verilog' }, // Verilog 语言
	{ label: 'tcl', value: 'tcl' }, // Tcl 语言
	{ label: 'twig', value: 'twig' }, // Twig 模板语言
	{ label: 'typescript', value: 'typescript' }, // TypeScript 语言
	{ label: 'vb', value: 'vb' }, // Visual Basic
	{ label: 'wgsl', value: 'wgsl' }, // WGSL 语言
	{ label: 'xml', value: 'xml' }, // XML
	{ label: 'yaml', value: 'yaml' }, // YAML
	{ label: 'json', value: 'json' } // JSON
]

/**
 * 主题选项数组，包含不同的主题配置
 */
export const themeOptions = [
	/**
	 * 主题标签: 'vs'
	 * 主题值: 'vs'
	 */
	{
		label: 'vs', // 主题名称
		value: 'vs' // 主题值
	},
	/**
	 * 主题标签: 'vs-dark'
	 * 主题值: 'vs-dark'
	 */
	{
		label: 'vs-dark', // 暗色主题
		value: 'vs-dark' // 暗色主题值
	},
	/**
	 * 主题标签: 'hc-black'
	 * 主题值: 'hc-black'
	 */
	{
		label: 'hc-black', // 高对比度黑色主题
		value: 'hc-black' // 高对比度黑色主题值
	},
	/**
	 * 主题标签: 'hc-light'
	 * 主题值: 'hc-light'
	 */
	{
		label: 'hc-light', // 高对比度白色主题
		value: 'hc-light' // 高对比度白色主题值
	}
]
