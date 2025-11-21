import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Application } from "../models/Application.model.js";
import { ApplicationDetails } from "../models/ApplicationDetails.model.js";
import { QualificationLog } from "../models/QualificationLog.model.js";
import { Job } from "../models/Job.model.js";
import { User } from "../models/User.model.js";
import { Interview } from "../models/Interview.model.js";
import { sendTemplatedEmail } from "../services/emailService.js";
import {
  notifyApplicationWebhook,
  notifyStatusChange,
} from "../services/automationHooks.js";
import { calculateFinalScore } from "../services/interviewEvaluator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_UPLOAD_PATH = path.join(__dirname, "..", "uploads", "cvs");
const CV_UPLOAD_PATH = process.env.CV_UPLOAD_PATH
  ? path.resolve(process.env.CV_UPLOAD_PATH)
  : DEFAULT_UPLOAD_PATH;

const ensureUploadPath = () => {
  if (!fs.existsSync(CV_UPLOAD_PATH)) {
    fs.mkdirSync(CV_UPLOAD_PATH, { recursive: true });
  }
};

ensureUploadPath();

const getRelativeCvPath = (absolutePath) => {
  const backendRoot = path.join(__dirname, "..");
  return path.relative(backendRoot, absolutePath);
};

const safeSendEmail = async (payload) => {
  if (!payload?.to) return;
  try {
    await sendTemplatedEmail(payload);
  } catch (error) {
    console.warn("⚠️ Failed to send email", error.message);
  }
};

