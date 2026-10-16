"use client";
import { useActionState, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { updatePassword } from "@/lib/auth/actions";
import { PasswordPair } from "./PasswordPair";
import { usePasswordPair } from "./usePasswordPair";
import styles from "./Auth.module.css";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, null);
  const pair = usePasswordPair();
  const statusId = useId();
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Choose a new password</h1>
      <form action={action} noValidate>
        <PasswordPair pair={pair} statusId={statusId} passwordLabel="New password" />
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={pending || !pair.ready}
          aria-busy={pending} aria-describedby={statusId}>
          {pending ? "One moment…" : "Save password"}
        </button>
        <AnimatePresence>
          {state && (
            <motion.p key={state.message} className={styles.notice} role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
