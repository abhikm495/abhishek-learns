import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}

const variants = {
  primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
  secondary:
    "border border-[var(--card-border)] bg-[var(--card)] hover:bg-neutral-50 dark:hover:bg-neutral-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
