// @vitest-environment happy-dom
/**
 * ProviderIcon 行为测试 + 一条「迁包不变量」测试。
 *
 * 背景：ProviderIcon 迁入本包时，去掉了它对应用 `@/utils/constants` 的 `getProviderConfig`
 * 依赖——这是它此前唯一留在应用里的原因（见 package README「当前批次」）。
 * 去掉它必须证明**渲染输出不变**，而不是靠"看着差不多"：
 *
 *   - iconName = provider 为空 ? '' : getProviderIcon(provider)
 *   - getProviderIcon 对任何输入都返回**真值**（兜底 'caise-public_cloud'）
 *   ⇒ 只要 provider 为真值，v-else 兜底分支就永不渲染，displayName 无从影响输出；
 *   ⇒ provider 为空时 getProviderConfig('') 必为 undefined，原式恒为 '?'。
 *
 * 下面 `不变量` 那条用例把这段推理钉死：真值 provider 下 .provider-text 必须不存在。
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProviderIcon from '../ProviderIcon.vue'
import { PROVIDER_ICONS, getProviderIcon } from '../../provider/icons'

const mountIcon = (provider: string, size?: 'small' | 'medium' | 'large') =>
    mount(ProviderIcon as never, { props: { provider, ...(size ? { size } : {}) } as never })

/** 组件渲染出的图标类名（彩色走 <svg class="icon-svg X">，单色走 <i class="iconfont X">） */
const renderedIconClass = (provider: string): string | null => {
    const w = mountIcon(provider)
    const el = w.find('.icon-svg, .iconfont')
    if (!el.exists()) return null
    const classes = el.classes()
    return classes.find((c) => c !== 'icon-svg' && c !== 'iconfont') ?? null
}

describe('ProviderIcon', () => {
    it('已知厂商渲染对应的彩色图标类名', () => {
        expect(renderedIconClass('aliyun')).toBe('Alibaba_Cloud')
        expect(renderedIconClass('aws')).toBe('AWS')
        expect(renderedIconClass('azure')).toBe('Azure')
    })

    it('别名归一到同一图标（火山引擎的 4 个别名都指向 Bytecloud）', () => {
        for (const alias of ['volcengine', 'volcano', 'volc', 'bytedance']) {
            expect(renderedIconClass(alias), alias).toBe('Bytecloud')
        }
        expect(renderedIconClass('qcloud')).toBe('Tencent_Cloud')
        expect(renderedIconClass('amazon')).toBe('AWS')
    })

    it('大小写不敏感', () => {
        expect(renderedIconClass('AliYun')).toBe(renderedIconClass('aliyun'))
    })

    it('未知厂商兜底为 caise-public_cloud', () => {
        expect(renderedIconClass('no-such-provider')).toBe('caise-public_cloud')
    })

    it('provider 为空时走兜底分支：显示 ? 且不渲染图标', () => {
        const w = mountIcon('')
        expect(w.find('.icon-svg, .iconfont').exists()).toBe(false)
        expect(w.find('.provider-text').text()).toBe('?')
    })

    it('不变量：任何真值 provider 都不会渲染兜底文字（故 displayName 不影响输出）', () => {
        const providers = [...Object.keys(PROVIDER_ICONS), 'no-such-provider', 'ALIYUN', '火山引擎']
        for (const provider of providers) {
            const w = mountIcon(provider)
            expect(w.find('.provider-text').exists(), `${provider} 竟然渲染了兜底文字`).toBe(false)
            expect(w.find('.icon-svg, .iconfont').exists(), `${provider} 未渲染图标`).toBe(true)
        }
    })

    it('size 三档映射到对应 class（默认 medium）', () => {
        expect(mountIcon('aliyun').classes()).toContain('provider-icon--medium')
        expect(mountIcon('aliyun', 'small').classes()).toContain('provider-icon--small')
        expect(mountIcon('aliyun', 'large').classes()).toContain('provider-icon--large')
    })
})

describe('getProviderIcon（平台级单一来源）', () => {
    it('空值与未知值都返回真值兜底（ProviderIcon 的兜底分支依赖这一点）', () => {
        for (const input of ['', 'no-such-provider', '   ']) {
            expect(getProviderIcon(input)).toBeTruthy()
        }
        expect(getProviderIcon('')).toBe('caise-public_cloud')
    })

    it('覆盖 6 个主厂商与全部别名', () => {
        for (const token of ['aliyun', 'aws', 'azure', 'tencent', 'huawei', 'volcano']) {
            expect(PROVIDER_ICONS[token], token).toBeTruthy()
        }
        expect(Object.keys(PROVIDER_ICONS).length).toBeGreaterThanOrEqual(26)
    })
})
