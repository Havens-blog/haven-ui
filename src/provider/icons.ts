/**
 * 云厂商图标映射（平台级数据，**单一来源**）。
 *
 * 为什么放在包里：云厂商的标识与彩色图标是**平台统一口径**——四个前端应用必须一致，
 * 放在任一应用里都会立刻产生第二份定义。应用的 `@/utils/icon-mapping.ts` 改为从这里
 * re-export（保持既有 `@/utils/icon-mapping` 导入路径不变，故调用点零改动）。
 *
 * 注意：本文件只放**平台级**的厂商数据。应用级的图标映射（导航菜单图标 MODULE_ICONS、
 * 资产类型图标 ASSET_TYPE_ICONS）不进这个包——它们承载各自应用的业务语义。
 *
 * 图标名取自 cmdb-ui 的 iconfont 彩色 SVG 集合，由 IconFont 组件渲染。
 */

/**
 * 云平台图标映射
 * 使用彩色 SVG 图标以更好地识别不同云平台
 */
export const PROVIDER_ICONS: Record<string, string> = {
    aliyun: 'Alibaba_Cloud', // 阿里云 - 彩色
    aws: 'AWS', // AWS - 彩色
    azure: 'Azure', // Azure - 彩色
    tencent: 'Tencent_Cloud', // 腾讯云 - 彩色
    huawei: 'Huawei_Cloud', // 华为云 - 彩色
    google: 'Google_Cloud_Platform', // 谷歌云 - 彩色
    ucloud: 'UCloud', // UCloud - 彩色
    jdcloud: 'JDCloud', // 京东云 - 彩色
    ecloud: 'ECloud', // 天翼云 - 彩色
    bytecloud: 'Bytecloud', // 火山引擎 - 彩色
    volcengine: 'Bytecloud', // 火山引擎 - 彩色
    volcano: 'Bytecloud', // 火山引擎 - 彩色
    volc: 'Bytecloud', // 火山引擎别名 - 彩色
    bytedance: 'Bytecloud', // 火山引擎别名（字节跳动） - 彩色
    alibaba: 'Alibaba_Cloud', // 阿里云别名 - 彩色
    qcloud: 'Tencent_Cloud', // 腾讯云别名 - 彩色
    amazon: 'AWS', // AWS 别名 - 彩色
    microsoft: 'Azure', // Azure 别名 - 彩色
    gcp: 'Google_Cloud_Platform', // 谷歌云别名 - 彩色
    jd: 'JDCloud', // 京东云别名 - 彩色
    vmware: 'caise-vmware', // VMware - 彩色
    vsphere: 'caise-vmware', // vSphere - 彩色
    nutanix: 'Nutanix', // Nutanix - 彩色
    openstack: 'OpenStack', // OpenStack - 彩色
    zstack: 'ZStack', // ZStack - 彩色
    ctyun: 'Ctyun', // 天翼云 - 彩色
}

/**
 * 获取云平台图标
 *
 * 兜底返回 `caise-public_cloud`（**恒返回真值**）——ProviderIcon 的兜底分支依赖这一点。
 */
export function getProviderIcon(provider: string): string {
    if (!provider) return 'caise-public_cloud'
    return PROVIDER_ICONS[provider.toLowerCase()] || 'caise-public_cloud'
}
