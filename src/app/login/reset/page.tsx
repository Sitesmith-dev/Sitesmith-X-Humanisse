import type { Metadata } from "next";
import { LoginArt } from "@/components/auth/LoginArt";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <LoginArt>
      <ResetPasswordForm />
    </LoginArt>
  );
}
