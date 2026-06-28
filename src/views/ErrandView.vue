<script setup lang="ts">
import { ref, computed } from 'vue'

const activeType = ref('all')
const sortBy = ref('latest')

const types = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'delivery', label: '代取快递', icon: '📦' },
  { key: 'shopping', label: '代购物品', icon: '🛍️' },
  { key: 'print', label: '打印复印', icon: '🖨️' },
  { key: 'queue', label: '代排队', icon: '🧍' },
  { key: 'other', label: '其他', icon: '📌' },
]

interface ErrandItem {
  id: number
  type: string
  title: string
  image: string
  reward: number
  publisher: string
  deadline: string
  location: string
  description: string
  tags: string[]
  urgency: 'urgent' | 'normal'
}

const items = ref<ErrandItem[]>([
  { id: 1, type: 'delivery', title: '代取中通快递 小件', image: '📦', reward: 3, publisher: '张同学', deadline: '今天18:00前', location: '中通快递点→主校区7号楼', description: '一件衣服，小包裹，取件码已发', tags: ['小件', '中通'], urgency: 'normal' },
  { id: 2, type: 'shopping', title: '代购超市: 面包+牛奶+水果', image: '🛍️', reward: 8, publisher: '李同学', deadline: '今天12:00前', location: '校内超市→东校区3号楼', description: '全麦面包1袋 + 纯牛奶1L + 香蕉若干', tags: ['食品', '急用'], urgency: 'urgent' },
  { id: 3, type: 'print', title: '打印毕业论文初稿 30页', image: '🖨️', reward: 6, publisher: '王同学', deadline: '今天17:00前', location: '打印店→教学楼A座', description: '需要双面打印，装订好', tags: ['论文', '双面'], urgency: 'normal' },
  { id: 4, type: 'queue', title: '代排队: 食堂二楼麻辣烫', image: '🧍', reward: 5, publisher: '赵同学', deadline: '今天11:30', location: '二食堂二楼', description: '帮忙排队买一份麻辣烫，微辣', tags: ['午餐', '排队'], urgency: 'urgent' },
  { id: 5, type: 'delivery', title: '代取圆通快递 中件', image: '📦', reward: 5, publisher: '孙同学', deadline: '今天20:00前', location: '圆通快递点→西校区宿舍', description: '一个鞋盒大小的包裹', tags: ['中件', '圆通'], urgency: 'normal' },
  { id: 6, type: 'other', title: '帮忙搬宿舍行李', image: '💪', reward: 25, publisher: '周同学', deadline: '7月1日下午', location: '6号楼3层→校门口', description: '毕业搬家，需要帮忙搬行李下楼，有电梯', tags: ['搬家', '体力活'], urgency: 'normal' },
  { id: 7, type: 'shopping', title: '代买实验报告纸 A4', image: '📄', reward: 4, publisher: '吴同学', deadline: '今天16:00前', location: '文具店→实验室', description: 'A4实验报告纸10张，格子版', tags: ['学习', '急用'], urgency: 'urgent' },
  { id: 8, type: 'delivery', title: '代取顺丰快递 文件', image: '📨', reward: 4, publisher: '郑同学', deadline: '今天18:00前', location: '顺丰点→行政楼', description: '一份文件快递，需要签收', tags: ['文件', '顺丰'], urgency: 'normal' },
  { id: 9, type: 'print', title: '打印课程PPT讲义 80页', image: '📑', reward: 10, publisher: '钱同学', deadline: '明天10:00前', location: '打印店→教学楼B座', description: '多份PPT讲义，需要双面黑白打印', tags: ['讲义', '批量'], urgency: 'normal' },
  { id: 10, type: 'queue', title: '代排队: 图书馆占座', image: '🪑', reward: 10, publisher: '陈同学', deadline: '明天早7:00', location: '图书馆3楼自习区', description: '帮忙占一个靠窗的位置，7点前到即可', tags: ['占座', '早起'], urgency: 'normal' },
])

const filteredItems = computed(() => {
  let result = items.value
  if (activeType.value !== 'all') {
    result = result.filter(i => i.type === activeType.value)
  }
  if (sortBy.value === 'reward-high') {
    result = [...result].sort((a, b) => b.reward - a.reward)
  } else if (sortBy.value === 'reward-low') {
    result = [...result].sort((a, b) => a.reward - b.reward)
  }
  return result
})
</script>

<template>
  <div class="errand-page">
    <div class="page-header">
      <div>
        <h1>🏃 跑腿委托</h1>
        <p class="subtitle">找人帮忙跑腿，轻松解决校园琐事</p>
      </div>
      <RouterLink to="/publish" class="btn-pub">+ 发布委托</RouterLink>
    </div>

    <!-- Type Filter & Sort -->
    <div class="toolbar">
      <div class="type-filter">
        <button
          v-for="t in types"
          :key="t.key"
          :class="['filter-btn', { active: activeType === t.key }]"
          @click="activeType = t.key"
        >
          <span>{{ t.icon }}</span>
          <span>{{ t.label }}</span>
        </button>
      </div>
      <select v-model="sortBy" class="sort-sel">
        <option value="latest">最新发布</option>
        <option value="reward-high">报酬从高到低</option>
        <option value="reward-low">报酬从低到高</option>
      </select>
    </div>

    <!-- Cards -->
    <div class="errand-grid">
      <div v-for="item in filteredItems" :key="item.id" class="errand-card">
        <div class="errand-image">{{ item.image }}</div>
        <div class="errand-body">
          <div class="errand-header">
            <h3>{{ item.title }}</h3>
            <span v-if="item.urgency === 'urgent'" class="urgency-badge">🔥 急</span>
          </div>

          <p class="errand-desc">{{ item.description }}</p>

          <div class="errand-meta">
            <span>👤 {{ item.publisher }}</span>
            <span>⏰ {{ item.deadline }}</span>
            <span>📍 {{ item.location }}</span>
          </div>

          <div class="errand-tags">
            <span v-for="t in item.tags" :key="t" class="tag">{{ t }}</span>
          </div>

          <div class="errand-footer">
            <span class="reward">💰 ¥{{ item.reward }}</span>
            <button class="btn-take">接单</button>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无相关委托</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.errand-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
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

.btn-pub {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.btn-pub:hover { background: #1557b0; }

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
}

.type-filter {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.filter-btn.active {
  background: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
}

.sort-sel {
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 13px;
  background: #fff;
  color: #333;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
}

/* Grid */
.errand-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.errand-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.errand-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.errand-image {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  background: #f8f9fa;
}

.errand-body {
  padding: 14px 16px;
}

.errand-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.errand-header h3 {
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.urgency-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: #fce4ec;
  color: #c62828;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.errand-desc {
  font-size: 13px;
  color: #5f6368;
  margin: 0 0 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.errand-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-size: 12px;
  color: #8892b0;
  margin-bottom: 8px;
}

.errand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f2f5;
  border-radius: 8px;
  color: #5f6368;
}

.errand-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reward {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.btn-take {
  padding: 6px 22px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-take:hover { background: #1557b0; }

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
}
.empty-icon { font-size: 48px; }
.empty-state p { color: #8892b0; margin-top: 8px; }

@media (max-width: 900px) { .errand-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .errand-grid { grid-template-columns: 1fr; } }
</style>
