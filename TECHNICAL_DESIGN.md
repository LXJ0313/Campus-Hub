# Campus Hub Technical Design

**Product:** Campus Hub  
**Version:** V1.0 MVP  
**Document Type:** Technical Design

---

# 1. Purpose

This document defines the technical stack and system architecture for Campus Hub V1.

It provides the technical implementation direction for development and should be used together with the following documents:

- `PRD.md`
- `USER_FLOW.md`
- `WIREFRAME.md`
- `INTERACTION_SPEC.md`
- `DESIGN_PRINCIPLES.md`
- `DEVELOPMENT_CONSTRAINTS.md`
- `DEMO_DATA_STATE_RULES.md`
- `DATA_SCHEMA.md`

This document defines technical implementation direction only.

It does not replace product requirements, interaction rules, design rules, or data schema definitions.

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite

### Responsibility

The frontend is responsible for:

- Rendering pages and components
- Handling user interactions
- Managing UI state
- Displaying activity data
- Calling backend APIs
- Displaying Favorite and Registration states
- Providing the search interface

---

## Backend

- Node.js
- TypeScript
- Express.js

### Responsibility

The backend is responsible for:

- Providing APIs
- Handling business logic
- Reading and writing application data
- Managing Favorite and Registration relationships
- Processing search requests
- Orchestrating AI-assisted search
- Communicating with PostgreSQL
- Communicating with the LLM API

---

## Database

- PostgreSQL

### Database Platform

- Supabase

PostgreSQL is the database technology.

Supabase is used as the hosted PostgreSQL platform.

The logical data model is defined in:

`DATA_SCHEMA.md`

---

## Frontend Deployment

- Vercel

Vercel is responsible for hosting and deploying the React frontend.

---

## Backend Deployment

The backend will be deployed to one of the following platforms:

- Render
- Railway

The final platform can be selected during the deployment stage.

The choice of backend hosting platform does not change the application architecture.

---

## AI

- LLM API

The AI capability is primarily used for natural-language activity search.

The specific LLM provider and model can be determined during implementation.

---

# 3. Overall System Architecture

The overall architecture is:

```text
User
  ↓
Vercel
  ↓
React + TypeScript
  ↓ HTTPS API
Node.js + TypeScript
  ↓
┌───────────────┬───────────────┐
↓               ↓
PostgreSQL      LLM API
(Supabase)
Responsibilities are separated as follows:

Frontend
    ↓
Presentation and user interaction


Backend
    ↓
Business logic and API


PostgreSQL
    ↓
Persistent structured data


LLM API
    ↓
Natural-language understanding

#4. Frontend Architecture

The frontend uses React and TypeScript.

The application should be organized around reusable components and page-level views.

Core pages include:

Home
Search
Activity Detail
My Page

Core reusable components may include:

ActivityCard
SearchBar
FavoriteButton
RegistrationButton
Navigation

The exact component structure may be adjusted during implementation.

The frontend should not contain database-specific logic.

Frontend communication with application data should normally go through backend APIs.

#5. Backend Architecture

The backend uses Node.js + TypeScript.

The backend acts as the application API layer between the frontend, database, and AI service.

Conceptually:

React
  ↓
API
  ↓
Node.js Backend
  ↓
Business Logic
  ↓
PostgreSQL

For AI-assisted search:

React
  ↓
Node.js Backend
  ↓
LLM API
  ↓
Structured Search Parameters
  ↓
PostgreSQL
  ↓
Search Results
The backend should be responsible for validating requests and protecting private API credentials.

#6. API Architecture

The frontend communicates with the backend through HTTP APIs.

The initial API structure may follow:

GET    /api/activities
GET    /api/activities/:activityId


GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:activityId


GET    /api/registrations
POST   /api/registrations


GET    /api/search
POST   /api/search/ai

The exact endpoint structure may be adjusted during implementation, but the following principles must remain:

Activity data is provided by the backend.
Favorite and Registration are user-specific relationships.
The frontend should not directly access the database for application business logic.
AI search requests should be processed by the backend.

#7. Database Architecture

The V1 database uses PostgreSQL hosted through Supabase.

The four core entities are:

User
Activity
Favorite
Registration

Relationship:

User
 │
 ├── Favorite ─── Activity
 │
 └── Registration ─── Activity

The detailed fields, types, and relationships are defined in:
DATA_SCHEMA.md

The technical implementation must follow DATA_SCHEMA.md rather than creating an independent data model.

#8. User-Specific State

User-specific states must be stored as relationships between the current User and Activity.

For example:

Favorite(user_id, activity_id)

represents that a specific user has favorited a specific activity.

Similarly:

Registration(user_id, activity_id)

represents that a specific user has registered for a specific activity.

The Activity entity should not use global fields such as:

is_favorite
is_registered

because these states belong to individual users.

This is important to ensure that one user's actions do not incorrectly affect another user's state.

#9. AI-Assisted Search Architecture

AI-assisted search is a core AI capability of Campus Hub V1.

It is intended to support natural-language search rather than function as a chatbot.

Example:
User:
“本周有哪些 AI 讲座？”

        ↓

React
        ↓

Node.js Backend
        ↓

LLM API
        ↓

Structured Search Parameters
        ↓

PostgreSQL
        ↓

Relevant Activities
        ↓

React Search Results
The LLM should primarily perform:

Natural Language
      ↓
Intent / Search Parameter Extraction

For example:

{
  "keywords": ["AI"],
  "category": "Lecture",
  "time_range": "this_week",
  "target_audience": null
}

The backend then uses these parameters to query the actual Activity dataset.

The LLM must not invent activity data.

The database remains the source of truth for Activity information.

#10. AI Search Fallback

If the AI cannot confidently interpret a natural-language query, the system should fall back to conventional keyword-based search where possible.

Conceptually:

Natural Language Query
        ↓
AI Interpretation
        ↓
Successful
   /        \
 Yes         No
 ↓            ↓
Structured   Keyword
Search       Search
   \          /
    ↓        ↓
   Activity Dataset

This ensures that AI-assisted search improves the search experience without making the entire search function dependent on the LLM.


# 11. Authentication and User Identity

V1 does not implement a real authentication or login system.

The application uses a fixed mock user for development and demonstration:

`user_001`

The current user is therefore:

```text
Current User
    ↓
