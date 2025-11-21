import { getUsers, saveUsers } from '../utils/storage.js';
import bcrypt from 'bcryptjs';

// Simple User model using JSON storage
export class User {
  constructor(data) {
    this.id = data.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password; // Should be hashed
    this.role = data.role || 'job_seeker';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Find user by email
  static async findByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email) || null;
  }

  // Find user by ID
  static async findById(id) {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
  }

  // Create new user
  async save() {
    const users = getUsers();
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === this.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    users.push({
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });

    saveUsers(users);
    return this;
  }

  // Compare password
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Convert to JSON (without password)
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}
