import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

/**
 * 本包**只发源码，不构建产物**（见 README「为什么不构建」）：
 * 消费方以 pnpm `link:` / git 依赖引入，pnpm 的符号链接使其真实路径位于
 * node_modules 之外，因此消费方 Vite 会把它当普通源码编译，
 * unplugin-vue-components 的自动导入与按需样式照常生效（该插件按路径排除
 * node_modules，符号链接解析后的真实路径不含 node_modules）。
 *
 * 这里只保留测试所需配置；组件内部仍显式引入 Element Plus 组件与样式，
 * 以保证即使将来改为预编译产物也不会静默失效。
 */
export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'],
        // 组件内显式引入 element-plus 按需样式（见 README 贡献须知第 1 条）。这些 .css
        // 位于 element-plus 子路径，若被 Vitest 外部化交给 Node 原生加载会报
        // "Unknown file extension .css"；内联交给 Vite 处理即可（css 默认仅被 stub）。
        server: {
            deps: {
                inline: [/element-plus/],
            },
        },
    },
})
