import crypto from "crypto";
import { Application } from "../models/Application.model.js";
import { ApplicationDetails } from "../models/ApplicationDetails.model.js";
import { Interview } from "../models/Interview.model.js";
import { InterviewQuestion } from "../models/InterviewQuestion.model.js";
import { Job } from "../models/Job.model.js";
import { User } from "../models/User.model.js";
import { QualificationLog } from "../models/QualificationLog.model.js";
import {
  generateInterviewQuestions,
  scoreInterviewAnswer,
  computeInterviewScore,
} from "../services/aiInterviewer.js";
import {
  calculateFinalScore,
  determinePostInterviewStatus,
} from "../services/interviewEvaluator.js";
import { sendTemplatedEmail } from "../services/emailService.js";
import {
  notifyInterviewWebhook,
  notifyStatusChange,
} from "../services/automationHooks.js";

const safeSendEmail = async (payload) => {
  if (!payload?.to) return;
  try {
    await sendTemplatedEmail(payload);
  } catch (error) {
    console.warn("⚠️ Email send failed", error.message);
  }
};

const ensureInterviewAccess = (user, application, job) => {
  if (!user || !application) return false;
  if (user.role === "job_seeker" && application.userId === user.id) return true;
  if (
    user.role === "company" &&
    job &&
    ((typeof job.companyId === "object" && job.companyId?.id === user.id) ||
      job.companyId === user.id)
  ) {
    return true;
  }
  return false;
};

