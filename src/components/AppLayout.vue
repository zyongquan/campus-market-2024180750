<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">🏫 校园轻集市</span>
          <span class="footer-slogan">轻量、可信、面向校园生活</span>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>服务分类</h4>
            <RouterLink to="/trade">二手交易</RouterLink>
            <RouterLink to="/lost-found">失物招领</RouterLink>
            <RouterLink to="/group-buy">拼单搭子</RouterLink>
            <RouterLink to="/errand">跑腿委托</RouterLink>
          </div>
          <div class="link-group">
            <h4>帮助中心</h4>
            <a href="#">使用指南</a>
            <a href="#">交易安全</a>
            <a href="#">举报投诉</a>
            <a href="#">意见反馈</a>
          </div>
          <div class="link-group">
            <h4>关于我们</h4>
            <a href="#">平台介绍</a>
            <a href="#">联系站长</a>
            <a href="#">加入我们</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 校园轻集市 Campus Market. 仅限校内使用 · 请遵守校园规范</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px;
  box-sizing: border-box;
}

.app-footer {
  background: #1a1a2e;
  color: #ccc;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-logo {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.footer-slogan {
  font-size: 13px;
  color: #8892b0;
}

.footer-links {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-group h4 {
  color: #fff;
  font-size: 14px;
  margin-bottom: 4px;
}

.link-group a {
  color: #8892b0;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.link-group a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 20px;
  text-align: center;
}

.footer-bottom p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}
</style>
