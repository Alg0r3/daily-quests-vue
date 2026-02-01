# Architecture

This document explains how DailyQuest is structured and where code should live.
It exists to prevent the usual frontend drift: “everything ends up in components/stores”.

DailyQuest is **local-first**:
- **Dexie (IndexedDB)** is the source of truth for persistent data.
- **Pinia** holds UI/session state and orchestrates calls to use-cases.
- Vue components remain mostly “dumb” and focused on rendering.

---

## Table of Contents

- [Architecture](#architecture)
    - [Goals](#goals)
    - [Directory Structure](#directory-structure)
    - [Layer Responsibilities](#layer-responsibilities)
        - [1) `domain/` Pure rules (module-specific)](#1-domain-pure-rules-module-specific)
        - [2) `application/` Use-cases (queries and commands)](#2-application-use-cases-queries-and-commands)
        - [3) `infrastructure/` Persistence & adapters](#3-infrastructure-persistence--adapters)
        - [4) `presentation/` UI wiring (Vue)](#4-presentation-ui-wiring-vue)
    - [Repositories](#repositories)
    - [CQRS-lite: Queries vs Commands](#cqrs-lite-queries-vs-commands)
        - [Queries](#queries)
        - [Commands](#commands)
    - [State Ownership Rules](#state-ownership-rules)
        - [Persistent state (Dexie)](#persistent-state-dexie)
        - [UI/session state (Pinia)](#uisession-state-pinia)
    - [Shared Folder Rules](#shared-folder-rules)
    - [Import Rules (One-way dependency)](#import-rules-one-way-dependency)
    - [Where does this code go?](#where-does-this-code-go)
    - [Naming Conventions](#naming-conventions)

---

## Goals

- Keep code **discoverable** (“where does this go?” is answered quickly)
- Keep logic **testable** (rules and use-cases tested without Vue)
- Prevent **God components / God stores**
- Stay **future-backend friendly** (repositories can be swapped later)

---

## Directory Structure

High level:
```text
src/
├── app/                    # App bootstrap: router, pinia setup, global wiring
├── shared/                 # Cross-module utilities and primitives (small, not a junk drawer)
└── modules/                # Product areas / bounded contexts (quests, stats, settings, ...)
```

Module structure:
```text
src/modules/<module-name>/
├── domain/                 # Pure rules/helpers for that module (optional, grows as needed)
├── application/            # Use-cases: queries (read) + commands (write)
├── infrastructure/         # Concrete implementations: Dexie repositories, mappers
└── presentation/           # Vue views/components/composables/stores (UI wiring)
```

---

## Layer Responsibilities

### 1) `domain/` Pure rules (module-specific)

**What it is**: business rules and helpers that don’t care about Vue, Pinia, Dexie, or the browser. \
**Practical test**: this code should not require Vue reactivity, Pinia, Dexie, `window`, or `document`.

✅ Put here:
- streak calculation
- validation rules (label must not be empty)
- sorting rules
- date logic that represents a “domain day” (if needed)

⛔ Do not put here:
- Dexie queries
- anything that touches the UI
- anything that requires browser APIs

> Domain starts empty if rules are trivial. Promote logic here when it becomes reusable or complex.

---

### 2) `application/` Use-cases (queries and commands)

**What it is**: the list of things users can do, expressed as code.
- **Queries** = read data and return **view models** ready for screens.
- **Commands** = validate and write data, return minimal results (ids/flags).

✅ Put here:
- `getDailySummary` (query)
- `listActiveQuests` (query)
- `createQuest` (command)
- `completeQuest` (command)

✅ Allowed imports:
- `domain/` (rules)
- `shared/utils` (pure cross-cutting helpers)
- repository contracts (types and method shapes)

⛔ Forbidden:
- Vue components
- Pinia stores (application must be framework-agnostic)
- direct Dexie usage (that’s infrastructure)
- importing `infrastructure/` (application depends on contracts, not implementations)

> Queries return derived "screen-shaped data". View models are not persisted unless explicitly decided.

---

### 3) `infrastructure/` Persistence & adapters

**What it is**: how the app talks to the outside world. \
Right now that means **Dexie**. Later it may include HTTP sync.

✅ Put here:
- Dexie database setup (or in `shared/infra` if truly global)
- repository implementations (`dexie-quests-repository.js`)
- mapping between DB records and app types

⛔ Forbidden:
- Vue components
- view logic

---

### 4) `presentation/` UI wiring (Vue)

**What it is**: Vue components, views, composables, and Pinia stores.

✅ Put here:
- components and pages
- composables that bind UI events to use-cases
- Pinia stores for UI/session state

⛔ Forbidden:
- direct Dexie calls in components/composables/stores
- domain rules inside components (no “streak math” in the UI)

Guardrails:
- **Composables** orchestrate use-cases and handle screen-level loading/error state.
- **Stores** hold UI/session state (filters, selection, modals), not persistence logic.

---

## Repositories

Repositories isolate persistence details from use-cases.
- `src/modules/<module-name>/application/repositories/` = **contracts** (JSDoc typedef-only)
- `src/modules/<module-name>/infrastructure/repositories/` = **implementations** (Dexie now, HTTP later)

Application code depends on repository contracts, not implementations.

---

## CQRS-lite: Queries vs Commands

We use CQRS-lite as a separation of concerns, not "distributed systems CQRS".

### Queries

- Read from repositories
- Return view models ready for the UI
- Must not mutate persistent state

> View models are derived: they are not persisted unless you explicitly decide they are.

### Commands

- Validate inputs (domain rules)
- Persist via repositories
- Return minimal results

**Rule of thumb**: if it writes to Dexie, it’s a command.

---

## State Ownership Rules

### Persistent state (Dexie)

**Owner**: browser database

Examples:
- quests
- completions
- history needed after refresh

### UI/session state (Pinia)

**Owner**: current user session

Examples:
- selected date
- search/filter text
- which modal is open
- UI loading/error flags

**Antipattern**: copying "all quests" into Pinia as the authoritative store.

> Dexie is the truth: Pinia may hold temporary screen state.

---

## Shared Folder Rules

`shared/` is intentionally small. It is not a dumping ground.

Recommended layout:
```text
src/shared/
├── utils/                  # pure helpers: dates, ids, arrays, formatting
├── infra/                  # cross-cutting infra: db instance, error normalizer
└── ui/                     # optional UI primitives used across modules
```

Guidelines:
- If it's specific to one module, it belongs in that module.
- Only promote to `shared/` if it's reused by at least two modules.

---

## Import Rules (One-way dependency)

- `domain/` imports nothing from the app (except other domain/shared utils)
- `application/` imports `domain/`, `shared/utils/` and repository contracts
- `infrastructure/` imports application contracts and shared infra
- `presentation/` may import everything (composition root)

If you break these rules, the codebase becomes harder to test and refactor.

---

## Where does this code go?

Use these to decide quickly:
1. **Does it touch Dexie / IndexedDB?** \
    👉 `infrastructure/`

2. **Is it a rule or calculation that should be testable without Vue?** \
    👉 `domain/`

3. **Is it orchestration for a user action (validate → persist → return)?** \
    👉 `application/commands/`

4. **Is it shaping data for a screen (no writes)?** \
    👉 `application/queries/`

5. **Is it about UI state, events, or rendering?** \
    👉 `presentation/`

---

## Naming Conventions

- filenames: `kebab-case`
- queries: `*.query.js`
- commands: `*.command.js`
- stores: `*.store.js`
- repositories:
    - contracts: `*-repository.js` (JSDoc typedef-only)
    - implementations: `dexie-*.repository.js` (later: `http-*.repository.js`)
