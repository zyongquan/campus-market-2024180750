<script setup lang="ts">
import { ref, computed } from 'vue'

const activeChat = ref(1)

interface Message {
  id: number
  sender: string
  avatar: string
  content: string
  time: string
  isMe: boolean
}

interface Chat {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
  online: boolean
}

const chats = ref<Chat[]>([
  {
    id: 1,
    name: '张同学',
    avatar: '👦',
    lastMessage: '好的，那我们下午3点图书馆门口见吧',
    time: '10:32',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: '张同学', avatar: '👦', content: '你好，数据结构这本还在吗？', time: '10:15', isMe: false },
      { id: 2, sender: '我', avatar: '👤', content: '在的，九成新，几乎没有笔记', time: '10:18', isMe: true },
      { id: 3, sender: '张同学', avatar: '👦', content: '25元可以便宜点吗？', time: '10:20', isMe: false },
      { id: 4, sender: '我', avatar: '👤', content: '最低22吧，真的很新', time: '10:25', isMe: true },
      { id: 5, sender: '张同学', avatar: '👦', content: '行，那就22，什么时候方便拿？', time: '10:28', isMe: false },
      { id: 6, sender: '我', avatar: '👤', content: '今天下午3点可以，图书馆门口？', time: '10:30', isMe: true },
      { id: 7, sender: '张同学', avatar: '👦', content: '好的，那我们下午3点图书馆门口见吧', time: '10:32', isMe: false },
    ],
  },
  {
    id: 2,
    name: '李同学',
    avatar: '👩',
    lastMessage: '耳机还在吗？什么颜色的？',
    time: '09:15',
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: '李同学', avatar: '👩', content: '耳机还在吗？什么颜色的？', time: '09:15', isMe: false },
      { id: 2, sender: '我', avatar: '👤', content: '在的，是白色的，漫步者W820NB降噪版', time: '09:20', isMe: true },
    ],
  },
  {
    id: 3,
    name: '王同学',
    avatar: '👨',
    lastMessage: '钱包找到了！非常感谢你',
    time: '昨天',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: '王同学', avatar: '👨', content: '你好，请问你捡到的黑色钱包大概什么样子？', time: '昨天 15:00', isMe: false },
      { id: 2, sender: '我', avatar: '👤', content: '黑色长方形对折款，里面有身份证和校园卡', time: '昨天 15:10', isMe: true },
      { id: 3, sender: '王同学', avatar: '👨', content: '对的对的，就是我的！', time: '昨天 15:12', isMe: false },
      { id: 4, sender: '我', avatar: '👤', content: '太好了，你现在方便来图书馆吗？我在失物招领处', time: '昨天 15:15', isMe: true },
      { id: 5, sender: '王同学', avatar: '👨', content: '钱包找到了！非常感谢你', time: '昨天 15:30', isMe: false },
    ],
  },
  {
    id: 4,
    name: '系统通知',
    avatar: '📢',
    lastMessage: '校园轻集市正式上线！欢迎同学们使用',
    time: '06-27',
    unread: 1,
    online: false,
    messages: [
      { id: 1, sender: '系统通知', avatar: '📢', content: '校园轻集市正式上线！欢迎同学们使用。平台提供二手交易、失物招领、拼单搭子、跑腿委托等服务，请遵守校园规范，注意交易安全。', time: '06-27', isMe: false },
    ],
  },
  {
    id: 5,
    name: '赵同学',
    avatar: '👩‍🦰',
    lastMessage: '拼单还差一个人，你要来吗',
    time: '06-26',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: '赵同学', avatar: '👩‍🦰', content: '拼单还差一个人，你要来吗', time: '06-26 14:20', isMe: false },
      { id: 2, sender: '赵同学', avatar: '👩‍🦰', content: '考研数学复习全书，5人团每人¥15', time: '06-26 14:21', isMe: false },
    ],
  },
  {
    id: 6,
    name: '跑腿小助手',
    avatar: '🤖',
    lastMessage: '你发布的跑腿委托已有3人浏览',
    time: '06-25',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: '跑腿小助手', avatar: '🤖', content: '你发布的"代取快递"委托已有3人浏览，1人表示感兴趣', time: '06-25', isMe: false },
    ],
  },
])

const activeChatData = computed(() => chats.value.find(c => c.id === activeChat.value))

const newMsg = ref('')

const sendMessage = () => {
  if (!newMsg.value.trim() || !activeChatData.value) return
  activeChatData.value.messages.push({
    id: Date.now(),
    sender: '我',
    avatar: '👤',
    content: newMsg.value.trim(),
    time: '刚刚',
    isMe: true,
  })
  activeChatData.value.lastMessage = newMsg.value.trim()
  activeChatData.value.time = '刚刚'
  newMsg.value = ''
}

const totalUnread = computed(() => chats.value.reduce((sum, c) => sum + c.unread, 0))
</script>

