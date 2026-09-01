# Campus Hub V1 Freeze 基线记录

> 冻结日期：2026-08-28
> 状态：**V1 正式基线版本（Frozen Baseline）**

---

## 一、V1 已完成的核心功能

### 前端（React + TypeScript + Vite）

| 功能 | 说明 |
|---|---|
| 首页（/） | 搜索入口（跳转 /search）+ 推荐活动列表（默认加载全部 Demo Activities，含封面图） |
| 搜索页（/search） | AI 搜索按钮（唯一搜索入口）、Category Filter（独立浏览/筛选）、搜索+分类 AND 组合、无结果空状态（无 fallback） |
| AI Natural Language Search | 简单关键词与自然语言统一走 AI Search；多 token 之间 AND 逻辑；同 token 跨字段（title/description/tags/target_audience）OR 匹配 |
| Category Filter | 精确匹配（非模糊）；可独立使用；与搜索词组合时 AND |
| 活动详情页 | 按 activity_id 获取活动完整信息、封面图、收藏/报名按钮及状态反馈 |
| 收藏（Favorite） | user_001 + activity_id 关系持久化到 PostgreSQL，My Page 正确反映 |
| 报名（Registration） | user_001 + activity_id 关系持久化到 PostgreSQL，status='registered'，My Page 正确反映 |
| 我的页面（/my） | 个人信息（中文文案 + 默认头像）、我的收藏/我的报名两个 Tab |
| 活动封面图 | 6 条 Demo Activity 各有统一风格 SVG 封面（frontend/public/images/） |

### 后端（Node.js + Express + TypeScript）

| API | 说明 |
|---|---|
| GET /api/activities | 活动列表（支持 ?category= 精确过滤），附带 is_favorite / is_registered |
| GET /api/activities/:activityId | 活动详情 |
| GET /api/search | 关键词搜索（保留能力，UI 未直接调用） |
| POST /api/search/ai | AI 自然语言搜索（token 提取 + 可选 category，AND 组合） |
| GET/POST/DELETE /api/favorites | 收藏关系 CRUD（UNIQUE 约束防重复） |
| GET/POST/DELETE /api/registrations | 报名关系 CRUD（status='registered'） |
| GET /api/health | 健康检查（含数据库连接与数据计数） |

### 数据库（Supabase PostgreSQL）

- 4 张表：users / activities / favorites / registrations
- favorites、registrations 带 UNIQUE(user_id, activity_id) 约束与外键
- registrations.status CHECK ('registered')
- Demo Data：1 个用户（user_001）+ 6 条活动（初始无收藏、无报名）
- tags / target_audience 使用 TEXT[]（API 层序列化为逗号字符串）

---

## 二、技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + React Router |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | Supabase PostgreSQL（pg 连接池 + SSL） |
| 数据访问 | backend/src/store.ts（异步 SQL repository） |
| 环境配置 | backend/.env（DATABASE_URL，已 gitignore） |

---

## 三、已验证通过的主要用户流程

1. 首页 → 显示 6 条推荐活动（含封面图）
2. 首页搜索框点击 → 跳转 /search
3. /search 默认「全部」→ 显示 6 条活动
4. 点击 Category（Lecture/Career/Sports/Volunteer/Competition/Culture）→ 精确显示该分类活动
5. AI 搜索「AI / 篮球 / 产品经理」→ 正确返回匹配活动
6. AI 自然语言「适合研究生参加的 AI 活动」→ 1 条（AND 语义）
7. 搜索 + Category 组合 → AND 逻辑（如「篮球」+ Career → 0 条）
8. 搜索不存在的关键词 → 空状态，无 Demo Activity fallback
9. 活动详情 → 收藏/报名 → PostgreSQL 持久化
10. My Page → 我的收藏/我的报名正确反映数据库状态
11. TypeScript 编译（前后端 tsc --noEmit）通过
12. 浏览器真实交互测试（browser automation）通过

---

## 四、已知但暂不处理的问题（V1 已知限制）

1. **AI Search token 切分精度**：中文二元组切分偶尔不够准确，可能产生噪声 token
2. **自然语言意图理解有限**：复杂语义（如「或/或者/任一」的 OR 意图）未实现，相关词已加入停用词
3. **AI Search 未接入 LLM**：当前为规则/关键词驱动的自然语言检索方案，非大语言模型 API
4. 「火星大学生羽毛球机器人比赛」这类查询曾错误命中「比赛」token 的问题已通过 AND 逻辑缓解，但 token 提取精度仍是根本限制
5. API_BASE='/api' 依赖 Vite 开发代理，生产部署需引入环境变量
6. tags 在 API 层为逗号字符串（前端兼容优先）

---

## 五、V1 Freeze 规则（重要）

**V1 Freeze 后原则上不再进行功能性修改。** 以下内容为冻结范围，禁止随意改动：

- AI Search（含 token 提取、AND/OR 逻辑、停用词表）
- 自然语言检索逻辑
- 搜索结果匹配逻辑
- Category Filter（精确匹配逻辑）
- 搜索 + Category 组合筛选
- 首页 / 活动详情 / 收藏 / 报名 / 我的页面
- 数据库 Schema 与 Demo Data

### 后续需求处理规则

- 若提出新功能或优化需求 → 先声明为「**V2 功能/优化**」，不直接修改 V1 基线
- 只有明确说明「修改 V1」时，才允许变更 V1 基线（并应更新本文档）
- V2 开发应基于 V1 基线拉新分支或新目录，保持 V1 可回溯

### 部署前注意事项

- backend/.env 需包含有效的 DATABASE_URL（Supabase）
- 首次部署需执行 `npm run migrate` + `npm run seed`（backend）
- 前端生产构建需处理 API_BASE 环境变量（V1 假设同源 /api）

---

*本文件由 V1 Freeze 流程生成，作为 Campus Hub V1 的正式基线记录。*
