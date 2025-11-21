import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import MyApplications from './pages/MyApplications';
import CompanyQualified from './pages/CompanyQualified';
import AiInterview from './pages/AiInterview';

function App() {
  return (
    <Router>
      <AppLayout>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job/:id" element={<JobDetail />} />
              <Route path="/job/:id/apply" element={<ApplyJob />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/company/qualified" element={<CompanyQualified />} />
              <Route path="/ai-interview/:interviewId" element={<AiInterview />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </AppLayout>
    </Router>
  );
}

export default App;

