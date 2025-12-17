export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Server misconfigured: missing OPENAI_API_KEY" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const role = (body.role || "").toString().trim();
    const jobDescription = (body.jobDescription || "").toString().trim();

    if (!jobDescription) return res.status(400).json({ error: "Missing jobDescription" });
    if (jobDescription.length > 15000) return res.status(400).json({ error: "Job description too long (max 15000 chars)" });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const messages = [
      {
        role: "system",
        content:
          "You are a senior technical recruiter + founder. " +
          "You optimize job descriptions for clarity, candidate quality, and inclusivity. " +
          "Return plain text (no markdown). Use short headings and bullet points. " +
          "Be specific and practical. Avoid generic fluff.",
      },
      {
        role: "user",
        content:
          `Role title (optional): ${role || "(not provided)"}\n\n` +
          "Job description:\n" +
          jobDescription +
          "\n\n" +
          "Deliver:\n" +
          "1) JD Improvements (rewrite suggestions + missing info)\n" +
          "2) Missing Skills/Signals (what to add/remove)\n" +
          "3) Screening Questions (8-12)\n" +
          "4) Candidate Scorecard (5-7 criteria)\n" +
          "5) Short outreach message (LinkedIn DM style, <80 words)\n" +
          "6) Interview loop (stages + what to test)\n",
      },
    ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 900,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ error: "OpenAI error", details: text.slice(0, 2000) });
    }

    const data = await resp.json();
    const output = data?.choices?.[0]?.message?.content?.trim() || "No output.";
    return res.status(200).json({ output });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err?.message || err) });
  }
}
