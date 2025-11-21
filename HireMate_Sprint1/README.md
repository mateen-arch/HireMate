# HireMate - AI-Powered Job Recruitment and Interview Platform

## Project Overview

HireMate is a unified platform that combines job portal functionality with AI-powered interview capabilities. This project merges two existing systems:
- **Job Portal System**: Complete job posting, searching, and application management
- **AI Interview Assistant**: Virtual interview system with voice conversation (reserved for future sprints)

## Current Sprint: Sprint 1 - User Onboarding & Job Posting

**Duration**: 2 Weeks (10 working days + 2 buffer days)

### Sprint 1 Goals

Build the core foundation of the HireMate system with the following features:

- ✅ **HM-01**: User Registration (Job Seeker)
- ✅ **HM-02**: Company Registration
- ✅ **HM-03**: Job Posting
- ✅ **HM-04**: Job Search
- ✅ **HM-24**: View Job Details
- ✅ **HM-25**: Job Category Filter

## Project Structure

```
HireMate_Sprint1/
├── backend/
│   ├── config/
│   │   └── db.js              # JSON storage initialization
│   ├── utils/
│   │   └── storage.js          # JSON file storage utilities
│   ├── data/                   # JSON data files (auto-created)
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── company.controller.js
│   │   └── job.controller.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Company.model.js
│   │   └── Job.model.js
│   ├── routes/
│   │   ├── user.route.js
│   │   ├── company.route.js
│   │   └── job.route.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── server.js              # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   └── PostJob.jsx
│   │   ├── utils/
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── ai_interviewer/            # AI Interview Assistant (for future sprints)
└── README.md
```

## Data Storage

**Simple JSON File Storage** - No database required!

All data is stored in JSON files in `backend/data/`:
- `users.json` - User accounts
- `companies.json` - Company accounts
- `jobs.json` - Job postings

### Data Structure

**User:**
```javascript
{
  id: String,
  name: String,
  email: String,
  password: String (hashed),
  role: String ('job_seeker' or 'company'),
  createdAt: String,
  updatedAt: String
}
```

**Company:**
```javascript
{
  id: String,
  companyName: String,
  email: String,
  password: String (hashed),
  description: String,
  jobPosts: [String] (array of job IDs),
  createdAt: String,
  updatedAt: String
}
```

**Job:**
```javascript
{
  id: String,
  title: String,
  description: String,
  category: String,
  companyId: String,
  location: String,
  salary: String,
  datePosted: String,
  createdAt: String,
  updatedAt: String
}
```

## API Endpoints

### Authentication & User Management
- `POST /api/register` - User Registration (HM-01)
- `POST /api/register/login` - User Login
- `POST /api/register/logout` - User Logout

### Company Management
- `POST /api/company/register` - Company Registration (HM-02)
- `GET /api/company` - Get All Companies
- `GET /api/company/:id` - Get Company by ID

### Job Management
- `POST /api/jobs` - Post Job (HM-03) [Protected]
- `GET /api/jobs` - Get All Jobs with Search & Filter (HM-04, HM-25)
  - Query params: `keyword`, `category`
- `GET /api/jobs/:id` - Get Job by ID (HM-24)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- **No database required!** Uses simple JSON file storage

### Backend Setup

1. Navigate to the backend directory:
```bash
cd HireMate_Sprint1/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (optional):
```env
JWT_SECRET=demo_secret_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Note:** The `.env` file is optional. If not provided, the app will use default values. No MongoDB connection needed!

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd HireMate_Sprint1/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing Flow

### 1. Register a Company
1. Navigate to `/register`
2. Select "Company" tab
3. Fill in company details
4. Submit registration

### 2. Post a Job
1. Navigate to `/post-job`
2. Fill in job details
3. Select the company
4. Submit job posting

### 3. Register a User (Job Seeker)
1. Navigate to `/register`
2. Select "Job Seeker" tab
3. Fill in user details
4. Submit registration

### 4. Search Jobs
1. Navigate to `/jobs`
2. Use the search bar to search by keyword
3. Use the category filter to filter by category

### 5. View Job Details
1. Click on any job card from `/jobs`
2. View complete job details on `/job/:id`

## Technology Stack

### Backend
- **Node.js** with Express.js
- **JSON File Storage** (simple, no database needed!)
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** 18
- **React Router** for routing
- **Vite** as build tool
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications

## Sprint 1 Completed Features

✅ **HM-01**: User Registration
- Job seekers can register with name, email, and password
- Role-based registration (job_seeker or company)

