import { Resend } from "resend";

const FROM_ADDRESS = "Falcotrix <no-reply@falcotrix.com>"; // TODO: confirm sending domain once verified in Resend

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendResetPasswordEmail(to: string, url: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping reset password email send");
    return;
  }
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your Falcotrix Studio password",
    text: `Click the link below to reset your password. This link expires in 1 hour.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
  });
}

export async function sendAdminInviteEmail(to: string, inviterName: string, url: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping invite email send");
    return;
  }
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `${inviterName} invited you to Falcotrix Studio`,
    text: `${inviterName} has invited you to join Falcotrix Studio as an admin.\n\nClick the link below to set your password and activate your account. This link expires in 7 days.\n\n${url}\n\nIf you weren't expecting this, you can safely ignore this email.`,
  });
}

export async function sendContactNotificationEmail(
  name: string,
  email: string,
  subject: string,
  details: string,
) {
  const resend = getResend();
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;
  if (!resend || !notifyTo) {
    console.warn(
      "RESEND_API_KEY or CONTACT_NOTIFY_EMAIL not set — skipping contact notification email",
    );
    return;
  }
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: notifyTo,
    replyTo: email,
    subject: `New contact message: ${subject}`,
    text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${details}\n\nView in Studio: ${process.env.BETTER_AUTH_URL ?? ""}/studio/contact`,
  });
}
