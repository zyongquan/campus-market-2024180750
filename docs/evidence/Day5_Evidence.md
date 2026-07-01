# Day5 Evidence - 状态管理与用户中心

## 日期：2026-07-01   学号：2024180750

---

## 1. 今日完成内容

**Pinia 状态管理引入**：在项目中创建了两个 Pinia Store——`user.ts`（用户状态）和 `favorite.ts`（收藏状态），并在 `main.ts` 中确认 Pinia 已正确挂载。

**用户状态 Store**：`useUserStore` 管理当前用户信息（用户名、学院、年级、头像、简介）和登录状态，提供 `displayName` 和 `userDescription` 两个 getter，以及 `updateProfile`、`login`、`logout` 三个 action。Day5 阶段使用模拟用户数据（"校园用户"），不接入真实登录。

**收藏状态 Store**：`useFavoriteStore` 管理收藏列表的增删查改，提供 `addFavorite`、`removeFavorite`、`toggleFavorite`、`isFavorite` 方法，以及 `favoriteCount` 和按类型筛选的 getter。收藏数据存储在 Pinia 内存中，刷新后丢失——这是 Day5 可以接受的临时状态。

**跨页面状态共享**：
- `AppHeader.vue` 导航栏显示当前用户名称（从 userStore 读取）
- `PublishView.vue` 发布页的 publisher 字段自动使用 `userStore.displayName` 作为默认发布人
- `TradeView.vue` 二手交易列表页接入收藏功能，每张商品卡片的"收藏/已收藏"按钮与 favoriteStore 联动
- `UserCenterView.vue` 个人中心全面重构，展示来自 userStore 的用户资料和来自 favoriteStore 的收藏列表

---

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要 State | Getter | Action |
|---|---|---|---|---|
| stores/user.ts | 当前用户信息 | isLoggedIn、currentUser（name/college/grade/avatar/bio） | displayName、userDescription | updateProfile、login、logout |
| stores/favorite.ts | 收藏状态 | favorites（FavoriteItem 数组） | favoriteCount、favoritesByType | addFavorite、removeFavorite、toggleFavorite、isFavorite |

---

## 3. 状态边界说明

| 数据类型 | 是否放入 Store | 原因 |
|---|---|---|
| 当前用户信息 |  放入 userStore | 导航栏、发布页、个人中心等多处需要显示用户名 |
| 收藏列表 |  放入 favoriteStore | 列表页（收藏按钮状态）和个人中心（收藏列表展示）共享 |
| 表单校验错误 |  不放 Store | 只属于发布页面内部的瞬时状态，无跨页面共享需求 |
| 列表数据（trades 等） |  不放 Store | 目前每个列表页独立请求数据，无需全局缓存。若后续需要全局数据池可考虑 |
| 搜索关键词 |  不放 Store | 仅属于当前列表页的临时筛选条件 |
| 消息/聊天数据 |  不放 Store | 已通过 `ref` 在 MessageView 组件内管理，暂无跨页面共享需求 |


---

## 4. 页面使用记录

| 页面/组件 | 使用的 Store | 用途 |
|---|---|---|
| `AppHeader.vue` | userStore | 导航栏用户区显示 `userStore.displayName` |
| `PublishView.vue` | userStore | publisher 字段默认值使用 `userStore.displayName`，允许手动覆盖 |
| `TradeView.vue` | favoriteStore | 每张商品卡片绑定收藏/取消收藏按钮，`isFavorite()` 控制按钮文字，`toggleFavorite()` 处理点击 |
| `UserCenterView.vue` | userStore + favoriteStore | userStore 提供用户资料（头像、姓名、学院、简介）；favoriteStore 提供"我的收藏"面板和统计数字；"我的发布"模块预留结构 |

---

## 5. AI 协作记录

**使用工具**：Claude Code（VS Code 扩展）

**核心提示词**：

 1. 创建 userStore 和 favoriteStore
 2. AppHeader 显示当前用户名称
 3. PublishView 发布人从 userStore 读取
 4. TradeView 接入收藏功能
 5. UserCenterView 重构为 Store 驱动
 6. 保持代码简洁，不引入真实登录/JWT/后端认证

