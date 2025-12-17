# TalentEngage AI — Full-stack (Static + Backend APIs)

This project is designed for **Vercel**:
- Frontend: static site in `/public`
- Backend: serverless functions in `/api`

## What works
- Contact form → `/api/contact` → sends email via Resend
- AI Matchmaker → `/api/matchmaker` → calls OpenAI
- AI Resume Analyzer → `/api/resume-analyze` → calls OpenAI
- Recruiter Chat → `/api/chat` → calls OpenAI

---

## Required accounts
1) GoDaddy (you already have the domain)
2) Vercel (hosting)
3) OpenAI (API key + billing)
4) Resend (email API key)

---

## Environment variables (set these in Vercel)
- `OPENAI_API_KEY` = your OpenAI API key (secret)
- `OPENAI_MODEL` = optional, default: `gpt-4o-mini`
- `RESEND_API_KEY` = your Resend API key (secret)
- `CONTACT_TO_EMAIL` = where contact form emails should be delivered (example: you@yourcompany.com)
- `CONTACT_FROM_EMAIL` = a verified sender (example: hello@talentengagements.com)

---

## Local testing (optional)
If you know how to use Terminal:
- Install Node 20+
- Install Vercel CLI
- Run `vercel dev`

---

## Deploy (recommended path)
Use GitHub + Vercel (no command line required).


## Quick “is the backend alive?” test
After deploying, visit:
- https://YOURDOMAIN.com/api/health
You should see JSON like: `{ "ok": true, ... }`
