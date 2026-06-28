<script setup lang="ts">
import { ref, computed } from 'vue'

const activeType = ref<'lost' | 'found'>('lost')
const searchKeyword = ref('')

interface LostFoundItem {
  id: number
  type: 'lost' | 'found'
  title: string
  category: string
  image: string
  location: string
  date: string
  contact: string
  description: string
  status: string
}

const items = ref<LostFoundItem[]>([
  { id: 1, type: 'lost', title: '黑色皮质钱包', category: '钱包证件', image: '👛', location: '图书馆二楼自习室', date: '2026-06-27', contact: '张同学 138xxxx1234', description: '内有身份证、校园卡、少量现金，黑色长方形对折款', status: '寻找中' },
  { id: 2, type: 'lost', title: '蓝色保温杯 膳魔师', category: '生活用品', image: '🥤', location: '教学楼A座301', date: '2026-06-27', contact: '李同学 QQ: 12345678', description: '蓝色500ml膳魔师保温杯，杯身有贴纸', status: '寻找中' },
  { id: 3, type: 'found', title: '校园卡 张三', category: '钱包证件', image: '🪪', location: '食堂一楼', date: '2026-06-27', contact: '失物招领处', description: '信息学院 2024级 张三，请持身份证来领取', status: '待认领' },
  { id: 4, type: 'found', title: '一串钥匙（3把）', category: '生活用品', image: '🔑', location: '操场跑道旁', date: '2026-06-26', contact: '王同学 139xxxx5678', description: '有宿舍钥匙、柜子钥匙和一个蓝色钥匙扣', status: '待认领' },
  { id: 5, type: 'lost', title: 'AirPods Pro 充电盒', category: '数码电子', image: '🎧', location: '体育馆更衣室', date: '2026-06-26', contact: '赵同学 微信: zhao_edu', description: '白色AirPods Pro充电盒，有刻字"ZJ"', status: '寻找中' },
  { id: 6, type: 'found', title: '《高等数学》同济第七版', category: '书籍教材', image: '📖', location: '教学楼B座205', date: '2026-06-26', contact: '教学楼B座值班室', description: '书内有笔记，封面有轻微磨损', status: '待认领' },
  { id: 7, type: 'lost', title: '灰色双肩包', category: '箱包服饰', image: '🎒', location: '二食堂二楼', date: '2026-06-25', contact: '孙同学 150xxxx9012', description: '灰色Jansport双肩包，内有一本笔记本和充电宝', status: '寻找中' },
  { id: 8, type: 'found', title: 'U盘 金士顿32G', category: '数码电子', image: '💾', location: '计算机实验室3楼', date: '2026-06-25', contact: '实验室管理员', description: '蓝色金士顿U盘，内有课程资料', status: '待认领' },
  { id: 9, type: 'lost', title: '深蓝色折叠伞', category: '生活用品', image: '🌂', location: '图书馆入口伞架', date: '2026-06-24', contact: '周同学 188xxxx3456', description: '深蓝色三折自动伞，天堂牌', status: '寻找中' },
  { id: 10, type: 'found', title: '学生证一本', category: '钱包证件', image: '📇', location: '行政楼大厅', date: '2026-06-24', contact: '行政楼服务台', description: '商学院 2023级 李四', status: '已通知' },
])

const filteredItems = computed(() => {
  let result = items.value.filter(i => i.type === activeType.value)
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(kw) ||
      i.location.toLowerCase().includes(kw) ||
      i.category.toLowerCase().includes(kw)
    )
  }
  return result
})

const typeLabel = (t: string) => t === 'lost' ? '寻物启事' : '失物招领'
</script>

