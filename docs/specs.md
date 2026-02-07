# Specification (v1 / MVP)

This document defines the MVP product scope and the core data model. It is intentionally short and concrete, so 
development stays focused.

---

## Product Goal

DailyQuest reduces the friction of tracking training sessions. The application stores sessions locally and enables 
progress review over time.

Primary outcomes:
- Log a workout session easily and quickly
- Track reps/sets/weights consistently
- Review history per exercise to evaluate progression
- Track which training program is being followed and for how long

---

## Constraints & Principles

- Local-first: data persists in the browser (Dexie / IndexedDB)
- Fast logging: minimal typing, minimal navigation
- Stable data model: supports progress analysis and future backend integration
- Avoid premature complexity: start with a small set of entities and expand carefully
- Explicit ordering: do not rely on creation time to order exercises/sets (use `sortIndex`)

Out of scope (for now):
- accounts/login
- cloud sync / multi-device sync
- social/sharing features
- nutrition tracking

---

## Terminology

- **Workout Session**: a performed workout on a given date
- **Exercise**: a reusable library item (e.g. "Pull-up", "Dip")
- **Session Exercise**: an exercise performed within a specific workout session
- **Set**: the atomic logged unit (reps/weight for a session exercise)
- **Program**: a training block that groups workout sessions

---

## Global Data Rules

### IDs

- All entities use `id` as UUID.

### Timestamps & deletion

- All entities include:
    - `createdAt` (timestamp)
    - `updatedAt` (timestamp)
- Deletable entities may use soft-delete:
    - `deletedAt` (timestamp, nullable)
- Soft-delete is used to keep the model compatible with future sync and to avoid "missing record" ambiguity

### Ordering

- Ordering within a parent collection is explicit:
    - `sortIndex` on session exercises orders them within a workout session
    - `sortIndex` on sets orders them within a session exercise

### Weight unit and storage

- Weight values are stored in a canonical unit: **kilograms (kg)**
- UI input/output can be in kg or lb based on user settings (conversion at the edge)
- This avoids mixed-unit history and simplifies progress analysis

---

## Core Entities

### 1) Settings

Single-record configuration.

Required fields (conceptual):
- `id` (string, fixed value e.g. `"singleton"`)
- `preferredWeightUnit` (enum: `kg | lb`)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

---

### 2) Program

Represents a training block that may span multiple workout sessions.

Required fields (conceptual):
- `id` (uuid)
- `name` (display label)
- `startedOn` (ISO date `YYYY-MM-DD`, based on local time)
- `endedOn` (ISO date `YYYY-MM-DD`, optional)
- `notes` (optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, optional)

Rules:
- A program is considered “active” when `endedOn` is null and `deletedAt` is null.
- Ending a program sets `endedOn` (does not delete).

---

### 3) Workout Session

Represents a performed workout on a given date.

Required fields (conceptual):
- `id` (uuid)
- `programId` (fk, optional)
- `performedOn` (ISO date `YYYY-MM-DD`, based on local time)
- `label` (optional: e.g. "Upper A", "Leg Day")
- `notes` (optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, optional)

Rules:
- A session can exist for any date (not only today).
- A session may exist without a program (`programId` null).

---

### 4) Exercise

Represents a canonical exercise that can be reused across workout sessions.

Required fields (conceptual):
- `id` (uuid)
- `name` (display label)
- `notes` (optional)
- `archivedAt` (timestamp, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

Rules:
- Exercises are not hard-deleted; they are archived to preserve history.
- Archived exercises cannot be selected for new sessions but remain visible in historical sessions.

---

### 5) Session Exercise

Represents an exercise performed inside one workout session.

Required fields (conceptual):
- `id` (uuid)
- `workoutSessionId` (fk)
- `exerciseId` (fk)
- `sortIndex` (number)
- `notes` (optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, optional)

Rules:
- Multiple session exercises may reference the same `exerciseId` within a single session (supports supersets / repeated blocks).

---

### 6) Set

Represents one performed set for a session exercise.

Required fields (conceptual):
- `id` (uuid)
- `sessionExerciseId` (fk)
- `sortIndex` (number)
- `reps` (integer)
- `weightKg` (number, optional)
- `notes` (optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, optional)

Rules:
- `weightKg` is stored in kilograms (canonical).
- If an exercise/set is bodyweight-only, `weightKg` may be null.
- Deleting a set is a soft-delete via `deletedAt`.

---

## Key Product Behaviours

### 1) Logging a session

The application must support:
- creating a workout session (default date = today)
- editing an existing session
- adding session exercises to the session
- reordering session exercises within the session
- adding/editing/removing sets for each session exercise
- reordering sets within a session exercise
- autosaving locally

Deletion rules:
- deleting a workout session must also delete (soft-delete) its session exercises and sets.

---

### 2) Exercise creation and selection

The application must support:
- creating exercises from the logging flow
- searching exercises by name
- archiving an exercise
- preventing archived exercises from being added to new sessions

---

### 3) Progress review (MVP)

The application must support:
- viewing history for a given exercise, ordered by session date
- showing the sets logged per session for that exercise (v1 does not require advanced analytics)

---

## Non-goals (v1)

- templates/routines
- RPE / tempo / rest timers
- PR detection
- cloud sync
