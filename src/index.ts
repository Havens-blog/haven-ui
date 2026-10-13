/**
 * @haven/ui —— 平台共享前端组件（叶子组件层）公共出口。
 *
 * 边界规则（写入边界，避免这个包变成新的混乱中心）：
 * 1. 只收**叶子组件**：无业务语义、无应用级依赖（不 import 任何应用的 `@/` 模块）；
 * 2. 不收**外壳组件**：侧边栏 / 顶栏 / 租户切换 / 应用切换承载导航模型、权限模型、
 *    租户上下文与应用注册表——它们的统一方式是"先统一数据与契约"，不是抽包
 *    （见 docs/proposals/frontend-shared-components/proposal.md）；
 * 3. 每个组件必须**显式引入**其使用的 Element Plus 组件与按需样式——消费方没有全局
 *    注册 Element Plus（依赖 unplugin-vue-components 构建期自动导入），预编译产物
 *    若退化为 resolveComponent 运行时查找会**静默**渲染失败。
 *
 * 首批（与 e-cam-web 逐字节相同、零分歧迁移）：IconFont / ManagerHeader /
 * AssetExportDialog / CustomIconSelect。
 * 待办：ProviderIcon（依赖 @/utils/constants 的 getProviderConfig 与 @/utils/icon-mapping，
 * 需先把该片段下沉到包内）。
 */

export { default as IconFont } from './components/IconFont/index.vue'
export { default as ManagerHeader } from './components/ManagerHeader/index.vue'

export { default as AssetExportDialog } from './components/AssetExportDialog.vue'
export type { ExportFieldConfig } from './components/AssetExportDialog.vue'

export { default as CustomIconSelect } from './components/CustomIconSelect/index.vue'
export {
    commonIconList,
    fillIconList,
    linearIconList,
    multicolorIconList,
} from './components/CustomIconSelect/constants'
