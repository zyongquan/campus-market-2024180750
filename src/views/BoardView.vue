<script setup lang="ts">
import { ref } from 'vue'

// 静态统计数据
const overview = ref({
  totalGoods: 1286,
  totalUsers: 3520,
  todayDeals: 47,
  monthlyDeals: 892,
})

const categoryStats = ref([
  { name: '教材书籍', count: 342, icon: '📚' },
  { name: '数码电子', count: 256, icon: '💻' },
  { name: '生活用品', count: 198, icon: '🛋️' },
  { name: '服饰鞋包', count: 175, icon: '👕' },
  { name: '运动出行', count: 185, icon: '🚲' },
  { name: '娱乐周边', count: 130, icon: '🎮' },
])

const recentDeals = ref([
  { id: 1, goods: '二手教材《数据结构》', buyer: '张三', seller: '李四', price: 25, time: '10分钟前' },
  { id: 2, goods: '全新耳机', buyer: '王五', seller: '赵六', price: 89, time: '30分钟前' },
  { id: 3, goods: '台灯（可调光）', buyer: '孙七', seller: '周八', price: 35, time: '1小时前' },
  { id: 4, goods: '机械键盘', buyer: '吴九', seller: '郑十', price: 150, time: '2小时前' },
])
</script>

<template>
  <div class="board-page">
    <h1>📊 数据看板</h1>
    <p class="subtitle">校园集市运营数据概览</p>

    <!-- 核心指标 -->
    <div class="overview-cards">
      <div class="overview-card">
        <div class="card-icon">📦</div>
        <div class="card-num">{{ overview.totalGoods.toLocaleString() }}</div>
        <div class="card-label">商品总数</div>
      </div>
      <div class="overview-card">
        <div class="card-icon">👥</div>
        <div class="card-num">{{ overview.totalUsers.toLocaleString() }}</div>
        <div class="card-label">注册用户</div>
      </div>
      <div class="overview-card">
        <div class="card-icon">🤝</div>
        <div class="card-num">{{ overview.todayDeals }}</div>
        <div class="card-label">今日成交</div>
      </div>
      <div class="overview-card">
        <div class="card-icon">📈</div>
        <div class="card-num">{{ overview.monthlyDeals.toLocaleString() }}</div>
        <div class="card-label">本月成交</div>
      </div>
    </div>

    <!-- 分类统计 -->
    <div class="section">
      <h2>分类统计</h2>
      <div class="category-grid">
        <div v-for="cat in categoryStats" :key="cat.name" class="category-card">
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-count">{{ cat.count }} 件</span>
        </div>
      </div>
    </div>

    <!-- 最近成交 -->
    <div class="section">
      <h2>最近成交</h2>
      <div class="deal-list">
        <div v-for="deal in recentDeals" :key="deal.id" class="deal-item">
          <div class="deal-goods">{{ deal.goods }}</div>
          <div class="deal-meta">
            <span>{{ deal.buyer }} 从 {{ deal.seller }} 处购买</span>
            <span class="deal-price">¥{{ deal.price }}</span>
            <span class="deal-time">{{ deal.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-page {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 28px;
}

/* 核心指标卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.overview-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.card-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.card-num {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.card-label {
  color: #999;
  font-size: 14px;
}

/* 分类统计 */
.section {
  margin-bottom: 28px;
}

.section h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
}

.cat-icon {
  font-size: 24px;
}

.cat-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.cat-count {
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
}

/* 最近成交 */
.deal-list {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.deal-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.deal-item:last-child {
  border-bottom: none;
}

.deal-goods {
  font-weight: 500;
  margin-bottom: 4px;
}

.deal-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.deal-price {
  color: #e74c3c;
  font-weight: 500;
}

.deal-time {
  color: #bbb;
}

@media (max-width: 640px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
