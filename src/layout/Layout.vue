<script lang="tsx">
/**
 * @file Layout.vue
 * @description 该文件定义了布局组件，提供不同样式的布局选项，并处理一些UI交互逻辑。
 * @example
 * <Layout />
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module layout
 */

import { computed, defineComponent, unref } from 'vue' // 导入 Vue 的基础功能
import { useAppStore } from '@/store/modules/app' // 导入应用状态管理模块
import { Backtop } from '@/components/Backtop' // 导入回到顶部组件
import { Setting } from '@/components/Setting' // 导入设置组件
import { useRenderLayout } from './components/useRenderLayout' // 导入布局渲染的自定义钩子
import { useDesign } from '@/hooks/web/useDesign' // 导入设计相关的自定义钩子

const { getPrefixCls } = useDesign() // 获取前缀类名的方法

const prefixCls = getPrefixCls('layout') // 定义前缀类名

const appStore = useAppStore() // 获取应用状态管理实例

const mobile = computed(() => appStore.getMobile) // 是否是移动端的计算属性

const collapse = computed(() => appStore.getCollapse) // 菜单折叠状态的计算属性

const layout = computed(() => appStore.getLayout) // 布局类型的计算属性

// 是否隐藏全局设置的计算属性
const hideSetting = computed(() => import.meta.env.VITE_HIDE_GLOBAL_SETTING === 'true')

// 点击外部区域时的处理函数
const handleClickOutside = () => {
  appStore.setCollapse(true)
}

/**
 * 渲染布局的函数，根据当前布局类型返回不同的 JSX。
 * @returns {JSX.Element} 返回对应布局的 JSX 元素。
 */
const renderLayout = () => {
  // 解构自定义渲染布局的函数
  const { renderClassic, renderTopLeft, renderTop, renderCutMenu } = useRenderLayout()

  // 根据布局类型选择渲染方法
  switch (unref(layout)) {
    case 'classic':
      return renderClassic() // 返回经典布局
    case 'topLeft':
      return renderTopLeft() // 返回顶部左侧布局
    case 'top':
      return renderTop() // 返回顶部布局
    case 'cutMenu':
      return renderCutMenu() // 返回切割菜单布局
    default:
      break // 默认情况，不执行任何操作
  }
}

// 定义并导出布局组件
export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      // 渲染组件的 JSX 元素
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? ( // 如果是移动端且菜单未折叠
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            // 点击时调用处理函数
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {/* 渲染布局 */}
        {renderLayout()}

        {/* 渲染回到顶部组件 */}
        <Backtop></Backtop>

        {/* 如果未隐藏设置，则渲染设置组件 */}
        {!unref(hideSetting) && <Setting></Setting>}
      </section>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-layout'; // 定义一个变量，存储带有命名空间的布局类前缀

// 设置布局组件的背景颜色
.@{prefix-cls} {
  // 使用之前定义的变量作为类选择器
  background-color: var(--app-content-bg-color); // 设置背景颜色为应用程序内容背景颜色的变量值
}
</style>
