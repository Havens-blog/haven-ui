/**
 * 云厂商展示名（平台级数据，**单一来源**）。
 *
 * 为什么放在包里：云厂商的展示名是**平台统一口径**——各列表/抽屉/导出必须一致，
 * 放在任一应用里都会立刻产生第二份定义。应用的 `@/utils/constants.ts` 改为从这里
 * re-export（保持既有 `@/utils/constants` 导入路径不变，故调用点零改动）。
 *
 * 与 `./icons.ts` 的边界：本文件只放「展示名」（中文/品牌名），`./icons.ts` 只放
 * 「图标 class」。两者都是平台级厂商数据，但语义不同，分开维护更清晰。
 *
 * 六个标准键（CloudProvider 联合类型）之外的别名与扩展云，是历史链路下发的多种
 * 拼写（CMDB 筛选下拉用 `volcengine`、部分实例用 `bytedance`，阿里云出现过
 * `alibaba`，腾讯云出现过 `qcloud`）及 ecs 列表/实例抽屉历史映射里的扩展云
 * （Google/UCloud/京东云/天翼云/OpenStack/VMware/Nutanix/ZStack）的并集，
 * 在展示层做子串归一兜底，不改配置对象本身。
 */

/**
 * 标准键 → 展示名（六个 CloudProvider 联合类型键，精确匹配用）。
 * 应用侧 PROVIDER_CONFIGS 的 displayName 也从这里取，保证展示名单一来源。
 * 用联合键而非 Record<string,string>：联合键是映射类型（不触发 noUncheckedIndexedAccess 的
 * `| undefined`），且键集被锁定为六个标准厂商。
 */
export type ProviderKey = 'aliyun' | 'aws' | 'azure' | 'tencent' | 'huawei' | 'volcano'

export const PROVIDER_DISPLAY_NAMES: Record<ProviderKey, string> = {
    aliyun: '阿里云',
    aws: 'Amazon Web Services',
    azure: 'Microsoft Azure',
    tencent: '腾讯云',
    huawei: '华为云',
    volcano: '火山引擎',
}

/**
 * provider 值 → 展示名的子串归一表（各列表/抽屉/导出历史本地映射的并集）。
 * 按 token 长度降序，保证长 token（volcengine）优先于短 token（volc）匹配。
 */
const PROVIDER_LABEL_TOKENS: Array<{ token: string; label: string }> = [
    { token: 'volcengine', label: PROVIDER_DISPLAY_NAMES.volcano },
    { token: 'alibabacloud', label: PROVIDER_DISPLAY_NAMES.aliyun },
    { token: 'bytecloud', label: PROVIDER_DISPLAY_NAMES.volcano },
    { token: 'bytedance', label: PROVIDER_DISPLAY_NAMES.volcano },
    { token: 'alibaba', label: PROVIDER_DISPLAY_NAMES.aliyun },
    { token: 'amazon', label: PROVIDER_DISPLAY_NAMES.aws },
    { token: 'tencent', label: PROVIDER_DISPLAY_NAMES.tencent },
    { token: 'volcano', label: PROVIDER_DISPLAY_NAMES.volcano },
    { token: 'jdcloud', label: '京东云' },
    { token: 'huawei', label: PROVIDER_DISPLAY_NAMES.huawei },
    { token: 'qcloud', label: PROVIDER_DISPLAY_NAMES.tencent },
    { token: 'aliyun', label: PROVIDER_DISPLAY_NAMES.aliyun },
    { token: 'google', label: 'Google Cloud' },
    { token: 'ucloud', label: 'UCloud' },
    { token: 'ecloud', label: '天翼云' },
    { token: 'microsoft', label: PROVIDER_DISPLAY_NAMES.azure },
    { token: 'ctyun', label: '天翼云' },
    { token: 'azure', label: PROVIDER_DISPLAY_NAMES.azure },
    { token: 'aws', label: PROVIDER_DISPLAY_NAMES.aws },
    { token: 'gcp', label: 'Google Cloud' },
    { token: 'openstack', label: 'OpenStack' },
    { token: 'vmware', label: 'VMware' },
    { token: 'vsphere', label: 'VMware' },
    { token: 'nutanix', label: 'Nutanix' },
    { token: 'zstack', label: 'ZStack' },
    { token: 'volc', label: PROVIDER_DISPLAY_NAMES.volcano },
    { token: 'jd', label: '京东云' },
].sort((a, b) => b.token.length - a.token.length)

/**
 * 云厂商展示名（单源，各列表/抽屉/导出统一走这里）。
 * 严格键优先取标准展示名，变体与扩展云按上表子串归一，
 * 都未命中的未知值原样返回（与既有兜底语义一致，不吞原始值）。
 */
export function getProviderLabel(value: string): string {
    if (!value) return value

    const exact = PROVIDER_DISPLAY_NAMES[value as ProviderKey]
    if (exact) return exact

    const normalized = value.trim().toLowerCase()
    const matched = PROVIDER_LABEL_TOKENS.find((item) => normalized.includes(item.token))
    if (matched) return matched.label

    return value
}
