import OpenAI from "openai";

const FALLBACK_MODEL = "gpt-4o-mini";
const QUESTION_BANK = [
  "Walk me through a recent project where you solved a complex problem.",
  "How do you stay up to date with the latest trends in {{CATEGORY}}?",
  "Describe a time you had to collaborate across teams to deliver on time.",
  "What is your approach to debugging production issues?",
  "How would you design a scalable solution for {{PROBLEM}}?",
  "Explain a challenging decision you made under pressure.",
  "How do you prioritize tasks when faced with multiple deadlines?",
  "Tell me about a time you used data to influence a decision.",
];

let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const pickRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const normalize = (text = "") =>
  text
    .toLowerCase()
    .split(/[\s,.;:!?\(\)]+/)
    .map((token) => token.replace(/[^a-z0-9\+]/g, ""))
    .filter(Boolean);

const scoreByKeywords = (answer, keywords = []) => {
  if (!answer || !keywords.length) return 0;
  const answerTokens = normalize(answer);
  const matches = keywords.filter((keyword) => answerTokens.includes(keyword));
  return Math.min(1, matches.length / keywords.length);
};

const scoreByLength = (answer) => {
  if (!answer) return 0;
  const len = answer.trim().split(/\s+/).length;
  if (len >= 120) return 1;
  if (len >= 80) return 0.85;
  if (len >= 50) return 0.7;
  if (len >= 30) return 0.55;
  if (len >= 15) return 0.4;
  return 0.2;
};

const scoreForProblemSolving = (answer) => {
  if (!answer) return 0;
  const heuristics = ["solve", "approach", "challenge", "design", "optimize"];
  return scoreByKeywords(answer, heuristics);
};

const safeAverage = (values = []) => {
  if (!values.length) return 0;
  const filtered = values.filter((value) => typeof value === "number");
  if (!filtered.length) return 0;
  return filtered.reduce((sum, val) => sum + val, 0) / filtered.length;
};

const attemptOpenAIQuestionGeneration = async ({ job, count }) => {
  if (!openaiClient) return null;
  try {
    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || FALLBACK_MODEL,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are an AI recruiter. Produce JSON array with interview questions tailored to the role.",
        },
        {
          role: "user",
          content: `Generate ${count} diverse interview questions for a ${job.title} position focusing on ${job.category}. Return JSON array.`,
        },
      ],
    });
    const text = completion.choices?.[0]?.message?.content || "";
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) return null;
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === "string" ? item : item.prompt || item.q))
        .filter(Boolean);
    }
  } catch (error) {
    console.warn("⚠️ OpenAI question generation failed. Falling back.", error.message);
  }
  return null;
};

export const generateInterviewQuestions = async ({
  job,
  count = 5,
  applicant,
}) => {
  const aiQuestions = await attemptOpenAIQuestionGeneration({ job, count });
  if (aiQuestions?.length) {
    return aiQuestions;
  }

  const keywords = [
    job.category,
    job.title,
    applicant?.name,
    job.location,
    job.description,
  ]
    .filter(Boolean)
    .join(" ")
    .slice(0, 40);

  return pickRandom(QUESTION_BANK, count).map((question) =>
    question
      .replace("{{CATEGORY}}", job.category || "technology")
      .replace("{{PROBLEM}}", keywords || "scaling this product")
  );
};

const attemptOpenAIScoring = async ({ question, answer, job }) => {
  if (!openaiClient) return null;
  try {
    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || FALLBACK_MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are an interview evaluator. Return JSON with relevance, technical, communication, problem_solving scores (0-100) plus feedback text.",
        },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}\nRole: ${job.title}`,
        },
      ],
    });
    const text = completion.choices?.[0]?.message?.content || "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) return null;
    return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  } catch (error) {
    console.warn("⚠️ OpenAI scoring failed. Falling back.", error.message);
  }
  return null;
};

export const scoreInterviewAnswer = async ({ question, answer, job }) => {
  const aiScore = await attemptOpenAIScoring({ question, answer, job });
  if (aiScore) {
    return {
      relevance: aiScore.relevance || aiScore.relevanceScore || 0,
      technicalAccuracy: aiScore.technical || aiScore.technicalAccuracy || 0,
      communication: aiScore.communication || 0,
      problemSolving: aiScore.problem_solving || aiScore.problemSolving || 0,
      feedback: aiScore.feedback || "",
    };
  }

  const descriptionKeywords = normalize(
    `${job.title} ${job.category} ${job.description || ""}`
  ).slice(0, 25);

  const relevance = scoreByKeywords(answer, descriptionKeywords) * 100;
  const technicalAccuracy =
    Math.min(1, (answer.match(/\b([0-9]{1,2}|\d+\+)\b/g)?.length || 0) / 3) * 100;
  const communication = scoreByLength(answer) * 100;
  const problemSolving = scoreForProblemSolving(answer) * 100;

  return {
    relevance: Math.round(relevance),
    technicalAccuracy: Math.round(technicalAccuracy),
    communication: Math.round(communication),
    problemSolving: Math.round(problemSolving),
    feedback:
      "Automated rubric applied: balanced weight across relevance, technical depth, clarity, and problem solving.",
  };
};

export const computeInterviewScore = (questionBreakdowns = []) => {
  if (!questionBreakdowns.length) return 0;
  const overall = questionBreakdowns.map((item) => {
    const avg =
      (item.relevance + item.technicalAccuracy + item.communication + item.problemSolving) /
      4;
    return avg;
  });
  return Math.round(safeAverage(overall));
};


