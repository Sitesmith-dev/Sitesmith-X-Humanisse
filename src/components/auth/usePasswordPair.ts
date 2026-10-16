"use client";
import { useState } from "react";

// A new password typed twice. Shared by Create account and Choose a new password so both follow the same rule:
// the two must be exactly the same before the form can be sent
export function usePasswordPair() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const touched = confirm.length > 0;
  const matches = password === confirm;
  const ready = password.length > 0 && matches;
  return { password, confirm, setPassword, setConfirm, touched, matches, ready };
}

export type PasswordPairState = ReturnType<typeof usePasswordPair>;
