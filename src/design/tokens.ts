export const tokens = {
  paper: "#FFF7E3",
  ink: "#151014",
  gold: "#FBC44D",
  coral: "#B64028",
  plum: "#5B245E",
  white: "#FFFFFF",
} as const;

export type TokenName = keyof typeof tokens;
