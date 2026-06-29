<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTradeById } from '../api/trade'
import { getLostFoundById } from '../api/lostFound'
import { getGroupBuyById } from '../api/groupBuy'
import { getErrandById } from '../api/errand'

const route = useRoute()
const router = useRouter()

const detailType = computed(() => (route.meta.type as string) || 'trade')
const itemId = computed(() => route.params.id as string)

const loading = ref(true)
const error = ref('')
const item = ref<any>(null)

const backPath = computed(() => {
  const m: Record<string, string> = {
    trade: '/trade',
    lostFound: '/lost-found',
    groupBuy: '/group-buy',
    errand: '/errand',
  }
  return m[detailType.value] || '/'
})

const backLabel = computed(() => {
  const m: Record<string, string> = {
    trade: '返回二手交易',
    lostFound: '返回失物招领',
    groupBuy: '返回拼单搭子',
    errand: '返回跑腿委托',
  }
  return m[detailType.value] || '返回列表'
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    if (detailType.value === 'trade') {
      const res = await getTradeById(itemId.value)
      item.value = res.data
    } else if (detailType.value === 'lostFound') {
      const res = await getLostFoundById(itemId.value)
      item.value = res.data
    } else if (detailType.value === 'groupBuy') {
      const res = await getGroupBuyById(itemId.value)
      item.value = res.data
    } else if (detailType.value === 'errand') {
      const res = await getErrandById(itemId.value)
      item.value = res.data
    }
  } catch (e: any) {
    error.value = '加载详情失败：' + (e.message || '未知错误')
  } finally {
    loading.value = false
  }
})

const progressPercent = (c: number, t: number) => Math.min(Math.round((c / t) * 100), 100)

const typeLabel = (t: string) => {
  const m: Record<string, string> = { group: '拼单', partner: '搭子', team: '组队' }
  return m[t] || t
}

const taskTypeLabel = (t: string) => {
  const m: Record<string, string> = {
    delivery: '代取快递', shopping: '代购物品', print: '打印复印', queue: '代排队', other: '其他',
  }
  return m[t] || t
}
</script>

