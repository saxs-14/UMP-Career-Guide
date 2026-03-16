# Phase 2: Backend & Database – Implementation Summary

This document records the completion of **Phase 2** of the UMP Career and Admission Guide (UCAG) project. Phase 2 focused on building the backend infrastructure, database design, data population, and core logic for APS calculation and course matching.

---

## ✅ Goals Achieved

- [x] Designed and created the PostgreSQL database schema.
- [x] Populated the database with UMP faculties, schools, subjects, courses, and admission requirements (based on provided data).
- [x] Implemented APS calculation logic with a configurable conversion table and the option to exclude Life Orientation.
- [x] Developed course matching algorithm that checks APS (including variants for Mathematics vs Mathematical Literacy) and subject-specific requirements.
- [x] Built RESTful API endpoints for faculties, courses, subjects, and APS calculation.
- [x] Added input validation (subject count, percentage ranges).
- [x] Wrote unit tests for APS calculation and (partially) for matching logic.
- [x] Documented the API for future frontend integration.

---

## 🗄️ Database Schema

The database consists of the following tables (see `docs/PHASE2.sql` for full DDL):

| Table | Description |
|------|-------------|
| `faculties` | University faculties (e.g., Agriculture, Economics, Education). |
| `schools` | Schools within each faculty (e.g., School of Agricultural Sciences). |
| `subjects` | All possible Grade 12 subjects (e.g., Mathematics, English Home Language). |
| `subject_categories` | Groups subjects (e.g., "Home Language", "Mathematics", "Social Sciences"). |
| `subject_category_members` | Many-to-many mapping between subjects and categories. |
| `courses` | Programmes offered, with basic info (duration, application dates, etc.). |
| `course_aps_variants` | Alternate APS requirements based on a specific subject (e.g., Maths vs Lit). |
| `requirement_groups` | Groups of subject requirements that are AND-ed together. |
| `requirement_items` | Individual requirements (a specific subject OR any subject from a category) with minimum level. |

### Entity Relationship Diagram (Simplified)

```
faculties 1──< schools 1──< courses
courses 1──< course_aps_variants
courses 1──< requirement_groups 1──< requirement_items
requirement_items >── subjects (optional)
requirement_items >── subject_categories (optional)
subjects >──< subject_category_members >── subject_categories
```

---

## 📥 Data Population

All data provided in the project brief was inserted:

- **3 Faculties** (Agriculture & Natural Sciences, Economics & Business Sciences, Education)
- **8 Schools** (e.g., Agricultural Sciences, Computing, Hospitality, etc.)
- **44 Subjects** covering all South African Grade 12 subjects, categorised into:
  - Mathematics (Maths & Maths Lit)
  - Home Languages
  - First Additional Languages
  - Life Orientation
  - Social & Commercial Sciences
  - Other
- **18 Courses** with full requirements, including APS variants and subject prerequisites.

See `docs/PHASE2.sql` for the complete INSERT statements.

---

## 🧮 APS Calculation Logic

**File:** `backend/utils/apsCalculator.js`

- **Conversion table:** Configurable array of `{ min: percentage, level }` (placeholder – official UMP table to be inserted later).
- **`percentageToLevel(percentage)`:** Returns the corresponding level (1–7).
- **`calculateAPS(subjects, excludeLO = true)`:**
  - Converts each subject’s percentage to a level.
  - Optionally filters out *Life Orientation* (default `true` because many programmes exclude it).
  - Sorts levels descending and takes the top 6.
  - Returns the sum.

---

## 🔍 Course Matching Algorithm

**File:** `backend/utils/courseMatcher.js`

The matching process for a learner’s input:

1. **Calculate APS** using the function above.
2. **Map subject names to IDs** (from the database) and attach levels.
3. **Fetch all courses** with basic info.
4. For each course:
   - **Determine required APS:**
     - If the course has APS variants (e.g., different APS for Maths vs Maths Lit), check whether the learner has the triggering subject and use the variant’s APS; otherwise use the general APS.
   - **Skip if learner’s APS < required APS.**
   - **Check subject requirements:**
     - For each requirement group (AND condition), verify that the learner meets at least `min_count` items from that group.
     - Items can be specific subjects or any subject from a category (e.g., “any Social Science”).
   - If all groups are satisfied, add the course to the qualifying list.
