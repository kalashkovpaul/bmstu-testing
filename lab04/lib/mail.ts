import * as nodemailer from 'nodemailer'
import { Options } from './types/mail'

export async function sendEmail({ to, subject, text, html }: Options) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  });
  return info;
}

export function generateProfileConfirmationBodyPlain(token: string) {
  return `
    Hi,
    You have updated your email address.
    Please click the following link to confirm your your new email address:
    ${process.env.APP_URL}/confirm-email/${token}
    Thank you,
  `
}

export function generateProfileConfirmationBodyHTML(token: string) {
  return `
    <p>Hi,</p>
    <p>You have updated your email address.</p>
    <p>Please click the following link to confirm your your new email address:</p>
    <p><a href="${process.env.APP_URL}/confirm-email/${token}">${process.env.APP_URL}/api/confirm-profile?token=${token}</a></p>
    <p>Thank you,</p>
  `
}

export function generateConfirmRegistrationBodyPlain(token: string) {
  return `
    Please click the following link to confirm your email address:
    ${process.env.APP_URL}/confirm-email/${token}
  `
}

export function generateConfirmRegistrationBodyHTML(token: string) {
  return `
    <h1>Welcome to ${process.env.APP_NAME}</h1>
    <p>
      Please click the following link to confirm your account:
      <a href="${process.env.APP_URL}/confirm-email/${token}">Confirm email</a>
    </p>
  `
}

export function generateForgotPasswordBodyPlain(token: string) {
  return `
    Please click the following link to reset your password:
    ${process.env.APP_URL}/forgot-password/${token}
  `
}

export function generateForgotPasswordBodyHTML(token: string) {
  return `
    <h1>Reset your password</h1>
    <p>
      Please click the following link to reset your password:
      <a href="${process.env.APP_URL}/forgot-password/${token}">Reset password</a>
    </p>
  `
}