<template>
  <div class="detail-page">
    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <span class="spinner"></span>
      <p>正在加载详情...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box">
      <span class="error-icon">⚠️</span>
      <p class="error-msg">{{ error }}</p>
      <button class="btn-retry" @click="router.go(0)">重新加载</button>
      <RouterLink :to="backPath" class="btn-back-link">← 返回列表</RouterLink>
    </div>

    <!-- Content -->
    <template v-else-if="item">
      <RouterLink :to="backPath" class="back-link">{{ backLabel }}</RouterLink>

      <!-- ==================== 二手交易详情 ==================== -->
      <template v-if="detailType === 'trade'">
        <div class="detail-card">
          <div class="detail-image">{{ item.image }}</div>
          <div class="detail-body">
            <div class="detail-header">
              <h1>{{ item.title }}</h1>
              <div class="badge-row">
                <span class="badge condition">{{ item.condition }}</span>
                <span class="badge category">{{ item.category }}</span>
                <span :class="['badge', 'status', item.status === 'open' ? 'open' : 'closed']">
                  {{ item.status === 'open' ? '🟢 在售' : '🔴 已售' }}
                </span>
              </div>
            </div>

            <div class="price-section">
              <span class="price">¥{{ item.price }}</span>
              <span v-if="item.originalPrice" class="original-price">原价 ¥{{ item.originalPrice }}</span>
              <span v-if="item.originalPrice" class="discount">
                省 ¥{{ item.originalPrice - item.price }}
              </span>
            </div>

            <div class="meta-grid">
              <div class="meta-item"><span class="meta-label">发布人</span><span>{{ item.publisher }}</span></div>
              <div class="meta-item"><span class="meta-label">地点</span><span>{{ item.location }}</span></div>
              <div class="meta-item"><span class="meta-label">发布时间</span><span>{{ item.publishTime }}</span></div>
              <div class="meta-item"><span class="meta-label">喜欢</span><span>❤️ {{ item.likes }}</span></div>
            </div>

            <div class="desc-section">
              <h3>商品描述</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <button class="btn-primary">💬 联系卖家</button>
              <button class="btn-secondary">❤️ 收藏</button>
              <button class="btn-secondary">📤 分享</button>
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== 失物招领详情 ==================== -->
      <template v-if="detailType === 'lostFound'">
        <div class="detail-card">
          <div class="detail-image">{{ item.image }}</div>
          <div class="detail-body">
            <div class="detail-header">
              <h1>{{ item.title }}</h1>
              <div class="badge-row">
                <span :class="['badge', item.type === 'lost' ? 'lost' : 'found']">
                  {{ item.type === 'lost' ? '😰 寻物启事' : '😊 失物招领' }}
                </span>
                <span class="badge category">{{ item.category }}</span>
                <span :class="['badge', 'status', item.status === 'open' ? 'open' : 'closed']">
                  {{ item.status === 'open' ? (item.type === 'lost' ? '寻找中' : '待认领') : '已处理' }}
                </span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item"><span class="meta-label">物品名称</span><span>{{ item.itemName }}</span></div>
              <div class="meta-item"><span class="meta-label">{{ item.type === 'lost' ? '丢失地点' : '捡到地点' }}</span><span>{{ item.location }}</span></div>
              <div class="meta-item"><span class="meta-label">时间</span><span>{{ item.eventTime }}</span></div>
              <div class="meta-item"><span class="meta-label">联系方式</span><span>📞 {{ item.contact }}</span></div>
            </div>

            <div class="desc-section">
              <h3>详细描述</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <button class="btn-primary">📞 联系对方</button>
              <button class="btn-secondary">📤 转发扩散</button>
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== 拼单搭子详情 ==================== -->
      <template v-if="detailType === 'groupBuy'">
        <div class="detail-card">
          <div class="detail-image">{{ item.image }}</div>
          <div class="detail-body">
            <div class="detail-header">
              <h1>{{ item.title }}</h1>
              <div class="badge-row">
                <span class="badge" :style="{ background: ({ group: '#e8f5e9', partner: '#e3f2fd', team: '#f3e5f5' } as Record<string,string>)[item.type] || '#f0f2f5' }">
                  {{ typeLabel(item.type) }}
                </span>
                <span :class="['badge', 'status', item.status === 'open' ? 'open' : 'closed']">
                  {{ item.status === 'open' ? '🟢 进行中' : '已结束' }}
                </span>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="progress-section">
              <div class="progress-label">参与进度</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercent(item.currentCount, item.targetCount) + '%' }"></div>
              </div>
              <div class="progress-info">
                <span class="progress-count">{{ item.currentCount }}/{{ item.targetCount }} 人</span>
                <span class="progress-pct">{{ progressPercent(item.currentCount, item.targetCount) }}%</span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item"><span class="meta-label">发起人</span><span>{{ item.publisher }}</span></div>
              <div class="meta-item"><span class="meta-label">地点</span><span>{{ item.location }}</span></div>
              <div class="meta-item"><span class="meta-label">截止时间</span><span>{{ item.deadline }}</span></div>
              <div class="meta-item"><span class="meta-label">费用</span><span>{{ item.price ? '¥' + item.price + '/人' : '免费' }}</span></div>
            </div>

            <div v-if="item.tags && item.tags.length" class="tag-row">
              <span v-for="t in item.tags" :key="t" class="tag-chip">{{ t }}</span>
            </div>

            <div class="desc-section">
              <h3>详情说明</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <button class="btn-primary">🤝 我要加入</button>
              <button class="btn-secondary">📤 分享</button>
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== 跑腿委托详情 ==================== -->
      <template v-if="detailType === 'errand'">
        <div class="detail-card">
          <div class="detail-image">{{ item.image }}</div>
          <div class="detail-body">
            <div class="detail-header">
              <h1>{{ item.title }}</h1>
              <div class="badge-row">
                <span class="badge category">{{ taskTypeLabel(item.taskType) }}</span>
                <span :class="['badge', item.urgency === 'urgent' ? 'urgent' : 'normal']">
                  {{ item.urgency === 'urgent' ? '🔥 紧急' : '🕐 普通' }}
                </span>
                <span :class="['badge', 'status', item.status === 'open' ? 'open' : 'closed']">
                  {{ item.status === 'open' ? '🟢 可接单' : '已接单' }}
                </span>
              </div>
            </div>

            <div class="price-section">
              <span class="price">💰 ¥{{ item.reward }}</span>
              <span class="reward-label">报酬</span>
            </div>

            <div class="route-section">
              <div class="route-point">
                <span class="route-label">📤 取件/出发</span>
                <span class="route-text">{{ item.from }}</span>
              </div>
              <div class="route-arrow">↓</div>
              <div class="route-point">
                <span class="route-label">📥 送达/目的</span>
                <span class="route-text">{{ item.to }}</span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item"><span class="meta-label">发布人</span><span>{{ item.publisher }}</span></div>
              <div class="meta-item"><span class="meta-label">截止时间</span><span>{{ item.deadline }}</span></div>
            </div>

            <div v-if="item.tags && item.tags.length" class="tag-row">
              <span v-for="t in item.tags" :key="t" class="tag-chip">{{ t }}</span>
            </div>

            <div class="desc-section">
              <h3>任务描述</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <button class="btn-primary">✋ 我要接单</button>
              <button class="btn-secondary">💬 联系发布人</button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.detail-page { max-width: 800px; margin: 0 auto; }

