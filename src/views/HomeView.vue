<script setup lang="ts">
import { ref } from 'vue'

const categories = ref([
  { name: '二手交易', icon: '🛒', desc: '低价淘好物', path: '/trade', color: '#e8f5e9' },
  { name: '失物招领', icon: '🔍', desc: '找回遗失物品', path: '/lost-found', color: '#fff3e0' },
  { name: '拼单搭子', icon: '🤝', desc: '一起拼更划算', path: '/group-buy', color: '#e3f2fd' },
  { name: '跑腿委托', icon: '🏃', desc: '找人帮忙跑腿', path: '/errand', color: '#fce4ec' },
  { name: '发布信息', icon: '✏️', desc: '快速发布需求', path: '/publish', color: '#f3e5f5' },
  { name: '消息中心', icon: '💬', desc: '查看最新消息', path: '/message', color: '#e0f7fa' },
])

const hotItems = ref([
  { id: 1, title: '数据结构教材（C语言版）', price: 25, image: '📚', seller: '张同学', tag: '几乎全新', type: 'trade' },
  { id: 2, title: '蓝牙耳机 漫步者', price: 89, image: '🎧', seller: '李同学', tag: '9成新', type: 'trade' },
  { id: 3, title: '【寻物】黑色钱包', price: 0, image: '👛', seller: '王同学', tag: '拾到有谢', type: 'lost' },
  { id: 4, title: '【招领】校园卡 张三', image: '🪪', seller: '失物招领处', tag: '待认领', type: 'found' },
  { id: 5, title: '考研数学复习全书拼单', price: 15, image: '📖', seller: '赵同学', tag: '还差2人', type: 'group' },
  { id: 6, title: '代取快递 中通/圆通', price: 3, image: '📦', seller: '周同学', tag: '可接单', type: 'errand' },
  { id: 7, title: '可调节台灯暖光', price: 35, image: '💡', seller: '孙同学', tag: '8成新', type: 'trade' },
  { id: 8, title: '周末羽毛球搭子', image: '🏸', seller: '吴同学', tag: '2=2', type: 'group' },
])

const stats = ref([
  { num: '3,520', label: '注册用户', icon: '👥' },
  { num: '1,286', label: '在售商品', icon: '📦' },
  { num: '892', label: '本月成交', icon: '🤝' },
  { num: '47', label: '今日发布', icon: '📝' },
])

const announcements = ref([
  { id: 1, text: '📢 校园轻集市正式上线！欢迎同学们使用', date: '2026-06-27' },
  { id: 2, text: '⚠️ 交易安全提醒：请选择校内当面交易', date: '2026-06-26' },
  { id: 3, text: '🎉 毕业季专场：学长学姐好物大放送', date: '2026-06-25' },
])
</script>

<template>
  <div class="home-page">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">校园轻集市</h1>
        <p class="hero-desc">轻量、可信、面向校园生活的综合服务平台</p>
        <p class="hero-sub">二手交易 · 失物招领 · 拼单搭子 · 跑腿委托 — 你的校园生活助手</p>
        <div class="hero-actions">
          <RouterLink to="/trade" class="hero-btn primary">开始浏览</RouterLink>
          <RouterLink to="/publish" class="hero-btn secondary">发布信息</RouterLink>
        </div>
      </div>
      <div class="hero-illustration">
        <div class="float-card c1">📚 教材 ¥25</div>
        <div class="float-card c2">🤝 拼单中</div>
        <div class="float-card c3">📦 代取快递</div>
        <div class="float-card c4">🔍 失物招领</div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar">
      <div v-for="s in stats" :key="s.label" class="stat-item">
        <span class="stat-icon">{{ s.icon }}</span>
        <div class="stat-info">
          <span class="stat-num">{{ s.num }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- Category Grid -->
    <section class="section">
      <div class="section-header">
        <h2>服务分类</h2>
        <span class="section-hint">选择你需要的服务</span>
      </div>
      <div class="category-grid">
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          :to="cat.path"
          class="category-card"
          :style="{ background: cat.color }"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <div class="cat-info">
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-desc">{{ cat.desc }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Hot Items -->
    <section class="section">
      <div class="section-header">
        <h2>🔥 热门推荐</h2>
        <RouterLink to="/trade" class="view-all">查看全部 →</RouterLink>
      </div>
      <div class="hot-grid">
        <div v-for="item in hotItems" :key="item.id" class="hot-card">
          <div class="hot-image">{{ item.image }}</div>
          <div class="hot-body">
            <span class="hot-tag">{{ item.tag }}</span>
            <h3>{{ item.title }}</h3>
            <div class="hot-footer">
              <span class="hot-price" v-if="item.price && item.price > 0">¥{{ item.price }}</span>
              <span class="hot-price free" v-else>免费</span>
              <span class="hot-seller">{{ item.seller }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcements -->
    <section class="section">
      <div class="section-header">
        <h2>📢 平台公告</h2>
      </div>
      <div class="announce-list">
        <div v-for="a in announcements" :key="a.id" class="announce-item">
          <span class="announce-text">{{ a.text }}</span>
          <span class="announce-date">{{ a.date }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero */
.hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 40%, #669df6 100%);
  border-radius: 16px;
  padding: 48px 56px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 6px;
}

.hero-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-btn {
  padding: 10px 28px;
  border-radius: 24px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.hero-btn.primary {
  background: #fff;
  color: #1a73e8;
}

.hero-btn.primary:hover {
  background: #f0f4ff;
  transform: translateY(-1px);
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.hero-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-illustration {
  position: relative;
  z-index: 2;
  width: 240px;
  height: 200px;
  flex-shrink: 0;
}

.float-card {
  position: absolute;
  background: #fff;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  color: #333;
}

.float-card.c1 { top: 10px; right: 20px; }
.float-card.c2 { top: 60px; right: 100px; }
.float-card.c3 { top: 120px; right: 10px; }
.float-card.c4 { top: 140px; right: 90px; }

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #1a73e8;
}

.stat-label {
  font-size: 13px;
  color: #8892b0;
}

/* Section */
.section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  color: #1a1a2e;
  margin: 0;
}

.section-hint {
  font-size: 13px;
  color: #8892b0;
  margin-left: 12px;
}

.view-all {
  font-size: 14px;
  color: #1a73e8;
  text-decoration: none;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 14px;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cat-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.cat-info {
  display: flex;
  flex-direction: column;
}

.cat-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.cat-desc {
  font-size: 12px;
  color: #8892b0;
}

/* Hot Grid */
.hot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.hot-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.hot-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #f8f9fa;
}

.hot-body {
  padding: 14px 16px;
}

.hot-tag {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 10px;
  margin-bottom: 6px;
}

.hot-body h3 {
  font-size: 14px;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hot-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hot-price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.hot-price.free {
  color: #2e7d32;
}

.hot-seller {
  font-size: 12px;
  color: #8892b0;
}

/* Announcements */
.announce-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.announce-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.announce-item:last-child {
  border-bottom: none;
}

.announce-text {
  font-size: 14px;
  color: #333;
}

.announce-date {
  font-size: 12px;
  color: #8892b0;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .hero-banner {
    padding: 32px 28px;
  }
  .hero-illustration {
    display: none;
  }
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .hot-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 28px;
  }
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
