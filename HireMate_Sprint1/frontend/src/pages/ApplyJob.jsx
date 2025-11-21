import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [screening, setScreening] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        }
      } catch (error) {
        toast.error('Unable to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error('Please upload your CV (PDF/DOCX)');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('coverLetter', coverLetter);
    formData.append('cv', cvFile);

    try {
      setSubmitting(true);
      const response = await api.post('/applications/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        toast.success('Application submitted!');
        setScreening(response.data.screening);
        setTimeout(() => navigate('/my-applications'), 1800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found.</p>
          <Link to="/jobs" className="text-primary-600 font-semibold">
            ← Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to={`/job/${id}`} className="text-primary-600 font-semibold">
          ← Back to job details
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-large border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Apply for {job.title}
            </h2>
            <p className="text-gray-600 mb-6">
              Upload your CV and optional cover letter. Our AI will parse your resume and instantly tell you how well you match.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CV / Resume (PDF or DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter (optional)
                </label>
                <textarea
                  rows="6"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell the company why you'd be a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>

            {screening && (
              <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl">
                <p className="text-sm font-semibold text-primary-600 uppercase">
                  Instant Screening Result
                </p>
                <p className="text-4xl font-bold text-gray-900 my-3">
                  {screening.score}% match
                </p>
                <p className="text-gray-700 mb-3">{screening.decision}</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <p>Skills weight: {screening.breakdown.skills}%</p>
                  <p>Experience: {screening.breakdown.experience}%</p>
                  <p>Education: {screening.breakdown.education}%</p>
                  <p>Certifications: {screening.breakdown.certifications}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-large border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Role snapshot
              </h3>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{job.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-50 text-primary-700">
                  {job.category}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                  📍 {job.location}
                </span>
                {job.salary && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-secondary-50 text-secondary-700">
                    💰 {job.salary}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl shadow-2xl text-white p-8">
              <h4 className="text-lg font-semibold mb-2">What happens next?</h4>
              <ul className="space-y-3 text-sm text-indigo-100">
                <li>• CV parsed & scored automatically</li>
                <li>• If shortlisted, you can launch the AI interviewer</li>
                <li>• Combined CV + interview score determines human interview</li>
                <li>• Realtime notifications via email and dashboard</li>
              </ul>
              <p className="text-xs text-indigo-100 mt-6">Powered by HireMate automation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;



