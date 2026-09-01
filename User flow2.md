# Campus Hub User Flow V1

**Product:** Campus Hub
**Version:** V1.0 MVP
**Purpose:** Define the core user journeys and interaction paths of the Campus Hub V1 prototype.

---

# 1. V1 Product Goal

Campus Hub is a unified campus activity aggregation platform.

The V1 MVP focuses on solving the core user problem:

> Help university students and faculty discover, search, and participate in campus activities efficiently.

The core user journey is:

```text
Discover Activity
        ↓
View Activity Details
        ↓
Register / Favorite
        ↓
Manage Personal Activities
```

---

# 2. V1 User Roles

## Primary User: Activity Participant

University students and faculty.

Main needs:

* Discover campus activities
* Search for specific activities
* Filter activities
* View activity details
* Register for activities
* Favorite activities
* Manage registered and favorited activities

---

## Future User: Activity Organizer

Universities, colleges, student organizations, and activity organizers.

The organizer-side activity publishing function is **not included in V1 MVP**.

It is planned as a future feature.

---

# 3. V1 User Flow Overview

Campus Hub V1 contains three core User Flows:

```text
Flow 1
Discover Activity → View Details → Register


Flow 2
Search Activity → Search Results → View Details


Flow 3
Personal Center → My Favorites / My Registrations
```

---

# 4. Flow 1 — Discover Activity and Register

## User Goal

The user discovers an interesting campus activity from the Home page and registers for it.

## Flow

```text
Home
↓
Activity Detail
↓
点击「立即报名」
↓
按钮变为「已报名」
↓
Registration State = true
↓
My Page → 我的报名
```

---

## Step 1: Home

The user enters the Campus Hub Home page.

The Home page displays multiple campus activity cards.

Each activity card contains basic information such as:

* Activity title
* Category
* Date / Time
* Location
* Organizer

### User Action

The user clicks an activity card.

### System Response

Navigate to:

`Activity Detail Template`

---

## Step 2: Activity Detail

The Activity Detail Template displays:

* Activity title
* Category
* AI-generated summary
* Activity time
* Location
* Organizer
* Activity description
* Registration information
* Favorite button
* Registration button

### Demo Activity

The primary interactive Demo Activity is:

**《AI大模型前沿讲座：从理论到产业实践》**

Only this Demo Activity needs to demonstrate the complete interactive behavior in the prototype.

Other activity cards can remain display-only.

---

## Step 3: 报名

### User Action

The user clicks:

`立即报名`

### System Response

The system simulates a successful registration.

The registration state changes:

```text
Not Registered
      ↓
Registered
```
Then the Registration State = true

The button changes:

```text
立即报名
      ↓
已报名
```

A success feedback is displayed.

Example:

`报名成功`

---

## Step 4: My page

After registration, the activity should become visible in:

`My Page → 我的报名`

The activity card displays:

**《AI大模型前沿讲座：从理论到产业实践》**

Status:

`已报名`

### Important State Rule

The activity must NOT appear in "我的报名" before the user registers.

---

# 5. Flow 2 — Search Activity

## User Goal

The user wants to quickly find a specific type of campus activity.

## Flow

```text
Home
  ↓
Search
  ↓
Search Results
  ↓
Activity Detail
```

---

## Step 1: Home

The user clicks the Search entry.

### System Response

Navigate to:

`Search Page`

---

# Step 2: Search

The Search page contains:

* Search input
* Search button / interaction
* Category filters
* Time filters
* Location filters
* Organizer / school filters
* AI natural-language search suggestion

---

## AI Search

The search interface supports natural-language queries.

Example:

> 本周有哪些 AI 讲座？

or:

> 适合研究生参加的 AI 活动

The system should interpret the user's search intent and return relevant activity results.

The AI capability is presented as a search enhancement rather than a chatbot.

---

# Step 3: Search Results

The system displays matching activity cards.

Each card includes:

* Activity title
* Category
* Date / Time
* Location
* Organizer

### Interaction Rule

The Demo Activity:

**《AI大模型前沿讲座：从理论到产业实践》**

must be available as an interactive result when the search query is relevant to it.

The user clicks the Demo Activity card.

### System Response

Navigate to:

`Activity Detail Template`

---
# 6. Flow 3 — Personal Center
## User Goal

The user wants to view and manage activities they have favorited or registered for.

## Flow

