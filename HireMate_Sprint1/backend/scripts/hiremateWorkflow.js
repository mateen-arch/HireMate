import fs from "fs";
import path from "path";
import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";

const resolvedEnvPath = (() => {
  if (process.env.AUTOMATION_ENV) {
    return process.env.AUTOMATION_ENV;
  }
  const envCandidate = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envCandidate)) {
    return envCandidate;
  }
  const automationCandidate = path.resolve(process.cwd(), "automation.env");
  if (fs.existsSync(automationCandidate)) {
    return automationCandidate;
  }
  return envCandidate;
})();

dotenv.config({ path: resolvedEnvPath });
console.log(`⚙️  Automation env loaded from ${resolvedEnvPath}`);

const API_BASE =
  process.env.AUTOMATION_API_BASE || process.env.API_BASE || "http://localhost:5000/api";
const AUTH_TOKEN =
  process.env.AUTOMATION_TOKEN ||
  process.env.SERVICE_TOKEN ||
  process.env.AUTOMATION_BEARER ||
  "";
const FINAL_THRESHOLD = Number(
  process.env.FINAL_SCORE_THRESHOLD || process.env.FINAL_THRESHOLD || 65
);
const CRON_SCHEDULE = process.env.AUTOMATION_CRON || "*/5 * * * *";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: AUTH_TOKEN
    ? {
        Authorization: `Bearer ${AUTH_TOKEN.startsWith("Bearer ") ? AUTH_TOKEN.split(" ")[1] : AUTH_TOKEN}`,
      }
    : undefined,
});

if (!AUTH_TOKEN) {
  console.warn(
    "⚠️ AUTOMATION_TOKEN is not configured. Set it to a valid JWT or service token to enable automation actions."
  );
}

const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJobs = async () => {
  const { data } = await client.get("/jobs");
  return data.jobs || [];
};

const fetchApplicationsForJob = async (jobId) => {
  try {
    const { data } = await client.get(`/applications/qualified/${jobId}`);
    return data.applications || [];
  } catch (error) {
    console.warn(
      `⚠️ Unable to fetch applications for job ${jobId}`,
      error.response?.data || error.message
    );
    return [];
  }
};

const ensureInterviewScheduled = async (applicationId) => {
  const { data } = await client.post(`/interviews/schedule/${applicationId}`);
  return data;
};

const fetchInterviewByApplication = async (applicationId) => {
  try {
    const { data } = await client.get(`/interviews/by-application/${applicationId}`);
    return data.interview || null;
  } catch {
    return null;
  }
};

const promoteCandidate = async (applicationId, finalScore) => {
  await client.put(`/applications/status/${applicationId}`, {
    status: "READY_FOR_HUMAN_INTERVIEW",
    finalScore,
    note: "Auto-promoted by automation workflow",
  });
};

const processEntry = async ({ application, interview, job }) => {
  if (!application) return;

  if (application.status === "QUALIFIED_FOR_INTERVIEW") {
    console.log(`⚙️ Scheduling AI interview for ${application.id} (${job.title})`);
    await ensureInterviewScheduled(application.id);
    return;
  }

  if (["AI_INTERVIEW_SCHEDULED", "AI_INTERVIEW_COMPLETED"].includes(application.status)) {
    const currentInterview = interview || (await fetchInterviewByApplication(application.id));

    if (currentInterview?.status === "COMPLETED") {
      const aiScore = currentInterview.aiScore || 0;
      const finalScore =
        typeof application.finalScore === "number"
          ? application.finalScore
          : Math.round(((application.cvScore || 0) * 0.4 + aiScore * 0.6) * 100) / 100;

      if (finalScore >= FINAL_THRESHOLD && application.status !== "READY_FOR_HUMAN_INTERVIEW") {
        await promoteCandidate(application.id, finalScore);
        console.log(
          `✅ Application ${application.id} promoted to READY_FOR_HUMAN_INTERVIEW (score ${finalScore})`
        );
      } else {
        console.log(
          `ℹ️ Interview completed for ${application.id}, final score ${finalScore}, status ${application.status}`
        );
      }
    }
  }
};

const tick = async () => {
  if (!AUTH_TOKEN) {
    console.warn("⏭️ Skipping automation tick because AUTOMATION_TOKEN is missing.");
    return;
  }

  console.log("🔁 HireMate automation tick:", new Date().toISOString());
  const jobs = await fetchJobs();

  for (const job of jobs) {
    const entries = await fetchApplicationsForJob(job.id);
    for (const entry of entries) {
      await processEntry({ ...entry, job });
      await sleep(200);
    }
  }
};

const start = () => {
  cron.schedule(CRON_SCHEDULE, () => {
    tick().catch((error) => console.error("Workflow tick failed:", error.message));
  });

  tick().catch((error) => console.error("Workflow tick failed:", error.message));
};

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { start };


