"use client";

import { useState } from "react";
import { whatsappHref } from "@/lib/data";

type ContactFormText = {
  nameLabel: string;
  namePlaceholder: string;
  interestLabel: string;
  interestPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  sendWhatsapp: string;
  message: {
    intro: string;
    name: string;
    interest: string;
    notes: string;
  };
};

export default function ContactForm({ t }: { t: ContactFormText }) {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  const composed = [
    t.message.intro,
    name && t.message.name.replace("{{value}}", name),
    interest && t.message.interest.replace("{{value}}", interest),
    message && t.message.notes.replace("{{value}}", message),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <form className="space-y-6 lg:col-span-7" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="label-caps text-graphite" htmlFor="name">
          {t.nameLabel}
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brass"
          placeholder={t.namePlaceholder}
        />
      </div>
      <div>
        <label className="label-caps text-graphite" htmlFor="interest">
          {t.interestLabel}
        </label>
        <input
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="mt-2 w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brass"
          placeholder={t.interestPlaceholder}
        />
      </div>
      <div>
        <label className="label-caps text-graphite" htmlFor="message">
          {t.notesLabel}
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="mt-2 w-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brass"
          placeholder={t.notesPlaceholder}
        />
      </div>
      <a
        href={whatsappHref(composed)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary label-caps w-full sm:w-auto"
      >
        {t.sendWhatsapp}
      </a>
    </form>
  );
}
