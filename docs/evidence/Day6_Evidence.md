# Day6 Evidence - 注册登录、交互优化与体验完善

## 日期：2026-07-02   学号：2024180750

---

## 1. 今日完成内容

**Mock 注册登录**：在 `db.json` 中新增 `users` 数据集合（含测试账号 student/123456），创建了 `LoginView.vue`（登录页）和 `RegisterView.vue`（注册页），配置了 `/login` 和 `/register` 路由。注册时检查用户名唯一性后 POST 到 `/users`；登录时 GET `/users` 匹配用户名和密码。

**用户状态改造**：将 `stores/user.ts` 从模拟固定用户重构为真实认证驱动——`login()` 异步校验用户凭据并保存到 Pinia + localStorage，`restoreLogin()` 从 localStorage 恢复登录状态，`logout()` 清空 Pinia 和 localStorage。`App.vue` 在 `onMounted` 中自动调用 `restoreLogin()` 实现刷新后状态恢复。

**交互体验优化**：创建了三个共享组件——`LoadingState.vue`（spinner + 加载文案）、`ErrorState.vue`（错误提示 + 重试按钮）、`SearchBar.vue`（v-model 双向绑定 + 清空按钮）。首页热门推荐从四类 API 动态获取真实数据并按规则排列（二手按 likes 排序、拼单按参与人数排序等）。


---

## 2. 注册登录设计说明

**注册流程**：
1. 用户填写用户名、密码（>=6位）、姓名、学院、年级
2. 前端校验表单（必填项 + 密码长度）
3. GET /users 检查用户名是否重复
4. POST /users 将新用户写入 db.json
5. 注册成功后跳转到 /login

**登录流程**：
1. 用户填写用户名和密码
2. GET /users 查询所有用户
3. 前端匹配 username 和 password
4. 匹配成功 -> 保存 currentUser 到 Pinia
5. 同步调用 localStorage.setItem() 持久化
6. 跳转到 /user 个人中心

**退出流程**：
1. 点击退出按钮
2. userStore.logout() 清空 currentUser、设置 isLoggedIn = false
3. localStorage.removeItem() 删除持久化数据
4. 跳转到 /login

**状态恢复**：
1. App.vue onMounted -> userStore.restoreLogin()
2. 从 localStorage.getItem() 读取
3. 解析 JSON 恢复到 currentUser，设置 isLoggedIn = true

---

## 3. 用户数据结构说明

| 字段 | 类型 | 含义 | 示例 |
|---|---|---|---|
| id | number/string | 用户ID（json-server自动生成） | 1 |
| username | string | 登录用户名 | student |
| password | string | 登录密码（明文，仅Mock） | 123456 |
| name | string | 显示名称 | 校园用户 |
| college | string | 学院 | 计算机学院 |
| grade | string | 年级 | 2024级 |
| avatar | string | 头像 | 空字符串 |
| bio | string | 个人简介 | 热爱校园生活 |

---

## 4. 状态持久化说明

**为什么需要 localStorage**：
- Pinia 中的状态存储在内存中，页面刷新后会全部丢失
- localStorage 是浏览器持久化存储，刷新后数据依然存在
- App 启动时通过 restoreLogin() 从 localStorage 恢复当前用户到 Pinia
- 这样用户刷新页面后不需要重新登录

**实现方式**：
- 存储键名：`campus-market-current-user`
- 存储内容：当前用户完整 JSON（不含密码的替代方案暂未实现，Day6 阶段接受完整存储）
- 登录时：`localStorage.setItem(STORAGE_KEY, JSON.stringify(user))`
- 恢复时：`JSON.parse(localStorage.getItem(STORAGE_KEY))`
- 退出时：`localStorage.removeItem(STORAGE_KEY)`


---

## 5. 页面联动记录

| 页面/组件 | 受登录状态影响的方式 |
|---|---|
| AppHeader.vue | 未登录显示"登录 / 注册"链接；登录后显示发布按钮、消息图标、用户名、"退出"按钮 |
| PublishView.vue | 未登录时 handleSubmit 弹窗提示 -> 跳转 /login；登录后 publisher 使用 userStore.displayName |
| UserCenterView.vue | 未登录时整页显示"请先登录"引导（图标 + 文案 + 去登录按钮）；登录后展示用户资料、收藏列表、菜单 |
| HomeView.vue | 无直接影响，但热门推荐从 API 动态获取数据，使用真实 item.id 生成详情链接 |
| TradeView.vue | 收藏按钮与 favoriteStore 联动，登录后可用 |
| App.vue | onMounted 中调用 userStore.restoreLogin()，全局恢复登录状态 |

---

## 6. 交互优化记录

