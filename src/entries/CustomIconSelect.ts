// 子路径入口：只引出本组件，供消费方 `import { X } from '@haven/ui/X'` 使用。
//
// 为什么不把 `./X` 直接指向 .vue 文件：SFC 的导出是 default，消费方就得写成
// `import X from '@haven/ui/X'`，与其余入口风格不一致；
// 为什么不指向桶文件 src/index.ts：桶里有 element-plus 各组件样式的**纯副作用导入**，
// Rollup 摇不掉——入口一旦引用桶，4 个组件的 EP 样式会全部被提升到首屏 CSS
// （实测首屏 CSS 70.6KB → 129.4KB，+58.8KB）。故每个入口只 re-export 单个组件。
export { default as CustomIconSelect } from '../components/CustomIconSelect/index.vue'
