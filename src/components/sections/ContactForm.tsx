"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  time: string;
  details: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  time: "",
  details: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-none border border-glass-border bg-glass px-5 py-4 font-mono text-sm text-text placeholder:font-mono placeholder:text-text-faint backdrop-blur-md transition-colors duration-200 ease-out outline-none focus:border-accent focus:bg-glass-hover";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function updateField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // TODO: wire to a real backend once one exists — e.g. POST to /api/contact
    // (Resend or similar), per AGENTS.md's "no backend unless a real feature
    // requires it, confirm with Fahim first". This stub is structured so the
    // swap is a drop-in: same formData shape, same status states.
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setFormData(initialFormData);
    } catch {
      setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <section className="relative overflow-hidden bg-[#0c0d11] py-28">
      <div className="relative mx-auto max-w-4xl px-6 lg:px-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div>
            <label htmlFor="contact-name" className="sr-only">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="sr-only">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-subject" className="sr-only">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Subject"
                required
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="contact-time" className="sr-only">
                Time
              </label>
              <input
                id="contact-time"
                name="time"
                type="text"
                placeholder="Time"
                value={formData.time}
                onChange={(e) => updateField("time", e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-details" className="sr-only">
              Details
            </label>
            <textarea
              id="contact-details"
              name="details"
              placeholder="Details"
              required
              rows={7}
              value={formData.details}
              onChange={(e) => updateField("details", e.target.value)}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-none bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-accent-hover hover:shadow-[0_0_0_1px_var(--color-accent-hover),0_0_24px_var(--color-accent-faint)] active:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
              ) : (
                <Send className="h-4 w-4" strokeWidth={2.25} />
              )}
              {isSubmitting ? "Sending..." : "Send Now"}
            </button>

            {status === "success" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-[#4ade80]">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.25} />
                Message sent.
              </span>
            )}

            {status === "error" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-[#f87171]">
                <AlertCircle className="h-4 w-4" strokeWidth={2.25} />
                Something went wrong. Try again.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