<template>
  <div class="message-page">
    <div class="page-header">
      <h1>💬 消息中心</h1>
      <span v-if="totalUnread" class="unread-total">{{ totalUnread }} 条未读</span>
    </div>

    <div class="message-layout">
      <!-- Chat List -->
      <div class="chat-list">
        <div
          v-for="chat in chats"
          :key="chat.id"
          :class="['chat-item', { active: activeChat === chat.id }]"
          @click="activeChat = chat.id"
        >
          <div class="chat-avatar">
            <span>{{ chat.avatar }}</span>
            <span v-if="chat.online" class="online-dot"></span>
          </div>
          <div class="chat-info">
            <div class="chat-name-row">
              <span class="chat-name">{{ chat.name }}</span>
              <span class="chat-time">{{ chat.time }}</span>
            </div>
            <div class="chat-preview-row">
              <span class="chat-preview">{{ chat.lastMessage }}</span>
              <span v-if="chat.unread" class="chat-badge">{{ chat.unread }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Content -->
      <div class="chat-content" v-if="activeChatData">
        <div class="chat-header">
          <span class="chat-header-avatar">{{ activeChatData.avatar }}</span>
          <div class="chat-header-info">
            <span class="chat-header-name">{{ activeChatData.name }}</span>
            <span class="chat-header-status" v-if="activeChatData.online">🟢 在线</span>
            <span class="chat-header-status offline" v-else>离线</span>
          </div>
        </div>

        <div class="chat-messages">
          <div
            v-for="msg in activeChatData.messages"
            :key="msg.id"
            :class="['message-bubble', { me: msg.isMe }]"
          >
            <div v-if="!msg.isMe" class="msg-avatar">{{ msg.avatar }}</div>
            <div class="msg-content">
              <span v-if="!msg.isMe" class="msg-sender">{{ msg.sender }}</span>
              <div class="msg-text">{{ msg.content }}</div>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
            <div v-if="msg.isMe" class="msg-avatar me-avatar">👤</div>
          </div>
        </div>

        <div class="chat-input-area">
          <input
            v-model="newMsg"
            type="text"
            placeholder="输入消息..."
            class="chat-input"
            @keyup.enter="sendMessage"
          />
          <button class="btn-send" @click="sendMessage" :disabled="!newMsg.trim()">
            发送
          </button>
        </div>
      </div>

      <!-- Empty state when no chat selected -->
      <div v-else class="chat-empty">
        <span class="empty-icon">💬</span>
        <p>选择一个会话开始聊天</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0;
}

.unread-total {
  font-size: 13px;
  color: #e74c3c;
  font-weight: 600;
}

/* Layout */
.message-layout {
  display: flex;
  height: 580px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e8eaed;
}

/* Chat List */
.chat-list {
  width: 320px;
  border-right: 1px solid #e8eaed;
  overflow-y: auto;
  flex-shrink: 0;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f5f5f5;
}

.chat-item:hover {
  background: #f8f9fa;
}

.chat-item.active {
  background: #e8f0fe;
}

.chat-avatar {
  position: relative;
  font-size: 28px;
  flex-shrink: 0;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  border: 2px solid #fff;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.chat-time {
  font-size: 11px;
  color: #bbb;
  flex-shrink: 0;
}

.chat-preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-preview {
  font-size: 13px;
  color: #8892b0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.chat-badge {
  font-size: 11px;
  min-width: 20px;
  height: 20px;
  background: #e74c3c;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  font-weight: 600;
}

/* Chat Content */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid #e8eaed;
  background: #fafbfc;
}

.chat-header-avatar {
  font-size: 28px;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-header-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chat-header-status {
  font-size: 12px;
  color: #4caf50;
}

.chat-header-status.offline {
  color: #bbb;
}

/* Messages */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fafbfc;
}

.message-bubble {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 70%;
}

.message-bubble.me {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  font-size: 24px;
  flex-shrink: 0;
}

.msg-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-bubble.me .msg-content {
  align-items: flex-end;
}

.msg-sender {
  font-size: 11px;
  color: #8892b0;
  margin-bottom: 2px;
}

.msg-text {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  background: #fff;
  border: 1px solid #e8eaed;
  color: #333;
}

.message-bubble.me .msg-text {
  background: #1a73e8;
  color: #fff;
  border: none;
}

.msg-time {
  font-size: 11px;
  color: #bbb;
}

/* Input */
.chat-input-area {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #e8eaed;
  background: #fff;
}

.chat-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #1a73e8;
}

.btn-send {
  padding: 10px 22px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-send:hover:not(:disabled) {
  background: #1557b0;
}

.btn-send:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Empty */
.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8892b0;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.chat-empty p {
  font-size: 15px;
  margin: 0;
}

@media (max-width: 768px) {
  .message-layout {
    flex-direction: column;
    height: auto;
  }
  .chat-list {
    width: 100%;
    max-height: 220px;
    border-right: none;
    border-bottom: 1px solid #e8eaed;
  }
  .chat-content {
    height: 450px;
  }
}
</style>
