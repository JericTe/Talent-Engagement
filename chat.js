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
    const message = (body.message || "").toString().trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) return res.status(400).json({ error: "Missing message" });
    if (message.length > 4000) return res.status(400).json({ error: "Message too long (max 4000 chars)" });

    // Build conversation: system + recent turns
    const messages = [
      {
        role: "system",
        content:
          "You are TalentEngage AI, a practical recruiting assistant. " +
          "Answer clearly, with steps and examples. " +
          "If the user asks for legal/medical advice, provide a safe general answer and suggest professional help. " +
          "Keep responses under ~180 words unless asked for detail.",
      },
    ];

    // Only accept safe history format
    for (const m of history.slice(-12)) {
      if (!m || typeof m !== "object") continue;
      const role = m.role === "assistant" ? "assistant" : "user";
      const content = (m.content || "").toString();
      if (content) messages.push({ role, content: content.slice(0, 4000) });
    }

    // Ensure last user message is present
    if (messages[messages.length - 1]?.role !== "user") {
      messages.push({ role: "user", content: message });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 350,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ error: "OpenAI error", details: text.slice(0, 2000) });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry — I couldn’t generate a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err?.message || err) });
  }
}
