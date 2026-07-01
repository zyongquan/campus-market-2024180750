<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-icon">🏫</span>
        <span class="brand-text">校园轻集市</span>
      </RouterLink>

      <div class="header-search">
        <input
          type="text"
          placeholder="搜索商品、失物、拼单…"
          class="search-input"
        />
        <button class="search-btn">🔍</button>
      </div>

      <div class="header-actions">
        <RouterLink to="/publish" class="btn-publish">
          <span>✏️</span>
          <span>发布</span>
        </RouterLink>
        <RouterLink to="/message" class="msg-icon" title="消息">
          <span class="icon-bell">💬</span>
          <span class="badge">3</span>
        </RouterLink>
        <RouterLink to="/user" class="user-avatar" title="个人中心">
          <span class="user-name">{{ userStore.displayName }}</span>
          <span class="user-icon">👤</span>
        </RouterLink>
      </div>
    </div>

    <AppNav />
  </header>
</template>

<script setup lang="ts">
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e8eaed;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a73e8;
  white-space: nowrap;
}

.header-search {
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  background: #f0f2f5;
  border-radius: 24px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s, background 0.2s;
}

.header-search:focus-within {
  background: #fff;
  border-color: #1a73e8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #9aa0a6;
}

.search-btn {
  background: none;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 16px;
  color: #5f6368;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.btn-publish {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 18px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-publish:hover {
  background: #1557b0;
}

.msg-icon {
  position: relative;
  font-size: 20px;
  text-decoration: none;
  color: #5f6368;
  padding: 6px;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #e74c3c;
  color: #fff;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 20px;
  transition: background 0.2s;
  color: #333;
  font-weight: 500;
}

.user-avatar:hover {
  background: #f0f2f5;
}

.user-icon {
  font-size: 22px;
}
</style>
