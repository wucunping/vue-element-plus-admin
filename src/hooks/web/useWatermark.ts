/**
 * @file useWatermark.ts
 * @description 实现水印功能的自定义 Hook。
 * @example
 * const { setWatermark, clear } = useWatermark();
 * setWatermark('示例水印');
 * clear();
 * @version 1.0.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-17
 * @module Watermark
 */

const domSymbol = Symbol('watermark-dom') // 声明一个独一无二的 Symbol，用于标识水印 DOM 元素

/**
 * 自定义 Hook，用于添加和清除水印
 * @param {HTMLElement | null} appendEl - 要附加水印的 HTML 元素，默认为 document.body
 * @returns {{ setWatermark: Function, clear: Function }} - 返回设置水印和清除水印的功能
 */
export function useWatermark(appendEl: HTMLElement | null = document.body) {
  let func: Fn = () => {} // 定义一个初始的空函数
  const id = domSymbol.toString() // 将 Symbol 转换为字符串形式，作为 DOM 元素的 ID

  /**
   * 清除水印的方法
   */
  const clear = () => {
    const domId = document.getElementById(id) // 获取当前水印元素
    if (domId) {
      const el = appendEl // 获取附加元素
      el && el.removeChild(domId) // 如果存在，则将水印元素移除
    }
    window.removeEventListener('resize', func) // 移除窗口大小改变的事件监听
  }

  /**
   * 创建水印的方法
   * @param {string} str - 要显示的水印文本
   */
  const createWatermark = (str: string) => {
    clear() // 先清除已有水印

    const can = document.createElement('canvas') // 创建一个 canvas 元素
    can.width = 300 // 设置 canvas 的宽度
    can.height = 240 // 设置 canvas 的高度

    const cans = can.getContext('2d') // 获取 canvas 的 2D 上下文
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120) // 旋转 canvas 上下文
      cans.font = '15px Vedana' // 设置字体样式
      cans.fillStyle = 'rgba(0, 0, 0, 0.15)' // 设置填充颜色
      cans.textAlign = 'left' // 设置文本对齐方式
      cans.textBaseline = 'middle' // 设置文本基线
      cans.fillText(str, can.width / 20, can.height) // 在 canvas 上绘制水印文本
    }

    const div = document.createElement('div') // 创建一个 div 元素用来显示水印
    div.id = id // 为 div 设置 ID
    div.style.pointerEvents = 'none' // 禁用 pointer 事件
    div.style.top = '0px' // 设置 div 的顶部位置
    div.style.left = '0px' // 设置 div 的左侧位置
    div.style.position = 'absolute' // 设置定位方式为绝对定位
    div.style.zIndex = '100000000' // 设置 z-index 以保证水印在最上层
    div.style.width = document.documentElement.clientWidth + 'px' // 设置宽度为视口宽度
    div.style.height = document.documentElement.clientHeight + 'px' // 设置高度为视口高度
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat' // 设置 div 背景为水印图案
    const el = appendEl // 获取附加元素
    el && el.appendChild(div) // 如果存在，则将新创建的水印 div 附加到指定元素
    return id // 返回水印 ID
  }

  /**
   * 设置水印的方法
   * @param {string} str - 要显示的水印文本
   */
  function setWatermark(str: string) {
    createWatermark(str) // 创建水印
    func = () => {
      createWatermark(str) // 在窗口变化时重新创建水印
    }
    window.addEventListener('resize', func)
  }

  return { setWatermark, clear } // 添加窗口大小改变的事件监听
}
