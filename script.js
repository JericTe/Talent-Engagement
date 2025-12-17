// Helper: safely set text
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await res.json();
  } else {
    data = { raw: await res.text() };
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message || data.raw)) || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function disable(btn, isDisabled, label) {
  if (!btn) return;
  btn.disabled = isDisabled;
  if (label) btn.textContent = label;
}

document.addEventListener("DOMContentLoaded", () => {
  // -------- Matchmaker --------
  const mmForm = document.getElementById("matchmakerForm");
  if (mmForm) {
    mmForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const role = document.getElementById("mm_role")?.value || "";
      const jd = document.getElementById("mm_jd")?.value || "";
      const submit = document.getElementById("mm_submit");
      const out = document.getElementById("mm_output");

      setText("mm_status", "");
      if (out) out.textContent = "Working…";

      try {
        disable(submit, true, "Generating…");
        const data = await postJSON("/api/matchmaker", { role, jobDescription: jd });
        if (out) out.textContent = data.output || JSON.stringify(data, null, 2);
        setText("mm_status", "Done.");
      } catch (err) {
        if (out) out.textContent = "";
        setText("mm_status", "Error: " + err.message);
      } finally {
        disable(submit, false, "Generate Recommendations");
      }
    });
  }

  // -------- Resume Analyzer --------
  const raForm = document.getElementById("resumeForm");
  if (raForm) {
    raForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const resumeText = document.getElementById("ra_resume")?.value || "";
      const jobDescription = document.getElementById("ra_jd")?.value || "";
      const submit = document.getElementById("ra_submit");
      const out = document.getElementById("ra_output");

      setText("ra_status", "");
      if (out) out.textContent = "Working…";

      try {
        disable(submit, true, "Analyzing…");
        const data = await postJSON("/api/resume-analyze", { resumeText, jobDescription });
        if (out) out.textContent = data.output || JSON.stringify(data, null, 2);
        setText("ra_status", "Done.");
      } catch (err) {
        if (out) out.textContent = "";
        setText("ra_status", "Error: " + err.message);
      } finally {
        disable(submit, false, "Analyze Resume");
      }
    });
  }

  // -------- Chatbot --------
  const chatLog = document.getElementById("chatLog");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  const history = []; // {role:'user'|'assistant', content:'...'}

  function addBubble(role, text) {
    if (!chatLog) return;
    const div = document.createElement("div");
    div.className = "chat-bubble " + (role === "user" ? "chat-user" : "chat-assistant");
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  if (chatLog) {
    addBubble("assistant", "Hi! I’m TalentEngage AI. Ask me about hiring, interviewing, sourcing, or offer strategy.");
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = (chatInput?.value || "").trim();
      if (!message) return;

      setText("chatStatus", "");
      addBubble("user", message);
      history.push({ role: "user", content: message });

      if (chatInput) chatInput.value = "";

      try {
        disable(chatSend, true, "Sending…");
        // Only send last 12 messages to keep it lightweight
        const recent = history.slice(-12);
        const data = await postJSON("/api/chat", { message, history: recent });
        const reply = data.reply || data.output || "(No reply)";
        addBubble("assistant", reply);
        history.push({ role: "assistant", content: reply });
      } catch (err) {
        addBubble("assistant", "Sorry — I hit an error: " + err.message);
      } finally {
        disable(chatSend, false, "Send");
      }
    });
  }

  // -------- Contact --------
  const cForm = document.getElementById("contactForm");
  if (cForm) {
    cForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById("c_name")?.value || "",
        email: document.getElementById("c_email")?.value || "",
        company: document.getElementById("c_company")?.value || "",
        role: document.getElementById("c_role")?.value || "",
        message: document.getElementById("c_message")?.value || "",
        website: document.getElementById("c_website")?.value || "", // honeypot
      };

      const submit = document.getElementById("c_submit");
      setText("c_status", "");

      try {
        disable(submit, true, "Sending…");
        const data = await postJSON("/api/contact", payload);
        setText("c_status", data.message || "Sent! We’ll reply soon.");
        cForm.reset();
      } catch (err) {
        setText("c_status", "Error: " + err.message);
      } finally {
        disable(submit, false, "Send Message");
      }
    });
  }
});
