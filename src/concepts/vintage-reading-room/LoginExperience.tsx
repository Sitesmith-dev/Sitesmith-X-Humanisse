"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Lock, Mail, User } from "lucide-react";
import { LoginCeremony } from "./LoginCeremony";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { VintageRoot } from "./VintageRoot";
import styles from "./vintage.module.css";

export function LoginExperience() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [sent, setSent] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // The room settles into focus as you arrive, a slow dolly rather than a hard cut to the reading lamp
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(`.${styles.loginShelves}`, { scale: 1.09, opacity: 0 }, { scale: 1, opacity: 0.16, duration: 2.6, ease: "power2.out" });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(`.${styles.loginShelves}`, { opacity: 0.16, scale: 1 });
    });
  }, { scope: heroRef });

  return (
    <VintageRoot className={styles.root}>
      <section ref={heroRef} className={styles.loginHero}>
        <div className={styles.loginShelves} aria-hidden="true" />
        <div className={`wrap ${styles.loginGrid}`}>
          <Reveal className={styles.loginCopyLight}>
            <p className={styles.kickerLight}>Members Reading Room</p>
            <h1 className={styles.h1small}>Every comic, kept on your own shelf</h1>
            <Ornament className={styles.heroOrnamentLight} />
            <p className={styles.leadLight}>Log in to save your cart, pick up where you left off and keep every comic you own in one place</p>
          </Reveal>
          <div className={styles.loginCardWrap}>
            <LoginCeremony>
              <div className={styles.loginTabs} role="tablist">
                {(["login", "signup"] as const).map((m) => (
                  <button key={m} type="button" role="tab" aria-selected={mode === m} className={styles.loginTab} onClick={() => { setMode(m); setSent(false); }}>
                    {mode === m && <motion.span layoutId="vr-tab" className={styles.loginTabBg} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className={styles.loginTabText}>{m === "login" ? "Log in" : "Join"}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <AnimatePresence initial={false}>
                  {mode === "signup" && (
                    <motion.label
                      key="name"
                      className={styles.field}
                      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                      animate={{ height: "auto", opacity: 1, marginBottom: 16 }}
                      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ overflow: "hidden", display: "block" }}
                    >
                      <span>Full name</span>
                      <span className={styles.fieldInput}><User size={16} aria-hidden="true" /><input type="text" autoComplete="name" placeholder="Your name" /></span>
                    </motion.label>
                  )}
                </AnimatePresence>
                <label className={styles.field}>
                  <span>Email</span>
                  <span className={styles.fieldInput}><Mail size={16} aria-hidden="true" /><input type="email" autoComplete="email" placeholder="you@example.com" /></span>
                </label>
                <label className={styles.field}>
                  <span>Password</span>
                  <span className={styles.fieldInput}><Lock size={16} aria-hidden="true" /><input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" /></span>
                </label>
                <button type="submit" className={styles.btnPrimary} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>{mode === "login" ? "Log in" : "Create account"}</button>
              </form>
              {sent && <p className={styles.buyDisclosure}>Preview only, accounts and sign in arrive in the full build, nothing has been sent or saved</p>}
            </LoginCeremony>
          </div>
        </div>
      </section>
    </VintageRoot>
  );
}
