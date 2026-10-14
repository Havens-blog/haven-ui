// @vitest-environment happy-dom
/**
 * Element Plus 解析回归测试。
 *
 * 背景（本包最容易静默失效的地方）：这些组件原先在应用内使用 `<el-*>` 标签，靠消费方的
 * unplugin-vue-components + ElementPlusResolver 在**构建期**自动导入组件与按需样式。
 * 一旦抽成预编译的包，消费方的自动导入就不再作用于包内模板；而四个消费方**都没有**
 * 全局注册 Element Plus（无 `app.use(ElementPlus)`），因此未显式导入的标签会退化为
 * `resolveComponent('el-dialog')` 运行时查找 —— Vue 只打印一条 warn，**页面静默少一块**。
 *
 * 本测试锁死该行为：不注册任何全局组件，断言真实 Element Plus 组件确实出现在组件树里，
 * 且没有任何 "Failed to resolve component" 告警。
 */
import { mount } from '@vue/test-utils'
import { ElDialog, ElIcon } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import AssetExportDialog from '../AssetExportDialog.vue'
import CustomIconSelect from '../CustomIconSelect/index.vue'
import IconFont from '../IconFont/index.vue'
import ManagerHeader from '../ManagerHeader/index.vue'
import ProviderIcon from '../ProviderIcon.vue'

/** 执行挂载并收集 Vue 的"组件未解析"告警 */
function unresolvedWarnings(mountFn: () => void): string[] {
    const warns: string[] = []
    const spy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
        warns.push(args.map((a) => String(a)).join(' '))
    })
    try {
        mountFn()
    } finally {
        spy.mockRestore()
    }
    return warns.filter((w) => w.includes('Failed to resolve component'))
}

describe('Element Plus 组件解析（不依赖消费方全局注册）', () => {
    it('AssetExportDialog 渲染真实 ElDialog', () => {
        let found = false
        const warns = unresolvedWarnings(() => {
            const w = mount(AssetExportDialog as never, {
                props: {
                    visible: false,
                    instances: [],
                    selectedIds: [],
                    total: 0,
                    config: { fields: [], getValue: () => '', filename: 'export', defaultFields: [] },
                } as never,
            })
            found = w.findComponent(ElDialog).exists()
        })
        expect(warns).toEqual([])
        expect(found).toBe(true)
    })

    it('CustomIconSelect 渲染真实 ElIcon（触发位占位图标）', () => {
        let found = false
        const warns = unresolvedWarnings(() => {
            const w = mount(CustomIconSelect as never, { props: { modelValue: '' } as never })
            found = w.findComponent(ElIcon).exists()
        })
        expect(warns).toEqual([])
        expect(found).toBe(true)
    })

    it('ManagerHeader 无未解析组件告警', () => {
        const warns = unresolvedWarnings(() => {
            mount(ManagerHeader as never, { props: { title: 't', subtitle: 's' } as never })
        })
        expect(warns).toEqual([])
    })

    it('IconFont 无未解析组件告警（本组件只依赖 vue）', () => {
        const warns = unresolvedWarnings(() => {
            mount(IconFont as never, { props: { type: 'linear-x' } as never })
        })
        expect(warns).toEqual([])
    })

    it('ProviderIcon 无未解析组件告警（本组件不依赖 element-plus）', () => {
        const warns = unresolvedWarnings(() => {
            mount(ProviderIcon as never, { props: { provider: 'aliyun' } as never })
        })
        expect(warns).toEqual([])
    })
})
