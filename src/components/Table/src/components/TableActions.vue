<script lang="tsx">
/**
 * @file TableActions.vue
 * @description 用于表格操作的组件，包括刷新表格、切换表格尺寸以及列设置功能。
 * @module TableActions
 * @author [吴尘](https://github.com/wucunping)
 * @example
 * <TableActions :columns="columns" @refresh="onRefresh" @changSize="onChangeSize" @confirm="onConfirm" />
 * @version 1.0.0
 * @date 2024-11-22
 * 改过原代码，可能会有问题。
 */

// 引入 Vue 的核心函数 defineComponent 和其他工具函数
import { defineComponent, unref, computed, PropType, ref } from 'vue'
// 引入 Element Plus 的下拉菜单相关组件
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ComponentSize } from 'element-plus'
// 引入自定义的 Icon 组件
import { Icon } from '@/components/Icon'
// 引入国际化工具函数
import { useI18n } from '@/hooks/web/useI18n'
// 引入应用状态管理模块
import { useAppStore } from '@/store/modules/app'
// 引入表格列的类型定义
import { TableColumn } from '../types'
// 引入列设置组件
import ColumnSetting from './ColumnSetting.vue'

// 定义并导出一个 Vue 组件
export default defineComponent({
  // 组件的名称
  name: 'TableActions',
  // 注册子组件
  components: {
    ColumnSetting // 列设置子组件
  },
  // 定义组件的 props
  props: {
    columns: {
      // 列表数据的类型
      type: Array as PropType<TableColumn[]>,
      // 默认值为空数组
      default: () => []
    }
  },
  // 定义组件的事件
  emits: ['refresh', 'changSize', 'confirm'],
  // 组件的 setup 函数
  setup(props, { emit }) {
    // 获取应用状态
    const appStore = useAppStore()
    // 获取国际化工具函数
    const { t } = useI18n()
    // 计算应用状态中的表格尺寸映射
    const sizeMap = computed(() => appStore.sizeMap)
    // 是否显示列设置的状态
    const showSetting = ref(false)

    // 刷新表格的函数
    const refresh = () => {
      emit('refresh') // 触发 refresh 事件
    }

    // 更改表格尺寸的函数
    const changSize = (size: ComponentSize) => {
      emit('changSize', size) // 触发 changSize 事件，传递尺寸
    }

    // 确认列设置的函数
    const confirm = (columns: TableColumn[]) => {
      emit('confirm', columns) // 触发 confirm 事件，传递列数据
    }

    // 显示列设置面板的函数
    const showColumnSetting = () => {
      showSetting.value = true // 将显示列设置状态置为 true
    }

    return () => (
      <>
        {/* 操作按钮区域，右对齐 */}
        <div class="text-right h-28px flex items-center justify-end">
          {/* 刷新按钮 */}
          <div
            title="刷新" // 提示信息
            class="w-30px h-20px flex items-center justify-end"
            onClick={refresh} // 点击触发刷新函数
          >
            <Icon
              icon="vi-ant-design:sync-outlined" // 图标样式
              class="cursor-pointer" // 鼠标悬停时显示为手型
              hover-color="var(--el-color-primary)" // 悬停时图标颜色
            />
          </div>

          {/* 表格尺寸下拉菜单 */}
          <ElDropdown trigger="click" onCommand={changSize}>
            {{
              // 默认显示部分
              default: () => {
                return (
                  <div
                    title="尺寸" // 提示信息
                    class="w-30px h-20px flex items-center justify-end"
                  >
                    <Icon
                      icon="vi-ant-design:column-height-outlined" // 图标样式
                      class="cursor-pointer" // 鼠标悬停时显示为手型
                      hover-color="var(--el-color-primary)" // 悬停时图标颜色
                    />
                  </div>
                )
              },
              // 下拉菜单内容
              dropdown: () => {
                return (
                  <ElDropdownMenu>
                    {{
                      default: () => {
                        // 遍历尺寸映射，生成菜单项
                        return unref(sizeMap).map((v) => {
                          return (
                            <ElDropdownItem key={v} command={v}>
                              {t(`size.${v}`)} {/* 根据当前尺寸映射显示国际化文案 */}
                            </ElDropdownItem>
                          )
                        })
                      }
                    }}
                  </ElDropdownMenu>
                )
              }
            }}
          </ElDropdown>

          {/* 列设置按钮 */}
          <div
            title="列设置" // 提示信息
            class="w-30px h-20px flex items-center justify-end"
            onClick={showColumnSetting} // 点击显示列设置面板
          >
            <Icon
              icon="vi-ant-design:setting-outlined" // 图标样式
              class="cursor-pointer" // 鼠标悬停时显示为手型
              hover-color="var(--el-color-primary)" // 悬停时图标颜色
            />
          </div>
        </div>

        {/* 列设置面板组件 */}
        <ColumnSetting
          v-model={showSetting.value} // 绑定显示状态
          columns={props.columns} // 传递列数据
          onConfirm={confirm} // 绑定确认回调函数
        />
      </>
    )
  }
})
</script>
