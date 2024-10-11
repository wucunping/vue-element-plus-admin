<script setup lang="ts">
/**
 * @file Avatars.vue
 * @description 该组件用于展示用户头像，支持展示多个头像和工具提示
 * @example
 * <Avatars :data="avatarList" :max="5" :size="'large'" />
 *
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module AvatarsComponent
 */

/**
 * @description 引入 Element Plus 组件的类型
 * @typedef {ComponentSize}
 */
import type { ComponentSize } from 'element-plus'

/**
 * @description 引入 Element Plus 中的 ElAvatar 和 ElTooltip 组件
 */
import { ElAvatar, ElTooltip } from 'element-plus'

/**
 * @description 引入 Vue PropType 类型
 */
import type { PropType } from 'vue'

/**
 * @description 引入 computed 函数
 */
import { computed } from 'vue'

/**
 * @description 引入 AvatarItem 类型
 */
import type { AvatarItem } from './types'

/**
 * @description 引入自定义设计钩子
 */
import { useDesign } from '@/hooks/web/useDesign'

// 使用设计钩子以获取前缀类名的函数
const { getPrefixCls } = useDesign()

// 获取 avatars 组件的前缀类名
const prefixCls = getPrefixCls('avatars')

/**
 * @description 定义组件的 props
 */
const props = defineProps({
	/**
	 * @description 头像的尺寸
	 * @type {ComponentSize | number}
	 * @default ''
	 */
	size: {
		type: [String, Number] as PropType<ComponentSize | number>,
		default: ''
	},
	/**
	 * @description 可展示的最大头像数量
	 * @type {Number}
	 * @default 5
	 */
	max: {
		type: Number,
		default: 5
	},
	/**
	 * @description 头像数据数组
	 * @type {AvatarItem[]}
	 * @default () => []
	 */
	data: {
		type: Array as PropType<AvatarItem[]>,
		default: () => []
	},
	/**
	 * @description 是否显示工具提示
	 * @type {Boolean}
	 * @default true
	 */
	showTooltip: {
		type: Boolean,
		default: true
	}
})

/**
 * @description 计算过滤后的头像数据，仅保留前 max 个元素
 * @returns {AvatarItem[]} 过滤后的头像数据
 */
const filterData = computed(() => props.data.slice(0, props.max))

/*
<template>
    <div :class="prefixCls" class="flex items-center">
        <template v-for="item in filterData" :key="item.url">
            <template v-if="showTooltip && item.name">
                <ElTooltip :content="item.name" placement="top">
                    <ElAvatar
                        :size="size"  // 设置头像大小
                        :src="item.url"  // 设置头像图片源
                        class="relative"  // 设置相对定位
                        :style="{
                            zIndex: filterData.indexOf(item)  // 根据索引设置层级
                        }"
                    />
                </ElTooltip>
            </template>
            <template v-else>
                <ElAvatar
                    :size="size"  // 设置头像大小
                    :src="item.url"  // 设置头像图片源
                    class="relative"  // 设置相对定位
                    :style="{
                        zIndex: filterData.indexOf(item)  // 根据索引设置层级
                    }"
                />
            </template>
        </template>

        <ElAvatar
            v-if="data.length > max"  // 当头像数量超过最大值时
            :style="{
                zIndex: data.length  // 设置层级为数据长度
            }"
        >
            <span>+{{ data.length - max }}</span>  // 显示超出数量
        </ElAvatar>
    </div>
</template>
*/
</script>

<template>
	<div :class="prefixCls" class="flex items-center">
		<template v-for="item in filterData" :key="item.url">
			<template v-if="showTooltip && item.name">
				<ElTooltip :content="item.name" placement="top">
					<ElAvatar
						:size="size"
						:src="item.url"
						class="relative"
						:style="{
							zIndex: filterData.indexOf(item)
						}"
					/>
				</ElTooltip>
			</template>
			<template v-else>
				<ElAvatar
					:size="size"
					:src="item.url"
					class="relative"
					:style="{
						zIndex: filterData.indexOf(item)
					}"
				/>
			</template>
		</template>

		<ElAvatar
			v-if="data.length > max"
			:style="{
				zIndex: data.length
			}"
		>
			<span>+{{ data.length - max }}</span>
		</ElAvatar>
	</div>
</template>

<style scoped lang="less">
@prefix-cls: ~'@{adminNamespace}-avatars'; // 定义前缀类名

.@{prefix-cls} {
	.@{elNamespace}-avatar + .@{elNamespace}-avatar {
		// 同类头像之间的样式
		margin-left: -15px; // 设置头像间距
	}
}
</style>
