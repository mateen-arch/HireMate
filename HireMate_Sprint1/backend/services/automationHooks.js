import fetch from "node-fetch";

const sendWebhook = async (url, payload, label) => {
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn(`⚠️ Failed to notify ${label || "automation webhook"}`, error);
  }
};

export const notifyApplicationWebhook = async (payload) => {
  await sendWebhook(
    process.env.N8N_APPLICATION_WEBHOOK || process.env.N8N_WEBHOOK_URL,
    payload,
    "application webhook"
  );
};

export const notifyInterviewWebhook = async (payload) => {
  await sendWebhook(
    process.env.N8N_INTERVIEW_WEBHOOK ||
      process.env.N8N_WEBHOOK_URL ||
      process.env.N8N_APPLICATION_WEBHOOK,
    payload,
    "interview webhook"
  );
};

export const notifyStatusChange = async (payload) => {
  await sendWebhook(
    process.env.N8N_STATUS_WEBHOOK ||
      process.env.N8N_WEBHOOK_URL ||
      process.env.N8N_APPLICATION_WEBHOOK,
    { event: "STATUS_CHANGE", ...payload },
    "status-change webhook"
  );
};



