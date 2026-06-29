<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { publishTrade } from '../api/trade'
import { publishLostFound } from '../api/lostFound'
import { publishGroupBuy } from '../api/groupBuy'
import { publishErrand } from '../api/errand'

const activeType = ref('trade')

const publishTypes = [
  { key: 'trade', label: '二手商品', icon: '🛒', desc: '发布闲置物品出售' },
  { key: 'lost', label: '寻物启事', icon: '😰', desc: '寻找遗失的物品' },
  { key: 'found', label: '失物招领', icon: '😊', desc: '发布捡到的物品' },
  { key: 'group', label: '拼单搭子', icon: '🤝', desc: '发起拼单或找搭子' },
  { key: 'errand', label: '跑腿委托', icon: '🏃', desc: '发布跑腿任务' },
]

// ---------- 基础字段 ----------
const form = reactive({
  title: '',
  description: '',
  location: '',
  contact: '',
  // trade
  category: '',
  price: '',
  originalPrice: '',
  condition: '',
  // lostFound
  itemName: '',
  eventTime: '',
  // groupBuy
  groupType: '',
  targetCount: '',
  tags: '',
  // errand
  taskType: '',
  reward: '',
  from: '',
  to: '',
  deadline: '',
  urgency: 'normal',
})

const submitting = ref(false)
const submitResult = ref<{ ok: boolean; msg: string } | null>(null)

// ---------- 动态分类选项 ----------
const tradeCategories = [
  { value: 'book', label: '教材书籍' },
  { value: 'digital', label: '数码电子' },
  { value: 'life', label: '生活用品' },
  { value: 'fashion', label: '服饰鞋包' },
  { value: 'sport', label: '运动出行' },
  { value: 'other', label: '其他' },
]

const lostFoundCategories = [
  { value: '钱包证件', label: '钱包证件' },
  { value: '数码电子', label: '数码电子' },
  { value: '生活用品', label: '生活用品' },
  { value: '书籍教材', label: '书籍教材' },
  { value: '箱包服饰', label: '箱包服饰' },
  { value: '其他', label: '其他' },
]

const conditionOptions = ['几乎全新', '9成新', '8成新', '7成新', '有笔记', '有使用痕迹']

const groupTypes = [
  { value: 'group', label: '拼单' },
  { value: 'partner', label: '搭子' },
  { value: 'team', label: '组队' },
]

const taskTypes = [
  { value: 'delivery', label: '代取快递' },
  { value: 'shopping', label: '代购物品' },
  { value: 'print', label: '打印复印' },
  { value: 'queue', label: '代排队' },
  { value: 'other', label: '其他' },
]

const currentCategories = computed(() => {
  if (activeType.value === 'trade') return tradeCategories
  if (activeType.value === 'lost' || activeType.value === 'found') return lostFoundCategories
  return []
})

// ---------- 选一个 emoji 做图片 ----------
const emojiOptions = ['📚', '💻', '🎧', '📱', '⌨️', '👕', '👟', '🚲', '💡', '🍳', '🛏️', '📦', '🛍️', '📖', '📝', '🔑', '👛', '🪪', '🎒', '🥤', '🏸', '🏃', '💪', '🖨️', '🧍', '🎮']
const selectedEmoji = ref('📦')

// ---------- 提交 ----------
const canSubmit = computed(() => {
  if (!form.title.trim() || !form.description.trim()) return false
  if (activeType.value === 'trade' && (!form.price || !form.category)) return false
  if (activeType.value === 'errand' && (!form.reward || !form.taskType)) return false
  return true
})

