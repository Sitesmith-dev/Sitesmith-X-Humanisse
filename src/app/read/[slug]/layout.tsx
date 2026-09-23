import type { ReactNode } from "react";

// The reader is a full-viewport experience with no site chrome around it. This layout adds nothing of its own,
// and the header and footer step aside for /read routes in `Chrome`, since a nested layout cannot remove what the root layout renders
export default function ReadLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
