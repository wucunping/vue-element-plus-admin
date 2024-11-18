/**
 * @file useGuide.ts
 * @description 引导使用的自定义 Hook
 * @example
 * // 使用例子
 * const { start, stop } = useGuide();
 * start();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-16
 * @module Guide
 */

import { Config, driver } from 'driver.js' // 从 driver.js 导入配置和驱动程序
import 'driver.js/dist/driver.css' // 引入 driver.js 的样式
import { useDesign } from '@/hooks/web/useDesign' // 从自定义的 useDesign Hook 中导入设计变量
import { useI18n } from '@/hooks/web/useI18n' // 从自定义的 useI18n Hook 中导入国际化功能

const { t } = useI18n() // 获取国际化翻译功能

const { variables } = useDesign() // 获取设计变量

/**
 * 自定义 Hook 用于引导使用
 * @param {Config} [options] - 可选的配置参数
 * @returns {Object} 返回驱动对象
 */
export const useGuide = (options?: Config) => {
  // 创建一个驱动实例
  const driverObj = driver(
    // 如果没有传入参数，则使用默认配置
    options || {
      showProgress: true, // 显示进度条
      nextBtnText: t('common.nextLabel'), // 下一步按钮文本
      prevBtnText: t('common.prevLabel'), // 上一步按钮文本
      doneBtnText: t('common.doneLabel'), // 完成按钮文本
      // 步骤数组
      steps: [
        {
          element: `#${variables.namespace}-menu`, // 指定元素选择器
          // 弹出框设置
          popover: {
            title: t('common.menu'), // 弹出框标题
            description: t('common.menuDes'), // 弹出框描述
            side: 'right' // 弹出框位置
          }
        },
        {
          element: `#${variables.namespace}-tool-header`, // 下一个步骤指定元素
          popover: {
            title: t('common.tool'), // 弹出框标题
            description: t('common.toolDes'), // 弹出框描述
            side: 'left' // 弹出框位置
          }
        },
        {
          element: `#${variables.namespace}-tags-view`, // 下一个步骤指定元素
          popover: {
            title: t('common.tagsView'), // 弹出框标题
            description: t('common.tagsViewDes'), // 弹出框描述
            side: 'bottom' // 弹出框位置
          }
        }
      ]
    }
  )

  // 返回驱动对象
  return {
    ...driverObj // 展开并返回所有驱动对象的属性
  }
}
