# Changes: MongoDB → JSON File Storage

## Summary

The project has been simplified to use **JSON file storage** instead of MongoDB. This makes it perfect for:
- ✅ Demo/semester projects
- ✅ Quick setup (no database installation needed)
- ✅ Simple development and testing
- ✅ Easy data inspection (just open JSON files)

## What Changed

### Removed
- ❌ MongoDB/Mongoose dependency
- ❌ MongoDB connection requirements
- ❌ `MONGO_URI` environment variable

### Added
- ✅ Simple JSON file storage system (`backend/utils/storage.js`)
- ✅ Auto-created `backend/data/` directory
- ✅ Three JSON files: `users.json`, `companies.json`, `jobs.json`

### Updated Files

1. **Backend Models** (`backend/models/`)
   - Converted from Mongoose schemas to simple JavaScript classes
   - All models now use JSON file storage

2. **Backend Controllers** (`backend/controllers/`)
   - Updated to work with new model structure
   - Removed Mongoose-specific methods

3. **Database Config** (`backend/config/db.js`)
   - Now just initializes JSON storage (no connection needed)

4. **Package.json** (`backend/package.json`)
   - Removed `mongoose` dependency

5. **Environment Files**
   - Removed `MONGO_URI` requirement
   - `.env` file is now completely optional

## How It Works

1. **Data Storage**: All data is stored in JSON files in `backend/data/`
2. **Auto-creation**: Files are created automatically on first run
3. **In-memory + Persistence**: Data is loaded into memory, modified, then saved back to files
4. **Simple & Fast**: Perfect for small to medium datasets

## Benefits

- 🚀 **No Setup**: No database installation or configuration
- 📁 **Easy Inspection**: Just open JSON files to see data
- 🔄 **Simple Reset**: Delete JSON files to reset data
- 💻 **Portable**: Works anywhere Node.js runs
- 🎓 **Perfect for Learning**: Simple, understandable code

## Data Files Location

```
backend/
└── data/
    ├── users.json      # All user accounts
    ├── companies.json  # All company accounts
    └── jobs.json       # All job postings
```

## Migration Notes

If you had MongoDB data before:
- Data is not automatically migrated
- You'll need to re-register users/companies
- This is intentional for a clean demo setup

## Running the Project

Everything works the same way! Just:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

**No MongoDB needed!** 🎉

