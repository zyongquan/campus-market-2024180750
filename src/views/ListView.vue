<script setup lang="ts">
import { ref } from 'vue'

interface GoodsItem {
  id: number
  title: string
  price: number
  image: string
  seller: string
}

const goodsList = ref<GoodsItem[]>([
  { id: 1, title: '二手教材《数据结构》', price: 25, image: '📚', seller: '张三' },
  { id: 2, title: '全新耳机（未拆封）', price: 89, image: '🎧', seller: '李四' },
  { id: 3, title: '台灯（可调光）', price: 35, image: '💡', seller: '王五' },
  { id: 4, title: '机械键盘 Cherry 轴', price: 150, image: '⌨️', seller: '赵六' },
  { id: 5, title: '考研数学复习全书', price: 40, image: '📖', seller: '孙七' },
  { id: 6, title: '自行车 26寸', price: 200, image: '🚲', seller: '周八' },
])
</script>

<template>
  <div class="list-page">
    <h1>📋 商品列表</h1>
    <p class="subtitle">浏览校园二手好物，发现惊喜</p>

    <div class="goods-grid">
      <div
        v-for="item in goodsList"
        :key="item.id"
        class="goods-card"
      >
        <div class="goods-image">{{ item.image }}</div>
        <div class="goods-info">
          <h3>{{ item.title }}</h3>
          <p class="price">¥{{ item.price }}</p>
          <p class="seller">卖家：{{ item.seller }}</p>
        </div>
        <router-link :to="`/detail/${item.id}`" class="detail-link">查看详情 →</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  max-width: 960px;
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

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.goods-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  transition: box-shadow 0.2s;
}

.goods-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.goods-image {
  font-size: 48px;
  text-align: center;
  margin-bottom: 12px;
}

.goods-info h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.price {
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}

.seller {
  color: #999;
  font-size: 13px;
}

.detail-link {
  display: inline-block;
  margin-top: 12px;
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}
</style>
