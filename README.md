# 🎓 UMP Career and Admission Guide (UCAG)

A **digital assistant** that helps **Grade 12 learners calculate their Admission Point Score (APS)** and discover **qualifying courses at the University of Mpumalanga (UMP)**.

UCAG is built as a **Progressive Web App (PWA)** using **React, Node.js, and PostgreSQL**, allowing learners to quickly determine which programs they qualify for **without manually calculating APS or navigating large PDF prospectuses**.

---

# 📘 Overview

Many learners struggle to:

- Navigate long university prospectuses
- Correctly calculate their **APS score**
- Understand **course-specific subject requirements**
- Avoid paying application fees for programs they don't qualify for

**UCAG solves this by providing:**

## ⚡ Automated APS Calculation
Instantly converts **Matric percentages into UMP APS points**.

## 🎯 Intelligent Course Matching
Displays **only the courses a learner qualifies for**.

## 📚 Subject Validation
Checks **subject-specific requirements** such as:

- Minimum Mathematics level
- Required subjects for certain degrees

## 🧑‍🎓 Course Information
Provides details including:

- Program duration
- Career opportunities
- Application deadlines

## 📱 Progressive Web App
- Works **offline**
- Can be **installed on phones and desktops**
- Fast and responsive

---

# 🛠 Tech Stack

| Layer | Technology | Why? |
|------|------------|------|
| Frontend | React + Vite | Fast development, component-based UI, huge ecosystem |
| Backend | Node.js + Express | JavaScript everywhere, lightweight, perfect for REST APIs |
| Database | PostgreSQL | Robust relational DB with strict data integrity |
| Version Control | Git + GitHub | Industry standard for collaboration |
| API Testing | Postman / Insomnia / Thunder Client | Tools to design and test endpoints |

---

# 📁 Repository Structure

```
UMP-Career-Guide/
│
├── frontend/          # React + Vite app
├── backend/           # Node.js + Express server
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started – Local Development

Follow these steps to run the project on your own machine.

---

# 🔧 Prerequisites

Make sure you have the following installed:

- **Node.js (v20 LTS or higher)**
- **PostgreSQL (v15 or higher)**
- **Git**
- **A code editor (e.g., VS Code)**

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/saxs-14/UMP-Career-Guide.git
cd UMP-Career-Guide
```

---

# 2️⃣ Set Up the Database

Open **pgAdmin** or the **psql shell**.

Create a new database:

```sql
CREATE DATABASE ucag_dev;
```

(Optional) Create a dedicated user and grant privileges.  
For development you can simply use the default **postgres** user.

---

# 3️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a **`.env`** file inside the backend folder.

Example configuration:

```
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=ucag_dev
DB_PASSWORD=yourpassword
DB_PORT=5432
```

Start the backend server:

```bash
npm run dev
```

The API will be available at:

```
http://localhost:5000
```

You should see the message:

```
UCAG Backend is running
```

---

# 4️⃣ Frontend Setup

Open a **new terminal** and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The React application will run at:

```
http://localhost:5173
```

You may later configure a **proxy** to connect API requests to the backend.

---

# 5️⃣ Verify Everything Works

Ensure both the frontend and backend are running.

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

Both should load **without errors**.

---

# 📦 Initial Project State

The first commit sets up the foundational project structure.

## Frontend
- Fresh **React application**
- Created using **Vite**

## Backend
- Basic **Express server**
- **CORS enabled**
- **Environment variables configured**
- **PostgreSQL connection pool**

## Git Setup
- Proper **.gitignore**
- Initial repository commit with project structure

---

# 🧠 Upcoming Features

Future commits will implement the core functionality:

- Database schema design
- APS calculation logic
- Course eligibility matching
- Subject requirement validation
- Course search and filtering
- Progressive Web App offline capability
- Mobile installation support

---

# 🤝 Contributing

If you are a **team member**, please follow these guidelines:

1. Create a **feature branch** from `main`
2. Make your changes and test locally
3. Commit your changes with clear messages
4. Open a **Pull Request** describing your work

Example workflow:

```bash
git checkout -b feature/aps-calculation
git add .
git commit -m "Added APS calculation logic"
git push origin feature/aps-calculation
```

External contributor guidelines will be added later.

---

# 📄 License

This project is currently for **educational and demonstration purposes**.

No official license has been applied yet.

We may add an **MIT License** in the future.

---
