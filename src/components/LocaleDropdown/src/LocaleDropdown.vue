<script setup lang="ts">
/**
 * @file /src/components/LocaleDropdown/src/LocaleDropdown.vue
 * @description LocaleDropdown 组件，用于切换语言
 * @example 使用方式：<LocaleDropdown color="#000" />
 * @version 1.0.0
 * @date 2024-11-22
 * @module LocaleDropdownComponentModule
 * @author [吴尘](https://github.com/wucunping)
 */

// 从 Vue 引入计算属性和解包工具
import { computed, unref } from 'vue'

// 从 Element Plus 引入 Dropdown 相关组件
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'

// 引入语言模块的状态管理
import { useLocaleStore } from '@/store/modules/locale'

// 引入切换语言的 Hook
import { useLocale } from '@/hooks/web/useLocale'

// 引入 propTypes 工具，用于定义组件属性类型
import { propTypes } from '@/utils/propTypes'

// 引入组件设计工具
import { useDesign } from '@/hooks/web/useDesign'

// 获取样式前缀函数
const { getPrefixCls } = useDesign()

// 定义组件的样式前缀
const prefixCls = getPrefixCls('locale-dropdown')

// 定义组件的属性
defineProps({
  /** 图标颜色 */
  color: propTypes.string.def('') // 定义图标颜色的默认值为空
})

// 获取语言状态管理
const localeStore = useLocaleStore()

// 计算属性：获取语言映射表
const langMap = computed(() => localeStore.getLocaleMap)

// 计算属性：获取当前语言
const currentLang = computed(() => localeStore.getCurrentLocale)

// 方法：设置语言
const setLang = (lang: LocaleType) => {
  if (lang === unref(currentLang).lang) return // 如果选择的语言与当前语言相同，则返回
  window.location.reload() // 重新加载页面，确保语言切换生效
  localeStore.setCurrentLocale({
    lang // 更新状态中的当前语言
  })
  const { changeLocale } = useLocale() // 获取切换语言的方法
  changeLocale(lang) // 切换语言
}
</script>

<template>
  <!-- 下拉菜单容器 -->
  <ElDropdown :class="prefixCls" trigger="click" @command="setLang">
    <!-- 图标
    - :size="18" 设置图标大小
    - icon="vi-ion:language-sharp" 设置图标样式
    - class="cursor-pointer !p-0" 设置图标样式
    - :class="$attrs.class" 继承父组件的类名
    - :color="color" 设置图标颜色
    -->
    <Icon
      :size="18"
      icon="vi-ion:language-sharp"
      class="cursor-pointer !p-0"
      :class="$attrs.class"
      :color="color"
    />
    <!-- 下拉菜单内容 -->
    <template #dropdown>
      <ElDropdownMenu>
        <!-- 遍历语言列表生成菜单项
        - v-for="item in langMap" 遍历语言映射表
        - :key="item.lang" 设置唯一标识
        - :command="item.lang" 设置命令为语言代码
        -->
        <ElDropdownItem v-for="item in langMap" :key="item.lang" :command="item.lang">
          {{ item.name }}
          <!-- 显示语言名称 -->
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
