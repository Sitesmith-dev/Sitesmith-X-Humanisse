"use client";
import type { Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { PasswordInput } from "./PasswordInput";
import type { PasswordPairState } from "./usePasswordPair";
import styles from "./Auth.module.css";

type Props = {
  pair: PasswordPairState;
  // The id the submit button points its aria-describedby at
  statusId: string;
  passwordLabel?: string;
  passwordRef?: Ref<HTMLInputElement>;
  // Log in shares the password field but has nothing to confirm, so the second field folds away
  withConfirm?: boolean;
};

// Password, a live match check, then Confirm password
export function PasswordPair({ pair, statusId, passwordLabel = "Password", passwordRef, withConfirm = true }: Props) {
  const autoComplete = withConfirm ? "new-password" : "current-password";
  return (
    <>
      <label className={styles.field}>
        <span>{passwordLabel}</span>
        {/* Keyed so switching between Log in and Create account hides the password again */}
        <PasswordInput key={autoComplete} ref={passwordRef} name="password" autoComplete={autoComplete} placeholder="At least 8 characters"
          required minLength={8} value={pair.password} onChange={(e) => pair.setPassword(e.target.value)} />
      </label>
      <AnimatePresence initial={false}>
        {withConfirm && (
          <motion.div key="confirm" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.collapse}>
            <p id={statusId} className={styles.match} aria-live="polite">
              {pair.touched && (pair.matches
                ? <span className={styles.matchOk}><Check size={16} aria-hidden="true" /> Passwords match</span>
                : <span className={styles.matchNo}><X size={16} aria-hidden="true" /> Passwords do not match</span>)}
            </p>
            <label className={styles.field}>
              <span>Confirm password</span>
              <PasswordInput name="confirm" autoComplete="new-password" placeholder="Type it again" required minLength={8}
                aria-describedby={statusId} value={pair.confirm} onChange={(e) => pair.setConfirm(e.target.value)} />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
