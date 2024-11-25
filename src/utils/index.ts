/**
 * @file index.ts
 * @description 提供多种工具函数，包括字符串转换、CSS变量设置、时间格式化等。
 * @version 1.0.0
 * @date 2024-11-19
 * @author [吴尘](https://github.com/wucunping)
 */

/**
 * 注册组件并支持别名
 * @param {T} component 需要注册的组件
 * @param {string} [alias] 组件别名（可选）
 * @returns {T & Plugin} 包含插件信息的组件
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component) // 注册组件
    if (alias) {
      app.config.globalProperties[alias] = component // 设置组件别名
    }
  }
  return component as T & Plugin // 返回增强后的组件
}

/**
 * 将驼峰字符串转换为下划线形式
 * @param {string} str 需要转换的字符串
 * @returns {string} 转换后的字符串
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase() // 使用正则表达式转换并转为小写
}

/**
 * 将下划线字符串转换为驼峰形式
 * @param {string} str 需要转换的字符串
 * @returns {string} 转换后的驼峰字符串
 */
export const underlineToHump = (str: string): string => {
  if (!str) return '' // 如果字符串为空，返回空字符串
  return str.replace(/\-(\w)/g, (_, letter: string) => letter.toUpperCase()) // 转换为驼峰
}

/**
 * 将驼峰字符串转换为短横线形式
 * @param {string} str 需要转换的字符串
 * @returns {string} 转换后的字符串
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase() // 使用正则表达式转换并转为小写
}

/**
 * 设置 CSS 变量值
 * @param {string} prop CSS 变量名
 * @param {any} val CSS 变量值
 * @param {HTMLElement} [dom=document.documentElement] 设置目标，默认为根元素
 */
export const setCssVar = (prop: string, val: any, dom = document.documentElement): void => {
  dom.style.setProperty(prop, val) // 设置 CSS 变量值
}

/**
 * 获取 CSS 变量值
 * @param {string} prop CSS 变量名
 * @param {HTMLElement} [dom=document.documentElement] 获取目标，默认为根元素
 * @returns {string} CSS 变量值
 */
export const getCssVar = (prop: string, dom = document.documentElement): string => {
  return getComputedStyle(dom).getPropertyValue(prop) // 获取计算后的 CSS 值
}

/**
 * 查找数组对象的某个下标
 * @param {Array<T>} ary 查找的数组
 * @param {Fn} fn 判断的方法
 * @returns {number} 匹配到的索引值，如果未找到返回 -1
 */
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn) // 如果支持 findIndex，直接调用
  }
  let index = -1 // 初始化索引为 -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary) // 执行判断函数
    if (ret) {
      index = i // 更新索引
      return ret // 提前退出循环
    }
  })
  return index // 返回索引
}

/**
 * 去除字符串两端的空格
 * @param {string} str 输入字符串
 * @returns {string} 去除空格后的字符串
 */
export const trim = (str: string): string => {
  return str.replace(/(^\s*)|(\s*$)/g, '') // 使用正则表达式去除空格
}

/**
 * 格式化时间
 * @param {Date | number | string} time 需要转换的时间
 * @param {string} fmt 格式化模板，如 'yyyy-MM-dd'、'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(time: Date | number | string, fmt: string): string {
  if (!time) return '' // 如果时间无效，返回空字符串
  const date = new Date(time) // 转换为日期对象
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分钟
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) // 替换年份
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length) // 补零
      )
    }
  }
  return fmt // 返回格式化后的字符串
}

/**
 * 生成随机字符串
 * @returns {string} 随机字符串
 */
export function toAnyString(): string {
  return 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0 // 生成随机数
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8 // 替换占位符
    return v.toString(16) // 转换为十六进制
  })
}

/**
 * 将字符串的首字母大写
 * @param {string} str 输入字符串
 * @returns {string} 首字母大写后的字符串
 */
export function firstUpperCase(str: string): string {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()) // 转换为首字母大写
}

/**
 * 将对象转换为 FormData
 * @param {Recordable} obj 输入对象
 * @returns {FormData} 转换后的 FormData
 */
export function objToFormData(obj: Recordable): FormData {
  const formData = new FormData() // 创建 FormData 实例
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]) // 添加键值对
  })
  return formData // 返回 FormData
}
