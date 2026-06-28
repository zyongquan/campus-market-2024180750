<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '张小明',
  avatar: '👤',
  school: '某某大学 · 计算机科学与技术学院',
  studentId: '2024180750',
  joinDate: '2026年6月',
  bio: '热爱生活，诚信交易 ✨',
})

const stats = ref([
  { num: 12, label: '我的发布', icon: '📝' },
  { num: 8, label: '已成交', icon: '✅' },
  { num: 23, label: '收藏', icon: '❤️' },
  { num: 5, label: '评价', icon: '⭐' },
])

const menus = ref([
  { icon: '📦', label: '我发布的', desc: '查看和管理所有发布', badge: 12 },
  { icon: '❤️', label: '我的收藏', desc: '收藏的商品和信息', badge: 23 },
  { icon: '👁️', label: '浏览记录', desc: '最近浏览过的内容' },
  { icon: '💬', label: '我的消息', desc: '私信和系统通知', badge: 3, badgeColor: '#e74c3c' },
  { icon: '📊', label: '交易记录', desc: '已完成和进行中的交易' },
  { icon: '📍', label: '收货地址', desc: '管理常用地址' },
  { icon: '🔐', label: '账号安全', desc: '修改密码、绑定手机' },
  { icon: '⚙️', label: '设置', desc: '通知、隐私、通用设置' },
  { icon: '❓', label: '帮助与反馈', desc: '常见问题、意见反馈' },
])

const recentActivity = ref([
  { type: 'publish', text: '发布了二手商品「数据结构教材」', time: '2小时前' },
  { type: 'like', text: '收藏了「蓝牙耳机 漫步者」', time: '5小时前' },
  { type: 'publish', text: '发布了寻物启事「黑色钱包」', time: '昨天' },
  { type: 'message', text: '与张同学进行了对话', time: '昨天' },
  { type: 'deal', text: '完成了交易「可调光台灯」', time: '2天前' },
])
</script>

<template>
  <div class="user-page">
    <!-- Profile Card -->
    <div class="profile-card">
      <div class="profile-bg"></div>
      <div class="profile-body">
        <div class="avatar-section">
          <div class="avatar">{{ user.avatar }}</div>
          <button class="btn-edit-avatar">📷 更换头像</button>
        </div>
        <div class="profile-info">
          <div class="name-row">
            <h1>{{ user.name }}</h1>
            <span class="verified-badge">✓ 已认证</span>
          </div>
          <p class="school">{{ user.school }}</p>
          <p class="bio">{{ user.bio }}</p>
          <div class="profile-meta">
            <span>学号: {{ user.studentId }}</span>
            <span class="dot">·</span>
            <span>{{ user.joinDate }} 加入</span>
          </div>
        </div>
        <button class="btn-edit-profile">编辑资料</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <span class="stat-icon">{{ s.icon }}</span>
        <span class="stat-num">{{ s.num }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Menu & Activity -->
    <div class="two-col">
      <!-- Menu List -->
      <div class="menu-section">
        <h2>功能菜单</h2>
        <div class="menu-list">
          <div v-for="m in menus" :key="m.label" class="menu-item">
            <span class="menu-icon">{{ m.icon }}</span>
            <div class="menu-info">
              <span class="menu-label">{{ m.label }}</span>
              <span class="menu-desc">{{ m.desc }}</span>
            </div>
            <span v-if="m.badge" class="menu-badge" :style="{ background: m.badgeColor || '#1a73e8' }">{{ m.badge }}</span>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h2>最近动态</h2>
        <div class="activity-list">
          <div v-for="(act, idx) in recentActivity" :key="idx" class="activity-item">
            <span class="act-dot" :class="act.type"></span>
            <span class="act-text">{{ act.text }}</span>
            <span class="act-time">{{ act.time }}</span>
          </div>
        </div>

        <!-- Quick Links -->
        <h2 style="margin-top: 24px;">快捷入口</h2>
        <div class="quick-links">
          <RouterLink to="/publish" class="quick-link">
            <span class="ql-icon">✏️</span>
            <span>发布信息</span>
          </RouterLink>
          <RouterLink to="/trade" class="quick-link">
            <span class="ql-icon">🛒</span>
            <span>浏览商品</span>
          </RouterLink>
          <RouterLink to="/message" class="quick-link">
            <span class="ql-icon">💬</span>
            <span>我的消息</span>
          </RouterLink>
          <div class="quick-link" @click="() => {}">
            <span class="ql-icon">🏪</span>
            <span>我的店铺</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-page {
  max-width: 1000px;
  margin: 0 auto;
}

/* Profile Card */
.profile-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}

.profile-bg {
  height: 100px;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 50%, #669df6 100%);
}

.profile-body {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 0 28px 24px;
  position: relative;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: -40px;
  flex-shrink: 0;
}

.avatar {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #f0f2f5;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.btn-edit-avatar {
  font-size: 11px;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 0;
}

.profile-info {
  flex: 1;
  padding-top: 12px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.name-row h1 {
  font-size: 24px;
  color: #1a1a2e;
  margin: 0;
}

.verified-badge {
  font-size: 12px;
  padding: 2px 10px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 10px;
  font-weight: 500;
}

.school {
  font-size: 14px;
  color: #5f6368;
  margin: 0 0 4px 0;
}

.bio {
  font-size: 14px;
  color: #8892b0;
  margin: 0 0 6px 0;
}

.profile-meta {
  font-size: 12px;
  color: #bbb;
}

.dot {
  margin: 0 6px;
}

.btn-edit-profile {
  margin-top: 12px;
  padding: 8px 20px;
  background: #fff;
  border: 1px solid #1a73e8;
  color: #1a73e8;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-edit-profile:hover {
  background: #e8f0fe;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 24px;
}

.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #1a73e8;
}

.stat-label {
  font-size: 13px;
  color: #8892b0;
}

/* Two Column */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Menu */
.menu-section h2,
.activity-section h2 {
  font-size: 18px;
  color: #1a1a2e;
  margin: 0 0 14px 0;
}

.menu-list {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.menu-desc {
  font-size: 12px;
  color: #8892b0;
}

.menu-badge {
  font-size: 11px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  padding: 0 6px;
}

.menu-arrow {
  font-size: 18px;
  color: #ccc;
}

/* Activity */
.activity-list {
  background: #fff;
  border-radius: 14px;
  padding: 8px 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
}

.act-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #1a73e8;
}

.act-dot.publish { background: #4caf50; }
.act-dot.like { background: #e91e63; }
.act-dot.message { background: #1a73e8; }
.act-dot.deal { background: #ff9800; }

.act-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.act-time {
  font-size: 12px;
  color: #bbb;
  flex-shrink: 0;
}

/* Quick Links */
.quick-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px;
  background: #fff;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.quick-link:hover {
  background: #f0f4ff;
}

.ql-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .profile-body {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .name-row {
    justify-content: center;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
