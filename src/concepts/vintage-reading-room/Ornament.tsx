import styles from "./vintage.module.css";

// A small hand-drawn-feeling flourish, used sparingly as a divider between the busiest sections
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={`${styles.ornament} ${className}`} viewBox="0 0 140 24" aria-hidden="true">
      <path d="M2 12 H50" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M90 12 H138" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M70 12c-4-8-14-10-18-2 6 2 10-2 10-2s-2 6-10 6c4 8 14 8 18 2 4 6 14 6 18-2-8 0-10-6-10-6s4 4 10 2c-4-8-14-6-18 2Z" fill="currentColor" />
    </svg>
  );
}
