"use client";
import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock } from "lucide-react";
import { updatePassword } from "@/lib/auth/actions";
import styles from "./Auth.module.css";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, null);
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Choose a new password</h1>
      <form action={action} noValidate>
        <label className={styles.field}>
          <span>New password</span>
          <span className={styles.input}><Lock size={18} aria-hidden="true" /><input type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} /></span>
        </label>
        <label className={styles.field}>
          <span>Type it again</span>
          <span className={styles.input}><Lock size={18} aria-hidden="true" /><input type="password" name="confirm" autoComplete="new-password" placeholder="The same password" required minLength={8} /></span>
        </label>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={pending} aria-busy={pending}>
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
