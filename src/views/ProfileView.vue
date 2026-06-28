<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '游客用户',
  avatar: '👤',
  school: '某某大学',
  joinDate: '2026-06-01',
})

const stats = ref({
  publishCount: 5,
  soldCount: 3,
  favCount: 12,
})
</script>

<template>
  <div class="profile-page">
    <h1>👤 个人中心</h1>

    <!-- 用户信息卡片 -->
    <div class="profile-card">
      <div class="avatar-large">{{ user.avatar }}</div>
      <h2>{{ user.name }}</h2>
      <p class="school">{{ user.school }}</p>
      <p class="join-date">加入时间：{{ user.joinDate }}</p>
      <button class="btn-edit">编辑资料</button>
    </div>

    <!-- 数据统计 -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-num">{{ stats.publishCount }}</span>
        <span class="stat-label">已发布</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ stats.soldCount }}</span>
        <span class="stat-label">已售出</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ stats.favCount }}</span>
        <span class="stat-label">收藏</span>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-list">
      <div class="menu-item">📦 我发布的</div>
      <div class="menu-item">❤️ 我的收藏</div>
      <div class="menu-item">📋 浏览记录</div>
      <div class="menu-item">⚙️ 账号设置</div>
      <div class="menu-item">❓ 帮助与反馈</div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 480px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 24px;
}

.profile-card {
  text-align: center;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 20px;
}

.avatar-large {
  font-size: 64px;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 50%;
  margin: 0 auto 16px;
}

.profile-card h2 {
  font-size: 20px;
  margin-bottom: 6px;
}

.school {
  color: #666;
  margin-bottom: 4px;
}

.join-date {
  color: #999;
  font-size: 13px;
  margin-bottom: 16px;
}

.btn-edit {
  padding: 8px 24px;
  background: #fff;
  border: 1px solid #409eff;
  color: #409eff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  text-align: center;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.menu-list {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  font-size: 15px;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #fafafa;
}
</style>
