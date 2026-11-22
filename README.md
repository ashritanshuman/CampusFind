# CampusFind 🎓
### Smart Campus Lost & Found Management Platform
> **Enterprise Full-Stack Web Application for University Campuses**  
> Streamlined Item Recovery, Transparent Multi-Factor Matching, and QR Code Custody Verification

---

## 🌟 Overview

**CampusFind** is an enterprise-grade, responsive full-stack platform designed to eliminate the chaos of lost and misplaced belongings across college campuses. It bridges the gap between students who lose items and good Samaritans or security staff who find them.

### Key Innovations
- 🧠 **Rule-Based Smart Item Matching**: An automated scoring engine that computes weighted similarity (category, keywords, color, location, date proximity) to proactively suggest potential matches between lost and found items.
- 📱 **QR-Code Item Tagging & Verification**: Generates tamper-resistant QR codes for found items deposited at campus security/desks, allowing verified ownership claims without publicly exposing sensitive item identifiers.
- 🛡️ **Role-Based Governance (RBAC)**: Secure separation between Student and Administrative workflows, complete with audit remarks, claim reviews, and platform analytics.

---

## 🎨 Brand & Design System

CampusFind adheres to a modern, human-centric SaaS dashboard aesthetic:
- **Primary Brand Color**: `#004953` (Deep Teal) — Navbar, primary buttons, headings
- **Secondary Brand Color**: `#EFDECD` (Warm Beige) — Badges, accents, highlights
- **Canvas / Background**: `#FAF8F5` (Light Pearl)
- **Text Primary**: `#183438` (Deep Charcoal Slate)
- **Text Muted**: `#687B7D` (Slate Grey)
- **Success / Warning / Error**: `#23865B` / `#D99A36` / `#C84B4B`

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, CSS3 (Modern Flexbox & CSS Grid, Custom Variables), Vanilla JavaScript (ES6+) |
| **Backend** | Node.js, Express.js (Modular Controllers, Routes, Middleware, Services) |
| **Database** | MySQL 8.0, `mysql2` connection pool |
| **Authentication** | JSON Web Tokens (JWT), `bcryptjs` password hashing |
| **File Storage** | `multer` for secure item photograph uploads |
| **QR Code Engine** | `qrcode` for unique claim tokens and item tagging |
| **Analytics & Visuals** | Chart.js for admin metrics and reporting trends |

---

## 📁 Project Architecture

```
CampusFind/
│
├── frontend/                     # Pure HTML5, CSS3, and Vanilla JavaScript UI
│   ├── index.html                # Public Landing Page
│   ├── pages/                    # Multi-page Student & Admin views
│   ├── css/                      # Modular CSS with variables & responsive styles
│   ├── js/                       # Modular client scripts, auth, and API handlers
│   └── assets/                   # Logos, icons, and illustrations
│
├── backend/                      # Node.js & Express.js REST API Server
│   ├── server.js                 # Server entry point
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variable template
│   ├── config/                   # MySQL connection pool
│   ├── controllers/              # Route business logic handlers
│   ├── routes/                   # RESTful API route definitions
│   ├── middleware/               # Auth, role check, and upload middlewares
│   ├── services/                 # Rule-based matching, QR generator, notifications
│   └── uploads/                  # Uploaded item photographs
│
├── database/                     # MySQL Relational Schema & Seed Data
│   ├── schema.sql                # Complete DDL schema with constraints & indexes
│   ├── seed.sql                  # Realistic college campus sample dataset
│   └── README.md                 # Database setup and execution instructions
│
├── docs/                         # Comprehensive Academic & Technical Docs
│   ├── project-overview.md       # High-level architecture and PBL relevance
│   ├── api-documentation.md      # Full REST API endpoints specification
│   ├── database-design.md        # ER diagram, schema relations & normalization
│   └── setup-guide.md            # Step-by-step local setup guide
│
├── .gitignore                    # Ignored files (node_modules, .env, uploads)
└── README.md                     # Project documentation root
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MySQL Server** (v8.0 or XAMPP / MariaDB)

---

### 1. Configure Environment Variables
Navigate to the `backend/` directory and configure the environment:
```bash
cd backend
cp .env.example .env
```
Ensure your MySQL credentials (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) match your local MySQL configuration in `backend/.env`.

---

### 2. Install Dependencies
Inside the `backend/` directory:
```bash
npm install
```

---

### 3. Initialize & Seed Database
Run the automated initialization script to create the database (`campusfind_db`), apply schema DDL, and populate demonstration seed data:
```bash
npm run db:setup
```
*(Alternatively, import manually via MySQL client: `mysql -u root -p < ../database/schema.sql && mysql -u root -p < ../database/seed.sql`)*

---

### 4. Start Backend Server
From the `backend/` directory:
```bash
# Production start
npm start

# Or development mode with auto-reload (nodemon)
npm run dev
```
The backend server runs at **`http://localhost:5000`**.
- Health Check: `http://localhost:5000/api/health`
- API Overview: `http://localhost:5000/api`

---

### 5. Launch Frontend Application
You can access the frontend in either of two ways:

