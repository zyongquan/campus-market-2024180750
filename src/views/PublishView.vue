<script setup lang="ts">
import { ref, computed } from 'vue'

const activeType = ref('trade')

const publishTypes = [
  { key: 'trade', label: '二手商品', icon: '🛒', desc: '发布闲置物品出售' },
  { key: 'lost', label: '寻物启事', icon: '😰', desc: '寻找遗失的物品' },
  { key: 'found', label: '失物招领', icon: '😊', desc: '发布捡到的物品' },
  { key: 'group', label: '拼单搭子', icon: '🤝', desc: '发起拼单或找搭子' },
  { key: 'errand', label: '跑腿委托', icon: '🏃', desc: '发布跑腿任务' },
]

const form = ref({
  title: '',
  category: '',
  price: '',
  description: '',
  location: '',
  contact: '',
  image: '',
})

const categories = computed(() => {
  const map: Record<string, { value: string; label: string }[]> = {
    trade: [
      { value: 'book', label: '教材书籍' },
      { value: 'digital', label: '数码电子' },
      { value: 'life', label: '生活用品' },
      { value: 'fashion', label: '服饰鞋包' },
      { value: 'sport', label: '运动出行' },
      { value: 'other', label: '其他' },
    ],
    lost: [
      { value: 'wallet', label: '钱包证件' },
      { value: 'digital', label: '数码电子' },
      { value: 'life', label: '生活用品' },
      { value: 'book', label: '书籍教材' },
      { value: 'bag', label: '箱包服饰' },
      { value: 'other', label: '其他' },
    ],
    found: [
      { value: 'wallet', label: '钱包证件' },
      { value: 'digital', label: '数码电子' },
      { value: 'life', label: '生活用品' },
      { value: 'book', label: '书籍教材' },
      { value: 'other', label: '其他' },
    ],
    group: [
      { value: 'group', label: '拼单' },
      { value: 'partner', label: '搭子' },
      { value: 'team', label: '组队' },
    ],
    errand: [
      { value: 'delivery', label: '代取快递' },
      { value: 'shopping', label: '代购物品' },
      { value: 'print', label: '打印复印' },
      { value: 'queue', label: '代排队' },
      { value: 'other', label: '其他' },
    ],
  }
  return map[activeType.value] || []
})

const showPrice = computed(() => ['trade', 'group', 'errand'].includes(activeType.value))

const submitted = ref(false)

const handleSubmit = () => {
  if (!form.value.title || !form.value.description) return
  submitted.value = true
  setTimeout(() => { submitted.value = false }, 3000)
  form.value = { title: '', category: '', price: '', description: '', location: '', contact: '', image: '' }
}
</script>

<template>
  <div class="publish-page">
    <div class="page-header">
      <h1>✏️ 发布信息</h1>
      <p class="subtitle">选择发布类型，填写详细信息</p>
    </div>

    <!-- Type Selector -->
    <div class="type-selector">
      <button
        v-for="pt in publishTypes"
        :key="pt.key"
        :class="['type-option', { active: activeType === pt.key }]"
        @click="activeType = pt.key"
      >
        <span class="type-icon">{{ pt.icon }}</span>
        <span class="type-label">{{ pt.label }}</span>
        <span class="type-desc">{{ pt.desc }}</span>
      </button>
    </div>

    <!-- Form -->
    <div class="form-container">
      <div class="form-group">
        <label>标题 <span class="required">*</span></label>
        <input
          v-model="form.title"
          type="text"
          :placeholder="activeType === 'trade' ? '例如：九成新数据结构教材' : activeType === 'lost' ? '例如：黑色钱包遗失' : '请输入标题...'"
          class="form-input"
        />
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label>分类</label>
          <select v-model="form.category" class="form-input">
            <option value="">请选择分类</option>
            <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>

        <div v-if="showPrice" class="form-group flex-1">
          <label>价格 (¥)</label>
          <input
            v-model="form.price"
            type="number"
            placeholder="0.00"
            class="form-input"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div class="form-group">
        <label>详细描述 <span class="required">*</span></label>
        <textarea
          v-model="form.description"
          rows="5"
          :placeholder="activeType === 'trade' ? '描述商品成色、购买时间、使用情况等...' : '请详细描述相关信息...'"
          class="form-input form-textarea"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label>地点</label>
          <input v-model="form.location" type="text" placeholder="例如：主校区图书馆" class="form-input" />
        </div>

        <div class="form-group flex-1">
          <label>联系方式</label>
          <input v-model="form.contact" type="text" placeholder="手机号/微信/QQ" class="form-input" />
        </div>
      </div>

      <div class="form-group">
        <label>图片</label>
        <div class="image-upload">
          <span class="upload-icon">📷</span>
          <span class="upload-text">点击上传图片（最多9张）</span>
          <span class="upload-hint">支持 jpg/png，每张不超过5MB</span>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-cancel" type="button">取消</button>
        <button class="btn-submit" type="button" @click="handleSubmit">
          {{ submitted ? '✅ 发布成功！' : '发布信息' }}
        </button>
      </div>

      <!-- Success tip -->
      <div v-if="submitted" class="success-tip">
        🎉 信息发布成功！等待审核通过后将公开展示。
      </div>
    </div>
  </div>
</template>

<style scoped>
.publish-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
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

/* Type Selector */
.type-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-option:hover {
  border-color: #1a73e8;
}

.type-option.active {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.type-icon {
  font-size: 24px;
}

.type-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.type-desc {
  font-size: 11px;
  color: #8892b0;
}

/* Form */
.form-container {
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.required {
  color: #e74c3c;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 {
  flex: 1;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #fff;
}

.form-input:focus {
  border-color: #1a73e8;
}

.form-input::placeholder {
  color: #bbb;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Image Upload */
.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.image-upload:hover {
  border-color: #1a73e8;
  background: #f8faff;
}

.upload-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #5f6368;
}

.upload-hint {
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  padding: 10px 28px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f0f2f5;
}

.btn-submit {
  padding: 10px 28px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #1557b0;
}

.success-tip {
  margin-top: 16px;
  padding: 12px 18px;
  background: #e8f5e9;
  border-radius: 10px;
  color: #2e7d32;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 768px) {
  .type-selector {
    flex-wrap: wrap;
  }
  .type-option {
    flex: 1 1 calc(33% - 10px);
    min-width: 100px;
  }
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  .form-container {
    padding: 20px 18px;
  }
}
</style>
