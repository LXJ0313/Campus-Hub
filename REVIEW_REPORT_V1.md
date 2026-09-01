# Campus Hub V1 文档与原型审查报告

## 1. 总体审查结论
**结论：当前版本存在阻塞性问题，不适合直接进入开发。**

经过对所有 Markdown 文档和墨刀原型截图的全面检查，核心目标、数据模型和技术栈的大方向是一致的。但在以下几个关键点上存在明确的冲突或遗漏，必须在开发前达成统一：

*   **V1 功能范围的冲突**
*   **报名流程的矛盾**
*   **用户身份认证缺失**
*   **原型与规范的视觉与交互不一致**

---

## 2. 详细问题列表 (按严重程度分类)

### 🚨 BLOCKER (阻塞性问题)

这些问题必须在开发前解决。

#### 2.1 V1 功能范围与文档/原型的冲突
多个文档和原型之间对 V1 包含哪些页面、排除哪些功能存在明显分歧。

*   **`DEVELOPMENT_CONSTRAINTS.md` (V1 Pages)**
    *   明确 V1 只包含：`Login`, `Home`, `Search`, `Activity Detail`, `My Page`。
    *   `Category` 和 `Bookmark` 被定义为 `My Page` 内部的子模块或状态，而非独立页面。
    *   **结论：** `Category` 和 `Bookmark` 不应作为独立路由页面开发。

*   **`PRD2.md` (信息架构 IA)**
    *   列出了 `/category` 和 `/bookmark` 作为独立路由。
    *   这与 `DEVELOPMENT_CONSTRAINTS.md` 冲突。

*   **原型截图 (`home page.png`, `search page.png`, `category page.png`, `profile page.png`)**
    *   **导航不一致**：截图中所有页面的顶部导航都包含一个 **"发布活动"** (Publish Activity) 的入口。
    *   **功能冲突**：`PRD2.md` 明确指出发布活动是"未来规划"，`DEVELOPMENT_CONSTRAINTS.md` 也严格排除了 `Activity Publishing`。原型的导航设计直接违反了这一规定。
    *   **额外页面**：原型有独立的"分类页" (`category page.png`) 和"收藏页"，这与约束文档要求的将其集成在 `My Page` 内冲突。

#### 2.2 报名流程的矛盾
`PRD2.md` 与其他文档对点击"报名"按钮后的行为描述不一致。

*   **`PRD2.md` (用户流程)**
    *   描述为：`点击报名 -> 跳转报名页面 -> 完成报名`。
    *   这意味着 V1 可能需要一个独立的"报名表单"流程，或者跳转到外部链接。

*   **`User flow2.md`, `Interaction Spec.md`, `Demo Data State Rules.md`**
    *   描述为：`点击"立即报名" -> 系统模拟成功 -> 按钮变为"已报名" -> "我的报名"列表增加该活动`。
    *   这是一个在当前页面即可完成的即时操作，没有跳转。

*   **`DATA_SCHEMA.md`**
    *   数据模型中有 `registration_url` 字段，暗示可能存在外部报名链接。
    *   但该字段的使用场景（内部还是外部）未明确界定。

#### 2.3 用户身份认证 (Authentication) 未定义
所有文档都提到了"用户"和"当前用户"，但如何识别用户身份完全没有规范。

*   **问题：**
    *   V1 是否需要登录功能？`DEVELOPMENT_CONSTRAINTS.md` 将 `Login` 列为 V1 页面，但没有任何关于登录方式（如邮箱、学号、第三方登录）的描述。
    *   如何获取 `user_id`？这是实现 `Favorite` 和 `Registration` 功能的前提。
    *   原型中显示了用户名和头像，但没有展示登录/注册流程。

---

### ⚠️ IMPORTANT (重要问题)

这些问题不阻塞开发，但需要在开发前达成共识以避免返工。

#### 2.4 墨刀原型与文档的视觉/交互不一致
*   **原型的信息更丰富**：
    *   `activity detail template page.png` 中的活动详情页包含：进度条、倒计时、嘉宾介绍、活动流程时间线。
    *   这些元素在 `WIREFRAME.md` (线框图) 和 `DATA_SCHEMA.md` 中都没有定义。例如，`DATA_SCHEMA.md` 中没有 `guests` 或 `agenda` (日程) 字段。
*   **原型的导航有"我的收藏"**：
    *   在 `search page.png` 等截图中，导航栏有"我的收藏"入口。
    *   `DEVELOPMENT_CONSTRAINTS.md` 规定收藏入口应在 `My Page` 内部。
