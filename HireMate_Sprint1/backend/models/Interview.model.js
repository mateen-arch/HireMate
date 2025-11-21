import { getInterviews, saveInterviews } from "../utils/storage.js";

const buildId = () =>
  `interview_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const allowedStatuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export class Interview {
  constructor(data) {
    this.id = data.id || buildId();
    this.applicationId = data.applicationId;
    this.interviewType = data.interviewType || "AI_FIRST_PHASE";
    this.scheduledDate = data.scheduledDate || new Date().toISOString();
    this.completedDate = data.completedDate || null;
    this.status = allowedStatuses.includes(data.status)
      ? data.status
      : "SCHEDULED";
    this.aiTranscript = data.aiTranscript || [];
    this.aiScore =
      typeof data.aiScore === "number" ? Math.round(data.aiScore * 100) / 100 : null;
    this.feedback = data.feedback || "";
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findById(id) {
    const interviews = getInterviews();
    return interviews.find((record) => record.id === id) || null;
  }

  static async findByApplicationId(applicationId) {
    const interviews = getInterviews();
    return (
      interviews.find((record) => record.applicationId === applicationId) ||
      null
    );
  }

  static async findByAccessCode(accessCode) {
    if (!accessCode) return null;
    const interviews = getInterviews();
    return (
      interviews.find(
        (record) => record.metadata?.accessCode === accessCode
      ) || null
    );
  }

  static async list(filter = {}) {
    const interviews = getInterviews();
    return interviews.filter((record) =>
      Object.entries(filter).every(([key, value]) => {
        if (value === undefined) return true;
        return record[key] === value;
      })
    );
  }

  async save() {
    const interviews = getInterviews();
    const payload = {
      id: this.id,
      applicationId: this.applicationId,
      interviewType: this.interviewType,
      scheduledDate: this.scheduledDate,
      completedDate: this.completedDate,
      status: this.status,
      aiTranscript: this.aiTranscript,
      aiScore: this.aiScore,
      feedback: this.feedback,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    const index = interviews.findIndex((item) => item.id === this.id);
    if (index >= 0) {
      interviews[index] = payload;
    } else {
      interviews.push(payload);
    }
    saveInterviews(interviews);
    return payload;
  }

  static async update(id, updates) {
    const interviews = getInterviews();
    const index = interviews.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Interview not found");
    }

    const updatedRecord = {
      ...interviews[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    interviews[index] = updatedRecord;
    saveInterviews(interviews);
    return updatedRecord;
  }
}


