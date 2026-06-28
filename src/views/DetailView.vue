<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const goodsId = computed(() => route.params.id)

// 模拟数据（实际项目中会从 API 获取）
const detail = ref({
  title: '二手教材《数据结构》',
  price: 25,
  image: '📚',
  seller: '张三',
  description: '九成新，数据结构（C语言版），严蔚敏编著。只用了一个学期，几乎无笔记。适合计算机专业同学使用。',
  condition: '9成新',
  campus: '主校区',
  publishTime: '2026-06-25',
})
</script>

<template>
  <div class="detail-page">
    <router-link to="/list" class="back-link">← 返回列表</router-link>

    <div class="detail-card">
      <div class="detail-image">{{ detail.image }}</div>

      <div class="detail-body">
        <h1>{{ detail.title }}</h1>
        <p class="detail-id">商品编号：{{ goodsId }}</p>

        <div class="price-section">
          <span class="price">¥{{ detail.price }}</span>
          <span class="condition">{{ detail.condition }}</span>
        </div>

        <div class="meta">
          <p><strong>卖家：</strong>{{ detail.seller }}</p>
          <p><strong>校区：</strong>{{ detail.campus }}</p>
          <p><strong>发布时间：</strong>{{ detail.publishTime }}</p>
        </div>

        <div class="description">
          <h3>商品描述</h3>
          <p>{{ detail.description }}</p>
        </div>

        <div class="actions">
          <button class="btn-contact">联系卖家</button>
          <button class="btn-fav">❤️ 收藏</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #409eff;
  text-decoration: none;
}

.detail-card {
  display: flex;
  gap: 32px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 32px;
}

.detail-image {
  font-size: 80px;
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 12px;
}

.detail-body {
  flex: 1;
}

.detail-body h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.detail-id {
  color: #999;
  font-size: 13px;
  margin-bottom: 16px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.price {
  font-size: 32px;
  color: #e74c3c;
  font-weight: bold;
}

.condition {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.meta p {
  margin-bottom: 8px;
  color: #555;
}

.description {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.description h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.description p {
  color: #666;
  line-height: 1.6;
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.btn-contact {
  padding: 10px 28px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.btn-fav {
  padding: 10px 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}
</style>
