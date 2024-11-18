/**
 * @file useStorage.ts
 * @description 本文件提供了一个自定义 Hook，用于封装对浏览器存储（sessionStorage 和 localStorage）的操作。
 * @module useStorage
 * @example
 * const { setStorage, getStorage, removeStorage, clear } = useStorage('localStorage');
 * setStorage('key', 'value');
 * const value = getStorage('key');
 * removeStorage('key');
 * clear(['excludeKey']);
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 */

/** 获取传入的值的类型 */
const getValueType = (value: any) => {
  const type = Object.prototype.toString.call(value) // 使用 Object.prototype.toString 获取值的类型
  return type.slice(8, -1) // 返回类型字符串中的具体类型名称
}

/**
 * useStorage 自定义 Hook
 * @param type 存储类型，默认值为 'sessionStorage'
 */
export const useStorage = (type: 'sessionStorage' | 'localStorage' = 'sessionStorage') => {
  /**
   * 设置存储
   * @param key 存储的键
   * @param value 存储的值
   */
  const setStorage = (key: string, value: any) => {
    const valueType = getValueType(value) // 获取值的类型
    window[type].setItem(key, JSON.stringify({ type: valueType, value })) // 将键值对存储为 JSON 字符串
  }

  /**
   * 获取存储
   * @param key 存储的键
   * @returns 存储的值，如果不存在则返回 null
   */
  const getStorage = (key: string) => {
    const value = window[type].getItem(key) // 从存储中获取值
    if (value) {
      const { value: val } = JSON.parse(value) // 解析 JSON 字符串并提取实际值
      return val
    } else {
      return value // 如果没有找到，返回 null
    }
  }

  /**
   * 删除存储
   * @param key 存储的键
   */
  const removeStorage = (key: string) => {
    window[type].removeItem(key) // 从存储中删除指定的键
  }

  /**
   * 清除存储
   * @param excludes 可选的排除项数组，指定不需要清除的键
   */
  const clear = (excludes?: string[]) => {
    // 获取存储中的所有键
    const keys = Object.keys(window[type])
    const defaultExcludes = ['dynamicRouter', 'serverDynamicRouter'] // 默认不清楚的键
    const excludesArr = excludes ? [...excludes, ...defaultExcludes] : defaultExcludes // 如果提供了排除项，则合并默认排除项
    const excludesKeys = excludesArr ? keys.filter((key) => !excludesArr.includes(key)) : keys // 获取不在排除项中的键
    // 遍历排除项之外的键并删除
    excludesKeys.forEach((key) => {
      window[type].removeItem(key)
    })
    // window[type].clear() // 注释掉的清空所有存储方法
  }

  // 返回存储操作的接口
  return {
    /** 设置存储 */
    setStorage,
    /** 获取存储 */
    getStorage,
    /** 删除存储 */
    removeStorage,
    /** 清除存储 */
    clear
  }
}
