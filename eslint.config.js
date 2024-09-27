// 引入vue模版的eslint
import pluginVue from 'eslint-plugin-vue'
// 引入@eslint/js的eslint，这里其实和'eslint'包是一样的，只是稍微精确一些
import eslint from '@eslint/js'
// 引入ts-eslint解析器，使 eslint 可以解析 ts 语法
import tseslint from 'typescript-eslint'
// 引入vue文件解析器
import vueParser from 'vue-eslint-parser'
// 引入prettier插件，这个插件可以整合prettier到eslint中
import prettier from 'eslint-plugin-prettier'

// 导出eslint的配置
export default tseslint.config({
	// 注释：可以指定eslint忽略的文件和文件夹，这里被注释掉了
	ignores: [
		"src/error/demo.ts", // 全局忽略src/error/demo.ts文件
		"src/utils/color.ts", // 忽略src/utils/color.ts文件
		"src/utils/dateUtil.ts", // 忽略src/utils/dateUtil.ts文件
		"src/utils/domUtils.ts", // 忽略src/utils/domUtils.ts文件
		"src/utils/index.ts", // 忽略src/utils/index.ts文件
		"src/utils/is.ts", // 忽略src/utils/is.ts文件
		"src/utils/propTypes.ts", // 忽略src/utils/propTypes.ts文件
		"src/utils/routerHelper.ts", // 忽略src/utils/routerHelper.ts文件
		"src/utils/tree.ts", // 忽略src/utils/tree.ts文件
		"src/utils/tsxHelper.ts", // 忽略src/utils/tsxHelper.ts文件
	],
	// 指定eslint需要检查和处理的文件，这里包括src目录下的所有.ts、.tsx和.vue文件
	files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
	// tseslint.config添加了extends扁平函数，直接用。否则是eslint9.0版本是没有extends的
	extends: [
		// 使用eslint的推荐配置
		eslint.configs.recommended,
		// 使用ts-eslint的推荐配置
		...tseslint.configs.recommended,
		// 使用vue模版的eslint配置，选择'flat/essential'这个配置
		...pluginVue.configs['flat/essential']
	],
	// 指定使用的插件
	plugins: {
		prettier // 使用prettier插件
	},
	// 指定语言和解析器的选项
	languageOptions: {
		// 使用vue解析器，这个可以识别vue文件
		parser: vueParser,
		// 在vue文件上使用ts解析器
		parserOptions: {
			parser: tseslint.parser,
			// 指定解析器的源码类型为模块
			sourceType: 'module',
			// 指定ECMAScript的版本为2020
			ecmaVersion: 2020,
			// 启用JSX语法支持
			ecmaFeatures: {
				jsx: true
			}
		}
	},
	// 指定eslint的规则
	rules: {
		'prettier/prettier': 'error', // 启用prettier规则，错误级别为error
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
})
