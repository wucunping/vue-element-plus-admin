// 导入globals模块，用于定义全局变量
import globals from "globals";
// 导入ESLint的JavaScript插件
import pluginJs from "@eslint/js";
// 导入TypeScript的ESLint插件
import tseslint from "typescript-eslint";
// 导入Vue的ESLint插件
import pluginVue from "eslint-plugin-vue";


export default [
	// 配置需要检查的文件类型，包括.js、.mjs、.cjs、.ts、.vue后缀的文件
	{ files: ["**/*.{js,mjs,cjs,ts,vue}"] },
	// 配置语言选项，设置全局变量为浏览器环境的全局变量
	{ languageOptions: { globals: globals.browser } },
	// 使用ESLint的JavaScript插件的推荐配置
	pluginJs.configs.recommended,
	// 使用TypeScript的ESLint插件的推荐配置
	...tseslint.configs.recommended,
	// 使用Vue的ESLint插件的flat/essential配置
	...pluginVue.configs["flat/essential"],
	// 针对.vue文件，配置语言选项中的解析器为TypeScript的ESLint解析器
	{ files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
	{
		ignores: [
			"src/error/demo.ts", // 全局忽略src/error/demo.ts文件
			// "src/utils/color.ts", // 忽略src/utils/color.ts文件
			// "src/utils/dateUtil.ts", // 忽略src/utils/dateUtil.ts文件
			// "src/utils/domUtils.ts", // 忽略src/utils/domUtils.ts文件
			// "src/utils/index.ts", // 忽略src/utils/index.ts文件
			// "src/utils/is.ts", // 忽略src/utils/is.ts文件
			// "src/utils/propTypes.ts", // 忽略src/utils/propTypes.ts文件
			// "src/utils/routerHelper.ts", // 忽略src/utils/routerHelper.ts文件
			// "src/utils/tree.ts", // 忽略src/utils/tree.ts文件
			// "src/utils/tsxHelper.ts", // 忽略src/utils/tsxHelper.ts文件
		],
	},
	{
		rules: {
			'no-useless-escape': 0, // 禁用无用的转义字符检查，0表示禁用
			'no-undef': 0, // 禁用未定义的变量检查，0表示禁用
			'vue/no-setup-props-destructure': 0, // 禁用在setup函数中对props进行解构，0表示禁用
			'vue/script-setup-uses-vars': 1, // 启用在script setup中使用变量，1表示警告
			'vue/no-reserved-component-names': 0, // 禁用使用保留的组件名，0表示禁用
			'@typescript-eslint/ban-ts-ignore': 0, // 禁用在类型检查中忽略ts-ignore，0表示禁用
			'@typescript-eslint/explicit-function-return-type': 0, // 禁用要求明确指定函数的返回类型，0表示禁用
			'@typescript-eslint/no-explicit-any': 0, // 禁用在类型检查中明确使用any，0表示禁用
			'@typescript-eslint/no-var-requires': 0, // 禁用使用var进行require，0表示禁用
			'@typescript-eslint/no-empty-function': 0, // 禁用空函数的检查，0表示禁用
			'vue/custom-event-name-casing': 0, // 禁用自定义事件名的大小写检查，0表示禁用
			'no-use-before-define': 0, // 禁用在使用前定义的检查，0表示禁用
			'@typescript-eslint/no-use-before-define': 0, // 禁用在ts中使用前定义的检查，0表示禁用
			'@typescript-eslint/ban-ts-comment': 0, // 禁用在ts中使用//注释，0表示禁用
			'@typescript-eslint/ban-types': 0, // 禁用在ts中明确使用某些类型，0表示禁用
			'@typescript-eslint/no-non-null-assertion': 0, // 禁用非空断言的检查，0表示禁用
			'@typescript-eslint/explicit-module-boundary-types': 0, // 禁用明确模块边界类型的检查，0表示禁用
			'@typescript-eslint/no-unused-vars': 0, // 禁用未使用的变量检查，0表示禁用
			'no-unused-vars': 0, // 禁用未使用的变量检查，0表示禁用
			'space-before-function-paren': 0, // 禁用函数参数前空格的检查，0表示禁用

			'vue/attributes-order': 0, // 禁用属性顺序的检查，0表示禁用
			'vue/one-component-per-file': 0, // 禁用一个文件一个组件的检查，0表示禁用
			'vue/html-closing-bracket-newline': 0, // 禁用html闭合标签后是否需要换行的检查，0表示禁用
			'vue/max-attributes-per-line': 0, // 禁用每行最大属性数量的检查，0表示禁用
			'vue/multiline-html-element-content-newline': 0, // 禁用多行html元素内容是否需要换行的检查，0表示禁用
			'vue/singleline-html-element-content-newline': 0, // 禁用单行html元素内容是否需要换行的检查，0表示禁用
			'vue/attribute-hyphenation': 0, // 禁用属性名的连字符检查，0表示禁用
			'vue/require-default-prop': 0, // 禁用要求默认属性的检查，0表示禁用
			'vue/require-explicit-emits': 0, // 禁用要求明确指定emits的检查，0表示禁用
			'vue/html-self-closing': [ // 启用html自闭合标签的检查
				1, // 错误级别为警告
				{
					// 不同的html类型有不同的自闭合规则
					html: {
						void: 'always', // void类型的元素总是自闭合
						normal: 'never', // 正常的元素不自闭合
						component: 'always' // 组件类型的元素总是自闭合
					},
					// svg和math类型总是自闭合
					svg: 'always',
					math: 'always'
				}
			],
			'vue/multi-word-component-names': 0, // 禁用多单词组件名的检查，0表示禁用
			'vue/no-v-html': 0, // 禁用在vue中使用v-html，0表示禁用
			'vue/require-toggle-inside-transition': 0 // 禁用要求在transition中使用toggle，0表示禁用
		}
	}
];
