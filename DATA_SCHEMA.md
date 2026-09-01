# Campus Hub Data Schema

**Product:** Campus Hub  
**Version:** V1.0 MVP  
**Document Type:** Data Schema  
**Target:** Trae / AI Coding Agent / Supabase

---

# 1. Purpose

This document defines the core data structure and relationships for the Campus Hub V1 MVP.

The purpose of this document is to provide a consistent data model for:

- Frontend development
- Application state management
- Database implementation
- Supabase schema design
- Demo data
- Favorite and Registration relationships

This document defines the logical data model.

The actual database implementation may use Supabase PostgreSQL.

---

# 2. V1 Data Model Overview

Campus Hub V1 uses four core entities:

```text
User
Activity
Favorite
Registration
Relationship:
                              User
                                │
              ┌──────┴──────┐
              │                                  │
              ▼                                 ▼
          Favorite                  Registration
              │                                  │
              └──────┬──────┘
                                │
                                ▼
                           Activity

The key principle is:
Activity data represents platform activity information, while Favorite and Registration represent user-specific relationships with activities.

#3.Entity Overview
| Entity       | Purpose                                                        |
| ------------ | -------------------------------------------------------------- |
| User         | Represents a Campus Hub user                                   |
| Activity     | Represents a campus activity                                   |
| Favorite     | Represents a user's favorite relationship with an activity     |
| Registration | Represents a user's registration relationship with an activity |

#4. User
V1 uses a mock user for development and demonstration.

Demo User:

`user_001`

The User entity is used as the owner of user-specific relationships such as:

- Favorite
- Registration

##4.1 Purpose
The User entity represents the current Campus Hub participant.
V1 focuses on activity participants, including students and faculty.
Organizer accounts are not part of V1.
##4.2Fields
| Field      | Type          | Required | Description            |
| ---------- | ------------- | -------- | ---------------------- |
| user_id    | UUID / String | Yes      | Unique user identifier |
| name       | String        | Yes      | User display name      |
| avatar_url | String        | No       | User avatar            |
| school     | String        | No       | School / college       |
| department | String        | No       | Department             |
| created_at | Timestamp     | Yes      | Account creation time  |
##4.3Example
{
  "user_id": "user_001",
  "name": "Alex",
  "avatar_url": "/images/avatar.png",
  "school": "School of Computer Science",
  "department": "Computer Science",
  "created_at": "2026-08-01T10:00:00Z"
}

# 5Activity
##5.1 Purpose
Activity is the core platform entity.
It represents a campus activity displayed throughout Campus Hub.
Activities are platform data and are not automatically associated with a user's personal records.
##5.2Fields
| Field                 | Type          | Required | Description                             |
| --------------------- | ------------- | -------- | --------------------------------------- |
| activity_id           | UUID / String | Yes      | Unique activity identifier              |
| title                 | String        | Yes      | Activity title                          |
| category              | String        | Yes      | Activity category                       |
| description           | Text          | Yes      | Full activity description               |
| tags                  | String[] | No       | Activity topic and keyword tags used to describe the activity and support keyword and natural-language search. |
| target_audience | String[] | No       | Identifies the primary groups of students or faculty for whom the activity is intended.  |
| start_time            | Timestamp     | Yes      | Activity start time                     |
| end_time              | Timestamp     | Yes      | Activity end time                       |
| location              | String        | Yes      | Activity location                       |
| organizer             | String        | Yes      | Activity organizer                      |
| registration_deadline | Timestamp     | No       | Registration deadline                   |
| capacity              | Integer       | No       | Maximum participant capacity            |
| image_url             | String        | No       | Activity cover image                    |
| ai_summary            | Text          | No       | AI-generated activity summary           |
| created_at            | Timestamp     | Yes      | Activity creation time                  |

#6Activity Categories
V1 should use a controlled category vocabulary.
Initial categories may include:
Academic
Lecture
Competition
Volunteer
Sports
Culture
Career
Innovation
Other
The exact displayed category labels may be adjusted by the UI design.
Do not create arbitrary category values for individual activities.

#7. Activity Tags

Activity tags describe important topics, keywords, or themes associated with an activity.
Example:
[
  "AI",
  "Large Language Model",
  "Technology",
  "Research"
]

Tags may be used by:
Keyword search
Natural-language search
Activity relevance matching
Tags are optional.

#8. Target Audience

Target audience identifies the primary groups for whom an activity is intended.
Example:

[
  "Graduate Student",
  "Undergraduate"
]

Possible V1 values may include:

All Students
Undergraduate
Graduate Student
Faculty

Target audience is optional.

#9. AI Summary

ai_summary stores an AI-generated concise summary of an activity.

The field is optional.

AI Summary is an enhancement to Activity information and does not replace the original activity description.

Example:
{
  "ai_summary": "A lecture exploring the development of large language models and their applications in industry."
}

#10. Primary Demo Activity
The primary interactive Demo Activity is:
《AI大模型前沿讲座：从理论到产业实践》
This Activity must have a unique activity_id.
Example:
{
  "activity_id": "activity_ai_001",
  "title": "AI大模型前沿讲座：从理论到产业实践",
  "category": "Lecture",
  "description": "...",
  "location": "...",
  "organizer": "...",
  "start_time": "...",
  "end_time": "...",
  "registration_deadline": "...",
  "capacity": 200,
  "image_url": "...",
  "ai_summary": "..."
}
Other Demo Activities may exist to populate Home and Search pages.

#11. Favorite
##11.1 Purpose
Favorite represents the relationship between a User and an Activity.
It records that a user explicitly saved an activity.
Favorite must NOT be stored as a permanent property of the Activity itself.
##11.2Fields
| Field       | Type          | Required | Description                      |
| ----------- | ------------- | -------- | -------------------------------- |
| favorite_id | UUID / String | Yes      | Unique favorite record           |
| user_id     | UUID / String | Yes      | Reference to User                |
| activity_id | UUID / String | Yes      | Reference to Activity            |
| created_at  | Timestamp     | Yes      | Time when activity was favorited |
#11.3Relationship
User
  │
  │ user_id
  ▼
Favorite
  │
  │ activity_id
  ▼
Activity
##11.4 Favorite Data State

The absence of a Favorite record represents that the current user has not favorited the activity.
A Favorite record represents that the current user has favorited the activity.

No Favorite Record
        ↓
Favorite Record Exists

The detailed user interaction and state transition rules are defined in:
Interaction Spec.md 
and
Demo Data State Rules.md
#12. Registration
##12.1 Purpose
Registration represents the relationship between a User and an Activity.
It records that a user has registered for an activity.
##12.2Fields
| Field           | Type          | Required | Description                |
| --------------- | ------------- | -------- | -------------------------- |
| registration_id | UUID / String | Yes      | Unique registration record |
| user_id         | UUID / String | Yes      | Identifier of the associated user        |
| activity_id     | UUID / String | Yes      | Identifier of the associated activity      |
| status          | String        | Yes      | Registration status        |
| registered_at   | Timestamp     | Yes      | Time when the registration record was created  |
##internal registration model

V1 uses an internal registration model.

Users register for activities directly through Campus Hub.

Registration is represented by the relationship:

`user_id + activity_id`

No external registration URL is used in V1.

# 13. Registration Status

V1 supports the following Registration status:

`registered`

A Registration record represents an active registration between a User and an Activity.

A Registration record with:

```text
status = registered
represents that the current user is registered for the activity.

