import { NextResponse } from "next/server";

const allowed = new Set([
  "bd@renaatus.com",
  "hr@renaatus.com",
  "maldives@renaatus.com",
  "mauritius@renaatus.com",
]);

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  to?: unknown;
  subject?: unknown;
  body?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: ContactBody;
  try {
    payload = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const name = asString(payload.name);
  const email = asString(payload.email);
  const phone = asString(payload.phone);
  const to = asString(payload.to) || "bd@renaatus.com";
  const subject = asString(payload.subject);
  const body = asString(payload.body);

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (subject.length < 3) {
    return NextResponse.json({ ok: false, error: "Please add a subject." }, { status: 400 });
  }
  if (body.length < 10) {
    return NextResponse.json({ ok: false, error: "Please include a short message." }, { status: 400 });
  }
  if (!allowed.has(to)) {
    return NextResponse.json({ ok: false, error: "Please choose a valid office." }, { status: 400 });
  }

  const composed = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    body,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composed)}`;

  return NextResponse.json({ ok: true, mailto });
}
