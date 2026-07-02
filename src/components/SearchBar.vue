<template>
  <div class="search-bar">
    <span class="search-icon">🔍</span>
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="search-input"
      @input="handleInput"
    />
    <button v-if="modelValue" type="button" class="btn-clear" @click="$emit('update:modelValue', '')">
      清空
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ modelValue: string; placeholder?: string }>(),
  { placeholder: '请输入关键词搜索' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.search-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  transition: border-color 0.2s;
  margin-bottom: 16px;
}
.search-bar:focus-within { border-color: #1a73e8; }
.search-icon { font-size: 16px; flex-shrink: 0; }
.search-input {
  flex: 1; border: none; outline: none;
  font-size: 14px; color: #333; background: transparent;
}
.search-input::placeholder { color: #bbb; }
.btn-clear {
  border: none; background: #f0f2f5;
  color: #5f6368; padding: 4px 12px;
  border-radius: 12px; font-size: 12px;
  cursor: pointer; flex-shrink: 0;
  transition: background 0.2s;
}
.btn-clear:hover { background: #e0e0e0; }
</style>
