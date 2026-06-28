<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  title: '',
  price: null as number | null,
  category: '',
  description: '',
  campus: '',
  contact: '',
})

const categories = ['📚 教材书籍', '💻 数码电子', '🛋️ 生活用品', '👕 服饰鞋包', '🚲 运动出行', '🎮 娱乐周边']

function handleSubmit() {
  alert('发布成功！（演示）')
  console.log('提交数据：', form.value)
}
</script>

<template>
  <div class="publish-page">
    <h1>📝 发布信息</h1>
    <p class="subtitle">填写以下信息，发布你的闲置好物</p>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>商品名称 <span class="required">*</span></label>
        <input v-model="form.title" type="text" placeholder="请输入商品名称" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>价格（元）<span class="required">*</span></label>
          <input v-model.number="form.price" type="number" placeholder="0.00" min="0" step="0.01" required />
        </div>
        <div class="form-group">
          <label>分类 <span class="required">*</span></label>
          <select v-model="form.category" required>
            <option value="" disabled>请选择分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>商品描述</label>
        <textarea v-model="form.description" rows="4" placeholder="描述商品的使用情况、成色等信息..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>所在校区</label>
          <input v-model="form.campus" type="text" placeholder="如：主校区" />
        </div>
        <div class="form-group">
          <label>联系方式</label>
          <input v-model="form.contact" type="text" placeholder="QQ / 微信 / 手机号" />
        </div>
      </div>

      <button type="submit" class="btn-submit">立即发布</button>
    </form>
  </div>
</template>

<style scoped>
.publish-page {
  max-width: 640px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 24px;
}

.publish-form {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 16px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}

.btn-submit:hover {
  background: #337ecc;
}
</style>
