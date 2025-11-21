# Sprint 1 Testing Plan

## Features to Test

| ID    | Title                | Test Cases |
| ----- | -------------------- | ---------- |
| HM-01 | User Registration    | Test job seeker registration |
| HM-02 | Company Registration | Test company registration |
| HM-03 | Job Posting          | Test posting a job |
| HM-04 | Job Search           | Test searching jobs by keyword |
| HM-24 | View Job Details     | Test viewing job details |
| HM-25 | Job Category Filter  | Test filtering by category |

## Test Checklist

### HM-01: User Registration
- [ ] Navigate to /register
- [ ] Select "Job Seeker" tab
- [ ] Fill in name, email, password
- [ ] Submit registration
- [ ] Verify success message
- [ ] Verify redirect to login
- [ ] Test validation (empty fields, invalid email, short password)
- [ ] Test duplicate email error

### HM-02: Company Registration
- [ ] Navigate to /register
- [ ] Select "Company" tab
- [ ] Fill in company name, email, password, description
- [ ] Submit registration
- [ ] Verify success message
- [ ] Verify redirect to login
- [ ] Test validation
- [ ] Test duplicate company name/email error

### HM-03: Job Posting
- [ ] Login as a user (or skip auth for now)
- [ ] Navigate to /post-job
- [ ] Fill in all required fields
- [ ] Select a company
- [ ] Submit job posting
- [ ] Verify success message
- [ ] Verify job appears in jobs list
- [ ] Test validation (empty required fields)

### HM-04: Job Search
- [ ] Navigate to /jobs
- [ ] Enter search keyword in search bar
- [ ] Verify results filter by keyword
- [ ] Test search with no results
- [ ] Test search with multiple keywords
- [ ] Verify search works on title and description

### HM-24: View Job Details
- [ ] Navigate to /jobs
- [ ] Click on a job card
- [ ] Verify job details page loads
- [ ] Verify all job information is displayed
- [ ] Verify company information is shown
- [ ] Test back button navigation

### HM-25: Job Category Filter
- [ ] Navigate to /jobs
- [ ] Select a category from dropdown
- [ ] Verify jobs filter by selected category
- [ ] Test "All Categories" option
- [ ] Test filter with search keyword combined
- [ ] Verify categories are dynamically populated

## Integration Tests

- [ ] Complete flow: Register company → Post job → Search job → View details
- [ ] Complete flow: Register user → Search jobs → Filter by category → View details
- [ ] Test data persistence (refresh page, data should remain)
- [ ] Test error handling (network errors, invalid data)

