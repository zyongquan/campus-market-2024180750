<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getErrands, type ErrandItem } from '../api/errand'

const activeType = ref('all')
const sortBy = ref('latest')
const loading = ref(true)
const error = ref('')

const types = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'delivery', label: '代取快递', icon: '📦' },
  { key: 'shopping', label: '代购物品', icon: '🛍️' },
  { key: 'print', label: '打印复印', icon: '🖨️' },
  { key: 'queue', label: '代排队', icon: '🧍' },
  { key: 'other', label: '其他', icon: '📌' },
]

const items = ref<ErrandItem[]>([])

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getErrands()
    items.value = res.data
  } catch (e: any) {
    error.value = e.message || '数据加载失败，请确保 mock 服务已启动 (pnpm mock)'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const filteredItems = computed(() => {
  let result = items.value
  if (activeType.value !== 'all') {
    result = result.filter(i => i.taskType === activeType.value)
  }
  if (sortBy.value === 'reward-high') {
    result = [...result].sort((a, b) => b.reward - a.reward)
  } else if (sortBy.value === 'reward-low') {
    result = [...result].sort((a, b) => a.reward - b.reward)
  }
  return result
})
</script>

<template>
  <div class="errand-page">
    <div class="page-header">
      <div>
        <h1>🏃 跑腿委托</h1>
        <p class="subtitle">找人帮忙跑腿，轻松解决校园琐事</p>
      </div>
      <RouterLink to="/publish" class="btn-pub">+ 发布委托</RouterLink>
    </div>

    <!-- Type Filter & Sort -->
    <div class="toolbar">
      <div class="type-filter">
        <button
          v-for="t in types"
          :key="t.key"
          :class="['filter-btn', { active: activeType === t.key }]"
          @click="activeType = t.key"
        >
          <span>{{ t.icon }}</span>
          <span>{{ t.label }}</span>
        </button>
      </div>
      <select v-model="sortBy" class="sort-sel">
        <option value="latest">最新发布</option>
        <option value="reward-high">报酬从高到低</option>
        <option value="reward-low">报酬从低到高</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <p>正在加载跑腿委托数据...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="fetchData">重新加载</button>
    </div>

    <!-- Cards -->
    <template v-else>
    <div class="errand-grid">
      <RouterLink v-for="item in filteredItems" :key="item.id" :to="'/errand/' + item.id" class="errand-card">
        <div class="errand-image">{{ item.image }}</div>
        <div class="errand-body">
          <div class="errand-header">
            <h3>{{ item.title }}</h3>
            <span v-if="item.urgency === 'urgent'" class="urgency-badge">🔥 急</span>
            <span v-else class="urgency-normal">🕐 普通</span>
          </div>

          <p class="errand-desc">{{ item.description }}</p>

          <div class="errand-meta">
            <span>👤 {{ item.publisher }}</span>
            <span>⏰ {{ item.deadline }}</span>
          </div>
          <div class="errand-route">
            <span class="route-from">📤 {{ item.from }}</span>
            <span class="route-arrow">→</span>
            <span class="route-to">📥 {{ item.to }}</span>
          </div>

          <div class="errand-tags">
            <span v-for="t in item.tags" :key="t" class="tag">{{ t }}</span>
          </div>

          <div class="errand-footer">
            <span class="reward">💰 ¥{{ item.reward }}</span>
            <span class="errand-status">{{ item.status === 'open' ? '🟢 可接单' : '已接单' }}</span>
            <button class="btn-take">接单</button>
          </div>
        </div>
      </RouterLink>

      <div v-if="filteredItems.length === 0 && !loading" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无相关委托</p>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.errand-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 6px 0;
}

.subtitle {
  color: #8892b0;
  font-size: 14px;
  margin: 0;
}

.btn-pub {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.btn-pub:hover { background: #1557b0; }

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
}

.type-filter {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.filter-btn.active {
  background: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
}

.sort-sel {
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 13px;
  background: #fff;
  color: #333;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
}

/* Grid */
.errand-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.errand-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.errand-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.errand-image {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  background: #f8f9fa;
}

.errand-body {
  padding: 14px 16px;
}

.errand-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.errand-header h3 {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.urgency-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: #fce4ec;
  color: #c62828;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
  animation: pulse 1.5s ease-in-out infinite;
}

.urgency-normal {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f2f5;
  color: #5f6368;
  border-radius: 8px;
  white-space: nowrap;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.errand-desc {
  font-size: 13px;
  color: #5f6368;
  margin: 0 0 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.errand-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 6px;
}

.errand-route {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  margin-bottom: 8px;
}

.route-from {
  color: #e74c3c;
}

.route-arrow {
  color: #ccc;
}

.route-to {
  color: #2e7d32;
}

.errand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f2f5;
  border-radius: 8px;
  color: #5f6368;
}

.errand-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.reward {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.errand-status {
  font-size: 11px;
  color: #8892b0;
  flex: 1;
  text-align: center;
}

.btn-take {
  padding: 6px 22px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-take:hover { background: #1557b0; }

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
}
.empty-icon { font-size: 48px; }
.empty-state p { color: #8892b0; margin-top: 8px; }

/* Loading */
.loading-state {
  text-align: center;
  padding: 80px 0;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #8892b0;
  margin-top: 16px;
  font-size: 14px;
}

/* Error */
.error-state {
  text-align: center;
  padding: 80px 0;
}

.error-icon {
  font-size: 48px;
}

.error-state p {
  color: #e74c3c;
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.6;
}

.btn-retry {
  margin-top: 12px;
  padding: 8px 28px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #1557b0;
}

@media (max-width: 900px) { .errand-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .errand-grid { grid-template-columns: 1fr; } }
</style>
