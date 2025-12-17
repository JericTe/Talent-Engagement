export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.CONTACT_TO_EMAIL;
    const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

    if (!RESEND_API_KEY) return res.status(500).json({ error: "Server misconfigured: missing RESEND_API_KEY" });
    if (!TO_EMAIL) return res.status(500).json({ error: "Server misconfigured: missing CONTACT_TO_EMAIL" });
    if (!FROM_EMAIL) return res.status(500).json({ error: "Server misconfigured: missing CONTACT_FROM_EMAIL" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const company = (body.company || "").toString().trim();
    const role = (body.role || "").toString().trim();
    const message = (body.message || "").toString().trim();
    const honeypot = (body.website || "").toString().trim();

    // Simple spam trap
    if (honeypot) {
      return res.status(200).json({ message: "Thanks! We received your message." });
    }

    if (!name) return res.status(400).json({ error: "Please enter your name." });
    if (!email || !email.includes("@")) return res.status(400).json({ error: "Please enter a valid email." });
    if (!message) return res.status(400).json({ error: "Please enter a message." });
    if (message.length > 8000) return res.status(400).json({ error: "Message too long (max 8000 chars)." });

    const ip = (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim();

    const subject = `New lead from talentengagements.com — ${name}${company ? " (" + company + ")" : ""}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>New website inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
        ${role ? `<p><strong>Role:</strong> ${escapeHtml(role)}</p>` : ""}
        ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ""}
        <hr />
        <p style="white-space: pre-wrap;"><strong>Message:</strong><br/>${escapeHtml(message)}</p>
      </div>
    `;

    const payload = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      html,
      reply_to: email,
    };

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ error: "Email send failed", details: text.slice(0, 2000) });
    }

    return res.status(200).json({ message: "Sent! We’ll reply soon." });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err?.message || err) });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