If no Registration record exists for the current user and activity, the user is considered:

Not Registered

For V1, cancellation of a registration is handled by deleting the corresponding Registration record.

V1 does not use a separate cancelled status.

Therefore:

Registration record exists
        ↓
status = registered
        ↓
Registered

and:

Registration record does not exist
        ↓
Not Registered

The Registration relationship is associated with:

user_id + activity_id

The detailed registration interaction and state transition rules are defined in:

INTERACTION_SPEC.md

and

DEMO_DATA_STATE_RULES.md

#14 User-Specific Data Principle
The following distinction must always be maintained:

Platform Activity Data
        ≠
User Activity Data

Home, Search, and Activity Detail operate on Activity data.

Favorite and Registration represent user-specific relationships with Activity.

For example:

Activity A
Activity B
Activity C
Activity D

being displayed on Home does NOT mean:

My Favorites = A + B + C + D

Instead:

My Favorites
=
Activities associated with Favorite records
for the current User

Similarly:

My Registrations
=
Activities associated with Registration records
for the current User

#15. Data Relationship Rules
##Rule 1 — Activity Identity
Every activity must have a unique:
activity_id
Activity identity must never rely on the activity title.
##Rule 2 — Favorite Identity
A user should not be able to create duplicate Favorite records for the same Activity.
Recommended unique constraint:
UNIQUE(user_id, activity_id)
##Rule 3 — Registration Identity
A user should not be able to create duplicate active Registration records for the same Activity.
Recommended unique constraint:
UNIQUE(user_id, activity_id)
##Rule 4 — Activity Independence
Activity data must not contain:
is_favorite
is_registered
as global Activity properties.
These are user-specific states.
##Rule 5 — Personal Data
My Favorites and My Registrations must be calculated from the current user's relationship records.
Do not hardcode Demo Activities into these lists.
#16. Demo Data Rules

