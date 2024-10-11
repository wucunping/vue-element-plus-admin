/**
 * @file index.ts
 * @description Echarts 数据可视化模块
 * @example
 * // 使用示例
 * import echarts from './index';
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-10
 * @module EchartsModule
 */

// 导入 Echarts 核心模块
import * as echarts from 'echarts/core'

// 导入 Echarts 所需的图表类型
import {
	BarChart, // 导入柱状图
	LineChart, // 导入折线图
	PieChart, // 导入饼图
	MapChart, // 导入地图图
	PictorialBarChart, // 导入图示柱状图
	RadarChart // 导入雷达图
} from 'echarts/charts'

// 导入 Echarts 所需的组件
import {
	TitleComponent, // 导入标题组件
	TooltipComponent, // 导入工具提示组件
	GridComponent, // 导入网格组件
	PolarComponent, // 导入极坐标组件
	AriaComponent, // 导入无障碍组件
	ParallelComponent, // 导入平行坐标组件
	LegendComponent // 导入图例组件
} from 'echarts/components'

// 导入 Echarts 渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 使用 Echarts 的相关组件和图表类型
echarts.use([
	LegendComponent, // 使用图例组件
	TitleComponent, // 使用标题组件
	TooltipComponent, // 使用工具提示组件
	GridComponent, // 使用网格组件
	PolarComponent, // 使用极坐标组件
	AriaComponent, // 使用无障碍组件
	ParallelComponent, // 使用平行坐标组件
	BarChart, // 使用柱状图
	LineChart, // 使用折线图
	PieChart, // 使用饼图
	MapChart, // 使用地图图
	CanvasRenderer, // 使用画布渲染器
	PictorialBarChart, // 使用图示柱状图
	RadarChart // 使用雷达图
])

// 导出 echarts 实例
export default echarts
