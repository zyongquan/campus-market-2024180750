<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'all' | 'group' | 'partner' | 'team'>('all')

const tabs = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'group', label: '拼单', icon: '🛍️', desc: '一起买更便宜' },
  { key: 'partner', label: '搭子', icon: '👯', desc: '找个伴不孤单' },
  { key: 'team', label: '组队', icon: '👥', desc: '组队参与活动' },
]

interface GroupItem {
  id: number
  type: 'group' | 'partner' | 'team'
  title: string
  image: string
  initiator: string
  current: number
  target: number
  deadline: string
  location: string
  price?: number
  tags: string[]
}

const items = ref<GroupItem[]>([
  { id: 1, type: 'group', title: '考研数学复习全书拼单（享满减）', image: '📖', initiator: '赵同学', current: 2, target: 5, deadline: '6月30日', location: '主校区', price: 15, tags: ['考研', '教材'] },
  { id: 2, type: 'partner', title: '每天晨跑搭子 6:30操场见', image: '🏃', initiator: '钱同学', current: 3, target: 5, deadline: '长期', location: '操场', tags: ['运动', '日常'] },
  { id: 3, type: 'team', title: '全国大学生数学建模竞赛组队', image: '📊', initiator: '孙同学', current: 1, target: 3, deadline: '7月5日', location: '线上/实验室', tags: ['竞赛', '数学'] },
  { id: 4, type: 'group', title: '零食大礼包拼团 满50减15', image: '🍿', initiator: '李同学', current: 4, target: 6, deadline: '6月29日', location: '东校区', price: 35, tags: ['零食', '生活'] },
  { id: 5, type: 'partner', title: '周末羽毛球搭子 2=2', image: '🏸', initiator: '周同学', current: 2, target: 4, deadline: '每周六', location: '体育馆', tags: ['运动', '周末'] },
  { id: 6, type: 'team', title: '创新创业大赛项目组队', image: '💡', initiator: '吴同学', current: 2, target: 5, deadline: '7月10日', location: '创业中心', tags: ['创业', '比赛'] },
  { id: 7, type: 'group', title: '打印店团购: 论文打印50张起', image: '🖨️', initiator: '郑同学', current: 3, target: 10, deadline: '7月1日', location: '校内打印店', price: 8, tags: ['打印', '学习'] },
  { id: 8, type: 'partner', title: '图书馆自习搭子 每天19-22点', image: '📚', initiator: '王同学', current: 2, target: 3, deadline: '长期', location: '图书馆', tags: ['学习', '日常'] },
  { id: 9, type: 'team', title: '校园歌手大赛组队参赛', image: '🎤', initiator: '刘同学', current: 2, target: 4, deadline: '7月8日', location: '大学生活动中心', tags: ['文艺', '比赛'] },
  { id: 10, type: 'group', title: '水果拼单: 当季荔枝5斤起批', image: '🍒', initiator: '陈同学', current: 5, target: 8, deadline: '6月28日', location: '主校区南门', price: 22, tags: ['水果', '生活'] },
  { id: 11, type: 'partner', title: '摄影搭子 周末扫街拍照', image: '📷', initiator: '杨同学', current: 1, target: 3, deadline: '每周日', location: '市区/校园', tags: ['摄影', '周末'] },
  { id: 12, type: 'team', title: '程序设计竞赛(ACM)校赛组队', image: '💻', initiator: '张同学', current: 1, target: 3, deadline: '7月15日', location: '计算机学院', tags: ['编程', '竞赛'] },
])

const filteredItems = computed(() => {
  if (activeTab.value === 'all') return items.value
  return items.value.filter(i => i.type === activeTab.value)
})

const typeBadge = (t: string) => {
  const m: Record<string, { text: string; color: string }> = {
    group: { text: '拼单', color: '#e8f5e9' },
    partner: { text: '搭子', color: '#e3f2fd' },
    team: { text: '组队', color: '#f3e5f5' },
  }
  return m[t] || { text: t, color: '#f0f2f5' }
}

const progressPercent = (c: number, t: number) => Math.min(Math.round((c / t) * 100), 100)
</script>

<template>
  <div class="group-buy-page">
    <div class="page-header">
      <div>
        <h1>🤝 拼单搭子</h1>
        <p class="subtitle">拼单省钱 · 搭子相伴 · 组队共赢</p>
      </div>
      <RouterLink to="/publish" class="btn-create">+ 发起拼单</RouterLink>
    </div>

    <!-- Tabs -->
    <div class="tab-row">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key as typeof activeTab"
      >
        <span class="tab-em">{{ tab.icon }}</span>
        <div class="tab-text">
          <span class="tab-name">{{ tab.label }}</span>
          <span v-if="tab.desc" class="tab-desc">{{ tab.desc }}</span>
        </div>
      </button>
    </div>

    <!-- Cards -->
    <div class="group-grid">
      <div v-for="item in filteredItems" :key="item.id" class="group-card">
        <div class="card-image">{{ item.image }}</div>
        <div class="card-body">
          <div class="card-header">
            <h3>{{ item.title }}</h3>
            <span
              class="type-badge"
              :style="{ background: typeBadge(item.type).color }"
            >{{ typeBadge(item.type).text }}</span>
          </div>

          <div class="progress-section">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercent(item.current, item.target) + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              <span class="progress-count">{{ item.current }}/{{ item.target }} 人</span>
              <span class="progress-pct">{{ progressPercent(item.current, item.target) }}%</span>
            </div>
          </div>

          <div class="card-meta">
            <span>👤 {{ item.initiator }}</span>
            <span>📍 {{ item.location }}</span>
            <span>⏰ {{ item.deadline }}</span>
          </div>

          <div class="card-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>

          <div class="card-footer">
            <span v-if="item.price" class="card-price">¥{{ item.price }}/人</span>
            <span v-else class="card-price free">免费</span>
            <button class="btn-join">我要加入</button>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无相关信息</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-buy-page {
  max-width: 1100px;
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

.btn-create {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.btn-create:hover { background: #1557b0; }

/* Tabs */
.tab-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.tab-item:hover {
  border-color: #1a73e8;
}

.tab-item.active {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.tab-em { font-size: 24px; }

.tab-text {
  display: flex;
  flex-direction: column;
}

.tab-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.tab-desc {
  font-size: 12px;
  color: #8892b0;
}

/* Grid */
.group-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.group-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.card-image {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #f8f9fa;
}

.card-body {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.type-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
  color: #333;
}

/* Progress */
.progress-section {
  margin-bottom: 12px;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a73e8, #4285f4);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.progress-count {
  color: #5f6368;
}

.progress-pct {
  color: #1a73e8;
  font-weight: 600;
}

/* Meta */
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 10px;
}

/* Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag-chip {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f2f5;
  border-radius: 8px;
  color: #5f6368;
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.card-price.free {
  color: #2e7d32;
}

.btn-join {
  padding: 6px 18px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-join:hover {
  background: #1557b0;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
}

.empty-icon { font-size: 48px; }
.empty-state p { color: #8892b0; margin-top: 8px; }

@media (max-width: 900px) {
  .group-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .group-grid { grid-template-columns: 1fr; }
  .tab-row { flex-direction: column; }
}
</style>