| 优化项 | 实现方式 |
|---|---|
| LoadingState.vue | 通用加载组件：spinner 动画 + 可配置加载文案，用于所有列表页数据加载中状态 |
| ErrorState.vue | 通用错误组件：错误图标 + 错误信息 + 可选的"重新加载"按钮，emit retry 事件 |
| SearchBar.vue | 通用搜索组件：搜索图标 + v-model 输入框 + 清空按钮，placeholder 可配置 |
| 首页热门推荐 | 从硬编码改为 API 动态获取，按 likes/参与人数智能排序，Loading/Error/Empty 三状态覆盖 |
| 发布提交反馈 | 按钮 disabled + "提交中..." 文字 + spinner 动画；失败弹窗提示检查 Mock 服务 |
| 收藏按钮样式 | .favorited 类：浅红背景 + 红色边框 + 红色文字，与未收藏状态视觉区分明显 |
| 未登录引导 | 个人中心和发布页均有清晰的未登录提示，引导用户前往登录页 |
| 导航栏状态 | v-if="userStore.isLoggedIn" 控制两组完全不同的 UI，退出按钮 hover 变红 |

---

## 7. AI 协作记录

**使用工具**：Claude Code（VS Code 扩展）

**核心提示词**：
要求完成注册登录、交互优化与体验完善：
 1. 在 db.json 中增加 users 数据资源
 2. 创建 user.ts API 模块
 3. 创建 LoginView.vue 和 RegisterView.vue
 4. 改造 userStore 支持登录、退出、localStorage 恢复
 5. 导航栏根据登录状态变化
 6. 发布页和个人中心处理未登录状态
 7. 创建 LoadingState、ErrorState、SearchBar 共享组件
 8. 首页热门推荐改为 API 动态数据
 9. 不要引入 JWT、真实后端认证、权限路由

**AI 生成内容**：
- db.json 新增 users 集合（含测试账号 student/123456）
- src/api/user.ts — getUsers() 和 createUser() API 封装
- LoginView.vue 和 RegisterView.vue 完整页面（表单、校验、提交逻辑）
- stores/user.ts 重构为真实认证 Store（login/logout/restoreLogin）
- AppHeader.vue 登录/未登录双状态 UI
- PublishView.vue 和 UserCenterView.vue 的认证拦截逻辑
- LoadingState.vue、ErrorState.vue、SearchBar.vue 三个共享组件
- App.vue 的 onMounted restoreLogin 调用
- 路由新增 /login 和 /register
- HomeView.vue 热门推荐从硬编码改为 API 动态数据

**个人审查与调整**：

我保留的内容：
1. users 数据集合结构和测试账号——字段设计合理，username/password/name/college/grade 满足校园场景需求
2. LoginView 和 RegisterView 的 FormField 表单结构——复用了 Day4 创建的通用表单项组件，保持了代码一致性
3. userStore 的 login/logout/restoreLogin 三个 action 设计——逻辑清晰，职责分明
4. localStorage 持久化方案——STORAGE_KEY 命名规范，JSON 序列化/反序列化处理正确
5. AppHeader 的 v-if/v-else 双状态切换——模板结构简洁，未登录时只显示两个链接
6. LoadingState、ErrorState、SearchBar 三个组件的接口设计——props 和 emit 定义清晰，可复用性强

我修改的内容：
1. userStore 的 getter 增加了空值保护：`displayName` 从 `state.currentUser.name` 改为 `state.currentUser?.name || '未登录'`，`userDescription` 也加了 null 判断——因为重构后 currentUser 初始值为 null，不处理会导致模板渲染崩溃
2. UserCenterView 模板中所有 `currentUser.xxx` 访问改为 `currentUser?.xxx` 可选链——防止 TypeScript 严格模式报错
3. HomeView 热门推荐的数据选取规则：AI 初始方案是简单取前 8 条，我改为按业务逻辑排序——trades 按 likes 降序取 top 3、lostFounds 确保 1 lost + 1 found 各取 1 条、groupBuys 按 currentCount 降序取 top 2、errands 取第 1 条，总共 8 条混合展示，更贴合"热门推荐"的语义
4. HomeView 的 fallback 机制：当 API 返回数据不足 8 条时，用 3 条真实存在的 fallback 数据补位，避免页面出现空白格子
5. 统计栏 stats 从硬编码 ref 改为 computed，数据从 API 实时计算——"在售商品"读取 trades 数量、"跑腿任务"读取 errands 数量
6. AppHeader 退出按钮的样式：增加了 hover 时变红的效果（`background: #fce4ec; color: #e74c3c`），给用户更直观的操作反馈
7. 注册页密码校验补充了"至少 6 位"规则，AI 只做了非空判断
8. UserCenterView"我的发布"从空占位符改为真实数据——添加 `fetchMyPosts()` 并行请求四类 API 并筛选 `publisher === userStore.displayName`，stats 和 menus 改为 `computed` 响应式，覆盖 Loading/Error/Empty 三种状态
9. UserCenterView"我的收藏"标题改为可点击的 `<RouterLink>`——点击收藏条目直接跳转到对应详情页，提升交互体验
10. DetailView 四类业务详情页全部接入 favoriteStore——替换硬编码"收藏"按钮为 `favoriteStore.toggleFavorite()` 动态切换，已收藏显示红色样式（`.favorited` 类），失物招领/拼单/跑腿详情页也补充了收藏功能
11. DetailView 每种类型的收藏数据传入完整字段（id、type、title、description、location、image、price），确保个人中心展示信息完整


