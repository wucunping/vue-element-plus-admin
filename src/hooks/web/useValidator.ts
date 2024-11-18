/**
 * @file useValidator.ts
 * @description 表单验证规则的自定义钩子，提供常用的验证方法
 * @example
 * const validator = useValidator();
 * const rules = {
 *   phone: [validator.required(), validator.phone()]
 * };
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module Validation
 */

import { useI18n } from '@/hooks/web/useI18n' // 引入国际化钩子
import { FormItemRule } from 'element-plus' // 引入 Element Plus 的表单项规则类型

const { t } = useI18n() // 调用 useI18n 钩子并获取翻译函数 t

/**
 * 定义长度范围接口
 * @interface LengthRange
 */
interface LengthRange {
  /** 最小长度 */
  min: number
  /** 最大长度 */
  max: number
  /** 可选的错误消息 */
  message?: string
}

/**
 * 自定义验证器钩子
 * @returns {Object} 验证规则集合
 */
export const useValidator = () => {
  /**
   * 必填验证规则
   * @param {string} message - 错误消息
   * @returns {FormItemRule} 表单项规则
   */
  const required = (message?: string): FormItemRule => {
    return {
      required: true, // 设置为必填
      message: message || t('common.required') // 错误消息
    }
  }

  /**
   * 长度范围验证规则
   * @param {LengthRange} options - 长度范围配置
   * @returns {FormItemRule} 表单项规则
   */
  const lengthRange = (options: LengthRange): FormItemRule => {
    const { min, max, message } = options // 解构参数

    return {
      min, // 最小长度
      max, // 最大长度
      message: message || t('common.lengthRange', { min, max }) // 错误消息
    }
  }

  /**
   * 不允许空格的验证规则
   * @param {string} message - 错误消息
   * @returns {FormItemRule} 表单项规则
   */
  const notSpace = (message?: string): FormItemRule => {
    return {
      // 自定义验证函数
      validator: (_, val, callback) => {
        // 如果包含空格
        if (val?.indexOf(' ') !== -1) {
          callback(new Error(message || t('common.notSpace'))) // 调用回调函数返回错误
        } else {
          callback() // 验证通过
        }
      }
    }
  }

  /**
   * 不允许特殊字符的验证规则
   * @param {string} message - 错误消息
   * @returns {FormItemRule} 表单项规则
   */
  const notSpecialCharacters = (message?: string): FormItemRule => {
    return {
      // 自定义验证函数
      validator: (_, val, callback) => {
        // 如果包含特殊字符
        if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
          callback(new Error(message || t('common.notSpecialCharacters'))) // 调用回调函数返回错误
        } else {
          callback() // 验证通过
        }
      }
    }
  }

  /**
   * 手机号码验证规则
   * @param {string} message - 错误消息
   * @returns {FormItemRule} 表单项规则
   */
  const phone = (message?: string): FormItemRule => {
    return {
      // 自定义验证函数
      validator: (_, val, callback) => {
        if (!val) return callback() // 如果值为空，直接通过
        // 检查手机号码格式
        if (!/^1[3456789]\d{9}$/.test(val)) {
          callback(new Error(message || '请输入正确的手机号码')) // 调用回调函数返回错误
        } else {
          callback() // 验证通过
        }
      }
    }
  }

  /**
   * 邮箱验证规则
   * @param {string} message - 错误消息
   * @returns {FormItemRule} 表单项规则
   */
  const email = (message?: string): FormItemRule => {
    return {
      // 自定义验证函数
      validator: (_, val, callback) => {
        if (!val) return callback() // 如果值为空，直接通过
        // 检查邮箱格式
        if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(val)) {
          callback(new Error(message || '请输入正确的邮箱')) // 调用回调函数返回错误
        } else {
          callback() // 验证通过
        }
      }
    }
  }

  /**
   * 最大长度验证规则
   * @param {number} max - 最大长度
   * @returns {FormItemRule} 表单项规则
   */
  const maxlength = (max: number): FormItemRule => {
    return {
      max, // 最大长度
      message: '长度不能超过' + max + '个字符' // 错误消息
    }
  }

  /**
   * 校验的验证规则
   * @param {string} message - 错误消息
   * @returns {FormItemRule} 表单项规则
   */
  const check = (message?: string): FormItemRule => {
    return {
      // 自定义验证函数
      validator: (_, val, callback) => {
        // 如果值为空
        if (!val) {
          callback(new Error(message || t('common.required'))) // 调用回调函数返回错误
        } else {
          callback() // 验证通过
        }
      }
    }
  }

  return {
    /** 必填验证规则 */
    required,
    /** 长度范围验证规则 */
    lengthRange,
    /** 不允许空格的验证规则 */
    notSpace,
    /** 不允许特殊字符的验证规则 */
    notSpecialCharacters,
    /** 手机号码验证规则 */
    phone,
    /** 邮箱验证规则 */
    email,
    /** 最大长度验证规则 */
    maxlength,
    /** 校验的验证规则 */
    check
  }
}
