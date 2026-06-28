<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('all')
const sortBy = ref('latest')
const searchKeyword = ref('')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'book', label: '📚 教材书籍' },
  { key: 'digital', label: '💻 数码电子' },
  { key: 'life', label: '🛋️ 生活用品' },
  { key: 'fashion', label: '👕 服饰鞋包' },
  { key: 'sport', label: '🚲 运动出行' },
  { key: 'other', label: '🎮 其他' },
]

interface GoodsItem {
  id: number
  title: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  campus: string
  condition: string
  time: string
  likes: number
  category: string
}

const allItems = ref<GoodsItem[]>([
  { id: 1, title: '数据结构（C语言版）严蔚敏', price: 25, originalPrice: 42, image: '📚', seller: '张同学', campus: '主校区', condition: '9成新', time: '2小时前', likes: 15, category: 'book' },
  { id: 2, title: '漫步者蓝牙耳机 W820NB 降噪版', price: 89, originalPrice: 249, image: '🎧', seller: '李同学', campus: '东校区', condition: '几乎全新', time: '5小时前', likes: 28, category: 'digital' },
  { id: 3, title: '可调光LED台灯 宿舍神器', price: 35, originalPrice: 79, image: '💡', seller: '王同学', campus: '主校区', condition: '8成新', time: '1天前', likes: 9, category: 'life' },
  { id: 4, title: '机械键盘 IKBC C87 茶轴', price: 150, originalPrice: 328, image: '⌨️', seller: '赵同学', campus: '西校区', condition: '9成新', time: '2天前', likes: 42, category: 'digital' },
  { id: 5, title: '考研数学一复习全书（2025版）', price: 40, originalPrice: 89, image: '📖', seller: '孙同学', campus: '主校区', condition: '有笔记', time: '1小时前', likes: 7, category: 'book' },
  { id: 6, title: '26寸变速山地自行车', price: 200, originalPrice: 680, image: '🚲', seller: '周同学', campus: '东校区', condition: '7成新', time: '3天前', likes: 33, category: 'sport' },
  { id: 7, title: '宿舍用小功率电煮锅 1.5L', price: 30, originalPrice: 65, image: '🍳', seller: '吴同学', campus: '主校区', condition: '8成新', time: '6小时前', likes: 12, category: 'life' },
  { id: 8, title: 'iPad Air 4 64G WiFi 含笔', price: 2200, originalPrice: 4799, image: '📱', seller: '郑同学', campus: '西校区', condition: '95新', time: '2小时前', likes: 56, category: 'digital' },
  { id: 9, title: '大学英语四级真题集+词汇书', price: 18, image: '📝', seller: '钱同学', campus: '主校区', condition: '有写过', time: '4天前', likes: 5, category: 'book' },
  { id: 10, title: '冬季棉被 加厚 双人1.8m', price: 45, originalPrice: 139, image: '🛏️', seller: '陈同学', campus: '东校区', condition: '8成新', time: '1周前', likes: 4, category: 'life' },
  { id: 11, title: '男生休闲西装外套 L码', price: 68, image: '👔', seller: '刘同学', campus: '主校区', condition: '9成新', time: '2天前', likes: 11, category: 'fashion' },
  { id: 12, title: '任天堂Switch Lite 动森限定', price: 800, originalPrice: 1499, image: '🎮', seller: '杨同学', campus: '西校区', condition: '95新', time: '3小时前', likes: 67, category: 'other' },
])

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

    <!-- Goods Grid -->
    <div class="goods-grid">
      <div v-for="item in filteredItems" :key="item.id" class="goods-card">
        <div class="goods-image">{{ item.image }}</div>
        <div class="goods-tags">
          <span class="tag condition">{{ item.condition }}</span>
        </div>
        <div class="goods-body">
          <h3 class="goods-title">{{ item.title }}</h3>
          <div class="goods-price-row">
            <span class="goods-price">¥{{ item.price }}</span>
            <span v-if="item.originalPrice" class="goods-original">¥{{ item.originalPrice }}</span>
          </div>
          <div class="goods-meta">
            <span>{{ item.seller }}</span>
            <span class="dot">·</span>
            <span>{{ item.campus }}</span>
            <span class="dot">·</span>
            <span>{{ item.time }}</span>
          </div>
          <div class="goods-actions">
            <span class="action-like">❤️ {{ item.likes }}</span>
            <button class="btn-contact-mini">联系卖家</button>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>没有找到相关商品</p>
        <p class="empty-hint">试试更换筛选条件或搜索关键词</p>
      </div>
    </div>
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

.goods-body {
  padding: 14px 16px;
}

.goods-title {
  font-size: 14px;
  color: #333;
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
  margin-bottom: 10px;
}

.dot {
  margin: 0 4px;
  color: #ddd;
}

.goods-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-like {
  font-size: 13px;
  color: #8892b0;
}

.btn-contact-mini {
  padding: 4px 14px;
  background: #f0f2f5;
  border: none;
  border-radius: 14px;
  font-size: 12px;
  color: #1a73e8;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-contact-mini:hover {
  background: #e3f2fd;
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
