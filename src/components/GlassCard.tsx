import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl ${className}`.trim()}
    >
      {children}
    </div>
  );
}