<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'

const activeType = ref<'lost' | 'found'>('lost')
const searchKeyword = ref('')
const loading = ref(true)
const error = ref('')

const items = ref<LostFoundItem[]>([])

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getLostFounds()
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
  let result = items.value.filter(i => i.type === activeType.value)
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(kw) ||
      i.location.toLowerCase().includes(kw) ||
      i.category.toLowerCase().includes(kw)
    )
  }
  return result
})

const typeLabel = (t: string) => t === 'lost' ? '寻物启事' : '失物招领'

const lostCount = computed(() => items.value.filter(i => i.type === 'lost').length)
const foundCount = computed(() => items.value.filter(i => i.type === 'found').length)
</script>

<template>
  <div class="lost-found-page">
    <div class="page-header">
      <div>
        <h1>🔍 失物招领</h1>
        <p class="subtitle">丢了东西别着急 · 捡到物品来这里</p>
      </div>
      <RouterLink to="/publish" class="btn-post">+ 发布信息</RouterLink>
    </div>

    <!-- Type Tabs -->
    <div class="type-tabs">
      <button
        :class="['type-tab', { active: activeType === 'lost' }]"
        @click="activeType = 'lost'"
      >
        <span class="tab-icon">😰</span>
        <div class="tab-text">
          <span class="tab-label">寻物启事</span>
          <span class="tab-count">{{ lostCount }} 条</span>
        </div>
      </button>
      <button
        :class="['type-tab', { active: activeType === 'found' }]"
        @click="activeType = 'found'"
      >
        <span class="tab-icon">😊</span>
        <div class="tab-text">
          <span class="tab-label">失物招领</span>
          <span class="tab-count">{{ foundCount }} 条</span>
        </div>
      </button>
    </div>

    <!-- Search -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input v-model="searchKeyword" placeholder="搜索物品名称、地点..." class="search-input" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <p>正在加载失物招领数据...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="fetchData">重新加载</button>
    </div>

    <!-- Cards -->
    <template v-else>
    <div class="lf-grid">
      <RouterLink v-for="item in filteredItems" :key="item.id" :to="'/lost-found/' + item.id" class="lf-card">
        <div class="lf-image">{{ item.image }}</div>
        <div class="lf-body">
          <div class="lf-header-row">
            <h3>{{ item.title }}</h3>
            <span :class="['lf-badge', item.type]">{{ typeLabel(item.type) }}</span>
          </div>
          <div class="lf-meta">
            <div class="meta-row"><span class="meta-label">📂 分类：</span><span class="meta-val">{{ item.category }}</span></div>
            <div class="meta-row"><span class="meta-label">📍 地点：</span><span class="meta-val">{{ item.location }}</span></div>
            <div class="meta-row"><span class="meta-label">📅 时间：</span><span class="meta-val">{{ item.eventTime }}</span></div>
          </div>
          <p class="lf-desc">{{ item.description }}</p>
          <div class="lf-footer">
            <span class="lf-status" :class="{ urgent: item.type === 'lost' }">{{ item.status === 'open' ? (item.type === 'lost' ? '寻找中' : '待认领') : '已处理' }}</span>
            <span class="lf-contact">📞 {{ item.contact }}</span>
          </div>
        </div>
      </RouterLink>

      <div v-if="filteredItems.length === 0 && !loading" class="empty-state">
        <span class="empty-icon">🔎</span>
        <p>暂无相关信息</p>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.lost-found-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
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

.btn-post {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.btn-post:hover { background: #1557b0; }

/* Type Tabs */
.type-tabs {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
}

.type-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.type-tab:hover {
  border-color: #1a73e8;
}

.type-tab.active {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.tab-icon {
  font-size: 32px;
}

.tab-text {
  display: flex;
  flex-direction: column;
}

.tab-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tab-count {
  font-size: 13px;
  color: #8892b0;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 0 14px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.search-box:focus-within {
  border-color: #1a73e8;
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  padding: 10px 0;
  font-size: 14px;
  outline: none;
  background: transparent;
}

/* Grid */
.lf-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.lf-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  transition: box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.lf-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.lf-image {
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  background: #f8f9fa;
  flex-shrink: 0;
}

.lf-body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.lf-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.lf-header-row h3 {
  font-size: 15px;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 8px;
}

.lf-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 500;
}

.lf-badge.lost {
  background: #fff3e0;
  color: #e65100;
}

.lf-badge.found {
  background: #e8f5e9;
  color: #2e7d32;
}

.lf-meta {
  margin-bottom: 8px;
}

.meta-row {
  font-size: 13px;
  color: #5f6368;
  line-height: 1.8;
}

.meta-label {
  color: #8892b0;
}

.meta-val {
  color: #333;
  font-weight: 500;
}

.lf-desc {
  font-size: 13px;
  color: #8892b0;
  margin: 0 0 10px 0;
  line-height: 1.5;
  flex: 1;
}

.lf-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lf-status {
  font-size: 12px;
  padding: 2px 10px;
  background: #f0f2f5;
  border-radius: 10px;
  color: #5f6368;
}

.lf-status.urgent {
  background: #fff3e0;
  color: #e65100;
  font-weight: 600;
}

.lf-contact {
  font-size: 12px;
  color: #1a73e8;
}

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

@media (max-width: 768px) {
  .lf-grid {
    grid-template-columns: 1fr;
  }
  .lf-card {
    flex-direction: column;
  }
  .lf-image {
    width: 100%;
    height: 100px;
  }
}
</style>
