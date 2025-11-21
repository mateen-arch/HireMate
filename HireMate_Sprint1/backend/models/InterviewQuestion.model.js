import {
  getInterviewQuestions,
  saveInterviewQuestions,
} from "../utils/storage.js";

const makeId = () =>
  `interviewQuestion_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export class InterviewQuestion {
  constructor(data) {
    this.id = data.id || makeId();
    this.interviewId = data.interviewId;
    this.order = data.order ?? 0;
    this.questionText = data.questionText;
    this.answerText = data.answerText || "";
    this.score =
      typeof data.score === "number" ? Math.round(data.score * 100) / 100 : null;
    this.breakdown = data.breakdown || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findByInterviewId(interviewId) {
    const questions = getInterviewQuestions();
    return questions
      .filter((question) => question.interviewId === interviewId)
      .sort((a, b) => a.order - b.order);
  }

  static async findById(id) {
    const questions = getInterviewQuestions();
    return questions.find((q) => q.id === id) || null;
  }

  async save() {
    const questions = getInterviewQuestions();
    const payload = {
      id: this.id,
      interviewId: this.interviewId,
      order: this.order,
      questionText: this.questionText,
      answerText: this.answerText,
      score: this.score,
      breakdown: this.breakdown,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    const index = questions.findIndex((q) => q.id === this.id);
    if (index >= 0) {
      questions[index] = payload;
    } else {
      questions.push(payload);
    }

    saveInterviewQuestions(questions);
    return payload;
  }

  static async update(id, updates) {
    const questions = getInterviewQuestions();
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error("Interview question not found");
    }

    const updatedRecord = {
      ...questions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    questions[index] = updatedRecord;
    saveInterviewQuestions(questions);
    return updatedRecord;
  }
}



