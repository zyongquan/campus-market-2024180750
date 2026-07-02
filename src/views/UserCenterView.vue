<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useFavoriteStore } from '../stores/favorite'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

// ---------- 我的发布 ----------
interface MyPost {
  id: number | string
  title: string
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  image: string
  status: string
  time: string
  extra: string
  route: string
}

const myPostsLoading = ref(false)
const myPostsError = ref('')
const myPosts = ref<MyPost[]>([])

async function fetchMyPosts() {
  if (!userStore.isLoggedIn || !userStore.currentUser) return
  const publisher = userStore.displayName

  myPostsLoading.value = true
  myPostsError.value = ''
  try {
    const [tradeRes, lostRes, groupRes, errandRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])

    const result: MyPost[] = []

    ;(tradeRes.data as TradeItem[]).forEach((item) => {
      if (item.publisher === publisher) {
        result.push({
          id: item.id, title: item.title, type: 'trade',
          image: item.image || '📦', status: item.status,
          time: item.publishTime || '',
          extra: `¥${item.price}`,
          route: `/trade/${item.id}`,
        })
      }
    })

    ;(lostRes.data as LostFoundItem[]).forEach((item) => {
      if (item.contact && item.contact.includes(publisher)) {
        result.push({
          id: item.id, title: item.title, type: 'lostFound',
          image: item.image || '👛', status: item.status,
          time: item.eventTime || '',
          extra: item.type === 'lost' ? '寻物' : '招领',
          route: `/lost-found/${item.id}`,
        })
      }
    })

    ;(groupRes.data as GroupBuyItem[]).forEach((item) => {
      if (item.publisher === publisher) {
        result.push({
          id: item.id, title: item.title, type: 'groupBuy',
          image: item.image || '🤝', status: item.status,
          time: item.deadline || '',
          extra: `${item.currentCount}/${item.targetCount}人`,
          route: `/group-buy/${item.id}`,
        })
      }
    })

    ;(errandRes.data as ErrandItem[]).forEach((item) => {
      if (item.publisher === publisher) {
        result.push({
          id: item.id, title: item.title, type: 'errand',
          image: item.image || '📦', status: item.status,
          time: item.deadline || '',
          extra: `¥${item.reward}`,
          route: `/errand/${item.id}`,
        })
      }
    })

    myPosts.value = result
  } catch (e: any) {
    myPostsError.value = e.message || '加载失败'
  } finally {
    myPostsLoading.value = false
  }
}

// 登录后自动加载，切换用户时重新加载
watch(() => userStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) fetchMyPosts()
})

onMounted(() => {
  if (userStore.isLoggedIn) fetchMyPosts()
})

// ---------- 统计 ----------
const stats = computed(() => [
  { num: myPosts.value.length, label: '我的发布', icon: '📝' },
  { num: 1, label: '已成交', icon: '✅' },
  { num: favoriteStore.favoriteCount, label: '收藏', icon: '❤️' },
  { num: 2, label: '评价', icon: '⭐' },
])

const menus = computed(() => [
  { icon: '📦', label: '我发布的', desc: '查看和管理所有发布', badge: myPosts.value.length },
  { icon: '❤️', label: '我的收藏', desc: '收藏的商品和信息', badge: favoriteStore.favoriteCount },
  { icon: '💬', label: '我的消息', desc: '私信和系统通知', badge: 3, badgeColor: '#e74c3c' },
  { icon: '📊', label: '交易记录', desc: '已完成和进行中的交易' },
  { icon: '📍', label: '收货地址', desc: '管理常用地址' },
  { icon: '🔐', label: '账号安全', desc: '修改密码、绑定手机' },
  { icon: '⚙️', label: '设置', desc: '通知、隐私、通用设置' },
])

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易', lostFound: '失物招领',
    groupBuy: '拼单搭子', errand: '跑腿委托',
  }
  return map[type] || '校园信息'
}

function getDetailRoute(item: { type: string; id: number | string }) {
  const m: Record<string, string> = {
    trade: '/trade', lostFound: '/lost-found',
    groupBuy: '/group-buy', errand: '/errand',
  }
  return `${m[item.type] || '/trade'}/${item.id}`
}
</script>

