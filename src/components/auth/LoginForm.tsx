"use client";
import { useActionState, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Mail, User } from "lucide-react";
import { authenticate, type AuthMode } from "@/lib/auth/actions";
import { NAME_MAX } from "@/lib/auth/names";
import { PasswordPair } from "./PasswordPair";
import { usePasswordPair } from "./usePasswordPair";
import styles from "./Auth.module.css";

// Messages for arriving at the login page from somewhere else
const reasons: Record<string, string> = {
  elsewhere: "You were signed out because your account was signed in on another device",
  link: "That link has expired or was already used. Please try again",
};

export function LoginForm({ next, reason }: { next?: string; reason?: string }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [state, action, pending] = useActionState(authenticate, null);
  // Controlled, so what the reader typed survives React resetting the form after each submit, and a change of tab
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const pair = usePasswordPair();
  const passwordRef = useRef<HTMLInputElement>(null);
  const statusId = useId();
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const isSignup = mode === "signup";
  // A result belongs to the tab that produced it, so switching tabs clears it
  const result = state?.mode === mode ? state : null;
  const arrival = reason && reasons[reason] && !result ? reasons[reason] : null;
  const message = result && result.kind !== "exists" ? result.message : arrival;
  const submitLabel = isForgot ? "Send reset link" : isLogin ? "Log in" : "Create account";

  // From "You already have an account": the email stays, and the cursor waits in the password field
  const goToLogin = () => {
    flushSync(() => setMode("login"));
    passwordRef.current?.focus();
  };

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
          {isSignup && (
            <motion.div key="name" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.collapse}>
              <div className={styles.nameRow}>
                <label className={styles.field}>
                  <span>First name</span>
                  <span className={styles.input}><User size={18} aria-hidden="true" /><input type="text" name="firstName" autoComplete="given-name" required maxLength={NAME_MAX} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></span>
                </label>
                <label className={styles.field}>
                  <span>Last name</span>
                  <span className={styles.input}><User size={18} aria-hidden="true" /><input type="text" name="lastName" autoComplete="family-name" required maxLength={NAME_MAX} value={lastName} onChange={(e) => setLastName(e.target.value)} /></span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <label className={styles.field}>
          <span>Email</span>
          <span className={styles.input}><Mail size={18} aria-hidden="true" /><input type="email" name="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></span>
        </label>
        <AnimatePresence initial={false}>
          {!isForgot && (
            <motion.div key="password" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.collapse}>
              <PasswordPair pair={pair} statusId={statusId} passwordRef={passwordRef} withConfirm={isSignup} />
            </motion.div>
          )}
        </AnimatePresence>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={pending || (isSignup && !pair.ready)}
          aria-busy={pending} aria-describedby={isSignup ? statusId : undefined}>
          {pending ? "One moment…" : submitLabel}
        </button>
        {isLogin && <button type="button" className={styles.linkBtn} onClick={() => setMode("forgot")}>Forgot password</button>}
        {isForgot && <button type="button" className={styles.linkBtn} onClick={() => setMode("login")}>Back to log in</button>}
        <AnimatePresence mode="wait">
          {result?.kind === "exists" ? (
            <motion.div key="exists" className={styles.notice} role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <strong>You already have an account</strong>
              <p>An account with {result.email} already exists. Log in, or reset your password if you can&apos;t remember it</p>
              <div className={styles.noticeActions}>
                <button type="button" className="btn btn-primary" onClick={goToLogin}>Log in</button>
                <button type="button" className="btn" onClick={() => setMode("forgot")}>Reset password</button>
              </div>
            </motion.div>
          ) : message && (
            <motion.p key={message} className={styles.notice} role={result?.kind === "error" ? "alert" : "status"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
