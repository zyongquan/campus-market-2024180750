# Day4 Evidence - 发布表单与数据新增

## 日期：2026-06-30   学号：2024180750

---

## 1. 今日完成内容

**发布表单设计**：基于 Day3 已完成的 Mock 数据和列表渲染，在 `PublishView.vue` 中实现了支持 5 种发布类型（二手商品、寻物启事、失物招领、拼单搭子、跑腿委托）的动态表单。选择不同类型时，表单字段自动切换——二手交易显示分类/成色/售价/原价，跑腿委托显示任务类型/报酬/取送地点/紧急程度。

**表单项组件封装**：创建了 `FormField.vue` 通用表单项组件，统一管理标签、必填标识（红色星号）和错误提示，所有表单字段均通过该组件渲染，保持页面结构清晰、样式一致。

**表单校验实现**：为每种发布类型编写了针对性的校验规则——通用必填项（标题、描述、地点）、二手交易（分类/价格>0/成色）、失物招领（物品名称/发生时间）、拼单搭子（类型/目标人数≥2）、跑腿委托（任务类型/酬劳≥0/取送地点）。校验失败时在对应字段下方显示红色错误提示，校验通过才允许提交。

**数据提交与页面联动**：使用 Axios 向 JSON Server 发送 POST 请求，四类数据分别写入 `trades`、`lostFounds`、`groupBuys`、`errands` 集合。提交成功后弹出提示并自动跳转到对应列表页，用户可以立即看到新增的数据。切换发布类型时自动重置表单，避免字段残留。


---

## 2. 发布类型与字段设计

| 发布类型 | 对应集合 | 关键字段 | 设计理由 |
|---|---|---|---|
| 二手交易 | trades | title、category、price、originalPrice、condition、location、description | 分类帮助买家筛选；售价和原价对比体现实惠程度；成色是二手交易的核心决策因素 |
| 寻物/招领 | lostFounds | title、type(lost/found)、itemName、eventTime、contact、location、description | type 区分寻物和招领两种相反场景；itemName 精确描述物品；eventTime 是找回概率的关键信息 |
| 拼单搭子 | groupBuys | title、type(group/partner/team)、targetCount、deadline、location、description | targetCount 和 currentCount 构成进度系统；type 区分拼单/搭子/组队三种子场景；deadline 给出时间约束 |
| 跑腿委托 | errands | title、taskType、reward、from、to、deadline、urgency、description | from→to 组成路线信息；reward 是接单动力；urgency 区分紧急程度；taskType 区分代取/代购/排队等 |


---

## 3. 表单校验规则

| 校验项 | 适用类型 | 规则 | 原因 |
|---|---|---|---|
| 标题 | 全部 | 不能为空 | 列表页的首要展示内容，无标题无法识别 |
| 描述 | 全部 | 不能为空 | 买家/接单人需要了解详细信息 |
| 地点 | 全部 | 不能为空 | 校园交易的核心约束——位置决定交易是否方便 |
| 商品分类 | 二手交易 | 必须选择 | 支持分类筛选和浏览 |
| 售价 | 二手交易 | 必须 > 0 | 免费赠送不属于二手交易范畴 |
| 成色 | 二手交易 | 必须选择 | 二手商品新旧程度直接影响交易决策 |
| 物品名称 | 失物招领 | 不能为空 | 拾到者/失主需要精确描述物品 |
| 发生时间 | 失物招领 | 必须选择 | 时间越近找回可能性越大 |
| 拼单类型 | 拼单搭子 | 必须选择 | 拼单/搭子/组队的参与模式完全不同 |
| 目标人数 | 拼单搭子 | 必须 ≥ 2 | 至少 2 人才算"拼" |
| 任务类型 | 跑腿委托 | 必须选择 | 代取/代购/排队等任务要求差异大 |
| 酬劳 | 跑腿委托 | 必须 ≥ 0 | 可以免费帮忙，但不能填负数 |
| 取件地点 | 跑腿委托 | 不能为空 | 接单人需要知道从哪里取 |
| 送达地点 | 跑腿委托 | 不能为空 | 接单人需要知道送到哪里 |

校验函数 `validateForm()` 在提交前执行，通过 `errors` 响应式对象记录每个字段的错误信息，`FormField` 组件自动渲染对应错误提示。用户修正错误后错误提示自动消失。

---

## 4. AI 协作记录

**使用工具**：Claude Code（VS Code 扩展）

**核心提示词**：

