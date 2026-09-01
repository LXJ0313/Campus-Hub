# Campus Hub Interaction Specification (V1)

Version: V1.0

Product: Campus Hub

Purpose:
Define user interaction flows, page transitions, component behaviors, and state changes for Campus Hub V1 Prototype.

---

# 1. Interaction Design Principles

## 1.1 Product Goal

Campus Hub helps university students and faculty efficiently discover, filter, and participate in campus activities.

The V1 prototype focuses on validating the core user journey:

Discover Activity → View Details → Register → Manage Participation


---

## 1.2 Prototype Principles

The prototype follows:

- Single Demo Activity principle
- Template-based page design
- MVP-first interaction design

Demo Activity:

"AI大模型前沿讲座：从理论到产业实践"


All complete interaction flows should be demonstrated through this activity.


---

# 2. Global Interaction Rules


## 2.1 Navigation

Global navigation includes:

- Home
- Search
- My Page



Navigation behavior:

Click navigation item:

→ Navigate to corresponding page


---

## 2.2 Activity Card Interaction

Activity Card is the core reusable component.

Contains:

- Activity title
- Category
- Time
- Location
- Organizer


Interaction:

Click Activity Card:

→ Open Activity Detail Template


Note:

Only Demo Activity requires complete interaction in prototype.

Other activities are display-only.


---

# 3. User Flow Specifications
# Flow 1: Discover Activity and Register

## User Goal

User wants to find an interesting campus activity and register.

---

## Flow

Home

↓

Activity Detail Template

↓

Click "立即报名"

↓

Registration State Changes

↓

Button changes to "已报名"

↓

My Page → 我的报名

---

## Step 1: Home

User Action:

Click an activity card.

System Response:

Navigate to:

Activity Detail Template

The selected activity must be identified by its `activity_id`.

The Activity Detail Template must display the corresponding activity rather than a fixed Demo Activity.

---

## Step 2: Activity Detail Template

Page displays:

- Activity title
- AI activity summary
- Time
- Location
- Organizer
- Activity description
- Registration information

Main CTA:

"立即报名"

---

## Step 3: Registration Interaction

User Action:

Click "立即报名".

System Response:

1. Create a Registration relationship between the current User and the selected Activity.

2. Update the Registration state:

Before:

```text
Not Registered
After:

Registered
Update the CTA:

Before:

立即报名

After:

已报名
Show registration success feedback.
The registered Activity becomes available in:
My Page → 我的报名

The Registration state must belong to the current User and selected Activity.

The Demo Activity must not be automatically registered by default.

Step 4: My Page

When the user opens:

My Page → 我的报名

the Activity that the user has registered for should appear in the "我的报名" section.

The Activity must be retrieved according to the current user's Registration relationship.

Result

User successfully registers for the selected activity.

The Registration state is persisted for the current User and Activity.

Related State Change:

See Section 7.1 Registration State.

---

# Flow 2: Search Activity


## User Goal

User wants to find specific campus activities quickly.


## Flow

Home

↓

Search

↓

Search Result

↓

Activity Detail Template


---

## Step 1: Home


User Action:

Click search box


System Response:

Navigate to Search page.


---

## Step 2: Search


User Action:

Input keyword or natural language query.


Examples:

"AI讲座"

"本周有哪些AI活动？"


System Response:

Return relevant activity results.


Search result should:

- Match user intent
- Prioritize relevant activities
- Avoid unrelated activities


---

## Step 3: Search Result


Display:

Activity Cards


Each card includes:

- Title
- Category
- Time
- Location
- Organizer


User Action:

Click Demo Activity Card


System Response:

Navigate to Activity Detail Template


---

## AI Search Interaction


AI capability:

Natural language understanding.


Example:

Input:

"适合研究生参加的AI活动"


System:

Understand:

Category = AI

Target User = Graduate Student


Return:

Relevant activities.


AI does not act as chatbot.


---


# Flow 3: Personal Center


## User Goal

User wants to manage personal activity information.


## Flow

Home

↓

My Page

↓

My Favorites / My Registrations


---

# My Page


## User Action

Click "My Page"


System Response:

Open Personal Center.


---

## Page Structure


### User Information

Display:

- Avatar
- Name
- School/Department


---

### My Favorites


Display activities saved by user.


User Action:

Click activity card


System Response:

Open Activity Detail Template.


---

### My Registrations


Display activities user has registered.


Each card shows:

- Activity title
- Registration status

Example:

Status:

已报名


User Action:

Click activity card


System Response:

Open Activity Detail Template.


---


# 7. State Change Rules


# 7.1 Registration State


## Initial State

User:

Not Registered


## Action

User clicks:

立即报名


## State Change


Before:

Registration = None


After:

Registration = Registered


UI Update:

Button:

立即报名

↓

已报名


My Page:

我的报名

↓

Display activity


---

# 7.2 Favorite State


## Initial State

Activity:

Not Favorite


## Action

User clicks:

收藏


## State Change


Before:

Favorite = False


After:

Favorite = True


UI Update:

Icon:

♡


↓

♥


My Page:

我的收藏

↓

Display activity


---

# 8. Micro Interaction Specification


## Favorite Button

Interaction:

Click icon


Feedback:

Icon changes immediately.


---

## Registration Button

Interaction:

Click CTA


Feedback:

Button changes to:

已报名


---

## Search Input

Interaction:

Input keyword


Feedback:

Show matching activities.


---

# 9. Out of Scope (V1)


Not included:

- Social interaction
- Comments
- Messaging
- Ranking
- Points system
- Complex recommendation algorithm
- Multiple activity detail pages
- Publishing


---
#10.Current User

For V1 development and prototype demonstration, the application uses a fixed mock user:

`user_001`

All user-specific states, including Favorite and Registration, must be associated with `user_001`.
V1 does not include a login or registration flow.
The application automatically uses `user_001` as the current demo user.
No authentication UI is required for V1.

The mock user is not automatically assigned any Favorite or Registration state unless explicitly defined in DEMO_DATA_STATE_RULES.md.

# End