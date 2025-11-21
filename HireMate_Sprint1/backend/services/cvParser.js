import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const SKILL_DICTIONARY = [
  "javascript",
  "js",
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

const EDUCATION_KEYWORDS = [
  { level: "PHD", patterns: ["phd", "doctor of philosophy"] },
  { level: "MASTER", patterns: ["master", "msc", "m.s.", "mtech", "m.tech"] },
  { level: "BACHELOR", patterns: ["bachelor", "b.sc", "btech", "b.tech", "b.e"] },
  { level: "ASSOCIATE", patterns: ["associate", "diploma"] },
  { level: "HIGH_SCHOOL", patterns: ["high school", "secondary", "12th"] },
];

const CERTIFICATION_KEYWORDS = ["certified", "certification", "certificate"];

const normalizeText = (text) =>
  text.replace(/\r\n|\r|\n/g, " ").replace(/\s+/g, " ").trim();

const parsePdf = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || "";
};

const parseDocx = async (filePath) => {
  const data = await mammoth.extractRawText({ path: filePath });
  return data.value || "";
};

const detectEducation = (text) => {
  const lower = text.toLowerCase();
  for (const item of EDUCATION_KEYWORDS) {
    if (item.patterns.some((pattern) => lower.includes(pattern))) {
      return item.level;
    }
  }
  return null;
};

const detectExperience = (text) => {
  const regex = /(\d+)\s*(?:\+)?\s*(?:years|yrs)/gi;
  let match;
  let max = null;
  while ((match = regex.exec(text)) !== null) {
    const years = parseInt(match[1], 10);
    if (!Number.isNaN(years)) {
      max = Math.max(max ?? years, years);
    }
  }
  return max;
};

const extractSkills = (text) => {
  const lower = text.toLowerCase();
  return Array.from(
    new Set(SKILL_DICTIONARY.filter((skill) => lower.includes(skill)))
  );
};

const extractCertifications = (text) => {
  const lower = text.toLowerCase();
  if (!CERTIFICATION_KEYWORDS.some((kw) => lower.includes(kw))) {
    return [];
  }

  return text
    .split(/[\n\.]/)
    .map((sentence) => sentence.trim())
    .filter(
      (sentence) =>
        sentence.length &&
        CERTIFICATION_KEYWORDS.some((kw) =>
          sentence.toLowerCase().includes(kw)
        )
    )
    .slice(0, 5);
};

export const parseCVFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  let rawText = "";

  if (extension === ".pdf") {
    rawText = await parsePdf(filePath);
  } else if (extension === ".docx") {
    rawText = await parseDocx(filePath);
  } else {
    rawText = fs.readFileSync(filePath, "utf-8");
  }

  const normalized = normalizeText(rawText);

  return {
    rawText: normalized,
    parsedSkills: extractSkills(normalized),
    experienceYears: detectExperience(normalized),
    educationLevel: detectEducation(normalized),
    certifications: extractCertifications(rawText),
  };
};



