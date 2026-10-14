<template>
  <div class="provider-icon" :class="sizeClass">
    <IconFont v-if="iconName" :type="iconName" :size="iconSize" />
    <span v-else class="provider-text">{{ displayName.charAt(0) }}</span>
  </div>
</template>

<script setup lang="ts">
import IconFont from './IconFont/index.vue'
import { getProviderIcon } from '../provider/icons'
import { computed } from 'vue'

interface Props {
  provider: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

/**
 * displayName 只服务于下面的 v-else 兜底分支。
 *
 * 迁包时去掉了对应用 `@/utils/constants` 的 `getProviderConfig` 依赖，理由**可证**：
 *   iconName 对任何**真值** provider 都必为真（getProviderIcon 兜底返回 'caise-public_cloud'），
 *   故 v-else 仅在 provider 为空时渲染；而此时 getProviderConfig('') 必为 undefined，
 *   原式 `config?.displayName || props.provider || '?'` 恒等于 '?'。
 * 即该依赖对渲染输出零影响——移除它不改变任何像素（有单测锁死这一点）。
 */
const displayName = computed(() => props.provider || '?')
const sizeClass = computed(() => `provider-icon--${props.size}`)
const iconName = computed(() => {
  if (!props.provider) return ''
  return getProviderIcon(props.provider)
})
const iconSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 16
    case 'large':
      return 24
    default:
      return 20
  }
})


</script>

<style scoped lang="scss">
.provider-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.04);

  &--small {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  &--medium {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  &--large {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .provider-text {
    font-weight: 600;
    text-transform: uppercase;
  }

  .iconfont {
    font-size: inherit;
  }
}
</style>
