import {
  getQualificationLogs,
  saveQualificationLogs,
} from "../utils/storage.js";

const generateId = () =>
  `qualificationLog_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export class QualificationLog {
  constructor(data) {
    this.id = data.id || generateId();
    this.applicationId = data.applicationId;
    this.screeningType = data.screeningType || "CV_SCREENING";
    this.score = typeof data.score === "number" ? data.score : null;
    this.decision = data.decision || "";
    this.reason = data.reason || "";
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  async save() {
    const logs = getQualificationLogs();
    const payload = {
      id: this.id,
      applicationId: this.applicationId,
      screeningType: this.screeningType,
      score: this.score,
      decision: this.decision,
      reason: this.reason,
      metadata: this.metadata,
      createdAt: this.createdAt,
    };
    logs.push(payload);
    saveQualificationLogs(logs);
    return payload;
  }
}