<template>
  <div class="lost-found-page">
    <div class="page-header">
      <div>
        <h1>🔍 失物招领</h1>
        <p class="subtitle">丢了东西别着急 · 捡到物品来这里</p>
      </div>
      <RouterLink to="/publish" class="btn-post">+ 发布信息</RouterLink>
    </div>

    <!-- Type Tabs -->
    <div class="type-tabs">
      <button
        :class="['type-tab', { active: activeType === 'lost' }]"
        @click="activeType = 'lost'"
      >
        <span class="tab-icon">😰</span>
        <div class="tab-text">
          <span class="tab-label">寻物启事</span>
          <span class="tab-count">{{ items.filter(i => i.type === 'lost').length }} 条</span>
        </div>
      </button>
      <button
        :class="['type-tab', { active: activeType === 'found' }]"
        @click="activeType = 'found'"
      >
        <span class="tab-icon">😊</span>
        <div class="tab-text">
          <span class="tab-label">失物招领</span>
          <span class="tab-count">{{ items.filter(i => i.type === 'found').length }} 条</span>
        </div>
      </button>
    </div>

    <!-- Search -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input v-model="searchKeyword" placeholder="搜索物品名称、地点..." class="search-input" />
    </div>

    <!-- Cards -->
    <div class="lf-grid">
      <div v-for="item in filteredItems" :key="item.id" class="lf-card">
        <div class="lf-image">{{ item.image }}</div>
        <div class="lf-body">
          <div class="lf-header-row">
            <h3>{{ item.title }}</h3>
            <span :class="['lf-badge', item.type]">{{ typeLabel(item.type) }}</span>
          </div>
          <div class="lf-meta">
            <div class="meta-row"><span class="meta-label">📂 分类：</span>{{ item.category }}</div>
            <div class="meta-row"><span class="meta-label">📍 地点：</span>{{ item.location }}</div>
            <div class="meta-row"><span class="meta-label">📅 时间：</span>{{ item.date }}</div>
          </div>
          <p class="lf-desc">{{ item.description }}</p>
          <div class="lf-footer">
            <span class="lf-status" :class="{ urgent: item.type === 'lost' }">{{ item.status }}</span>
            <span class="lf-contact">📞 {{ item.contact }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">🔎</span>
        <p>暂无相关信息</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lost-found-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 6px 0;
}

.subtitle {
  color: #8892b0;
  font-size: 14px;
  margin: 0;
}

.btn-post {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.btn-post:hover { background: #1557b0; }

/* Type Tabs */
.type-tabs {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
}

.type-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.type-tab:hover {
  border-color: #1a73e8;
}

.type-tab.active {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.tab-icon {
  font-size: 32px;
}

.tab-text {
  display: flex;
  flex-direction: column;
}

.tab-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tab-count {
  font-size: 13px;
  color: #8892b0;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 0 14px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.search-box:focus-within {
  border-color: #1a73e8;
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  padding: 10px 0;
  font-size: 14px;
  outline: none;
  background: transparent;
}

/* Grid */
.lf-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.lf-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  transition: box-shadow 0.2s;
}

.lf-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.lf-image {
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
  background: #f8f9fa;
  flex-shrink: 0;
}

.lf-body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.lf-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.lf-header-row h3 {
  font-size: 15px;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 8px;
}

.lf-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 500;
}

.lf-badge.lost {
  background: #fff3e0;
  color: #e65100;
}

.lf-badge.found {
  background: #e8f5e9;
  color: #2e7d32;
}

.lf-meta {
  margin-bottom: 8px;
}

.meta-row {
  font-size: 13px;
  color: #5f6368;
  line-height: 1.8;
}

.meta-label {
  color: #8892b0;
}

.lf-desc {
  font-size: 13px;
  color: #8892b0;
  margin: 0 0 10px 0;
  line-height: 1.5;
  flex: 1;
}

.lf-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lf-status {
  font-size: 12px;
  padding: 2px 10px;
  background: #f0f2f5;
  border-radius: 10px;
  color: #5f6368;
}

.lf-status.urgent {
  background: #fff3e0;
  color: #e65100;
  font-weight: 600;
}

.lf-contact {
  font-size: 12px;
  color: #1a73e8;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
}

.empty-icon { font-size: 48px; }
.empty-state p { color: #8892b0; margin-top: 8px; }

@media (max-width: 768px) {
  .lf-grid {
    grid-template-columns: 1fr;
  }
  .lf-card {
    flex-direction: column;
  }
  .lf-image {
    width: 100%;
    height: 100px;
  }
}
</style>
