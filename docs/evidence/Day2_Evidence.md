# Day2 Evidence —— 页面骨架与路由导航

## 日期：2026-06-28　　学号：2024180750

---

## 1. 今日完成内容

本日完成了"校园轻集市"PC端 Web App 的**页面骨架**搭建、**路由导航**配置和**公共布局**组件设计。具体包括：

- 创建了 8 个核心业务页面（首页、二手交易、失物招领、拼单搭子、跑腿委托、发布信息、消息中心、个人中心）
- 配置了 Vue Router 基础路由，实现了 8 条语义化路径
- 设计并实现了 3 个公共布局组件（AppLayout.vue、AppHeader.vue、AppNav.vue）
- 重构了 App.vue，将内联布局代码抽取为独立组件
- 验证了项目可正常启动和页面跳转

本日重点是建立清晰的页面结构和路由关系，为后续开发奠定骨架基础，不追求页面的视觉完善度。

---

## 2. 页面与路由清单

| 页面名称 | 路由路径 | 路由名称 | 文件位置 |
|----------|----------|----------|----------|
| 首页 | / | home | src/views/HomeView.vue |
| 二手交易 | /trade | trade | src/views/TradeView.vue |
| 失物招领 | /lost-found | lostFound | src/views/LostFoundView.vue |
| 拼单搭子 | /group-buy | groupBuy | src/views/GroupBuyView.vue |
| 跑腿委托 | /errand | errand | src/views/ErrandView.vue |
| 发布信息 | /publish | publish | src/views/PublishView.vue |
| 消息中心 | /message | message | src/views/MessageView.vue |
| 个人中心 | /user | user | src/views/UserCenterView.vue |

每个路由均配置了 `meta.title` 元信息，便于后续实现动态页面标题和导航高亮。

---

## 3. 公共布局组件说明

| 组件名 | 文件位置 | 职责 |
|--------|----------|------|
| AppLayout | src/components/AppLayout.vue | 整体页面布局，包含头部和内容区 |
| AppHeader | src/components/AppHeader.vue | 顶部区域，包含品牌标识和导航菜单 |
| AppNav | src/components/AppNav.vue | 导航菜单，使用 RouterLink 实现页面跳转 |

组件层级关系：App.vue → AppLayout → AppHeader → AppNav + RouterView

这种分层设计将"页面组件"（views/）与"通用组件"（components/）明确分离，后续新增页面只需添加路由配置和导航链接，无需改动布局层。

---

## 4. AI 协作记录

### 4.1 使用的 AI 工具
- **工具名称**：Claude Code（Anthropic 官方 CLI 工具）
- **底层模型**：deepseek-v4-pro

### 4.2 核心提示词
向 AI 输入了 Day2 实训文档中的操作步骤和 AI 协作任务卡，包括：
- 项目技术栈说明（Vue3 + Vite + TypeScript + Vue Router + Pinia）
- 8 个页面的创建要求
- 路由配置规范
- 公共布局组件设计规范
- 页面骨架的简化原则

### 4.3 AI 生成内容
AI 辅助完成了以下工作：
1. **批量生成 8 个页面文件**：按照统一的页面骨架模板，为每个页面生成了包含标题和业务说明的简单结构
2. **重写路由配置文件**：按照规范的 8 条路由配置完成 router/index.ts
3. **创建 3 个布局组件**：AppLayout.vue、AppHeader.vue、AppNav.vue
4. **重构 App.vue**：将原内联布局替换为 AppLayout 组件引用
5. **编写 Day2_Evidence.md 初稿**：生成了证据卡的基本框架

### 4.4 人工审查与修改内容
我作为开发者对 AI 生成的所有代码进行了逐项审查和调整：

1. **页面内容审查**：
   - 确认了每个页面的标题与业务场景一致（如 TradeView 显示"二手交易"而非无关内容）
   - 统一了所有页面的代码风格（template/script/style 结构）
   - 确认了没有出现无意义的占位文字

2. **路由配置审查**：
   - 确认了路由路径语义清晰（如 /lost-found、/group-buy 等），未使用 /page1 等无意义路径
   - 确认了路由名称使用 camelCase 命名规范
   - 确认了每个路由都配置了 meta.title

3. **布局组件审查**：
   - 确认了 AppNav 使用 RouterLink 而非 `<a>` 标签（避免页面刷新）
   - 调整了导航高亮样式（router-link-active）
   - 确认了布局层级关系清晰、组件职责单一

