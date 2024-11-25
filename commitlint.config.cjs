/**
 * @file Commitlint 配置文件
 * @description 用于配置提交信息的格式规则，确保提交信息符合约定规范
 * @example 配置项基于 @commitlint/config-conventional，扩展了自定义的提交类型规则
 * @version 1.0.0
 * @date 2024-11-19
 * @module CommitlintConfig
 * @author [吴尘](https://github.com/wucunping)
 */

module.exports = {
  // 继承的基础配置，使用 Conventional Commits 规范
  extends: ['@commitlint/config-conventional'],

  // 自定义规则配置
  rules: {
    /**
     * type-enum：限定提交类型的枚举值
     * @type {Array}
     * 第一项：2 表示此规则为错误级别（1 表示警告级别）
     * 第二项：'always' 表示此规则必须始终启用
     * 第三项：数组，列出允许的提交类型
     */
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能(feature)
        'fix', // 修复 Bug
        'docs', // 文档更新
        'style', // 代码格式或样式修改（不影响代码逻辑）
        'refactor', // 代码重构（非新增功能，非修复 Bug）
        'perf', // 性能优化
        'test', // 测试相关内容
        'ci', // 持续集成配置修改
        'chore', // 构建过程或工具的变动
        'revert', // 回滚到上一个版本
        'workflow', // 工作流相关改进
        'mod', // 其他不确定的修改
        'wip', // 开发中的提交
        'types', // 类型声明的修改
        'release' // 版本发布
      ]
    ],

    /**
     * subject-full-stop：不强制要求提交信息的描述以句号结束
     * @type {Array}
     * 第一项：0 表示此规则不启用
     * 第二项：'never' 表示不允许有句号（但已禁用规则）
     */
    'subject-full-stop': [0, 'never'],

    /**
     * subject-case：不强制限制提交信息的描述大小写
     * @type {Array}
     * 第一项：0 表示此规则不启用
     * 第二项：'never' 表示不限制大小写（但已禁用规则）
     */
    'subject-case': [0, 'never']
  }
}
