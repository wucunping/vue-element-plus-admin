/**
 * @file index.ts
 * @description 这是一个入口文件，用于导入并导出登录和注册表单组件，便于在其他模块中使用。
 * @example import { LoginForm, RegisterForm } from './index'
 * @version 1.0
 * @author [吴尘](https://github.com/wucunping)
 * @date 2024-10-09
 * @module FormComponents
 */

// 导入登录表单组件
import LoginForm from './LoginForm.vue'

// 导入注册表单组件
import RegisterForm from './RegisterForm.vue'

// 导出登录和注册表单组件
export { LoginForm, RegisterForm }
