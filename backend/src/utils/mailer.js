// utils/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
     user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendInviteEmail(email, inviteLink, orgName) {
  await transporter.sendMail({
    from: `"WorkGrid" <${process.env.MAIL_USER}>`,
    to: email,
    subject: `You're invited to join ${orgName} on WorkGrid`,
    html: `
      <p>You have been invited to join <b>${orgName}</b>.</p>
      <a href="${inviteLink}">Join Workspace</a>
    `,
  });
}




export async function sendVerificationEmail(email, link) {
  await transporter.sendMail({
    from: `"WorkGrid" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your email – WorkGrid",
    html: `
      <h3>Verify your email</h3>
      <p>Please verify your email to activate your workspace.</p>
      <a href="${link}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}