<template>
  <div class="user-page">
    <!-- 未登录 -->
    <div v-if="!userStore.isLoggedIn" class="not-logged-in">
      <span class="nli-icon">🔐</span>
      <h2>请先登录</h2>
      <p>登录后可以查看个人资料、我的收藏和我的发布。</p>
      <RouterLink to="/login" class="nli-btn">去登录</RouterLink>
    </div>

    <template v-else>
    <!-- Profile Card -->
    <div class="profile-card">
      <div class="profile-bg"></div>
      <div class="profile-body">
        <div class="avatar-section">
          <div class="avatar">{{ userStore.currentUser?.avatar || '👤' }}</div>
        </div>
        <div class="profile-info">
          <div class="name-row">
            <h1>{{ userStore.displayName }}</h1>
            <span class="verified-badge">✓ 已认证</span>
          </div>
          <p class="school">{{ userStore.userDescription }}</p>
          <p class="bio">{{ userStore.currentUser?.bio }}</p>
          <div class="profile-meta">
            <span>学号: 2024180750</span>
            <span class="dot">·</span>
            <span>2024 级</span>
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

    <!-- My Posts + Favorites -->
    <div class="two-col">
      <!-- My Posts -->
      <div class="panel-section">
        <h2>📝 我的发布</h2>
        <div v-if="myPostsLoading" class="loading-panel">
          <span class="mini-spinner"></span>
          <p>加载中...</p>
        </div>
        <div v-else-if="myPostsError" class="error-panel">
          <p>{{ myPostsError }}</p>
          <button class="btn-retry-sm" @click="fetchMyPosts">重新加载</button>
        </div>
        <div v-else-if="myPosts.length === 0" class="empty-panel">
          <span class="empty-icon">📝</span>
          <p>还没有发布任何信息</p>
          <RouterLink to="/publish" class="btn-publish-link">去发布</RouterLink>
        </div>
        <div v-else class="post-list">
          <RouterLink v-for="post in myPosts" :key="`${post.type}-${post.id}`"
            :to="post.route" class="post-item">
            <div class="post-image">{{ post.image }}</div>
            <div class="post-info">
              <div class="post-header">
                <span class="post-title">{{ post.title }}</span>
                <span class="post-type-tag">{{ getTypeLabel(post.type) }}</span>
              </div>
              <div class="post-meta">
                <span>{{ post.extra }}</span>
                <span class="post-dot">·</span>
                <span>{{ post.time }}</span>
                <span class="post-dot">·</span>
                <span :class="post.status === 'open' ? 'status-open' : 'status-closed'">
                  {{ post.status === 'open' ? '进行中' : '已结束' }}
                </span>
              </div>
            </div>
            <span class="post-arrow">›</span>
          </RouterLink>
        </div>
      </div>

      <!-- My Favorites -->
      <div class="panel-section">
        <h2>❤️ 我的收藏</h2>
        <div v-if="favoriteStore.favorites.length === 0" class="empty-panel">
          <span class="empty-icon">📭</span>
          <p>还没有收藏任何内容</p>
          <p class="empty-hint">去二手交易、失物招领等页面浏览并收藏感兴趣的信息吧</p>
        </div>
        <div v-else class="favorite-list">
          <div v-for="item in favoriteStore.favorites" :key="`${item.type}-${item.id}`" class="fav-item">
            <div class="fav-image">{{ item.image || '📦' }}</div>
            <div class="fav-info">
              <div class="fav-header">
                <RouterLink :to="getDetailRoute(item)" class="fav-title-link">{{ item.title }}</RouterLink>
                <span class="fav-type-tag">{{ getTypeLabel(item.type) }}</span>
              </div>
              <p class="fav-desc">{{ item.description }}</p>
              <div class="fav-meta">
                <span v-if="item.location">📍 {{ item.location }}</span>
                <span v-if="item.price !== undefined" class="fav-price">¥{{ item.price }}</span>
              </div>
            </div>
            <button
              class="btn-remove-fav"
              @click="favoriteStore.removeFavorite(item.type, item.id)"
              title="取消收藏"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Function Menu -->
    <div class="panel-section">
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
    </template>
  </div>
</template>

<style scoped>
.user-page { max-width: 1000px; margin: 0 auto; }

