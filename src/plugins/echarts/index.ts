/**
 * @file index.ts
 * @description ECharts 库的核心模块导入和配置
 * @example
 * // 使用 ECharts
 * import echarts from './index'
 * const chart = echarts.init(document.getElementById('main'));
 * chart.setOption(option);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-11-18
 * @module EChartsCore
 */

// 导入 ECharts 核心模块
import * as echarts from 'echarts/core'

import {
  BarChart, // 导入条形图
  LineChart, // 导入折线图
  PieChart, // 导入饼图
  MapChart, // 导入地图图
  PictorialBarChart, // 导入图示条形图
  RadarChart // 导入雷达图
} from 'echarts/charts' // 从 'echarts/charts' 导入图表类型

import {
  TitleComponent, // 导入标题组件
  TooltipComponent, // 导入工具提示组件
  GridComponent, // 导入网格组件
  PolarComponent, // 导入极坐标组件
  AriaComponent, // 导入辅助功能组件
  ParallelComponent, // 导入平行坐标组件
  LegendComponent // 导入图例组件
} from 'echarts/components' // 从 'echarts/components' 导入组件

// 从 'echarts/renderers' 导入画布渲染器
import { CanvasRenderer } from 'echarts/renderers'

/**
 * 使用 ECharts 的各种组件和图表
 * @param {Array} array - 需要使用的组件和图表数组
 */
echarts.use([
  LegendComponent, // 使用图例组件
  TitleComponent, // 使用标题组件
  TooltipComponent, // 使用工具提示组件
  GridComponent, // 使用网格组件
  PolarComponent, // 使用极坐标组件
  AriaComponent, // 使用辅助功能组件
  ParallelComponent, // 使用平行坐标组件
  BarChart, // 使用条形图
  LineChart, // 使用折线图
  PieChart, // 使用饼图
  MapChart, // 使用地图图
  CanvasRenderer, // 使用画布渲染器
  PictorialBarChart, // 使用图示条形图
  RadarChart // 使用雷达图
])

export default echarts // 导出 ECharts 实例
