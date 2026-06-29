<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTrades, type TradeItem } from '../api/trade'

const activeTab = ref('all')
const sortBy = ref('latest')
const searchKeyword = ref('')
const loading = ref(true)
const error = ref('')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'book', label: '📚 教材书籍' },
  { key: 'digital', label: '💻 数码电子' },
  { key: 'life', label: '🛋️ 生活用品' },
  { key: 'fashion', label: '👕 服饰鞋包' },
  { key: 'sport', label: '🚲 运动出行' },
  { key: 'other', label: '🎮 其他' },
]

const allItems = ref<TradeItem[]>([])

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getTrades()
    allItems.value = res.data
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
  let items = allItems.value
  if (activeTab.value !== 'all') {
    items = items.filter(i => i.category === activeTab.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    items = items.filter(i => i.title.toLowerCase().includes(kw))
  }
  if (sortBy.value === 'price-low') {
    items = [...items].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    items = [...items].sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'popular') {
    items = [...items].sort((a, b) => b.likes - a.likes)
  }
  return items
})

const categoryLabel = (cat: string) => {
  const m: Record<string, string> = {
    book: '教材书籍', digital: '数码电子', life: '生活用品',
    fashion: '服饰鞋包', sport: '运动出行', other: '其他',
  }
  return m[cat] || cat
}
</script>

<template>
  <div class="trade-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>🛒 二手交易</h1>
        <p class="subtitle">发现校园好物，让闲置流转起来</p>
      </div>
      <RouterLink to="/publish" class="btn-sell">+ 发布商品</RouterLink>
    </div>

    <!-- Search & Sort Bar -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input v-model="searchKeyword" placeholder="搜索商品名称..." class="search-input" />
      </div>
      <select v-model="sortBy" class="sort-select">
        <option value="latest">最新发布</option>
        <option value="price-low">价格从低到高</option>
        <option value="price-high">价格从高到低</option>
        <option value="popular">最受欢迎</option>
      </select>
    </div>

    <!-- Category Tabs -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <p>正在加载商品数据...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="fetchData">重新加载</button>
    </div>

    <!-- Goods Grid -->
    <template v-else>
    <div class="goods-grid">
      <RouterLink v-for="item in filteredItems" :key="item.id" :to="'/trade/' + item.id" class="goods-card">
        <div class="goods-image">{{ item.image }}</div>
        <div class="goods-tags">
          <span class="tag condition">{{ item.condition }}</span>
          <span class="tag category-tag">{{ categoryLabel(item.category) }}</span>
        </div>
        <div class="goods-body">
          <h3 class="goods-title">{{ item.title }}</h3>
          <p class="goods-desc" v-if="item.description">{{ item.description }}</p>
          <div class="goods-price-row">
            <span class="goods-price">¥{{ item.price }}</span>
            <span v-if="item.originalPrice" class="goods-original">¥{{ item.originalPrice }}</span>
          </div>
          <div class="goods-meta">
            <span>👤 {{ item.publisher }}</span>
            <span class="dot">·</span>
            <span>📍 {{ item.location }}</span>
            <span class="dot">·</span>
            <span>🕐 {{ item.publishTime }}</span>
          </div>
          <div class="goods-stats">
            <span class="stat-item">❤️ {{ item.likes }} 喜欢</span>
            <span class="stat-item" :class="{ active: item.status === 'open' }">
              {{ item.status === 'open' ? '🟢 在售' : '🔴 已售' }}
            </span>
          </div>
          <div class="goods-actions">
            <button class="btn-contact-mini">💬 联系卖家</button>
            <button class="btn-wish">🤍 想要</button>
          </div>
        </div>
      </RouterLink>

      <div v-if="filteredItems.length === 0 && !loading" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>没有找到相关商品</p>
        <p class="empty-hint">试试更换筛选条件或搜索关键词</p>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.trade-page {
  max-width: 1200px;
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

.btn-sell {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-sell:hover {
  background: #1557b0;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 0 14px;
  border: 1px solid #e0e0e0;
  transition: border-color 0.2s;
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

.sort-select {
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  color: #333;
  cursor: pointer;
  outline: none;
}

/* Tabs */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 18px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 20px;
  font-size: 13px;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.tab-btn.active {
  background: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
}

/* Goods Grid */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.goods-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  color: inherit;
  display: block;
}

.goods-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

.goods-image {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  background: #f8f9fa;
}

.goods-tags {
  position: absolute;
  top: 10px;
  left: 10px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.tag.condition {
  background: #e8f5e9;
  color: #2e7d32;
}

.tag.category-tag {
  background: #e3f2fd;
  color: #1565c0;
}

.goods-body {
  padding: 14px 16px;
}

.goods-title {
  font-size: 14px;
  color: #333;
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-desc {
  font-size: 12px;
  color: #8892b0;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.goods-price {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.goods-original {
  font-size: 12px;
  color: #bbb;
  text-decoration: line-through;
}

.goods-meta {
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 6px;
}

.dot {
  margin: 0 2px;
  color: #ddd;
}

.goods-stats {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 10px;
}

.goods-stats .stat-item.active {
  color: #2e7d32;
  font-weight: 500;
}

.goods-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.action-like {
  font-size: 13px;
  color: #8892b0;
}

.btn-contact-mini {
  padding: 5px 14px;
  background: #1a73e8;
  border: none;
  border-radius: 14px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

.btn-contact-mini:hover {
  background: #1557b0;
}

.btn-wish {
  padding: 5px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  font-size: 12px;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-wish:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

/* Loading */
.loading-state {
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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

/* Empty */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 48px;
}

.empty-state p {
  color: #8892b0;
  margin: 8px 0 0;
}

.empty-hint {
  font-size: 13px;
}

@media (max-width: 1024px) {
  .goods-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .goods-grid {
    grid-template-columns: 1fr;
  }
}
</style>
