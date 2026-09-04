# SkillMatch — Academia-Industry Placement & Skill Mapping SaaS Portal

A responsive, production-ready SaaS web portal for academia-industry skill mapping, student readiness diagnostics, recruiter talent screening, and college TPO intervention management.

---

## 🚀 Quick Start

The Vite development server is running locally on port `5174`:

- **Live URL**: [http://127.0.0.1:5174/](http://127.0.0.1:5174/)

To start or rebuild the project manually:
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
cd skillmatch-portal
npm.cmd run dev
```

To run a production build:
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
npm.cmd run build
```

---

## 🌟 Key Architecture & Persona Views

### Persistent 260px Left Sidebar
- **Brand Identity**: SkillMatch with animated dynamic network nodes icon and `PRO` badge.
- **Instant Role Switcher**:
  - `[Switch to: Student View | Recruiter View | College TPO View]`
- **Navigation Links**:
  - `Dashboard`, `Skill Mirror Diagnostic`, `Job Feed`, `Campus Workshops`, `Analytics`, `Settings`
- **Bottom User Profile**:
  - Displays avatar, name, department/company, and role badge (Aarav Sharma for Student, Priya Nair for Recruiter, Dr. K. Venkat for TPO).

---

### Page 1: Student Dashboard
1. **Top Stats Row**:
   - **Overall Readiness Index**: Animated Circular SVG dial at **82%** with glowing emerald stroke.
   - **Matched Internships Available**: **14 roles** surpassing the >70% match threshold.
   - **Skills Verified vs. Gap Alert**: **9 Verified | 3 Deficits**.
2. **The Skill Mirror Diagnostic (2-Column Grid)**:
   - **Left Column**: Target Role Dropdown ("Full-Stack Web Intern @ PhonePe"), Comparison Badge Matrix (Green Matched vs. Red Missing), Dynamic score bar with **74% Match Compatibility**.
   - **Right Column**: "Bridge the Gap" Resource Pipeline with 3 targeted action cards:
     - [Free Video] *PostgreSQL Indexing & Optimization in 45 Mins* (FreeCodeCamp link badge).
     - [Campus Event] *Weekend Docker Hands-On Lab* (College CS Dept).
     - [Doc / Cheat Sheet] *Redis Caching Patterns PDF*.
     - **Unlock 1-Click Apply Button**: Displays interactive disabled threshold state (*"Learn 1 more skill to reach 80% threshold"*).
3. **Active Applications Web Table**:
   - Full-width table with Company, Position, Match Score %, Date Applied, Real-time Status Badges, and Thread View.

---

### Page 2: Recruiter / Industry Dashboard
1. **Header Action**:
   - **"Post New Internship Opening"** button opening a modal with job title, stipend, location, and taggable skill chips.
2. **Web Talent Grid (3-Column Layout)**:
   - Candidate cards ranked strictly by Match % (e.g. **94%**, **88%**, **82%**).
   - Displays student name, batch, verified GitHub badge, and matched skills chips.
   - Action buttons:
     - **View Match Report**: Opens a slide-over drawer with deep skill radar, code assessment score (96/100), verified commit activity, and "Schedule Interview".
     - **Direct Shortlist**: Live toggle that updates review pipeline and fires toast feedback.

---

### Page 3: College TPO / Admin Dashboard
1. **Macro Placement Health Analytics**:
   - Visual bar chart displaying **"Top Curriculum Gaps vs. Industry Demand"** (e.g., 68% of 3rd years lack Cloud Deployments).
2. **Actionable Departmental Intervention Panel**:
   - Table of departments (Computer Science, Information Technology, AI & Data Science) with a **"Trigger Remedial Training"** button next to each missing industry skill.
   - Clicking triggers a live toast and updates the scheduled workshop status.
