const SKILL_SYNONYMS = {
  javascript: ["js", "node", "nodejs", "node.js", "ecmascript"],
  react: ["reactjs", "react.js", "react native"],
  python: ["py"],
  sql: ["mysql", "postgres", "postgresql"],
  aws: ["amazon web services"],
  azure: ["microsoft azure"],
  gcp: ["google cloud", "google cloud platform"],
  css: ["tailwind", "bootstrap"],
  html: ["html5"],
};

const SKILL_DICTIONARY = [
  "javascript",
  "typescript",
  "node",
  "node.js",
  "react",
  "react.js",
  "angular",
  "vue",
  "html",
  "css",
  "tailwind",
  "bootstrap",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "python",
  "django",
  "flask",
  "java",
  "spring",
  "c#",
  ".net",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "git",
  "rest",
  "graphql",
  "api",
  "ai",
  "ml",
  "nlp",
];

const EDUCATION_ORDER = ["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "MASTER", "PHD"];

const normalizeSkill = (skill) => {
  const normalized = skill.toLowerCase();
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    if (normalized === canonical || synonyms.includes(normalized)) {
      return canonical;
    }
  }
  return normalized;
};

const unique = (items = []) => Array.from(new Set(items));

const recognizedSkillSet = new Set(
  [
    ...Object.keys(SKILL_SYNONYMS),
    ...Object.values(SKILL_SYNONYMS).flat(),
    ...SKILL_DICTIONARY,
  ].map((skill) => skill.toLowerCase())
);

const extractJobKeywords = (job) => {
  const baseline =
    `${job.title ?? ""} ${job.description ?? ""} ${job.category ?? ""}`.toLowerCase();
  const tokens = baseline
    .replace(/[^a-z0-9\+\s]/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);

  return unique(tokens)
    .map((token) => normalizeSkill(token))
    .filter((token) => recognizedSkillSet.has(token));
};

const scoreSkills = (jobSkills, candidateSkills) => {
  if (!jobSkills.length || !candidateSkills.length) return 0;
  const matches = candidateSkills.filter((skill) => jobSkills.includes(skill));
  return Math.min(1, matches.length / jobSkills.length);
};

const parseExperienceRequirement = (text = "") => {
  const match = text.match(/(\d+)\s*(?:\+)?\s*(?:years|yrs)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

const scoreExperience = (candidateYears, job) => {
  if (!candidateYears) return 0;
  const baseline =
    job.requirements ||
    job.description ||
    "";
  const requiredYears = parseExperienceRequirement(baseline);
  if (!requiredYears) {
    return Math.min(1, candidateYears / 5);
  }
  const ratio = candidateYears / requiredYears;
  if (ratio >= 1) return 1;
  if (ratio >= 0.75) return 0.85;
  if (ratio >= 0.5) return 0.6;
  return 0.2;
};

const scoreEducation = (candidateLevel, job) => {
  if (!candidateLevel) return 0;
  const jobText = `${job.description ?? ""} ${job.requirements ?? ""}`;
  const jobEducation = EDUCATION_ORDER.find((level) =>
    jobText.toLowerCase().includes(level.toLowerCase())
  );

  const candidateIndex = EDUCATION_ORDER.indexOf(candidateLevel);
  if (candidateIndex === -1) return 0;

  if (!jobEducation) {
    return candidateIndex / (EDUCATION_ORDER.length - 1);
  }

  const jobIndex = EDUCATION_ORDER.indexOf(jobEducation);
  if (candidateIndex >= jobIndex) return 1;
  const diff = jobIndex - candidateIndex;
  return Math.max(0, 1 - diff * 0.3);
};

const scoreCertifications = (certifications) => {
  if (!certifications || !certifications.length) return 0;
  if (certifications.length >= 3) return 1;
  if (certifications.length === 2) return 0.8;
  return 0.6;
};

const determineStatus = (score) => {
  if (score < 40) {
    return {
      status: "REJECTED",
      decision: "Auto-rejected (score below 40%)",
    };
  }
  if (score < 60) {
    return {
      status: "PENDING_REVIEW",
      decision: "Requires manual review (score between 40% and 59%)",
    };
  }
  return {
    status: "QUALIFIED_FOR_INTERVIEW",
    decision: "Auto-shortlisted (score 60%+)",
  };
};

export const evaluateQualification = ({ job, parsedData }) => {
  const jobSkills = extractJobKeywords(job);
  const candidateSkills = unique(parsedData.parsedSkills.map(normalizeSkill));

  const skillScore = scoreSkills(jobSkills, candidateSkills);
  const experienceScore = scoreExperience(parsedData.experienceYears, job);
  const educationScore = scoreEducation(parsedData.educationLevel, job);
  const certificationScore = scoreCertifications(parsedData.certifications);

  const weightedScore =
    skillScore * 40 +
    experienceScore * 30 +
    educationScore * 20 +
    certificationScore * 10;

  const { status, decision } = determineStatus(weightedScore);

  return {
    score: Math.round(weightedScore * 100) / 100,
    status,
    decision,
    breakdown: {
      skills: Math.round(skillScore * 40 * 100) / 100,
      experience: Math.round(experienceScore * 30 * 100) / 100,
      education: Math.round(educationScore * 20 * 100) / 100,
      certifications: Math.round(certificationScore * 10 * 100) / 100,
    },
    normalizedSkills: candidateSkills,
    jobSkills,
  };
};


