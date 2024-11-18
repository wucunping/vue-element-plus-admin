<script lang="tsx">
/**
 * @file ToolHeader.vue
 * @description 工具栏组件，提供了界面的一些基本操作功能。
 * @example <ToolHeader />
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module ToolHeader
 */

import { defineComponent, computed } from 'vue' // 导入 Vue 相关的功能
// 导入其他组件
import { Collapse } from '@/components/Collapse' // 折叠组件
import { LocaleDropdown } from '@/components/LocaleDropdown' // 语言选择下拉框
import { SizeDropdown } from '@/components/SizeDropdown' // 尺寸选择下拉框
import { UserInfo } from '@/components/UserInfo' // 用户信息组件
import { Screenfull } from '@/components/Screenfull' // 全屏组件
import { Breadcrumb } from '@/components/Breadcrumb' // 面包屑组件
import { useAppStore } from '@/store/modules/app' // 应用状态管理
import { useDesign } from '@/hooks/web/useDesign' // 自定义设计钩子

const { getPrefixCls, variables } = useDesign() // 获取设计相关的前缀类和变量

const prefixCls = getPrefixCls('tool-header') // 获取工具栏的前缀类名

const appStore = useAppStore() // 获取应用状态管理

const breadcrumb = computed(() => appStore.getBreadcrumb) // 计算属性：面包屑

const hamburger = computed(() => appStore.getHamburger) // 计算属性：折叠图标状态

const screenfull = computed(() => appStore.getScreenfull) // 计算属性：全屏图标状态

const size = computed(() => appStore.getSize) // 计算属性：尺寸图标状态

const layout = computed(() => appStore.getLayout) // 计算属性：布局状态

const locale = computed(() => appStore.getLocale) // 计算属性：多语言图标状态

// 定义组件
export default defineComponent({
  name: 'ToolHeader', // 组件名称
  // 组件的设置函数
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`} // 设置元素 ID
        class={[
          prefixCls, // 类名
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between' // 样式类
        ]}
      >
        {layout.value !== 'top' ? ( // 检查布局是否不是顶部
          //容器 div
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? ( // 检查折叠图标状态
              <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse> // 折叠组件
            ) : undefined}
            {/* 面包屑组件 */}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        {/* 第二个容器 div */}
        <div class="h-full flex items-center">
          {screenfull.value ? ( // 检查全屏图标状态
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull> // 全屏组件
          ) : undefined}
          {size.value ? ( // 检查尺寸图标状态
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown> // 尺寸选择下拉框
          ) : undefined}
          {locale.value ? ( // 检查多语言图标状态
            <LocaleDropdown
              class="custom-hover" // 自定义样式类
              color="var(--top-header-text-color)" // 颜色
            ></LocaleDropdown>
          ) : undefined}
          <UserInfo></UserInfo> {/* 用户信息组件 */}
        </div>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-tool-header'; // 定义前缀类名，使用adminNamespace变量

// 使用前缀类名创建一个新的样式规则
.@{prefix-cls} {
  transition: left var(--transition-time-02); // 为左侧属性设置过渡效果，持续时间由--transition-time-02变量控制
}
</style>
