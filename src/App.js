import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

// --- Pipeline icons (inline, no external deps) ---
const IconCapture = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 13h4.5l1.2 2.4h4.6L15.5 13H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 3v8m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconRoute = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 6.5C11 7 12 9 12 12s-1 5-5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 12h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconDeliver = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M3 12l17-8-6.5 17-3-6.5L3 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

// Small confetti burst — plain canvas, no libraries.
function fireConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.scale(dpr, dpr);

  const colors = ["#f2a13f", "#3fd6c8", "#1f9d63", "#161a22"];
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.32;

  const particles = Array.from({ length: 46 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4.5;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      life: 1,
    };
  });

  let frame;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life = Math.max(0, 1 - elapsed / 1400);

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    if (elapsed < 1400) {
      frame = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const cardRef = useRef(null);
  const confettiRef = useRef(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const filledCount = Object.values(form).filter((v) => v.trim() !== "").length;

  const captureActive = filledCount > 0;
  const routeActive = form.service !== "";
  const deliverDone = status === "success";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (reducedMotion) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--ry", `${relX * 7}deg`);
      card.style.setProperty("--rx", `${relY * -7}deg`);
    },
    [reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }, []);

  useEffect(() => {
    if (status === "success" && !reducedMotion && confettiRef.current) {
      const cancel = fireConfetti(confettiRef.current);
      return cancel;
    }
  }, [status, reducedMotion]);

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

  const Pipeline = (
    <div className="pipeline" aria-hidden="true">
      <div className={`pipeline-node ${captureActive ? "is-active" : ""}`}>
        <div className="node-ring">
          <IconCapture />
        </div>
        <span className="node-label mono">Capture</span>
      </div>

      <div className="pipeline-connector">
        <div className={`connector-fill ${captureActive ? "is-full" : ""}`} />
        <span className="connector-pulse" />
      </div>

      <div className={`pipeline-node ${routeActive ? "is-active" : ""}`}>
        <div className="node-ring">
          <IconRoute />
        </div>
        <span className="node-label mono">Route</span>
      </div>

      <div className="pipeline-connector">
        <div className={`connector-fill ${routeActive ? "is-full" : ""}`} />
        <span className="connector-pulse" />
      </div>

      <div className={`pipeline-node ${deliverDone ? "is-done" : ""}`}>
        <div className="node-ring">
          <IconDeliver />
        </div>
        <span className="node-label mono">Deliver</span>
      </div>
    </div>
  );

  if (status === "success") {
    return (
      <div className="page">
        <div className="ambient-glow" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="canvas-grid" aria-hidden="true" />
        <canvas ref={confettiRef} className="confetti-canvas" aria-hidden="true" />
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
      <div className="ambient-glow" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="canvas-grid" aria-hidden="true" />
      <main
        className="card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-header">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Client onboarding
          </span>
          <h1>Let's get started</h1>
          <p className="subtitle">
            Tell us a bit about you and we'll route your request to the right team —
            automatically.
          </p>
        </div>

        {Pipeline}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-grid">
            {FIELDS.map((f, i) => (
              <div className="field" key={f.name} style={{ "--i": i }}>
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

            <div className="field field-full" style={{ "--i": FIELDS.length }}>
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
            {status === "submitting" && <span className="spinner" aria-hidden="true" />}
            {status === "submitting" ? "Sending…" : "Submit request"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;