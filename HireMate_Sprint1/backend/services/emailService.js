import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, "..", "templates", "emails");

const templateCache = new Map();

const loadTemplate = (templateName) => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  const filePath = path.join(TEMPLATE_DIR, `${templateName}.html`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Email template "${templateName}" not found`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  templateCache.set(templateName, content);
  return content;
};

const renderTemplate = (templateName, variables = {}) => {
  let html = loadTemplate(templateName);
  Object.entries(variables).forEach(([key, value]) => {
    const token = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(token, value ?? "");
  });
  return html;
};

const emailConfigAvailable =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  (process.env.EMAIL_PASS || process.env.EMAIL_API_KEY);

const transporter = emailConfigAvailable
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: Number(process.env.EMAIL_PORT || 587) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.EMAIL_API_KEY,
      },
    })
  : null;

export const sendTemplatedEmail = async ({
  to,
  subject,
  template,
  variables,
}) => {
  const html = renderTemplate(template, {
    YEAR: new Date().getFullYear(),
    ...variables,
  });

  if (!emailConfigAvailable) {
    console.info("📬 [Email disabled] Would send:", {
      to,
      subject,
      template,
      variables,
    });
    return;
  }

  await transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME || "HireMate"} <${
      process.env.EMAIL_USER
    }>`,
    to,
    subject,
    html,
  });
};



