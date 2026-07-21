export function validate(form) {
  if (!form.firstName.trim()) return "First name is required.";
  if (!form.lastName.trim())  return "Last name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
  if (!form.company.trim())   return "Company name is required.";
  if (!form.service)          return "Please select a service.";
  return "";
}
