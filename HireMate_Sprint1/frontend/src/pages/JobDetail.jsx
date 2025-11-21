import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
          <p className="mt-4 text-slate-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Job not found</p>
          <Link to="/jobs" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const jobId = job._id || job.id;

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/jobs"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to jobs
        </Link>

        <div className="job-card rounded-[32px] overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-10">
            <p className="text-white/80 uppercase tracking-[0.3em] text-xs mb-4">{job.category}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-5">{job.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-white">
              <span className="px-4 py-2 rounded-full bg-white/15">📍 {job.location}</span>
              {job.salary && <span className="px-4 py-2 rounded-full bg-white/15">💰 {job.salary}</span>}
              {job.datePosted && (
                <span className="px-4 py-2 rounded-full bg-white/15">
                  Posted {new Date(job.datePosted).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/80 border border-emerald-50">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-black text-emerald-600">
                {(job.companyId?.companyName || 'H')[0]}
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-emerald-500 font-semibold">Hiring company</p>
                <h3 className="text-2xl font-bold text-slate-900">{job.companyId?.companyName || 'Company'}</h3>
                {job.companyId?.description && <p className="text-slate-500 mt-2">{job.companyId.description}</p>}
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Role overview</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-emerald-50 bg-white/80 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold mb-2">LOCATION</p>
                <h3 className="text-xl font-bold text-slate-900">{job.location}</h3>
              </div>
              {job.salary && (
                <div className="rounded-3xl border border-emerald-50 bg-white/80 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold mb-2">SALARY</p>
                  <h3 className="text-xl font-bold text-slate-900">{job.salary}</h3>
                </div>
              )}
              <div className="rounded-3xl border border-emerald-50 bg-white/80 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold mb-2">CATEGORY</p>
                <h3 className="text-xl font-bold text-slate-900">{job.category}</h3>
              </div>
              {job.datePosted && (
                <div className="rounded-3xl border border-emerald-50 bg-white/80 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold mb-2">POSTED ON</p>
                  <h3 className="text-xl font-bold text-slate-900">
                    {new Date(job.datePosted).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-emerald-50 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-semibold">Step 1 → CV review</p>
                <p className="text-slate-500 text-sm">
                  Upload your CV once; HireMate scores it instantly and unlocks the AI interview.
                </p>
              </div>
              <Link
                to={`/job/${jobId}/apply`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition-transform hover:-translate-y-0.5"
              >
                Apply for this role
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;


