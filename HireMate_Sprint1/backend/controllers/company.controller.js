import { Company } from "../models/Company.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Company Registration (HM-02)
export const registerCompany = async (req, res) => {
  try {
    const { companyName, email, password, description } = req.body;

    // Validation
    if (!companyName || !email || !password) {
      return res.status(400).json({
        message: "Company name, email, and password are required",
        success: false,
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      $or: [{ companyName }, { email }],
    });
    if (existingCompany) {
      return res.status(400).json({
        message: "Company name or email already exists",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company
    const newCompany = new Company({
      companyName,
      email,
      password: hashedPassword,
      description: description || "",
      jobPosts: [],
    });

    await newCompany.save();

    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      company: {
        id: newCompany.id,
        companyName: newCompany.companyName,
        email: newCompany.email,
        description: newCompany.description,
      },
    });
  } catch (error) {
    console.error("Company registration error:", error);
    res.status(500).json({
      message: "Server error during company registration",
      success: false,
    });
  }
};

// Get All Companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    // Remove passwords from response
    const companiesWithoutPassword = companies.map(company => {
      const { password, ...companyData } = company;
      return companyData;
    });
    return res.status(200).json({
      companies: companiesWithoutPassword,
      success: true,
    });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({
      message: "Server error fetching companies",
      success: false,
    });
  }
};

// Get Company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    // Remove password from response
    const { password, ...companyData } = company;
    return res.status(200).json({
      company: companyData,
      success: true,
    });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({
      message: "Server error fetching company",
      success: false,
    });
  }
};

