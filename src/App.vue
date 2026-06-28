<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeIndex = computed(() => {
  const path = route.path
  if (path.startsWith('/home') || path === '/') return '/home'
  if (path.startsWith('/list') || path.startsWith('/detail')) return '/list'
  if (path.startsWith('/publish')) return '/publish'
  if (path.startsWith('/message')) return '/message'
  if (path.startsWith('/profile')) return '/profile'
  return ''
})
</script>

<template>
  <div class="app-layout">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-left">
        <h1 class="logo">🎓 校园轻集市</h1>
      </div>

      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        class="nav-menu"
      >
        <el-menu-item index="/home">
          <router-link to="/home">🏠 首页</router-link>
        </el-menu-item>
        <el-menu-item index="/list">
          <router-link to="/list">📋 列表</router-link>
        </el-menu-item>
        <el-menu-item index="/publish">
          <router-link to="/publish">📝 发布</router-link>
        </el-menu-item>
        <el-menu-item index="/message">
          <router-link to="/message">💬 消息</router-link>
        </el-menu-item>
        <el-menu-item index="/profile">
          <router-link to="/profile">👤 我的</router-link>
        </el-menu-item>
        <el-menu-item index="/board">
          <router-link to="/board">📊 看板</router-link>
        </el-menu-item>
      </el-menu>
    </header>

    <!-- 主体内容 -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 底部 -->
    <footer class="app-footer">
      <p>© 2026 校园轻集市 — AI 辅助前端工程实践</p>
    </footer>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  background: #f5f7fa;
  color: #333;
}

a {
  text-decoration: none;
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.header-left .logo {
  font-size: 18px;
  color: #409eff;
  white-space: nowrap;
}

.nav-menu {
  border-bottom: none !important;
}

.nav-menu .el-menu-item {
  padding: 0;
}

.nav-menu .el-menu-item a {
  display: block;
  padding: 0 20px;
  color: inherit;
  text-decoration: none;
}

/* 主体内容 */
.app-main {
  flex: 1;
  padding: 32px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* 底部 */
.app-footer {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 13px;
  border-top: 1px solid #e4e7ed;
  background: #fff;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-top: 12px;
  }

  .app-main {
    padding: 16px;
  }
}
</style>
