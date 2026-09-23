import type { ReactNode } from "react";
import { display, body } from "./font";

export function VintageRoot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${display.variable} ${body.variable} ${className}`}>{children}</div>;
}
