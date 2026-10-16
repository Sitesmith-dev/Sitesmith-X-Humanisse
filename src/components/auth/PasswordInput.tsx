"use client";
import { useState, type InputHTMLAttributes, type Ref } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import styles from "./Auth.module.css";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { ref?: Ref<HTMLInputElement> };

// Every password field in the app. The eye shows what was typed and hides it again. It only changes the input's
// type, so the text, the focus and the caret all stay where they were. Starts hidden each time it mounts
export function PasswordInput({ ref, ...props }: Props) {
  const [shown, setShown] = useState(false);
  return (
    <span className={styles.input}>
      <Lock size={18} aria-hidden="true" />
      <input {...props} ref={ref} type={shown ? "text" : "password"} autoCapitalize="off" autoCorrect="off" spellCheck={false} />
      <button
        type="button"
        className={styles.eye}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        // Keeps focus in the input when the eye is clicked or tapped
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShown((s) => !s)}
      >
        {shown ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </span>
  );
}
