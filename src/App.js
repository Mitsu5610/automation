import React, { useState } from "react";
import "./App.css";

const WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL;

const SERVICES = [
  { value: "", label: "Select a service…" },
  { value: "Web Development", label: "Web Development" },
  { value: "Automation", label: "Automation" },
  { value: "Both", label: "Both" },
];

const FIELDS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "company", label: "Company name", type: "text", autoComplete: "organization" },
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  service: "",
};

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const filledCount = Object.values(form).filter((v) => v.trim() !== "").length;
  const progress = Math.round((filledCount / 5) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
    if (!form.company.trim()) return "Company name is required.";
    if (!form.service) return "Select a service.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }

    if (!WEBHOOK_URL) {
      setStatus("error");
      setErrorMsg("Webhook URL is not configured. Set REACT_APP_N8N_WEBHOOK_URL.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          service: form.service,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error(`Workflow responded with status ${res.status}`);

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong sending your details. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="page">
        <div className="canvas-grid" aria-hidden="true" />
        <main className="card success-card" role="status">
          <div className="success-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9.5 18L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>You're in.</h1>
          <p>
            Thanks for reaching out — a welcome email is on its way to your inbox, and our team
            has already been notified.
          </p>
          <button className="btn-secondary" onClick={() => setStatus("idle")}>
            Submit another request
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="canvas-grid" aria-hidden="true" />
      <main className="card">
        <div className="card-header">
          <span className="eyebrow">Client onboarding</span>
          <h1>Let's get started</h1>
          <p className="subtitle">
            Tell us a bit about you and we'll route your request to the right team —
            automatically.
          </p>
        </div>

        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-grid">
            {FIELDS.map((f) => (
              <div className="field" key={f.name}>
                <label htmlFor={f.name}>{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.label}
                />
              </div>
            ))}

            <div className="field field-full">
              <label htmlFor="service">Service needed</label>
              <div className="select-wrap">
                <select id="service" name="service" value={form.service} onChange={handleChange}>
                  {SERVICES.map((s) => (
                    <option value={s.value} key={s.value || "placeholder"} disabled={s.value === ""}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {status === "error" && errorMsg && (
            <div className="error-banner" role="alert">
              {errorMsg}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Submit request"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;