# Day1 Evidence —— 项目启动与基础理解

## 日期2026-06-27   学号：2024180750

## 一、今日完成内容

###1. 开发环境配置 
- **Node.js**: 配置 v24.12.0（通过 nvm 管理）
- **pnpm**: 配置 11.9.0（通过 Corepack）
- **Git**: 已配置并连接仓库
- **VS Code**: 安装 Vue - Official、ESLint、GitLens 等插件
- **依赖安装**: `pnpm install` 执行成功

### 2. 课程文档阅读 

阅读并理解了以下文档：
- 《实训方案》—— 了解7天实训的目标和评价方式
- 《需求分析》—— 理解校园轻集市的业务需求
- 《技术架构》—— 理解 Vue 3 + Pinia + Vue Router 的技术选型
- 《实训计划》—— 了解每日任务安排
- `docs/guide/Environment_Setup.md` —— 环境配置指南
- `docs/guide/Getting_Started.md` —— 项目启动指南

### 3. 项目结构分析 

完成项目目录分析，理解各目录职责：

| 目录 | 用途 | 开发状态 |
|------|------|----------|
| `src/api/` | API 接口封装层 | 待开发 |
| `src/components/` | 可复用组件 | 待开发 |
| `src/stores/` | Pinia 状态管理 | 待开发 |
| `src/views/` | 页面视图 | 已有 HomeView |
| `src/router/` | 路由配置 | 已有基础配置 |
| `src/App.vue` | 根组件 | 基础设施 |
| `src/main.ts` | 应用入口 | 基础设施 |
| `docs/` | 文档与证据 | 持续填写 |
| `public/` | 静态资源 | 按需使用 |

### 4. 核心代码阅读 

**main.ts 理解**：
- Vue 应用通过 `createApp(App)` 创建
- Pinia 通过 `app.use(createPinia())` 注册
- Router 通过 `app.use(router)` 注册
- 应用挂载到 `#app` DOM 元素

**router/index.ts 理解**：
- Router 实现 URL 与视图组件的映射
- 当前仅有 `/` 路由，对应 HomeView 组件
- 使用 HTML5 History 模式（干净 URL）

**App.vue 理解**：
- 根组件，包含标题和 `<RouterView />` 占位符
- 所有子页面渲染在 `<RouterView />` 处

### 5. AI 协作实践 

使用 Claude Code 完成了：
- 项目目录分析
- main.ts 逐行解释
- Router 工作原理分析
- 技术栈梳理

详细记录见 `docs/ai/AI_Collaboration_Card.md`

### 6. 项目规划 

完成了项目整体规划，详见 `docs/Project_Plan.md`

---

## 二、学习收获

### 技术层面
1. **Vue 3 应用创建流程**: 理解了 `createApp → use(插件) → mount` 的标准流程
2. **SPA 路由机制**: 理解了前端路由原理，`<RouterView />` 作为动态组件的占位符
3. **Pinia 状态管理**: 了解了 Pinia 作为 Vue 3 官方状态管理库的定位
4. **工程化配置**: 理解了 `.nvmrc`、`packageManager`、`.editorconfig` 等统一开发环境的作用

### 工程层面
1. **目录分层思想**: `views → components → stores → api` 四层架构清晰分离关注点
2. **环境基线概念**: 了解了为什么需要统一 Node.js 版本、包管理器版本
3. **过程性评价**: 理解了每天填写 Evidence 的意义——记录真实学习过程

### 协作层面
1. **AI 工具定位**: AI 是加速器，不是替代品；先思考，再用 AI 验证
2. **Prompt 工程**: 清晰具体的 Prompt 能得到更准确的 AI 输出

---

## 三、遇到的问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| pnpm 版本不一致 | 系统默认 pnpm 版本与项目要求不符 | 使用 `corepack prepare pnpm@11.9.0 --activate` 激活指定版本 |
| 项目依赖安装缓慢 | 默认 npm registry 在国外 | 配置国内镜像：`pnpm config set registry https://registry.npmmirror.com` |
| .gitkeep 文件疑惑 | 不了解空目录在 Git 中的处理 | 理解了 Git 不追踪空目录，.gitkeep 用于保留目录结构 |

---

## 四、AI 协作情况

### 工具选择
- **工具**: Claude Code（Anthropic 官方 CLI）
- **选择理由**: 支持复杂上下文理解，原生支持中文，可处理多文件分析

### 本次协作内容
1. 分析项目目录结构 → AI 给出分层架构解读
2. 解释 main.ts 每行代码 → AI 逐行注释
3. 解释 Router 作用和首页显示原理 → AI 给出完整流程
4. 分析技术栈 → AI 整理表格并说明各技术作用

### 协作心得
- AI 在"解释代码"和"知识梳理"方面效率极高
- AI 的输出需要人工验证（如版本号核验）
- 保持"先独立思考，再请教 AI"的习惯

---

## 五、后续计划

### Day2 预期任务
- [ ] 阅读需求分析详细文档
- [ ] 设计页面路由结构
- [ ] 开发首页 UI 框架
- [ ] 填写 Day2 Evidence

### 整体计划
详见 `docs/Project_Plan.md`
---
## 六、自评

| 评价维度 |  说明 |
|----------|-----|
| 环境配置 | 所有工具版本正确，项目正常启动 |
| 文档阅读 | 阅读了所有课程资料，理解了项目背景 |
| 代码理解 | 能逐行解释 main.ts、router、App.vue |
| AI 协作 |  有效利用 AI 加速学习，保持独立思考 |
| 文档记录 |  及时完整填写了 AI Card 和 Evidence |
---
> 📝 **说明**: 本 Evidence 真实记录了 Day1 的学习过程，包括遇到的问题和解决过程，而非简单复制实验步骤。
