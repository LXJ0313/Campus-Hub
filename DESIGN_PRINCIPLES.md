# Campus Hub Design Principles

**Product:** Campus Hub  
**Version:** V1.0 MVP  
**Document Type:** Product & Design Principles

---

# 1. Product Value Principle

Campus Hub is a unified campus activity aggregation and discovery platform.

The core product value is:

> Make it easier for students and faculty to discover suitable campus activities.

Campus Hub is not simply designed to increase the number of activities displayed.

Its purpose is to reduce the information discovery cost caused by fragmented campus activity channels.

The product should continuously prioritize:

- Reducing information search cost
- Improving activity discoverability
- Helping users quickly understand activities
- Making participation easier

---

# 2. User-Centered Principle

The V1 primary user is the campus activity participant, including:

- University students
- University faculty

The primary user needs are:

- Discover activities
- Search for activities
- Filter activities
- Understand activity information
- Register for activities
- Favorite activities
- Manage personal activity records

V1 should prioritize the participant-side experience.

The activity organizer / publisher side is a future product direction and is not included in the V1 MVP.

---

# 3. MVP Focus Principle

V1 should focus on validating the core user value rather than maximizing the number of features.

The core user journey is:

```text
Discover
   ↓
Understand
   ↓
Participate
   ↓
Manage
The corresponding product loop is:

Discover Activity
        ↓
View Activity Details
        ↓
Favorite / Register
        ↓
Manage in My Page
Features that do not directly support this core journey should not be prioritized in V1.

The product should avoid adding features simply to make the prototype or application appear more comprehensive.

#Information Discovery First

Campus Hub exists primarily to solve the problem of fragmented campus activity information.

Therefore, information discovery should be the primary design consideration.

The product should prioritize:

Search
Categorization
Filtering
Activity information clarity
Activity relevance
Registration accessibility

The interface should help users answer three questions quickly:

What activities are available?
Which activities are relevant to me?
How can I participate?

#Information Hierarchy Principle

Activity information should be progressively disclosed according to user needs.

The Home and Search pages should prioritize essential information.

The Activity Detail page should provide complete information.

The recommended information hierarchy is:

Activity Card
      ↓
Basic Activity Information
      ↓
Activity Detail
      ↓
Full Activity Information
      ↓
Favorite / Registration

Do not place excessive information directly on the activity discovery page.

The user should be able to scan multiple activities efficiently before entering the detail page.

#Simplicity Principle

V1 should remain visually and functionally simple.

The design should prioritize:

Clear information hierarchy
Clear navigation
Moderate information density
Predictable interactions
Consistent visual language
Low cognitive load

Avoid unnecessary:

Navigation levels
Functional modules
Dashboards
Social features
Gamification
Complex recommendation systems
Decorative interactions

Every major UI element should have a clear purpose.
#Consistency Principle

Activities are the core object of Campus Hub.

The same activity should maintain consistent information and interaction logic across:

Home
Search Results
Category Results
Activity Detail
My Favorites
My Registrations

The user should be able to recognize that different activity cards represent the same type of object regardless of where they appear.

The product should use consistent:

Activity information structure
Activity card patterns
Activity detail structure
Favorite interaction
Registration interaction
Status representation
#User Control Principle

Users should have clear control over their activity-related actions.

Important user actions include:

Favorite
Cancel Favorite
Register
View Registration Status

The product should never assume that a user has performed an action they have not explicitly performed.

For example:

An activity displayed on Home does not automatically become a favorite.

An activity displayed on Home does not automatically become a registered activity.

User-specific records should be created through explicit user actions.
#Interaction Feedback Principle

Every meaningful user action should produce clear and immediate feedback.

For example:

Favorite
Not Favorite
      ↓
User clicks Favorite
      ↓
Favorite
Registration
Not Registered
      ↓
User clicks Register
      ↓
Registered

The interface should clearly communicate the current state.

The product should avoid situations where:

The user clicks a button but cannot tell whether it worked
The button state does not match the actual state
My Page does not reflect the user's previous action
#Data-State Consistency Principle

The interface state should remain consistent with the underlying user state.

For example:

If:

Favorite = false

the interface should represent the activity as not favorited.

If:

Favorite = true

the activity should be represented as favorited and should appear in My Favorites.

Similarly:

If:

Registration = not_registered

the activity should not appear in My Registrations.

If:

Registration = registered

the activity should appear in My Registrations.

This principle is especially important for the V1 prototype because user actions must form a coherent experience across multiple pages.
#AI Enhancement Principle

AI is an enhancement capability within Campus Hub rather than the product itself.

The core product remains:

Campus activity discovery and participation.

AI should improve existing product workflows rather than replace them.

V1 AI capabilities should focus on:

Natural-language activity search
AI-assisted activity summarization

AI should be embedded into the existing activity discovery experience.
#AI Natural-Language Search Principle

Users should be able to express activity needs using natural language.

For example:

本周有哪些 AI 讲座？

适合研究生参加的志愿活动

The system should understand the user's intent and use it to improve activity retrieval.

Natural-language search should help interpret dimensions such as:

Time
Activity category
Topic
Target audience
Location

The purpose of AI search is not to make the interaction appear more “AI-like”.

Its purpose is:

Help users find relevant activities more efficiently
#AI Activity Summary Principle

Campus activity information may originate from lengthy announcements or fragmented descriptions.

AI can help transform lengthy information into concise summaries.

The summary should help users quickly understand:

What the activity is
What the activity is about
Who it is suitable for
Why it may be worth attending

AI-generated summaries should support decision-making rather than replace the original activity information.
#No AI Chatbot Principle

Campus Hub should not become an AI chatbot product.

V1 should not introduce:

Independent AI Chat page
AI chatbot as the primary interface
AI Agent as the primary interaction model
Complex conversational workflows
Unnecessary AI-generated content

The user should primarily interact with activities, search, filters, and registration functions.

AI should appear naturally where it provides clear user value.
#Prototype Principle

The V1 prototype is intended to validate the core product experience.

It does not need to represent the complete production system.

The prototype should prioritize demonstrating:

Activity discovery
Search
Activity details
Favorite
Registration
My Page
AI-enhanced search experience
Correct interaction states

A limited set of Demo Activities may be used to demonstrate the experience.

The prototype should not expand into unnecessary product modules.
#Demo Data Principle

Demo data exists to demonstrate product functionality and visual presentation.

Demo Activities displayed on Home or Search should not automatically become user-specific records.

The following distinction must remain clear:

Platform Activity Data
        ≠
User Activity Data

For example:

Home
→ Can display Demo Activities

but:

My Favorites
→ Only displays explicitly favorited activities

and:

My Registrations
→ Only displays explicitly registered activities

This distinction is essential for maintaining a coherent product experience.
#Future Expansion Principle

Campus Hub should be designed with future extensibility in mind, but future capabilities should not unnecessarily enter the V1 MVP.

The product may eventually expand toward a two-sided campus activity platform.

Potential future directions include:

Activity publishing
Organizer accounts
Activity management
Activity approval
AI-assisted activity structuring
Organizer-side tools
More advanced activity recommendations

These capabilities belong to future product iterations.

They should not weaken the focus of the V1 participant-side experience.
#Product Decision Principle

When multiple design options are possible, prioritize the option that best satisfies the following order:

User Value
   ↓
Core MVP Goal
   ↓
Information Efficiency
   ↓
Interaction Clarity
   ↓
Consistency
   ↓
Implementation Simplicity

Do not prioritize visual complexity or feature quantity over user value.
#Core Design Philosophy

Campus Hub V1 follows the following core philosophy:

Do not make users search harder. Make activities easier to discover.

The product should reduce the friction between:

"I want to find an activity"

and:

"I found an activity that suits me and I can participate."

Therefore, every important design decision should ultimately serve:

Helping students and faculty discover and participate in suitable campus activities more efficiently.
#Principle Summary

Campus Hub V1 follows these core principles:

User-centered
MVP-focused
Information discovery first
Simple and clear
Consistent interaction
User-controlled state
Data-state consistency
AI as enhancement
No unnecessary AI chatbot
Future-ready without overbuilding

The V1 product should always prioritize:

Discover → Understand → Participate → Manage