export const scheduleInterview = async (req, res) => {
  try {
    const { application_id: applicationId } = req.params;
    const actor = await User.findById(req.userId);
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const applicant = await User.findById(application.userId);
    const job = await Job.findById(application.jobId);

    if (!ensureInterviewAccess(actor, application, job)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const existing = await Interview.findByApplicationId(application.id);
    if (existing && existing.status !== "CANCELLED") {
      const questions = await InterviewQuestion.findByInterviewId(existing.id);
      return res.status(200).json({
        success: true,
        interview: existing,
        questions,
        alreadyScheduled: true,
      });
    }

    const accessCode = crypto.randomBytes(9).toString("hex");
    const interview = new Interview({
      applicationId: application.id,
      status: "SCHEDULED",
      metadata: {
        jobTitle: job.title,
        accessCode,
      },
    });
    const savedInterview = await interview.save();

    const questionTexts = await generateInterviewQuestions({
      job,
      applicant,
      count: 6,
    });

    await Promise.all(
      questionTexts.map((questionText, index) => {
        const record = new InterviewQuestion({
          interviewId: savedInterview.id,
          order: index,
          questionText,
        });
        return record.save();
      })
    );

    await Application.update(application.id, {
      status: "AI_INTERVIEW_SCHEDULED",
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    await safeSendEmail({
      to: applicant.email,
      subject: `AI interview ready – ${job.title}`,
      template: "aiInterviewInvitation",
      variables: {
        CANDIDATE_NAME: applicant.name,
        JOB_TITLE: job.title,
        INTERVIEW_WINDOW: "Next 24 hours",
        MESSAGE:
          "Launch the AI interviewer when you're in a quiet environment. You can pause between questions if needed.",
        CTA_TEXT: "Start interview",
        CTA_URL: `${frontendUrl}/ai-interview/${savedInterview.id}`,
      },
    });

    await notifyInterviewWebhook({
      event: "INTERVIEW_SCHEDULED",
      interviewId: savedInterview.id,
      applicationId: application.id,
      applicant: { id: applicant.id, email: applicant.email },
      job: { id: job.id, title: job.title },
    });

    const questions = await InterviewQuestion.findByInterviewId(savedInterview.id);

    return res.status(201).json({
      success: true,
      interview: savedInterview,
      questions,
    });
  } catch (error) {
    console.error("Schedule interview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
    });
  }
};

export const getInterviewQuestions = async (req, res) => {
  try {
    const { interview_id: interviewId } = req.params;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const application = await Application.findById(interview.applicationId);
    const job = await Job.findById(application?.jobId);
    const actor = await User.findById(req.userId);
    if (!ensureInterviewAccess(actor, application, job)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const questions = await InterviewQuestion.findByInterviewId(interviewId);
    return res.status(200).json({
      success: true,
      interview,
      questions,
    });
  } catch (error) {
    console.error("Fetch interview questions error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load interview",
    });
  }
};

export const submitInterviewAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, answer } = req.body;
    if (!answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const question = await InterviewQuestion.findById(questionId);
    if (!question || question.interviewId !== interview.id) {
      return res.status(400).json({
        success: false,
        message: "Invalid question reference",
      });
    }

    const application = await Application.findById(interview.applicationId);
    const job = await Job.findById(application?.jobId);
    const actor = await User.findById(req.userId);
    if (!ensureInterviewAccess(actor, application, job)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const breakdown = await scoreInterviewAnswer({
      question: question.questionText,
      answer,
      job,
    });
    const averageScore = Math.round(
      (breakdown.relevance +
        breakdown.technicalAccuracy +
        breakdown.communication +
        breakdown.problemSolving) /
        4
    );

    const updatedQuestion = await InterviewQuestion.update(questionId, {
      answerText: answer,
      score: averageScore,
      breakdown,
    });

    const transcript = Array.isArray(interview.aiTranscript)
      ? [...interview.aiTranscript]
      : [];
    transcript.push({
      question: question.questionText,
      answer,
      score: averageScore,
      timestamp: new Date().toISOString(),
    });

    await Interview.update(interview.id, {
      aiTranscript: transcript,
      status: "IN_PROGRESS",
    });

    return res.status(200).json({
      success: true,
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Submit interview answer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const { interview_id: interviewId } = req.params;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status === "COMPLETED") {
      const questions = await InterviewQuestion.findByInterviewId(interviewId);
      return res.status(200).json({
        success: true,
        interview,
        questions,
      });
    }

    const application = await Application.findById(interview.applicationId);
    const job = await Job.findById(application?.jobId);
    const actor = await User.findById(req.userId);
    if (!ensureInterviewAccess(actor, application, job)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const questions = await InterviewQuestion.findByInterviewId(interviewId);
    const answered = questions.filter((q) => q.answerText?.length);
    if (!answered.length) {
      return res.status(400).json({
        success: false,
        message: "Please answer at least one question before completing",
      });
    }

    const aiScore = computeInterviewScore(
      answered.map((item) => item.breakdown || {})
    );

    let aiOutcome = "FAILED_AI_INTERVIEW";
    if (aiScore >= 70) {
      aiOutcome = "PASSED_AI_INTERVIEW";
    } else if (aiScore >= 50) {
      aiOutcome = "BORDERLINE_REVIEW";
    }

    const updatedInterview = await Interview.update(interview.id, {
      status: "COMPLETED",
      completedDate: new Date().toISOString(),
      aiScore,
      metadata: {
        ...interview.metadata,
        aiOutcome,
      },
    });

    const finalScore = calculateFinalScore({
      cvScore: application.cvScore || 0,
      interviewScore: aiScore,
    });
    const postDecision = determinePostInterviewStatus(finalScore);

    const updatedApplication = await Application.update(application.id, {
      status: postDecision.status,
      aiScore,
      finalScore,
    });

    const details = await ApplicationDetails.findByApplicationId(application.id);
    const applicant = await User.findById(application.userId);

    const log = new QualificationLog({
      applicationId: application.id,
      screeningType: "AI_INTERVIEW",
      score: aiScore,
      decision: `${aiOutcome} / Final: ${postDecision.status}`,
      reason: `AI score ${aiScore}, CV ${application.cvScore || 0}, Final ${finalScore}`,
    });
    await log.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    await safeSendEmail({
      to: applicant.email,
      subject: `AI interview result – ${job.title}`,
      template: "aiInterviewResult",
      variables: {
        CANDIDATE_NAME: applicant.name,
        JOB_TITLE: job.title,
        SCORE: aiScore,
        MESSAGE:
          postDecision.status === "READY_FOR_HUMAN_INTERVIEW"
            ? "Fantastic work! You're moving to the next phase."
            : postDecision.status === "PENDING_REVIEW"
            ? "Our recruiting team will review your transcript shortly."
            : "Thanks for interviewing. Keep exploring other roles on HireMate.",
        CTA_TEXT: "See feedback",
        CTA_URL: `${frontendUrl}/my-applications`,
      },
    });

    if (postDecision.status === "READY_FOR_HUMAN_INTERVIEW") {
      await safeSendEmail({
        to: applicant.email,
        subject: `Next steps – ${job.title}`,
        template: "finalSelection",
        variables: {
          CANDIDATE_NAME: applicant.name,
          JOB_TITLE: job.title,
          FINAL_SCORE: finalScore,
          MESSAGE:
            "We'll connect you with the hiring team to schedule a human interview.",
          CTA_TEXT: "Prepare for next round",
          CTA_URL: `${frontendUrl}/my-applications`,
        },
      });
    } else if (postDecision.status === "REJECTED") {
      await safeSendEmail({
        to: applicant.email,
        subject: `Application update – ${job.title}`,
        template: "rejectionNotification",
        variables: {
          CANDIDATE_NAME: applicant.name,
          MESSAGE:
            "After evaluating your AI interview, we won't proceed this time. Please remain in touch for future roles.",
        },
      });
    }

    await notifyInterviewWebhook({
      event: "INTERVIEW_COMPLETED",
      interviewId,
      applicationId: application.id,
      aiScore,
      finalScore,
      status: postDecision.status,
      applicant: { id: applicant.id, email: applicant.email },
      job: { id: job.id, title: job.title },
      parsedSkills: details?.parsedSkills,
    });

    await notifyStatusChange({
      event: "INTERVIEW_STATUS",
      applicationId: application.id,
      aiScore,
      finalScore,
      status: postDecision.status,
    });

    return res.status(200).json({
      success: true,
      interview: updatedInterview,
      application: updatedApplication,
      questions,
    });
  } catch (error) {
    console.error("Complete interview error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to finalize interview",
    });
  }
};

export const getInterviewResults = async (req, res) => {
  try {
    const { interview_id: interviewId } = req.params;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const application = await Application.findById(interview.applicationId);
    const job = await Job.findById(application?.jobId);
    const actor = await User.findById(req.userId);
    if (!ensureInterviewAccess(actor, application, job)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const questions = await InterviewQuestion.findByInterviewId(interviewId);

    return res.status(200).json({
      success: true,
      interview,
      questions,
    });
  } catch (error) {
    console.error("Get interview results error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview results",
    });
  }
};

export const getInterviewByApplication = async (req, res) => {
  try {
    const { application_id: applicationId } = req.params;
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job = await Job.findById(application.jobId);
    const actor = await User.findById(req.userId);
    if (!ensureInterviewAccess(actor, application, job)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const interview = await Interview.findByApplicationId(applicationId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not scheduled yet",
      });
    }

    const questions = await InterviewQuestion.findByInterviewId(interview.id);
    return res.status(200).json({
      success: true,
      interview,
      questions,
    });
  } catch (error) {
    console.error("Get interview by application error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load interview",
    });
  }
};

