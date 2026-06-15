import type { ButtonHTMLAttributes } from "react";

type ZoomButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ZoomButton({ className = "", ...buttonProps }: ZoomButtonProps) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-full bg-linear-to-br from-amber-400 to-orange-500 px-4.5 py-2.5 font-bold text-slate-900 transition-transform hover:scale-105 ${className}`.trim()}
      {...buttonProps}
    />
  );
}