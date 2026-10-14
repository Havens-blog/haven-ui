// @vitest-environment node
/**
 * 「模板标签 ↔ Element Plus 按需样式入口」一致性测试。
 *
 * 为什么必须有这条测试：抽包后组件不再依赖消费方的 ElementPlusResolver，样式要靠包内
 * 显式 import。而 Element Plus 的样式入口是**按组件**的，组/子组件各有独立入口：
 *   el-checkbox-group → checkbox-group/style/css（自身会链上 checkbox）
 *   el-radio-button   → radio-button/style/css
 *   el-radio-group    → radio-group/style/css（自身会链上 radio）
 * 少引一个入口，对应那几行 CSS 会**静默丢失**（本包开发中真实踩过：el-checkbox-group
 * 的规则丢失，产物 CSS 少 53 字节，肉眼与单测都看不出来，只有逐字节比对产物才发现）。
 *
 * 规则：模板里出现 <el-X>，就必须 import 'element-plus/es/components/X/style/css'。
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * 递归枚举本目录下所有 .vue（不再手写清单——手写清单必然漏掉新增组件，
 * 而漏掉一个组件就等于这条防线对它是空的）。
 */
const componentsDir = fileURLToPath(new URL('..', import.meta.url))
const components = readdirSync(componentsDir, { recursive: true })
    .map((p) => String(p).replace(/\\/g, '/'))
    .filter((p) => p.endsWith('.vue'))
    .sort()

const readSfc = (rel: string) =>
    readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)), 'utf8')

describe('Element Plus 按需样式入口与模板标签一一对应', () => {
    it('枚举到了全部组件（防止读空导致防线空转）', () => {
        expect(components.length, `实际枚举: ${components.join(', ')}`).toBeGreaterThanOrEqual(5)
        expect(components).toContain('ProviderIcon.vue')
        expect(components).toContain('AssetExportDialog.vue')
    })

    for (const rel of components) {
        it(`${rel} 每个 <el-X> 都有 X/style/css`, () => {
            const src = readSfc(rel)
            const tags = [...new Set([...src.matchAll(/<(el-[a-z-]+)/g)].map((m) => m[1] ?? ''))].filter(Boolean)
            const styles = new Set(
                [...src.matchAll(/element-plus\/es\/components\/([a-z-]+)\/style\/css/g)].map((m) => m[1] ?? ''),
            )
            // 模板用到的标签，逐一要求同名样式入口
            const missing = tags.map((t) => t.slice(3)).filter((n) => !styles.has(n))
            expect(missing, `缺少样式入口: ${missing.join(', ')}`).toEqual([])
            // 反向：不应引与模板无关的样式入口（防复制粘贴残留）
            const extra = [...styles].filter((n) => !tags.includes(`el-${n}`))
            expect(extra, `多余样式入口: ${extra.join(', ')}`).toEqual([])
        })
    }
})
