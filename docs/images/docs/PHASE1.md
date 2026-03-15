# Phase 1: Foundation – Project Setup & Design Vision

This document records the completion of **Phase 1** of the **UMP Career and Admission Guide (UCAG)** project, as defined in the [project documentation](../README.md).  

Phase 1 focuses on establishing the **foundation of the project**, including the technology stack, development environment, and overall design vision.

---

# 1. Project Overview

![UCAG Logo](./images/logo.png)

**UCAG (UMP Career and Admission Guide)** is a digital assistant designed to help **Grade 12 learners calculate their Admission Point Score (APS)** and discover the **courses they qualify for at the University of Mpumalanga (UMP)**.

### Purpose

The platform aims to:

- Eliminate **manual APS calculation errors**
- Reduce **wasted university application fees**
- Simplify the **course selection process**
- Empower learners to make **better career decisions**

### Target Users

- Grade 12 learners in **South Africa**
- Learners interested in applying to the **University of Mpumalanga (UMP)**

---

# 2. Problem Statement (Recap)

| Problem | Description |
|------|-------------|
| Information Overload | Learners must navigate a **138-page PDF prospectus** to find admission requirements. |
| Manual Error | APS is often miscalculated using the official conversion table. |
| Ineligible Applications | Learners apply for courses they do not qualify for, wasting application fees. |
| Decision Fatigue | Many career paths and requirements make decision-making difficult. |

---

# 3. Proposed Solution

UCAG solves these problems by providing an **interactive digital tool** that includes:

### Automated APS Calculation
- Converts subject percentages to **official UMP APS points**
- Instantly calculates a learner’s **total APS score**

### Intelligent Course Matching
- Displays **only courses the learner qualifies for**

### Subject Requirement Validation
- Automatically checks **subject prerequisites**
- Example: Minimum **Mathematics level required**

### Course Information
Displays key program information:

- Course duration
- Faculty
- Career opportunities
- Minimum APS
- Application deadlines

### Progressive Web App (PWA) Features *(Future)*
- Works **offline**
- Can be **installed on phones or desktops**
- Fast loading experience

---

# 4. Technical Architecture

The UCAG system uses a **modern full-stack JavaScript architecture**.

| Layer | Technology | Justification |
|------|-------------|---------------|
| Frontend | React + Vite | Fast development, component-based UI, large ecosystem |
| Backend | Node.js + Express | Lightweight REST APIs and JavaScript across the stack |
| Database | PostgreSQL | Reliable relational database with strong data integrity |
| Version Control | Git + GitHub | Industry standard collaboration and version tracking |
| API Testing | Postman / Insomnia / Thunder Client | Easy API testing and debugging |
| Database GUI | DBeaver | Free universal database management tool |

---

# 5. Why JavaScript (React + Node.js)?

JavaScript was selected because it allows **a unified development stack**.

Benefits include:

- Same language on **frontend and backend**
- Massive **npm ecosystem**
- **Non-blocking I/O** ideal for database queries
- Widely used in **industry and startups**
- Improves **developer productivity**

---

# 6. Development Environment Setup

The following tools were installed and configured on the development machine:

| Tool | Purpose |
|-----|---------|
| Node.js (v20 LTS) | Runtime for backend and frontend tooling |
| PostgreSQL (v15) | Main relational database |
| Git | Version control |
| VS Code | Primary development environment |
| DBeaver | Database management |
| Postman | API testing |

### VS Code Recommended Extensions

- ES7 React Snippets
- Prettier
- ESLint
- Thunder Client
- PostgreSQL Extension

---

# 7. Database Setup

The development database was created as:


ucag_dev


This database will store:

- Faculties
- Courses
- Subject requirements
- APS rules

---

# 8. Repository Initialization

The GitHub repository was created and the initial project structure committed.

# Repository Setup

Clone the repository and navigate into the project folder:

```bash
git clone https://github.com/saxs-14/UMP-Career-Guide.git
cd UMP-Career-Guide
```

---

# Initial Project Structure

```
UMP-Career-Guide
│
├── frontend
├── backend
├── docs
├── images
└── README.md
```

---

# Initial Commit

```bash
git add .
git commit -m "Initial project structure: React frontend + Node backend"
git push origin main
```

---

# UI Design Inspiration

The following mockups illustrate the **intended look and feel of the application**.

These designs will guide **frontend development in Phase 3**.
![UCAG Morkup-UI](./images/ui-mockup-dashboard.png)
---

# Key Screens Visualised

## Welcome / Login (Future)

Displays a personalized greeting.

Example:

```
Welcome, John Smith!
```

---

## Dashboard

Displays:

* Calculated **APS Score**
* **Faculty filters**
* **List of qualifying courses**

---

## Course Cards

Each course card displays:

* Faculty
* Program duration
* Minimum APS requirement
* Button to **View Details**

---

## Saved Courses (Future)

Allows learners to:

* Bookmark programs
* Compare courses later

---

## Profile Settings (Future)

Learners will be able to:

* Update their subject marks
* Manage saved courses
* Track application readiness

---

# Design Philosophy

The **UCAG interface** is designed around three key principles.

## Simplicity

Clear layout for learners unfamiliar with university systems.

## Speed

Key information is visible within seconds.

## Guidance

The system helps learners make informed decisions rather than overwhelming them.

---

# What Has Been Accomplished (Phase 1)

The following milestones were successfully completed:

* Project scope and requirements defined
* Technology stack selected
* GitHub repository created
* Development tools installed
* Initial project structure created
* Logo and UI mockups added
* Phase 1 documentation written

This marks the **successful completion of Phase 1**.

---

# Next Steps – Phase 2: Backend & Database

Phase 2 will focus on building the **core backend logic**.

---

## Database Design

Creating tables for:

* Faculties
* Courses
* Subjects
* Course requirements
* APS conversion rules

---

## Data Collection

Obtaining official:

* UMP APS conversion table
* Faculty program lists
* Subject requirements

---

## Backend Development

Implementing **Node.js services** to:

* Calculate APS scores
* Validate subject requirements
* Return qualifying courses

---

## REST API Development

Endpoints to be created:

```
/api/calculate
/api/courses
/api/faculties
/api/requirements
```

---

## API Testing

Testing endpoints using:

* Postman
* Thunder Client
* Insomnia

---

## Phase 2 Documentation

Full details will be recorded in:

```
docs/PHASE2.md
```

---

# Project Development Phases

| Phase                           | Status    |
| ------------------------------- | --------- |
| Phase 1 – Foundation            | Completed |
| Phase 2 – Backend & Database    | Upcoming  |
| Phase 3 – Frontend Development  | Upcoming  |
| Phase 4 – Integration & Testing | Upcoming  |
| Phase 5 – Deployment            | Upcoming  |
| Phase 6 – Future Enhancements   | Upcoming  |

---

# Project Maintainer

**Phathutshedzo Mamagau**

Project: **UMP Career and Admission Guide (UCAG)**
Repository: **UMP-Career-Guide**
