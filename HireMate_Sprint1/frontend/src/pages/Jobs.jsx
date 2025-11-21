import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [searchKeyword, selectedCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchKeyword) params.keyword = searchKeyword;
      if (selectedCategory) params.category = selectedCategory;

      const response = await api.get('/jobs', { params });
      if (response.data.success) {
        setJobs(response.data.jobs);
        const uniqueCategories = [...new Set(response.data.jobs.map((job) => job.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 font-semibold text-sm">
            Jobs tailored to your profile
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-3">
            Discover your next <span className="text-gradient">move</span>
          </h1>
          <p className="text-lg text-slate-500">
            Search roles, filter by category, and keep scrolling—your AI interviewer is ready when you are.
          </p>
        </div>

        <div className="job-card rounded-3xl p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by title, stack, or keywords..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-emerald-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="md:w-64">
              <select
                className="w-full px-4 py-3 rounded-2xl border border-emerald-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-slate-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="job-card rounded-3xl p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-emerald-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl font-semibold text-slate-700">No roles match your filters yet.</p>
            <p className="text-slate-500 mt-2">Try another category or keyword.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link
                key={job._id || job.id}
                to={`/job/${job._id || job.id}`}
                className="job-card rounded-3xl p-6 md:p-7 transition-transform hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-semibold mb-2">
                      {job.category}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {job.jobType || 'Full-time'}
                  </span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-5 text-sm font-medium">
                  <span className="px-3 py-1 rounded-full bg-white/70 text-emerald-600">📍 {job.location}</span>
                  {job.salary && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">💰 {job.salary}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-emerald-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                      {(job.companyId?.companyName || 'H')[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {job.companyId?.companyName || 'Company'}
                      </p>
                      <p className="text-xs text-slate-500">Active hiring</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
