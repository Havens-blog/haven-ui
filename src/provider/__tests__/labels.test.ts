/**
 * getProviderLabel / PROVIDER_DISPLAY_NAMES 测试。
 *
 * 背景：显示名从 e-cam-web / e-cmdb-web 的 `@/utils/constants.ts` 迁入本包，
 * 两仓调用点（getProviderLabel 各 42/8 文件）全部改为 re-export，故必须证明
 * **迁移前后返回逐值一致**——下面把语义钉死（标准键 / 别名 / 扩展云 / 大小写 /
 * 未知值原样兜底）。
 */
import { describe, expect, it } from 'vitest'
import { PROVIDER_DISPLAY_NAMES, getProviderLabel } from '../labels'

describe('PROVIDER_DISPLAY_NAMES', () => {
    it('六个标准键 → 展示名', () => {
        expect(PROVIDER_DISPLAY_NAMES).toMatchObject({
            aliyun: '阿里云',
            aws: 'Amazon Web Services',
            azure: 'Microsoft Azure',
            tencent: '腾讯云',
            huawei: '华为云',
            volcano: '火山引擎',
        })
    })
})

describe('getProviderLabel', () => {
    it('标准键精确命中', () => {
        expect(getProviderLabel('aliyun')).toBe('阿里云')
        expect(getProviderLabel('aws')).toBe('Amazon Web Services')
        expect(getProviderLabel('azure')).toBe('Microsoft Azure')
        expect(getProviderLabel('tencent')).toBe('腾讯云')
        expect(getProviderLabel('huawei')).toBe('华为云')
        expect(getProviderLabel('volcano')).toBe('火山引擎')
    })

    it('火山引擎别名/变体子串归一', () => {
        for (const alias of ['volcengine', 'bytecloud', 'bytedance', 'volc']) {
            expect(getProviderLabel(alias), alias).toBe('火山引擎')
        }
    })

    it('阿里云 / 腾讯云 / AWS / Azure 别名归一', () => {
        expect(getProviderLabel('alibaba')).toBe('阿里云')
        expect(getProviderLabel('alibabacloud')).toBe('阿里云')
        expect(getProviderLabel('qcloud')).toBe('腾讯云')
        expect(getProviderLabel('amazon')).toBe('Amazon Web Services')
        expect(getProviderLabel('microsoft')).toBe('Microsoft Azure')
    })

    it('扩展云（非六个标准键）', () => {
        expect(getProviderLabel('jdcloud')).toBe('京东云')
        expect(getProviderLabel('jd')).toBe('京东云')
        expect(getProviderLabel('google')).toBe('Google Cloud')
        expect(getProviderLabel('gcp')).toBe('Google Cloud')
        expect(getProviderLabel('ucloud')).toBe('UCloud')
        expect(getProviderLabel('ecloud')).toBe('天翼云')
        expect(getProviderLabel('ctyun')).toBe('天翼云')
        expect(getProviderLabel('openstack')).toBe('OpenStack')
        expect(getProviderLabel('vmware')).toBe('VMware')
        expect(getProviderLabel('vsphere')).toBe('VMware')
        expect(getProviderLabel('nutanix')).toBe('Nutanix')
        expect(getProviderLabel('zstack')).toBe('ZStack')
    })

    it('大小写不敏感（标准键之外的形态走子串归一）', () => {
        expect(getProviderLabel('AliYun')).toBe('阿里云')
        expect(getProviderLabel('AWS')).toBe('Amazon Web Services')
        expect(getProviderLabel('AZURE')).toBe('Microsoft Azure')
        expect(getProviderLabel('Tencent')).toBe('腾讯云')
    })

    it('长 token 优先于短 token（volcengine 不被 volc 截胡）', () => {
        expect(getProviderLabel('volcengine')).toBe('火山引擎')
        expect(getProviderLabel('my-volcengine-instance')).toBe('火山引擎')
    })

    it('未知值原样返回（不吞原始值）', () => {
        expect(getProviderLabel('no-such-provider')).toBe('no-such-provider')
        expect(getProviderLabel('自定义云')).toBe('自定义云')
    })

    it('空值原样返回', () => {
        expect(getProviderLabel('')).toBe('')
    })

    it('迁移不变量：与迁移前 e-cam-web/constants.ts 语义逐值一致', () => {
        // 迁移前 getProviderLabel：严格键→displayName；否则子串归一；否则原样返回。
        const table: Array<[string, string]> = [
            ['aliyun', '阿里云'],
            ['aws', 'Amazon Web Services'],
            ['azure', 'Microsoft Azure'],
            ['tencent', '腾讯云'],
            ['huawei', '华为云'],
            ['volcano', '火山引擎'],
            ['volcengine', '火山引擎'],
            ['bytecloud', '火山引擎'],
            ['bytedance', '火山引擎'],
            ['volc', '火山引擎'],
            ['alibaba', '阿里云'],
            ['alibabacloud', '阿里云'],
            ['qcloud', '腾讯云'],
            ['amazon', 'Amazon Web Services'],
            ['microsoft', 'Microsoft Azure'],
            ['jdcloud', '京东云'],
            ['jd', '京东云'],
            ['google', 'Google Cloud'],
            ['gcp', 'Google Cloud'],
            ['ucloud', 'UCloud'],
            ['ecloud', '天翼云'],
            ['ctyun', '天翼云'],
            ['openstack', 'OpenStack'],
            ['vmware', 'VMware'],
            ['vsphere', 'VMware'],
            ['nutanix', 'Nutanix'],
            ['zstack', 'ZStack'],
            ['AliYun', '阿里云'],
            ['AWS', 'Amazon Web Services'],
            ['no-such-provider', 'no-such-provider'],
            ['自定义云', '自定义云'],
        ]
        for (const [input, expected] of table) {
            expect(getProviderLabel(input), JSON.stringify(input)).toBe(expected)
        }
    })
})
