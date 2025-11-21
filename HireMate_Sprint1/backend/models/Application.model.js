import { getApplications, saveApplications } from "../utils/storage.js";

const generateId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export class Application {
  constructor(data) {
    this.id = data.id || generateId("application");
    this.jobId = data.jobId;
    this.userId = data.userId;
    this.cvPath = data.cvPath;
    this.cvOriginalName = data.cvOriginalName || "";
    this.coverLetter = data.coverLetter || "";
    this.status = data.status || "NEW_APPLICATION";
    const resolvedScore =
      typeof data.cvScore === "number"
        ? data.cvScore
        : typeof data.score === "number"
        ? data.score
        : null;
    this.cvScore = resolvedScore;
    this.score = resolvedScore;
    this.aiScore =
      typeof data.aiScore === "number" ? data.aiScore : null;
    this.finalScore =
      typeof data.finalScore === "number" ? data.finalScore : resolvedScore;
    this.appliedDate = data.appliedDate || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findById(id) {
    const applications = getApplications();
    return applications.find((app) => app.id === id) || null;
  }

  static async findByUserAndJob(userId, jobId) {
    const applications = getApplications();
    return applications.find(
      (app) => app.userId === userId && app.jobId === jobId
    );
  }

  static async findByJobId(jobId) {
    const applications = getApplications();
    return applications.filter((app) => app.jobId === jobId);
  }

  static async list(filter = {}) {
    const applications = getApplications();
    return applications.filter((app) => {
      return Object.entries(filter).every(([key, value]) => {
        if (value === undefined) return true;
        return app[key] === value;
      });
    });
  }

  async save() {
    const applications = getApplications();
    const existingIndex = applications.findIndex((app) => app.id === this.id);

    const payload = {
      id: this.id,
      jobId: this.jobId,
      userId: this.userId,
      cvPath: this.cvPath,
      cvOriginalName: this.cvOriginalName,
      coverLetter: this.coverLetter,
      status: this.status,
      cvScore: this.cvScore,
      aiScore: this.aiScore,
      score: this.cvScore,
      finalScore: this.finalScore,
      appliedDate: this.appliedDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    if (existingIndex >= 0) {
      applications[existingIndex] = payload;
    } else {
      applications.push(payload);
    }

    saveApplications(applications);
    return payload;
  }

  static async update(id, updates) {
    const applications = getApplications();
    const index = applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error("Application not found");
    }

    applications[index] = {
      ...applications[index],
      ...updates,
      cvScore:
        typeof updates.cvScore === "number"
          ? updates.cvScore
          : applications[index].cvScore,
      aiScore:
        typeof updates.aiScore === "number"
          ? updates.aiScore
          : applications[index].aiScore,
      score:
        typeof updates.score === "number"
          ? updates.score
          : typeof updates.cvScore === "number"
          ? updates.cvScore
          : applications[index].score,
      finalScore:
        typeof updates.finalScore === "number"
          ? updates.finalScore
          : applications[index].finalScore,
      updatedAt: new Date().toISOString(),
    };

    saveApplications(applications);
    return applications[index];
  }
}


