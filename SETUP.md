# Quick Setup Guide

## Prerequisites
- Node.js (v16+) installed
- **No database required!** Uses simple JSON file storage
- Git (optional)

## Step-by-Step Setup

### 1. Install Dependencies

From the root directory (`HireMate_Sprint1`):

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Or install separately:
npm run install:backend
npm run install:frontend
```

### 2. Configure Backend

1. Navigate to `backend/` directory
2. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
3. Edit `.env` and update (all optional):
   - `JWT_SECRET` - Secret key for JWT tokens (default: "demo_secret_key")
   - `PORT` - Backend port (default: 5000)
   - `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
   
   **Note:** You can skip creating `.env` file - the app will work with defaults!

### 3. Configure Frontend (Optional)

1. Navigate to `frontend/` directory
2. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
3. Edit `.env` if you need to change the API URL (default: http://localhost:5000/api)

### 4. Run the Application

**No database setup needed!** Data will be stored in JSON files automatically.

**Option 1: Run from root (recommended for development)**

Open two terminal windows:

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

**Option 2: Run separately**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Testing the Application

### Test Flow:

1. **Register a Company**
   - Go to http://localhost:5173/register
   - Click "Company" tab
   - Fill in company details and register

2. **Post a Job**
   - Go to http://localhost:5173/post-job
   - Fill in job details
   - Select the company you just created
   - Submit

3. **Register a User (Job Seeker)**
   - Go to http://localhost:5173/register
   - Click "Job Seeker" tab
   - Fill in user details and register

4. **Browse Jobs**
   - Go to http://localhost:5173/jobs
   - Use search bar to search jobs
   - Use category filter to filter by category

5. **View Job Details**
   - Click on any job card
   - View complete job information

## Troubleshooting

### Data Not Persisting
- Check that `backend/data/` directory exists and is writable
- JSON files are created automatically on first run

### Port Already in Use
- Change the `PORT` in backend `.env` file
- Update `FRONTEND_URL` if you change the port

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that both servers are running

### Module Not Found
- Run `npm install` in the respective directory (backend or frontend)
- Delete `node_modules` and `package-lock.json`, then reinstall

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Next Steps

After setup, refer to the main [README.md](./README.md) for:
- API documentation
- Database structure
- Sprint 1 features
- Future sprint plans

