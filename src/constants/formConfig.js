export const WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL;

export const SERVICES = [
  { value: "", label: "Select a service…" },
  { value: "Web Development", label: "Web Development" },
  { value: "Automation", label: "Automation" },
  { value: "Both", label: "Both" },
];

export const FIELDS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { name: "lastName",  label: "Last name",  type: "text", autoComplete: "family-name" },
  { name: "email",     label: "Email",       type: "email", autoComplete: "email" },
  { name: "company",   label: "Company name", type: "text", autoComplete: "organization" },
];

export const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  service: "",
};
