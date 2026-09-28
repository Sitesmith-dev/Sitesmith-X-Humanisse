"use client";
import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Mail, User } from "lucide-react";
import { authenticate, type AuthMode } from "@/lib/auth/actions";
import styles from "./Auth.module.css";

// Messages for arriving at the login page from somewhere else
const reasons: Record<string, string> = {
  elsewhere: "You were signed out because your account was signed in on another device",
  link: "That link has expired or was already used. Please try again",
};

export function LoginForm({ next, reason }: { next?: string; reason?: string }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [state, action, pending] = useActionState(authenticate, null);
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  // A result belongs to the tab that produced it, so switching tabs clears it
  const result = state?.mode === mode ? state : null;
  const arrival = reason && reasons[reason] && !result ? reasons[reason] : null;
  const submitLabel = isForgot ? "Send reset link" : isLogin ? "Log in" : "Create account";

  return (
    <div className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Account">
        {(["login", "signup"] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className={styles.tab} onClick={() => setMode(m)}>
            {mode === m && <motion.span layoutId="tab" className={styles.tabBg} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className={styles.tabText}>{m === "login" ? "Log in" : "Create account"}</span>
          </button>
        ))}
      </div>
      <h1 className={styles.title}>{isForgot ? "Reset your password" : isLogin ? "Welcome back" : "Start your library"}</h1>
      <form action={action} noValidate>
        <input type="hidden" name="mode" value={mode} />
        {next && <input type="hidden" name="next" value={next} />}
        <AnimatePresence initial={false}>
          {mode === "signup" && (
            <motion.div key="name" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.collapse}>
              <label className={styles.field}>
                <span>Name</span>
                <span className={styles.input}><User size={18} aria-hidden="true" /><input type="text" name="name" autoComplete="name" placeholder="Your name" /></span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <label className={styles.field}>
          <span>Email</span>
          <span className={styles.input}><Mail size={18} aria-hidden="true" /><input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></span>
        </label>
        <AnimatePresence initial={false}>
          {!isForgot && (
            <motion.div key="password" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.collapse}>
              <label className={styles.field}>
                <span>Password</span>
                <span className={styles.input}><Lock size={18} aria-hidden="true" /><input type="password" name="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder="At least 8 characters" required minLength={8} /></span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={pending} aria-busy={pending}>
          {pending ? "One moment…" : submitLabel}
        </button>
        {isLogin && <button type="button" className={styles.linkBtn} onClick={() => setMode("forgot")}>Forgot password</button>}
        {isForgot && <button type="button" className={styles.linkBtn} onClick={() => setMode("login")}>Back to log in</button>}
        <AnimatePresence mode="wait">
          {(result || arrival) && (
            <motion.p key={result?.message ?? arrival} className={styles.notice} role={result?.kind === "error" ? "alert" : "status"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {result?.message ?? arrival}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
