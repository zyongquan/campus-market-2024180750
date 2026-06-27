# AI Collaboration Card

## 实验信息

- **日期**: 2026-06-27
- **实训项目**: 校园轻集市（Campus Market）
- **使用工具**: Claude Code（Anthropic 官方 CLI AI Coding 工具）

---

## Prompt 记录

### Prompt 1：项目目录结构分析

**Prompt**:
```
分析 campus-market-seed 项目的目录结构，解释每个目录的职责，
说明哪些属于课程基础设施，哪些需要自己开发。
```

**AI 输出**:

项目采用 Vue 3 + TypeScript + Vite 前端项目标准目录结构，具体分析如下：

| 目录/文件 | 职责 | 分类 |
|-----------|------|------|
| `src/api/` | API 接口层，封装后端请求 | 需要自己开发 |
| `src/components/` | 可复用组件库 | 需要自己开发 |
| `src/router/` | 前端路由配置 | 部分开发 |
| `src/stores/` | Pinia 状态管理 | 需要自己开发 |
| `src/views/` | 页面视图组件 | 需要自己开发 |
| `src/App.vue` | 根组件 | 基础设施（可修改） |
| `src/main.ts` | 应用入口 | 基础设施 |
| `docs/` | 课程文档与证据 | 需要填写 |
| `scripts/` | 脚本工具 | 基础设施 |
| `public/` | 静态资源 | 按需使用 |
| `node_modules/` | 依赖包 | 基础设施 |
| 配置文件（vite.config.ts 等） | 构建/编译配置 | 基础设施 |

**自己的理解**:

该目录结构遵循 Vue 3 官方推荐的工程化实践。`api`、`components`、`stores`、`views` 四个核心目录构成了应用的分层架构：
- `views` —— 页面层（UI）
- `components` —— 组件层（复用）
- `stores` —— 状态层（数据）
- `api` —— 数据层（接口）

这种分层让代码职责清晰，便于团队协作和后期维护。目前 `api`、`components`、`stores` 三个目录均为空（仅含 .gitkeep），是后续开发的主要工作区域。

**最终结论**: 采纳 AI 分析结果，对目录结构形成了清晰认知。

---

### Prompt 2：解释 main.ts

**Prompt**:
```
解释 campus-market-seed 项目中 src/main.ts 的每一行代码，
说明 Vue 应用如何创建、Pinia 如何注册、Router 如何注册。
```

**AI 输出**:

```typescript
// 1. 从 vue 包导入 createApp 函数 —— Vue 3 的应用创建入口
import { createApp } from 'vue'
// 2. 从 pinia 包导入 createPinia 函数 —— 状态管理库的初始化函数
import { createPinia } from 'pinia'

// 3. 导入根组件 App.vue
import App from './App.vue'
// 4. 导入路由实例（来自 src/router/index.ts）
import router from './router'

// 5. 创建 Vue 应用实例，传入根组件 App
const app = createApp(App)

// 6. 通过 app.use() 注册 Pinia 插件 —— 全局状态管理可用
app.use(createPinia())
// 7. 通过 app.use() 注册 Router 插件 —— 全局路由可用
app.use(router)

// 8. 将应用挂载到 index.html 中 id="app" 的 DOM 元素上
app.mount('#app')
```

执行流程：
1. `createApp(App)` → 创建以 App.vue 为根组件的 Vue 应用实例
2. `app.use(createPinia())` → 向应用注入 Pinia 状态管理能力
3. `app.use(router)` → 向应用注入 Vue Router 路由能力
4. `app.mount('#app')` → 将应用渲染到页面

**自己的理解**:

Vue 3 采用"插件式"架构，通过 `app.use()` 方法注册各种能力（状态管理、路由等），这种设计让核心框架保持轻量，功能按需添加。`main.ts` 是整个前端的"入口文件"，所有初始化逻辑集中在此，清晰的线性流程。

