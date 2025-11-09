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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Post a New <span className="text-gradient">Job</span>
          </h1>
          <p className="text-lg text-gray-600">
            Reach thousands of qualified candidates
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-large p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
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
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyId" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  id="companyId"
                  name="companyId"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
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
                <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary (Optional)
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="e.g., $50,000 - $70,000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
