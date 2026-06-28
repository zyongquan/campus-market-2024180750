<template>
  <nav class="app-nav">
    <div class="nav-inner">
      <RouterLink to="/" class="nav-link">
        <span class="nav-icon">🏠</span>
        <span>首页</span>
      </RouterLink>
      <RouterLink to="/trade" class="nav-link">
        <span class="nav-icon">🛒</span>
        <span>二手交易</span>
      </RouterLink>
      <RouterLink to="/lost-found" class="nav-link">
        <span class="nav-icon">🔍</span>
        <span>失物招领</span>
      </RouterLink>
      <RouterLink to="/group-buy" class="nav-link">
        <span class="nav-icon">🤝</span>
        <span>拼单搭子</span>
      </RouterLink>
      <RouterLink to="/errand" class="nav-link">
        <span class="nav-icon">🏃</span>
        <span>跑腿委托</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-nav {
  border-top: 1px solid #f0f2f5;
  background: #fff;
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 0;
  height: 44px;
  overflow-x: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  text-decoration: none;
  color: #5f6368;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}

.nav-link:hover {
  color: #1a73e8;
}

.nav-link.router-link-active {
  color: #1a73e8;
  border-bottom-color: #1a73e8;
  font-weight: 600;
}

.nav-icon {
  font-size: 16px;
}

/* Hide scrollbar for nav on small screens */
.nav-inner::-webkit-scrollbar {
  display: none;
}
</style>
