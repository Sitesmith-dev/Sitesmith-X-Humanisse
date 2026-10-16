// The one place the attribution sentence is built. Every layer of the reader's stamp (the tiling, the line at
// the foot of each page and the line under the stage) and the tamper guard read what this returns.
export type Holder = { name: string; email: string };

export type Stamp = {
  /** The whole sentence, exactly as the client specified it */
  text: string;
  /** The same sentence broken in two for the diagonal tiles: who it is for, then the email */
  lines: [string, string];
};

const LEAD = "Exclusively for the use of";

export function buildStamp({ name, email }: Holder): Stamp {
  if (!name) return { text: `${LEAD} ${email}`, lines: [LEAD, email] };
  return { text: `${LEAD} ${name} - ${email}`, lines: [`${LEAD} ${name}`, email] };
}
