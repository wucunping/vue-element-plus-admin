/**
 * @file useGuide.ts
 * @description 定义一个名为useGuide的自定义钩子函数，用于创建带有引导提示的页面导航。
 * @example
 * 导入useGuide钩子并使用返回的driver实例
 * import { useGuide } from '@/hooks/web/useGuide'
 * const guide = useGuide({
 *   showProgress: false,
 *   nextBtnText: 'Next',
 *   prevBtnText: 'Prev',
 *   doneBtnText: 'Done',
 *   steps: [
 *     {
 *       element: '#app-menu',
 *       popover: {
 *         title: 'Menu',
 *         description: 'This is the main menu.',
 *         side: 'right'
 *       }
 *     },
 *     ...
 *   ]
 * })
 *
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-25
 */

// 引入driver.js库及其样式，用于实现页面引导功能
import { Config, driver } from 'driver.js'
import 'driver.js/dist/driver.css'
// 引入useDesign自定义hook，用于获取设计变量
import { useDesign } from '@/hooks/web/useDesign'
// 引入useI18n自定义hook，用于支持国际化
import { useI18n } from '@/hooks/web/useI18n'

// 使用useI18n hook，并解构出t函数，用于获取翻译后的文本
const { t } = useI18n()

// 使用useDesign hook，并解构出variables对象，用于获取设计变量（如命名空间等）
const { variables } = useDesign()

/**
 * useGuide自定义hook
 * @param options Config类型，可选，driver.js的配置选项
 * @returns 返回一个对象，包含driver.js实例的所有方法和属性
 */
export const useGuide = (options?: Config) => {
	// 调用driver函数，传入配置选项（若外部未传入，则使用默认配置），创建一个driver.js实例
	const driverObj = driver(
		options || {
			// 显示进度条
			showProgress: true,
			// 下一步按钮文本
			nextBtnText: t('common.nextLabel'),
			// 上一步按钮文本
			prevBtnText: t('common.prevLabel'),
			// 完成按钮文本
			doneBtnText: t('common.doneLabel'),
			// 引导步骤数组
			steps: [
				{
					// 要高亮显示的元素选择器
					element: `#${variables.namespace}-menu`,
					// 弹出框配置
					popover: {
						// 弹出框标题
						title: t('common.menu'),
						// 弹出框描述
						description: t('common.menuDes'),
						// 弹出框位置（相对于高亮元素）
						side: 'right'
					}
				},
				{
					element: `#${variables.namespace}-tool-header`,
					popover: {
						title: t('common.tool'),
						description: t('common.toolDes'),
						side: 'left'
					}
				},
				{
					element: `#${variables.namespace}-tags-view`,
					popover: {
						title: t('common.tagsView'),
						description: t('common.tagsViewDes'),
						side: 'bottom'
					}
				}
			]
		}
	)

	// 返回driver.js实例的所有方法和属性（使用展开运算符）
	return {
		...driverObj
	}
}
