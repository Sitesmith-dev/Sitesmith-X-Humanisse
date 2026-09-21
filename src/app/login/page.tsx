import type { Metadata } from "next";
import { LoginArt } from "@/components/auth/LoginArt";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <LoginArt>
      <LoginForm />
    </LoginArt>
  );
}
