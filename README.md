# 🚀 EarlyJobs.ai Mini Applicant Tracking System (ATS)

> Built by **Karra Kanaka Kalpavalli Sravani** for the **Full Stack Developer Intern** role at **EarlyJobs.ai**, Bengaluru.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://mini-ats-earlyjobs.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Tech_Stack-Next.js_16_•_React_19_•_TypeScript_•_Tailwind_v4-indigo?style=for-the-badge)](https://nextjs.org/)
[![Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge)](https://github.com/Sravani-BtechCse/mini-ats)

---

## 📌 Executive Summary

This **Mini Applicant Tracking System (ATS)** is designed specifically to meet the hiring workflow requirements of **EarlyJobs.ai**. It empowers recruitment leads, hiring managers, and interviewers to seamlessly track candidates, visualize conversion funnels across hiring stages, perform sub-millisecond multi-attribute searches, evaluate interview scorecards, and monitor talent velocity.

---

## 🌟 Key Features

### 1. 👥 Candidate Management (Full CRUD)
* **Comprehensive Profiles**: Track candidate name, contact details, role, department, experience level, expected stipend, key skills, and resume summary.
* **Add Candidate**: Modal form with real-time input validation, custom role support, and initial score assignment.
* **Edit & Progression**: 1-click stage updates and complete candidate lifecycle management.
* **Candidate Detail Drawer**: Tabbed view displaying Resume Summary, Interview Scorecards, and Stage Audit History.

### 2. 📋 Interactive Hiring Pipeline (Kanban Board)
* **Visual Stages**: 6 distinct stages (`Applied` $\to$ `Screening` $\to$ `Technical Interview` $\to$ `Offer Extended` $\to$ `Hired` $\to$ `Rejected`).
* **Drag-and-Drop & 1-Click Dropdown**: Full HTML5 drag-and-drop across columns or instant dropdown stage switcher for trackpad/mobile convenience.
* **Celebration Effects**: Confetti animation triggers when candidates reach `Offer Extended` or `Hired`!
* **Quick Metrics per Stage**: Dynamic badges showing applicant density per hiring column.

### 3. 🔍 Real-Time Search, Filtering & Sorting
* **Instant Search**: Sub-millisecond filtering across candidate names, email addresses, roles, and technical skills.
* **Multi-Criteria Filters**: Filter simultaneously by stage, department, target role, and minimum experience years.
* **Flexible Sorting**: Sort candidates by newest applied, oldest applied, rating score, or years of experience.
* **CSV Export**: 1-click export generating a formatted CSV file of candidate records.

### 4. 📊 Executive Recruitment Analytics & Dashboard
* **Primary KPI Cards**: Total Applicants, Active in Pipeline, Offers & Hires (with acceptance rate %), and Average Time-to-Hire.
* **Conversion Funnel Visualization**: Real-time visual progress bars displaying candidate volume and conversion percentages at each milestone.
* **Department & Role Breakdown**: Relative application distribution across Engineering, AI, Design, and Operations.
* **In-Demand Skills Cloud**: Aggregated frequency metrics of top applicant skillsets.
* **Live Recruitment Audit Log**: Timestamped feed of candidate stage transitions and evaluator actions.

### 5. ✉️ Communication & Interview Scorecards
* **Email Communication Simulator**: Pre-built recruitment email templates (*Technical Interview Invitation*, *Internship Offer Letter*, *Application Status Update*).
* **Interview Scorecard**: Evaluators can submit 1–5 star ratings with detailed written feedback.

---

## 🏗️ Architecture & Technology Stack

```mermaid
flowchart TD
    Client["Client Layer (React 19, Tailwind CSS v4, Lucide)"]
    Router["Next.js 16 App Router"]
    API["Full-Stack REST API Endpoints"]
    Service["Candidate Service Layer (Business Logic)"]
    DataStore["In-Memory Store with Seed Data & State Sync"]

    Client -->|User Interactions / Drag-and-Drop| Router
    Router -->|Client Side Render & Optimistic UI| Client
    Client -->|REST Requests (Fetch / JSON)| API
    API -->|Validation & Routing| Service
    Service -->|CRUD / Metrics Aggregation| DataStore
```

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Full-stack architecture, lightning-fast SSR, and instant zero-config Vercel deployment. |
| **Frontend** | **React 19 + TypeScript** | Strongly-typed component tree, zero runtime errors, and optimistic UI updates. |
| **Styling** | **Tailwind CSS v4** | Modern, responsive UI with slate/zinc styling and dark mode foundations. |
| **Icons & Effects** | **Lucide React + Canvas Confetti** | Crisp SVG iconography and delightful user celebration animations. |
| **Data & API** | **RESTful API Routes** | Clean separation of concerns with standard HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`). |

---

## 📡 REST API Reference

### 1. Candidates API

* **`GET /api/candidates`**
  * Query parameters:
    * `q`: Search string (searches name, email, role, skills)
    * `stage`: Filter by stage (`applied`, `screening`, `interview`, `offer`, `hired`, `rejected`)
    * `department`: Filter by department
    * `role`: Filter by job title
    * `minExp`: Minimum years of experience
    * `sortBy`: Sort order (`newest`, `oldest`, `rating`, `experience`)
  * Returns: `{ success: true, count: number, data: Candidate[] }`

* **`POST /api/candidates`**
  * Body: JSON payload with `name`, `email`, `role`, `department`, `stage`, `experienceYears`, `skills`, `expectedSalary`, `location`.
  * Returns: `{ success: true, message: string, data: Candidate }` (Status: 201 Created)

* **`GET /api/candidates/:id`**
  * Returns details for a single candidate.

* **`PATCH /api/candidates/:id`**
  * Update candidate stage, details, or append an interview scorecard note:
  ```json
  {
    "stage": "interview",
    "author": "Saurav (Hiring Lead)"
  }
  ```
  ```json
  {
    "action": "addNote",
    "text": "Strong problem solver with solid Next.js and API design skills.",
    "author": "CTO",
    "role": "Chief Technology Officer",
    "rating": 5
  }
  ```

* **`DELETE /api/candidates/:id`**
  * Deletes candidate record.

### 2. Metrics API

* **`GET /api/metrics`**
  * Returns aggregated metrics including `totalCandidates`, `activeInPipeline`, `offersExtended`, `hiredCount`, `stageFunnel`, `roleDistribution`, and `topSkills`.

### 3. Reset Demo API

* **`POST /api/reset`**
  * Restores database back to the 12 default realistic candidate profiles.

---

## 💻 Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sravanikarra/mini-ats.git
   cd mini-ats
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📋 Submission Checklist for EarlyJobs.ai

- [x] **Candidate Management**: Full CRUD implemented (Add, Edit, View, Delete, Notes).
- [x] **Hiring Stages**: 6-stage Kanban board with drag-and-drop and confetti animations.
- [x] **Search & Filter**: Real-time multi-filter and sort capability.
- [x] **Dashboard Metrics**: Conversion funnel, KPI cards, role distribution, and skills analytics.
- [x] **Clean Architecture**: RESTful API endpoints, TypeScript types, and responsive design.
- [x] **Ready for Deployment**: Vercel-ready with seed dataset.

---

Built with passion by **Karra Kanaka Kalpavalli Sravani**  
Visakhapatnam / Bengaluru | [LinkedIn](https://linkedin.com/in/sravanikarra) | [GitHub](https://github.com/sravanikarra)
