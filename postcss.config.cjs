/**
 * @file PostCSS 配置文件
 * @description 配置 PostCSS 插件，用于为 CSS 添加前缀以兼容不同浏览器
 * @example 使用此配置文件，PostCSS 会根据目标浏览器支持情况自动添加必要的前缀
 * @version 1.0.0
 * @date 2024-11-19
 * @module PostCSSConfig
 * @requires autoprefixer
 * @see https://github.com/postcss/autoprefixer
 * @see https://postcss.org/
 * @author [吴尘](https://github.com/wucunping)
 */

module.exports = {
  /**
   * 配置使用的 PostCSS 插件
   */
  plugins: {
    /**
     * Autoprefixer 插件
     * 用于根据目标浏览器自动添加 CSS 前缀
     */
    autoprefixer: {}
  }
}
