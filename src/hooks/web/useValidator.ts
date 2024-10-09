/**
 * @file useValidator.ts
 * @description 自定义校验器 hook，提供多种表单项的验证规则，如必填、长度范围、手机号码等。
 * @example
 * const validator = useValidator();
 * const rules = {
 *   username: [validator.required()],
 *   phone: [validator.phone()]
 * };
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-09-26
 * @module Validator
 */

import { useI18n } from '@/hooks/web/useI18n' // 导入国际化相关的 hook
import type { FormItemRule } from 'element-plus' // 导入 Element Plus 的表单项规则类型

// 初始化国际化的翻译函数
const { t } = useI18n()

/**
 * 定义长度范围接口
 */
interface LengthRange {
	min: number // 最小长度
	max: number // 最大长度
	message?: string // 可选的错误信息
}

/**
 * @function useValidator
 * @description 自定义 hook，提供表单验证规则
 * @returns {Object} - 返回一组验证规则函数
 */
export const useValidator = () => {
	/**
	 * @function required
	 * @description 必填项验证
	 * @param {string} [message] - 可选的错误消息
	 * @returns {FormItemRule} - 验证规则
	 */
	const required = (message?: string): FormItemRule => {
		return {
			required: true, // 此项为必填
			message: message || t('common.required') // 返回错误消息，缺省为国际化消息
		}
	}

	/**
	 * @function lengthRange
	 * @description 长度范围验证
	 * @param {LengthRange} options - 包含 min 和 max 的长度范围
	 * @returns {FormItemRule} - 验证规则
	 */
	const lengthRange = (options: LengthRange): FormItemRule => {
		const { min, max, message } = options // 解构获取最小和最大长度及消息

		return {
			min, // 最小长度的条件
			max, // 最大长度的条件
			message: message || t('common.lengthRange', { min, max }) // 返回错误消息，缺省为国际化消息
		}
	}

	/**
	 * @function notSpace
	 * @description 不能包含空格的验证
	 * @param {string} [message] - 可选的错误消息
	 * @returns {FormItemRule} - 验证规则
	 */
	const notSpace = (message?: string): FormItemRule => {
		return {
			validator: (_, val, callback) => {
				// 自定义验证函数
				if (val?.indexOf(' ') !== -1) {
					// 检查是否包含空格
					callback(new Error(message || t('common.notSpace'))) // 返回错误消息
				} else {
					callback() // 验证通过
				}
			}
		}
	}

	/**
	 * @function notSpecialCharacters
	 * @description 不能包含特殊字符的验证
	 * @param {string} [message] - 可选的错误消息
	 * @returns {FormItemRule} - 验证规则
	 */
	const notSpecialCharacters = (message?: string): FormItemRule => {
		return {
			validator: (_, val, callback) => {
				// 自定义验证函数
				if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
					// 正则检查特殊字符
					callback(new Error(message || t('common.notSpecialCharacters'))) // 返回错误消息
				} else {
					callback() // 验证通过
				}
			}
		}
	}

	/**
	 * @function phone
	 * @description 手机号码格式验证
	 * @param {string} [message] - 可选的错误消息
	 * @returns {FormItemRule} - 验证规则
	 */
	const phone = (message?: string): FormItemRule => {
		return {
			validator: (_, val, callback) => {
				// 自定义验证函数
				if (!val) return callback() // 如果值为空，则通过验证
				if (!/^1[3456789]\d{9}$/.test(val)) {
					// 检查手机号格式
					callback(new Error(message || '请输入正确的手机号码')) // 返回错误消息
				} else {
					callback() // 验证通过
				}
			}
		}
	}

	/**
	 * @function email
	 * @description 邮箱格式验证
	 * @param {string} [message] - 可选的错误消息
	 * @returns {FormItemRule} - 验证规则
	 */
	const email = (message?: string): FormItemRule => {
		return {
			validator: (_, val, callback) => {
				// 自定义验证函数
				if (!val) return callback() // 如果值为空，则通过验证
				if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(val)) {
					// 检查邮箱格式
					callback(new Error(message || '请输入正确的邮箱')) // 返回错误消息
				} else {
					callback() // 验证通过
				}
			}
		}
	}

	/**
	 * @function maxlength
	 * @description 最大长度验证
	 * @param {number} max - 最大字符数
	 * @returns {FormItemRule} - 验证规则
	 */
	const maxlength = (max: number): FormItemRule => {
		return {
			max, // 设置最大长度条件
			message: '长度不能超过' + max + '个字符' // 返回错误消息
		}
	}

	/**
	 * @function check
	 * @description 检查是否为必填项
	 * @param {string} [message] - 可选的错误消息
	 * @returns {FormItemRule} - 验证规则
	 */
	const check = (message?: string): FormItemRule => {
		return {
			validator: (_, val, callback) => {
				// 自定义验证函数
				if (!val) {
					// 如果值为空
					callback(new Error(message || t('common.required'))) // 返回错误消息
				} else {
					callback() // 验证通过
				}
			}
		}
	}

	// 返回一组验证规则
	return {
		required, // 返回必填验证规则
		lengthRange, // 返回长度范围验证规则
		notSpace, // 返回不包含空格的验证规则
		notSpecialCharacters, // 返回不包含特殊字符的验证规则
		phone, // 返回手机号码格式验证规则
		email, // 返回邮箱格式验证规则
		maxlength, // 返回最大长度验证规则
		check // 返回必填检查验证规则
	}
}