/* Profile Card */
.profile-card { background: #fff; border-radius: 16px; overflow: hidden; margin-bottom: 20px; }
.profile-bg { height: 100px; background: linear-gradient(135deg, #1a73e8 0%, #4285f4 50%, #669df6 100%); }
.profile-body { display: flex; align-items: flex-start; gap: 24px; padding: 0 28px 24px; position: relative; }
.avatar-section { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: -40px; flex-shrink: 0; }
.avatar { width: 88px; height: 88px; display: flex; align-items: center; justify-content: center; font-size: 48px; background: #f0f2f5; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
.profile-info { flex: 1; padding-top: 12px; }
.name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.name-row h1 { font-size: 24px; color: #1a1a2e; margin: 0; }
.verified-badge { font-size: 12px; padding: 2px 10px; background: #e8f5e9; color: #2e7d32; border-radius: 10px; font-weight: 500; }
.school { font-size: 14px; color: #5f6368; margin: 0 0 4px 0; }
.bio { font-size: 14px; color: #8892b0; margin: 0 0 6px 0; }
.profile-meta { font-size: 12px; color: #bbb; }
.dot { margin: 0 6px; }
.btn-edit-profile { margin-top: 12px; padding: 8px 20px; background: #fff; border: 1px solid #1a73e8; color: #1a73e8; border-radius: 20px; font-size: 13px; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.btn-edit-profile:hover { background: #e8f0fe; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
.stat-card { background: #fff; border-radius: 12px; padding: 18px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-icon { font-size: 24px; }
.stat-num { font-size: 26px; font-weight: 700; color: #1a73e8; }
.stat-label { font-size: 13px; color: #8892b0; }

/* Two Column */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

/* Panel */
.panel-section { background: #fff; border-radius: 14px; padding: 20px 24px; margin-bottom: 20px; }
.panel-section h2 { font-size: 18px; color: #1a1a2e; margin: 0 0 14px 0; }

/* Loading/Error */
.loading-panel { text-align: center; padding: 24px; color: #8892b0; }
.mini-spinner { display: inline-block; width: 24px; height: 24px; border: 2px solid #e0e0e0; border-top-color: #1a73e8; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-panel p { margin: 8px 0 0; font-size: 13px; }
.error-panel { text-align: center; padding: 24px; color: #e74c3c; font-size: 13px; }
.btn-retry-sm { margin-top: 6px; padding: 5px 16px; background: #1a73e8; color: #fff; border: none; border-radius: 14px; font-size: 12px; cursor: pointer; }

/* Empty */
.empty-panel { text-align: center; padding: 36px 16px; color: #8892b0; }
.empty-icon { font-size: 40px; display: block; margin-bottom: 8px; }
.empty-panel p { margin: 0; font-size: 14px; }
.empty-hint { font-size: 12px !important; margin-top: 6px !important; color: #bbb; }
.btn-publish-link { display: inline-block; margin-top: 12px; padding: 6px 20px; background: #1a73e8; color: #fff; text-decoration: none; border-radius: 14px; font-size: 13px; font-weight: 500; }
.btn-publish-link:hover { background: #1557b0; }

/* My Posts */
.post-list { display: flex; flex-direction: column; gap: 8px; }
.post-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #fafbfc; border-radius: 12px; border: 1px solid #f0f0f0; text-decoration: none; color: inherit; transition: border-color 0.2s; }
.post-item:hover { border-color: #d0d7de; }
.post-image { font-size: 28px; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; background: #f0f2f5; border-radius: 10px; flex-shrink: 0; }
.post-info { flex: 1; min-width: 0; }
.post-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.post-title { font-size: 14px; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post-type-tag { font-size: 11px; padding: 1px 7px; background: #eff6ff; color: #2563eb; border-radius: 8px; flex-shrink: 0; }
.post-meta { font-size: 12px; color: #bbb; display: flex; gap: 4px; align-items: center; }
.post-dot { color: #ddd; }
.status-open { color: #2e7d32; }
.status-closed { color: #bbb; }
.post-arrow { font-size: 16px; color: #ccc; flex-shrink: 0; }

/* Favorites */
.favorite-list { display: flex; flex-direction: column; gap: 10px; }
.fav-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: #fafbfc; border-radius: 12px; border: 1px solid #f0f0f0; transition: border-color 0.2s; }
.fav-item:hover { border-color: #d0d7de; }
.fav-image { font-size: 32px; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: #f0f2f5; border-radius: 10px; flex-shrink: 0; }
.fav-info { flex: 1; min-width: 0; }
.fav-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.fav-title-link { font-size: 15px; font-weight: 600; color: #1a73e8; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-title-link:hover { text-decoration: underline; }
.fav-type-tag { font-size: 11px; padding: 2px 8px; background: #eff6ff; color: #2563eb; border-radius: 8px; flex-shrink: 0; }
.fav-desc { font-size: 13px; color: #8892b0; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-meta { font-size: 12px; color: #bbb; display: flex; gap: 12px; }
.fav-price { color: #e74c3c; font-weight: 600; }
.btn-remove-fav { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e0e0e0; border-radius: 50%; font-size: 12px; color: #bbb; cursor: pointer; flex-shrink: 0; transition: all 0.2s; }
.btn-remove-fav:hover { background: #fce4ec; border-color: #e74c3c; color: #e74c3c; }

/* Menu */
.menu-list { overflow: hidden; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f5f5f5; border-radius: 8px; }
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: #f8f9fa; }
.menu-icon { font-size: 20px; flex-shrink: 0; }
.menu-info { flex: 1; display: flex; flex-direction: column; }
.menu-label { font-size: 14px; font-weight: 500; color: #333; }
.menu-desc { font-size: 12px; color: #8892b0; }
.menu-badge { font-size: 11px; min-width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; padding: 0 6px; }
.menu-arrow { font-size: 18px; color: #ccc; }

/* Not logged in */
.not-logged-in { text-align: center; padding: 80px 32px; background: #fff; border-radius: 16px; }
.nli-icon { font-size: 56px; display: block; margin-bottom: 16px; }
.not-logged-in h2 { font-size: 22px; color: #1a1a2e; margin: 0 0 8px; }
.not-logged-in p { color: #8892b0; margin: 0 0 24px; font-size: 14px; }
.nli-btn { display: inline-block; padding: 10px 32px; background: #1a73e8; color: #fff; text-decoration: none; border-radius: 24px; font-size: 15px; font-weight: 600; transition: background 0.2s; }
.nli-btn:hover { background: #1557b0; }

@media (max-width: 768px) {
  .profile-body { flex-direction: column; align-items: center; text-align: center; }
  .name-row { justify-content: center; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
}
</style>
