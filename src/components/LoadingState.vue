<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>{{ text || '正在加载数据...' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<style scoped>
.loading-state {
  padding: 48px 32px;
  text-align: center;
  color: #6b7280;
  background: #fff;
  border-radius: 12px;
}
.spinner {
  width: 32px; height: 32px;
  margin: 0 auto 14px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-state p { margin: 0; font-size: 14px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
