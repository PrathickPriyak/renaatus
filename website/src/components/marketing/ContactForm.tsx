"use client";

import { FormEvent, useState } from "react";

const destinations = [
  { value: "bd@renaatus.com", label: "Business development" },
  { value: "hr@renaatus.com", label: "Careers / HR" },
  { value: "maldives@renaatus.com", label: "Maldives" },
  { value: "mauritius@renaatus.com", label: "Mauritius" },
] as const;

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      to: String(data.get("to") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      body: String(data.get("body") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string; mailto?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Unable to send your message.");
      }
      setStatus("success");
      setMessage("Thank you. Your enquiry is ready — your email client will open so you can send it.");
      form.reset();
      if (result.mailto) {
        window.location.href = result.mailto;
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please email us directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border border-white/10 bg-panel/70 p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Name
          <input
            required
            name="name"
            autoComplete="name"
            className="rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Phone
          <input
            name="phone"
            autoComplete="tel"
            className="rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Office
          <select
            name="to"
            defaultValue="bd@renaatus.com"
            className="rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none ring-brand focus:ring-2"
          >
            {destinations.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Subject
        <input
          required
          name="subject"
          className="rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none ring-brand focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Message
        <textarea
          required
          name="body"
          rows={6}
          className="resize-y rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none ring-brand focus:ring-2"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start rounded-full bg-brand px-7 py-3 text-sm tracking-[0.14em] uppercase text-white transition hover:bg-brand-bright disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {message ? (
        <p className={status === "error" ? "text-sm text-red-300" : "text-sm text-gold"} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
