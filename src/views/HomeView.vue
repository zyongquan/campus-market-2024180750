<script setup lang="ts"></script>

<template>
  <section class="home-page">
    <div class="hero">
      <h2>🎓 欢迎来到校园轻集市</h2>
      <p>AI 辅助前端工程实践种子项目 — 你的校园二手交易平台</p>
    </div>

    <div class="quick-actions">
      <router-link to="/list" class="action-card">
        <span class="action-icon">📋</span>
        <span class="action-title">浏览商品</span>
        <span class="action-desc">发现校园好物</span>
      </router-link>
      <router-link to="/publish" class="action-card">
        <span class="action-icon">📝</span>
        <span class="action-title">发布信息</span>
        <span class="action-desc">出售闲置物品</span>
      </router-link>
      <router-link to="/message" class="action-card">
        <span class="action-icon">💬</span>
        <span class="action-title">查看消息</span>
        <span class="action-desc">联系买卖双方</span>
      </router-link>
      <router-link to="/profile" class="action-card">
        <span class="action-icon">👤</span>
        <span class="action-title">个人中心</span>
        <span class="action-desc">管理你的账号</span>
      </router-link>
      <router-link to="/board" class="action-card">
        <span class="action-icon">📊</span>
        <span class="action-title">数据看板</span>
        <span class="action-desc">查看运营数据</span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 48px 0 36px;
}

.hero h2 {
  font-size: 32px;
  margin-bottom: 12px;
  color: #333;
}

.hero p {
  color: #666;
  font-size: 16px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, transform 0.15s;
}

.action-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.action-desc {
  font-size: 13px;
  color: #999;
}
</style>
