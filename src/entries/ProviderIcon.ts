// 子路径入口：只引出 ProviderIcon 一个组件（理由见 ./IconFont.ts）。
//
// 注：本入口**不会**把 element-plus 样式带进首屏——ProviderIcon 自身不依赖任何 EP 组件，
// 它只依赖 IconFont 与纯数据的 @haven/ui/provider。
export { default as ProviderIcon } from '../components/ProviderIcon.vue'
