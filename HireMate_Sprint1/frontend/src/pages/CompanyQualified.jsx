import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api, { API_ORIGIN } from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const CompanyQualified = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [pipeline, setPipeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);

  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        if (response.data.success) {
          setJobs(response.data.jobs || []);
        }
      } catch (error) {
        toast.error('Unable to load jobs');
      }
    };

    fetchJobs();
  }, []);

  const loadJobData = useCallback(
    async (jobIdValue) => {
      if (!jobIdValue) return;
      try {
        setLoading(true);
        const [appsResponse, pipelineResponse] = await Promise.all([
          api.get(`/applications/qualified/${jobIdValue}`),
          api.get(`/analytics/hiring-pipeline/${jobIdValue}`),
        ]);
        setCandidates(appsResponse.data.applications || []);
        setPipeline(pipelineResponse.data.pipeline || null);
      } catch (error) {
        toast.error('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadJobData(selectedJob);
  }, [selectedJob, loadJobData]);

  const handleAcceptCandidate = async (applicationId) => {
    try {
      setActionId(applicationId);
      await api.put(`/applications/status/${applicationId}`, {
        status: 'QUALIFIED_FOR_INTERVIEW',
        note: 'CV accepted via company dashboard',
      });
      toast.success('Candidate moved to online interview.');
      await loadJobData(selectedJob);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to accept CV');
    } finally {
      setActionId(null);
    }
  };

  const chartData = useMemo(() => {
    if (!pipeline) return null;
    const stages = Object.entries(pipeline)
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => ({
        label: key.replace(/_/g, ' '),
        value,
      }))
      .filter((stage) => stage.value > 0);

    if (!stages.length) return null;

    return {
      labels: stages.map((stage) => stage.label),
      datasets: [
        {
          label: 'Applications',
          data: stages.map((stage) => stage.value),
          backgroundColor: [
            '#c084fc',
            '#38bdf8',
            '#fcd34d',
            '#fb7185',
            '#34d399',
            '#a5b4fc',
          ],
        },
      ],
    };
  }, [pipeline]);

  if (!user || user.role !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <p className="text-slate-300">Only company users can access this page.</p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 font-semibold shadow-lg"
          >
            Login as company
          </button>
        </div>
      </div>
    );
  }

  const buildCvUrl = (cvPath) => {
    if (!cvPath) return null;
    return `${API_ORIGIN}/${cvPath}`.replace(/([^:]\/)\/+/g, '$1');
  };

  return (
    <div className="min-h-screen py-16 company-surface text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="company-card rounded-[32px] p-8 border border-slate-800/60">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Company control center</p>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">Qualified candidates & pipeline health</h1>
              <p className="text-slate-300 mt-3 max-w-2xl">
                Review AI-screened candidates, monitor interview progress, and fast-forward the ones ready for human conversations.
              </p>
            </div>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full md:w-80 bg-slate-900/60 border border-slate-700/70 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select a job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedJob && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 company-card rounded-[28px] p-6 border border-slate-800/70">
              <h2 className="text-xl font-semibold text-white mb-2">Pipeline overview</h2>
              <p className="text-sm text-slate-400 mb-6">Live counts synced from HireMate automation</p>
              {chartData ? (
                <Doughnut data={chartData} />
              ) : (
                <p className="text-slate-500 text-sm">No applicants in the pipeline yet.</p>
              )}
              {pipeline && (
                <div className="mt-6 rounded-2xl border border-slate-800/70 p-4 text-sm">
                  <p className="text-slate-400">Total applications</p>
                  <p className="text-3xl font-black text-white">{pipeline.total}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {loading && (
                <div className="company-card rounded-[28px] p-6 text-center border border-slate-800/70">
                  <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-slate-400">Loading candidates...</p>
                </div>
              )}

              {!loading && !candidates.length && (
                <div className="company-card rounded-[28px] p-6 text-center border border-slate-800/70 text-slate-400">
                  No qualified candidates yet.
                </div>
              )}

              {!loading &&
                candidates.map(({ application, applicant, interview }) => (
                  <div
                    key={application.id}
                    className="company-card rounded-[28px] p-6 border border-slate-800/70 space-y-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Candidate</p>
                        <p className="text-xl font-semibold text-white">{applicant?.name}</p>
                        <p className="text-slate-400">{applicant?.email}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-xs uppercase text-slate-500">CV Score</p>
                          <p className="text-2xl font-black text-white">{application.cvScore ?? '—'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs uppercase text-slate-500">AI Score</p>
                          <p className="text-2xl font-black text-white">
                            {interview?.aiScore ?? application.aiScore ?? '—'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs uppercase text-slate-500">Final</p>
                          <p className="text-2xl font-black text-white">{application.finalScore ?? '—'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      {application.status && (
                        <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700/70">
                          {application.status.replace(/_/g, ' ')}
                        </span>
                      )}
                      {interview?.status && (
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">
                          Interview {interview.status.toLowerCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {buildCvUrl(application.cvPath) && (
                        <a
                          href={buildCvUrl(application.cvPath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-2xl border border-slate-700/80 text-sm font-semibold text-slate-200 hover:border-slate-500 transition-colors"
                        >
                          View CV
                        </a>
                      )}
                      {application.status === 'NEW_APPLICATION' && (
                        <button
                          onClick={() => handleAcceptCandidate(application.id)}
                          disabled={actionId === application.id}
                          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg hover:shadow-violet-500/60 disabled:opacity-60"
                        >
                          {actionId === application.id ? 'Accepting...' : 'Accept & invite'}
                        </button>
                      )}
                      {application.status === 'QUALIFIED_FOR_INTERVIEW' && (
                        <span className="text-sm text-slate-400">
                          Candidate can now start the online interview.
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyQualified;


