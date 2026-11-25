// Enquiry form in a full-height panel. Submissions go to Netlify Forms (form name "brief");
// a static copy of the form sits in index.html so Netlify registers it at deploy.
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { ContentType } from "./content";

type Status = "idle" | "sending" | "sent" | "error";

export function BriefForm({ c, onClose }: { c: ContentType; onClose: () => void }) {
  const f = c.ending.form;
  const [status, setStatus] = useState<Status>("idle");
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    data.forEach((v, k) => body.append(k, String(v)));
    try {
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const label = "block text-[12px] font-bold mb-1.5";
  const input = "w-full bg-transparent border-b-2 border-black/25 focus:border-black outline-none py-2 text-[15px] transition-colors";

  return (
    <div className="reel-in fixed inset-0 z-[300] bg-black/70 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="brief-title" onClick={onClose}>
      <div className="relative bg-white text-black w-full max-w-[640px] h-full overflow-y-auto px-6 sm:px-10 py-8 sm:py-12" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center bg-black text-white hover:bg-[color:var(--signal)] transition-colors" aria-label={f.close}>
          <X size={20} />
        </button>

        {status === "sent" ? (
          <div className="pt-16">
            <h2 id="brief-title" className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>{f.sentTitle}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-black/75 max-w-[44ch]">{f.sentBody}</p>
            <button onClick={onClose} className="btn btn-brand cut-sm mt-8">{f.close}</button>
          </div>
        ) : (
          <>
            <h2 id="brief-title" className="display pr-12" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>{f.title}</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-black/70 max-w-[46ch]">{f.intro}</p>

            <form name="brief" method="POST" data-netlify="true" netlify-honeypot="company-website" onSubmit={submit} className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-5">
              <input type="hidden" name="form-name" value="brief" />
              {/* spam trap: people never see or fill this */}
              <p className="hidden"><label>Leave empty <input name="company-website" tabIndex={-1} autoComplete="off" /></label></p>

              <div><label className={label} htmlFor="b-name">{f.fields.name} *</label><input ref={first} id="b-name" name="name" required autoComplete="name" className={input} /></div>
              <div><label className={label} htmlFor="b-email">{f.fields.email} *</label><input id="b-email" name="email" type="email" required autoComplete="email" className={input} /></div>
              <div><label className={label} htmlFor="b-company">{f.fields.company}</label><input id="b-company" name="company" autoComplete="organization" className={input} /></div>
              <div><label className={label} htmlFor="b-phone">{f.fields.phone}</label><input id="b-phone" name="phone" autoComplete="tel" className={input} /></div>
              <div><label className={label} htmlFor="b-city">{f.fields.city}</label><input id="b-city" name="city" placeholder="Shanghai, Beijing…" className={input} /></div>
              <div><label className={label} htmlFor="b-dates">{f.fields.dates}</label><input id="b-dates" name="dates" placeholder="e.g. May 2027" className={input} /></div>
              <div><label className={label} htmlFor="b-guests">{f.fields.guests}</label><input id="b-guests" name="guests" inputMode="numeric" placeholder="e.g. 250" className={input} /></div>
              <div>
                <label className={label} htmlFor="b-format">{f.fields.format}</label>
                <select id="b-format" name="format" defaultValue="" className={input}>
                  <option value="" disabled>Choose…</option>
                  {f.formats.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="b-budget">{f.fields.budget}</label>
                <select id="b-budget" name="budget" defaultValue="" className={input}>
                  <option value="" disabled>Choose…</option>
                  {f.budgets.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="b-message">{f.fields.message}</label>
                <textarea id="b-message" name="message" rows={4} className={`${input} resize-y`} />
              </div>

              {status === "error" && (
                <p className="sm:col-span-2 text-[13px] text-[color:var(--stage-red)]">
                  {f.error} <a className="underline font-bold" href={c.ending.mailto}>{c.ending.cta}</a>
                </p>
              )}
              <div className="sm:col-span-2 pt-2">
                <button type="submit" disabled={status === "sending"} className="btn btn-brand cut-sm disabled:opacity-60">
                  {status === "sending" ? f.sending : f.submit}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
