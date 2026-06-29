<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'

const activeTab = ref<'all' | 'group' | 'partner' | 'team'>('all')
const loading = ref(true)
const error = ref('')

const tabs = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'group', label: '拼单', icon: '🛍️', desc: '一起买更便宜' },
  { key: 'partner', label: '搭子', icon: '👯', desc: '找个伴不孤单' },
  { key: 'team', label: '组队', icon: '👥', desc: '组队参与活动' },
]

const items = ref<GroupBuyItem[]>([])

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getGroupBuys()
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
  if (activeTab.value === 'all') return items.value
  return items.value.filter(i => i.type === activeTab.value)
})

const typeBadge = (t: string) => {
  const m: Record<string, { text: string; color: string }> = {
    group: { text: '拼单', color: '#e8f5e9' },
    partner: { text: '搭子', color: '#e3f2fd' },
    team: { text: '组队', color: '#f3e5f5' },
  }
  return m[t] || { text: t, color: '#f0f2f5' }
}

const progressPercent = (c: number, t: number) => Math.min(Math.round((c / t) * 100), 100)
</script>

<template>
  <div class="group-buy-page">
    <div class="page-header">
      <div>
        <h1>🤝 拼单搭子</h1>
        <p class="subtitle">拼单省钱 · 搭子相伴 · 组队共赢</p>
      </div>
      <RouterLink to="/publish" class="btn-create">+ 发起拼单</RouterLink>
    </div>

    <!-- Tabs -->
    <div class="tab-row">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key as typeof activeTab"
      >
        <span class="tab-em">{{ tab.icon }}</span>
        <div class="tab-text">
          <span class="tab-name">{{ tab.label }}</span>
          <span v-if="tab.desc" class="tab-desc">{{ tab.desc }}</span>
        </div>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <p>正在加载拼单搭子数据...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="fetchData">重新加载</button>
    </div>

    <!-- Cards -->
    <template v-else>
    <div class="group-grid">
      <RouterLink v-for="item in filteredItems" :key="item.id" :to="'/group-buy/' + item.id" class="group-card">
        <div class="card-image">{{ item.image }}</div>
        <div class="card-body">
          <div class="card-header">
            <h3>{{ item.title }}</h3>
            <span
              class="type-badge"
              :style="{ background: typeBadge(item.type).color }"
            >{{ typeBadge(item.type).text }}</span>
          </div>

          <p class="card-desc">{{ item.description }}</p>

          <div class="progress-section">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercent(item.currentCount, item.targetCount) + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              <span class="progress-count">{{ item.currentCount }}/{{ item.targetCount }} 人</span>
              <span class="progress-pct">{{ progressPercent(item.currentCount, item.targetCount) }}%</span>
            </div>
          </div>

          <div class="card-meta">
            <span>👤 {{ item.publisher }}</span>
            <span>📍 {{ item.location }}</span>
            <span>⏰ {{ item.deadline }}</span>
          </div>

          <div class="card-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>

          <div class="card-footer">
            <span v-if="item.price" class="card-price">¥{{ item.price }}/人</span>
            <span v-else class="card-price free">免费</span>
            <span class="card-status">{{ item.status === 'open' ? '🟢 进行中' : '已结束' }}</span>
            <button class="btn-join">我要加入</button>
          </div>
        </div>
      </RouterLink>

      <div v-if="filteredItems.length === 0 && !loading" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无相关信息</p>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.group-buy-page {
  max-width: 1100px;
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

.btn-create {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.btn-create:hover { background: #1557b0; }

/* Tabs */
.tab-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.tab-item:hover {
  border-color: #1a73e8;
}

.tab-item.active {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.tab-em { font-size: 24px; }

.tab-text {
  display: flex;
  flex-direction: column;
}

.tab-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.tab-desc {
  font-size: 12px;
  color: #8892b0;
}

/* Grid */
.group-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.group-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.card-image {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #f8f9fa;
}

.card-body {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.card-desc {
  font-size: 12px;
  color: #8892b0;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.type-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
  color: #333;
}

/* Progress */
.progress-section {
  margin-bottom: 12px;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a73e8, #4285f4);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.progress-count {
  color: #5f6368;
}

.progress-pct {
  color: #1a73e8;
  font-weight: 600;
}

/* Meta */
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 10px;
}

/* Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag-chip {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f2f5;
  border-radius: 8px;
  color: #5f6368;
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.card-price.free {
  color: #2e7d32;
}

.card-status {
  font-size: 11px;
  color: #8892b0;
  flex: 1;
  text-align: center;
}

.btn-join {
  padding: 6px 18px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-join:hover {
  background: #1557b0;
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

@media (max-width: 900px) {
  .group-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .group-grid { grid-template-columns: 1fr; }
  .tab-row { flex-direction: column; }
}
</style>
