import { Job } from "../models/Job.model.js";
import { Company } from "../models/Company.model.js";

// Post Job (HM-03)
export const postJob = async (req, res) => {
  try {
    const { title, description, category, companyId, location, salary } =
      req.body;

    // Validation
    if (!title || !description || !category || !companyId || !location) {
      return res.status(400).json({
        message: "Title, description, category, companyId, and location are required",
        success: false,
      });
    }

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Create job
    const newJob = new Job({
      title,
      description,
      category,
      companyId,
      location,
      salary: salary || "",
      datePosted: new Date().toISOString(),
    });

    await newJob.save();

    // Job is already added to company in the save() method
    const jobData = newJob.toJSON();

    return res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job: jobData,
    });
  } catch (error) {
    console.error("Post job error:", error);
    res.status(500).json({
      message: "Server error posting job",
      success: false,
    });
  }
};

// Get All Jobs with Search and Filter (HM-04, HM-25)
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let query = {};

    // Search by keyword (title or description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const jobs = await Job.find(query);

    // Format jobs to match expected structure
    const formattedJobs = jobs.map(job => ({
      _id: job.id,
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      companyId: job.companyId,
      location: job.location,
      salary: job.salary,
      datePosted: job.datePosted,
      createdAt: job.createdAt,
    }));

    return res.status(200).json({
      jobs: formattedJobs,
      count: formattedJobs.length,
      success: true,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      message: "Server error fetching jobs",
      success: false,
    });
  }
};

// Get Job by ID (HM-24)
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Format job to match expected structure
    const formattedJob = {
      _id: job.id,
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      companyId: job.companyId,
      location: job.location,
      salary: job.salary,
      datePosted: job.datePosted,
      createdAt: job.createdAt,
    };

    return res.status(200).json({
      job: formattedJob,
      success: true,
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      message: "Server error fetching job",
      success: false,
    });
  }
};

