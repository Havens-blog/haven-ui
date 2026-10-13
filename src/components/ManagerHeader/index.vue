<template>
  <div class="manager-header" :class="{ 'sticky-header': sticky }">
    <div class="header-left" :class="{ 'has-back-button': showBackButton }">
      <div class="title-section">
        <button v-if="showBackButton" @click="$emit('back')" class="back-button">
          <span class="back-icon">←</span>
        </button>
        <div class="title-content">
          <h2 class="manager-title">{{ title }}</h2>
          <p class="manager-subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div v-if="$slots.details" class="details-section">
        <slot name="details" />
      </div>

      <div v-if="$slots.extra" class="extra-section">
        <slot name="extra" />
      </div>
    </div>
    <div class="header-right">
      <slot name="actions">
        <el-button
          v-if="showAddButton"
          type="primary"
          :icon="CirclePlus"
          :disabled="addButtonDisabled"
          class="action-btn"
          @click="$emit('add')"
        >
          {{ addButtonText }}
        </el-button>
        <el-tooltip content="刷新数据">
          <el-button
            v-if="showRefreshButton"
            type="primary"
            :icon="RefreshRight"
            circle
            class="refresh-btn"
            @click="$emit('refresh')"
          />
        </el-tooltip>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 本组件已抽为独立包 @haven/ui，不再依赖消费方的 unplugin-vue-components 自动导入：
// 显式引入所用 Element Plus 组件，并显式引入其按需样式（原由 ElementPlusResolver 隐式完成）。
// 语义与改造前完全一致——resolver 引入的正是同一批组件与同一份样式。
// 涉及：el-button / el-tooltip
import { ElButton, ElTooltip } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/tooltip/style/css'
import { CirclePlus, RefreshRight } from '@element-plus/icons-vue'

interface Props {
  title: string
  subtitle: string
  addButtonText?: string
  showAddButton?: boolean
  showRefreshButton?: boolean
  showBackButton?: boolean
  addButtonDisabled?: boolean
  sticky?: boolean
}

withDefaults(defineProps<Props>(), {
  addButtonText: '新增',
  showAddButton: true,
  showRefreshButton: true,
  showBackButton: false,
  addButtonDisabled: false,
  sticky: false
})

defineEmits<{
  add: []
  refresh: []
  back: []
}>()
</script>

<style scoped lang="scss">
.manager-header {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-base);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  min-height: 64px;
  margin-bottom: 20px;
  transition: all 200ms ease;

  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--border-strong);
  }

  &.sticky-header {
    position: sticky;
    top: 0;
    z-index: 100;
    margin-bottom: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
  }
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-base);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      transition: all 200ms ease;
      flex-shrink: 0;

      &:hover {
        border-color: var(--border-strong);
        background: var(--bg-hover);
      }

      &:active {
        transform: translateY(1px);
      }

      .back-icon {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        line-height: 1;
      }
    }

    .title-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }

  .details-section {
    margin-top: 12px;
  }

  .extra-section {
    margin-top: 8px;
  }
}

.manager-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.manager-subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
  line-height: 1.4;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.action-btn) {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

:deep(.refresh-btn) {
  width: 36px;
  height: 36px;
  transition: all 200ms ease;

  &:hover {
    transform: rotate(180deg);
  }
}
</style>
