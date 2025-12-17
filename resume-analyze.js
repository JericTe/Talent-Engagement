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
    const resumeText = (body.resumeText || "").toString().trim();
    const jobDescription = (body.jobDescription || "").toString().trim();

    if (!resumeText) return res.status(400).json({ error: "Missing resumeText" });
    if (resumeText.length > 20000) return res.status(400).json({ error: "Resume text too long (max 20000 chars)" });
    if (jobDescription.length > 15000) return res.status(400).json({ error: "Job description too long (max 15000 chars)" });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const messages = [
      {
        role: "system",
        content:
          "You are an expert recruiter and ATS specialist. " +
          "Return plain text (no markdown). Use short headings and bullet points. " +
          "If job description is provided, compute a Fit Score 0-100 with justification. " +
          "Be honest, not overly positive.",
      },
      {
        role: "user",
        content:
          "Resume text:\n" +
          resumeText +
          "\n\n" +
          (jobDescription
            ? "Job description:\n" + jobDescription + "\n\n"
            : "No job description provided.\n\n") +
          "Deliver:\n" +
          "1) Quick Summary (2-3 lines)\n" +
          "2) Strengths (5 bullets)\n" +
          "3) Gaps/Risks (5 bullets)\n" +
          "4) ATS Keywords to Add (10-20, comma-separated)\n" +
          "5) Rewrite Suggestions (3 bullets)\n" +
          (jobDescription ? "6) Fit Score (0-100) + why\n" : ""),
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