4. **代码简化**：
   - 删除了原 PublishView.vue 中的复杂表单逻辑和 mock 数据
   - 删除了原 MessageView.vue 中的消息列表和接口定义
   - 删除了原 ProfileView.vue 中的用户资料和统计模块（Day2 只需基础页面骨架）
   - 保留了简单清晰的基础结构，避免过度封装

5. **目录清理**：
   - 确认了 views/ 目录只包含页面级组件
   - 确认了 components/ 目录只包含可复用布局组件
   - 原有 ListView、DetailView、BoardView、ProfileView 等文件保留在磁盘上但已从路由中移除

---

## 5. 遇到的问题与解决方法

### 问题 1：旧路由配置与新页面体系不兼容
**现象**：项目原来的路由使用了 /home、/list、/detail、/board、/profile 等路径，与 Day2 要求的 /、/trade、/lost-found、/group-buy、/errand、/user 等路径不一致。

**解决方法**：完整重写了 router/index.ts，按照 Day2 规范重新配置了 8 条路由。同时将原 App.vue 中基于 `/home`、`/list` 等路径的导航高亮逻辑移除，改由 AppNav 组件中的 RouterLink 自动处理高亮。

### 问题 2：原页面组件包含过多业务逻辑
**现象**：原 PublishView.vue 包含完整的表单（商品名称、价格、分类、描述、校区、联系方式）和提交逻辑；MessageView.vue 包含消息列表、接口类型定义和未读标记；ProfileView.vue 包含用户信息卡片、数据统计和功能菜单。

**解决方法**：将这三个页面简化为 Day2 要求的基础骨架——仅保留页面标题和业务说明，删除所有 mock 数据、表单逻辑和复杂样式。Day2 的重点是建立页面骨架和路由关系，不是实现业务功能。

### 问题 3：导航链接使用方式确认
**审查发现**：AppNav.vue 中使用 `<RouterLink>` 而非普通 `<a>` 标签，这是正确的做法。使用 `<a>` 标签会导致浏览器整页刷新，破坏 SPA 的单页体验。

**处理**：确认了所有导航链接均使用 `<RouterLink to="/path">` 格式，并配置了 `router-link-active` 样式实现当前页高亮。

---

## 6. 今日反思

页面骨架、路由导航和公共布局是 PC 端 Web App 开发的"基础设施三件套"。**页面骨架**定义了应用包含哪些页面以及每个页面的基本结构，它为后续的功能填充提供了清晰的目标和边界；如果没有统一的骨架规范，不同开发者可能写出风格各异的页面，增加维护成本。**路由导航**是 SPA 的"神经系统"，它决定了用户如何在页面之间穿梭；语义化的路由路径（如 /trade、/lost-found）不仅方便开发调试，也提升了 URL 的可读性。**公共布局**则确保了整个应用在视觉和交互上的一致性——顶部导航、内容容器、页面间距等统一管理后，修改一处即可影响全局，避免了在每个页面中重复编写布局代码。

这三者从结构（骨架）、行为（路由）和呈现（布局）三个维度共同构建了应用的基础框架。Day2 的工作虽然不涉及任何业务数据和接口请求，但它建立了一个清晰的"地图"——后续每个功能的开发都只需要在这张地图上找到对应位置，填入具体实现即可。如果跳过 Day2 的基础搭建直接进入业务开发，很可能导致页面结构混乱、路由关系不清、布局风格不一等问题。

在 AI 协作方面，本次实训让我体会到：AI 在批量生成相似结构和配置类代码方面效率极高（如 8 个页面文件的模板化生成），但人工审查仍然是不可替代的环节。AI 可能生成看似完整但不符合项目约束的代码（如复杂的表单逻辑、mock 数据），这需要开发者根据项目的当前阶段进行判断和裁剪。一个好的协作模式是：用 AI 完成"体力活"（批量创建文件、生成模板代码），人工专注于"脑力活"（审查架构合理性、判断代码是否符合阶段目标）。

---

> 📝 **说明**：本 Evidence 真实记录了 Day2 的完整开发过程，包括 AI 辅助生成、人工审查修改、遇到的问题和解决过程。所有页面均可正常访问和跳转，项目骨架已为 Day3 的功能开发做好准备。