Demo Activities may be pre-populated in the Activity dataset.

However:
Demo Activity
      ≠
User Favorite
      ≠
User Registration
The primary Demo Activity should initially have no Favorite record and no Registration record for the current user.

Only explicit user actions should create the corresponding relationship records.

The detailed state rules are defined in:

Demo Data State Rules.md

#17. Activity Detail Data Loading

Activity Detail should load Activity data using:

activity_id

Flow:

Activity Card
      ↓
activity_id
      ↓
Activity Detail
      ↓
Load Activity Data

Do not create a separate hardcoded detail page for each Demo Activity.

#18. Home Data

Home should retrieve Activity records.

Conceptually:

Activity
   ↓
Filter / Sort
   ↓
ActivityCard[]

Home may display multiple activities.

The presence of an Activity on Home does not create any User-specific relationship.

#19. Search Data

Search should operate on Activity data.

Conceptually:

Search Query
     ↓
Search / AI Interpretation
     ↓
Activity Filtering / Ranking
     ↓
ActivityCard[]

Natural-language queries may be interpreted through dimensions such as:

Time
Category
Topic
Target Audience
Location

Activity fields such as:

title
category
description
tags
target_audience
start_time
location

may be used as inputs for search and relevance matching.

The detailed search interaction is defined in:

Interaction Spec.md

#20. My Favorites Data

My Favorites is derived from Favorite records associated with the current user.

Conceptually:

Current User
      ↓
Favorite Records
      ↓
activity_id
      ↓
Activity Records
      ↓
ActivityCard[]

If the current user has no Favorite records, the data set is empty.

#21. My Registrations Data
My Registrations is derived from Registration records associated with the current user.

Conceptually:

Current User
      ↓
Registration Records
      ↓
activity_id
      ↓
Activity Records
      ↓
ActivityCard[]

If the current user has no Registration records, the data set is empty.

#22. Data Flow

The overall V1 data flow is:
                                          Activity Data
                                                 │
          ┌──────────────┼──────────────┐
          ↓                                      ↓                                     ↓
        Home                          Search                    Activity Detail
          │                                     │                                     │
          └──────────────┼──────────────┘
                                                 ↓
                                     User Interaction
                                         /                  \
                                        ↓                   ↓
                            Favorite            Registration
                              │                               │
                              └─────┬──────┘
                                              ↓
                                       My Page
                                       /           \
                                      ↓             ↓
                     My Favorites      My Registrations
This diagram describes data relationships and data sources, not user interaction flow.

#23. V1 Data Scope
Included:

User
Activity
Favorite
Registration

Not included:

Organizer Account
Activity Publishing
Activity Approval
Activity Management
Comments
Messaging
Community
Points
Ranking
Complex Recommendation Data
AI Agent Data

These belong to future versions.

#24. Database Implementation Compatibility

The V1 logical data model should remain compatible with a future SQL-based database implementation.

The logical entity mapping is:

User
    ↓
users


Activity
    ↓
activities


Favorite
    ↓
favorites


Registration
    ↓
registrations

The exact database technology, SQL dialect, table definitions, indexes, foreign keys, authentication configuration, and security policies will be defined separately during the technical architecture and database implementation stage.

This document does not lock the project to a specific database provider.

#25. Data Schema Summary

The V1 data model can be summarized as:

User
 │
 ├──────── Favorite ──────── Activity
 │
 └────── Registration ────── Activity

The most important principle is:

Activity is platform data. Favorite and Registration are user-specific relationships.

The database implementation must preserve this distinction throughout the V1 development.