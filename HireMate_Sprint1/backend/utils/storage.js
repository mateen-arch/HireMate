import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const APPLICATION_DETAILS_FILE = path.join(DATA_DIR, 'applicationDetails.json');
const QUALIFICATION_LOGS_FILE = path.join(DATA_DIR, 'qualificationLogs.json');
const INTERVIEWS_FILE = path.join(DATA_DIR, 'interviews.json');
const INTERVIEW_QUESTIONS_FILE = path.join(DATA_DIR, 'interviewQuestions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty files if they don't exist
const initFile = (filePath, defaultValue = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
};

// Initialize all data files
initFile(USERS_FILE, []);
initFile(COMPANIES_FILE, []);
initFile(JOBS_FILE, []);
initFile(APPLICATIONS_FILE, []);
initFile(APPLICATION_DETAILS_FILE, []);
initFile(QUALIFICATION_LOGS_FILE, []);
initFile(INTERVIEWS_FILE, []);
initFile(INTERVIEW_QUESTIONS_FILE, []);

// Read data from file
export const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write data to file
export const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// User storage functions
export const getUsers = () => readData(USERS_FILE);
export const saveUsers = (users) => writeData(USERS_FILE, users);

// Company storage functions
export const getCompanies = () => readData(COMPANIES_FILE);
export const saveCompanies = (companies) => writeData(COMPANIES_FILE, companies);

// Job storage functions
export const getJobs = () => readData(JOBS_FILE);
export const saveJobs = (jobs) => writeData(JOBS_FILE, jobs);

// Application storage
export const getApplications = () => readData(APPLICATIONS_FILE);
export const saveApplications = (applications) => writeData(APPLICATIONS_FILE, applications);

// Application details
export const getApplicationDetails = () => readData(APPLICATION_DETAILS_FILE);
export const saveApplicationDetails = (details) => writeData(APPLICATION_DETAILS_FILE, details);

// Qualification logs
export const getQualificationLogs = () => readData(QUALIFICATION_LOGS_FILE);
export const saveQualificationLogs = (logs) => writeData(QUALIFICATION_LOGS_FILE, logs);

// Interview storage (Phase 2+)
export const getInterviews = () => readData(INTERVIEWS_FILE);
export const saveInterviews = (records) => writeData(INTERVIEWS_FILE, records);
export const getInterviewQuestions = () => readData(INTERVIEW_QUESTIONS_FILE);
export const saveInterviewQuestions = (records) => writeData(INTERVIEW_QUESTIONS_FILE, records);

// Initialize storage
export const initStorage = () => {
  console.log('✅ JSON Storage initialized');
  console.log(`📁 Data directory: ${DATA_DIR}`);
};