async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  submitResult.value = null

  try {
    const base = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim() || '主校区',
      image: selectedEmoji.value,
      status: 'open',
    }

    if (activeType.value === 'trade') {
      await publishTrade({
        ...base,
        category: form.category,
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || undefined,
        condition: form.condition || '8成新',
        publisher: form.contact.trim() || '我',
        publishTime: '刚刚',
        likes: 0,
      })
    } else if (activeType.value === 'lost' || activeType.value === 'found') {
      await publishLostFound({
        ...base,
        type: activeType.value as 'lost' | 'found',
        category: form.category,
        itemName: form.itemName.trim() || form.title.trim(),
        eventTime: form.eventTime || new Date().toISOString().slice(0, 10),
        contact: form.contact.trim() || '请通过平台联系',
      })
    } else if (activeType.value === 'group') {
      await publishGroupBuy({
        ...base,
        type: (form.groupType as 'group' | 'partner' | 'team') || 'group',
        targetCount: Number(form.targetCount) || 2,
        currentCount: 1,
        deadline: form.deadline || '长期',
        publisher: form.contact.trim() || '我',
        price: form.price ? Number(form.price) : undefined,
        tags: form.tags ? form.tags.split(/[,，、]/).map(t => t.trim()).filter(Boolean) : [],
      })
    } else if (activeType.value === 'errand') {
      await publishErrand({
        ...base,
        taskType: form.taskType,
        reward: Number(form.reward) || 0,
        from: form.from.trim() || '待定',
        to: form.to.trim() || '待定',
        deadline: form.deadline || '尽快',
        publisher: form.contact.trim() || '我',
        tags: form.tags ? form.tags.split(/[,，、]/).map(t => t.trim()).filter(Boolean) : [],
        urgency: form.urgency as 'urgent' | 'normal',
      })
    }

    submitResult.value = { ok: true, msg: `发布成功！已添加到${publishTypes.find(p => p.key === activeType.value)?.label}列表` }
    resetForm()
  } catch (e: any) {
    submitResult.value = { ok: false, msg: e.message || '发布失败，请重试' }
  } finally {
    submitting.value = false
    setTimeout(() => { submitResult.value = null }, 4000)
  }
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.location = ''
  form.contact = ''
  form.category = ''
  form.price = ''
  form.originalPrice = ''
  form.condition = ''
  form.itemName = ''
  form.eventTime = ''
  form.groupType = ''
  form.targetCount = ''
  form.tags = ''
  form.taskType = ''
  form.reward = ''
  form.from = ''
  form.to = ''
  form.deadline = ''
  form.urgency = 'normal'
  selectedEmoji.value = '📦'
}
</script>

