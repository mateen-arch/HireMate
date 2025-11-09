import { getCompanies, saveCompanies } from '../utils/storage.js';
import bcrypt from 'bcryptjs';

// Simple Company model using JSON storage
export class Company {
  constructor(data) {
    this.id = data.id || `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.companyName = data.companyName;
    this.email = data.email;
    this.password = data.password; // Should be hashed
    this.description = data.description || '';
    this.jobPosts = data.jobPosts || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Find company by email or name
  static async findOne(query) {
    const companies = getCompanies();
    
    if (query.email) {
      return companies.find(company => company.email === query.email) || null;
    }
    if (query.companyName) {
      return companies.find(company => company.companyName === query.companyName) || null;
    }
    if (query.$or) {
      for (const condition of query.$or) {
        if (condition.email) {
          const found = companies.find(c => c.email === condition.email);
          if (found) return found;
        }
        if (condition.companyName) {
          const found = companies.find(c => c.companyName === condition.companyName);
          if (found) return found;
        }
      }
    }
    return null;
  }

  // Find company by ID
  static async findById(id) {
    const companies = getCompanies();
    return companies.find(company => company.id === id) || null;
  }

  // Find all companies
  static async find() {
    return getCompanies();
  }

  // Create new company
  async save() {
    const companies = getCompanies();
    
    // Check if email or companyName already exists
    const existingCompany = companies.find(
      c => c.email === this.email || c.companyName === this.companyName
    );
    if (existingCompany) {
      throw new Error('Company name or email already exists');
    }

    companies.push({
      id: this.id,
      companyName: this.companyName,
      email: this.email,
      password: this.password,
      description: this.description,
      jobPosts: this.jobPosts,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });

    saveCompanies(companies);
    return this;
  }

  // Update company
  async update(updateData) {
    const companies = getCompanies();
    const index = companies.findIndex(c => c.id === this.id);
    
    if (index === -1) {
      throw new Error('Company not found');
    }

    companies[index] = {
      ...companies[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    saveCompanies(companies);
    return companies[index];
  }

  // Compare password
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Convert to JSON (without password)
  toJSON() {
    const { password, ...company } = this;
    return company;
  }
}
