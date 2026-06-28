<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  from: string
  avatar: string
  content: string
  time: string
  unread: boolean
}

const messages = ref<Message[]>([
  { id: 1, from: '张三', avatar: '👤', content: '你好，这本教材还在吗？', time: '10分钟前', unread: true },
  { id: 2, from: '李四', avatar: '👩', content: '耳机可以便宜点吗？', time: '1小时前', unread: true },
  { id: 3, from: '王五', avatar: '👨', content: '好的，明天下午3点见', time: '昨天', unread: false },
  { id: 4, from: '系统通知', avatar: '🔔', content: '你的商品「台灯」审核已通过', time: '2天前', unread: false },
])
</script>

<template>
  <div class="message-page">
    <h1>💬 消息</h1>
    <p class="subtitle">与你相关的消息通知</p>

    <div class="message-list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-item"
        :class="{ unread: msg.unread }"
      >
        <div class="avatar">{{ msg.avatar }}</div>
        <div class="message-body">
          <div class="message-header">
            <span class="from">{{ msg.from }}</span>
            <span class="time">{{ msg.time }}</span>
          </div>
          <p class="content">{{ msg.content }}</p>
        </div>
        <span v-if="msg.unread" class="badge"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-page {
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

.message-list {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
  cursor: pointer;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:hover {
  background: #fafafa;
}

.message-item.unread {
  background: #f0f7ff;
}

.avatar {
  font-size: 32px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-body {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.from {
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.content {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.badge {
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
