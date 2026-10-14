/**
 * 平台级「云厂商」数据出口。
 *
 * 消费方用子路径导入：`import { getProviderIcon } from '@haven/ui/provider'`。
 * 该子路径只含纯数据与纯函数（无 Vue、无 element-plus、无任何样式副作用），
 * 故即便被入口引用也不会把任何 CSS 带进首屏。
 */
export { PROVIDER_ICONS, getProviderIcon } from './icons'
