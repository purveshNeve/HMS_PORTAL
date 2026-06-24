import { resend } from "./resend";

const resendFrom = process.env.RESEND_FROM_EMAIL ?? `HRMS <onboarding@resend.dev>`;

export async function sendPasswordResetEmail(email: string, token: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetLink = `${appUrl}/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: resendFrom,
      to: [email],
      subject: "HRMS Password Reset",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
          <h1 style="font-size:20px;margin-bottom:8px;">Password reset request</h1>
          <p>We received a request to reset the password for your HRMS account.</p>
          <p>
            Click the button below to choose a new password. This link expires in 1 hour.
          </p>
          <p>
            <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
              Reset password
            </a>
          </p>
          <p>If you did not request this reset, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("SEND PASSWORD RESET EMAIL ERROR:", error);
    throw error;
  }
}

export async function sendIncorrectPasswordAlertEmail(email: string, name?: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/forgetPasswordPage`;
  const userGreeting = name ? `Hi ${name},` : "Hello,";

  await resend.emails.send({
    from: resendFrom,
    to: [email],
    subject: "Failed login attempt on your HRMS account",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
        <h1 style="font-size:20px;margin-bottom:8px;">Failed login attempt</h1>
        <p>${userGreeting}</p>
        <p>
          We detected a login attempt for your HRMS email address with an incorrect password.
          If this was you, please try again or reset your password.
        </p>
        <p>
          If you did not attempt to sign in, you should reset your password immediately.
        </p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
            Reset your password
          </a>
        </p>
        <p style="color:#555;font-size:14px;margin-top:16px;">
          If you continue to receive this message, contact your administrator.
        </p>
      </div>
    `,
  });
}
