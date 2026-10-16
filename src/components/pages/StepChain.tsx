import { ArrowRight } from "lucide-react";
import landing from "@/components/landing/Landing.module.css";

// The ink pill row joined by arrows, the same treatment as the landing page's learning philosophy
export function StepChain({ steps, className = "" }: { steps: readonly string[]; className?: string }) {
  return (
    <ol className={`${landing.journey} ${className}`}>
      {steps.map((step, i) => (
        <li key={step}>
          <span className={landing.journeyStep}>{step}</span>
          {i < steps.length - 1 && <ArrowRight size={18} aria-hidden="true" className={landing.journeyArrow} />}
        </li>
      ))}
    </ol>
  );
}