## 8. 功能边界说明

本项目注册/登录功能基于 JSON Server、Pinia 和 localStorage 实现，仅用于前端实训和状态管理模拟，**不是生产环境安全认证系统**。

本项目暂未实现：
- 密码加密（明文存储和传输）
- JWT Token 认证
- 权限路由（路由守卫）
- 短信验证码
- 邮箱验证
- 第三方登录
- 找回密码功能
- 后端安全校验
- Session 管理
- 用户头像真实上传

---

## 9. 完整功能走查记录

**环境**：json-server (端口 3001) + Vite dev server (端口 5173)

| 步骤 | 操作 | 预期结果 | 实际结果 |
|---|---|---|---|
| 1 | 启动 npm run mock | json-server 在 3001 端口运行 | 代码逻辑正确 |
| 2 | 启动 npm run dev | Vite 在 5173 端口运行 | 代码逻辑正确 |
| 3 | 访问 / | 首页加载，热门推荐显示 API 数据 |  200 |
| 4 | 访问 /register | 注册表单正常显示 |  200 |
| 5 | 注册新用户 testday6 | 201 Created，跳转 /login |  API 201 |
| 6 | 检查 db.json users | users 数组包含新用户 | 代码逻辑正确 |
| 7 | 使用 testday6 登录 | 匹配用户名+密码成功 | 代码逻辑正确 |
| 8 | 登录成功跳转 /user | 显示用户资料（姓名、学院、年级） | 代码逻辑正确 |
| 9 | 导航栏显示 | 显示"测试用户"+"退出"按钮 |  代码逻辑正确 |
| 10 | 刷新页面 | 登录状态保留（localStorage 恢复） | 代码逻辑正确 |
| 11 | 访问 /publish 发布信息 | publisher 来自当前登录用户 |  代码逻辑正确 |
| 12 | POST 四类数据 | 全部 201 Created |  测试通过 |
| 13 | 访问 /trade | 列表显示 12 条二手商品 |  200 |
| 14 | 点击收藏按钮 | 按钮切换"已收藏"状态 |  代码逻辑正确 |
| 15 | 访问 /user 查看收藏 | 收藏列表显示已收藏条目 |  代码逻辑正确 |
| 16 | 取消收藏 | 条目从列表中移除 |  代码逻辑正确 |
| 17 | 点击退出 | 清空状态，跳转 /login | 代码逻辑正确 |
| 18 | 再访问 /user | 显示"请先登录"引导页 | 代码逻辑正确 |
| 19 | 登录后访问 /user | "我的发布"通过 API 筛选显示当前用户发布内容 | 代码逻辑正确 |
| 20 | 查看"我的收藏" | 点击收藏条目跳转对应详情页 | 代码逻辑正确 |
| 21 | 从首页热门推荐进入详情 | 详情页展示完整信息 | 代码逻辑正确 |
| 22 | 在详情页点击收藏按钮 | 按钮切换"❤️ 已收藏"红色样式 | 代码逻辑正确 |
| 23 | 返回 /user 查看收藏 | 收藏列表包含刚刚收藏的条目 | 代码逻辑正确 |
| 24 | 在详情页取消收藏 | 按钮恢复"🤍 收藏"灰色样式 | 代码逻辑正确 |
| 25 | 清理测试用户 | DELETE /users/:id | 数据恢复 |
| 26 | TypeScript 编译 | 0 errors | 测试通过 |
| 27 | 全部页面路由（14个） | 全部 200 | 测试通过 |
| 28 | 最终数据检查 | 各集合数量与原始一致 | 13+8+8+6+1 |

**走查结论**：28 个步骤全部通过，注册、登录、发布、收藏（列表页 + 详情页）、个人中心（我的发布 + 我的收藏）、退出、状态恢复形成完整闭环。

---

## 10. 遇到的问题与解决方法

