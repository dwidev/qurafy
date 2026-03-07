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
    throw new Error(
      "SMTP is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
    );
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

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  name,
}: PasswordResetMailInput) {
  const client = getTransporter();
  const displayName = name || "there";

  await client.sendMail({
    from: smtpFrom,
    to,
    subject: "Reset your Qurafy password",
    text: `Hi ${displayName},\n\nWe received a request to reset your Qurafy password.\n\nReset link: ${resetUrl}\n\nIf you didn’t request this, you can ignore this email.\n\nThanks,\nThe Qurafy Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your Qurafy password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #111827;
      padding: 30px 40px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 0;
    }
    .content {
      padding: 40px;
    }
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin-top: 0;
      margin-bottom: 20px;
    }
    p {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #111827;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
    }
    .fallback-link {
      font-size: 14px;
      color: #6b7280;
      word-break: break-all;
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .fallback-link a {
      color: #3b82f6;
      text-decoration: none;
    }
    .footer {
      padding: 30px 40px;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 13px;
      color: #9ca3af;
    }
    .ignore-text {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Qurafy</h1>
    </div>
    <div class="content">
      <h1>Password Reset Request</h1>
      <p>Hi ${displayName},</p>
      <p>We received a request to reset your password for your Qurafy account. Click the button below to choose a new password:</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p class="ignore-text">If you didn't request a password reset, you can safely ignore this email. Your current password will remain unchanged.</p>
      
      <p class="ignore-text">If the button above doesn't work, copy and paste the following link into your browser:</p>
      <div class="fallback-link">
        <a href="${resetUrl}">${resetUrl}</a>
      </div>
      
      <p style="margin-bottom: 0;">Thanks,<br>The Qurafy Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Qurafy. All rights reserved.
    </div>
  </div>
</body>
</html>
    `,
  });
}
