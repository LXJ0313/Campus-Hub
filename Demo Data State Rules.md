# Demo Data State Rules

Version: V1.0

Product: Campus Hub

Purpose:

Define the initial Demo data state and user-specific state changes for the Campus Hub V1 prototype.

---

# 1. Demo User

Current demo user:

`user_001`

All user-specific states must belong to the current demo user.

User-specific states include:

- Registration
- Favorite

---

# 2. Demo Activity

Demo Activity:

`AI大模型前沿讲座：从理论到产业实践`

The Demo Activity has a unique:

`activity_id`

The Demo Activity exists in the Demo dataset and is available for display and interaction in V1.



---

# 3. Initial User State

For the current demo user:

```text
Registration = false
Favorite = false
The Demo Activity must NOT automatically appear in:

我的报名
我的收藏

The Demo Activity only appears in these sections after the user explicitly performs the corresponding action.

4. Registration State Rules
4.1 Initial State

For:

user_001 + activity_id

the initial Registration state is:

Registration = false

The user is:

Not Registered
4.2 User Action

User clicks:

立即报名

4.3 State Change
Registration = false
        ↓
Registration = true

A Registration relationship is created between:

user_001 + activity_id

The Activity record itself is not modified by a user's registration.

4.4 UI Update

Activity Detail:

立即报名
    ↓
已报名

Show registration success feedback.

4.5 My Page Update

The registered Activity appears in:

My Page → 我的报名

The activity must be retrieved according to the current user's Registration relationship.

5. Favorite State Rules
5.1 Initial State

For:

user_001 + activity_id

the initial Favorite state is:

Favorite = false

The Demo Activity must not appear in:

My Page → 我的收藏

unless the user explicitly favorites it.

5.2 User Action

User clicks the Favorite button.

5.3 State Change
Favorite = false
        ↓
Favorite = true

A Favorite relationship is created between:

user_001 + activity_id
5.4 UI Update

Activity Detail:

♡
↓
♥ 已收藏
5.5 My Page Update

The favorited Activity appears in:

My Page → 我的收藏
6. Cancel Favorite Rules
6.1 User Action

User clicks the Favorite button again.

6.2 State Change
Favorite = true
        ↓
Favorite = false

The Favorite relationship between:

user_001 + activity_id

is removed.

6.3 UI Update

Activity Detail:

♥ 已收藏
↓
♡
6.4 My Page Update

The Activity is removed from:

My Page → 我的收藏
7. State Consistency Rules

Favorite and Registration are user-specific relationships between:

user_id + activity_id

They must not be stored as global Activity states such as:

Activity.is_favorite
Activity.is_registered

Different users may have different Favorite and Registration states for the same Activity.

The Demo Activity's availability in the Demo dataset does not imply that the current user has:

Favorite = true

or:

Registration = true
## 8. Demo State Summary

Initial state:

User:
user_001

Demo Activity:
AI大模型前沿讲座：从理论到产业实践

Activity:
Exists in the Demo dataset

Favorite:
false

Registration:
false


Registration:
false

After user favorites the Activity:

Favorite:
true


Registration:
false

After user registers for the Activity:

Favorite:
unchanged


Registration:
true

After user cancels the Favorite:

Favorite:
false

Registration remains unchanged.
--------------------the end----------------------------