import test from "node:test";
import assert from "node:assert/strict";
import { evaluateQualification } from "../services/qualificationMatcher.js";

const sampleJob = {
  title: "Senior Full Stack Engineer",
  description:
    "Looking for JavaScript, React, Node.js expert with at least 5 years experience.",
  category: "Engineering",
};

test("rejects low matches", () => {
  const parsed = {
    parsedSkills: ["excel", "word"],
    experienceYears: 1,
    educationLevel: "BACHELOR",
    certifications: [],
  };

  const result = evaluateQualification({ job: sampleJob, parsedData: parsed });
  assert.ok(result.score < 40);
  assert.equal(result.status, "REJECTED");
});

test("qualifies strong candidates", () => {
  const parsed = {
    parsedSkills: ["JavaScript", "React", "Node", "HTML", "CSS"],
    experienceYears: 6,
    educationLevel: "MASTER",
    certifications: ["AWS Certified"],
  };

  const result = evaluateQualification({ job: sampleJob, parsedData: parsed });
  assert.ok(result.score >= 60);
  assert.equal(result.status, "QUALIFIED_FOR_INTERVIEW");
});

test("flags borderline candidates for review", () => {
  const parsed = {
    parsedSkills: ["JavaScript", "React"],
    experienceYears: 3,
    educationLevel: "BACHELOR",
    certifications: [],
  };

  const result = evaluateQualification({ job: sampleJob, parsedData: parsed });
  assert.ok(result.score >= 40 && result.score < 60);
  assert.equal(result.status, "PENDING_REVIEW");
});