user_001
    ↓
Favorite / Registration
All personal actions must be associated with the current demo user's user_id.

For V1:

No email or student ID login
No password authentication
No OAuth
No Supabase Auth
No other third-party authentication service

The backend should use user_001 as the current user when processing Favorite and Registration operations.

The frontend must not arbitrarily specify another user_id when performing personal actions.

Real authentication and user identity management may be introduced in a future version.

#12. Deployment Architecture

The planned deployment structure is:

                            User
                               ↓
              ┌──────────────┐
              │   Vercel                       │
              │ React + TS                 │
              └──────┬───────┘
                                │
                                │ HTTPS API
                                 ↓
          ┌─────────────────────┐
          │ Render / Railway                         │
          │ Node.js + TypeScript                   │
          └──────────┬──────────┘
                                       │
                     ┌──────┴──────┐
                     ↓                                   ↓
        ┌───────────┐   ┌─────────┐
        │ Supabase            │   │ LLM API        │
        │ PostgreSQL│     │   │
        └───────────┘   └─────────┘

The frontend and backend are deployed separately.

The database is hosted through Supabase.

The backend hosting platform will be selected between Render and Railway during the deployment stage.

#13. V1 Technical Scope

The V1 implementation focuses on:

Home
Search
Activity Detail
My Page
Favorites
Registration
AI-Assisted Search

The following are outside the V1 technical scope:

Activity Publishing
Organizer Dashboard
Activity Approval
Activity Management
Comments
Messaging
Community Features
Complex Recommendation Systems
AI Chatbot

These features may be considered in future versions.

#14. Document Responsibility

Each project document has a specific responsibility.
PRD.md
    ↓
What the product should do

USER_FLOW.md
    ↓
How users move through the product

WIREFRAME.md
    ↓
Page structure

INTERACTION_SPEC.md
    ↓
How interactions and states behave

DESIGN_PRINCIPLES.md
    ↓
Design rules

DEVELOPMENT_CONSTRAINTS.md
    ↓
Development constraints

DEMO_DATA_STATE_RULES.md
    ↓
Demo data and state rules

DATA_SCHEMA.md
    ↓
Logical data structure

TECHNICAL_DESIGN.md
    ↓
Technology stack and system architecture
No document should unnecessarily duplicate the responsibilities of another document.

If a technical implementation conflicts with the product or interaction requirements, the conflict must be resolved before implementation.

#15. Final Technical Stack

Campus Hub V1 uses the following planned stack:

Frontend
React + TypeScript


Frontend Deployment
Vercel


Backend
Node.js + TypeScript + Express


Backend Deployment
Render / Railway


Database
PostgreSQL


Database Platform
Supabase


AI
LLM API

The architecture is intentionally kept simple for the V1 MVP.

The primary goal is to build a functional, maintainable, and demonstrable full-stack product while leaving room for future expansion.
