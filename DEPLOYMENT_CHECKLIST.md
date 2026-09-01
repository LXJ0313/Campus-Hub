# Campus Hub V1 部署前检查清单（DEPLOYMENT_CHECKLIST.md）

> 检查日期：2026-08-28
> V1 状态：Frozen（见 V1_FREEZE.md）
> 本文档只做检查记录，未修改任何代码。

---

## 一、构建/启动命令检查

### 前端（frontend/package.json）

| 项 | 值 | 状态 |
|---|---|---|
| 开发启动 | `npm run dev`（vite, port 5173） | ✅ |
| 生产构建 | `npm run build`（tsc && vite build） | ✅ 实测通过，产出 dist/ |
| 预览构建产物 | `npm run preview` | ✅（存在） |

**实测结果**：`npm run build` 成功，产出：
- dist/index.html（0.46 kB）
- dist/assets/index-*.css（8.21 kB）
- dist/assets/index-*.js（176.29 kB）

### 后端（backend/package.json）

| 项 | 值 | 状态 |
|---|---|---|
| 开发启动 | `npm run dev`（ts-node） | ✅ |
| 生产构建 | `npm run build`（tsc → dist/） | ✅ 实测通过，dist/index.js 已生成 |
| 生产启动 | `npm start`（node dist/index.js） | ✅（main: dist/index.js） |
| 种子数据 | `npm run seed` | ✅（幂等，ON CONFLICT） |
| 建表迁移 | `npm run migrate` | ✅（CREATE TABLE IF NOT EXISTS） |

---

## 二、环境变量检查

### 前端

| 项 | 当前值 | 问题 |
|---|---|---|
| API_BASE | `/api`（硬编码于 src/api/index.ts:3） | ⚠️ **[问题 #1]** 见下文 |

前端**没有任何环境变量文件**（无 .env / .env.production）。`import.meta.env` 未被使用。

### 后端

| 变量 | 用途 | 来源 | 状态 |
|---|---|---|---|
| DATABASE_URL | Supabase PostgreSQL 连接串 | backend/.env（dotenv） | ✅ 已配置且验证可连 |
| PORT | 服务端口（默认 3001） | 环境变量 | ✅ 代码已用 `process.env.PORT`，云平台注入即生效 |

backend/.env.example 存在（分离式 DB_HOST 等旧格式，与当前实际使用的 DATABASE_URL 单串格式不一致——见问题 #6）。

---

## 三、数据库连接配置

[backend/src/db.ts](backend/src/db.ts)：
- ✅ 从 `DATABASE_URL` 读取
- ✅ 自动判断：连接串含 localhost/127.0.0.1 → 不启用 SSL；否则启用 SSL（`rejectUnauthorized: false`）
- ✅ 连接池 max=5，超时 10s —— 适配 Supabase Pooler（Session mode）限制
- ✅ 实测 Supabase 连接正常

---

## 四、CORS 配置

[backend/src/index.ts:15](backend/src/index.ts#L15)：`app.use(cors())` —— **允许所有来源**。

- 对 V1 演示/作品集部署：✅ 可用（最省事）
- 严格来说属于宽松配置；V1 范围内不改，属于「部署配置问题（可选收紧）」而非业务 bug

---

## 五、.gitignore 检查

根 [.gitignore](.gitignore)：
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ `.env`
- ✅ `*.log`、`npm-cache/`、`data/db.json`、`.DS_Store`

**注意**：`.env` 被忽略，但 `.env.example` 未忽略（正常）。backend/update_images.js（一次性图片更新脚本）会被提交——无敏感信息，可接受。

⚠️ 需要人工确认一次：`git status` 中不应出现 backend/.env。若尚未初始化 git，部署前建议先 `git init` 并确认。

---

## 六、发现的问题清单

### 问题 #1：前端 API_BASE 硬编码 `/api`（部署配置问题）

- **位置**：frontend/src/api/index.ts:3
- **影响**：生产环境下前端必须与后端**同域**且后端挂在 `/api` 路径下，否则请求 404
- **说明**：这不是 bug——是当前架构假设（同源部署 + 反向代理）。三种部署形态：
  1. **同域反代**（推荐）：前端静态文件 + 后端 API 由同一域名反代（如 Vercel rewrites / Render static site / Nginx）→ **无需改代码**
  2. **前后端不同域**：必须改 API_BASE 为完整后端 URL（或引入 `import.meta.env.VITE_API_BASE`）→ 需要一次小改动
  3. 本地开发：Vite proxy 已处理 → 无问题
- **性质**：部署配置问题。方案 1 可零改动部署。

### 问题 #2：后端没有托管前端静态文件（部署配置问题）

- 后端只提供 `/api/*`，不服务前端 dist/。若想「单个服务跑全栈」，需要在 Express 加静态托管 + SPA fallback（`app.use(express.static(...))` + `app.get('*')`）。
- 若采用前后端分开部署（前端 Vercel、后端 Render），则**无需**此项。
- **性质**：部署配置问题，取决于部署形态选择。

### 问题 #3：`aiSearch` 之外的 `searchActivities` 用了 `new URL()` 相对路径（业务代码问题，但当前无影响）

- **位置**：frontend/src/api/index.ts:69（`new URL('/api/search')`）
- **影响**：在浏览器中 `new URL('/api/search')` 会抛 `Invalid URL` 异常（必须绝对 URL）。**当前 UI 不调用此函数**（V1 只用 AI 搜索），因此线上不会触发。
- **性质**：潜伏的代码缺陷，与之前修复过的 fetchActivities 同类。V1 Freeze 下建议不动；记录在案，V2 修复。

### 问题 #4：没有 vercel.json / render.yaml / Dockerfile（部署配置问题）

- 当前仓库无任何云平台部署配置文件。
- **Vercel（前端）**：零配置可部署（自动识别 Vite），但**必须添加 rewrites** 把 `/api/*` 转发到后端地址，否则 API 404。需要 vercel.json：
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://<backend-url>/api/$1" }
    ]
  }
  ```
- **Render/Railway（后端）**：
  - Build: `npm install && npm run build`
  - Start: `npm start`
  - 环境变量：`DATABASE_URL`
  - Render 免费层注意：15 分钟无访问会休眠，冷启动慢
  - Supabase Pooler（Session 5432）已适配 IPv4，云平台可直接连 ✅

### 问题 #5：首部署需手动执行 migrate + seed（部署流程问题）

- 云平台不会自动建表。首次部署后需要手动运行一次：
  ```
  DATABASE_URL=<prod-url> npm run migrate
  DATABASE_URL=<prod-url> npm run seed
  ```
- 当前 Supabase 中表和数据已存在，若继续用同一 Supabase 项目则**无需**重复执行（幂等，跑了也无害）。

### 问题 #6：.env.example 与实际变量不一致（文档问题）

- .env.example 用分离式 DB_HOST/DB_PORT/...，实际代码只读 DATABASE_URL。
- 建议更新 .env.example 为 `DATABASE_URL=postgresql://...` 格式，避免误导。属于文档级问题。

