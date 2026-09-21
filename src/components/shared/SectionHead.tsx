import type { ReactNode } from "react";
import { Reveal } from "./Motion";

// One heading pattern for every section: caption box, then a short lead, always left-aligned to the page edge
export function SectionHead({ id, title, lead, paper = false, children }: { id: string; title: string; lead?: string; paper?: boolean; children?: ReactNode }) {
  return (
    <Reveal className="secRow">
      <div className="secHead">
        <h2 id={id} className={`capBox${paper ? " capBox-paper" : ""}`}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children}
    </Reveal>
  );
}