/* States */
.state-box { text-align: center; padding: 80px 0; }
.spinner {
  display: inline-block; width: 40px; height: 40px;
  border: 3px solid #e0e0e0; border-top-color: #1a73e8;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-box p { color: #8892b0; margin-top: 16px; font-size: 14px; }
.error-icon { font-size: 48px; }
.error-msg { color: #e74c3c; margin: 12px 0; }
.btn-retry {
  padding: 8px 24px; background: #1a73e8; color: #fff;
  border: none; border-radius: 20px; font-size: 14px; cursor: pointer;
}
.btn-back-link { display: inline-block; margin-top: 12px; color: #1a73e8; text-decoration: none; font-size: 14px; }

.back-link {
  display: inline-block; margin-bottom: 16px; color: #1a73e8;
  text-decoration: none; font-size: 14px; font-weight: 500;
}
.back-link:hover { text-decoration: underline; }

/* Card */
.detail-card {
  display: flex; gap: 32px;
  background: #fff; border-radius: 16px; overflow: hidden;
}
.detail-image {
  width: 220px; min-height: 260px; display: flex;
  align-items: center; justify-content: center;
  font-size: 80px; background: #f8f9fa; flex-shrink: 0;
}
.detail-body { flex: 1; padding: 28px 28px 28px 0; }

.detail-header h1 { font-size: 22px; color: #1a1a2e; margin: 0 0 12px 0; line-height: 1.4; }

.badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.badge {
  font-size: 12px; padding: 4px 12px; border-radius: 12px; font-weight: 500;
}
.badge.condition { background: #e8f5e9; color: #2e7d32; }
.badge.category { background: #e3f2fd; color: #1565c0; }
.badge.status.open { background: #e8f5e9; color: #2e7d32; }
.badge.status.closed { background: #f0f2f5; color: #8892b0; }
.badge.lost { background: #fff3e0; color: #e65100; }
.badge.found { background: #e8f5e9; color: #2e7d32; }
.badge.urgent { background: #fce4ec; color: #c62828; animation: pulse 1.5s ease-in-out infinite; }
.badge.normal { background: #f0f2f5; color: #5f6368; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

.price-section {
  display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; padding: 16px;
  background: #fdf2f2; border-radius: 12px;
}
.price { font-size: 36px; font-weight: 800; color: #e74c3c; }
.original-price { font-size: 14px; color: #bbb; text-decoration: line-through; }
.discount { font-size: 13px; color: #2e7d32; background: #e8f5e9; padding: 2px 10px; border-radius: 10px; }
.reward-label { font-size: 14px; color: #8892b0; }

/* Meta grid */
.meta-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 12px;
}
.meta-item { display: flex; flex-direction: column; gap: 2px; font-size: 14px; color: #333; }
.meta-label { font-size: 12px; color: #8892b0; }

/* Progress */
.progress-section { margin-bottom: 16px; }
.progress-label { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px; }
.progress-bar { height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden; margin-bottom: 6px; }
.progress-fill {
  height: 100%; background: linear-gradient(90deg, #1a73e8, #4285f4);
  border-radius: 5px; transition: width 0.3s;
}
.progress-info { display: flex; justify-content: space-between; font-size: 13px; }
.progress-count { color: #5f6368; }
.progress-pct { color: #1a73e8; font-weight: 600; }

/* Route */
.route-section {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 16px; background: #f8f9fa; border-radius: 12px; margin-bottom: 16px;
}
.route-point { display: flex; gap: 12px; align-items: center; width: 100%; }
.route-label { font-size: 13px; color: #8892b0; min-width: 100px; }
.route-text { font-size: 15px; font-weight: 500; color: #333; }
.route-arrow { font-size: 20px; color: #1a73e8; margin: 4px 0; }

/* Tags */
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.tag-chip {
  font-size: 12px; padding: 4px 12px; background: #f0f2f5;
  border-radius: 12px; color: #5f6368;
}

/* Description */
.desc-section { margin-bottom: 20px; }
.desc-section h3 { font-size: 16px; color: #333; margin: 0 0 8px 0; }
.desc-section p { font-size: 14px; color: #5f6368; line-height: 1.8; margin: 0; }

/* Actions */
.action-bar { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-primary {
  padding: 12px 32px; background: #1a73e8; color: #fff;
  border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-primary:hover { background: #1557b0; }
.btn-secondary {
  padding: 12px 24px; background: #fff; color: #5f6368;
  border: 1px solid #e0e0e0; border-radius: 12px; font-size: 15px;
  cursor: pointer; transition: all 0.2s;
}
.btn-secondary:hover { border-color: #1a73e8; color: #1a73e8; }

@media (max-width: 700px) {
  .detail-card { flex-direction: column; }
  .detail-image { width: 100%; min-height: 180px; }
  .detail-body { padding: 20px; }
  .meta-grid { grid-template-columns: 1fr; }
}
</style>
