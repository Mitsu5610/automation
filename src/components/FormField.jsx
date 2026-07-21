import React from "react";

export default function FormField({ field, value, onChange, index }) {
  return (
    <div className="field" style={{ "--i": index }}>
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        autoComplete={field.autoComplete}
        value={value}
        onChange={onChange}
        placeholder={field.label}
      />
    </div>
  );
}
