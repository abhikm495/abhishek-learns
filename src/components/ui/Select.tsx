import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function Select({ label, children, className = "", id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