```text
Home
  ↓
My Page
  ↓
├── 我的收藏
│      ↓
│   Activity Detail
│
└── 我的报名
       ↓
    Activity Detail
Note: 「我的收藏」and「我的报名」are sections within My Page, not independent pages.

Step 1: My Page

The user clicks:

My Page

System Response

Open the Personal Center.

The My Page displays the current user's activity-related information and activity lists.
Step 2: Personal Information

The My Page displays basic user information:

Avatar
Name
School / Department

The page is a personal activity management space rather than a social profile.

For V1 development and demonstration, the current user is:

user_001

All Favorite and Registration states must belong to the current user.

Step 3: My Favorites
Initial State

If the current user has not favorited any activity:

暂无收藏活动

No activity should appear in 「我的收藏」by default.

The Demo Activity must NOT be automatically added to the user's favorites.

Favorite Interaction

The user opens:

Activity Detail

and clicks:

收藏

The favorite state changes:

Not Favorite
      ↓
Favorite

The UI changes:

♡
↓
♥ 已收藏

The Favorite relationship is created for:

user_001 + activity_id

The activity then appears in:

My Page → 我的收藏

Cancel Favorite

If the user clicks the favorite button again:

Favorite
    ↓
Not Favorite

The Favorite relationship for the current user and activity is removed.

The activity is removed from:

我的收藏
Step 4: My Registrations
Initial State

If the current user has not registered for any activity:

暂无报名活动

No activity should appear in 「我的报名」by default.

The Demo Activity must NOT be automatically added to the user's registrations.

Registration Interaction

The user opens:

Activity Detail

and clicks:

立即报名

The registration state changes:

Not Registered
      ↓
Registered

The UI changes:

立即报名
   ↓
已报名

The Registration relationship is created for:

user_001 + activity_id

The activity then appears in:

My Page → 我的报名

The activity card displays:

已报名
---

# 7. Core State Rules

## 7.1 Registration

Initial:

```text
Registration = Not Registered
```

After clicking:

`立即报名`

State becomes:

```text
Registration = Registered
```

UI:

```text
立即报名
↓
已报名
```

My Page:

```text
我的报名
↓
显示该活动
```

---

# 7.2 Favorite

Initial:

```text
Favorite = False
```

After clicking:

`收藏`

State becomes:

```text
Favorite = True
```

UI:

```text
♡
↓
♥
```

My Page:

```text
我的收藏
↓
显示该活动
```

If the user cancels the favorite:

```text
Favorite = False
```

The activity is removed from My Favorites.

---

# 8. Demo Data Rules

The prototype uses a small set of Demo Activities to demonstrate the product experience.

The primary interactive Demo Activity is:

**《AI大模型前沿讲座：从理论到产业实践》**

Other activities can be used to make Home and Search pages look realistic.

However:

> Demo activities displayed on Home or Search do not automatically belong to the user's personal activity records.

Therefore:

### Home / Search

Can display Demo Activities by default.

### My Favorites

Only displays activities explicitly favorited by the user.

### My Registrations

Only displays activities explicitly registered by the user.

---

# 9. Navigation Rules

## Global Navigation

The main navigation includes:

```text
Home
Search
My Page
```

---

## Activity Card

Clicking an interactive activity card:

```text
Activity Card
↓
Activity Detail Template
```

---

## My Favorites

Clicking an activity:

```text
My Favorites
↓
Activity Detail Template
```

---

## My Registrations

Clicking an activity:

```text
My Registrations
↓
Activity Detail Template
```

---

# 10. V1 Scope

## Included in V1

* Activity aggregation display
* Activity categories
* Activity search
* Activity filtering
* Activity detail
* AI natural-language search
* Activity registration
* Activity favorite
* Personal center
* Registration history
* Favorite history

---

## Not Included in V1

The following features are intentionally excluded from the V1 prototype and development scope:

* Activity publishing
* Organizer account
* Organizer dashboard
* Activity approval
* Activity management
* AI activity structuring for organizers
* Comments
* Social interactions
* Messaging
* Points / rewards
* Complex recommendation algorithms

---

# 11. Future Roadmap

The activity publishing side will be considered in a later version.

Possible future flow:

```text
Organizer Login
      ↓
Create Activity
      ↓
AI Activity Structuring
      ↓
Preview
      ↓
Approval
      ↓
Publish
```

This flow is **not part of the V1 MVP prototype or development scope**.

---

# 12. V1 Core User Journey

The most important V1 journey is:

```text
             Campus Hub

                 ↓

          Discover Activity
                 ↓
          Search / Filter
                 ↓
          View Activity
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
      Favorite          Register
        ↓                 ↓
        └────────┬────────┘
                 ↓
             My Page
                 ↓
       Manage Activities
```

The V1 MVP should prioritize making this user journey complete, clear, and consistent.

---

# End of User Flow V1