<template>
  <div class="publish-page">
    <div class="page-header">
      <h1>✏️ 发布信息</h1>
      <p class="subtitle">选择发布类型，填写详细信息</p>
    </div>

    <!-- 类型选择 -->
    <div class="type-selector">
      <button
        v-for="pt in publishTypes"
        :key="pt.key"
        :class="['type-option', { active: activeType === pt.key }]"
        @click="activeType = pt.key; submitResult = null"
      >
        <span class="type-icon">{{ pt.icon }}</span>
        <span class="type-label">{{ pt.label }}</span>
        <span class="type-desc">{{ pt.desc }}</span>
      </button>
    </div>

    <!-- 表单 -->
    <div class="form-container">
      <!-- 标题 -->
      <div class="form-group">
        <label>标题 <span class="required">*</span></label>
        <input
          v-model="form.title"
          type="text"
          :placeholder="activeType === 'trade' ? '例如：九成新数据结构教材 仅售25元' : activeType === 'lost' ? '例如：黑色皮质钱包 图书馆二楼遗失' : activeType === 'errand' ? '例如：代取中通快递小件 ¥3' : '请输入清晰明确的标题...'"
          class="form-input"
        />
      </div>

      <!-- 动态表单行：分类 + 其他 -->
      <div class="form-row" v-if="activeType === 'trade'">
        <div class="form-group flex-1">
          <label>商品分类 <span class="required">*</span></label>
          <select v-model="form.category" class="form-input">
            <option value="">请选择</option>
            <option v-for="c in currentCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <div class="form-group flex-1">
          <label>成色</label>
          <select v-model="form.condition" class="form-input">
            <option value="">请选择</option>
            <option v-for="c in conditionOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="form-row" v-if="activeType === 'trade'">
        <div class="form-group flex-1">
          <label>售价 ¥ <span class="required">*</span></label>
          <input v-model="form.price" type="number" placeholder="0" class="form-input" min="0" step="0.01" />
        </div>
        <div class="form-group flex-1">
          <label>原价 ¥</label>
          <input v-model="form.originalPrice" type="number" placeholder="选填" class="form-input" min="0" step="0.01" />
        </div>
      </div>

      <!-- 失物招领字段 -->
      <div class="form-row" v-if="activeType === 'lost' || activeType === 'found'">
        <div class="form-group flex-1">
          <label>物品分类</label>
          <select v-model="form.category" class="form-input">
            <option value="">请选择</option>
            <option v-for="c in currentCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <div class="form-group flex-1">
          <label>物品名称</label>
          <input v-model="form.itemName" type="text" placeholder="例如：钱包、校园卡、钥匙" class="form-input" />
        </div>
      </div>

      <div class="form-row" v-if="activeType === 'lost' || activeType === 'found'">
        <div class="form-group flex-1">
          <label>时间</label>
          <input v-model="form.eventTime" type="date" class="form-input" />
        </div>
        <div class="form-group flex-1">
          <label>联系方式</label>
          <input v-model="form.contact" type="text" placeholder="手机号/微信/QQ" class="form-input" />
        </div>
      </div>

      <!-- 拼单搭子字段 -->
      <div class="form-row" v-if="activeType === 'group'">
        <div class="form-group flex-1">
          <label>类型</label>
          <select v-model="form.groupType" class="form-input">
            <option value="">请选择</option>
            <option v-for="g in groupTypes" :key="g.value" :value="g.value">{{ g.label }}</option>
          </select>
        </div>
        <div class="form-group flex-1">
          <label>目标人数</label>
          <input v-model="form.targetCount" type="number" placeholder="2" class="form-input" min="2" />
        </div>
      </div>

      <div class="form-row" v-if="activeType === 'group'">
        <div class="form-group flex-1">
          <label>每人价格 ¥</label>
          <input v-model="form.price" type="number" placeholder="选填，免费则不填" class="form-input" min="0" />
        </div>
        <div class="form-group flex-1">
          <label>截止时间</label>
          <input v-model="form.deadline" type="text" placeholder="例如：6月30日 / 长期" class="form-input" />
        </div>
      </div>

      <!-- 跑腿委托字段 -->
      <div class="form-row" v-if="activeType === 'errand'">
        <div class="form-group flex-1">
          <label>任务类型 <span class="required">*</span></label>
          <select v-model="form.taskType" class="form-input">
            <option value="">请选择</option>
            <option v-for="t in taskTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="form-group flex-1">
          <label>报酬 ¥ <span class="required">*</span></label>
          <input v-model="form.reward" type="number" placeholder="0" class="form-input" min="0" />
        </div>
      </div>

      <div class="form-row" v-if="activeType === 'errand'">
        <div class="form-group flex-1">
          <label>取件/出发地点</label>
          <input v-model="form.from" type="text" placeholder="例如：中通快递点" class="form-input" />
        </div>
        <div class="form-group flex-1">
          <label>送达/目的地点</label>
          <input v-model="form.to" type="text" placeholder="例如：主校区7号楼" class="form-input" />
        </div>
      </div>

      <div class="form-row" v-if="activeType === 'errand'">
        <div class="form-group flex-1">
          <label>截止时间</label>
          <input v-model="form.deadline" type="text" placeholder="例如：今天18:00前" class="form-input" />
        </div>
        <div class="form-group flex-1">
          <label>紧急程度</label>
          <select v-model="form.urgency" class="form-input">
            <option value="normal">普通</option>
            <option value="urgent">🔥 紧急</option>
          </select>
        </div>
      </div>

      <!-- 拼单和跑腿共用标签 -->
      <div class="form-group" v-if="activeType === 'group' || activeType === 'errand'">
        <label>标签（逗号分隔）</label>
        <input v-model="form.tags" type="text" :placeholder="activeType === 'group' ? '例如：考研，教材，学习' : '例如：小件，中通，急用'" class="form-input" />
      </div>

      <!-- 地点 和 联系人（trade 共用） -->
      <div class="form-row" v-if="activeType === 'trade' || activeType === 'group'">
        <div class="form-group flex-1">
          <label>地点</label>
          <input v-model="form.location" type="text" placeholder="例如：主校区" class="form-input" />
        </div>
        <div class="form-group flex-1">
          <label>发布人</label>
          <input v-model="form.contact" type="text" placeholder="你的昵称" class="form-input" />
        </div>
      </div>

      <!-- 详细描述 -->
      <div class="form-group">
        <label>详细描述 <span class="required">*</span></label>
        <textarea
          v-model="form.description"
          rows="5"
          :placeholder="activeType === 'trade' ? '描述商品成色、购买时间、使用情况等...' : activeType === 'lost' ? '详细描述物品特征、丢失经过等...' : activeType === 'found' ? '描述捡到的物品特征、领取方式等...' : activeType === 'errand' ? '描述任务具体要求、注意事项等...' : '请详细描述相关信息...'"
          class="form-input form-textarea"
        ></textarea>
      </div>

      <!-- 图标选择 -->
      <div class="form-group">
        <label>选择图标</label>
        <div class="emoji-picker">
          <button
            v-for="e in emojiOptions"
            :key="e"
            :class="['emoji-option', { selected: selectedEmoji === e }]"
            @click="selectedEmoji = e"
            type="button"
          >{{ e }}</button>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="form-actions">
        <button class="btn-cancel" type="button" @click="resetForm">重置</button>
        <button
          class="btn-submit"
          type="button"
          :disabled="!canSubmit || submitting"
          @click="handleSubmit"
        >
          <span v-if="submitting" class="btn-spinner"></span>
          {{ submitting ? '发布中...' : '发布信息' }}
        </button>
      </div>

      <!-- 结果提示 -->
      <div v-if="submitResult" :class="['result-tip', submitResult.ok ? 'success' : 'error']">
        {{ submitResult.ok ? '🎉' : '❌' }} {{ submitResult.msg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.publish-page { max-width: 800px; margin: 0 auto; }
.page-header { margin-bottom: 20px; }
.page-header h1 { font-size: 28px; color: #1a1a2e; margin: 0 0 6px 0; }
.subtitle { color: #8892b0; font-size: 14px; margin: 0; }

.type-selector { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.type-option {
  flex: 1; min-width: 100px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 16px 8px; background: #fff;
  border: 2px solid #e0e0e0; border-radius: 12px;
  cursor: pointer; transition: all 0.2s;
}
.type-option:hover { border-color: #1a73e8; }
.type-option.active { border-color: #1a73e8; background: #e8f0fe; }
.type-icon { font-size: 24px; }
.type-label { font-size: 14px; font-weight: 600; color: #333; }
.type-desc { font-size: 11px; color: #8892b0; }

.form-container { background: #fff; border-radius: 14px; padding: 28px 32px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px; }
.required { color: #e74c3c; }
.form-row { display: flex; gap: 16px; }
.flex-1 { flex: 1; }

.form-input {
  width: 100%; padding: 10px 14px;
  border: 1px solid #e0e0e0; border-radius: 10px;
  font-size: 14px; color: #333; outline: none;
  transition: border-color 0.2s; box-sizing: border-box; background: #fff;
}
.form-input:focus { border-color: #1a73e8; }
.form-input::placeholder { color: #bbb; }
.form-textarea { resize: vertical; min-height: 100px; font-family: inherit; }

.emoji-picker { display: flex; flex-wrap: wrap; gap: 8px; }
.emoji-option {
  width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
  font-size: 24px; border: 2px solid #e0e0e0; border-radius: 10px;
  background: #fff; cursor: pointer; transition: all 0.2s;
}
.emoji-option:hover { border-color: #1a73e8; }
.emoji-option.selected { border-color: #1a73e8; background: #e8f0fe; }

.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.btn-cancel {
  padding: 10px 28px; background: #fff; border: 1px solid #e0e0e0;
  border-radius: 10px; font-size: 14px; color: #5f6368; cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover { background: #f0f2f5; }
.btn-submit {
  padding: 10px 28px; background: #1a73e8; color: #fff; border: none;
  border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: background 0.2s; display: flex; align-items: center; gap: 8px;
}
.btn-submit:hover:not(:disabled) { background: #1557b0; }
.btn-submit:disabled { background: #a0c4f1; cursor: not-allowed; }

.btn-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.result-tip {
  margin-top: 16px; padding: 12px 18px; border-radius: 10px;
  font-size: 14px; text-align: center;
}
.result-tip.success { background: #e8f5e9; color: #2e7d32; }
.result-tip.error { background: #fce4ec; color: #c62828; }

@media (max-width: 768px) {
  .form-row { flex-direction: column; gap: 0; }
  .form-container { padding: 20px 18px; }
}
</style>