1. 创建 FormField.vue 通用表单项组件
2. 重构 PublishView.vue：集成 FormField、添加 per-field 校验错误提示、改用 `<form @submit.prevent>` 正确表单提交、提交成功后跳转到列表页、切换类型时重置表单
3. 为 API 模块添加 createXxx 别名函数
4. 保持已有的类型选择器、emoji 图标选择器和样式

**AI 生成内容**：
- `FormField.vue` 组件（标签、必填标识、错误提示、插槽）
- `PublishView.vue` 完整重构（表单结构、校验逻辑、提交逻辑、类型切换重置）
- 四个 API 模块的 `createXxx` 别名导出
- 样式适配（FormField 集成后的布局调整）

**AI 生成内容审查**：
- 字段设计贴合校园业务场景 
- 校验规则覆盖必要字段 
- POST 路径与 db.json 集合名称一致 
- 切换类型时自动重置避免字段残留 
- 提交后跳转到对应列表页 

---

## 5. 人工调整内容

1. **保留已有优质功能**：Day3 已完成的 emoji 选择器、类型选择卡片、分类选项配置（tradeCategories、lostFoundCategories 等）、双列表单项布局在重构中全部保留，只做了 FormField 包装。

2. **优化校验逻辑**：AI 初始代码遗漏了"地点"字段的必填校验，手动补充。同时确认所有校验规则与 db.json 字段名一致，避免因字段名不匹配导致校验失效。

3. **修正 PowerShell 编码问题**：在命令行测试 POST 时发现 PowerShell 5.1 的 `ConvertTo-Json` 配合 `Out-File -Encoding UTF8` 会写入 UTF-8 BOM 头，导致 json-server 解析 JSON 失败（`SyntaxError: Unexpected token '﻿'`）。手动用 .NET UTF8Encoding 无 BOM 方式重写文件解决。

4. **清理测试脏数据**：PowerShell POST 测试产生的 4 条乱码数据（中文全部变成 `?`）已从 `db.json` 中清理。

5. **调整 publisher 默认值**：将发布人默认值从"我"改为"校园用户"，更符合未登录状态下的占位语义。

---

## 6. 测试记录


**发布流程测试**：
1. 访问 `/publish` → 默认选中"二手商品"类型
2. 切换到"跑腿委托" → 表单字段切换为跑腿专属字段（任务类型、报酬、取送地点），之前填写的二手商品字段被清空
3. 点击"发布信息"（未填写任何内容）→ 标题/描述/地点/任务类型/取件/送达均显示红色错误提示
4. 填写完整信息后点击"发布信息" → 按钮变为"提交中..."且禁用，随后弹出"跑腿委托发布成功！"，自动跳转到 `/errand`
5. 在跑腿委托列表页底部看到新增数据 

---

## 7. 遇到的问题与解决方法

### 问题 1：json-server 无法解析 UTF-8 BOM 文件

**现象**：json-server 启动时报错 `SyntaxError: Unexpected token '﻿'`，服务无法启动。

**根因**：用 PowerShell 5.1 的 `Out-File -Encoding UTF8` 写入 `db.json` 时，文件头部被自动添加了 UTF-8 BOM（三个字节 `EF BB BF`），json-server 的 JSON 解析器无法识别 BOM 头。

**解决**：使用 .NET 的 `[System.Text.UTF8Encoding]::new($false)`（无 BOM 模式）配合 `[System.IO.File]::WriteAllText()` 重写文件。验证 BOM 已移除后，json-server 正常启动。

### 问题 2：PowerShell POST 中文乱码

**现象**：用 PowerShell 的 `Invoke-WebRequest` 发送带有中文字段的 POST 请求时，JSON Server 中存储的中文全部变成 `?`。

**根因**：PowerShell 5.1 的 `ConvertTo-Json` 默认使用 UTF-16 LE 编码，与 JSON 标准要求的 UTF-8 不兼容，导致中文字符在传输过程中丢失。

**解决**：浏览器前端发送的请求使用的是标准 UTF-8 编码，因此实际用户使用中不会出现此问题。命令行测试产生的 4 条乱码数据已从 `db.json` 中手动清理。

---

## 8. 今日反思

发布表单、表单校验和数据新增是 Web 应用从"只能看"到"能交互"的分水岭。没有发布功能，平台只是一个信息展示板；有了发布功能，用户才能真正参与到平台生态中。

数据新增通过 JSON Server 的 POST 接口写入 `db.json`，本质上模拟了 RESTful API 的 Create 操作。这让我理解了前后端协作的核心契约：前端不需要知道后端用什么数据库，只需要按照约定的 JSON 格式发送请求——这就是 API 封装层的价值。后续替换为真实后端时，只需修改 `src/api/` 中的函数实现，所有页面组件代码无需变动。
