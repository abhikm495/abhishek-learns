import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-sm transition hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