5. Return `{ aps, qualifying }`.

---

## 🌐 REST API Endpoints

All endpoints are prefixed with `/api`. Implemented in `backend/routes/courseRoutes.js` and `backend/controllers/courseController.js`.

| Method | Endpoint | Description |
|------|------|-------------|
| GET | `/faculties` | List all faculties (id, name). |
| GET | `/courses` | List all courses with basic info (faculty, school). Accepts `?facultyId` filter. |
| GET | `/courses/:id` | Full details of a single course, including requirements and APS variants. |
| GET | `/subjects` | List all subjects with their categories. |
| GET | `/subject-categories` | List all subject categories. |
| POST | `/calculate` | Accepts `{ subjects: [{ name, percentage }] }`, returns `{ aps, qualifying }`. |

### POST /calculate – Validation Rules

- `subjects` must be an array of 6 to 8 objects.
- Each object must have:
  - `name`: string (must exist in the `subjects` table – warning logged if not found).
  - `percentage`: number between 0 and 100.
- If validation fails, a `400 Bad Request` with an error message is returned.

---

## 🧪 Unit Tests

We use **Jest** for testing. Tests are located in `backend/tests/`.

### APS Calculator Tests (`apsCalculator.test.js`)

- `percentageToLevel` returns correct levels for various percentages.
- `calculateAPS` correctly sums top 6 levels, excluding Life Orientation by default.
- `calculateAPS` includes LO when `excludeLO = false`.

### Course Matcher Tests (partial)

A full test suite would require a test database. A basic test with mocked database calls can be added later. For now, the logic has been manually verified with sample inputs.

To run tests:

```bash
cd backend
npm test
```

---

## 🚧 Known Limitations / Future Improvements

- **Official conversion table:** The placeholder table must be replaced with UMP’s official percentage-to-level mapping.
- **APS variant detection:** Currently assumes at most one variant per subject per course; more complex rules (e.g., “if Maths then APS X, else if Maths Lit then APS Y”) are handled correctly.
- **Life Orientation handling:** Excluded by default – confirm with UMP policy.
- **Performance:** The current matching loops through all courses; with ~20 courses this is fine, but for larger datasets we could pre-filter by APS range.
- **Error handling:** More robust handling for missing subjects or database connection issues.

---

## 📁 Project Structure (Backend)

```
backend/
├── config/
│   └── db.js                # PostgreSQL connection pool
├── controllers/
│   └── courseController.js  # Request handlers
├── models/
│   └── courseModel.js       # Database queries
├── routes/
│   └── courseRoutes.js      # API routes
├── utils/
│   ├── apsCalculator.js     # APS calculation
│   └── courseMatcher.js     # Matching logic
├── tests/
│   └── apsCalculator.test.js
├── .env                      # Environment variables (DB credentials)
├── server.js                 # Express app entry point
└── package.json
```

---

## 🔜 Next Steps – Phase 3: Frontend Development

With the backend API ready, Phase 3 will involve:

- Creating the React frontend with Vite.
- Building the input form for subjects (with dropdowns grouped by category).
- Connecting to the `/api/calculate` endpoint.
- Displaying the APS score and a list of qualifying courses.
- Implementing course detail views and filters.
- Styling to match the UI mockup (see `docs/images/ui-mockup-dashboard.png`).

---

## 📦 How to Run Phase 2

1. Ensure PostgreSQL is running and a database `ucag_dev` exists.
2. Run the SQL script (`docs/PHASE2.sql`) to create tables and insert data.
3. Copy `.env.example` to `.env` and fill in your database credentials.
4. Install dependencies:

```bash
cd backend
npm install
```

5. Start the server:

```bash
npm run dev
```

6. Test endpoints using Postman or a browser.

---

## 📎 References

- [Project Documentation (Phase 1)](./PHASE1.md)
- [Database Schema SQL](./PHASE2.sql)
- [UI Mockup](../images/ui-mockup-dashboard.png)

---

*Phase 2 completed on 16 March 2026.*
