// Names typed at signup end up printed on every reader page, so they are cleaned the same way on the way in
// (signup) and on the way out (the reader stamp), whatever is in the database by then.

// Control characters, plus the invisible and direction-changing ones (zero-width spaces and joiners, the
// left-to-right and right-to-left marks, embeddings, overrides and isolates). Any of them could make the stamp
// read differently from what it says.
const HIDDEN = /[\p{C}​-‏‪-‮⁦-⁩]/u;
const HIDDEN_ALL = /[\p{C}​-‏‪-‮⁦-⁩]/gu;

export const NAME_MAX = 40;

/** Trims and collapses runs of whitespace (tabs and line breaks included) to single spaces */
export const collapse = (value: string) => value.replace(/\s+/g, " ").trim();

/** For display: drops hidden characters rather than rejecting them, so the stamp is always safe to print */
export const cleanForStamp = (value: string) => collapse(value.replace(HIDDEN_ALL, ""));

/** For signup: the cleaned name, or the reason it was refused */
export function checkName(raw: unknown, which: "first" | "last"): { value: string } | { error: string } {
  const value = collapse(String(raw ?? ""));
  if (!value) return { error: `Please enter your ${which} name` };
  if (!/\p{L}/u.test(value) || HIDDEN.test(value)) return { error: `Please enter your real ${which} name` };
  if (value.length > NAME_MAX) return { error: `Your ${which} name can be at most ${NAME_MAX} characters` };
  return { value };
}
