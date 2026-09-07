# Campus Hub V1
> 校园活动聚合与智能发现平台，降低校园活动的发现与参与成本。
## 项目简介
校园活动信息分散在微信公众号、院系通知、社群等渠道，用户需要在多个平台之间反复搜索和筛选。
Campus Hub 提供统一的校园活动入口，通过活动聚合、分类筛选、自然语言搜索、收藏与报名等功能，帮助用户更高效地发现和参与校园活动。
本项目完成了从需求分析、产品设计、原型验证、Vibe Coding、功能测试到线上部署的 0→1 开发闭环。
## 在线体验
**Demo:** https://campus-hub-teal.vercel.app
无需登录，使用 Mock User 即可体验。
## 核心功能
- **活动发现**：首页浏览、分类筛选、自然语言搜索
- **AI Search**：使用自然语言描述活动需求并返回匹配结果
- **活动详情**：查看活动时间、地点、主办方、标签、适合人群等信息
- **收藏 / 报名**：支持收藏、取消收藏、报名和取消报名
- **个人中心**：统一查看已收藏和已报名活动
## AI Search
V1 使用 **Rule + Token Matching** 实现自然语言活动搜索：
```text
自然语言输入
    ↓
Query 解析
    ↓
关键词 / 活动类别提取
    ↓
数据库检索
    ↓
返回匹配活动
````
例如：
```text
有哪些职业规划活动？
```
系统会识别活动相关关键词和类别，并匹配数据库中的活动。
V1 尚未接入外部 LLM。测试过程中发现规则匹配在复杂自然语言场景下存在意图理解局限，因此 V2 规划为：
```text
自然语言
    ↓
LLM 意图识别
    ↓
结构化 Query
    ↓
活动检索
```
## 技术栈
* **Frontend**：React + TypeScript + Vite
* **Backend**：Node.js + Express + TypeScript
* **Database**：PostgreSQL
* **Database Hosting**：Supabase
* **Build**：esbuild
* **Deployment**：Vercel
* **Version Control**：Git + GitHub
## 系统架构
```text
用户
 ↓
React + TypeScript + Vite
 ↓
API
 ↓
Node.js + Express
 ↓
PostgreSQL
 ↓
Supabase
```
收藏和报名等用户操作通过 API 写入 PostgreSQL，并在个人中心读取对应状态。
## 开发实践
本项目采用 Vibe Coding 辅助完成开发，并经历：
```text
需求分析
→ PRD
→ IA & Wireframe
→ Prototype
→ Vibe Coding
→ 功能测试
→ Bug 修复
→ 部署上线
```
开发过程中重点解决了：
* AI Search 多条件匹配异常
* 搜索逻辑与搜索提示词不一致
* 收藏 / 报名状态持久化与页面联动
* Vercel 后端 Express 依赖加载问题
## 项目文档
* `PRD.md`：产品需求
* `DATA_SCHEMA.md`：数据结构
* `TECHNICAL_DESIGN.md`：技术设计
* `DEVELOPMENT_CONSTRAINTS.md`：开发约束
* `DESIGN_PRINCIPLES.md`：设计原则
## 项目信息
**Project Type:** Web App / 0→1 Independent Project
**Role:** Product Design & Development
**Online Demo:** (https://campus-hub-teal.vercel.app)
```
