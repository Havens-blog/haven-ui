# @haven/ui

平台共享前端组件（**叶子组件层**）。供 `e-cam-web` / `e-cmdb-web` / `haven-console` 等前端消费。

方案背景、边界判定与分阶段路线见 `docs/proposals/frontend-shared-components/proposal.md`。

## 边界规则（写入即约束）

| 收 | 不收 |
|---|---|
| 叶子组件：无业务语义、无应用级依赖 | 外壳组件：侧边栏 / 顶栏 / 租户切换 / 应用切换 |
| 纯展示与纯交互（IconFont、ManagerHeader、AssetExportDialog、CustomIconSelect…） | 承载导航模型 / 权限模型 / 租户上下文 / 应用注册表的一切 |

**为什么外壳不进这个包**：平台"乱"的根因不是组件重复，而是四个应用各有一套
**应用注册表 / 菜单模型 / 租户上下文 / 权限码**（`TenantSelector` 在 e-cam-web 1.8KB、
haven-console 4.3KB 属合理分歧）。外壳要统一的是**契约与数据**，不是把代码搬进一个包——
强行合并只会造出 god component。

## 使用方式

消费方 `package.json`：

```json
{
  "dependencies": {
    "@haven/ui": "git+ssh://git@github.com/Havens-blog/haven-ui.git#v0.1.0"
  }
}
```

本地联调用 pnpm 链接（`link:` 生成符号链接，改动即时生效，无需重装、无需构建）：

```json
{ "@haven/ui": "link:../haven-ui" }
```

### 一律走**子路径**导入，不要用桶文件

```ts
// ✅ 推荐：只拉进用到的那个组件
import { IconFont } from '@haven/ui/IconFont'
import { ManagerHeader } from '@haven/ui/ManagerHeader'
import { AssetExportDialog, type ExportFieldConfig } from '@haven/ui/AssetExportDialog'

// ❌ 禁止：从桶文件 @haven/ui 导入
import { IconFont } from '@haven/ui'
```

**为什么这条是硬性的**（实测，非推测）：桶文件 `src/index.ts` 里含 `element-plus` 各组件的
样式**纯副作用导入**（`import 'element-plus/es/components/*/style/css'`），Rollup 无法摇树。
只要**入口**路径引用到桶（`main.ts`、或 resolver 解析模板里的 `<IconFont>`），4 个组件的
Element Plus 样式就**全部被提升进首屏 CSS**。e-cam-web 侧实测：

| | 首屏 CSS |
|---|---|
| 迁移前（各组件在各自视图里，样式随视图异步加载） | 70.6 KB |
| 走桶文件 | **129.4 KB**（+58.8 KB，恰等于消失的 10 个 `el-*` 异步 chunk 之和 59.3 KB） |
| 走子路径 | 70.6 KB（回到基线） |

`package.json` 的 `exports` 为每个组件提供一个入口，各由 `src/entries/<组件>.ts`
承载（只 `re-export` 单个组件，故不牵动其余组件的样式副作用）。
**新增组件时必须同时加一个 entry 模块 + 一条 `exports`。**

## 为什么不构建（只发源码）

这是本包最容易被误改的设计决定，改动前请先读这一节。

本包**只发 `src/`，不产出也不提交 `dist/`**，消费方直接编译其源码。原因：

1. **四个消费方都没有 `app.use(ElementPlus)`**，`<el-*>` 组件与按需样式全靠
   `unplugin-vue-components` + `ElementPlusResolver` 在**构建期**完成。预编译产物享受不到
   这一转换，而未注册的标签会退化为 `resolveComponent('el-dialog')` 运行时查找——
   Vue 只打一条 warn，**页面静默少一块**。
2. pnpm 的 `link:` / git 依赖是**符号链接**，其真实路径在 `node_modules` 之外，
   因此消费方 Vite 会把它当普通源码编译（该插件按路径排除 `node_modules`，符号链接解析后的
   真实路径不含该片段），自动导入与按需样式照常生效。
3. 免去"产物入库 + 跨平台字节一致性"的脆弱链条：一旦提交 `dist/`，就必须靠
   `git diff --exit-code dist` 守一致性，而跨平台构建的字节差异会让 CI 无谓变红。

即便如此，包内组件**仍然显式引入**所用的 Element Plus 组件与按需样式（见下节）——
这样即使将来改为预编译产物，也不会踩第 1 条那个静默坑。

## 贡献须知（两条硬性约定）

### 1. 组件必须显式引入 Element Plus 组件与按需样式

```ts
import { ElButton, ElDialog, ElTooltip } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/tooltip/style/css'
```

语义与改造前完全一致——`ElementPlusResolver` 引入的正是同一批组件与同一份样式。
`src/components/__tests__/element-plus-resolution.test.ts` 锁死该行为：它在**不注册任何全局组件**
的前提下挂载组件，断言真实 Element Plus 组件出现在组件树里且无 "Failed to resolve component" 告警。

### 2. 组件不得 import 应用的 `@/` 模块

包内 `@/` 只指向本包 `src/`。若组件确实依赖某个应用工具，先把该片段下沉进包内
（例：`ProviderIcon` 依赖 `@/utils/constants` 的 `getProviderConfig` 与
`@/utils/icon-mapping`，故**未进首批**）。

## 校验

```bash
pnpm install
pnpm verify        # typecheck + test
```

## 当前批次

| 组件 | 规模 | 迁移性质 |
|---|---|---|
| `IconFont` | 116 行 | 与 e-cam-web 逐字节相同；仅依赖 vue |
| `ManagerHeader` | 212 行 | 与 e-cam-web 逐字节相同；仅依赖 element-plus 图标 |
| `AssetExportDialog` | 444 行 | 与 e-cam-web 逐字节相同；含 12.2KB 单测 |
| `CustomIconSelect`（+ `constants.ts`） | 261 + 167 行 | 与 e-cam-web 逐字节相同；依赖包内 IconFont |

首批组件样式**完全自包含**（零 Sass 变量、零 `@use/@import`，仅用 CSS 变量 `var(--…)`），
故可直接编译，主题仍由消费方 CSS 变量驱动。

**待办**：`ProviderIcon`（需先下沉 `getProviderConfig` / `getProviderIcon`）；
`haven-console` / `opsagent-web` 尚未接入。

已接入：`e-cmdb-web`（提交 `145abe5`）、`e-cam-web`（提交 `693dc5f`，67 处 import 已切换、
本仓副本已删除）——"任一组件不再有第二份实现"对这两个应用已成立。