**最终结论**: 完全理解了 Vue 3 应用的创建和插件注册机制。

---

### Prompt 3：解释 Router 的作用

**Prompt**:
```
解释 Vue Router 在 campus-market-seed 项目中的作用，
为什么首页能够显示？路由是如何工作的？
```

**AI 输出**:

Vue Router 是 Vue.js 的官方路由管理器，在前端单页应用（SPA）中实现页面导航。

当前项目路由配置：
```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // HTML5 History 模式
  routes: [
    {
      path: '/',           // 匹配根路径 "/"
      name: 'home',        // 路由名称（编程式导航使用）
      component: HomeView, // 对应的视图组件
    },
  ],
})
```

首页显示原理：
1. 用户访问 `http://localhost:5173/`
2. URL 路径为 `/`，与路由配置中的 `path: '/'` 匹配
3. Vue Router 将 `HomeView` 组件渲染到 `<RouterView />` 所在位置
4. 用户看到 HomeView 的内容："项目启动成功"

Router 的核心作用：
- **URL ↔ 组件映射**: 将不同 URL 映射到不同视图组件
- **SPA 无刷新导航**: 页面切换不重新加载，体验流畅
- **浏览器历史管理**: 支持前进/后退按钮
- **路由守卫**: 可实现权限控制（如登录验证）

**自己的理解**:

Router 就像前端的"交通指挥员"，根据 URL 决定显示哪个页面。`<RouterView />` 是占位符，被匹配到的组件会渲染在此处。`createWebHistory` 使用 HTML5 History API，让 URL 看起来和传统多页应用一样干净（没有 `#` 号）。

**最终结论**: 理解了 SPA 路由原理和 `<RouterView />` 的渲染机制。

---

### Prompt 4：分析技术栈

**Prompt**:
```
分析 campus-market-seed 项目采用的完整技术栈，包括每个技术的作用。
```

**AI 输出**:

| 技术 | 版本 | 作用 |
|------|------|------|
| **Vue 3** | ^3.5.38 | 前端核心框架，Composition API |
| **TypeScript** | ~6.0.0 | 类型安全的 JavaScript 超集 |
| **Vite** | ^8.0.16 | 构建工具，开发服务器 + 打包 |
| **Pinia** | ^3.0.4 | Vue 3 官方状态管理库 |
| **Vue Router** | ^5.1.0 | Vue 3 官方路由管理 |
| **ESLint** | ^10.5.0 | 代码规范检查 |
| **Oxlint** | ~1.69.0 | Rust 实现的高性能 Linter |
| **pnpm** | 11.9.0 | 高效的包管理器 |
| **Node.js** | >=24.12.0 | JavaScript 运行环境 |

**自己的理解**:

该技术栈是当前 Vue 3 生态的主流选择：
- Vue 3 + Composition API 提高了代码组织灵活性
- TypeScript 提供类型安全保障
- Vite 提供了极速的开发体验（HMR 热更新）
- Pinia 替代 Vuex 成为官方推荐的状态管理方案
- pnpm 相比 npm 更节省磁盘空间且安装更快
- Oxlint + ESLint 双重保障代码质量

**最终结论**: 项目采用 2025-2026 年 Vue 生态最新技术栈，是企业级前端项目的标准配置。

---

## 协作总结

### AI 帮助解决的主要问题
1. 快速理解项目目录结构和职责划分
2. 逐行理解关键代码（main.ts、router）
3. 系统性梳理技术栈

### 对 AI 输出的验证
- 所有解释均与官方文档一致
- 代码分析准确无误
- 技术栈版本号与 package.json 一致

### AI 工具的局限性
- AI 无法替代对项目需求的深入理解
- 业务逻辑设计仍需人工决策
- AI 输出的代码需要人工审查和测试

### 使用建议
- 将 AI 作为"加速器"而非"替代品"
- 先独立思考，再用 AI 验证
- 记录每次 AI 交互的 Prompt 和结果
