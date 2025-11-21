import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    companyId: '',
    location: '',
    salary: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Use a hard-coded list of companies and their associated categories.
    // This allows the company dropdown to be available even without a backend
    // and enables filtering/merging with the selected category.
    const hardcoded = [
      { id: 'devsync', companyName: 'Dev Sync', categories: ['Technology', 'Engineering'] },
      { id: 'contour', companyName: 'Contour Software', categories: ['Technology'] },
      { id: 'devsol', companyName: 'DevSol', categories: ['Technology', 'Engineering'] },
      { id: 'amazon', companyName: 'Amazon', categories: ['Technology', 'Sales'] },
      { id: 'google', companyName: 'Google', categories: ['Technology'] },
      { id: 'netflix', companyName: 'Netflix', categories: ['Technology', 'Marketing'] },
      { id: 'finCorp', companyName: 'FinCorp', categories: ['Finance'] },
      { id: 'healthplus', companyName: 'HealthPlus', categories: ['Healthcare'] },
      { id: 'marketpros', companyName: 'MarketPros', categories: ['Marketing', 'Sales'] },
    ];

    setCompanies(hardcoded);
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/jobs', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Technology',
    'Finance',
    'Healthcare',
    'Marketing',
    'Education',
    'Engineering',
    'Sales',
    'Other',
  ];

  return (
    <div className="min-h-screen py-16 company-surface text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="company-card rounded-[32px] p-8 border border-slate-800/70">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300 font-semibold">Job launch</p>
          <h1 className="text-4xl font-black text-white mt-4">Post a new role to the HireMate pipeline</h1>
          <p className="text-slate-300 mt-3">
            Define the role, attach it to a company profile, and our automation will handle CV screening, AI interviews, and notifications.
          </p>
        </div>

        <div className="company-card rounded-[32px] p-8 border border-slate-800/70">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-300 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="6"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-slate-300 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyId" className="block text-sm font-semibold text-slate-300 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  id="companyId"
                  name="companyId"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={formData.companyId}
                  onChange={handleChange}
                >
                  <option value="">Select a company</option>
                  {/* Filter companies to those matching the selected category (if any) */}
                  {companies
                    .filter((company) =>
                      !formData.category || (company.categories && company.categories.includes(formData.category))
                    )
                    .map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-semibold text-slate-300 mb-2">
                  Salary (Optional)
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g., $50,000 - $70,000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/60">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-violet-500/70 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting Job...
                  </span>
                ) : (
                  'Post Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
