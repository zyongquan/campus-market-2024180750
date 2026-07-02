<template>
  <div class="error-state">
    <span class="error-icon">⚠️</span>
    <h3>加载失败</h3>
    <p>{{ message }}</p>
    <button v-if="showRetry" type="button" class="btn-retry" @click="$emit('retry')">
      重新加载
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string; showRetry?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<style scoped>
.error-state {
  padding: 48px 32px;
  text-align: center;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
}
.error-icon { font-size: 40px; display: block; margin-bottom: 8px; }
.error-state h3 { margin: 0 0 8px; font-size: 16px; }
.error-state p { margin: 0 0 16px; font-size: 14px; color: #b91c1c; }
.btn-retry {
  border: none; border-radius: 8px;
  padding: 8px 20px; cursor: pointer;
  background: #dc2626; color: #fff;
  font-size: 14px; font-weight: 500;
  transition: background 0.2s;
}
.btn-retry:hover { background: #b91c1c; }
</style>
