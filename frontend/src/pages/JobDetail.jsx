import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      if (response.data.success) {
        setJob(response.data.job);
      }
    } catch (error) {
      toast.error('Failed to fetch job details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Job not found</p>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/jobs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6 group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        <div className="bg-white rounded-2xl shadow-large border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold">
                {job.category}
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold">
                📍 {job.location}
              </span>
              {job.salary && (
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold">
                  💰 {job.salary}
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Company Info */}
            <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {(job.companyId?.companyName || 'Company')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {job.companyId?.companyName || 'Not specified'}
                  </h3>
                  {job.companyId?.description && (
                    <p className="text-gray-600">{job.companyId.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full mr-3"></span>
                Job Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase">Location</p>
                    <p className="text-lg font-bold text-gray-900">{job.location}</p>
                  </div>
                </div>
              </div>

              {job.salary && (
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.01 2.09.01.21 0 .38.17.38.38 0 .19-.13.35-.31.41-.19.07-.39.12-.6.17-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15-.21.05-.42.1-.63.15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase">Salary</p>
                      <p className="text-lg font-bold text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase">Category</p>
                    <p className="text-lg font-bold text-gray-900">{job.category}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase">Posted</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(job.datePosted).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-6 border-t border-gray-200">
              <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