*   **`profile page.png` 包含"最近浏览"**：
    *   个人页面截图中的 Tab 有 `已报名`、`最近浏览`、`我的收藏`。
    *   "最近浏览"功能未在任何 Markdown 文档中定义，属于额外功能。

#### 2.5 `AI 整理` (AI Structuring) 功能
*   **`Interaction Spec.md`** 的第 8 章包含一个微交互规范：
    *   `AI Structuring`: `Click AI整理 -> Show generated structured information`
*   **问题：**
    *   这个按钮在哪里？活动详情页的线框图和原型中都没有看到这个按钮。
    *   这似乎是一个未完成的想法，或者被整合到了 `AI 摘要` 功能中。

---

### 💡 MINOR (次要问题/建议)

#### 2.6 `DATA_SCHEMA.md` 章节编号重复
*   文档中 `#13. Demo Data Rules` 出现了两次，`#19. Data Flow` 和 `#19. Search Data` 编号重复。
*   这可能会给阅读带来困惑，建议修正。

#### 2.7 `Demo Data State Rules.md` 过于简略
*   该文档非常简短，只定义了基本的 `True/False` 状态转换。
*   缺少对 **取消收藏**、**用户初始状态** (如何确保 Demo Activity 不默认出现在"我的收藏"中) 的描述。
*   `DATA_SCHEMA.md` 和 `Interaction Spec.md` 对这部分有更详细的定义，建议以这两份文档为准。

---

## 3. 核心功能与数据模型检查

*   **Activity Detail 是否通过 `activity_id` 区分？**
    *   **✅ 检查通过。** 所有文档都强调使用唯一的 `activity_id` 来加载和区分不同的活动页面，使用统一的 `ActivityDetail` 模板。

*   **Favorite 和 Registration 是否属于用户？**
    *   **✅ 检查通过。** 数据模型正确地将这两个功能定义为 `User` 和 `Activity` 之间的关系，通过 `user_id` 和 `activity_id` 关联。这确保了状态是针对特定用户的，而不是活动的全局属性。

*   **My Page 是否读取当前用户的数据？**
    *   **✅ 检查通过。** 文档明确 `My Favorites` 和 `My Registrations` 必须由当前用户的关系记录（`Favorite` 和 `Registration`）计算得出，而不是硬编码的 Demo 数据。

*   **AI Search 是否从真实活动数据中返回结果？**
    *   **✅ 检查通过。** `TECHNICAL_DESIGN.md` 明确规定 LLM 的作用是将自然语言转化为搜索参数，而数据库是活动数据的唯一真实来源。AI 不会创造虚假活动。

*   **V1 是否排除了 Activity Publishing？**
    *   **✅ 检查通过 (大部分文档)。** `USER_FLOW.md`, `DEVELOPMENT_CONSTRAINTS.md`, `TECHNICAL_DESIGN.md` 等都明确排除了发布活动功能。**但是，`PRD2.md` 和墨刀原型中包含了此功能**，这是一个主要的冲突点（见 2.1 节）。

---

## 4. 第一阶段开发计划建议

在开始正式编码前，建议先进行以下步骤来达成共识：

**Phase 0: 规范修订与对齐 (当前阶段)**

1.  **修订文档**：
    *   以 `DEVELOPMENT_CONSTRAINTS.md` 为准，明确 V1 的页面范围：
        *   移除 `PRD2.md` 中的独立 `/category` 和 `/bookmark` 路由。
        *   明确 `Category` (分类) 是 `Home` 页面内的筛选功能，`Bookmark` (收藏) 是 `My Page` 的一部分。
    *   关于"发布活动"：
        *   **决定**：从 V1 中彻底移除。
        *   **行动**：将墨刀原型中的"发布活动"导航入口视为未来设计，在 V1 原型中不实现它。
    *   关于"报名"流程：
        *   **决定**：采用 `User flow2.md` 和 `Interaction Spec.md` 描述的**即时报名**流程。
        *   **行动**：修改 `PRD2.md`，移除"跳转报名页面"的描述。`registration_url` 字段在 V1 中作为可选外部链接备用，但默认流程为站内即时变更状态。
    *   关于"用户身份"：
        *   **决定**：V1 采用简单的 Mock 登录方案，或直接假定一个已登录的测试用户。
        *   **行动**：在 `TECHNICAL_DESIGN.md` 或新建文档中补充认证方案。例如：V1 前端使用 `localStorage` 存储一个固定的 `user_id` (`user_001`) 来模拟登录状态，不开发真实的登录/注册功能。

2.  **原型调整**：
    *   在墨刀原型中移除"发布活动"入口。
    *   将独立的"收藏页"内容整合到"我的"页面中。
    *   评估是否保留"最近浏览"功能，若保留则需补充到数据模型中。
