import "server-only";
import nodemailer from "nodemailer";

type PasswordResetMailInput = {
  to: string;
  resetUrl: string;
  name?: string | null;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM;
const smtpSecureEnv = process.env.SMTP_SECURE;

let transporter: nodemailer.Transporter | null = null;

function isSmtpConfigured() {
  return Boolean(smtpHost && smtpUser && smtpPass && smtpFrom);
}

function getTransporter() {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM.");
  }

  if (transporter) {
    return transporter;
  }

  const secure = smtpSecureEnv ? smtpSecureEnv === "true" : smtpPort === 465;

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

export async function sendPasswordResetEmail({ to, resetUrl, name }: PasswordResetMailInput) {
  const client = getTransporter();
  const displayName = name || "there";

  await client.sendMail({
    from: smtpFrom,
    to,
    subject: "Reset your Qurafy password",
    text: `Hi ${displayName},\n\nWe received a request to reset your Qurafy password.\n\nReset link: ${resetUrl}\n\nIf you didn’t request this, you can ignore this email.\n`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <p>Hi ${displayName},</p>
        <p>We received a request to reset your Qurafy password.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111827;color:#fff;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn’t work, use this link:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
  });
}
