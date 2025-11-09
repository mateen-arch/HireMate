import { getJobs, saveJobs, getCompanies, saveCompanies } from '../utils/storage.js';

// Simple Job model using JSON storage
export class Job {
  constructor(data) {
    this.id = data.id || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.companyId = data.companyId;
    this.location = data.location;
    this.salary = data.salary || '';
    this.datePosted = data.datePosted || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Find job by ID
  static async findById(id) {
    const jobs = getJobs();
    const job = jobs.find(j => j.id === id);
    
    if (!job) return null;

    // Populate company info
    const companies = getCompanies();
    const company = companies.find(c => c.id === job.companyId);
    
    return {
      ...job,
      companyId: company ? {
        id: company.id,
        companyName: company.companyName,
        description: company.description,
        email: company.email,
      } : null,
    };
  }

  // Find jobs with query
  static async find(query = {}) {
    let jobs = getJobs();

    // Handle search keyword
    if (query.$or) {
      const keyword = query.$or[0]?.title?.$regex || query.$or[0]?.description?.$regex || '';
      if (keyword) {
        const searchTerm = keyword.toLowerCase();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
        );
      }
    }

    // Handle category filter
    if (query.category) {
      const categoryPattern = query.category.$regex || query.category;
      if (categoryPattern) {
        const categoryTerm = categoryPattern.toLowerCase();
        jobs = jobs.filter(job => 
          job.category.toLowerCase().includes(categoryTerm)
        );
      }
    }

    // Populate company info
    const companies = getCompanies();
    jobs = jobs.map(job => {
      const company = companies.find(c => c.id === job.companyId);
      return {
        ...job,
        companyId: company ? {
          id: company.id,
          companyName: company.companyName,
          description: company.description,
        } : null,
      };
    });

    // Sort by datePosted (newest first)
    jobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));

    return jobs;
  }

  // Create new job
  async save() {
    const jobs = getJobs();
    
    // Verify company exists
    const companies = getCompanies();
    const company = companies.find(c => c.id === this.companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    jobs.push({
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      companyId: this.companyId,
      location: this.location,
      salary: this.salary,
      datePosted: this.datePosted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });

    saveJobs(jobs);

    // Add job to company's jobPosts array
    company.jobPosts.push(this.id);
    const companyIndex = companies.findIndex(c => c.id === this.companyId);
    if (companyIndex !== -1) {
      companies[companyIndex] = company;
      saveCompanies(companies);
    }

    return this;
  }

  // Convert to JSON
  toJSON() {
    return {
      _id: this.id,
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      companyId: this.companyId,
      location: this.location,
      salary: this.salary,
      datePosted: this.datePosted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
