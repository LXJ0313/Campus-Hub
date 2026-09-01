# Campus Hub Development Constraints

**Product:** Campus Hub  
**Version:** V1.0 MVP  
**Document Type:** Development Constraints  
**Target:** Trae / AI Coding Agent

---

# 1. V1 Development Scope

Campus Hub V1 focuses on the participant-side campus activity discovery and participation experience.

The core V1 loop is:

```text
Discover Activity
        ↓
View Activity Details
        ↓
Favorite / Register
        ↓
Manage in My Page
The implementation should prioritize completing this loop rather than expanding the feature scope.

---

#2. V1 Pages
V1 User Authentication

V1 does not implement a real authentication or login system.

The prototype uses a fixed mock user:

`user_001`

The mock user represents the currently active user during development and demonstration.

No email, student ID, password, OAuth, or third-party login is required for V1.

The V1 implementation includes the following pages:

Home
Search
Activity Detail
My Page

The following are considered sections or states rather than independent product modules:

My Favorites
My Registrations
Registration Success
Favorite State
Search Results
Empty States

Do not create additional product pages unless explicitly required by the V1 specification.

---

#3. V1 doesn't develop features
##Features Explicitly Excluded from V1

Do NOT implement the following features in V1:

Activity Publishing
Organizer Account
Organizer Dashboard
Activity Submission
Activity Approval
Activity Management
AI Activity Publishing / Structuring Workflow
AI Chatbot
AI Agent
Complex Recommendation System
Comments
Messaging
Community
Points / Rewards
Ranking
Social Interaction

These are future product directions.

Do not create placeholder pages, navigation items, database tables, or unnecessary components for these features unless explicitly requested.
##Activity Publishing Scope

Activity publishing is NOT part of the V1 implementation.

Do NOT create:

Publish Activity Page
Organizer Login
Organizer Dashboard
Activity Creation Form
Activity Submission Workflow
Approval Workflow
Publish Success Page

The product may support activity publishing in a future version, but V1 should treat activities as existing platform data.

---

#4. Activity Data Model

Activity is a core entity of Campus Hub.

All pages should consume activity data through a consistent Activity model.

The Activity model should contain at least:

activity_id
title
category
description
start_time
end_time
location
organizer
registration_deadline
capacity

image_url

Additional fields may be introduced only when required by the V1 functionality.

Do not create different Activity structures for different pages.

---

#5. Activity ID Requirement

Every Activity must have a unique:

activity_id

Activity identity must be based on the ID rather than the activity title.

Do NOT create independent pages such as:

AI Lecture Page
Sports Event Page
Volunteer Event Page

Instead, use one reusable Activity Detail template:

activity_id
    ↓
Activity Data
    ↓
Activity Detail Template

This ensures that different activity cards can navigate to the correct activity detail.

---

#6. Activity Card Component

ActivityCard must be implemented as a reusable component.

It should be reused across:

Home
Search Results
Category Results
My Favorites
My Registrations

Do NOT create separate copies of ActivityCard for each page.

The ActivityCard should receive Activity data through props or equivalent data binding.

---

#7.Activity Detail Component

Use one reusable:

ActivityDetail

component/template.

The page should render the activity according to its:

activity_id

The Activity Detail page must support:

Activity information
Favorite state
Registration state
Registration action
Navigation back to the previous context

The same component should be capable of displaying different activities.

---

#8. User-Specific State

User-specific activity states must be separated from Activity data.

At minimum, the implementation must support:

Favorite
Registration

These states belong to the relationship between:

User
    +
Activity

They should not be stored as hardcoded properties of the Activity itself.

---

#9. Favorite State

Initial state:

Favorite = false

When the user clicks Favorite:

false
   ↓
true

The UI should update accordingly.

Example:

♡ 收藏
    ↓
♥ 已收藏

The activity should then appear in:

My Page
    ↓
My Favorites

If the user clicks Favorite again:

true
   ↓
false

The activity must be removed from My Favorites.

Do NOT hardcode an activity as favorited.

---

#10. Registration State

Initial state:

Registration = not_registered

When the user clicks:

立即报名

the state changes to:

not_registered
        ↓
registered

The UI should update:

立即报名
    ↓
已报名

The activity should then appear in:

My Page
    ↓
My Registrations

Do NOT hardcode the Demo Activity as already registered.

---

#11. My Page Data Rules

My Page must be driven by the current user's activity state.

It must NOT use static Demo Activities as default personal records.

My Favorites

If the user has not favorited any activity:

暂无收藏活动

If the user favorites an activity:

My Favorites
    ↓
Display the favorited activity
My Registrations

If the user has not registered for any activity:

暂无报名活动

If the user registers for an activity:

My Registrations
    ↓
Display the registered activity

The same Activity object should be used when navigating from My Page to Activity Detail.

---

#12.Search / AI Search uses unified Activity data
## Search Requirements

Search is a P0 V1 feature.

The Search implementation should support:

Keyword search
Category filtering
Time filtering
Location filtering
Natural-language search

Search results must be generated from Activity data.

Do NOT create independent hardcoded result pages for different queries.

## Natural-Language Search

The V1 AI search experience should allow users to express activity needs naturally.

Example:

本周有哪些 AI 讲座？

The system should conceptually interpret the query as:

time = this_week
topic = AI
category = lecture

The resulting activities should be filtered or ranked according to the interpreted intent.

The implementation should prioritize relevant results.

Do NOT simply return all activities whenever a natural-language query is entered.

##Search Relevance Requirement

Search results should prioritize semantic relevance.

For a query such as:

本周有哪些 AI 讲座？

results should prioritize activities matching:

Time: This Week
Topic: AI
Category: Lecture

Clearly unrelated activities such as:

Sports
Volunteering
Entertainment

should not dominate the results merely because they exist in the Demo dataset.

If the AI search capability is simulated in the V1 prototype, the simulation should still follow the same logical rules.

---

#15. Data and UI Separation

Activity data must not be tightly coupled to individual pages.

Avoid:

Home → hardcoded Activity A

Search → hardcoded Activity A

My Page → hardcoded Activity A

Prefer:

Activity Data
      ↓
Reusable Components
      ↓
Home / Search / Detail / My Page

The implementation should allow Demo Data to be replaced by database data later without rebuilding the UI architecture.

---

#16. Database Compatibility

The V1 implementation should be structured so that it can later connect to a real database.

The core conceptual entities are:

User
Activity
Favorite
Registration

The exact database schema will be defined separately in the database specification.

Do NOT create database structures for future organizer publishing features in V1.

---

#17. No Scope Expansion

Do not add features merely because they are technically easy to implement.

If a requested feature is outside the V1 scope, do not implement it automatically.

Examples:

Organizer Dashboard
Activity Publishing
Comments
Chat
Points
Ranking
AI Agent
Complex Recommendation

These should remain outside the V1 implementation unless explicitly requested.

---

#18. Code Quality Constraints

The implementation should:

Use reusable components
Use clear and consistent naming
Keep data and UI logic reasonably separated
Avoid unnecessary duplication
Avoid unnecessary dependencies
Avoid premature abstraction
Avoid over-engineering
Keep the V1 architecture understandable
Prefer simple solutions that satisfy the requirements

Do not introduce complex architecture unless it is required by the V1 functionality.

---

Favorite and Registration states must be driven by user actions and remain consistent across all pages. Refer to interaction_spec.md and Demo Data State Rules.md for detailed state transitions.

----the end------------
