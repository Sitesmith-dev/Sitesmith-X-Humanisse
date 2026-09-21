"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Mail, User } from "lucide-react";
import styles from "./Auth.module.css";

type Mode = "login" | "signup";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [sent, setSent] = useState(false);
  const isLogin = mode === "login";
  return (
    <div className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Account">
        {(["login", "signup"] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className={styles.tab} onClick={() => { setMode(m); setSent(false); }}>
            {mode === m && <motion.span layoutId="tab" className={styles.tabBg} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className={styles.tabText}>{m === "login" ? "Log in" : "Create account"}</span>
          </button>
        ))}
      </div>
      <p className={styles.badge}><span className="demo">Preview</span> Nothing is sent or saved</p>
      <h1 className={styles.title}>{isLogin ? "Welcome back" : "Start your library"}</h1>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} noValidate>
        <AnimatePresence initial={false}>
          {!isLogin && (
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
          <span className={styles.input}><Mail size={18} aria-hidden="true" /><input type="email" name="email" autoComplete="email" placeholder="you@example.com" /></span>
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <span className={styles.input}><Lock size={18} aria-hidden="true" /><input type="password" name="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder="At least 8 characters" /></span>
        </label>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>{isLogin ? "Log in" : "Create account"}</button>
        {isLogin && <button type="button" className={styles.linkBtn} onClick={() => setSent(true)}>Forgot password</button>}
        <AnimatePresence>
          {sent && (
            <motion.p className={styles.notice} role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Preview only, accounts and sign in arrive in the production build, so nothing has been created or sent
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
