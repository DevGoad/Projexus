# PROJEXUS // Engineering Showcase Platform

A production-ready student engineering project showcase platform connecting graduating talent with industry recruiters before the interview.

---

## Visual Design System & Engineering Blueprint Theme

- **Visual Style:** Dark navy blueprint engineering theme (`#060d1a`, `#091426`) with faint cyan/teal grid pattern lines (`32px x 32px`).
- **Typography:**
  - **Headings & Body:** Google Font **Space Grotesk** (geometric sans-serif).
  - **Labels, Metadata, Tags & Code:** Google Font **JetBrains Mono** (monospace).
- **Accent Colors:**
  - **Amber / Orange (`#f59e0b`):** Key metrics, readiness gauge ring, active highlights.
  - **Cyan / Teal (`#22d3ee`):** Eyebrow labels, links, active domain chip filters, border highlights.
- **Components:** Sharp rectangular cards with thin borders (`border border-[#162a45]`), zero rounded blobs, uppercase technical labels.

---

## Architecture & Tech Stack

### 1. Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- **Framework:** Next.js 14 (App Router) with full Server-Side Rendering (SSR) on `/` and `/projects/[id]`.
- **Client State & Data Fetching:** TanStack Query (`@tanstack/react-query`) for instant responsive search, dynamic filtering, and optimistic bookmark updates.
- **Styling:** Tailwind CSS with custom blueprint design tokens (`globals.css` and `tailwind.config.js`).
- **Role-Aware Navigation:**
  - `student`: Access to project creation, editing, and checklist management.
  - `recruiter`: Talent acquisition interface, shortlisting / saving projects, contacting teams, spec exports (cannot see or access `SUBMIT PROJECT`).
  - `admin`: Full system access, domain management, project audits.

### 2. Backend: FastAPI (Python) + SQLAlchemy + SQLite / PostgreSQL
- **Framework:** FastAPI with asynchronous lifespan initialization and automatic seeding.
- **Database:** SQLAlchemy 2.0 with zero-setup SQLite database (`projexus.db`).
- **Authentication:** JWT tokens (OAuth2 password bearer) with direct BCrypt hashing.
- **Dynamic Domains:** Backed by the `domains` database table for extensibility.
- **Live Statistics:** Computed from database on `/stats` ("Projects Listed", "Production-Ready").

---

## Production-Readiness Score Formula (100 Pts Total)

Readiness is computed deterministically from 7 standardized engineering checklist items:

| Deliverable Item | Points |
| :--- | :---: |
| **Description and problem statement complete** | 15 |
| **Team and roles listed** | 10 |
| **Demo available and verified working** | 25 |
| **Documentation / README / report uploaded** | 15 |
| **Tech stack and tags filled in** | 10 |
| **Media (screenshots/video) added** | 10 |
| **Faculty/mentor verification** | 15 |
| **Total Possible Score** | **100** |

- **Production-Ready Threshold:** Configured at **&ge; 75%**. Projects reaching this threshold earn the verified "PRODUCTION-READY" badge.

---

## Demo Engine Types

Each engineering project has an assigned `demo_type`:

1. `live_container`: Containerized software runtime with live health checks and interactive preview frame ("Launch Demo").
2. `static_web`: Client-side interactive web application with iframe test environment ("Launch Demo").
3. `video`: Verified video walkthrough capturing physical hardware runs, robotic tests, or test bench experiments.
4. `simulation_media`: Simulink / MATLAB / CFD simulation waveforms, telemetry graphs, and interactive frame gallery.
5. `model_3d`: Interactive 3D CAD / GLB geometry and exploded view viewer.

---

## Local Development Quickstart

### 1. Run the FastAPI Backend

```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate   # Windows
# or: source venv/bin/activate (Linux/Mac)

# Install requirements
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: **http://127.0.0.1:8000/docs**

### 2. Run the Next.js Frontend

```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev
```
Application available at: **http://localhost:3000**

---

## Demo Credentials

- **Recruiter Account:** `recruiter@demo.com` / `demo1234`
- **Student Account:** `student@demo.com` / `demo1234`
- **Admin Account:** `admin@projexus.io` / `admin1234`
