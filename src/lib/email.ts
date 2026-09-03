import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendRegistrationReceivedEmail(input: {
  email: string;
  firstName: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return { status: "skipped" as const };
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(input.firstName);
  const { error } = await resend.emails.send({
    from,
    to: input.email,
    subject: "We received your Coach Arena 5K registration",
    html: `
      <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6;max-width:600px;margin:auto">
        <div style="background:#090909;color:#fff;padding:28px;border-top:8px solid #ff5a12">
          <h1 style="margin:0;font-size:28px">Coach Arena 5K</h1>
          <p style="margin:6px 0 0;color:#bbb">Five-Year Anniversary</p>
        </div>
        <div style="padding:28px;background:#fffdf8">
          <p>Hi ${safeName},</p>
          <p>We received your registration for the Coach Arena 5K on Sunday, October 18, 2026 at 10:00 AM in Lincoln Park, Jersey City.</p>
          <p>Your entry is <strong>pending manual GoFundMe verification</strong>. We’ll email you when it is confirmed and again when event-day details are ready.</p>
          <p>Questions? Reply to this email or contact <a href="mailto:${siteConfig.contactEmail}">${siteConfig.contactEmail}</a>.</p>
        </div>
      </div>`,
  });

  return { status: error ? ("failed" as const) : ("sent" as const) };
}
