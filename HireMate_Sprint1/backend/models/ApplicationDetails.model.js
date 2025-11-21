import {
  getApplicationDetails,
  saveApplicationDetails,
} from "../utils/storage.js";

const generateId = () =>
  `applicationDetail_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export class ApplicationDetails {
  constructor(data) {
    this.id = data.id || generateId();
    this.applicationId = data.applicationId;
    this.parsedSkills = data.parsedSkills || [];
    this.experienceYears =
      typeof data.experienceYears === "number" ? data.experienceYears : null;
    this.educationLevel = data.educationLevel || null;
    this.certifications = data.certifications || [];
    this.matchScore =
      typeof data.matchScore === "number" ? data.matchScore : null;
    this.rawTextPreview = data.rawTextPreview || "";
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findByApplicationId(applicationId) {
    const details = getApplicationDetails();
    return details.find((detail) => detail.applicationId === applicationId);
  }

  async save() {
    const details = getApplicationDetails();
    const existingIndex = details.findIndex(
      (detail) => detail.applicationId === this.applicationId
    );

    const payload = {
      id: this.id,
      applicationId: this.applicationId,
      parsedSkills: this.parsedSkills,
      experienceYears: this.experienceYears,
      educationLevel: this.educationLevel,
      certifications: this.certifications,
      matchScore: this.matchScore,
      rawTextPreview: this.rawTextPreview,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    if (existingIndex >= 0) {
      details[existingIndex] = { ...details[existingIndex], ...payload };
    } else {
      details.push(payload);
    }

    saveApplicationDetails(details);
    return payload;
  }
}



