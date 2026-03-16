# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

UCAG (UMP Career and Admission Guide) is a Progressive Web App that helps Grade 12 learners calculate their Admission Point Score (APS) and discover qualifying courses at the University of Mpumalanga (UMP). The two main functions are:

1. **APS Calculation** — Converts subject percentages to levels (1–7) and sums the top 6 (Life Orientation excluded by default).
2. **Course Matching** — Checks each course's minimum APS (with subject-specific APS variants) and subject requirement groups against the learner's results.

## Tech Stack

- **Frontend**: React 19 + Vite (ESM, `"type": "module"`)
- **Backend**: Node.js + Express 5 (CommonJS, `"type": "commonjs"`)
- **Database**: PostgreSQL via `pg` connection pool
- **Testing**: Jest + Supertest (backend only)

## Commands

### Backend (`backend/`)

```bash
npm install          # install dependencies
npm run dev          # start with nodemon (hot reload) — runs on http://localhost:5000
npm start            # start without hot reload
npm test             # run all Jest tests
node test-db.js      # verify PostgreSQL connection
```

### Frontend (`frontend/`)

```bash
npm install          # install dependencies
npm run dev          # Vite dev server — runs on http://localhost:5173
npm run build        # production build to dist/
npm run preview      # preview production build
npm run lint         # ESLint
```

### Running a single backend test file

```bash
# from backend/
npx jest tests/apsCalculator.test.js
npx jest tests/courseMatcher.test.js
```

## Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=ucag_dev
DB_PASSWORD=yourpassword
DB_PORT=5432
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

The frontend falls back to `http://localhost:5000/api` if `VITE_API_URL` is not set.

## Architecture

### Backend Request Flow

```
server.js  →  routes/courseRoutes.js  →  controllers/courseController.js
                                               ↓
                                   utils/courseMatcher.js    (findQualifyingCourses)
                                         ↓              ↓
                              models/courseModel.js   utils/apsCalculator.js
                                         ↓
                                   config/db.js  (pg Pool)
```

All API routes are mounted under `/api`. The primary endpoint is `POST /api/calculate`, which accepts `{ subjects: [{ name, percentage }] }` and returns `{ aps, qualifying }`.

### APS Calculation Logic (`backend/utils/apsCalculator.js`)

- Percentages are converted to levels 1–7 via a fixed conversion table (80%+ = 7, 70%+ = 6, …, 0%+ = 1).
- Life Orientation is filtered out before summing (configurable via `excludeLO` parameter).
- The top 6 remaining levels are summed.

### Course Matching Logic (`backend/utils/courseMatcher.js`)

- Loads a `categoryCache` (subject → category memberships) into memory at module startup to avoid repeated DB queries.
- For each course: resolves the required APS (general, or a lower variant if the learner has a specific subject like Mathematics), then checks `requirement_groups` / `requirement_items` — each group has a `min_count` of items the learner must satisfy.
- `clearCategoryCache()` is exported for use in tests.

### Database Schema (key tables)

`faculties` → `schools` → `courses`  
`courses` has `min_aps_general` and optional `course_aps_variants` (per-subject APS overrides).  
`courses` has `requirement_groups` → `requirement_items` (each item targets either a specific `subject_id` or a `subject_categories` group via `category_id`).  
`subjects` ↔ `subject_categories` via `subject_category_members`.

### Frontend Structure

- `App.jsx` — React Router root; all pages are nested under `<Layout>` (Sidebar + Header + Outlet).
- `pages/DashboardPage.jsx` — Orchestrates the main flow: shows `SubjectInputForm`, then on submit calls `POST /api/calculate` and displays `ApsScore` + filtered `CourseCard` list.
- `services/api.js` — Centralised Axios client; all backend calls go through here.
- CSS Modules are used throughout (`*.module.css` files co-located with components).

## Branch & PR Workflow

Feature branches from `main`, e.g. `feature/aps-calculation`. Open a Pull Request describing changes before merging.
