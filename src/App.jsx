import { useState, useCallback } from "react";
import FormPage    from "./pages/FormPage";
import SuccessPage from "./pages/SuccessPage";
import { INITIAL_FORM, WEBHOOK_URL } from "./constants/formConfig";
import { validate } from "./utils/validation";
import "./styles/global.css";

export default function App() {
  const [form,     setForm]     = useState(INITIAL_FORM);
  const [status,   setStatus]   = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const validationError = validate(form);
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
          firstName:   form.firstName.trim(),
          lastName:    form.lastName.trim(),
          email:       form.email.trim(),
          company:     form.company.trim(),
          service:     form.service,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error(`Workflow responded with status ${res.status}`);

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong sending your details. Please try again.");
    }
  }, [form]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setForm(INITIAL_FORM);
    setErrorMsg("");
  }, []);

  if (status === "success") {
    return <SuccessPage onReset={handleReset} />;
  }

  return (
    <FormPage
      form={form}
      status={status}
      errorMsg={errorMsg}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
