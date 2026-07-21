import React from "react";
import { FIELDS, SERVICES } from "../constants/formConfig";

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12 15.3 15.3 0 0 1 12 2z" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const IconArrow = () => (
  <svg className="btn-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const FEATURES = [
  { Icon: IconGlobe,  title: "Web Development",    desc: "Modern, fast websites built to convert visitors into clients." },
  { Icon: IconBolt,   title: "Workflow Automation", desc: "Cut manual work with smart n8n pipelines that run 24/7." },
  { Icon: IconShield, title: "Reliable & Secure",   desc: "Your data is encrypted end-to-end and never shared." },
];

export default function FormPage({ form, status, errorMsg, onChange, onSubmit }) {
  return (
    <div className="split">

      {/* ── LEFT DARK PANEL ─────────────────────── */}
      <aside className="split__left">
        <div className="left-blobs" aria-hidden="true"><span /><span /><span /></div>
        <div className="left-grid"  aria-hidden="true" />

        <div className="left-content">
          <div className="left-logo">
            <div className="left-logo-mark"><IconLogo /></div>
            <span className="left-logo-name">Automate.</span>
          </div>

          <h1 className="left-headline">
            Onboard faster.<br />
            <em>Grow smarter.</em>
          </h1>
          <p className="left-sub">
            Fill in your details and our automation pipeline routes your request to the right team — instantly.
          </p>

          <ul className="left-features" aria-label="What we offer">
            {FEATURES.map(({ Icon, title, desc }) => (
              <li key={title} className="left-feature">
                <div className="left-feature-icon"><Icon /></div>
                <div className="left-feature-text">
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── RIGHT WHITE PANEL ───────────────────── */}
      <section className="split__right">
        <div className="form-shell">
          <span className="form-eyebrow">
            <span className="form-eyebrow-dot" aria-hidden="true" />
            Client onboarding
          </span>

          <h2 className="form-title">Let's get started</h2>
          <p className="form-subtitle">Takes less than 2 minutes. We'll handle the rest.</p>

          <form onSubmit={onSubmit} noValidate>
            <div className="form-stack">

              <div className="field-row">
                {FIELDS.slice(0, 2).map((f, i) => (
                  <div key={f.name} className="field" style={{ "--i": i }}>
                    <label htmlFor={f.name}>{f.label}</label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      value={form[f.name]}
                      onChange={onChange}
                      placeholder={f.label}
                    />
                  </div>
                ))}
              </div>

              {FIELDS.slice(2).map((f, i) => (
                <div key={f.name} className="field" style={{ "--i": i + 2 }}>
                  <label htmlFor={f.name}>{f.label}</label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    value={form[f.name]}
                    onChange={onChange}
                    placeholder={f.label}
                  />
                </div>
              ))}

              <div className="field" style={{ "--i": FIELDS.length }}>
                <label htmlFor="service">Service needed</label>
                <div className="select-wrap">
                  <select id="service" name="service" value={form.service} onChange={onChange}>
                    {SERVICES.map((s) => (
                      <option key={s.value || "placeholder"} value={s.value} disabled={s.value === ""}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {status === "error" && errorMsg && (
              <div className="error-banner" role="alert">{errorMsg}</div>
            )}

            <button type="submit" className="btn-primary" disabled={status === "submitting"}>
              {status === "submitting"
                ? <><span className="spinner" aria-hidden="true" /> Sending…</>
                : <>Submit request <IconArrow /></>
              }
            </button>

            <p className="form-trust">
              <IconLock /> No spam. Your info is kept private.
            </p>
          </form>
        </div>
      </section>

    </div>
  );
}
