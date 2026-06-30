import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const configured = env.SMTP_HOST && env.SMTP_PORT;

export const transporter = configured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
    })
  : null;

export async function sendMail({ to, subject, html }) {
  if (!transporter) return;
  await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
}