**AI 生成内容**：
- `stores/user.ts` 和 `stores/favorite.ts` 两个 Store 的完整实现
- AppHeader.vue 的 userStore 集成
- PublishView.vue 的 publisher 字段改造
- TradeView.vue 的收藏按钮（替换原有"想要"按钮）
- UserCenterView.vue 的全面重构（Store 驱动的用户资料 + 收藏列表 + 我的发布结构）
 

---

## 6. 人工调整内容

1. **删除多余功能**：确认 AI 没有生成真实登录系统、JWT Token、权限路由拦截等超出 Day5 范围的内容。

2. **优化收藏按钮交互**：在 TradeView 的收藏按钮上添加 `@click.prevent.stop`，防止点击收藏时触发 RouterLink 导航跳转。同时为已收藏状态添加 `.favorited` 样式类（红色边框 + 浅红底）。

3. **UserCenterView 结构调整**：保留 Day4 已有的优秀视觉设计（渐变背景头像卡片、统计数字行、菜单列表），将硬编码数据替换为 Store 数据源。将原本混在一起的"菜单 + 收藏"布局拆分为独立的"我的收藏"面板（直接展示收藏列表）和"功能菜单"面板。

4. **FavoriteItem 接口扩展**：AI 初始的 FavoriteItem 只包含基础字段，手动补充了 `image`、`price`、`location` 字段，使收藏数据更完整，后续可在个人中心中展示更丰富的信息。

5. **统计数字联动**：将 stats 从固定 `ref` 改为 `computed`，使"收藏"统计数字随 favoriteStore 实时更新。

6. **保留已有功能**：MessageView 的聊天界面功能完整（会话列表、消息气泡、输入框），无需修改。

---

## 7. 测试记录


**测试流程**：
1. 访问 `/user` → 个人中心显示 Store 中的用户资料（姓名"校园用户"、学院"计算机学院"、简介） 
2. 导航栏显示"校园用户"名称 
3. 访问 `/trade` → 浏览商品列表，每个卡片显示"🤍 收藏"按钮 
4. 点击"数据结构"的收藏按钮 → 按钮变为"❤️ 已收藏"（红色边框+浅红底） 
5. 访问 `/user` → "我的收藏"面板显示"数据结构"条目（类型标签"二手交易"） 
6. 点击收藏条目的 ✕ 按钮 → 条目从收藏列表中消失 
7. 访问 `/publish` → 发布跑腿委托 → 发布成功后自动跳转到 `/errand`，数据中 publisher 为"校园用户" 
8. TypeScript 编译 0 errors 
9. 全部 7 个页面路由返回 200 

---

## 8. 遇到的问题与解决方法

### 问题 1：收藏按钮点击时触发页面跳转

**现象**：在 TradeView 中点击"收藏"按钮时，不仅触发了收藏逻辑，还触发了外层 `<RouterLink>` 的导航，跳转到了商品详情页。

**根因**：收藏按钮嵌套在 `<RouterLink>` 内部，点击事件冒泡触发了路由导航。

**解决**：在收藏按钮上使用 `@click.prevent.stop`——`.prevent` 阻止默认行为，`.stop` 阻止事件冒泡。修改后点击收藏按钮只触发收藏切换，不再跳转页面。

---

## 9. 今日反思

Pinia 状态管理是多页面前端应用从"各自为政"走向"协同工作"的关键基础设施。在 Day2-Day4 中，每个页面的数据都是独立的——列表页请求自己的数据，发布页提交自己的数据，彼此之间没有关联。从 Day5 开始，通过 Pinia 把用户信息和收藏状态提升为全局状态，不同页面开始共享同一份数据：导航栏知道当前用户是谁、发布页自动使用当前用户作为发布人、列表页的收藏状态与个人中心实时同步。

Store 设计中的**状态边界**概念关键——不是所有数据都适合放入 Store。表单的临时输入、页面的搜索关键词这些"用完即弃"的局部状态，放在组件内部更合适。如果把所有状态都塞进 Store，Store 会变成难以维护的"全局大杂烩"。区分"共享状态"和"局部状态"是前端架构设计的基本能力，Day5 的实践让我对这个边界有了具体的体感。
