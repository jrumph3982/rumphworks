"use client";
import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full border border-divider rounded-lg px-4 py-3 text-navy bg-white placeholder:text-neutral-mid/50 focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

  return (
    <section id="contact" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            Contact
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight mb-4">
            Let&apos;s talk about your project
          </h2>
          <p className="text-lg text-neutral-mid mb-10">
            Tell me what you&apos;re working on and I&apos;ll get back to you
            within one business day.
          </p>

          {status === "success" ? (
            <div className="bg-slate-bg border border-divider rounded-lg p-8">
              <h3 className="text-xl font-bold text-navy mb-2">
                Message sent!
              </h3>
              <p className="text-neutral-mid leading-relaxed">
                Thanks for reaching out. I&apos;ll get back to you within one
                business day.
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-navy mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={field}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-navy mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className={field}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-navy mb-2"
              >
                Tell me about your project
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                className={`${field} resize-none`}
                placeholder="What are you building? What does your business need?"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong. Please try again, or email{" "}
                  <a
                    href="mailto:Jamey.Rumph@rumphworks.com"
                    className="font-semibold underline"
                  >
                    Jamey.Rumph@rumphworks.com
                  </a>{" "}
                  directly.
                </p>
              )}
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
