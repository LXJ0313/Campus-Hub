# Campus Hub V1

校园活动中心 — 发现、报名、管理校园活动。

## 项目结构

```
Campus hub开发/
├── backend/           # Node.js + TypeScript + Express
│   ├── src/
│   │   ├── index.ts          # Express 服务器入口
│   │   ├── store.ts          # JSON 文件存储层
│   │   ├── seed.ts           # Demo 数据种子
│   │   └── routes/
│   │       ├── activities.ts    # 活动 API
│   │       ├── favorites.ts      # 收藏 API
│   │       ├── registrations.ts  # 报名 API
│   │       └── search.ts         # 搜索 API（含 AI 自然语言搜索）
│   └── data/
│       └── db.json           # 数据持久化文件
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx           # 路由配置
│   │   ├── main.tsx          # 入口
│   │   ├── api/
│   │   │   └── index.ts      # API 客户端
│   │   ├── components/
│   │   │   ├── Layout.tsx       # 页面布局
│   │   │   └── ActivityCard.tsx # 活动卡片
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # 首页
│   │   │   ├── SearchPage.tsx        # 搜索页
│   │   │   ├── ActivityDetailPage.tsx # 活动详情
│   │   │   └── MyPage.tsx            # 我的页面
│   │   ├── types/
│   │   │   └── index.ts      # 类型定义
│   │   └── styles/
│   │       └── index.css     # 全局样式
│   └── index.html
└── data/              # （根目录数据）
```

## 快速开始

### 前置要求

- Node.js >= 16
- npm

### 1. 安装后端依赖并启动

```bash
cd backend
npm install
npm run dev
```

后端服务运行在 http://localhost:3001

### 2. 安装前端依赖并启动

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:5173

### 3. 初始化数据（如需重置）

```bash
cd backend
npx ts-node src/seed.ts
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/activities` | 获取活动列表（支持 `?category=` 过滤） |
| GET | `/api/activities/:id` | 获取活动详情 |
| POST | `/api/favorites` | 收藏活动 `{ activity_id }` |
| DELETE | `/api/favorites/:id` | 取消收藏 |
| GET | `/api/favorites` | 获取收藏列表 |
| POST | `/api/registrations` | 报名活动 `{ activity_id }` |
| DELETE | `/api/registrations/:id` | 取消报名 |
| GET | `/api/registrations` | 获取报名列表 |
| GET | `/api/search?q=&category=` | 关键词搜索 |
| POST | `/api/search/ai` | AI 自然语言搜索 `{ query }` |

## Demo User

- 用户 ID: `user_001`（固定 Mock User，无需登录）

## Demo Activity

- 标题：AI大模型前沿讲座：从理论到产业实践
- ID: `activity_ai_001`
- 默认状态：未收藏、未报名

## 核心流程

```
首页 → 活动详情 → 报名/收藏 → 我的页面（查看已报名/已收藏）
```