### 问题 #7：无 localhost 写死问题 ✅

- 全局搜索确认：业务代码中无硬编码 localhost（仅 vite.config.ts 的 dev proxy——只影响开发；db.ts 的 isLocal 判断——是逻辑分支不是写死地址）。
- PORT 已用环境变量。✅ 云平台可直接部署。

---

## 七、推荐部署方案（供决策，未执行）

### 方案 A：Vercel（前端）+ Render（后端）+ Supabase（数据库）— 推荐

| 组件 | 平台 | 配置 |
|---|---|---|
| 前端 | Vercel | Root Directory: `frontend`；Framework: Vite（自动）；需加 vercel.json rewrites → 后端 Render URL |
| 后端 | Render Web Service | Root Directory: `backend`；Build: `npm install && npm run build`；Start: `npm start`；Env: `DATABASE_URL` |
| 数据库 | Supabase（现有） | 无需变更 |

**所需新增文件**（均为部署配置，不改业务代码）：
1. `frontend/vercel.json`（rewrites 规则）
2. （可选）修正 `backend/.env.example`

### 方案 B：Render 全栈单服务

- 一个 Web Service 同时跑后端 + 托管前端静态文件
- 需要 Express 加静态托管（约 3 行，属部署配置代码，但触及 backend/src/index.ts——需您批准）

### 方案 C：Railway（类似 Render，国内访问可能更稳定）

- 配置同 Render：Build `npm install && npm run build`，Start `npm start`，Env `DATABASE_URL`

---

## 八、部署前最终检查（部署时逐项打勾）

- [ ] git 已初始化，`git status` 确认 backend/.env 未被跟踪
- [ ] 前端 `npm run build` 通过（✅ 本次已验证）
- [ ] 后端 `npm run build` 通过（✅ 本次已验证）
- [ ] 后端部署平台已配置 `DATABASE_URL` 环境变量
- [ ] 首次部署后执行 migrate（如用全新数据库）
- [ ] 首次部署后执行 seed（如用全新数据库）
- [ ] 访问 `https://<backend>/api/health` 确认 `status: ok`
- [ ] 前端域名访问首页，确认活动列表加载（API 同域转发生效）
- [ ] 测试完整流程：搜索 → 详情 → 收藏 → 报名 → My Page
- [ ] Vercel/Rrender 域名下确认 `/api` 转发无 CORS 报错

---

*本清单由 V1 部署准备阶段生成。所有问题均未修改代码，等待用户决策。*
