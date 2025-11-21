import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const statusStyles = {
  NEW_APPLICATION: 'bg-slate-100 text-slate-600',
  CV_SCREENING: 'bg-sky-100 text-sky-700',
  QUALIFIED_FOR_INTERVIEW: 'bg-emerald-100 text-emerald-700',
  AI_INTERVIEW_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  AI_INTERVIEW_COMPLETED: 'bg-amber-100 text-amber-700',
  PASSED_AI_INTERVIEW: 'bg-lime-100 text-lime-700',
  READY_FOR_HUMAN_INTERVIEW: 'bg-teal-100 text-teal-700',
  PENDING_REVIEW: 'bg-orange-100 text-orange-700',
  REJECTED: 'bg-rose-100 text-rose-700',
};

const AI_ASSISTANT_URL = import.meta.env.VITE_AI_ASSISTANT_URL || 'http://localhost:3000';

const mapRoleToAssistant = (job) => {
  const target = `${job?.title || ''} ${job?.category || ''}`.toLowerCase();
  if (target.includes('data')) return 'data-scientist';
  if (target.includes('product')) return 'product-manager';
  if (target.includes('sales')) return 'sales-representative';
  if (target.includes('hr')) return 'hr-manager';
  if (target.includes('market')) return 'marketing-specialist';
  if (target.includes('customer')) return 'customer-service';
  return 'software-engineer';
};

const mapTypeToAssistant = (job) => {
  const target = `${job?.title || ''} ${job?.category || ''}`.toLowerCase();
  if (target.includes('sales')) return 'sales';
  if (target.includes('hr')) return 'hr';
  if (target.includes('behavior')) return 'behavioral';
  return 'technical';
};

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/me');
      if (response.data.success) {
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      toast.error('Unable to load applications');
    } finally {
      setLoading(false);
    }
  };

  const openAssistant = (application, interview) => {
    if (!interview?.metadata?.accessCode) {
      toast.error('Interview link not ready yet. Try again in a moment.');
      return;
    }
    const params = new URLSearchParams({
      accessCode: interview.metadata.accessCode,
      interviewId: interview.id,
      applicationId: application.id,
      role: mapRoleToAssistant(application.job),
      type: mapTypeToAssistant(application.job),
      duration: '20',
      autoStart: 'true',
    });
    window.open(`${AI_ASSISTANT_URL}?${params.toString()}`, '_blank', 'noopener');
  };

  const startInterview = async (application) => {
    try {
      setActionId(application.id);
      let interviewRecord = application.interview;
      if (!interviewRecord?.id) {
        const schedule = await api.post(`/interviews/schedule/${application.id}`);
        interviewRecord = schedule.data?.interview;
      }
      if (!interviewRecord?.id) {
        throw new Error('Unable to prepare interview');
      }
      toast.success('Interview ready');
      openAssistant(application, interviewRecord);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to launch interview');
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="job-card rounded-[32px] p-12 text-center space-y-6 max-w-lg mx-auto">
          <p className="text-2xl font-bold text-slate-800">No applications yet</p>
          <p className="text-slate-500">Once you apply for roles, your CV score and AI interview progress will appear here.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-emerald-500/60 transition-transform hover:-translate-y-0.5"
          >
            Browse jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="job-card rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500 font-semibold">Job seeker cockpit</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Track every application with live AI signals</h1>
            <p className="text-slate-600 mt-3 max-w-2xl">
              CV parsing, qualification scores, interview invites, and AI transcripts flow into this dashboard. Launch the virtual interviewer the moment you are qualified.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/80 border border-emerald-100 px-6 py-4 text-center">
              <p className="text-3xl font-black text-emerald-600">{applications.length}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Active applications</p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-emerald-100 px-6 py-4 text-center">
              <p className="text-3xl font-black text-emerald-600">
                {applications.filter((app) =>
                  ['QUALIFIED_FOR_INTERVIEW', 'AI_INTERVIEW_SCHEDULED'].includes(app.status)
                ).length}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Interview ready</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {applications.map((app) => {
            const statusClass = statusStyles[app.status] || 'bg-gray-100 text-gray-700';
            const canInterview = ['QUALIFIED_FOR_INTERVIEW', 'AI_INTERVIEW_SCHEDULED'].includes(app.status);
            return (
              <div key={app.id} className="job-card rounded-[28px] p-6 lg:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-[0.3em] text-emerald-500">Applied for</p>
                    <h2 className="text-2xl font-bold text-slate-900">{app.job?.title}</h2>
                    <p className="text-slate-500">{app.job?.location}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusClass}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-emerald-50 bg-white/80 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CV score</p>
                    <p className="text-3xl font-black text-slate-900">{app.cvScore ?? '—'}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-50 bg-white/80 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AI interview score</p>
                    <p className="text-3xl font-black text-slate-900">{app.aiScore ?? '—'}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-50 bg-white/80 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Final score</p>
                    <p className="text-3xl font-black text-slate-900">{app.finalScore ?? '—'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  {app.parsedSkills?.slice(0, 6).map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {app.parsedSkills?.length > 6 && (
                    <span className="px-3 py-1 bg-white/70 text-slate-500 rounded-full">
                      +{app.parsedSkills.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {canInterview && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startInterview(app)}
                        disabled={actionId === app.id}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-violet-500/60 disabled:opacity-60"
                      >
                        {actionId === app.id ? 'Preparing...' : app.interview ? 'Resume online interview' : 'Start online interview'}
                      </button>
                      <p className="text-sm text-slate-500">
                        Your CV was accepted. Launch the AI interviewer to move forward.
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/job/${app.job?.id || app.jobId}`)}
                    className="px-6 py-3 border border-emerald-100 text-emerald-700 font-semibold rounded-2xl hover:border-emerald-200"
                  >
                    View job details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;