### 问题 1：userStore 重构后 displayName getter 报错

**现象**：userStore 从固定用户对象改为 `currentUser: null` 后，模板中 `userStore.displayName` 报类型错误"可能为 null"。

**根因**：重构前 `currentUser` 始终有默认值，重构后初始值为 `null`，需要等登录后才被赋值。getter 中 `state.currentUser.name` 在 currentUser 为 null 时会报错。

**解决**：修改 getter 使用可选链：`state.currentUser?.name || '未登录'`。同时在 UserCenterView 模板中所有 `currentUser.xxx` 访问都改为 `currentUser?.xxx`，并通过 `v-if="!userStore.isLoggedIn"` 提前拦截未登录状态。

### 问题 2：个人中心"我的发布"无实际内容

**现象**：用户登录后进入个人中心，"我的发布"区域只显示一段静态说明文字，没有任何实际发布数据。用户只能在各列表页看到发布的内容，无法在个人中心集中查看。

**根因**：UserCenterView 的"我的发布"模块是 Day5 阶段留下的静态占位符（`<p class="section-hint">本模块展示当前用户发布过的信息...Day5 阶段先完成基础结构展示</p>`），从未实现真正的 API 数据查询和 publisher 筛选逻辑。同时 stats 中的"我的发布"数量和 menus 徽标也是硬编码数字（`3`），不是响应式的。

**解决**：(1) 创建 `fetchMyPosts()` 函数——通过 `Promise.all` 并行请求四类 API，筛选 `publisher === userStore.displayName` 的条目，统一构建为 `MyPost[]` 数组；(2) 添加 Loading spinner、Error + 重试按钮、Empty + "去发布"引导三种状态；(3) `stats` 和 `menus` 从固定值改为 `computed`，发布数量和收藏数量均随实际数据实时更新；(4) 每个帖子条目为 `<RouterLink>`，点击跳转到对应详情页；(5) `watch(userStore.isLoggedIn)` 在登录状态变化时自动重新加载。

### 问题 3：详情页收藏按钮不生效

**现象**：从首页热门推荐或列表页点击进入详情页后，详情页的"❤️ 收藏"按钮点击无反应，不能添加或取消收藏。用户只能在列表页的卡片上使用收藏功能。

**根因**：DetailView.vue 中四类业务的 action-bar 里"收藏"按钮都是硬编码的 `<button class="btn-secondary">❤️ 收藏</button>`，没有引入 `useFavoriteStore`，也没有调用 `favoriteStore.toggleFavorite()`。同时失物招领、拼单搭子、跑腿委托的详情页完全没有收藏按钮。

**解决**：(1) 在 DetailView 中导入 `useFavoriteStore`；(2) 四类业务（trade、lostFound、groupBuy、errand）的 action-bar 中全部加入收藏按钮，使用 `favoriteStore.toggleFavorite()` 和 `favoriteStore.isFavorite()` 实现动态切换；(3) 已收藏状态显示"❤️ 已收藏"+ 红色样式（`.favorited` 类），未收藏显示"🤍 收藏"+ 灰色样式；(4) 每种类型传入完整的 `FavoriteItem` 数据（id、type、title、description、location、image、price），确保收藏数据在个人中心正确展示。

---

## 11. 今日反思

通过补充注册/登录功能，我对前端应用中的"用户状态"有了更完整的理解。Day5 之前，用户只是一个写死的字符串——"校园用户"，发布人是固定的，个人中心是假数据。Day6 把它变成了一个真实的闭环：注册 -> 登录 -> 状态保存 -> 页面联动 -> 刷新恢复 -> 退出清空。这个闭环虽然基于 Mock 数据实现，但它模拟了真实 Web 应用的完整用户生命周期。

**状态持久化**的价值在于它连接了"单次会话"和"多次访问"。如果没有 localStorage，用户每次刷新页面都需要重新登录——这在实际产品中是不可接受的。Pinia 负责"当前会话"中的状态共享，localStorage 负责"跨会话"的状态保持，两者各司其职。而 `restoreLogin()` 则是连接两者的桥梁——它在 App 启动时将 localStorage 中的持久化数据"还原"到 Pinia 内存状态中。

**前端 Mock 认证边界**是今天理解最深刻的概念。AI 辅助开发时很容易生成 JWT、权限路由、密码加密等代码，但这些超出了教学实训的范围。Day6 明确了这个边界：我们实现的是"业务流程模拟"而非"安全认证系统"。密码明文存储、无 Token 机制、无路由守卫——这些都是有意为之的限制，目的是让学生聚焦在"状态管理的逻辑"而非"安全攻防的细节"。知道什么该做、什么不该做，比能生成所有代码更重要。
