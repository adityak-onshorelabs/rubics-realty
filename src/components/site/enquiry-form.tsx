"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { enquiryCopy } from "@/content/en";
import { configs, enquirySchema, fieldErrors, intents } from "@/lib/enquiry";
import { cn } from "@/lib/utils";
import { VisitPicker } from "./visit-picker";

const intentLabels: Record<(typeof intents)[number], string> = {
  visit: "Book a site visit",
  brochure: "Request the brochure",
  callback: "Request a call back",
};

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

/**
 * Enquiry form. Real labels, fieldsets, errors beside fields (aria-describedby), consent notice (DPDP Act 2023),
 * honeypot. Prefills from ?intent=&level=&config= (the section explorer hands off the chosen level).
 */
type Intent = (typeof intents)[number];

export function EnquiryForm({
  project = "beaumonte-tower-c",
  projectName = "BeauMonté Tower C",
  options = [...intents],
  showConfig = true,
}: {
  project?: string;
  projectName?: string;
  /** Which intents to offer. One option hides the chooser. */
  options?: Intent[];
  /** Hide the configuration select where configurations are not published yet. */
  showConfig?: boolean;
}) {
  const params = useSearchParams();
  const uid = useId();
  const statusRef = useRef<HTMLDivElement>(null);
  const [intent, setIntent] = useState<Intent>(options[0]);
  const [visit, setVisit] = useState({ date: "", window: "" });
  const [level, setLevel] = useState<string>("");
  const [config, setConfig] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    const i = params.get("intent");
    const l = params.get("level");
    const c = params.get("config");
    /* eslint-disable react-hooks/set-state-in-effect -- syncing from URL hand-off */
    if (i && (options as string[]).includes(i)) setIntent(i as Intent);
    if (l && /^-?\d{1,2}$/.test(l)) setLevel(l);
    if (c && (configs as readonly string[]).includes(c)) setConfig(c);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is static per page
  }, [params]);

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": id(`${k}-error`) } : {});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      intent,
      project,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      config: config || undefined,
      level: level === "" ? undefined : level,
      visitDate: intent === "visit" ? visit.date : "",
      visitWindow: intent === "visit" ? visit.window : "",
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error);
      setErrors(fe);
      const first = Object.keys(fe)[0];
      document.getElementById(first === "visitDate" ? `${uid}-visit` : id(first))?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Record<string, string> };
      if (res.ok && data.ok) {
        setState({ kind: "done" });
      } else if (data.errors) {
        setErrors(data.errors);
        setState({ kind: "idle" });
      } else {
        setState({ kind: "error", message: data.error ?? "Something went wrong. Please call 1800 209 6363." });
      }
    } catch {
      setState({ kind: "error", message: "No connection. Please try again or call 1800 209 6363." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (state.kind === "done") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="plaque outline-none" style={{ ["--plaque-fill" as string]: "var(--travertine)" }}>
        <Check aria-hidden className="size-8 text-brass-deep" />
        <p className="t-h3 mt-4">{enquiryCopy.success}</p>
        <p className="t-body mt-2 text-graphite-muted">
          {intent === "visit" && visit.date
            ? `We have your preferred visit on ${new Date(`${visit.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}, ${visit.window.toLowerCase()}.`
            : `Your request about ${projectName} is with our sales team.`}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-8" aria-describedby={id("privacy")}>
      {options.length > 1 ? (
      <fieldset>
        <legend className="t-label text-graphite-muted">I would like to</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {options.map((i) => (
            <label
              key={i}
              className={cn(
                "flex min-h-[52px] cursor-pointer items-center gap-3 border px-4 text-sm transition-colors [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-brass-deep [&:has(:focus-visible)]:outline-solid",
                intent === i ? "border-navy bg-navy text-ivory" : "border-datum hover:border-graphite-muted",
              )}
            >
              <input type="radio" name="intent" value={i} checked={intent === i} onChange={() => setIntent(i)} className="sr-only" />
              {intentLabels[i]}
            </label>
          ))}
        </div>
      </fieldset>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor={id("name")} error={errors.name} errorId={id("name-error")}>
          <input id={id("name")} name="name" autoComplete="name" required className={inputClass} {...err("name")} />
        </Field>
        <Field label="Phone" hint="With country code if outside India" htmlFor={id("phone")} error={errors.phone} errorId={id("phone-error")}>
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" required className={inputClass} {...err("phone")} />
        </Field>
        <Field label="Email" hint="Optional" htmlFor={id("email")} error={errors.email} errorId={id("email-error")}>
          <input id={id("email")} name="email" type="email" autoComplete="email" className={inputClass} {...err("email")} />
        </Field>
        {showConfig ? (
        <Field label="Residence of interest" hint="Optional" htmlFor={id("config")}>
          <select id={id("config")} name="config" value={config} onChange={(e) => setConfig(e.target.value)} className={inputClass}>
            <option value="">Choose a configuration</option>
            {configs.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        ) : null}
      </div>

      {level !== "" ? (
        <p className="flex flex-wrap items-center gap-3 border-y border-datum py-3 text-sm">
          <span className="t-label text-graphite-muted">From the section explorer</span>
          <span className="t-level text-accent-ink">Level {level}</span>
          <button type="button" onClick={() => setLevel("")} className="t-label ms-auto min-h-11 px-2 text-graphite-muted underline-offset-4 hover:underline">
            Remove
          </button>
        </p>
      ) : null}

      {intent === "visit" ? (
        <div id={`${uid}-visit`} tabIndex={-1} className="outline-none">
          <VisitPicker date={visit.date} window={visit.window} onChange={setVisit} error={errors.visitDate} />
          <p className="mt-3 text-xs text-graphite-muted">This is a preferred slot. Our team will call to confirm a time at the Sales Experience Centre, Sion Circle.</p>
        </div>
      ) : null}

      <Field label="Message" hint="Optional" htmlFor={id("message")} error={errors.message} errorId={id("message-error")}>
        <textarea id={id("message")} name="message" rows={3} className={cn(inputClass, "py-3")} {...err("message")} />
      </Field>

      {/* Honeypot */}
      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer gap-3 text-sm">
          <input id={id("consent")} type="checkbox" name="consent" className="mt-1 size-5 shrink-0 accent-[var(--navy)]" {...err("consent")} />
          <span>{enquiryCopy.consent}</span>
        </label>
        {errors.consent ? (
          <p id={id("consent-error")} className="mt-2 text-sm text-error">
            {errors.consent}
          </p>
        ) : null}
        <p id={id("privacy")} className="mt-3 text-xs text-graphite-muted">
          We use your details only to respond to this enquiry. Read our{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="t-label inline-flex min-h-[52px] items-center gap-3 bg-navy px-8 text-ivory transition-colors hover:bg-lacquer disabled:opacity-70"
        >
          {state.kind === "sending" ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          {state.kind === "sending" ? "Sending" : intentLabels[intent]}
        </button>
        <div ref={statusRef} tabIndex={-1} role="alert" className="text-sm text-error outline-none">
          {state.kind === "error" ? state.message : null}
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full min-h-[52px] border border-datum bg-travertine px-4 text-base text-graphite placeholder:text-graphite-muted focus:border-navy aria-invalid:border-error";

function Field({
  label,
  hint,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3">
        <span className="t-label text-graphite">{label}</span>
        {hint ? <span className="text-xs text-graphite-muted">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