#### Option A: Directly via Backend (Recommended & Easiest)
Since Express serves the static `frontend/` files out of the box, simply open:
👉 **`http://localhost:5000`** in your browser.

#### Option B: Standalone Static Server (Port 5500)
From the project root directory:
```bash
# Using npx serve
npx serve frontend -p 5500 --no-clipboard

# Or using Python 3
python3 -m http.server 5500 --directory frontend
```
👉 Open **`http://localhost:5500`** in your browser.

---

### 🔑 Demo Login Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Student** | Alex Patel | `alex.patel@campus.edu` | `Password123!` |
| **Student** | Priya Sharma | `priya.sharma@campus.edu` | `Password123!` |
| **Admin** | Campus Security | `admin@campusfind.edu` | `AdminMaster2026!` |

---

## 📅 Development Roadmap (10 Phases)

- [x] **Phase 1**: Project Setup, Folder Architecture, Brand Variables, Express Server Baseline
- [x] **Phase 2**: UI/UX & Frontend Foundation (Landing, Auth, Responsive Design)
- [x] **Phase 3**: MySQL Database Schema, Connection Pool, and Seed Dataset
- [x] **Phase 4**: JWT Authentication, Role-based Middleware & Profile APIs
- [x] **Phase 5**: Lost and Found Item Management with Multer Uploads
- [x] **Phase 6**: Rule-Based Smart Item Matching Engine
- [x] **Phase 7**: Ownership Claims Workflow & QR Code Verification System
- [x] **Phase 8**: Student & Admin Dashboards with Chart.js Analytics
- [x] **Phase 9**: Full End-to-End Integration, Validation & Security Audit
- [x] **Phase 10**: Polishing, Demonstration Readiness & Academic Presentation Pack (`CampusFind_PBL_Report.docx`, `CampusFind_PBL_Presentation.pptx`)

---

## 👨‍💻 Academic Information
- **Course**: B.Tech Computer Science & Engineering
- **Subject**: Web Technology Project-Based Learning (PBL)
- **Year / Semester**: 2nd Year / 4th Semester

---

## 🔧 Troubleshooting

### ❌ EADDRINUSE — Port already in use

```
Error: listen EADDRINUSE: address already in use :::5000
```

Another process is still holding port 5000 (usually a zombie server left after closing the terminal).

**Windows (PowerShell):**
```powershell
netstat -ano | findstr :5000   # find the PID in the last column
taskkill /PID <pid> /F         # replace <pid> with the number found above
```
Or use the helper script from the `backend/` folder:
```bash
npm run free-port
```

**macOS / Linux:**
```bash
lsof -i :5000   # find the PID
kill -9 <pid>
```

> **Prevention:** Always stop the server with **Ctrl + C**. Do NOT just close the terminal window — this may leave an orphan process holding the port.

---

### 🔄 Changing the Port

1. Open `backend/.env` and set `PORT=5001` (or any free port).
2. Restart the server: `npm run dev` from `backend/`.
3. Access the app at **`http://localhost:5001`** — the frontend auto-detects the port.

---

### 🔒 EACCES — Permission denied on port

Ports below 1024 are restricted. Set a port > 1024 in `backend/.env`:
```
PORT=5000
```

---

### 🛢️ ECONNREFUSED / "Access denied for user" (MySQL)

MySQL is not running or the credentials are wrong.

1. **Start MySQL:**
   - Windows (XAMPP): Start the MySQL service in the XAMPP control panel.
   - Windows (MySQL 8): `net start MySQL80` in an elevated PowerShell.
   - Linux: `sudo service mysql start`

2. **Verify credentials** in `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=campusfind_db
   ```

3. **MySQL 8 auth mode error** (`ER_NOT_SUPPORTED_AUTH_MODE`):
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   FLUSH PRIVILEGES;
   ```

4. **Re-create the database:**
   ```bash
   cd backend
   npm run db:setup
   ```

---

### 🌐 CORS Errors in Browser Console

```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5500' has been blocked by CORS policy
```

Add your frontend origin to `CORS_ORIGINS` in `backend/.env`:
```
CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```
Then restart the server.

---

### 🔐 JWT_SECRET Missing

```
[FATAL CONFIG ERROR]: JWT_SECRET is not defined!
```

Add a secret to `backend/.env`:
```
JWT_SECRET=campusfind_super_secure_jwt_secret_key_change_in_production_2026
```

---

### 🛑 How to Stop the Server Properly

Press **Ctrl + C** in the terminal where `npm run dev` / `npm start` is running. The server will close the HTTP listener, release the MySQL pool, and exit cleanly.

**Do NOT** just close the terminal window — the Node process may keep running in the background and hold the port.

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DB_HOST` | `mysql-29ec902d-ashritunofficial-f282.b.aivencloud.com` |
| `DB_PORT` | `15415` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | `AVNS_RX6AsSWIEU16kI9OBQs` |
| `DB_NAME` | `defaultdb` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | `campusfind_super_secure_jwt_secret_key_change_in_production_2026` |
| `CORS_ORIGINS` | `https://campusfind.onrender.com,http://localhost:5000` (replace with your actual Render URL once generated) |