✅ **HM-02**: Company Registration
- Companies can register with company name, email, password, and description
- Separate registration flow for companies

✅ **HM-03**: Job Posting
- Authenticated users can post jobs
- Jobs include title, description, category, location, and salary

✅ **HM-04**: Job Search
- Search jobs by keyword (title or description)
- Real-time search functionality

✅ **HM-24**: View Job Details
- Detailed job view page
- Shows company information, job description, and all job details

✅ **HM-25**: Job Category Filter
- Filter jobs by category
- Dynamic category list based on available jobs

## Definition of Done (DoD)

✅ User and company registration working end-to-end
✅ Job posting, search, and filtering functional
✅ Job details page linked to search results
✅ Clean integrated code (no duplication/conflicts)
✅ Successfully runs locally via npm run dev

## Future Sprints

- **Sprint 2**: AI Interview Integration
  - Integrate AI Interview Assistant from `ai_interviewer/` folder
  - Schedule interviews
  - Conduct virtual interviews

- **Sprint 3**: Application Management
  - Job application submission
  - Application tracking
  - Application status updates

## Sprint 2 Kickoff – Automated Recruitment Workflow

Sprint 2 introduces the automated pipeline that the user story above outlines. Phase 1 is now available in the backend:

- **CV Upload & Submission** – `POST /api/applications/submit` accepts authenticated job seekers, stores CV files under `backend/uploads/cvs`, and persists application metadata in JSON storage.
- **AI-lite CV Parsing** – `services/cvParser.js` extracts skills, experience, education, and certifications from PDF/DOCX resumes using `pdf-parse` and `mammoth`.
- **Qualification Matching** – `services/qualificationMatcher.js` compares parsed data with job requirements, calculates weighted scores, and auto-assigns statuses (`REJECTED`, `PENDING_REVIEW`, `QUALIFIED_FOR_INTERVIEW`).
- **Application Insights** – `applicationDetails.json` and `qualificationLogs.json` capture parsed summaries and audit decisions for transparency.
- **Qualified Applicants API** – `GET /api/applications/qualified/:job_id` lets company dashboards fetch candidates who passed screening, including parsed skill highlights and CV scores.

> **Next steps:** Phase 2 (AI interviewer), N8N orchestration, dashboards, and notifications will build on these foundations.

### Phase 2 Preview – AI Interviewer Integration
- Stand up `/services/aiInterviewer.js` to wrap OpenAI/Claude question generation plus scoring helpers.
- Create interview persistence via `interviews.json` & `interviewQuestions.json` with controllers/routes under `/api/interviews`.
- Build first-phase conversation flow (schedule, fetch questions, submit answer, complete interview) and reuse qualification logs for AI evaluations.
- Add `interviewEvaluator` service to aggregate CV + AI scores and update application statuses (`READY_FOR_HUMAN_INTERVIEW`).

## Sprint 2 Deliverables – Automated Workflow (Implemented)

- **Phase 1 & 2 Backends**
  - `/api/applications/submit` ingests files, parses CVs, emails applicants, logs decisions, and triggers N8N webhooks.
  - `/api/interviews/*` endpoints schedule AI sessions, stream tailored questions, auto-score replies, and combine scores using `interviewEvaluator`.
  - Automation hooks post to `N8N_APPLICATION_WEBHOOK`, `N8N_INTERVIEW_WEBHOOK`, and `N8N_STATUS_WEBHOOK` for orchestration.
  - `services/emailService.js` + `/templates/emails/*` provide reusable HTML templates for each lifecycle update.

- **Dashboards & UI**
  - `ApplyJob`, `MyApplications`, `AiInterview`, and `CompanyQualified` pages expose submission, tracking, interview, and recruiter insights respectively.
  - Chart.js pipeline visualization is served via `GET /api/analytics/hiring-pipeline/:job_id`.
  - Company dashboard pulls from `GET /api/applications/qualified/:job_id` and `GET /api/applications/top-candidates/:job_id`.

- **Notifications & Testing**
  - All major transitions (submission, screening, interview invite/results, final decisions) send nodemailer-based emails.
  - N8N webhooks receive structured payloads for each event type.
  - `node --test` qualification matcher specs cover rejection, borderline review, and shortlist paths.

## Contributing

This is a semester project. For contributions or questions, please contact the project team.

## License

MIT License

## Authors

HireMate Development Team

---

**Note**: This is Sprint 1 of the HireMate project. The AI Interview Assistant functionality is reserved for future sprints and is currently stored in the `ai_interviewer/` folder.