export const submitApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const { jobId, coverLetter } = req.body;
    const cvFile = req.file;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!cvFile) {
      return res.status(400).json({
        success: false,
        message: "CV/Resume file is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "job_seeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can submit applications",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const existingApplication = await Application.findByUserAndJob(
      userId,
      jobId
    );

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    const newApplication = new Application({
      jobId,
      userId,
      cvPath: getRelativeCvPath(cvFile.path),
      cvOriginalName: cvFile.originalname,
      coverLetter: coverLetter || "",
      status: "NEW_APPLICATION",
      cvScore: null,
    });

    const savedApplication = await newApplication.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    await safeSendEmail({
      to: user.email,
      subject: `We've received your application for ${job.title}`,
      template: "applicationReceived",
      variables: {
        CANDIDATE_NAME: user.name,
        JOB_TITLE: job.title,
        MESSAGE:
          "Sit tight while our AI recruiter parses your resume and compares it with the job requirements.",
        CTA_TEXT: "Track my application",
        CTA_URL: `${frontendUrl}/my-applications`,
      },
    });

    await notifyApplicationWebhook({
      event: "APPLICATION_SUBMITTED",
      application: savedApplication,
      applicant: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      job: {
        id: job.id,
        title: job.title,
        companyId: job.companyId?.id || job.companyId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: savedApplication,
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

export const getQualifiedApplications = async (req, res) => {
  try {
    const { job_id: jobId } = req.params;
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const applications = await Application.findByJobId(jobId);
    const shortlisted = applications.filter((app) =>
      [
        "NEW_APPLICATION",
        "QUALIFIED_FOR_INTERVIEW",
        "PENDING_REVIEW",
        "AI_INTERVIEW_SCHEDULED",
        "READY_FOR_HUMAN_INTERVIEW",
      ].includes(app.status)
    );

    const response = [];
    for (const app of shortlisted) {
      const detail = await ApplicationDetails.findByApplicationId(app.id);
      const applicant = await User.findById(app.userId);
      const interview = await Interview.findByApplicationId(app.id);
      response.push({
        application: app,
        applicant: applicant
          ? { id: applicant.id, name: applicant.name, email: applicant.email }
          : null,
        details: detail,
        interview: interview
          ? {
              id: interview.id,
              status: interview.status,
              aiScore: interview.aiScore,
              metadata: interview.metadata,
            }
          : null,
      });
    }

    return res.status(200).json({
      success: true,
      job: { id: job.id, title: job.title, company: job.companyId },
      count: response.length,
      applications: response,
    });
  } catch (error) {
    console.error("Fetch qualified applications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch qualified applications",
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.list({ userId: req.userId });
    const enriched = [];
    for (const application of applications) {
      const job = await Job.findById(application.jobId);
      const detail = await ApplicationDetails.findByApplicationId(application.id);
      const interview = await Interview.findByApplicationId(application.id);
      enriched.push({
        ...application,
        job: job
          ? {
              id: job.id,
              title: job.title,
              location: job.location,
              category: job.category,
              company:
                typeof job.companyId === "object"
                  ? job.companyId.companyName
                  : job.companyId,
            }
          : null,
        parsedSkills: detail?.parsedSkills || [],
        matchScore: detail?.matchScore,
        interview: interview
          ? {
              id: interview.id,
              status: interview.status,
              aiScore: interview.aiScore,
              scheduledDate: interview.scheduledDate,
              metadata: interview.metadata,
            }
          : null,
      });
    }

    return res.status(200).json({
      success: true,
      applications: enriched,
    });
  } catch (error) {
    console.error("Fetch my applications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { application_id: applicationId } = req.params;
    const { status, finalScore, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const requestingUser = await User.findById(req.userId);
    if (!requestingUser || requestingUser.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company users can update application status",
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const updated = await Application.update(applicationId, {
      status,
      finalScore:
        typeof finalScore === "number" ? finalScore : application.finalScore,
    });

    const log = new QualificationLog({
      applicationId,
      screeningType: "MANUAL_UPDATE",
      decision: `Status updated to ${status}`,
      score: updated.finalScore || updated.cvScore,
      reason: note || "Manual status update",
    });
    await log.save();

    const applicant = await User.findById(application.userId);
    const job = await Job.findById(application.jobId);

    if (applicant && job) {
      if (status === "READY_FOR_HUMAN_INTERVIEW") {
        await safeSendEmail({
          to: applicant.email,
          subject: `You're moving forward – ${job.title}`,
          template: "finalSelection",
          variables: {
            CANDIDATE_NAME: applicant.name,
            JOB_TITLE: job.title,
            FINAL_SCORE: updated.finalScore || updated.cvScore || 0,
            MESSAGE:
              note ||
              "Our recruiting team will reach out with the next steps for a human interview.",
            CTA_TEXT: "View next steps",
            CTA_URL: (process.env.FRONTEND_URL || "http://localhost:5173") + "/my-applications",
          },
        });
      } else if (status === "REJECTED") {
        await safeSendEmail({
          to: applicant.email,
          subject: `Application update – ${job.title}`,
          template: "rejectionNotification",
          variables: {
            CANDIDATE_NAME: applicant.name,
            MESSAGE:
              note ||
              "Thanks for interviewing with us. After review, we're moving ahead with other candidates.",
          },
        });
      }
    }

    await notifyStatusChange({
      event: "APPLICATION_STATUS_UPDATED",
      applicationId,
      status,
      finalScore: updated.finalScore,
    });

    return res.status(200).json({
      success: true,
      application: updated,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update status",
    });
  }
};

export const getTopCandidates = async (req, res) => {
  try {
    const { job_id: jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const applications = await Application.findByJobId(jobId);
    const enriched = [];
    for (const application of applications) {
      const interview = await Interview.findByApplicationId(application.id);
      const aiScore = interview?.aiScore ?? application.aiScore ?? 0;
      const finalScore =
        application.finalScore ??
        calculateFinalScore({
          cvScore: application.cvScore || 0,
          interviewScore: aiScore,
        });

      if (finalScore >= Number(process.env.FINAL_SCORE_THRESHOLD || 65)) {
        const applicant = await User.findById(application.userId);
        enriched.push({
          application: { ...application, finalScore },
          applicant: applicant
            ? {
                id: applicant.id,
                name: applicant.name,
                email: applicant.email,
              }
            : null,
          interview: interview
            ? { id: interview.id, aiScore: interview.aiScore }
            : null,
        });
      }
    }

    enriched.sort(
      (a, b) => (b.application.finalScore || 0) - (a.application.finalScore || 0)
    );

    return res.status(200).json({
      success: true,
      job: { id: job.id, title: job.title },
      candidates: enriched.slice(0, 20),
    });
  } catch (error) {
    console.error("Top candidates fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load candidates",
    });
  }
};

export const getHiringPipeline = async (req, res) => {
  try {
    const { job_id: jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const applications = await Application.findByJobId(jobId);
    const pipeline = applications.reduce(
      (acc, app) => {
        acc.total += 1;
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {
        total: 0,
      }
    );

    return res.status(200).json({
      success: true,
      job: { id: job.id, title: job.title },
      pipeline,
    });
  } catch (error) {
    console.error("Pipeline analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};