export const completeInterviewExternal = async (req, res) => {
  try {
    const { accessCode, aiScore, transcript, feedback: externalFeedback } = req.body;

    if (!accessCode) {
      return res.status(400).json({
        success: false,
        message: "accessCode is required",
      });
    }

    const interview = await Interview.findByAccessCode(accessCode);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found for provided access code",
      });
    }

    if (interview.status === "COMPLETED") {
      return res.status(200).json({
        success: true,
        message: "Interview already completed",
      });
    }

    const application = await Application.findById(interview.applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const applicant = await User.findById(application.userId);
    const job = await Job.findById(application.jobId);

    const numericScore =
      typeof aiScore === "number"
        ? Math.max(0, Math.min(100, Math.round(aiScore)))
        : 0;

    let aiOutcome = "FAILED_AI_INTERVIEW";
    if (numericScore >= 70) {
      aiOutcome = "PASSED_AI_INTERVIEW";
    } else if (numericScore >= 50) {
      aiOutcome = "BORDERLINE_REVIEW";
    }

    const updatedInterview = await Interview.update(interview.id, {
      status: "COMPLETED",
      completedDate: new Date().toISOString(),
      aiScore: numericScore,
      aiTranscript: Array.isArray(transcript) ? transcript : [],
      metadata: {
        ...interview.metadata,
        aiOutcome,
        externalFeedback: externalFeedback || null,
      },
    });

    const finalScore = calculateFinalScore({
      cvScore: application.cvScore || 0,
      interviewScore: numericScore,
    });
    const postDecision = determinePostInterviewStatus(finalScore);

    const updatedApplication = await Application.update(application.id, {
      status: postDecision.status,
      aiScore: numericScore,
      finalScore,
    });

    const log = new QualificationLog({
      applicationId: application.id,
      screeningType: "AI_INTERVIEW",
      score: numericScore,
      decision: `${aiOutcome} / Final: ${postDecision.status}`,
      reason: externalFeedback?.comments?.join("; ") || "External AI interview results",
    });
    await log.save();

    await safeSendEmail({
      to: applicant.email,
      subject: `AI interview result – ${job.title}`,
      template: "aiInterviewResult",
      variables: {
        CANDIDATE_NAME: applicant.name,
        JOB_TITLE: job.title,
        SCORE: numericScore,
        MESSAGE:
          postDecision.status === "READY_FOR_HUMAN_INTERVIEW"
            ? "Fantastic work! You're moving to the next phase."
            : postDecision.status === "PENDING_REVIEW"
            ? "Our recruiting team will review your transcript shortly."
            : "Thanks for interviewing. Keep exploring other roles on HireMate.",
        CTA_TEXT: "See feedback",
        CTA_URL: (process.env.FRONTEND_URL || "http://localhost:5173") + "/my-applications",
      },
    });

    if (postDecision.status === "READY_FOR_HUMAN_INTERVIEW") {
      await safeSendEmail({
        to: applicant.email,
        subject: `Next steps – ${job.title}`,
        template: "finalSelection",
        variables: {
          CANDIDATE_NAME: applicant.name,
          JOB_TITLE: job.title,
          FINAL_SCORE: finalScore,
          MESSAGE:
            "We'll connect you with the hiring team to schedule a human interview.",
          CTA_TEXT: "Prepare for next round",
          CTA_URL: (process.env.FRONTEND_URL || "http://localhost:5173") + "/my-applications",
        },
      });
    } else if (postDecision.status === "REJECTED") {
      await safeSendEmail({
        to: applicant.email,
        subject: `Application update – ${job.title}`,
        template: "rejectionNotification",
        variables: {
          CANDIDATE_NAME: applicant.name,
          MESSAGE:
            "After evaluating your AI interview, we won't proceed this time. Please remain in touch for future roles.",
        },
      });
    }

    await notifyInterviewWebhook({
      event: "INTERVIEW_COMPLETED",
      interviewId: interview.id,
      applicationId: application.id,
      aiScore: numericScore,
      finalScore,
      status: postDecision.status,
      applicant: { id: applicant.id, email: applicant.email },
      job: { id: job.id, title: job.title },
      parsedSkills: [],
    });

    await notifyStatusChange({
      event: "INTERVIEW_STATUS",
      applicationId: application.id,
      aiScore: numericScore,
      finalScore,
      status: postDecision.status,
    });

    return res.status(200).json({
      success: true,
      interview: updatedInterview,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("External interview completion error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to record external interview results",
    });
  }
};


